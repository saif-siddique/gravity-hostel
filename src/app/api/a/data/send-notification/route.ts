import { NextResponse } from "next/server";
import dbConnect from "@/connection/dbconnect"; 

import { NotificationModel } from "@/models/Notification.model";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, message, studentId } = data;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "Title and message are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const target = studentId ? 'specific' : 'all';

    const newNotification = await NotificationModel.create({
      title,
      message,
      studentId: studentId || null,
      target
    });

    return NextResponse.json(
      { success: true, message: "Notification sent successfully.", data: newNotification },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Notification API Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while sending notification." },
      { status: 500 }
    );
  }
}