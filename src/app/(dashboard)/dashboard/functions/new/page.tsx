'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FunctionForm } from '@/components/functions/FunctionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { FunctionInput } from '@/lib/validations';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewFunctionPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FunctionInput) => {
    setLoading(true);
    const res = await fetch('/api/functions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(false);

    if (res.ok) {
      const fn = await res.json();
      toast.success('Function created!');
      router.push(`/dashboard/functions/${fn._id}`);
    } else {
      toast.error('Failed to create function');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/functions">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-xl font-bold">{t('newFunction', lang)}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Function Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FunctionForm onSubmit={onSubmit} loading={loading} submitLabel="Create Function" />
        </CardContent>
      </Card>
    </div>
  );
}
