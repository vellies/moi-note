'use client';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { moiEntrySchema, type MoiEntryInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { VoiceInput } from './VoiceInput';
import { AIVoiceInput } from './AIVoiceInput';
import { useLang } from '@/contexts/LangContext';
import { t, paymentModeLabels } from '@/lib/i18n';
import { Loader2 } from 'lucide-react';

const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Cheque'] as const;

interface Props {
  defaultValues?: Partial<MoiEntryInput>;
  onSubmit: (data: MoiEntryInput) => Promise<void>;
  loading: boolean;
  onCancel?: () => void;
}

export function MoiForm({ defaultValues, onSubmit, loading, onCancel }: Props) {
  const { lang } = useLang();
  const voiceLang = lang === 'ta' ? 'ta-IN' : 'en-IN';

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MoiEntryInput>({
    resolver: zodResolver(moiEntrySchema) as Resolver<MoiEntryInput>,
    defaultValues,
  });

  const wrappedSubmit = async (data: MoiEntryInput) => {
    await onSubmit(data);
    if (!defaultValues) reset();
  };

  const withVoiceField = (field: keyof MoiEntryInput, placeholder: string, labelKey: Parameters<typeof t>[0]) => (
    <div className="space-y-1">
      <Label>{t(labelKey, lang)}</Label>
      <div className="relative flex items-center">
        <Input
          placeholder={placeholder}
          {...register(field)}
          className="pr-20"
        />
        <div className="absolute right-2 flex items-center gap-0.5">
          <VoiceInput
            lang={voiceLang}
            onResult={(text) => setValue(field, text as never)}
          />
          <AIVoiceInput
            lang={voiceLang}
            onResult={(text) => setValue(field, text as never)}
          />
        </div>
      </div>
      {errors[field] && <p className="text-xs text-red-500">{errors[field]?.message as string}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(wrappedSubmit)} className="space-y-4">
      {withVoiceField('contributorName', 'e.g. Kumar', 'contributorName')}
      {withVoiceField('place', 'e.g. Chennai', 'place')}

      <div className="space-y-1">
        <Label>{t('mobileNumber', lang)}</Label>
        <Input type="tel" placeholder="10-digit mobile" {...register('mobileNumber')} />
        {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>{t('amount', lang)}</Label>
          <Input type="number" min={0} placeholder="e.g. 1000" {...register('amount')} />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>{t('paymentMode', lang)}</Label>
          <Select onValueChange={(v: string | null) => { if (v) setValue('paymentMode', v as MoiEntryInput['paymentMode']); }} defaultValue={watch('paymentMode')}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_MODES.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {paymentModeLabels[mode]?.[lang] ?? mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paymentMode && <p className="text-xs text-red-500">{errors.paymentMode.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label>{t('notes', lang)}</Label>
        <Textarea placeholder="Optional notes..." rows={2} {...register('notes')} />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            {t('cancel', lang)}
          </Button>
        )}
        <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {t('save', lang)}
        </Button>
      </div>
    </form>
  );
}
