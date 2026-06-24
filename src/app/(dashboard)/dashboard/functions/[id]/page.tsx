import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { FunctionModel } from '@/models/Function';
import { MoiEntry } from '@/models/MoiEntry';
import { notFound } from 'next/navigation';
import { FunctionDetailClient } from '@/components/functions/FunctionDetailClient';

export default async function FunctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;
  await connectDB();

  const isAdmin = (session.user as { role?: string }).role === 'admin';
  const query = isAdmin ? { _id: id } : { _id: id, userId: session.user.id };
  const fn = await FunctionModel.findOne(query).lean();
  if (!fn) notFound();

  const entries = await MoiEntry.find({ functionId: id }).sort({ createdAt: -1 }).lean();
  const totalAmount = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <FunctionDetailClient
      fn={JSON.parse(JSON.stringify({ ...fn, totalAmount, entryCount: entries.length }))}
      initialEntries={JSON.parse(JSON.stringify(entries))}
    />
  );
}
