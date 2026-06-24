'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { functionSchema, type FunctionInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLang } from '@/contexts/LangContext';
import { t, functionTypeLabels } from '@/lib/i18n';
import { Loader2 } from 'lucide-react';

const FUNCTION_TYPES = ['Wedding', 'HouseWarming', 'Birthday', 'TempleFestival', 'Engagement', 'Other'] as const;

interface Props {
  defaultValues?: Partial<FunctionInput>;
  onSubmit: (data: FunctionInput) => Promise<void>;
  loading: boolean;
  submitLabel?: string;
}

export function FunctionForm({ defaultValues, onSubmit, loading, submitLabel }: Props) {
  const { lang } = useLang();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FunctionInput>({
    resolver: zodResolver(functionSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1">
        <Label>{t('title', lang)}</Label>
        <Input placeholder="e.g. Ravi & Meena Wedding" {...register('title')} />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>{t('functionType', lang)}</Label>
        <Select onValueChange={(v: string | null) => { if (v) setValue('type', v as FunctionInput['type']); }} defaultValue={watch('type')}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {FUNCTION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {functionTypeLabels[type]?.[lang] ?? type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>{t('date', lang)}</Label>
          <Input type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>{t('venue', lang)}</Label>
          <Input placeholder="Venue / Hall name" {...register('venue')} />
          {errors.venue && <p className="text-xs text-red-500">{errors.venue.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label>{t('notes', lang)}</Label>
        <Textarea placeholder="Optional notes..." rows={3} {...register('notes')} />
      </div>

      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {submitLabel ?? t('save', lang)}
      </Button>
    </form>
  );
}
