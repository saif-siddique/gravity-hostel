import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();

        const hasAdmin = cookieStore.has("isAdmin");
        const hasRole = cookieStore.has("userRole");

        if (!hasAdmin && !hasRole) {
            return NextResponse.json({
                success: false,
                message: "No active session found"
            }, { status: 400 });
        }
        cookieStore.delete("isAdmin");
        cookieStore.delete("userRole");

        return NextResponse.json({
            success: true,
            message: "Successfully Logged out"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}