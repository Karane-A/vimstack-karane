import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { router } from '@inertiajs/react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ToyyibPayPaymentFormProps {
  planId: number;
  couponCode: string;
  billingCycle: 'monthly' | 'yearly';
  planPrice: number;
  toyyibpayCategoryCode: string;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ToyyibPayPaymentForm({
  planId,
  couponCode,
  billingCycle,
  planPrice,
  toyyibpayCategoryCode,
  currency,
  onSuccess,
  onCancel
}: ToyyibPayPaymentFormProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!customerDetails.name.trim()) {
      newErrors.name = t('Full name is required');
    }
    
    if (!customerDetails.email.trim()) {
      newErrors.email = t('Email address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = t('Please enter a valid email address');
    }
    
    if (!customerDetails.phone.trim()) {
      newErrors.phone = t('Phone number is required');
    } else if (customerDetails.phone.length < 10) {
      newErrors.phone = t('Please enter a valid Malaysian phone number');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('Please fix the form errors'));
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      const formData = {
        plan_id: planId,
        billing_cycle: billingCycle,
        coupon_code: couponCode || '',
        billName: `Plan Subscription - ${planId}`,
        billDescription: `${billingCycle} subscription for ${customerDetails.name}`,
        billAmount: planPrice,
        billTo: customerDetails.name.trim(),
        billEmail: customerDetails.email.trim(),
        billPhone: customerDetails.phone.trim()
      };

      // Create form and submit to handle redirect properly
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = route('toyyibpay.payment');
      
      // Add CSRF token
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = '_token';
      csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      form.appendChild(csrfInput);
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('ToyyibPay payment error:', error);
      toast.error(t('Payment failed. Please try again.'));
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/[^0-9]/g, '');
    
    // If starts with 60, keep as is
    if (digits.startsWith('60')) {
      return digits.slice(0, 12); // Limit to 12 digits
    }
    
    // If starts with 0, replace with 60
    if (digits.startsWith('0')) {
      return '60' + digits.slice(1, 11); // Limit to 12 digits total
    }
    
    // If doesn't start with 60 or 0, add 60 prefix
    return '60' + digits.slice(0, 10); // Limit to 12 digits total
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('toyyibPay Payment')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('You will be redirected to toyyibPay to complete your payment securely via FPX (Malaysian Online Banking)')}
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('Full Name')} *</Label>
            <Input
              id="name"
              value={customerDetails.name}
              onChange={(e) => {
                setCustomerDetails(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder={t('Enter your full name')}
              className={errors.name ? 'border-red-500' : ''}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('Email Address')} *</Label>
            <Input
              id="email"
              type="email"
              value={customerDetails.email}
              onChange={(e) => {
                setCustomerDetails(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder={t('Enter your email address')}
              className={errors.email ? 'border-red-500' : ''}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('Phone Number')} *</Label>
            <Input
              id="phone"
              value={customerDetails.phone}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setCustomerDetails(prev => ({ ...prev, phone: formatted }));
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
              }}
              placeholder="60123456789"
              className={errors.phone ? 'border-red-500' : ''}
              maxLength={12}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t('Malaysian format: 60123456789 (numbers only)')}
            </p>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">{t('Payment Method: FPX (Online Banking)')}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('Secure payment via Malaysian banks including Maybank, CIMB, Public Bank, RHB, and more')}
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">{t('Total Amount')}:</span>
              <span className="text-lg font-bold">{currency} {planPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isProcessing}>
                {t('Cancel')}
              </Button>
              <Button type="submit" disabled={isProcessing} className="flex-1">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Processing...')}
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t('Pay Now')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}