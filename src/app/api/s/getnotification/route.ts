import dbConnect from "@/connection/dbconnect";
import { NotificationModel } from "@/models/Notification.model";
import { StudentModel } from "@/models/StudentSignup.model";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const { _id } = await request.json();

  if (!_id) {
    return Response.json(
      { success: false, message: "User Id not found" },
      { status: 404 },
    );
  }

  try {
    await dbConnect();

    const studentId = await StudentModel.findOne({ user: _id }, { _id: 1 });

    if (!studentId)
      return Response.json(
        {
          success: false,
          message: "User Not found",
        },
        { status: 404 },
      );

    const extracted = studentId._id.toString() // studentId.toString() This was challenging now resolved

    const response = await NotificationModel.aggregate([
      {
        $match: {
          $or: [
            {
              target: "all",
            },
            {
              studentId: extracted,
            },
          ],
        },
      },
    ]);

    if (!response || !response.length) {
      return Response.json(
        {
          success: false,
          message: "Notification not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Notification found successfully",
        data: response,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
