import axios from 'axios';

// Extend Window interface for Cashfree and route
declare global {
  interface Window {
    Cashfree: any;
    route: (name: string, params?: any) => string;
  }
}

export interface CashfreePaymentData {
  store_id: number;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_country: string;
  payment_method: string;
  shipping_method_id?: number | null;
  notes?: string;
  coupon_code?: string | null;
  whatsapp_number?: string | null;
}

export interface CashfreePaymentResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Load Cashfree SDK
 */
export const loadCashfreeSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.body.appendChild(script);
  });
};

/**
 * Handle Cashfree payment process
 */
export const handleCashfreePayment = async (
  orderData: CashfreePaymentData,
  storeSlug: string
): Promise<CashfreePaymentResult> => {
  try {
    // Load Cashfree SDK if not already loaded
    if (!window.Cashfree) {
      await loadCashfreeSDK();
    }
    
    // Submit the order with Cashfree payment method
    const formData = new FormData();
    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    const response = await axios.post(
      window.route('store.order.place', { storeSlug }),
      formData,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      }
    );
    
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    
    if (response.data.errors) {
      const errorMessages = Object.values(response.data.errors).flat().join(', ');
      throw new Error(errorMessages);
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
    const cashfree = window.Cashfree({
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
        await axios.post(window.route('store.cashfree.verify-payment', { storeSlug }), {
          order_id: order_id,
          cf_payment_id: result.paymentDetails?.paymentId,
        }, {
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          }
        });
        
        // Return success with redirect URL
        return {
          success: true,
          redirectUrl: window.route('store.order-confirmation', { storeSlug, orderNumber: order_number })
        };
      } catch (verifyError: any) {
        const errorMsg = verifyError.response?.data?.error || 'Payment verification failed';
        throw new Error(errorMsg);
      }
    } else {
      throw new Error('Payment status unclear');
    }
    
  } catch (error: any) {
    console.error('Cashfree payment error:', error);
    console.error('Response data:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Payment failed. Please try again.'
    };
  }
};

/**
 * Handle order placement with proper Cashfree support
 */
export const handleOrderPlacement = async (
  orderData: CashfreePaymentData,
  storeSlug: string,
  onError: (error: string) => void
): Promise<void> => {
  // Handle Cashfree payment with AJAX
  if (orderData.payment_method === 'cashfree') {
    const result = await handleCashfreePayment(orderData, storeSlug);
    
    if (result.success && result.redirectUrl) {
      window.location.href = result.redirectUrl;
    } else if (result.error) {
      onError(result.error);
    }
    return;
  }

  // Use form submission for other payment methods
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = window.route('store.order.place', { storeSlug });
  
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_token';
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);
  }
  
  Object.entries(orderData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    }
  });
  
  document.body.appendChild(form);
  form.submit();
};