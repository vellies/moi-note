'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Users, List, IndianRupee, FileText } from 'lucide-react';

interface Props {
  stats: { userCount: number; funcCount: number; entryCount: number; totalCollected: number };
}

export function AdminDashboardClient({ stats }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm">System-wide overview</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.userCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Functions</CardTitle>
            <List className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.funcCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Entries</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.entryCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Collected</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCollected)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Link href="/admin/users">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" /> Manage Users
          </Button>
        </Link>
        <Link href="/admin/functions">
          <Button variant="outline" className="gap-2">
            <List className="h-4 w-4" /> View All Functions
          </Button>
        </Link>
      </div>
    </div>
  );
}
