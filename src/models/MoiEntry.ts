import mongoose, { Schema, Document, Types } from 'mongoose';
import type { PaymentMode, MoiStatus } from '@/types';

export interface MoiEntryDocument extends Document {
  functionId: Types.ObjectId;
  userId: Types.ObjectId;
  contributorName: string;
  place: string;
  mobileNumber?: string;
  amount: number;
  paymentMode: PaymentMode;
  notes?: string;
  status: MoiStatus;
  createdAt: Date;
  deletedAt?: Date;
}

const MoiEntrySchema = new Schema<MoiEntryDocument>(
  {
    functionId: { type: Schema.Types.ObjectId, ref: 'Function', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contributorName: { type: String, required: true, trim: true },
    place: { type: String, required: true, trim: true },
    mobileNumber: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMode: { type: String, enum: ['Cash', 'UPI', 'Card', 'Cheque'], required: true },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'repaid'], default: 'pending' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const MoiEntry =
  mongoose.models.MoiEntry || mongoose.model<MoiEntryDocument>('MoiEntry', MoiEntrySchema);
