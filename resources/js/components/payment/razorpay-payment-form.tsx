import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

interface RazorpayPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: 'monthly' | 'yearly';
  razorpayKey: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RazorpayPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  razorpayKey,
  currency = 'INR',
  onSuccess,
  onCancel
}: RazorpayPaymentFormProps) {
  const { t } = useTranslation();
  const { props } = usePage();
  const superadminTitle = (props as any).superadminSettings?.titleText || 'Vimstack';
  
  useEffect(() => {
    // Check if Razorpay script is already loaded
    if (window && (window as any).Razorpay) {
      return;
    }
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onerror = () => {
      toast.error(t('Failed to load Razorpay checkout. Please try again.'));
    };
    document.body.appendChild(script);
    
    return () => {
      // Only remove if we added it
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  const handlePayment = async () => {
    try {
      // Create order on the server
      const response = await axios.post(route('razorpay.create-order'), {
        plan_id: planId,
        billing_cycle: billingCycle,
        coupon_code: couponCode
      });
      
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      
      const { order_id, amount } = response.data;
      
      if (!order_id || !amount) {
        toast.error(t('Invalid response from server'));
        return;
      }
      
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: currency,
        name: superadminTitle,
        description: 'Plan Subscription',
        order_id: order_id,
        handler: function(response: any) {
          // Verify payment on server
          axios.post(route('razorpay.verify-payment'), {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            plan_id: planId,
            billing_cycle: billingCycle,
            coupon_code: couponCode
          })
          .then(() => {
            onSuccess();
          })
          .catch((error) => {
            const errorMsg = error.response?.data?.error || t('Payment verification failed');
            toast.error(errorMsg);
          });
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: onCancel
        }
      };
      
      if (!(window as any).Razorpay) {
        toast.error(t('Razorpay SDK not loaded'));
        return;
      }
      
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || t('Failed to initialize payment');
      toast.error(errorMsg);
      console.error('Razorpay error:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t('You will be redirected to Razorpay to complete your payment.')}
      </p>
      
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {t('Cancel')}
        </Button>
        <Button onClick={handlePayment} className="flex-1">
          {t('Pay with Razorpay')}
        </Button>
      </div>
    </div>
  );
}