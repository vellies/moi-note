import { connectDB } from '@/lib/db';
import { FunctionModel } from '@/models/Function';
import { MoiEntry } from '@/models/MoiEntry';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default async function AdminFunctionsPage() {
  await connectDB();
  const functions = await FunctionModel.find({}).sort({ createdAt: -1 }).lean();
  const enriched = await Promise.all(
    functions.map(async (fn) => {
      const entries = await MoiEntry.find({ functionId: fn._id }).lean();
      return { ...fn, totalAmount: entries.reduce((s, e) => s + e.amount, 0), entryCount: entries.length };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Functions</h1>
        <p className="text-gray-500 text-sm">{functions.length} functions across all users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entries</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.map((fn) => (
                <TableRow key={fn._id.toString()}>
                  <TableCell className="font-medium">{fn.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{fn.type}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(fn.date).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>{fn.entryCount}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(fn.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
