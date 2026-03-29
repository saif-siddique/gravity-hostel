import dbConnect from "@/connection/dbconnect"
import { AttendenceModel } from "@/models/Attendence.model";
import { StudentModel } from "@/models/StudentSignup.model";
import { success } from "zod";

export async function POST(request:Request) {
    const { _id } = await request.json()
    
    if (!_id) return Response.json({
        success: false,
        message: "Unable to find id"
    }, { status: 400})

    try {
        await dbConnect();

        //  First bring id from student 

        const studentId = await StudentModel.findOne({user: _id}, {_id: 1})

        if (!studentId) return Response.json({
            success: false,
            message: "User Not found"
        }, {status: 404})

        const response = await AttendenceModel.find({student: studentId?._id}, {date: 1, status: 1, updatedAt: 1})

        if (!response || !response.length) return Response.json({
        success: false,
        message: "User with this id not found"
        }, { status: 404})
        
        return Response.json({
        success: true,
        message: "Attendance Fetched Successfully",
        data: response
    }, { status: 200})
    } catch (error) {
        return Response.json({
        success: false,
        message: "Internal server error"
    }, { status: 500})
    }
}