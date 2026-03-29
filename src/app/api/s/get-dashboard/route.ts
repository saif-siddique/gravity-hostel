import { StudentModel } from "@/models/StudentSignup.model";
import { success } from "zod";


export async function POST(request:Request) {
    const { _id } = await request.json();

    if (!_id) {
        return Response.json({
            success: false,
            message: "User id not found"
        }, {status: 404})
    }

    try {

        const response = await StudentModel.find({user : _id})
            .populate("user", "fullName email ")
        
        const data: any = response[0]
        
        const dataToSend = {
            _id: data._id._id.toString(),
            name: data.user.fullName,
            email: data.user.email,
            phone: data.phone,
            cnic: data.cnic,
            address: data.address,
            fname: data.guardian.name,
            fphone: data.guardian.phone
        }
        
        if (!response.length) {
            return Response.json({
            success: false,
            message: "Nothing found"
        }, {status: 404})
        }

        return Response.json({
            success: true,
            message: "Data fectched",
            data: dataToSend
        }, {status: 200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Somethign went wrong"
        }, {status: 500})
    }
}