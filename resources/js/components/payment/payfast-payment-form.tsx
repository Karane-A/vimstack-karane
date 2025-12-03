import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { router } from '@inertiajs/react';

interface PayfastPaymentFormProps {
  planId: number;
  couponCode: string;
  billingCycle: 'monthly' | 'yearly';
  planPrice: number;
  payfastMerchantId: string;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PayfastPaymentForm({
  planId,
  couponCode,
  billingCycle,
  planPrice,
  payfastMerchantId,
  currency,
  onSuccess,
  onCancel
}: PayfastPaymentFormProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!customerDetails.firstName.trim()) {
      newErrors.firstName = t('First name is required');
    }
    
    if (!customerDetails.lastName.trim()) {
      newErrors.lastName = t('Last name is required');
    }
    
    if (!customerDetails.email.trim()) {
      newErrors.email = t('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = t('Please enter a valid email address');
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      toast.error(t('Please fix the errors below'));
      return;
    }
    
    if (planPrice < 5) {
      toast.error(t('Minimum payment amount is R5.00'));
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch(route('payfast.payment'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          plan_id: planId,
          billing_cycle: billingCycle,
          coupon_code: couponCode,
          customer_details: customerDetails
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Create and submit form to PayFast
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.action;
        form.innerHTML = data.inputs;
        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error(data.error || t('Payment failed'));
        setIsProcessing(false);
      }
      
    } catch (error) {
      console.error('PayFast payment error:', error);
      toast.error(t('Payment failed. Please try again.'));
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('Payfast Payment')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
          <input type="hidden" name="plan_id" value={planId} />
          <input type="hidden" name="billing_cycle" value={billingCycle} />
          <input type="hidden" name="coupon_code" value={couponCode || ''} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('First Name')}</Label>
              <Input
                id="firstName"
                name="customer_details[firstName]"
                value={customerDetails.firstName}
                onChange={(e) => {
                  setCustomerDetails(prev => ({ ...prev, firstName: e.target.value }));
                  if (errors.firstName) {
                    setErrors(prev => ({ ...prev, firstName: '' }));
                  }
                }}
                placeholder={t('Enter first name')}
                className={errors.firstName ? 'border-red-500' : ''}
                required
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('Last Name')}</Label>
              <Input
                id="lastName"
                name="customer_details[lastName]"
                value={customerDetails.lastName}
                onChange={(e) => {
                  setCustomerDetails(prev => ({ ...prev, lastName: e.target.value }));
                  if (errors.lastName) {
                    setErrors(prev => ({ ...prev, lastName: '' }));
                  }
                }}
                placeholder={t('Enter last name')}
                className={errors.lastName ? 'border-red-500' : ''}
                required
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('Email Address')}</Label>
            <Input
              id="email"
              name="customer_details[email]"
              type="email"
              value={customerDetails.email}
              onChange={(e) => {
                setCustomerDetails(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              placeholder={t('Enter email address')}
              className={errors.email ? 'border-red-500' : ''}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {t('You will be redirected to Payfast to complete the payment')}
            </p>
          </div>

          {planPrice < 5 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('PayFast requires a minimum payment of R5.00. Current amount: {{currency}} {{amount}}', {
                  currency,
                  amount: planPrice
                })}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('Amount')}</span>
              <span className="text-sm font-bold">{currency} {planPrice}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Secure payment processing via PayFast')}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              {t('Cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || planPrice < 5} 
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Processing...')}
                </>
              ) : (
                t('Pay {{amount}}', { amount: `${currency} ${planPrice}` })
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}