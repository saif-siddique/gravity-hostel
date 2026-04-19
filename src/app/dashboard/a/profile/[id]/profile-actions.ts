"use server";

import mongoose from "mongoose";
import dbConnect from "@/connection/dbconnect";
import { RoomModel } from "@/models/Room.model";
import { StudentModel } from "@/models/StudentSignup.model";
import SignupModel from "@/models/Signup.model";

export async function updateStudentProfile(
  studentId: string,
  data: {
    fullName: string;
    email: string;
    cnic: string;
    phone: string;
    address: string;
    guardianName: string;
    guardianPhone: string;
  }
) {
  try {
    await dbConnect();
    
    // 1. Find the student
    const studentInfo = await StudentModel.findById(studentId);
    if (!studentInfo) {
      return { success: false, message: "Student profile not found" };
    }

    // 2. Update Student specifics
    studentInfo.cnic = data.cnic;
    studentInfo.phone = data.phone;
    studentInfo.address = data.address;
    studentInfo.guardian = {
      name: data.guardianName,
      phone: data.guardianPhone,
    };
    await studentInfo.save();

    // 3. Update User generic credentials
    if (studentInfo.user) {
      await SignupModel.findByIdAndUpdate(studentInfo.user, {
        fullName: data.fullName,
        email: data.email,
      });
    }

    return { success: true, message: "Profile updated safely!" };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, message: error.message || "Failed to update profile" };
  }
}

export async function deleteStudentProfile(studentId: string) {
  try {
    await dbConnect();
    
    const studentInfo = await StudentModel.findById(studentId);
    if (!studentInfo) {
      return { success: false, message: "Student profile not found" };
    }

    // 1. Remove from Room
    if (studentInfo.room) {
      const parentRoom = await RoomModel.findById(studentInfo.room);
      if (parentRoom) {
        parentRoom.occupants = parentRoom.occupants.filter(
          (o: any) => o.toString() !== studentId
        );
        if (parentRoom.occupants.length < parentRoom.capacity) {
          parentRoom.status = 'available';
        }
        await parentRoom.save();
      }
    }

    // 2. Hard Delete User profile allowing same email signup later if needed.
    if (studentInfo.user) {
      await SignupModel.findByIdAndDelete(studentInfo.user);
    }

    // 3. Hard Delete Student model
    await StudentModel.findByIdAndDelete(studentId);

    return { success: true, message: "Student securely removed from system and rooms!" };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { success: false, message: error.message || "Failed to delete profile" };
  }
}
