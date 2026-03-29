import dbConnect from "@/connection/dbconnect";
import { RoomModel } from "@/models/Room.model";
import SignupModel from "@/models/Signup.model";
import { StudentModel } from "@/models/StudentSignup.model";
import { NextResponse } from "next/server"; // Standard Next.js response helper

export async function GET() {
  try {
    await dbConnect();

    const response = await StudentModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { 
        $unwind: "$userDetails" 
      },
      {
        $lookup: {
          from: "rooms",
          localField: "room",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      { 
        $unwind: "$roomDetails" 
      },
      {
        $project: {
          _id: 1,
          name: "$userDetails.fullName",
          status: "$isActive",
          roomNumber: "$roomDetails.number",
        },
      },
    ]);

    return NextResponse.json(
      { success: true, students: response }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching students:", error);
    
    return NextResponse.json(
      { success: false, message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
