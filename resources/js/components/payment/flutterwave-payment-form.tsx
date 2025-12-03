import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import { usePaymentProcessor } from '@/hooks/usePaymentProcessor';

interface FlutterwavePaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: string;
  flutterwaveKey: string;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FlutterwavePaymentForm({ 
  planId, 
  planPrice,
  couponCode, 
  billingCycle, 
  flutterwaveKey,
  currency,
  onSuccess, 
  onCancel 
}: FlutterwavePaymentFormProps) {
  const { t } = useTranslation();
  const initialized = useRef(false);

  const { processPayment } = usePaymentProcessor({
    onSuccess,
    onError: (error) => toast.error(error)
  });

  useEffect(() => {
    if (!flutterwaveKey || initialized.current) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    
    script.onload = () => {
      initialized.current = true;
      
      window.FlutterwaveCheckout({
        public_key: flutterwaveKey,
        tx_ref: `plan_${planId}_${Date.now()}`,
        amount: planPrice,
        currency: currency.toUpperCase(),
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: 'user@example.com', // Should be dynamic
          phone_number: '',
          name: 'Customer',
        },
        customizations: {
          title: 'Plan Subscription',
          description: 'Payment for subscription plan',
          logo: '',
        },
        callback: function (data: any) {
          if (data.status === 'successful') {
            processPayment('flutterwave', {
              planId,
              billingCycle,
              couponCode,
              payment_id: data.transaction_id,
              tx_ref: data.tx_ref,
            });
          } else {
            toast.error(t('Payment was not completed'));
            onCancel();
          }
        },
        onclose: function () {
          onCancel();
        },
      });
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [flutterwaveKey, planId, billingCycle, couponCode, currency]);

  if (!flutterwaveKey) {
    return <div className="p-4 text-center text-red-500">{t('Flutterwave not configured')}</div>;
  }

  return (
    <div className="p-4 text-center">
      <p>{t('Redirecting to Flutterwave...')}</p>
    </div>
  );
}

declare global {
  interface Window {
    FlutterwaveCheckout?: any;
  }
}