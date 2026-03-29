import mongoose, { Schema, model, Document } from "mongoose";

export interface Signup extends Document {
    fullName: string,
    email: string,
    password: string,
    isAdmin?: boolean
}

const SignupSchema: Schema<Signup> = new Schema({
    fullName: {
        type: String,
        required: [true, 'Fullname must be provided'],
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

const SignupModel = (mongoose.models.User) || model('User', SignupSchema)

export default SignupModel;