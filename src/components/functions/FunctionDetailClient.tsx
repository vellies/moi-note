'use client';
import { useState, useCallback } from 'react';
import { MoiTable } from '@/components/moi/MoiTable';
import { MoiForm } from '@/components/moi/MoiForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLang } from '@/contexts/LangContext';
import { t, functionTypeLabels } from '@/lib/i18n';
import { formatCurrency, formatDate, functionTypeIcons } from '@/lib/utils';
import type { IFunction, IMoiEntry } from '@/types';
import type { MoiEntryInput } from '@/lib/validations';
import { toast } from 'sonner';
import {
  ArrowLeft, Pencil, CalendarDays, MapPin, IndianRupee, Users, FileDown, ChevronDown, ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  fn: IFunction;
  initialEntries: IMoiEntry[];
}

export function FunctionDetailClient({ fn, initialEntries }: Props) {
  const { lang } = useLang();
  const [entries, setEntries] = useState<IMoiEntry[]>(initialEntries);
  const [cardOpen, setCardOpen] = useState(true);
  const [adding, setAdding] = useState(false);

  const refreshEntries = useCallback(async () => {
    const res = await fetch(`/api/moi?functionId=${fn._id}`);
    if (res.ok) setEntries(await res.json());
  }, [fn._id]);

  const handleAdd = async (data: MoiEntryInput) => {
    setAdding(true);
    const res = await fetch('/api/moi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, functionId: fn._id }),
    });
    setAdding(false);
    if (res.ok) {
      toast.success('Moi entry added!');
      await refreshEntries();
    } else {
      toast.error('Failed to add entry');
    }
  };

  const total = entries.reduce((s, e) => s + e.amount, 0);
  const typeLabel = functionTypeLabels[fn.type]?.[lang] ?? fn.type;

  return (
    <div className="space-y-4">
      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/functions">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <Link href={`/dashboard/functions/${fn._id}/edit`}>
          <Button variant="outline" size="sm" className="gap-1">
            <Pencil className="h-4 w-4" /> {t('edit', lang)}
          </Button>
        </Link>
      </div>

      {/* 1. Info card — toggleable */}
      <Card>
        <button
          type="button"
          onClick={() => setCardOpen((o) => !o)}
          className="w-full text-left"
        >
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{functionTypeIcons[fn.type]}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-gray-900">{fn.title}</h1>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                    {typeLabel}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> {formatDate(fn.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {fn.venue}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-gray-400 shrink-0">
              {cardOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardHeader>
        </button>

        {cardOpen && (
          <CardContent className="pt-0">
            {fn.notes && <p className="text-sm text-gray-400 mb-4">{fn.notes}</p>}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{t('totalCollected', lang)}</p>
                  <p className="font-bold text-green-600 text-sm">{formatCurrency(total)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{t('entries', lang)}</p>
                  <p className="font-bold text-sm">{entries.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <FileDown className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Export</p>
                  <div className="flex gap-2 mt-0.5">
                    <a href={`/api/reports/excel?functionId=${fn._id}`}
                      className="text-xs text-orange-500 hover:underline font-medium">Excel</a>
                    <span className="text-gray-300">|</span>
                    <a href={`/api/reports/pdf?functionId=${fn._id}`}
                      className="text-xs text-orange-500 hover:underline font-medium">PDF</a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 2. Add Moi form — always visible */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('addMoi', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <MoiForm onSubmit={handleAdd} loading={adding} />
        </CardContent>
      </Card>

      {/* 3. Entries list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t('entries', lang)}
            <span className="ml-2 text-sm font-normal text-gray-400">({entries.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MoiTable entries={entries} functionId={fn._id} onRefresh={refreshEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
