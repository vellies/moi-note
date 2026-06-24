export type UserRole = 'admin' | 'user';

export type FunctionType =
  | 'Wedding'
  | 'HouseWarming'
  | 'Birthday'
  | 'TempleFestival'
  | 'Engagement'
  | 'Other';

export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Cheque';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface IFunction {
  _id: string;
  userId: string;
  title: string;
  type: FunctionType;
  date: string;
  venue: string;
  notes?: string;
  createdAt: string;
  totalAmount?: number;
  entryCount?: number;
}

export interface IMoiEntry {
  _id: string;
  functionId: string;
  userId: string;
  contributorName: string;
  place: string;
  mobileNumber?: string;
  amount: number;
  paymentMode: PaymentMode;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalFunctions: number;
  totalCollected: number;
  recentEntries: IMoiEntry[];
}
