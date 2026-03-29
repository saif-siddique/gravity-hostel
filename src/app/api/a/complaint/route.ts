
import dbConnect from "@/connection/dbconnect";
import { StudentModel } from "@/models/StudentSignup.model";
import "@/models/Signup.model";
import "@/models/Room.model";
import { ComplaintModel } from "@/models/Complaint.model";

export async function GET() {
  try {
    await dbConnect();

    const response = await ComplaintModel.find({})
        .populate("student", 'phone')
    
    const dataToSend = response.map((e: any) => {
        return {
            id : e._id,
            title: e.title,
            number: e.student.phone,
            date: e.createdAt,
            description: e.description,
            status: e.status,
        }
    })
    if (!response || !response.length) {
      return Response.json(
        { success: false, message: "No Complaint found" },
        { status: 404 },
      );
    }
    return Response.json(
      { success: true, message: "Data found", data: dataToSend },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}


export async function POST(request: Request) {
  const{ _id, status } = await request.json();

  try {
    await dbConnect();

    const response = await ComplaintModel.findOneAndUpdate({ _id: _id}, { status: status})
    
    if (!response) {
      return Response.json(
        { success: false, message: "Cannot update" },
        { status: 500 },
      );
    }
    return Response.json(
      { success: true, message: "Data found", data: response},
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}