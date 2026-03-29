import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface Attendence extends Document {
  student: string;
  room: string;
  date: string;
  name: string;
  status: boolean;
}

const AttendenceSchema: Schema<Attendence> = new Schema(
  {
    student: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  }, { timestamps: true}
);

export const AttendenceModel =
  mongoose.models.Attendence ||
  model<Attendence>("Attendence", AttendenceSchema);
