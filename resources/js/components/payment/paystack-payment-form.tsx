import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import { usePaymentProcessor } from '@/hooks/usePaymentProcessor';

interface PaystackPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: string;
  paystackKey: string;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaystackPaymentForm({ 
  planId, 
  planPrice,
  couponCode, 
  billingCycle, 
  paystackKey,
  currency,
  onSuccess, 
  onCancel 
}: PaystackPaymentFormProps) {
  const { t } = useTranslation();
  const initialized = useRef(false);

  const { processPayment } = usePaymentProcessor({
    onSuccess,
    onError: (error) => toast.error(error)
  });

  useEffect(() => {
    if (!paystackKey || initialized.current) return;

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      initialized.current = true;
      
      // Hide parent modal temporarily
      const modalBackdrop = document.querySelector('[data-radix-dialog-overlay]');
      if (modalBackdrop) {
        (modalBackdrop as HTMLElement).style.display = 'none';
      }
      
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: 'user@example.com', // Should be dynamic
        amount: Math.round(Number(planPrice) * 100), // Convert to kobo as integer
        currency: currency.toUpperCase(),
        callback: function(response: any) {
          // Restore modal backdrop
          if (modalBackdrop) {
            (modalBackdrop as HTMLElement).style.display = '';
          }
          processPayment('paystack', {
            planId,
            billingCycle,
            couponCode,
            payment_id: response.reference,
          });
        },
        onClose: function() {
          // Restore modal backdrop
          if (modalBackdrop) {
            (modalBackdrop as HTMLElement).style.display = '';
          }
          onCancel();
        }
      });
      
      handler.openIframe();
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [paystackKey, planId, billingCycle, couponCode, currency]);

  if (!paystackKey) {
    return <div className="p-4 text-center text-red-500">{t('Paystack not configured')}</div>;
  }

  return (
    <div className="p-4 text-center">
      <p>{t('Redirecting to Paystack...')}</p>
    </div>
  );
}

declare global {
  interface Window {
    PaystackPop?: any;
  }
}