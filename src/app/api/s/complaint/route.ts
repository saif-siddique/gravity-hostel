import dbConnect from "@/connection/dbconnect";
import { ComplaintModel } from "@/models/Complaint.model";
import { StudentModel } from "@/models/StudentSignup.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const _id = searchParams.get("_id");

  if (!_id) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const student = await StudentModel.findOne({ user: _id }, { _id: 1 });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "User Not found" },
        { status: 404 }
      );
    }

    const complaints = await ComplaintModel.find({ student: student._id }, {_id: 1, title: 1, description: 1, status: 1, updatedAt: 1});

    if (!complaints || complaints.length === 0) {
      return NextResponse.json(
        { success: false, message: "No complaints found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Complaints fetched successfully",
        data: complaints,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Complaint Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
    const { title, description, _id} = await request.json();

    if (!_id || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    } 
    
  try {
    await dbConnect();

    const student = await StudentModel.findOne({ user: _id }, { _id: 1 });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "User Not found" },
        { status: 404 }
      );
    }

    // 3. Create the Complaint
    const newComplaint = await ComplaintModel.create({
      student: student._id, 
      title,
      description
    });

    return NextResponse.json(
      {
        success: true,
        message: "Complaint submitted successfully",
        data: newComplaint,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Complaint Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}