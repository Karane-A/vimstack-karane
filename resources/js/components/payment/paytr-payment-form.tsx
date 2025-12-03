import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import axios from 'axios';

interface PayTRPaymentFormProps {
  planId: number;
  couponCode: string;
  billingCycle: 'monthly' | 'yearly';
  planPrice: number;
  paytrMerchantId: string;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PayTRPaymentForm({
  planId,
  couponCode,
  billingCycle,
  planPrice,
  paytrMerchantId,
  currency,
  onSuccess,
  onCancel
}: PayTRPaymentFormProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // Listen for iframe messages
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.paytr.com') return;
      
      if (event.data === 'success') {
        setShowIframe(false);
        onSuccess();
      } else if (event.data === 'fail') {
        setShowIframe(false);
        toast.error(t('Payment failed'));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      toast.error(t('Please fill in required customer details'));
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(route('paytr.create-token'), {
        plan_id: planId,
        billing_cycle: billingCycle,
        coupon_code: couponCode,
        user_name: customerDetails.name,
        user_email: customerDetails.email,
        user_phone: customerDetails.phone,
        user_address: customerDetails.address
      });

      if (response.data.success) {
        setIframeUrl(response.data.iframe_url);
        setShowIframe(true);
      } else {
        throw new Error(response.data.error || 'Token creation failed');
      }
    } catch (error: any) {
      console.error('PayTR payment error:', error);
      toast.error(error.response?.data?.error || t('Payment failed. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (showIframe) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('PayTR Payment')}
            </span>
            <Button variant="outline" size="sm" onClick={() => setShowIframe(false)}>
              {t('Back')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] border rounded-lg overflow-hidden">
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="auto"
              title="PayTR Payment"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t('Complete your payment in the secure PayTR iframe above')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t('PayTR Payment')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('Full Name')} *</Label>
            <Input
              id="name"
              value={customerDetails.name}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('Enter full name')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('Email Address')} *</Label>
            <Input
              id="email"
              type="email"
              value={customerDetails.email}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
              placeholder={t('Enter email address')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('Phone Number')} *</Label>
            <Input
              id="phone"
              value={customerDetails.phone}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+905xxxxxxxxx"
              required
            />
            <p className="text-xs text-muted-foreground">
              {t('Turkish phone number format: +905xxxxxxxxx')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('Address')}</Label>
            <Input
              id="address"
              value={customerDetails.address}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
              placeholder={t('Enter address (optional)')}
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium">{t('Secure Payment via PayTR')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Credit Card, Debit Card - Real-time payment processing')}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              {t('Cancel')}
            </Button>
            <Button type="submit" disabled={isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Processing...')}
                </>
              ) : (
                t('Pay {{amount}}', { amount: `${planPrice} ${currency}` })
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}