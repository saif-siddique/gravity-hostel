import dbConnect from "@/connection/dbconnect";
import UserModel from "@/models/Signup.model";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const cookieStore = await cookies();

  if (!email || !password)
    return Response.json(
      { success: false, message: "Credientials are missing" },
      { status: 400 },
    );

  try {
    await dbConnect();

    const user = await UserModel.findOne(
      { email },
      { _id: 1, fullName: 1, email: 1, isAdmin: 1, password: 1 },
    );

    if (!user)
      return Response.json(
        { success: false, message: "Invalid Email or Password" },
        { status: 400 },
      );

    if (password !== user.password) {
      return Response.json(
        { success: false, message: "Invalid Password or Email" },
        { status: 400 },
      );
    }

    user.password = undefined;

    const res = Response.json(
      { success: true, message: "Login successfully", data: user },
      { status: 200 },
    );

    cookieStore.set("isAdmin", user.isAdmin, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("userRole", user.isAdmin ? "admin" : "student", {
      httpOnly: true,
      path: "/",
    });

    return res;
  } catch (error) {
    return Response.json(
      { success: false, message: "Unexpected error occured" },
      { status: 500 },
    );
  }
}
