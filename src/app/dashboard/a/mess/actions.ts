"use server";

import { MessModel } from "@/models/Mess.model";
import { revalidatePath } from "next/cache";
import dbConnect from "@/connection/dbconnect";

export async function updateMessDetail(payload: any) {
    try {
        const { day, morning, afternoon, evening } = payload;

        if (!day || !morning || !afternoon || !evening) {
            return { success: false, message: "Missing required fields" };
        }
        
        await dbConnect();
        
        // Update document safely by the unique "day" text instead of _id arrays
        await MessModel.findOneAndUpdate({ day }, { morning, afternoon, evening }, { upsert: true });

        // Update caches for both admin and student views
        revalidatePath("/dashboard/a/mess");
        revalidatePath("/dashboard/s/mess");
        
        return { success: true, message: "Mess menu successfully updated!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Something went wrong" };
    }
}
