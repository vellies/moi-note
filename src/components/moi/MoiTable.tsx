'use client';
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoiForm } from './MoiForm';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { IMoiEntry } from '@/types';
import type { MoiEntryInput } from '@/lib/validations';
import { toast } from 'sonner';
import { Pencil, Trash2, Search } from 'lucide-react';

interface Props {
  entries: IMoiEntry[];
  functionId: string;
  onRefresh: () => void;
}

export function MoiTable({ entries, functionId, onRefresh }: Props) {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [editEntry, setEditEntry] = useState<IMoiEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = entries.filter(
    (e) =>
      e.contributorName.toLowerCase().includes(search.toLowerCase()) ||
      e.place.toLowerCase().includes(search.toLowerCase()) ||
      (e.mobileNumber || '').includes(search)
  );

  const handleUpdate = async (data: MoiEntryInput) => {
    if (!editEntry) return;
    setSaving(true);
    const res = await fetch(`/api/moi/${editEntry._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      toast.success('Entry updated');
      setEditEntry(null);
      onRefresh();
    } else {
      toast.error('Failed to update entry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this Moi entry?')) return;
    setDeletingId(id);
    const res = await fetch(`/api/moi/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    if (res.ok) {
      toast.success('Entry deleted');
      onRefresh();
    } else {
      toast.error('Failed to delete entry');
    }
  };

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`${t('search', lang)}...`}
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-gray-500">{filtered.length} entries</span>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>#</TableHead>
              <TableHead>{t('contributorName', lang)}</TableHead>
              <TableHead>{t('place', lang)}</TableHead>
              <TableHead className="hidden md:table-cell">{t('mobileNumber', lang)}</TableHead>
              <TableHead>{t('amount', lang)}</TableHead>
              <TableHead className="hidden sm:table-cell">{t('paymentMode', lang)}</TableHead>
              <TableHead className="hidden lg:table-cell">{t('date', lang)}</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                  No entries found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((entry, i) => (
                <TableRow key={entry._id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-400 text-sm">{i + 1}</TableCell>
                  <TableCell className="font-medium">{entry.contributorName}</TableCell>
                  <TableCell className="text-gray-600">{entry.place}</TableCell>
                  <TableCell className="hidden md:table-cell text-gray-500">
                    {entry.mobileNumber || '—'}
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(entry.amount)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary" className="text-xs">{entry.paymentMode}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-400 text-sm">
                    {formatDate(entry.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-orange-500"
                        onClick={() => setEditEntry(entry)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(entry._id)}
                        disabled={deletingId === entry._id}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <div className="flex justify-end">
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-sm">
            <span className="text-gray-500">Total: </span>
            <span className="font-bold text-orange-600">{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      <Dialog open={!!editEntry} onOpenChange={() => setEditEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Moi Entry</DialogTitle>
          </DialogHeader>
          {editEntry && (
            <MoiForm
              defaultValues={{
                contributorName: editEntry.contributorName,
                place: editEntry.place,
                mobileNumber: editEntry.mobileNumber,
                amount: editEntry.amount,
                paymentMode: editEntry.paymentMode,
                notes: editEntry.notes,
              }}
              onSubmit={handleUpdate}
              loading={saving}
              onCancel={() => setEditEntry(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

