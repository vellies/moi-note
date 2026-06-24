import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { FunctionModel } from '@/models/Function';
import { MoiEntry } from '@/models/MoiEntry';
import { functionSchema } from '@/lib/validations';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  const query = isAdmin ? { deletedAt: null } : { userId: session.user.id, deletedAt: null };
  const functions = await FunctionModel.find(query).sort({ createdAt: -1 }).lean();

  const enriched = await Promise.all(
    functions.map(async (fn) => {
      const entries = await MoiEntry.find({ functionId: fn._id }).lean();
      const totalAmount = entries.reduce((s, e) => s + e.amount, 0);
      return { ...fn, totalAmount, entryCount: entries.length };
    })
  );

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = functionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await connectDB();
  const fn = await FunctionModel.create({ ...parsed.data, userId: session.user.id });
  return NextResponse.json(fn, { status: 201 });
}
