import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { router } from '@inertiajs/react';

interface AuthorizeNetPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
  authorizenetMerchantId: string;
  currency?: string;
  isSandbox?: boolean;
  supportedCountries?: string[];
  supportedCurrencies?: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function AuthorizeNetPaymentForm({
  planId,
  planPrice,
  couponCode,
  billingCycle,
  authorizenetMerchantId,
  currency = 'USD',
  isSandbox = false,
  supportedCountries = ['US', 'CA', 'GB', 'AU'],
  supportedCurrencies = ['USD', 'CAD', 'CHF', 'DKK', 'EUR', 'GBP', 'NOK', 'PLN', 'SEK', 'AUD', 'NZD'],
  onSuccess,
  onCancel,
}: AuthorizeNetPaymentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [cardData, setCardData] = useState({
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    cardholder_name: '',
  });

  // Validation functions
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '');
    return /^[0-9]{13,19}$/.test(cleaned);
  };

  const validateExpiryMonth = (month: string): boolean => {
    return /^(0[1-9]|1[0-2])$/.test(month);
  };

  const validateExpiryYear = (year: string): boolean => {
    if (!/^[0-9]{2}$/.test(year)) return false;
    const currentYear = new Date().getFullYear() % 100;
    const inputYear = parseInt(year);
    return inputYear >= currentYear && inputYear <= currentYear + 20;
  };

  const validateCVV = (cvv: string): boolean => {
    return /^[0-9]{3,4}$/.test(cvv);
  };

  const validateCardholderName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'card_number') {
      formattedValue = formatCardNumber(value.replace(/\s/g, '').slice(0, 19));
    } else if (field === 'expiry_month') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
    } else if (field === 'expiry_year') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!validateCardNumber(cardData.card_number)) {
      errors.card_number = t('Please enter a valid card number (13-19 digits)');
    }
    
    if (!validateExpiryMonth(cardData.expiry_month)) {
      errors.expiry_month = t('Please enter a valid month (01-12)');
    }
    
    if (!validateExpiryYear(cardData.expiry_year)) {
      errors.expiry_year = t('Please enter a valid year (current year or later)');
    }
    
    if (!validateCVV(cardData.cvv)) {
      errors.cvv = t('Please enter a valid CVV (3-4 digits)');
    }
    
    if (!validateCardholderName(cardData.cardholder_name)) {
      errors.cardholder_name = t('Please enter a valid cardholder name (2-50 characters)');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!authorizenetMerchantId) {
      setError(t('AuthorizeNet not configured'));
      return;
    }

    if (!validateForm()) {
      setError(t('Please correct the errors below'));
      return;
    }

    setIsLoading(true);
    setError(null);

    router.post(route('authorizenet.payment'), {
      plan_id: planId,
      billing_cycle: billingCycle,
      coupon_code: couponCode,
      ...cardData,
    }, {
      onSuccess: () => {
        toast.success(t('Payment successful'));
        onSuccess();
      },
      onError: (errors) => {
        console.error('Payment processing error:', errors);
        setError(Object.values(errors).flat().join(', '));
        setIsLoading(false);
      },
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('AuthorizeNet Payment')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('Total Amount')}</span>
            <span className="text-lg font-bold">{formatPrice(planPrice)}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {t('Billing Cycle')}: {t(billingCycle)}
          </div>
          {couponCode && (
            <div className="text-sm text-green-600 mt-1">
              {t('Coupon Applied')}: {couponCode}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cardholder_name">{t('Cardholder Name')}</Label>
            <Input
              id="cardholder_name"
              value={cardData.cardholder_name}
              onChange={(e) => handleInputChange('cardholder_name', e.target.value)}
              placeholder={t('Enter cardholder name')}
              className={validationErrors.cardholder_name ? 'border-red-500' : ''}
            />
            {validationErrors.cardholder_name && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.cardholder_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="card_number">{t('Card Number')}</Label>
            <Input
              id="card_number"
              value={cardData.card_number}
              onChange={(e) => handleInputChange('card_number', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={23}
              className={validationErrors.card_number ? 'border-red-500' : ''}
            />
            {validationErrors.card_number && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.card_number}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiry_month">{t('Month')}</Label>
              <Input
                id="expiry_month"
                value={cardData.expiry_month}
                onChange={(e) => handleInputChange('expiry_month', e.target.value)}
                placeholder="MM"
                maxLength={2}
                className={validationErrors.expiry_month ? 'border-red-500' : ''}
              />
              {validationErrors.expiry_month && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.expiry_month}</p>
              )}
            </div>
            <div>
              <Label htmlFor="expiry_year">{t('Year')}</Label>
              <Input
                id="expiry_year"
                value={cardData.expiry_year}
                onChange={(e) => handleInputChange('expiry_year', e.target.value)}
                placeholder="YY"
                maxLength={2}
                className={validationErrors.expiry_year ? 'border-red-500' : ''}
              />
              {validationErrors.expiry_year && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.expiry_year}</p>
              )}
            </div>
            <div>
              <Label htmlFor="cvv">{t('CVV')}</Label>
              <Input
                id="cvv"
                value={cardData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="123"
                maxLength={4}
                className={validationErrors.cvv ? 'border-red-500' : ''}
              />
              {validationErrors.cvv && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.cvv}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !authorizenetMerchantId}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Processing...')}
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {t('Pay with AuthorizeNet')}
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          {isSandbox && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('Test Mode: This is a sandbox transaction. No real money will be charged.')}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {t('Powered by AuthorizeNet - Secure payment processing')}
            </div>
            <div>
              {t('Supported currencies')}: {supportedCurrencies.join(', ')}
            </div>
            <div>
              {t('Supported countries')}: {supportedCountries.join(', ')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}