import dbConnect from "@/connection/dbconnect";
import { RoomModel } from "@/models/Room.model";

type RoomType = "standard" | "deluxe" | "suite";
const roomsType = { standard: 3, deluxe: 2, suite: 1 };

export async function POST(request: Request) {
  const { type } = (await request.json()) as { type: RoomType };

  if (!type)
    return Response.json(
      { success: false, message: "Type is required" },
      { status: 400 },
    );

  await dbConnect();
  try {
    const result = await RoomModel.aggregate([
      {
        $match: {
          type: type.toString(),
          $expr: {
            $lt: [{ $size: "$occupants" }, roomsType[type]],
          },
        },
      },
      {
        $project: {
          _id: 1, // Now we need id
          number: 1,
        },
      },
    ]);


    if (!result.length) {
      return Response.json(
        { success: false, message: "No rooms found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, rooms: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
