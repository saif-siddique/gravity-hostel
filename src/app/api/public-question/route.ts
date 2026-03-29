import dbConnect from "@/connection/dbconnect";
import { PublicQuestionModel } from "@/models/PublicQuestion";
import { success } from "zod";


export async function POST(request:Request) {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !phone || !message) {
        return Response.json({
            success: false,
            message: "Missing Credientials"
        }, {status: 400})
    }

    try {
        await dbConnect();

        const response = await PublicQuestionModel.create({
            name,
            email,
            phone,
            message
        })

        if (!response) {
            return Response.json({
            success: false,
            message: "Unable to send message"
        }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, {status: 200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {status: 500})
    }
}