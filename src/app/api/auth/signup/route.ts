import dbConnect from "@/connection/dbconnect";
import UserModel from "@/models/Signup.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { fullName, email, password } = await request.json();

  if (!fullName || !email || !password)
    return NextResponse.json(
      { success: false, message: "Credientials are missing" },
      { status: 400 },
    );

  try {
    await dbConnect();

    const user = await UserModel.findOne({ email });

    if (user)
      return NextResponse.json(
        { success: false, message: "User already exists please Login" },
        { status: 400 },
      );

    const response = await UserModel.create({ fullName, email, password });

    if (!response)
      return NextResponse.json(
        { success: false, message: "Unable to create user" },
        { status: 500 },
      );

    const res = NextResponse.json(
      { success: true, message: "User created Successfully, Please login." },
      { status: 200 },
    );

    // cuted jwt from here I will add it later

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unexpected error occured" },
      { status: 500 },
    );
  }
}
