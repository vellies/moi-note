'use client';
import { useState, useEffect } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils';
import type { IFunction, IMoiEntry } from '@/types';
import { FileSpreadsheet, FileText, IndianRupee, Users, BarChart2 } from 'lucide-react';

export function ReportsClient({ functions }: { functions: IFunction[] }) {
  const { lang } = useLang();
  const [selectedId, setSelectedId] = useState<string>('');
  const [entries, setEntries] = useState<IMoiEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) { setEntries([]); return; }
    setLoading(true);
    fetch(`/api/moi?functionId=${selectedId}`)
      .then((r) => r.json())
      .then((data) => { setEntries(data); setLoading(false); });
  }, [selectedId]);

  const selectedFn = functions.find((f) => f._id === selectedId);
  const total = entries.reduce((s, e) => s + e.amount, 0);
  const byMode = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.paymentMode] = (acc[e.paymentMode] ?? 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('reports', lang)}</h1>
        <p className="text-gray-500 text-sm">Select a function to view its collection report</p>
      </div>

      <div className="w-full max-w-sm">
        <Select onValueChange={(v: string | null) => { if (v) setSelectedId(v); }} value={selectedId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a function" />
          </SelectTrigger>
          <SelectContent>
            {functions.map((fn) => (
              <SelectItem key={fn._id} value={fn._id}>
                {fn.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedFn && !loading && (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{t('totalCollected', lang)}</CardTitle>
                <IndianRupee className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(total)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total {t('entries', lang)}</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{entries.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Avg. per Entry</CardTitle>
                <BarChart2 className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {entries.length ? formatCurrency(Math.round(total / entries.length)) : '—'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Mode Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(byMode).map(([mode, amount]) => (
                <div key={mode} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{mode}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-orange-400 h-2 rounded-full"
                        style={{ width: `${total ? (amount / total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-24 text-right">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <a href={`/api/reports/excel?functionId=${selectedId}`}>
              <Button className="bg-green-600 hover:bg-green-700 gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                {t('exportExcel', lang)}
              </Button>
            </a>
            <a href={`/api/reports/pdf?functionId=${selectedId}`}>
              <Button className="bg-red-500 hover:bg-red-600 gap-2">
                <FileText className="h-4 w-4" />
                {t('exportPdf', lang)}
              </Button>
            </a>
          </div>
        </>
      )}

      {loading && (
        <div className="text-center py-10 text-gray-400">Loading report...</div>
      )}
    </div>
  );
}
