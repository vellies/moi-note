import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { FunctionModel } from '@/models/Function';
import { MoiEntry } from '@/models/MoiEntry';
import { FunctionsClient } from '@/components/functions/FunctionsClient';

export default async function FunctionsPage() {
  const session = await auth();
  if (!session?.user) return null;

  await connectDB();
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  const query = isAdmin ? {} : { userId: session.user.id };
  const functions = await FunctionModel.find(query).sort({ createdAt: -1 }).lean();

  const enriched = await Promise.all(
    functions.map(async (fn) => {
      const entries = await MoiEntry.find({ functionId: fn._id }).lean();
      const totalAmount = entries.reduce((s, e) => s + e.amount, 0);
      return { ...fn, totalAmount, entryCount: entries.length };
    })
  );

  return <FunctionsClient functions={JSON.parse(JSON.stringify(enriched))} />;
}
