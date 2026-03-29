import dbConnect from "@/connection/dbconnect";
import { StudentModel } from "@/models/StudentSignup.model";
import {
  StudentSignupSchema,
  StudentSignupType,
} from "@/schemas/StudentSignupSchema";
import { NextResponse } from "next/server";
import UserModel from "@/models/Signup.model";
import { RoomModel } from "@/models/Room.model";

export async function POST(request: Request) {
  const body = await request.json();

  const validating = StudentSignupSchema.safeParse(body);

  if (!validating.success)
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: validating.error.format(),
      },
      { status: 400 },
    );
  await dbConnect();

  const { studentDetail, guardianDetail, loginCredientials } = validating.data;

  const studentExist = await UserModel.findOne({
    email: studentDetail.studentEmail,
  });

  if (studentExist)
    return NextResponse.json(
      { success: false, message: "Student already exists please Login" },
      { status: 400 },
    );

  const user = await UserModel.create({
    fullName: studentDetail.studentName,
    email: studentDetail.studentEmail,
    password: loginCredientials.password,
    isAdmin: false,
  });

  if (!user)
    return NextResponse.json(
      { success: false, message: "Unable to create user" },
      { status: 500 },
    );

  const student = await StudentModel.create({
    // Here types are mismatched so ???
    user: user._id,
    cnic: studentDetail.studentcnic,
    phone: studentDetail.studentPhoneNO,
    address: guardianDetail.address,
    guardian: {
      name: guardianDetail.guardianName,
      phone: guardianDetail.guardianPhoneNO,
    },
    room: loginCredientials.roomid,
    isActive: true,
  });

  if (!student)
    return NextResponse.json(
      { success: false, message: "Unable to create student profile" },
      { status: 500 },
    );

  const updateRoom = await RoomModel.updateOne(
    { _id: loginCredientials.roomid },
    { $push: { occupants: student._id } },
  )

  if (!updateRoom)
    return NextResponse.json(
      { success: false, message: "Unable to update room occupancy" },
      { status: 500 },
    );

  return NextResponse.json(
    { success: true, message: "Validation successful" },
    { status: 200 },
  );
}
