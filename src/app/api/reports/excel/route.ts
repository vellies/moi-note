import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { MoiEntry } from '@/models/MoiEntry';
import { FunctionModel } from '@/models/Function';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const functionId = req.nextUrl.searchParams.get('functionId');
  if (!functionId) return NextResponse.json({ error: 'functionId required' }, { status: 400 });

  await connectDB();
  const fn = await FunctionModel.findById(functionId).lean();
  if (!fn) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const entries = await MoiEntry.find({ functionId }).sort({ createdAt: -1 }).lean();

  const rows = entries.map((e, i) => ({
    '#': i + 1,
    'Contributor Name': e.contributorName,
    Place: e.place,
    'Mobile Number': e.mobileNumber || '',
    'Amount (₹)': e.amount,
    'Payment Mode': e.paymentMode,
    Notes: e.notes || '',
    Date: new Date(e.createdAt).toLocaleDateString('en-IN'),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 4 }, { wch: 25 }, { wch: 18 }, { wch: 15 },
    { wch: 12 }, { wch: 14 }, { wch: 25 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Moi Entries');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const filename = `moi-${fn.title.replace(/\s+/g, '-')}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
