import dbConnect from "@/connection/dbconnect";
import SignupModel from "@/models/Signup.model";

export async function POST (request: Request, response: Response) {
    await dbConnect();
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Missing Credientials",
                },
                { status: 400 }
            );
        }
        const result = await SignupModel.findOneAndUpdate({email}, {password: password})

        if (!result) {
            return Response.json(
                {
                    success: false,
                    message: "Unable to change password",
                },
                { status: 500 }
            );
        }

        return Response.json(
                {
                    success: true,
                    message: "Password changed successfully",
                },
                { status: 200 }
            );
    } catch (error) {
        return Response.json(
                {
                    success: false,
                    message: "Something went wrong",
                },
                { status: 500 }
            );
    }
}