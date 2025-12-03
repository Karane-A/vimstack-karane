import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from '@/components/custom-toast';

interface TapPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  tapSecretKey: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TapPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  tapSecretKey,
  currency = 'USD',
  onSuccess,
  onCancel,
}: TapPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!tapSecretKey) {
      setError(t('Tap not configured'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create form and submit to handle redirect properly
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = route('tap.create-payment');
      
      // Add CSRF token
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = '_token';
      csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      form.appendChild(csrfInput);
      
      // Add form data
      const planIdInput = document.createElement('input');
      planIdInput.type = 'hidden';
      planIdInput.name = 'plan_id';
      planIdInput.value = planId.toString();
      form.appendChild(planIdInput);
      
      const billingCycleInput = document.createElement('input');
      billingCycleInput.type = 'hidden';
      billingCycleInput.name = 'billing_cycle';
      billingCycleInput.value = billingCycle;
      form.appendChild(billingCycleInput);
      
      if (couponCode) {
        const couponInput = document.createElement('input');
        couponInput.type = 'hidden';
        couponInput.name = 'coupon_code';
        couponInput.value = couponCode;
        form.appendChild(couponInput);
      }
      
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Tap payment error:', err);
      setError(err instanceof Error ? err.message : t('Payment initialization failed'));
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('Tap Payment')}
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
            {t('You will be redirected to Tap to complete your payment securely.')}
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">{t('Supported Payment Methods')}</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Credit/Debit Cards</li>
            <li>• Apple Pay</li>
            <li>• Google Pay</li>
            <li>• KNET</li>
            <li>• Benefit Pay</li>
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
            disabled={isLoading || !tapSecretKey}
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
                {t('Pay with Tap')}
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {t('Powered by Tap - Secure payment processing')}
        </div>
      </CardContent>
    </Card>
  );
}