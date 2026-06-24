'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, functionTypeIcons } from '@/lib/utils';
import { functionTypeLabels } from '@/lib/i18n';
import { useLang } from '@/contexts/LangContext';
import type { IFunction } from '@/types';
import { CalendarDays, MapPin, IndianRupee, Users, Trash2 } from 'lucide-react';

interface Props {
  fn: IFunction;
  onDelete?: (id: string) => void;
}

export function FunctionCard({ fn, onDelete }: Props) {
  const { lang } = useLang();
  const typeLabel = functionTypeLabels[fn.type]?.[lang] ?? fn.type;

  return (
    <Link href={`/dashboard/functions/${fn._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{functionTypeIcons[fn.type]}</span>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {fn.title}
                </h3>
                <Badge variant="outline" className="text-xs mt-1 border-orange-200 text-orange-600">
                  {typeLabel}
                </Badge>
              </div>
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-300 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(fn._id); }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{formatDate(fn.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{fn.venue}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t mt-2">
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <IndianRupee className="h-4 w-4" />
              <span>{formatCurrency(fn.totalAmount ?? 0)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Users className="h-4 w-4" />
              <span>{fn.entryCount ?? 0} entries</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
