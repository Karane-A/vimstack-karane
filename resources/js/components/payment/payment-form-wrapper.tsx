import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { StripePaymentForm } from './stripe-payment-form';
import { RazorpayPaymentForm } from './razorpay-payment-form';
import { PaypalPaymentForm } from './paypal-payment-form';
import { BankTransferForm } from './bank-transfer-form';
import { MercadopagoPaymentForm } from './mercadopago-payment-form';

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  config: any;
}

interface PaymentFormWrapperProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentFormWrapper({
  planId,
  planPrice,
  couponCode = '',
  billingCycle,
  onSuccess,
  onCancel
}: PaymentFormWrapperProps) {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(route('payment.methods'));
      const data = await response.json();
      
      const methods: PaymentMethod[] = [];
      
      if (data.is_stripe_enabled) {
        methods.push({
          id: 'stripe',
          name: 'Credit Card (Stripe)',
          enabled: true,
          config: {
            key: data.stripe_key,
            secret: data.stripe_secret
          }
        });
      }
      
      if (data.is_paypal_enabled) {
        methods.push({
          id: 'paypal',
          name: 'PayPal',
          enabled: true,
          config: {
            mode: data.paypal_mode,
            client_id: data.paypal_client_id,
            secret: data.paypal_secret_key
          }
        });
      }
      
      if (data.is_razorpay_enabled) {
        methods.push({
          id: 'razorpay',
          name: 'Razorpay',
          enabled: true,
          config: {
            key: data.razorpay_key,
            secret: data.razorpay_secret
          }
        });
      }
      
      if (data.is_mercadopago_enabled) {
        methods.push({
          id: 'mercadopago',
          name: 'Mercado Pago',
          enabled: true,
          config: {
            mode: data.mercadopago_mode,
            access_token: data.mercadopago_access_token
          }
        });
      }
      
      if (data.is_bank_enabled) {
        methods.push({
          id: 'bank',
          name: 'Bank Transfer',
          enabled: true,
          config: {
            details: data.bank_detail
          }
        });
      }
      
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedMethod(methods[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return null;

    const commonProps = {
      planId,
      planPrice,
      couponCode,
      billingCycle,
      onSuccess,
      onCancel
    };

    switch (selectedMethod) {
      case 'stripe':
        return (
          <StripePaymentForm
            {...commonProps}
            stripeKey={method.config.key}
          />
        );
      
      case 'razorpay':
        return (
          <RazorpayPaymentForm
            {...commonProps}
            razorpayKey={method.config.key}
          />
        );
      
      case 'paypal':
        return (
          <PaypalPaymentForm
            {...commonProps}
            paypalConfig={method.config}
          />
        );
      
      case 'mercadopago':
        return (
          <MercadopagoPaymentForm
            {...commonProps}
            mercadopagoConfig={method.config}
          />
        );
      
      case 'bank':
        return (
          <BankTransferForm
            {...commonProps}
            bankDetails={method.config.details}
          />
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          {t('Loading payment methods...')}
        </CardContent>
      </Card>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t('No payment methods available')}</p>
          <Button variant="outline" onClick={onCancel} className="mt-4">
            {t('Cancel')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Choose Payment Method')}</CardTitle>
        <CardDescription>
          {t('Select your preferred payment method to complete the subscription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length > 1 && (
          <div className="grid grid-cols-1 gap-2">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium">{method.name}</span>
              </label>
            ))}
          </div>
        )}
        
        <div className="mt-6">
          {renderPaymentForm()}
        </div>
      </CardContent>
    </Card>
  );
}