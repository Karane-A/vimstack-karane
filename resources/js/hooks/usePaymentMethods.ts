import { useState, useEffect } from 'react';
import axios from 'axios';

interface PaymentMethodConfig {
  enabled: boolean;
  [key: string]: any;
}

interface PaymentMethods {
  stripe?: PaymentMethodConfig;
  paypal?: PaymentMethodConfig;
  razorpay?: PaymentMethodConfig;
  mercadopago?: PaymentMethodConfig;
  bank?: PaymentMethodConfig;
  cashfree?: PaymentMethodConfig;
  payfast?: PaymentMethodConfig;
}

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(route('payment.enabled-methods'));
      setPaymentMethods(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payment methods');
      console.error('Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const getEnabledMethods = () => {
    return Object.entries(paymentMethods)
      .filter(([_, config]) => config.enabled)
      .map(([method, config]) => ({ method, config }));
  };

  const isMethodEnabled = (method: string) => {
    return paymentMethods[method as keyof PaymentMethods]?.enabled || false;
  };

  const getMethodConfig = (method: string) => {
    return paymentMethods[method as keyof PaymentMethods] || null;
  };

  return {
    paymentMethods,
    loading,
    error,
    refetch: fetchPaymentMethods,
    getEnabledMethods,
    isMethodEnabled,
    getMethodConfig
  };
}