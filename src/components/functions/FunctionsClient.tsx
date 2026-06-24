'use client';
import { useState } from 'react';
import { FunctionCard } from './FunctionCard';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import Link from 'next/link';
import type { IFunction } from '@/types';
import { PlusCircle } from 'lucide-react';

export function FunctionsClient({ functions: initial }: { functions: IFunction[] }) {
  const { lang } = useLang();
  const [functions, setFunctions] = useState<IFunction[]>(initial);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/functions/${confirmDeleteId}`, { method: 'DELETE' });
    setDeleting(false);
    setConfirmDeleteId(null);
    if (res.ok) {
      setFunctions((prev) => prev.filter((f) => f._id !== confirmDeleteId));
      toast.success('Function deleted');
    } else {
      toast.error('Failed to delete function');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('functions', lang)}</h1>
          <p className="text-gray-500 text-sm">{functions.length} event{functions.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/dashboard/functions/new">
          <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
            <PlusCircle className="h-4 w-4" />
            {t('newFunction', lang)}
          </Button>
        </Link>
      </div>

      {functions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-6xl">🛕</span>
          <p className="mt-4 text-lg font-medium">No functions yet</p>
          <p className="text-sm">Create your first function to get started</p>
          <Link href="/dashboard/functions/new">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Create Function</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {functions.map((fn) => (
            <FunctionCard key={fn._id} fn={fn} onDelete={setConfirmDeleteId} />
          ))}
        </div>
      )}

      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Function</DialogTitle>
            <DialogDescription>
              This will delete the function and all its Moi entries. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed} disabled={deleting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
