import axios from 'axios';

// Razorpay SDK types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayPaymentData {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  order_id: number;
  order_number: string;
}

interface OrderData {
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
  notes?: string;
  whatsapp_number?: string;
}

// Load Razorpay SDK
const loadRazorpaySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.head.appendChild(script);
  });
};

// Handle Razorpay payment
const handleRazorpayPayment = async (
  orderData: OrderData,
  storeSlug: string
): Promise<{ success: boolean; orderNumber?: string; error?: string }> => {
  try {
    // Create order via API
    const formData = new FormData();
    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await axios.post(
      route('store.order.place', { storeSlug }),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create order');
    }

    const paymentData: RazorpayPaymentData = response.data.payment_data;
    
    // Load Razorpay SDK
    await loadRazorpaySDK();

    // Create Razorpay payment
    return new Promise((resolve) => {
      const options: RazorpayOptions = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Store Order',
        description: `Order #${paymentData.order_number}`,
        order_id: paymentData.razorpay_order_id,
        handler: async (razorpayResponse: any) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              route('store.razorpay.verify', { storeSlug }),
              {
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                order_id: paymentData.order_id,
              }
            );

            if (verifyResponse.data.success) {
              resolve({
                success: true,
                orderNumber: verifyResponse.data.order_number,
              });
            } else {
              resolve({
                success: false,
                error: verifyResponse.data.error || 'Payment verification failed',
              });
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            resolve({
              success: false,
              error: error.response?.data?.error || 'Payment verification failed',
            });
          }
        },
        prefill: {
          name: `${orderData.customer_first_name} ${orderData.customer_last_name}`,
          email: orderData.customer_email,
          contact: orderData.customer_phone,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              error: 'Payment cancelled by user',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  } catch (error: any) {
    console.error('Razorpay payment error:', error);
    console.error('Response data:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Payment failed',
    };
  }
};

// Main order placement handler
export const handleOrderPlacement = async (
  orderData: OrderData,
  storeSlug: string,
  onSuccess: (orderNumber: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    if (orderData.payment_method === 'razorpay') {
      const result = await handleRazorpayPayment(orderData, storeSlug);
      
      if (result.success && result.orderNumber) {
        onSuccess(result.orderNumber);
      } else {
        onError(result.error || 'Payment failed');
      }
    } else {
      // Handle other payment methods with form submission
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = route('store.order.place', { storeSlug });
      
      // Add CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }
      
      // Add form data
      Object.entries(orderData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      });
      
      document.body.appendChild(form);
      form.submit();
    }
  } catch (error: any) {
    console.error('Order placement error:', error);
    onError(error.message || 'Failed to place order');
  }
};

export default {
  handleOrderPlacement,
  handleRazorpayPayment,
  loadRazorpaySDK,
};