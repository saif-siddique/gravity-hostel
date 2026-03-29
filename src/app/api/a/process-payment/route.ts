import { FeeModel } from "@/models/Fee.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { voucherId, amount } = await request.json();

    if (!voucherId || !amount) {
      return NextResponse.json(
        { success: false, message: "Voucher ID is required" },
        { status: 400 }
      );
    }

    const updatedVoucher = await FeeModel.findByIdAndUpdate(
      voucherId,
      {
        $set: {
          status: "paid",
          paidAmount: amount,
          paidDate: new Date(),
        },
      },
      { new: true } 
    );

    if (!updatedVoucher) {
      return NextResponse.json(
        { success: false, message: "Voucher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      data: updatedVoucher,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}