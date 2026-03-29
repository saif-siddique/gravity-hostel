import dbConnect from "@/connection/dbconnect";
import { StudentModel } from "@/models/StudentSignup.model";
import { ObjectId } from "mongoose";

type StudentData = {
    _id: ObjectId;
    user: {
        fullName: string
    };
    room: {
        number: string
    }
}

export async function GET() {
  try {
    await dbConnect();

    const students: StudentData[] = await StudentModel.find({}, { _id: 1, room: 1, user: 1 })
      .populate("user", "fullName -_id")
      .populate("room", "number -_id")
      .lean<StudentData[]>();

    const flatStudents = students.map((s) => ({
      _id: s._id,
      fullName: s.user?.fullName,
      roomNumber: s.room?.number,
    }));

    if (!students || !students.length) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Users found", data: flatStudents },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Unexpected Error occured" },
      { status: 500 },
    );
  }
}
