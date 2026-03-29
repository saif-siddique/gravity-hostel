import { formSchema } from "@/app/(public)/home/contact/page";
import mongoose, { model, Schema } from "mongoose";

const PublicQuestionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    }
})

export const PublicQuestionModel = (mongoose.models.Publicquestion) || model('Publicquestion', PublicQuestionSchema)