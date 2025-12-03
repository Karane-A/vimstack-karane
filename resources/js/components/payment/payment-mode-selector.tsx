import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from 'react-i18next';

interface PaymentModeSelectorProps {
  value: 'sandbox' | 'live';
  onChange: (mode: 'sandbox' | 'live') => void;
  name: string;
  error?: string;
}

export function PaymentModeSelector({ value, onChange, name, error }: PaymentModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Label>{t("Mode")}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sandbox" id={`${name}_sandbox`} />
          <Label htmlFor={`${name}_sandbox`} className="font-normal">
            {t("Sandbox")}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="live" id={`${name}_live`} />
          <Label htmlFor={`${name}_live`} className="font-normal">
            {t("Live")}
          </Label>
        </div>
      </RadioGroup>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}