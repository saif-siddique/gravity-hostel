import dbConnect from "@/connection/dbconnect";
import { AttendenceModel } from "@/models/Attendence.model";
import { StudentModel } from "@/models/StudentSignup.model";
import "@/models/Signup.model";
import "@/models/Room.model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryDate = searchParams.get('date');

  await dbConnect();
  try {
    const students = await StudentModel.find({}, { _id: 1, user: 1, room: 1 })
      .populate("user", "fullName -_id")
      .populate("room", "number -_id")
      .lean();

    if (!students || students.length === 0) {
      return Response.json({ success: false, message: "No students found" }, { status: 404 });
    }

    const studentIds = students.map((s) => s._id);
    const attendanceRecords = await AttendenceModel.find({
      student: { $in: studentIds }, 
      date: queryDate 
    }).lean();

    const mergedData = students.map((student) => {
      const record = attendanceRecords.find(
        (att) => att.student.toString() === student._id.toString()
      );
      return {
        ...student,
        attendance: record ? record.status : null,
      };
    });

    return Response.json({ success: true, data: mergedData }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    const operations = body.map((record: any) => ({
      updateOne: {
        filter: { student: record._id, date: record.date },
        update: {
          $set: {
            student: record._id,
            date: record.date,
            room: record.room.number,
            name: record.user.fullName,
            status: record.present,
          }
        },
        upsert: true
      }
    }));

    const result = await AttendenceModel.bulkWrite(operations);

    return Response.json({ 
      success: true, 
      message: "Attendance recorded successfully",
      details: result 
    }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}