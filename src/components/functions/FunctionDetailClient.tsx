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
import { ArrowLeft, Pencil, Trash2, CalendarDays, MapPin, IndianRupee, Users, FileDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

interface Props {
  fn: IFunction;
  initialEntries: IMoiEntry[];
}

export function FunctionDetailClient({ fn, initialEntries }: Props) {
  const { lang } = useLang();
  const router = useRouter();
  const [entries, setEntries] = useState<IMoiEntry[]>(initialEntries);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const refreshEntries = useCallback(async () => {
    const res = await fetch(`/api/moi?functionId=${fn._id}`);
    if (res.ok) setEntries(await res.json());
  }, [fn._id]);

  const handleDeleteFunction = async () => {
    setDeleting(true);
    const res = await fetch(`/api/functions/${fn._id}`, { method: 'DELETE' });
    setDeleting(false);
    if (res.ok) {
      toast.success('Function deleted');
      router.push('/dashboard/functions');
    } else {
      toast.error('Failed to delete function');
      setConfirmDelete(false);
    }
  };

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
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/functions/${fn._id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Pencil className="h-4 w-4" /> {t('edit', lang)}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-gray-400 hover:text-red-500"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Info card */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            {/* Icon + title + badge */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl shrink-0">{functionTypeIcons[fn.type]}</span>
              <span className="font-bold text-gray-900 truncate">{fn.title}</span>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs shrink-0">
                {typeLabel}
              </Badge>
            </div>

            {/* Date + venue */}
            <div className="flex items-center gap-3 mt-1.5 sm:mt-0 sm:flex-1 min-w-0">
              <span className="flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
                <CalendarDays className="h-3.5 w-3.5" /> {formatDate(fn.date)}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500 min-w-0">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{fn.venue}</span>
              </span>
            </div>

            {/* Stats + export */}
            <div className="flex items-center gap-3 mt-2 sm:mt-0 sm:ml-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4 text-green-600" />
                <span className="font-bold text-green-600 text-sm">{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-gray-700 text-sm">{entries.length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs border-l pl-3">
                <FileDown className="h-3.5 w-3.5 text-orange-400" />
                <a href={`/api/reports/excel?functionId=${fn._id}`}
                  className="text-orange-500 hover:underline font-medium">Excel</a>
                <span className="text-gray-300">|</span>
                <a href={`/api/reports/pdf?functionId=${fn._id}`}
                  className="text-orange-500 hover:underline font-medium">PDF</a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Moi form */}
      <Card>
        {/* <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('addMoi', lang)}</CardTitle>
        </CardHeader> */}
        <CardContent>
          <MoiForm onSubmit={handleAdd} loading={adding} />
        </CardContent>
      </Card>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Function</DialogTitle>
            <DialogDescription>
              This will delete <strong>{fn.title}</strong> and all its Moi entries. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFunction} disabled={deleting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entries list */}
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
