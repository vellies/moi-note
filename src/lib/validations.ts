import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const functionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  type: z.enum(['Wedding', 'HouseWarming', 'Birthday', 'TempleFestival', 'Engagement', 'Other']),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(2, 'Venue must be at least 2 characters'),
  notes: z.string().optional(),
});

export const moiEntrySchema = z.object({
  contributorName: z.string().min(2, 'Name must be at least 2 characters'),
  place: z.string().min(1, 'Place is required'),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
    .optional()
    .or(z.literal('')),
  amount: z.coerce.number().positive('Amount must be positive'),
  paymentMode: z.enum(['Cash', 'UPI', 'Card', 'Cheque']),
  notes: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FunctionInput = z.infer<typeof functionSchema>;
export type MoiEntryInput = z.infer<typeof moiEntrySchema>;
