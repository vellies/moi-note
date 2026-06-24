import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { FunctionModel } from '@/models/Function';
import { MoiEntry } from '@/models/MoiEntry';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  await connectDB();
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  const query = isAdmin ? {} : { userId: session.user.id };

  const functions = await FunctionModel.find(query).sort({ createdAt: -1 }).limit(5).lean();
  const allEntries = await MoiEntry.find(
    isAdmin ? {} : { userId: session.user.id }
  ).sort({ createdAt: -1 }).limit(5).lean();

  const totalFunctions = await FunctionModel.countDocuments(query);
  const totalEntries = await MoiEntry.countDocuments(isAdmin ? {} : { userId: session.user.id });

  const totals = await MoiEntry.aggregate([
    { $match: isAdmin ? {} : { userId: session.user.id } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalCollected = totals[0]?.total ?? 0;

  return (
    <DashboardClient
      userName={session.user.name ?? ''}
      stats={{ totalFunctions, totalEntries, totalCollected }}
      recentFunctions={JSON.parse(JSON.stringify(functions))}
      recentEntries={JSON.parse(JSON.stringify(allEntries))}
    />
  );
}
