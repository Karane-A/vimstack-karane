import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

interface MidtransPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  midtransSecretKey: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MidtransPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  midtransSecretKey,
  currency = 'IDR',
  onSuccess,
  onCancel,
}: MidtransPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!midtransSecretKey) {
      setError(t('Midtrans not configured'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(route('midtrans.create-payment'), {
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
        initializeMidtransSnap(data.snap_token, data.order_id);
      } else {
        throw new Error(data.error || t('Payment creation failed'));
      }
    } catch (err) {
      console.error('Midtrans payment error:', err);
      setError(err instanceof Error ? err.message : t('Payment initialization failed'));
      setIsLoading(false);
    }
  };

  const initializeMidtransSnap = (snapToken: string, orderId: string) => {
    if (!window.snap) {
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', midtransSecretKey); // Use the provided key
      script.onload = () => {
        openSnapPayment(snapToken, orderId);
      };
      script.onerror = () => {
        setError(t('Failed to load Midtrans script'));
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      openSnapPayment(snapToken, orderId);
    }
  };

  const openSnapPayment = (snapToken: string, orderId: string) => {
    window.snap.pay(snapToken, {
      onSuccess: (result: any) => {
        handlePaymentSuccess(result, orderId);
      },
      onPending: (result: any) => {
        setIsLoading(false);
      },
      onError: (result: any) => {
        setError(t('Payment failed'));
        setIsLoading(false);
      },
      onClose: () => {
        setIsLoading(false);
      }
    });
  };

  const handlePaymentSuccess = (result: any, orderId: string) => {
    router.post(route('midtrans.payment'), {
      plan_id: planId,
      billing_cycle: billingCycle,
      coupon_code: couponCode,
      transaction_status: result.transaction_status,
      order_id: orderId,
    }, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (errors) => {
        console.error('Payment processing error:', errors);
        setError(Object.values(errors).flat().join(', '));
        setIsLoading(false);
      },
    });
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
          {t('Midtrans Payment')}
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

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">{t('Supported Payment Methods')}</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Credit/Debit Cards</li>
            <li>• Bank Transfer</li>
            <li>• E-Wallets (GoPay, OVO, DANA)</li>
            <li>• Convenience Stores</li>
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
            disabled={isLoading || !midtransSecretKey}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Processing...')}
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {t('Pay with Midtrans')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}