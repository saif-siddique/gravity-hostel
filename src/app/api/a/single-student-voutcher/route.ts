import { NextRequest, NextResponse } from "next/server";
import { Fee, FeeModel } from "@/models/Fee.model";

export async function POST(request: NextRequest) {
  const data: Fee = await request.json();

  if (!data) {
    return NextResponse.json(
      { success: false, message: "Data is missing" },
      { status: 400 },
    ); 
  }

  const response = await FeeModel.insertOne(data)

  
  return NextResponse.json(
    { success: true, message: "Voucher created Successfully", data: response },
    { status: 200 },
  );
}
