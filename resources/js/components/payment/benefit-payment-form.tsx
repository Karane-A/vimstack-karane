import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from '@/components/custom-toast';

interface BenefitPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  benefitPublicKey: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BenefitPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  benefitPublicKey,
  currency = 'BHD',
  onSuccess,
  onCancel,
}: BenefitPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!benefitPublicKey) {
      setError(t('Benefit payment configuration is missing'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create payment session
      const response = await fetch(route('benefit.create-session'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          plan_id: planId,
          billing_cycle: billingCycle,
          coupon_code: couponCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Benefit payment page
        window.location.href = data.payment_url;
      } else {
        throw new Error(data.error || t('Failed to create payment session'));
      }
    } catch (err) {
      console.error('Benefit payment error:', err);
      setError(err instanceof Error ? err.message : t('Payment initialization failed'));
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 3,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('Benefit Payment')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('Total Amount')}</span>
            <span className="text-lg font-bold">{formatPrice(planPrice)}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {t('Billing Cycle')}: {t(billingCycle)}
          </div>
          {couponCode && (
            <div className="text-sm text-green-600 mt-1">
              {t('Coupon Applied')}: {couponCode}
            </div>
          )}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('You will be redirected to Benefit to complete your payment securely. Benefit is the leading payment gateway in Bahrain.')}
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">{t('Supported Payment Methods')}</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {t('Benefit Debit Cards')}</li>
            <li>• {t('Visa Credit/Debit Cards')}</li>
            <li>• {t('Mastercard Credit/Debit Cards')}</li>
            <li>• {t('Benefit Pay Mobile Wallet')}</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !benefitPublicKey}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Redirecting...')}
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                {t('Pay with Benefit')}
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {t('Powered by Benefit - Bahrain\'s trusted payment gateway')}
        </div>
      </CardContent>
    </Card>
  );
}