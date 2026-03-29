
import { NewRoom } from "@/app/dashboard/a/rooms/page";
import dbConnect from "@/connection/dbconnect";
import { RoomModel } from "@/models/Room.model";

export async function POST(request: Request) {
  const data: NewRoom = await request.json();

  try {
    await dbConnect();

    const doesExist = await RoomModel.findOne({ number: data.number})

    if (doesExist) {
        return Response.json({
            success: false,
            message: 'Room already exists'
        }, {status: 403})
    }
    
    const response = await RoomModel.create({
        number: data.number,
        type: data.type,
        capacity: data.capacity,
        price: data.price,
        status: data.status,
        floor: data.floor,
        occupants: data.occupants
    })

    return Response.json(
      { success: true, message: "Room created Successfully", data: response},
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}