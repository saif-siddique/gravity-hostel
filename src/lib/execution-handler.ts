import dbConnect from "@/connection/dbconnect";
import { AttendenceModel } from "@/models/Attendence.model";
import { ComplaintModel } from "@/models/Complaint.model";
import { FeeModel } from "@/models/Fee.model";
import { NotificationModel } from "@/models/Notification.model";
import { RoomModel } from "@/models/Room.model";
import { StudentModel } from "@/models/StudentSignup.model";
import mongoose from "mongoose";

export interface ArgsInterface {
  id: string;
  qfor: "room" | "fee" | "complaint" | "notification" | "attendance" | "user";
}
export async function executionHandler({ id, qfor }: ArgsInterface) {
  await dbConnect();
  try {
    if (!id) {
      return {
        success: false,
        message: "Id is not defined",
      };
    }

    const studentId = await StudentModel.findOne(
      { user: id },
      { _id: 1 },
    ).lean();
    
    if (!studentId) {
      return {
        success: false,
        message: "Student nothing found",
      };
    }
    
    const stringId = studentId._id.toString();
    console.log("Id: ", stringId, "Qfor: ", qfor);
    let response;

    switch (qfor) {
      case "user":
        response = await StudentModel.find({ _id: new mongoose.Types.ObjectId(stringId)})
          .populate({path: 'user', select: '-password'})
        console.log("ya gaya user sy: ", response)
        break;
      case "room":
        response = await RoomModel.find({ occupants: { $in: [studentId] } });
        break;
      case "complaint":
        response = await ComplaintModel.find({ student: studentId });
        break;
      case "attendance":
        response = await AttendenceModel.find({ student: stringId });
        break;
      case "fee":
        response = await FeeModel.find({ student: stringId });
        break;
      case "notification":
        console.log("Ma aya yahaan pr")
        response = await NotificationModel.find({
          $or: [
            {
              studentId: null,
            },
            {
              studentId: stringId,
            },
          ],
        });
        console.log("YaData: ", response)
        break;

      default:
        response = [
          {
            error: "Something went wrong while sending qfor.",
          },
        ];
        break;
    }

    if (!response || response.length === 0) {
      return {
        success: false,
        message: "Nothing found",
      };
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "something went wrong.",
    };
  }
}
