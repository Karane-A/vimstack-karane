import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import axios from 'axios';

interface MercadoPagoPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: 'monthly' | 'yearly';
  accessToken: string;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MercadoPagoPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  accessToken,
  currency = 'BRL',
  onSuccess,
  onCancel
}: MercadoPagoPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Payment method using redirect flow
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Create a preference and redirect to MercadoPago checkout
      const response = await axios.post(route('mercadopago.create-preference'), {
        plan_id: planId,
        billing_cycle: billingCycle,
        coupon_code: couponCode || undefined
      }, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.data.redirect_url) {
        // Redirect to MercadoPago checkout
        window.location.href = response.data.redirect_url;
      } else {
        toast.error(t('Failed to create payment preference'));
        setIsLoading(false);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || t('Failed to create payment preference');
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t('You will be redirected to MercadoPago to complete your payment.')}
      </p>
      
      <div className="flex gap-3 mt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
          {t('Cancel')}
        </Button>
        <Button 
          onClick={handlePayment}
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('Processing...')}
            </>
          ) : (
            t('Pay with MercadoPago')
          )}
        </Button>
      </div>
    </div>
  );
}