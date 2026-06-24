import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { FunctionModel } from '@/models/Function';
import { ReportsClient } from '@/components/reports/ReportsClient';

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) return null;

  await connectDB();
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  const query = isAdmin ? {} : { userId: session.user.id };
  const functions = await FunctionModel.find(query).sort({ createdAt: -1 }).lean();

  return <ReportsClient functions={JSON.parse(JSON.stringify(functions))} />;
}
