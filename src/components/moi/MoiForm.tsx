'use client';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { moiEntrySchema, type MoiEntryInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    defaultValues: { paymentMode: 'Cash', ...defaultValues },
  });

  const wrappedSubmit = async (data: MoiEntryInput) => {
    await onSubmit(data);
    if (!defaultValues) reset();
  };

  const voiceInput = (field: keyof MoiEntryInput, placeholder: string, labelKey: Parameters<typeof t>[0]) => (
    <div className="space-y-1 min-w-0">
      <Label className="text-xs">{t(labelKey, lang)}</Label>
      <div className="relative flex items-center">
        <Input placeholder={placeholder} {...register(field)} className="pr-16 h-8 text-sm" />
        <div className="absolute right-1 flex items-center gap-0">
          <VoiceInput lang={voiceLang} onResult={(text) => setValue(field, text as never)} />
          <AIVoiceInput lang={voiceLang} onResult={(text) => setValue(field, text as never)} />
        </div>
      </div>
      {errors[field] && <p className="text-xs text-red-500">{errors[field]?.message as string}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(wrappedSubmit)} className="space-y-2">
      {/* Row 1: Name | Place | Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {voiceInput('contributorName', 'e.g. Kumar', 'contributorName')}
        {voiceInput('place', 'e.g. Chennai', 'place')}
        <div className="space-y-1">
          <Label className="text-xs">{t('mobileNumber', lang)}</Label>
          <Input type="tel" placeholder="Mobile number" {...register('mobileNumber')} className="h-9 text-sm" />
          {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber.message}</p>}
        </div>
      </div>

      {/* Row 2: Amount | Mode | Notes+Button (3 equal cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
        <div className="space-y-1 min-w-0">
          <Label className="text-xs">{t('amount', lang)}</Label>
          <div className="relative flex items-center">
            <Input type="number" min={0} placeholder="₹ Amount" {...register('amount')} className="pr-16 h-9 text-sm" />
            <div className="absolute right-1 flex items-center gap-0">
              <VoiceInput lang={voiceLang} onResult={(text) => {
                const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                if (!isNaN(num)) setValue('amount', num as never);
              }} />
              <AIVoiceInput lang={voiceLang} onResult={(text) => {
                const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                if (!isNaN(num)) setValue('amount', num as never);
              }} />
            </div>
          </div>
          {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
        </div>

        {/* Notes — col 2 */}
        <div className="space-y-1">
          <Label className="text-xs">{t('notes', lang)}</Label>
          <Input placeholder="Notes (optional)" {...register('notes')} className="h-9 text-sm" />
        </div>

        {/* Payment Mode + Button — col 3 */}
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <Label className="text-xs">{t('paymentMode', lang)}</Label>
          <div className="flex gap-2">
            <Select onValueChange={(v: string | null) => { if (v) setValue('paymentMode', v as MoiEntryInput['paymentMode']); }} defaultValue={watch('paymentMode')}>
              <SelectTrigger className="h-9 text-sm flex-1">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {paymentModeLabels[mode]?.[lang] ?? mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="h-9 text-sm px-3 shrink-0">
                {t('cancel', lang)}
              </Button>
            )}
            <Button type="submit" className="h-9 text-sm px-4 bg-orange-500 hover:bg-orange-600 shrink-0" disabled={loading}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : t(defaultValues ? 'update' : 'add', lang)}
            </Button>
          </div>
          {errors.paymentMode && <p className="text-xs text-red-500">{errors.paymentMode.message}</p>}
        </div>
      </div>
    </form>
  );
}
