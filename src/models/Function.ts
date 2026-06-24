import mongoose, { Schema, Document, Types } from 'mongoose';
import type { FunctionType } from '@/types';

export interface FunctionDocument extends Document {
  userId: Types.ObjectId;
  title: string;
  type: FunctionType;
  date: Date;
  venue: string;
  notes?: string;
  createdAt: Date;
}

const FunctionSchema = new Schema<FunctionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Wedding', 'HouseWarming', 'Birthday', 'TempleFestival', 'Engagement', 'Other'],
      required: true,
    },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const FunctionModel =
  mongoose.models.Function || mongoose.model<FunctionDocument>('Function', FunctionSchema);
