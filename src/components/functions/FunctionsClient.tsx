'use client';
import { FunctionCard } from './FunctionCard';
import { Button } from '@/components/ui/button';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import type { IFunction } from '@/types';
import { PlusCircle } from 'lucide-react';

export function FunctionsClient({ functions }: { functions: IFunction[] }) {
  const { lang } = useLang();

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
            <FunctionCard key={fn._id} fn={fn} />
          ))}
        </div>
      )}
    </div>
  );
}
