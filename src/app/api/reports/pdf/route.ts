import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { MoiEntry } from '@/models/MoiEntry';
import { FunctionModel } from '@/models/Function';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const functionId = req.nextUrl.searchParams.get('functionId');
  if (!functionId) return NextResponse.json({ error: 'functionId required' }, { status: 400 });

  await connectDB();
  const fn = await FunctionModel.findById(functionId).lean();
  if (!fn) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const entries = await MoiEntry.find({ functionId }).sort({ createdAt: -1 }).lean();
  const total = entries.reduce((s, e) => s + e.amount, 0);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Moi Note Report', 14, 20);
  doc.setFontSize(12);
  doc.text(`Function: ${fn.title}`, 14, 30);
  doc.text(`Date: ${new Date(fn.date).toLocaleDateString('en-IN')}`, 14, 38);
  doc.text(`Venue: ${fn.venue}`, 14, 46);
  doc.text(`Total Collected: ₹${total.toLocaleString('en-IN')}`, 14, 54);
  doc.text(`Total Entries: ${entries.length}`, 14, 62);

  autoTable(doc, {
    startY: 70,
    head: [['#', 'Name', 'Place', 'Mobile', 'Amount (₹)', 'Mode', 'Notes']],
    body: entries.map((e, i) => [
      i + 1,
      e.contributorName,
      e.place,
      e.mobileNumber || '',
      e.amount.toLocaleString('en-IN'),
      e.paymentMode,
      e.notes || '',
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [245, 124, 0] },
  });

  const buf = Buffer.from(doc.output('arraybuffer'));
  const filename = `moi-${fn.title.replace(/\s+/g, '-')}.pdf`;

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
