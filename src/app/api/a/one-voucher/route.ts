import dbConnect from "@/connection/dbconnect";
import { FeeModel } from "@/models/Fee.model";
import { StudentModel } from "@/models/StudentSignup.model";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { student, month, year, roomRent, messFee, amount, dueDate, status } = body;

    // 1. Basic Validation
    if (!student || !month || !year || !amount) {
      return Response.json(
        { success: false, message: "Missing required fields (student, month, year, amount)" },
        { status: 400 }
      );
    }

    const existingVoucher = await FeeModel.findOne({
      student: student,
      month: month,
      year: year,
    });

    if (existingVoucher) {
      return Response.json(
        { success: false, message: "Voucher already exists for this month" },
        { status: 409 } 
      );
    }

    const newVoucher = await FeeModel.create({
      student,
      month,
      year,
      roomRent,
      messFee,
      amount,
      dueDate,
      status: status || "unpaid", // Default to unpaid if not sent
    });

    return Response.json(
      {
        success: true,
        message: "Voucher generated successfully",
        data: newVoucher,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Single Voucher Error:", error);
    return Response.json(
      { success: false, message: "Server error while generating voucher" },
      { status: 500 }
    );
  }
}