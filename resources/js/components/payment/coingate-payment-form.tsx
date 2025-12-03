import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Coins, Info } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { router } from '@inertiajs/react';

interface CoinGatePaymentFormProps {
  planId: number;
  couponCode: string;
  billingCycle: 'monthly' | 'yearly';
  planPrice: number;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CoinGatePaymentForm({
  planId,
  couponCode,
  billingCycle,
  planPrice,
  currency,
  onSuccess,
  onCancel
}: CoinGatePaymentFormProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Create form and submit directly to avoid CORS
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = route('coingate.payment');
    
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
    const formData = {
      plan_id: planId,
      billing_cycle: billingCycle,
      coupon_code: couponCode || '',
      crypto_currency: 'BTC'
    };
    
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-orange-500" />
          {t('CoinGate Cryptocurrency Payment')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {t('You will be redirected to CoinGate to complete your cryptocurrency payment securely.')}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('Plan')}</span>
              <span className="text-sm">{t(billingCycle)} {t('billing')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('Amount')}</span>
              <span className="text-lg font-bold">{currency} {planPrice}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('Final cryptocurrency amount will be calculated at checkout based on current exchange rates')}
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">{t('Payment Process:')}</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>{t('Click "Pay with Crypto" to proceed to CoinGate')}</li>
                  <li>{t('Complete payment using your selected cryptocurrency')}</li>
                  <li>{t('You will be redirected back after payment completion')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="flex-1"
              disabled={isProcessing}
            >
              {t('Cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing} 
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Redirecting...')}
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  {t('Pay with Crypto')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}