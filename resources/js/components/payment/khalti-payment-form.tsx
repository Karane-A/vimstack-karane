import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { router } from '@inertiajs/react';

interface KhaltiPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  khaltiPublicKey: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function KhaltiPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  khaltiPublicKey,
  currency = 'NPR',
  onSuccess,
  onCancel,
}: KhaltiPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!khaltiPublicKey) {
      setError(t('Khalti not configured'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(route('khalti.create-payment'), {
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
        // Initialize Khalti checkout
        initializeKhaltiCheckout(data);
      } else {
        throw new Error(data.error || t('Payment creation failed'));
      }
    } catch (err) {
      console.error('Khalti payment error:', err);
      setError(err instanceof Error ? err.message : t('Payment initialization failed'));
      setIsLoading(false);
    }
  };

  const initializeKhaltiCheckout = (paymentData: any) => {
    // Load Khalti SDK if not already loaded
    if (!window.KhaltiCheckout) {
      const script = document.createElement('script');
      script.src = 'https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js';
      script.onload = () => {
        createKhaltiCheckout(paymentData);
      };
      document.head.appendChild(script);
    } else {
      createKhaltiCheckout(paymentData);
    }
  };

  const createKhaltiCheckout = (paymentData: any) => {
    const config = {
      publicKey: paymentData.public_key,
      productIdentity: paymentData.product_identity,
      productName: paymentData.product_name,
      productUrl: paymentData.product_url,
      paymentPreference: [
        'KHALTI',
        'EBANKING',
        'MOBILE_BANKING',
        'CONNECT_IPS',
        'SCT',
      ],
      eventHandler: {
        onSuccess(payload: any) {
          handlePaymentSuccess(payload.token, payload.amount);
        },
        onError(error: any) {
          console.error('Khalti payment error:', error);
          setError(t('Payment failed'));
          setIsLoading(false);
        },
        onClose() {
          setIsLoading(false);
        }
      }
    };

    const checkout = new window.KhaltiCheckout(config);
    checkout.show({ amount: paymentData.amount });
  };

  const handlePaymentSuccess = (token: string, amount: number) => {
    router.post(route('khalti.payment'), {
      plan_id: planId,
      billing_cycle: billingCycle,
      coupon_code: couponCode,
      token: token,
      amount: amount / 100, // Convert from paisa to rupees
    }, {
      onSuccess: () => {
        toast.success(t('Payment successful'));
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
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('Khalti Payment')}
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
            {t('Khalti is Nepal\'s most popular digital wallet and payment gateway.')}
          </AlertDescription>
        </Alert>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">{t('Supported Payment Methods')}</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Khalti Wallet</li>
            <li>• eBanking</li>
            <li>• Mobile Banking</li>
            <li>• Connect IPS</li>
            <li>• SCT Cards</li>
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
            disabled={isLoading || !khaltiPublicKey}
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
                {t('Pay with Khalti')}
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {t('Powered by Khalti - Nepal\'s digital wallet')}
        </div>
      </CardContent>
    </Card>
  );
}