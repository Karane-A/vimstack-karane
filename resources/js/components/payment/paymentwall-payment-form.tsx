import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';

// Declare Brick as a global variable
declare global {
  interface Window {
    Brick: any;
  }
}

interface PaymentWallPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  paymentwallPublicKey: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentWallPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  paymentwallPublicKey,
  currency = 'USD',
  onSuccess,
  onCancel,
}: PaymentWallPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brickLoaded, setBrickLoaded] = useState(false);
  const [brickInstance, setBrickInstance] = useState<any>(null);
  const paymentFormRef = useRef<HTMLDivElement>(null);

  // Load Brick.js script
  useEffect(() => {
    const loadBrickScript = () => {
      if (window.Brick) {
        setBrickLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api.paymentwall.com/brick/build/brick-default.1.5.0.min.js';
      script.async = true;
      script.onload = () => {
        setBrickLoaded(true);
      };
      script.onerror = () => {
        setError(t('Failed to load PaymentWall payment form'));
      };
      document.head.appendChild(script);
    };

    loadBrickScript();
  }, [t]);

  // Initialize Brick payment form
  useEffect(() => {
    if (brickLoaded && paymentwallPublicKey && !brickInstance) {
      initializeBrickForm();
    }
  }, [brickLoaded, paymentwallPublicKey, brickInstance]);

  const initializeBrickForm = async () => {
    try {
      const response = await fetch(route('paymentwall.create-payment'), {
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

      if (data.success && data.brick_config) {
        const config = data.brick_config;
        
        const brick = new window.Brick({
          public_key: config.public_key,
          amount: config.amount,
          currency: config.currency,
          container: 'paymentwall-form-container',
          action: route('paymentwall.process'),
          form: {
            merchant: 'PaymentWall',
            product: config.plan_name,
            pay_button: t('Pay Now'),
            show_zip: true,
            show_cardholder: true
          }
        });

        brick.showPaymentForm(
          (data: any) => {
            // Success callback
            onSuccess();
          },
          (errors: any) => {
            // Error callback
            console.error('Payment error:', errors);
            if (errors && errors.length > 0) {
              setError(errors[0].message || t('Payment failed'));
            } else {
              setError(t('Payment failed'));
            }
            setIsLoading(false);
          }
        );

        setBrickInstance(brick);
      } else {
        throw new Error(data.error || t('Failed to initialize payment form'));
      }
    } catch (err) {
      console.error('PaymentWall initialization error:', err);
      setError(err instanceof Error ? err.message : t('Payment initialization failed'));
    }
  };

  const handlePayment = () => {
    if (!brickInstance) {
      setError(t('Payment form not ready'));
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // The actual payment processing is handled by Brick.js
    // This just triggers the form submission
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
          {t('PaymentWall Payment')}
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

        {/* PaymentWall Brick.js Form Container */}
        <div className="space-y-4">
          <div id="paymentwall-form-container" ref={paymentFormRef} className="min-h-[300px]">
            {!brickLoaded && (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>{t('Loading payment form...')}</span>
              </div>
            )}
          </div>
          
          {/* Hidden form fields for Brick.js */}
          <form id="brick-form" style={{display: 'none'}}>
            <input type="hidden" name="plan_id" value={planId} />
            <input type="hidden" name="billing_cycle" value={billingCycle} />
            <input type="hidden" name="coupon_code" value={couponCode || ''} />
            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
          </form>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">{t('Secure Payment')}</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• SSL Encrypted & PCI DSS Compliant</li>
              <li>• Multiple Payment Methods Supported</li>
              <li>• Powered by PaymentWall</li>
            </ul>
          </div>
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
          {!brickLoaded && (
            <Button
              disabled
              className="flex-1"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('Loading...')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}