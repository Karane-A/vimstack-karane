import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag, Loader2 } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { StripePaymentForm } from './stripe-payment-form';
import { PayPalPaymentForm } from './paypal-payment-form';
import { BankTransferForm } from './bank-transfer-form';
import { RazorpayPaymentForm } from './razorpay-payment-form';
import { MercadoPagoPaymentForm } from './mercadopago-payment-form';
import { PaystackPaymentForm } from './paystack-payment-form';
import { FlutterwavePaymentForm } from './flutterwave-payment-form';
import { PayTabsPaymentForm } from './paytabs-payment-form';
import { SkrillPaymentForm } from './skrill-payment-form';
import { CoinGatePaymentForm } from './coingate-payment-form';
import { PayfastPaymentForm } from './payfast-payment-form';
import { ToyyibPayPaymentForm } from './toyyibpay-payment-form';
import { PayTRPaymentForm } from './paytr-payment-form';
import { MolliePaymentForm } from './mollie-payment-form';
import { CashfreePaymentForm } from './cashfree-payment-form';
import { IyzipayPaymentForm } from './iyzipay-payment-form';
import { BenefitPaymentForm } from './benefit-payment-form';
import { OzowPaymentForm } from './ozow-payment-form';
import { EasebuzzPaymentForm } from './easebuzz-payment-form';
import { KhaltiPaymentForm } from './khalti-payment-form';
import { AuthorizeNetPaymentForm } from './authorizenet-payment-form';
import { FedaPayPaymentForm } from './fedapay-payment-form';
import { PayHerePaymentForm } from './payhere-payment-form';
import { CinetPayPaymentForm } from './cinetpay-payment-form';
import { PaiementPaymentForm } from './paiement-payment-form';
import { NepalstePaymentForm } from './nepalste-payment-form';
import { YooKassaPaymentForm } from './yookassa-payment-form';
import { AamarpayPaymentForm } from './aamarpay-payment-form';
import { MidtransPaymentForm } from './midtrans-payment-form';
import { PaymentWallPaymentForm } from './paymentwall-payment-form';
import { SSPayPaymentForm } from './sspay-payment-form';
import { TapPaymentForm } from './tap-payment-form';
import { XenditPaymentForm } from './xendit-payment-form';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface PaymentProcessorProps {
  plan: {
    id: number;
    name: string;
    price: string | number;
    formatted_price?: string;
    duration: string;
    paymentMethods?: any;
  };
  billingCycle: 'monthly' | 'yearly';
  paymentMethods: PaymentMethod[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentProcessor({ 
  plan, 
  billingCycle, 
  paymentMethods, 
  onSuccess, 
  onCancel 
}: PaymentProcessorProps) {
  const { t } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const originalPrice = Number(plan.price);
  const discountAmount = appliedCoupon ? (appliedCoupon.type === 'percentage' ? (originalPrice * appliedCoupon.value / 100) : appliedCoupon.value) : 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  
  // Helper function to format currency consistently
  const formatPrice = (amount: number) => {
    if (plan.formatted_price) {
      // Extract currency symbol and format from formatted_price
      const formattedOriginal = plan.formatted_price;
      const symbol = formattedOriginal.replace(/[\d.,\s]/g, '');
      const isSymbolBefore = formattedOriginal.indexOf(symbol) < formattedOriginal.search(/\d/);
      return isSymbolBefore ? `${symbol}${amount.toFixed(2)}` : `${amount.toFixed(2)}${symbol}`;
    }
    return `$${amount.toFixed(2)}`; // Fallback
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(t('Please enter a coupon code'));
      return;
    }
    
    setCouponLoading(true);
    try {
      const response = await fetch(route('coupons.validate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          coupon_code: couponCode,
          plan_id: plan.id,
          amount: originalPrice
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        toast.success(t('Coupon applied successfully'));
      } else {
        toast.error(data.message || t('Invalid coupon code'));
        setAppliedCoupon(null);
      }
    } catch (error) {
      toast.error(t('Failed to validate coupon'));
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handlePayNow = () => {
    if (!selectedPaymentMethod) {
      toast.error(t('Please select a payment method'));
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedPaymentMethod('');
  };

  const enabledPaymentMethods = paymentMethods.filter(method => method.enabled);

  const renderPaymentForm = () => {
    const commonProps = {
      planId: plan.id,
      couponCode,
      billingCycle,
      onSuccess,
      onCancel: handlePaymentCancel,
    };

    switch (selectedPaymentMethod) {
      case 'stripe':
        return (
          <StripePaymentForm
            {...commonProps}
            stripeKey={plan.paymentMethods?.stripe_key || ''}
          />
        );
      case 'paypal':
        return (
          <PayPalPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            paypalClientId={plan.paymentMethods?.paypal_client_id || ''}
            currency={plan.paymentMethods?.defaultCurrency || 'usd'}
          />
        );
      case 'bank':
        return (
          <BankTransferForm
            {...commonProps}
            planPrice={Number(plan.price)}
            bankDetails={plan.paymentMethods?.bank_detail || ''}
          />
        );
      case 'razorpay':
        return (
          <RazorpayPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            razorpayKey={plan.paymentMethods?.razorpay_key || ''}
            currency={plan.paymentMethods?.currency || 'INR'}
          />
        );
      case 'mercadopago':
        return (
          <MercadoPagoPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            accessToken={plan.paymentMethods?.mercadopago_access_token || ''}
            currency={plan.paymentMethods?.currency || 'BRL'}
          />
        );
      case 'paystack':
        return (
          <PaystackPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            paystackKey={plan.paymentMethods?.paystack_public_key || ''}
            currency={plan.paymentMethods?.currency || 'NGN'}
          />
        );
      case 'flutterwave':
        return (
          <FlutterwavePaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            flutterwaveKey={plan.paymentMethods?.flutterwave_public_key || ''}
            currency={plan.paymentMethods?.currency || 'NGN'}
          />
        );
      case 'paytabs':
        return (
          <PayTabsPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            paytabsClientKey={''}
            currency={plan.paymentMethods?.currency || 'USD'}
          />
        );
      case 'skrill':
        return (
          <SkrillPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            skrillMerchantId={plan.paymentMethods?.skrill_merchant_id || ''}
            currency={plan.paymentMethods?.currency || 'USD'}
          />
        );
      case 'coingate':
        return (
          <CoinGatePaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            coinGateApiToken={plan.paymentMethods?.coingate_api_token || ''}
            currency={plan.paymentMethods?.currency || 'USD'}
          />
        );
      case 'payfast':
        return (
          <PayfastPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            payfastMerchantId={plan.paymentMethods?.payfast_merchant_id || ''}
            currency={plan.paymentMethods?.currency || 'ZAR'}
          />
        );
      case 'toyyibpay':
        return (
          <ToyyibPayPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            toyyibpayCategoryCode={plan.paymentMethods?.toyyibpay_category_code || ''}
            currency={plan.paymentMethods?.currency || 'MYR'}
          />
        );
      case 'paytr':
        return (
          <PayTRPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            paytrMerchantId={plan.paymentMethods?.paytr_merchant_id || ''}
            currency={plan.paymentMethods?.currency || 'TRY'}
          />
        );
      case 'mollie':
        return (
          <MolliePaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            mollieApiKey={plan.paymentMethods?.mollie_api_key || ''}
            currency={plan.paymentMethods?.currency || 'EUR'}
          />
        );
      case 'cashfree':
        return (
          <CashfreePaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            cashfreeAppId={plan.paymentMethods?.cashfree_public_key || ''}
            mode={plan.paymentMethods?.cashfree_mode || 'sandbox'}
            currency={plan.paymentMethods?.currency || 'INR'}
          />
        );
      case 'iyzipay':
        return (
          <IyzipayPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            iyzipayPublicKey={plan.paymentMethods?.iyzipay_public_key || ''}
            currency={plan.paymentMethods?.currency || 'USD'}
          />
        );
      case 'benefit':
        return (
          <BenefitPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            benefitPublicKey={plan.paymentMethods?.benefit_public_key || ''}
            currency={plan.paymentMethods?.currency || 'BHD'}
          />
        );
      case 'ozow':
        return (
          <OzowPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            ozowSiteKey={plan.paymentMethods?.ozow_site_key || ''}
            currency={plan.paymentMethods?.currency || 'ZAR'}
          />
        );
      case 'easebuzz':
        return (
          <EasebuzzPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            easebuzzMerchantKey={plan.paymentMethods?.easebuzz_merchant_key || ''}
            currency={plan.paymentMethods?.currency || 'INR'}
          />
        );
      case 'khalti':
        return (
          <KhaltiPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            khaltiPublicKey={plan.paymentMethods?.khalti_public_key || ''}
            currency={plan.paymentMethods?.currency || 'NPR'}
          />
        );
      case 'authorizenet':
        return (
          <AuthorizeNetPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            authorizenetMerchantId={plan.paymentMethods?.authorizenet_merchant_id || ''}
            currency={plan.paymentMethods?.currency || 'USD'}
          />
        );
      case 'fedapay':
        return (
          <FedaPayPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            fedapayPublicKey={plan.paymentMethods?.fedapay_public_key || ''}
            currency={plan.paymentMethods?.currency || 'XOF'}
          />
        );
      case 'payhere':
        return (
          <PayHerePaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            payhereMerchantId={plan.paymentMethods?.payhere_merchant_id || ''}
            currency={plan.paymentMethods?.currency || 'LKR'}
          />
        );
      case 'cinetpay':
        return (
          <CinetPayPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            cinetpaySiteId={plan.paymentMethods?.cinetpay_site_id || ''}
            currency={plan.paymentMethods?.currency || 'XOF'}
          />
        );
      case 'paiement':
        return (
          <PaiementPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            paiementMerchantId={plan.paymentMethods?.paiement_merchant_id || ''}
            currency={plan.paymentMethods?.currency || 'XOF'}
          />
        );
      case 'nepalste':
        return (
          <NepalstePaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            nepalstePublicKey={plan.paymentMethods?.nepalste_public_key || ''}
            currency={plan.paymentMethods?.currency || 'NPR'}
          />
        );
      case 'yookassa':
        return (
          <YooKassaPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            yookassaShopId={plan.paymentMethods?.yookassa_shop_id || ''}
            currency={plan.paymentMethods?.currency || 'RUB'}
          />
        );
      case 'aamarpay':
        return (
          <AamarpayPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            aamarpayStoreId={plan.paymentMethods?.aamarpay_store_id || ''}
            currency={plan.paymentMethods?.currency || 'BDT'}
          />
        );
      case 'midtrans':
        return (
          <MidtransPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            midtransSecretKey={plan.paymentMethods?.midtrans_secret_key || ''}
            currency={plan.paymentMethods?.currency || 'IDR'}
          />
        );
      case 'paymentwall':
        return (
          <PaymentWallPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            paymentwallPublicKey={plan.paymentMethods?.paymentwall_public_key || ''}
            currency={plan.paymentMethods?.currency || 'USD'}
          />
        );
      case 'sspay':
        return (
          <SSPayPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            sspaySecretKey={plan.paymentMethods?.sspay_secret_key || ''}
            currency={plan.paymentMethods?.currency || 'MYR'}
          />
        );
      case 'tap':
        return (
          <TapPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            tapSecretKey={plan.paymentMethods?.tap_secret_key || ''}
            currency={plan.paymentMethods?.currency || 'USD'}
          />
        );
      case 'xendit':
        return (
          <XenditPaymentForm
            {...commonProps}
            planPrice={Number(plan.price)}
            xenditApiKey={plan.paymentMethods?.xendit_api_key || ''}
            currency={plan.paymentMethods?.currency || 'PHP'}
          />
        );
      default:
        return null;
    }
  };

  if (showPaymentForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{t('Complete Payment')}</h3>
          <Button variant="outline" size="sm" onClick={handlePaymentCancel}>
            {t('Back')}
          </Button>
        </div>
        {renderPaymentForm()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">
                {t(billingCycle)} {t('subscription')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{plan.formatted_price || plan.price}</div>
              <div className="text-sm text-muted-foreground">
                /{t(plan.duration.toLowerCase())}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-3">
        <Label>{t('Select Payment Method')}</Label>
        {enabledPaymentMethods.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('No payment methods available')}
          </p>
        ) : (
          <div className="space-y-2">
            {enabledPaymentMethods.map((method, index) => (
              <Card 
                key={`${method.id}-${index}`}
                className={`cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{method.icon}</div>
                    <span className="font-medium">{method.name}</span>
                    {selectedPaymentMethod === method.id && (
                      <Badge variant="secondary" className="ml-auto">
                        {t('Selected')}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Code */}
      <div className="space-y-3">
        <Label htmlFor="coupon">{t('Coupon Code')} ({t('Optional')})</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={t('Enter coupon code')}
              className="pr-10"
              disabled={!!appliedCoupon}
            />
            <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {!appliedCoupon ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || couponLoading}
            >
              {couponLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('Apply')
              )}
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleRemoveCoupon}
            >
              {t('Remove')}
            </Button>
          )}
        </div>
        
        {appliedCoupon && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700 font-medium">
                {t('Coupon Applied')}: {appliedCoupon.code}
              </span>
              <span className="text-green-600">
                -{appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Price Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('Subtotal')}</span>
              <span>{formatPrice(originalPrice)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <span>{t('Discount')}</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between font-medium">
                <span>{t('Total')}</span>
                <span>{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {t('Cancel')}
        </Button>
        <Button 
          onClick={handlePayNow} 
          disabled={enabledPaymentMethods.length === 0}
          className="flex-1"
        >
          {t('Pay')} {formatPrice(finalPrice)}
        </Button>
      </div>
    </div>
  );
}