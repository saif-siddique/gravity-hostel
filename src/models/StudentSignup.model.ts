import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface IStudent extends Document {
  user: Types.ObjectId;      
  cnic: string;
  phone: string;
  address: string;
  guardian: {
    name: string;
    phone: string;
  };
  room: Types.ObjectId;      
  isActive: boolean;
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true, 
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    guardian: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room", 
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);

export const StudentModel =
  (mongoose.models.Student as mongoose.Model<IStudent>) ||
  model<IStudent>("Student", StudentSchema);