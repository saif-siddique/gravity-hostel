import dbConnect from "@/connection/dbconnect";
import { FeeModel } from "@/models/Fee.model";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // 1. Basic Validation
    if (!Array.isArray(body) || body.length === 0) {
      return Response.json(
        { success: false, message: "Invalid payload. Expected an array of vouchers." },
        { status: 400 }
      );
    }

    // 2. Safety Check: Filter out duplicates
    // We check if any of these students ALREADY have a voucher for this specific month/year
    // just in case the frontend list was stale.
    const month = body[0].month;
    const year = body[0].year;
    
    // Get all student IDs from the incoming request
    const incomingStudentIds = body.map((v: any) => v.student);

    // Check DB for existing vouchers for these students in this month
    const existingVouchers = await FeeModel.find({
        month: month,
        year: year,
        student: { $in: incomingStudentIds }
    }).select("student");

    const existingStudentIds = existingVouchers.map((v: any) => v.student.toString());

    // Keep only the vouchers where the student ID is NOT in the existing list
    const finalVouchersToInsert = body.filter((v: any) => !existingStudentIds.includes(v.student));

    if (finalVouchersToInsert.length === 0) {
        return Response.json(
            { success: false, message: "All selected students already have vouchers for this month." },
            { status: 409 }
        );
    }
    
    const result = await FeeModel.insertMany(finalVouchersToInsert);

    return Response.json(
      {
        success: true,
        message: `Successfully generated ${result.length} vouchers.`,
        skipped: body.length - finalVouchersToInsert.length,
        data: result,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Bulk Voucher Error:", error);
    return Response.json(
      { success: false, message: "Server error during bulk assignment" },
      { status: 500 }
    );
  }
}