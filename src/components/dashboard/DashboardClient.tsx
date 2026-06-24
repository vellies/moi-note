'use client';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import { formatCurrency, formatDate, functionTypeIcons } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { IFunction, IMoiEntry } from '@/types';
import { IndianRupee, List, TrendingUp, PlusCircle } from 'lucide-react';

interface Props {
  userName: string;
  stats: { totalFunctions: number; totalEntries: number; totalCollected: number };
  recentFunctions: IFunction[];
  recentEntries: IMoiEntry[];
}

export function DashboardClient({ userName, stats, recentFunctions, recentEntries }: Props) {
  const { lang } = useLang();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('welcome', lang)}, {userName}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s your Moi collection summary</p>
        </div>
        <Link href="/dashboard/functions/new">
          <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
            <PlusCircle className="h-4 w-4" />
            {t('newFunction', lang)}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t('functions', lang)}</CardTitle>
            <List className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalFunctions}</p>
            <p className="text-xs text-gray-400 mt-1">Total events created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t('totalCollected', lang)}</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalCollected)}</p>
            <p className="text-xs text-gray-400 mt-1">Across all functions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t('entries', lang)}</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalEntries}</p>
            <p className="text-xs text-gray-400 mt-1">Total Moi entries recorded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Recent Functions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent {t('functions', lang)}</CardTitle>
            <Link href="/dashboard/functions">
              <Button variant="ghost" size="sm" className="text-orange-500">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFunctions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No functions yet</p>
            ) : (
              recentFunctions.map((fn) => (
                <Link key={fn._id} href={`/dashboard/functions/${fn._id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <span className="text-2xl">{functionTypeIcons[fn.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{fn.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(fn.date)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{fn.type}</Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent {t('entries', lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEntries.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No entries yet</p>
            ) : (
              recentEntries.map((entry) => (
                <div key={entry._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-sm">{entry.contributorName}</p>
                    <p className="text-xs text-gray-400">{entry.place}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-green-600">{formatCurrency(entry.amount)}</p>
                    <Badge variant="secondary" className="text-xs">{entry.paymentMode}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
