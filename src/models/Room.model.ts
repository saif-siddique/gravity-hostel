import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface Room extends Document {
    number: string,
    type: 'standard' | 'deluxe' | 'suite',
    capacity: number,
    price: number,
    status: 'available' | 'occupied' | 'maintenance',
    floor: number,
    occupants: Types.ObjectId[]
}

const RoomSchema: Schema<Room> = new Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['standard', 'deluxe', 'suite'],
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        max: 3
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    occupants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, { timestamps: true })


export const RoomModel = (mongoose.models.Room) || model<Room>('Room', RoomSchema);