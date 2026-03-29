import mongoose, { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  target: 'all' | 'specific';
  studentId?: string;
}

const NotificationSchema = new Schema<INotification>({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  target: {
    type: String,
    enum: ['all', 'specific'],
    required: true
  },
  studentId: {
    type: String,
    required: false
  }
}, { timestamps: true });

export const NotificationModel = mongoose.models.Notification || model<INotification>('Notification', NotificationSchema);