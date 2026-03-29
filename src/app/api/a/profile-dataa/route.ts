import { StudentModel } from "@/models/StudentSignup.model";
import mongoose from "mongoose";
import '@/models/Room.model'
import '@/models/Signup.model'
import dbConnect from "@/connection/dbconnect";


export async function POST(request: Request) {
  const { _id } = await request.json();

  try {
    await dbConnect();

    if (!_id) {
      return Response.json(
        { success: false, message: "Id not found" },
        { status: 404 },
      );
    }

    const objectId = new mongoose.Types.ObjectId(_id);

    const res: any = await StudentModel.find({ _id: objectId }).populate("user").populate("room")

    if (!res.length) {
      return Response.json(
        { success: false, message: "No data found" },
        { status: 404 },
      );
    }

    const response = res[0]

    const refine = {
        fullName: response.user.fullName,
        email: response.user.email,
        cnic: response.cnic,
        phone: response.phone,
        address: response.address,
        enrollmentDate: response.enrollmentDate,
        isActive: true,
        guardian: {
            name: response.guardian.name,
            phone: response.guardian.phone,
        },
        room: {
            number: response.room.number,
            type: response.room.type,
            price: response.room.price,
            floor: response.room.floor,
            status: response.room.status,
        },
    }

    return Response.json(
      { success: true, message: "Data Fetched Successfully", data: refine },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
