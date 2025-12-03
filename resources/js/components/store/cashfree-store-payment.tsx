import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import '../../css/cashfree-modal-fix.css';

interface CashfreeStorePaymentProps {
  storeSlug: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CashfreeStorePayment({
  storeSlug,
  onSuccess,
  onCancel
}: CashfreeStorePaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if Cashfree SDK is already loaded
    if (window && (window as any).Cashfree) {
      return;
    }
    
    // Load Cashfree SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onerror = () => {
      setError('Failed to load Cashfree SDK. Please try again.');
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
    setIsLoading(true);
    setError(null);
    
    try {
      if (!(window as any).Cashfree) {
        throw new Error('Cashfree SDK not loaded');
      }
      
      // Get the form data from the checkout form
      const form = document.querySelector('form') as HTMLFormElement;
      if (!form) {
        throw new Error('Checkout form not found');
      }
      
      const formData = new FormData(form);
      
      // Add payment method
      formData.set('payment_method', 'cashfree');
      
      // Submit the order with Cashfree payment method
      const response = await axios.post(
        `/store/${storeSlug}/order/place`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Requested-With': 'XMLHttpRequest',
          }
        }
      );
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      if (!response.data.success || response.data.payment_method !== 'cashfree') {
        throw new Error('Invalid response from server');
      }
      
      const {
        payment_session_id,
        cashfree_order_id,
        mode,
        public_key,
        order_id,
        order_number,
        return_url
      } = response.data;
      
      if (!payment_session_id || !cashfree_order_id) {
        throw new Error('Invalid payment session data');
      }
      
      // Initialize Cashfree with mode
      const cashfreeMode = mode === 'production' ? 'PROD' : 'SANDBOX';
      const cashfree = (window as any).Cashfree({
        mode: cashfreeMode
      });
      
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        returnUrl: return_url,
        redirectTarget: '_modal',
        mode: cashfreeMode,
        style: {
          zIndex: 99999
        }
      };
      
      // Open Cashfree checkout
      const result = await cashfree.checkout(checkoutOptions);
      
      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      }
      
      if (result.paymentDetails) {
        // Payment completed, verify on server
        try {
          await axios.post(`/store/${storeSlug}/cashfree/verify-payment`, {
            order_id: order_id,
            cf_payment_id: result.paymentDetails?.paymentId,
            _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
          });
          
          onSuccess();
        } catch (verifyError: any) {
          const errorMsg = verifyError.response?.data?.error || 'Payment verification failed';
          throw new Error(errorMsg);
        }
      } else {
        throw new Error('Payment status unclear');
      }
      
    } catch (error: any) {
      console.error('Cashfree payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You will be redirected to Cashfree to complete your payment securely.
      </p>
      
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePayment} 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Pay with Cashfree'}
        </Button>
      </div>
    </div>
  );
}