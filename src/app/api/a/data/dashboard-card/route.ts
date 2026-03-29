import dbConnect from "@/connection/dbconnect";
import { ComplaintModel } from "@/models/Complaint.model";
import { FeeModel } from "@/models/Fee.model";
import { RoomModel } from "@/models/Room.model";
import { StudentModel } from "@/models/StudentSignup.model";

export async function GET() {
  try {
    await dbConnect();
    const totalAmount = await FeeModel.find({ status: "paid" }, {paidAmount: 1});
    const totalStudent = await StudentModel.find({ isActive: true });
    const toatlSeet = await RoomModel.aggregate([
        {
            $addFields: {
                availableSeats: { $subtract: ["$capacity", { $size: "$occupants" }] },
            },
        },
      {
          $match: { availableSeats: { $gt: 0 } },
        },
    ]);
    const totalComplaints = await ComplaintModel.find({ status: "PENDING" });
    
    let lakshmi = 0
    totalAmount.map((e) => {
        lakshmi += e.paidAmount;
    })
    
    const response = {
        amount: lakshmi,
        seat: toatlSeet.length,
        student: totalStudent.length,
        complaint: totalComplaints.length
    };
    
    return Response.json({ success: true, message: "Fetched", data: response }, {status: 200});
} catch (error) {
     return Response.json({success: false, message: "Something went wrong"}, {status: 500})
}
}
