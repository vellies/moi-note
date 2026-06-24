import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { FunctionModel } from '@/models/Function';
import { MoiEntry } from '@/models/MoiEntry';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export default async function AdminPage() {
  await connectDB();
  const [userCount, funcCount, entryCount, totals] = await Promise.all([
    User.countDocuments(),
    FunctionModel.countDocuments(),
    MoiEntry.countDocuments(),
    MoiEntry.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);

  return (
    <AdminDashboardClient
      stats={{
        userCount,
        funcCount,
        entryCount,
        totalCollected: totals[0]?.total ?? 0,
      }}
    />
  );
}
