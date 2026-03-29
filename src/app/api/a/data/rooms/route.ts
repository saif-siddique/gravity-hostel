

import dbConnect from "@/connection/dbconnect";
import { RoomModel } from "@/models/Room.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const rawRooms = await RoomModel.aggregate([
      {

        $lookup: {
          from: "students",
          localField: "_id",   
          foreignField: "room", 
          as: "occupantDetails",
         pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userProfile",
              },
            },
            { $unwind: "$userProfile" },
            {
              $project: {
                name: "$userProfile.fullName",
                cnic: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,                
          id: "$number",      
          type: "$type",
          current: { $size: "$occupantDetails" }, 
          total: "$capacity",    
          price: "$price",       
          floor: { $toString: "$floor" }, 
          occupants: "$occupantDetails",
        },
      },
    ]);

    const formattedRooms = rawRooms.map((room) => ({
      ...room,
      price: `${room.price.toLocaleString()} PKR`, 
    }));

    return NextResponse.json(
      { success: true, rooms: formattedRooms },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}