import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { MoiEntry } from '@/models/MoiEntry';
import { moiEntrySchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const functionId = req.nextUrl.searchParams.get('functionId');
  if (!functionId) return NextResponse.json({ error: 'functionId required' }, { status: 400 });

  await connectDB();
  const raw = await MoiEntry.find({ functionId, deletedAt: null }).sort({ createdAt: -1 }).lean();
  const entries = raw.map((e) => ({ ...e, status: e.status ?? 'pending' }));
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = moiEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { functionId } = body;
  if (!functionId) return NextResponse.json({ error: 'functionId required' }, { status: 400 });

  await connectDB();
  const entry = await MoiEntry.create({ ...parsed.data, functionId, userId: session.user.id });
  return NextResponse.json(entry, { status: 201 });
}
