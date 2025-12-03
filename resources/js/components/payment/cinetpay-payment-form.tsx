import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from '@/components/custom-toast';

interface CinetPayPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  cinetpaySiteId: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CinetPayPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  cinetpaySiteId,
  currency = 'XOF',
  onSuccess,
  onCancel,
}: CinetPayPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!cinetpaySiteId) {
      setError(t('CinetPay not configured'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(route('cinetpay.create-payment'), {
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
        // Create form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.payment_url;

        Object.keys(data.payment_data).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data.payment_data[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error(data.error || t('Payment creation failed'));
      }
    } catch (err) {
      console.error('CinetPay payment error:', err);
      setError(err instanceof Error ? err.message : t('Payment initialization failed'));
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('CinetPay Payment')}
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
            {t('You will be redirected to CinetPay to complete your payment securely.')}
          </AlertDescription>
        </Alert>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-2">{t('Supported Payment Methods')}</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Mobile Money (Orange, MTN, Moov)</li>
            <li>• Visa/Mastercard</li>
            <li>• Bank Transfers</li>
            <li>• Digital Wallets</li>
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
            disabled={isLoading || !cinetpaySiteId}
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
                {t('Pay with CinetPay')}
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {t('Powered by CinetPay - African payment gateway')}
        </div>
      </CardContent>
    </Card>
  );
}