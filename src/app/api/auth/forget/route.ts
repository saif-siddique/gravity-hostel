import dbConnect from "@/connection/dbconnect";
import SignupModel from "@/models/Signup.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: Response) {
    try {
        await dbConnect();
        const data = await req.nextUrl.searchParams;
        const email = data.get("email");
        const result = await SignupModel.findOne({ email });

        if (!result) {
            return Response.json(
                {
                    success: false,
                    message: "User with this email doesn't exists.",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User with this email found.",
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong.",
            },
            { status: 400 }
        );
    }
}
