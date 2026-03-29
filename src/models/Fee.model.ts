import mongoose, { Schema, model, Document, Types } from "mongoose";


export interface Fee extends Document {
    student: string;
    month: number;
    year: number;
    amount: number;
    roomRent: number;
    messFee: number;
    status: 'paid' | 'unpaid';
    paidAmount: number | null;
    paidDate?: string | null;
    dueDate: string;
}

const FeeSchema: Schema<Fee> = new Schema({
    student: {
        type: String,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    roomRent: {
        type: Number,
        required: true,
    },
    messFee: {
        type: Number,
        required: true,
        default: 5000,
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
        required: true,
    },
    paidAmount: {
        type: Number || null,
        default: null
    },
    paidDate: {
        type: String || null,
        default: null
    },
    dueDate: {
        type: String,
        required: true,
    },
}, { timestamps: true });


export const FeeModel = (mongoose.models.Fee) || model<Fee>('Fee', FeeSchema);