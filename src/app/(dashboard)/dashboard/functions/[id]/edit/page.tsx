'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FunctionForm } from '@/components/functions/FunctionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { FunctionInput } from '@/lib/validations';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditFunctionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [defaults, setDefaults] = useState<Partial<FunctionInput> | null>(null);

  useEffect(() => {
    fetch(`/api/functions/${params.id}`)
      .then((r) => r.json())
      .then((fn) => {
        setDefaults({
          title: fn.title,
          type: fn.type,
          date: new Date(fn.date).toISOString().split('T')[0],
          venue: fn.venue,
          notes: fn.notes,
        });
      });
  }, [params.id]);

  const onSubmit = async (data: FunctionInput) => {
    setLoading(true);
    const res = await fetch(`/api/functions/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Function updated!');
      router.push(`/dashboard/functions/${params.id}`);
    } else {
      toast.error('Failed to update function');
    }
  };

  if (!defaults) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/functions/${params.id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-xl font-bold">{t('edit', lang)} Function</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Function Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FunctionForm defaultValues={defaults} onSubmit={onSubmit} loading={loading} submitLabel="Update Function" />
        </CardContent>
      </Card>
    </div>
  );
}
