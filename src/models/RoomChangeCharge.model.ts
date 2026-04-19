import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface RoomChangeCharge extends Document {
    student: Types.ObjectId;
    oldRoom: Types.ObjectId;
    newRoom: Types.ObjectId;
    chargeAmount: number;
    isWaived: boolean;
    status: 'paid' | 'unpaid';
}

const RoomChangeChargeSchema: Schema<RoomChangeCharge> = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    oldRoom: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    newRoom: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    chargeAmount: {
        type: Number,
        default: 1500,
        required: true,
    },
    isWaived: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    }
}, { timestamps: true });

export const RoomChangeChargeModel = (mongoose.models.RoomChangeCharge) || model<RoomChangeCharge>('RoomChangeCharge', RoomChangeChargeSchema);
