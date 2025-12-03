import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle, ExternalLink } from 'lucide-react';

interface XenditPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  xenditApiKey: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function XenditPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  xenditApiKey,
  currency = 'PHP',
  onSuccess,
  onCancel,
}: XenditPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!xenditApiKey) {
      setError(t('Xendit not configured'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(route('xendit.create-payment'), {
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
        window.location.href = data.payment_url;
      } else {
        throw new Error(data.error || t('Payment creation failed'));
      }
    } catch (err) {
      console.error('Xendit payment error:', err);
      setError(err instanceof Error ? err.message : t('Payment initialization failed'));
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('Xendit Payment')}
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
            {t('You will be redirected to Xendit to complete your payment securely.')}
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">{t('Supported Payment Methods')}</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Credit/Debit Cards</li>
            <li>• Bank Transfer</li>
            <li>• E-Wallets (OVO, DANA, LinkAja)</li>
            <li>• Virtual Accounts</li>
            <li>• Retail Outlets</li>
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
            disabled={isLoading || !xenditApiKey}
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
                {t('Pay with Xendit')}
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {t('Powered by Xendit - Secure payment processing')}
        </div>
      </CardContent>
    </Card>
  );
}