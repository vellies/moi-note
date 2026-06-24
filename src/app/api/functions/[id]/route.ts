import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { FunctionModel } from '@/models/Function';
import { MoiEntry } from '@/models/MoiEntry';
import { functionSchema } from '@/lib/validations';

async function getFunction(id: string, userId: string, isAdmin: boolean) {
  const query = isAdmin ? { _id: id } : { _id: id, userId };
  return FunctionModel.findOne(query);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  const fn = await getFunction(id, session.user.id!, isAdmin);
  if (!fn) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const entries = await MoiEntry.find({ functionId: id }).sort({ createdAt: -1 }).lean();
  const totalAmount = entries.reduce((s, e) => s + e.amount, 0);

  return NextResponse.json({ ...fn.toObject(), entries, totalAmount, entryCount: entries.length });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = functionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await connectDB();
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  const fn = await getFunction(id, session.user.id!, isAdmin);
  if (!fn) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  Object.assign(fn, parsed.data);
  await fn.save();
  return NextResponse.json(fn);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  const fn = await getFunction(id, session.user.id!, isAdmin);
  if (!fn) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await FunctionModel.findByIdAndUpdate(id, { deletedAt: new Date() });
  await MoiEntry.updateMany({ functionId: id, deletedAt: null }, { deletedAt: new Date() });
  return NextResponse.json({ success: true });
}
