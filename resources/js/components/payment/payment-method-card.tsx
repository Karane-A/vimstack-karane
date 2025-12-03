import { ReactNode } from 'react';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentMethodCardProps {
  title: string;
  icon: ReactNode;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: ReactNode;
  helpUrl?: string;
  helpText?: string;
}

export function PaymentMethodCard({
  title,
  icon,
  enabled,
  onToggle,
  children,
  helpUrl,
  helpText
}: PaymentMethodCardProps) {
  const { t } = useTranslation();

  return (
    <div className="border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <div className="p-4 space-y-4">
          {helpUrl && helpText && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {helpText}{' '}
                <a 
                  href={helpUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {t("Dashboard")}
                </a>
              </AlertDescription>
            </Alert>
          )}
          {children}
        </div>
      )}
    </div>
  );
}