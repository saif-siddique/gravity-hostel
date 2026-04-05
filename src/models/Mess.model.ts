import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface Mess extends Document {
  id?: string;
  day: string;
  morning: string;
  afternoon: string;
  evening: string;
}

const MessSchema: Schema<Mess> = new Schema({
    day: {
      type: String
    },
    morning: {
      type: String
    },
    afternoon: {
      type: String
    },
    evening: {
      type: String
    }
}, { timestamps: true });

export const MessModel = (mongoose.models.Mess) || model<Mess>('Mess', MessSchema);