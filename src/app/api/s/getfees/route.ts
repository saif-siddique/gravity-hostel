import dbConnect from "@/connection/dbconnect";
import { FeeModel } from "@/models/Fee.model";
import { StudentModel } from "@/models/StudentSignup.model";


export async function POST(request:Request) {
    const { _id } = await request.json();

    if (!_id) {
        return Response.json({
            success: false,
            message: "Cannot found user id!"
        }, {status: 404})
    }
    try {
        await dbConnect();
        
        const studentId = await StudentModel.findOne({user: _id}, {_id: 1})

        const stringId = studentId?._id.toString()
        const response = await FeeModel.find({ student: stringId}, { createdAt: 1, dueDate: 1, roomRent: 1, messFee: 1, amount: 1, month: 1, year: 1, status: 1})

        if (!response.length) {
            return Response.json({
            success: false,
            message: "No Voucher for this user found"
        }, {status: 404})
        }

        return Response.json({
            success: true,
            message: "Voucher found", 
            data: response
        }, {status: 200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}   