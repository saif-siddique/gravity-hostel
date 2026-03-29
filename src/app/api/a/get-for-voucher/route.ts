import dbConnect from "@/connection/dbconnect";
import { StudentModel } from "@/models/StudentSignup.model";
import "@/models/Signup.model";
import "@/models/Room.model";

export async function GET() {
  try {
    await dbConnect();

    const response = await StudentModel.find(
      {},
      { _id: 1, student: 1, room: 1 },
    )
      .populate("user", "fullName")
      .populate("room", "type number")
      .lean();

    const dataToSend = response.map((e: any) => {
      return {
        _id: e._id,
        name: e.user.fullName,
        roomType: e.room.type,
        room: e.room.number,
      };
    });

    if (!response || !response.length) {
      return Response.json(
        { success: false, message: "No user data found" },
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
