"use server";

import mongoose from "mongoose";
import dbConnect from "@/connection/dbconnect";
import { RoomModel } from "@/models/Room.model";
import { StudentModel } from "@/models/StudentSignup.model";
import SignupModel from "@/models/Signup.model";
import { RoomChangeChargeModel } from "@/models/RoomChangeCharge.model";
import { revalidatePath } from "next/cache";

// Workaround to ensure mongoose models are registered before populating
const ensureModels = () => {
    RoomModel;
    StudentModel;
    SignupModel;
    RoomChangeChargeModel;
}

export async function getChangeRoomData() {
    try {
        await dbConnect();
        ensureModels();

        // Fetch students actively assigned to a room
        const rawStudents = await StudentModel.find({ isActive: true })
            .populate('user', 'fullName email')
            .populate('room', 'number type')
            .lean();

        // Serialize safely
        const students = rawStudents.map((s: any) => ({
            id: s._id.toString(),
            name: s.user?.fullName || "Unknown",
            cnic: s.cnic,
            currentRoomId: s.room?._id?.toString(),
            currentRoomNumber: s.room?.number || "None",
            currentRoomType: s.room?.type || "",
            currentRoomPrice: s.room?.price || 0,
        }));

        // Fetch all rooms
        const rawRooms = await RoomModel.find({ status: { $ne: 'maintenance' } }).lean();
        
        // Filter empty/eligible rooms via code
        const rooms = rawRooms
            .filter((r: any) => (r.occupants?.length || 0) < r.capacity)
            .map((r: any) => ({
                id: r._id.toString(),
                number: r.number,
                type: r.type,
                capacity: r.capacity,
                price: r.price,
                occupied: r.occupants?.length || 0
            }));

        return { success: true, students, rooms };
    } catch (error: any) {
        console.error("ChangeRoom fetch error:", error);
        return { success: false, message: error.message };
    }
}

export async function executeRoomChange(payload: { 
    studentId: string, 
    oldRoomId: string, 
    newRoomId: string, 
    applyCharge: boolean 
}) {
    // We execute a transaction if possible, or sequential operations
    try {
        await dbConnect();
        const { studentId, oldRoomId, newRoomId, applyCharge } = payload;

        if (oldRoomId === newRoomId) {
            return { success: false, message: "Student is already in this room." };
        }

        const student = await StudentModel.findById(studentId);
        if (!student) throw new Error("Student not found");

        const oldRoom = await RoomModel.findById(oldRoomId);
        const newRoom = await RoomModel.findById(newRoomId);
        
        if (!newRoom || !oldRoom) throw new Error("Rooms not found");

        if (newRoom.occupants.length >= newRoom.capacity) {
            return { success: false, message: "New room is fully occupied!" };
        }

        // 1. Remove from old room
        oldRoom.occupants = oldRoom.occupants.filter((o: any) => o.toString() !== studentId);
        if (oldRoom.occupants.length < oldRoom.capacity) {
            oldRoom.status = 'available';
        }
        await oldRoom.save();

        // 2. Add to new room
        newRoom.occupants.push(new mongoose.Types.ObjectId(studentId));
        if (newRoom.occupants.length >= newRoom.capacity) {
            newRoom.status = 'occupied';
        }
        await newRoom.save();

        // 3. Update student mapping
        student.room = new mongoose.Types.ObjectId(newRoomId);
        await student.save();

        // 4. Handle dynamic fee adjustments based on the Room's rent
        const priceDifference = (newRoom.price || 0) - (oldRoom.price || 0);

        const chargeDoc = new RoomChangeChargeModel({
            student: new mongoose.Types.ObjectId(studentId),
            oldRoom: new mongoose.Types.ObjectId(oldRoomId),
            newRoom: new mongoose.Types.ObjectId(newRoomId),
            chargeAmount: priceDifference,
            isWaived: !applyCharge,
            status: applyCharge ? 'unpaid' : 'paid',
        });
        await chargeDoc.save();

        revalidatePath("/dashboard/a/rooms");
        revalidatePath("/dashboard/s/profile"); // Just in case student caching is cleared

        return { success: true, message: "Room assigned successfully!" };

    } catch (error: any) {
        console.error("ChangeRoom transaction error:", error);
        return { success: false, message: "Failed to change room. " + error.message };
    }
}
