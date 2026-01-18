import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { Save, CreditCard, AlertCircle, Banknote, IndianRupee, Wallet, Coins, Search, X } from 'lucide-react';
import { route } from 'ziggy-js';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS, PAYMENT_METHOD_HELP_URLS } from '@/utils/payment';
import { SettingsSection } from '@/components/settings-section';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { useState, useMemo } from 'react';
import { PaymentMethodCard } from '@/components/payment/payment-method-card';
import { PaymentInputField } from '@/components/payment/payment-input-field';
import { PaymentModeSelector } from '@/components/payment/payment-mode-selector';

interface PaymentSettings {
  currency: string;
  currency_symbol: string;
  is_manually_enabled: boolean;
  is_bank_enabled: boolean;
  bank_detail: string;
  is_stripe_enabled: boolean;
  stripe_key: string;
  stripe_secret: string;
  is_paypal_enabled: boolean;
  paypal_mode: 'sandbox' | 'live';
  paypal_client_id: string;
  paypal_secret_key: string;
  is_razorpay_enabled: boolean;
  razorpay_key: string;
  razorpay_secret: string;
  is_mercadopago_enabled: boolean;
  mercadopago_mode: 'sandbox' | 'live';
  mercadopago_access_token: string;
  is_paystack_enabled: boolean;
  paystack_public_key: string;
  paystack_secret_key: string;
  is_flutterwave_enabled: boolean;
  flutterwave_public_key: string;
  flutterwave_secret_key: string;
  is_tap_enabled: boolean;
  tap_secret_key: string;
  is_xendit_enabled: boolean;
  xendit_api_key: string;
  is_paytr_enabled: boolean;
  paytr_merchant_id: string;
  paytr_merchant_key: string;
  paytr_merchant_salt: string;
  is_mollie_enabled: boolean;
  mollie_api_key: string;
  is_toyyibpay_enabled: boolean;
  toyyibpay_category_code: string;
  toyyibpay_secret_key: string;
  is_paymentwall_enabled: boolean;
  paymentwall_public_key: string;
  paymentwall_private_key: string;
  is_sspay_enabled: boolean;
  sspay_secret_key: string;
  sspay_category_code: string;
  is_benefit_enabled: boolean;
  benefit_mode: string;
  benefit_secret_key: string;
  benefit_public_key: string;
  is_iyzipay_enabled: boolean;
  iyzipay_mode: string;
  iyzipay_secret_key: string;
  iyzipay_public_key: string;
  is_aamarpay_enabled: boolean;
  aamarpay_store_id: string;
  aamarpay_signature: string;
  is_midtrans_enabled: boolean;
  midtrans_mode: string;
  midtrans_secret_key: string;
  is_yookassa_enabled: boolean;
  yookassa_shop_id: string;
  yookassa_secret_key: string;
  is_nepalste_enabled: boolean;
  nepalste_mode: string;
  nepalste_secret_key: string;
  nepalste_public_key: string;
  is_paiement_enabled: boolean;
  paiement_merchant_id: string;
  is_cinetpay_enabled: boolean;
  cinetpay_site_id: string;
  cinetpay_api_key: string;
  cinetpay_secret_key: string;
  is_payhere_enabled: boolean;
  payhere_mode: string;
  payhere_merchant_id: string;
  payhere_merchant_secret: string;
  payhere_app_id: string;
  payhere_app_secret: string;
  is_fedapay_enabled: boolean;
  fedapay_mode: string;
  fedapay_secret_key: string;
  fedapay_public_key: string;
  is_authorizenet_enabled: boolean;
  authorizenet_mode: string;
  authorizenet_merchant_id: string;
  authorizenet_transaction_key: string;
  is_khalti_enabled: boolean;
  khalti_secret_key: string;
  khalti_public_key: string;
  is_easebuzz_enabled: boolean;
  easebuzz_merchant_key: string;
  easebuzz_salt_key: string;
  easebuzz_environment: string;
  is_ozow_enabled: boolean;
  ozow_mode: string;
  ozow_site_key: string;
  ozow_private_key: string;
  ozow_api_key: string;
  is_cashfree_enabled: boolean;
  cashfree_mode: string;
  cashfree_secret_key: string;
  cashfree_public_key: string;
  is_paytabs_enabled: boolean;
  paytabs_profile_id: string;
  paytabs_server_key: string;
  paytabs_region: string;
  paytabs_mode: 'sandbox' | 'live';
  is_skrill_enabled: boolean;
  skrill_merchant_id: string;
  skrill_secret_word: string;
  is_coingate_enabled: boolean;
  coingate_api_token: string;
  coingate_mode: 'sandbox' | 'live';
  is_payfast_enabled: boolean;
  payfast_merchant_id: string;
  payfast_merchant_key: string;
  payfast_passphrase: string;
  payfast_mode: 'sandbox' | 'live';
}

interface PaymentSettingsProps {
  settings?: any;
}

export default function PaymentSettings({ settings = {} }: PaymentSettingsProps) {
  const { t } = useTranslation();
  const { props } = usePage();
  const user = (props as any).auth?.user;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  
  // Form state
  const { data, setData, post, processing, errors } = useForm<PaymentSettings>({
    currency: settings.currency || 'USD',
    currency_symbol: settings.currency_symbol || '$',
    is_manually_enabled: settings.is_manually_enabled === true || settings.is_manually_enabled === '1',
    is_bank_enabled: settings.is_bank_enabled === true || settings.is_bank_enabled === '1',
    bank_detail: settings.bank_detail || '',
    is_stripe_enabled: settings.is_stripe_enabled === true || settings.is_stripe_enabled === '1',
    stripe_key: settings.stripe_key || '',
    stripe_secret: settings.stripe_secret || '',
    is_paypal_enabled: settings.is_paypal_enabled === true || settings.is_paypal_enabled === '1',
    paypal_mode: settings.paypal_mode || 'sandbox',
    paypal_client_id: settings.paypal_client_id || '',
    paypal_secret_key: settings.paypal_secret_key || '',
    is_razorpay_enabled: settings.is_razorpay_enabled === true || settings.is_razorpay_enabled === '1',
    razorpay_key: settings.razorpay_key || '',
    razorpay_secret: settings.razorpay_secret || '',
    is_mercadopago_enabled: settings.is_mercadopago_enabled === true || settings.is_mercadopago_enabled === '1',
    mercadopago_mode: settings.mercadopago_mode || 'sandbox',
    mercadopago_access_token: settings.mercadopago_access_token || '',
    is_paystack_enabled: settings.is_paystack_enabled === true || settings.is_paystack_enabled === '1',
    paystack_public_key: settings.paystack_public_key || '',
    paystack_secret_key: settings.paystack_secret_key || '',
    is_flutterwave_enabled: settings.is_flutterwave_enabled === true || settings.is_flutterwave_enabled === '1',
    flutterwave_public_key: settings.flutterwave_public_key || '',
    flutterwave_secret_key: settings.flutterwave_secret_key || '',
    is_tap_enabled: settings.is_tap_enabled === true || settings.is_tap_enabled === '1',
    tap_secret_key: settings.tap_secret_key || '',
    is_xendit_enabled: settings.is_xendit_enabled === true || settings.is_xendit_enabled === '1',
    xendit_api_key: settings.xendit_api_key || '',
    is_paytr_enabled: settings.is_paytr_enabled === true || settings.is_paytr_enabled === '1',
    paytr_merchant_id: settings.paytr_merchant_id || '',
    paytr_merchant_key: settings.paytr_merchant_key || '',
    paytr_merchant_salt: settings.paytr_merchant_salt || '',
    is_mollie_enabled: settings.is_mollie_enabled === true || settings.is_mollie_enabled === '1',
    mollie_api_key: settings.mollie_api_key || '',
    is_toyyibpay_enabled: settings.is_toyyibpay_enabled === true || settings.is_toyyibpay_enabled === '1',
    toyyibpay_category_code: settings.toyyibpay_category_code || '',
    toyyibpay_secret_key: settings.toyyibpay_secret_key || '',
    is_paymentwall_enabled: settings.is_paymentwall_enabled === true || settings.is_paymentwall_enabled === '1',
    paymentwall_public_key: settings.paymentwall_public_key || '',
    paymentwall_private_key: settings.paymentwall_private_key || '',
    is_sspay_enabled: settings.is_sspay_enabled === true || settings.is_sspay_enabled === '1',
    sspay_secret_key: settings.sspay_secret_key || '',
    sspay_category_code: settings.sspay_category_code || '',
    is_benefit_enabled: settings.is_benefit_enabled === true || settings.is_benefit_enabled === '1',
    benefit_mode: settings.benefit_mode || 'sandbox',
    benefit_secret_key: settings.benefit_secret_key || '',
    benefit_public_key: settings.benefit_public_key || '',
    is_iyzipay_enabled: settings.is_iyzipay_enabled === true || settings.is_iyzipay_enabled === '1',
    iyzipay_mode: settings.iyzipay_mode || 'sandbox',
    iyzipay_secret_key: settings.iyzipay_secret_key || '',
    iyzipay_public_key: settings.iyzipay_public_key || '',
    is_aamarpay_enabled: settings.is_aamarpay_enabled === true || settings.is_aamarpay_enabled === '1',
    aamarpay_store_id: settings.aamarpay_store_id || '',
    aamarpay_signature: settings.aamarpay_signature || '',
    is_midtrans_enabled: settings.is_midtrans_enabled === true || settings.is_midtrans_enabled === '1',
    midtrans_mode: settings.midtrans_mode || 'sandbox',
    midtrans_secret_key: settings.midtrans_secret_key || '',
    is_yookassa_enabled: settings.is_yookassa_enabled === true || settings.is_yookassa_enabled === '1',
    yookassa_shop_id: settings.yookassa_shop_id || '',
    yookassa_secret_key: settings.yookassa_secret_key || '',
    is_nepalste_enabled: settings.is_nepalste_enabled === true || settings.is_nepalste_enabled === '1',
    nepalste_mode: settings.nepalste_mode || 'sandbox',
    nepalste_secret_key: settings.nepalste_secret_key || '',
    nepalste_public_key: settings.nepalste_public_key || '',
    is_paiement_enabled: settings.is_paiement_enabled === true || settings.is_paiement_enabled === '1',
    paiement_merchant_id: settings.paiement_merchant_id || '',
    is_cinetpay_enabled: settings.is_cinetpay_enabled === true || settings.is_cinetpay_enabled === '1',
    cinetpay_site_id: settings.cinetpay_site_id || '',
    cinetpay_api_key: settings.cinetpay_api_key || '',
    cinetpay_secret_key: settings.cinetpay_secret_key || '',
    is_payhere_enabled: settings.is_payhere_enabled === true || settings.is_payhere_enabled === '1',
    payhere_mode: settings.payhere_mode || 'sandbox',
    payhere_merchant_id: settings.payhere_merchant_id || '',
    payhere_merchant_secret: settings.payhere_merchant_secret || '',
    payhere_app_id: settings.payhere_app_id || '',
    payhere_app_secret: settings.payhere_app_secret || '',
    is_fedapay_enabled: settings.is_fedapay_enabled === true || settings.is_fedapay_enabled === '1',
    fedapay_mode: settings.fedapay_mode || 'sandbox',
    fedapay_secret_key: settings.fedapay_secret_key || '',
    fedapay_public_key: settings.fedapay_public_key || '',
    is_authorizenet_enabled: settings.is_authorizenet_enabled === true || settings.is_authorizenet_enabled === '1',
    authorizenet_mode: settings.authorizenet_mode || 'sandbox',
    authorizenet_merchant_id: settings.authorizenet_merchant_id || '',
    authorizenet_transaction_key: settings.authorizenet_transaction_key || '',
    is_khalti_enabled: settings.is_khalti_enabled === true || settings.is_khalti_enabled === '1',
    khalti_secret_key: settings.khalti_secret_key || '',
    khalti_public_key: settings.khalti_public_key || '',
    is_easebuzz_enabled: settings.is_easebuzz_enabled === true || settings.is_easebuzz_enabled === '1',
    easebuzz_merchant_key: settings.easebuzz_merchant_key || '',
    easebuzz_salt_key: settings.easebuzz_salt_key || '',
    easebuzz_environment: settings.easebuzz_environment || '',
    is_ozow_enabled: settings.is_ozow_enabled === true || settings.is_ozow_enabled === '1',
    ozow_mode: settings.ozow_mode || 'sandbox',
    ozow_site_key: settings.ozow_site_key || '',
    ozow_private_key: settings.ozow_private_key || '',
    ozow_api_key: settings.ozow_api_key || '',
    is_cashfree_enabled: settings.is_cashfree_enabled === true || settings.is_cashfree_enabled === '1',
    cashfree_mode: settings.cashfree_mode || 'sandbox',
    cashfree_secret_key: settings.cashfree_secret_key || '',
    cashfree_public_key: settings.cashfree_public_key || '',
    is_paytabs_enabled: settings.is_paytabs_enabled === true || settings.is_paytabs_enabled === '1',
    paytabs_profile_id: settings.paytabs_profile_id || '',
    paytabs_server_key: settings.paytabs_server_key || '',
    paytabs_region: settings.paytabs_region || 'ARE',
    paytabs_mode: settings.paytabs_mode || 'sandbox',
    is_skrill_enabled: settings.is_skrill_enabled === true || settings.is_skrill_enabled === '1',
    skrill_merchant_id: settings.skrill_merchant_id || '',
    skrill_secret_word: settings.skrill_secret_word || '',
    is_coingate_enabled: settings.is_coingate_enabled === true || settings.is_coingate_enabled === '1',
    coingate_api_token: settings.coingate_api_token || '',
    coingate_mode: settings.coingate_mode || 'sandbox',
    is_payfast_enabled: settings.is_payfast_enabled === true || settings.is_payfast_enabled === '1',
    payfast_merchant_id: settings.payfast_merchant_id || '',
    payfast_merchant_key: settings.payfast_merchant_key || '',
    payfast_passphrase: settings.payfast_passphrase || '',
    payfast_mode: settings.payfast_mode || 'sandbox',
  });



  // Payment methods data for search
  const paymentMethods = useMemo(() => {
    const methods = [
      { key: 'bank', name: t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.BANK]) },
      { key: 'stripe', name: t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.STRIPE]) },
      { key: 'paypal', name: t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.PAYPAL]) },
      { key: 'paystack', name: t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.PAYSTACK]) },
      { key: 'flutterwave', name: t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.FLUTTERWAVE]) },
      { key: 'skrill', name: t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.SKRILL]) },
      { key: 'coingate', name: t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.COINGATE]) },
    ];
    
    return methods;
  }, [t, user?.type]);

  // Filter payment methods based on search and status
  const filteredMethods = useMemo(() => {
    let filtered = paymentMethods;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(method => 
        method.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(method => {
        const isEnabled = data[`is_${method.key}_enabled` as keyof PaymentSettings] as boolean;
        return statusFilter === 'enabled' ? isEnabled : !isEnabled;
      });
    }
    
    return filtered;
  }, [paymentMethods, searchTerm, statusFilter, data]);

  // Check if method should be shown
  const shouldShowMethod = (methodKey: string) => {
    return filteredMethods.some(m => m.key === methodKey);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('payment.settings'), {
      onError: (errors) => {
        console.log('Payment settings errors:', errors);
        toast.error(t('Failed to update payment settings'));
      }
    });
  };

  return (
    <SettingsSection
      title={t("Payment Settings")}
      description={t("Configure payment gateway for subscription plans")}
      action={
        <Button type="submit" form="payment-settings-form" size="sm" disabled={processing}>
          <Save className="h-4 w-4 mr-2" />
          {processing ? t("Saving...") : t("Save Changes")}
        </Button>
      }
    >
      <form id="payment-settings-form" onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Payment Methods")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t("Search payment methods...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchTerm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Select value={statusFilter} onValueChange={(value: 'all' | 'enabled' | 'disabled') => setStatusFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("All Methods")}</SelectItem>
                    <SelectItem value="enabled">{t("Enabled Only")}</SelectItem>
                    <SelectItem value="disabled">{t("Disabled Only")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {(searchTerm || statusFilter !== 'all') && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">{t("Active filters:")} </span>
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs">
                      {t("Search:")} "{searchTerm}"
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      {t("Status:")} {statusFilter === 'enabled' ? t("Enabled") : t("Disabled")}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => setStatusFilter('all')}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Results Summary & No Results */}
              {(searchTerm || statusFilter !== 'all') && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {filteredMethods.length > 0 
                      ? t("Showing {{count}} of {{total}} payment methods", { count: filteredMethods.length, total: paymentMethods.length })
                      : t("No payment methods found matching your criteria")
                    }
                  </span>
                </div>
              )}
              
              {(searchTerm || statusFilter !== 'all') && filteredMethods.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("No results found")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("Try adjusting your search or filter criteria")}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                  >
                    {t("Clear filters")}
                  </Button>
                </div>
              )}

              {/* Bank Transfer */}
              {shouldShowMethod('bank') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.BANK])}
                icon={<Banknote className="h-5 w-5" />}
                enabled={data.is_bank_enabled}
                onToggle={(checked) => setData('is_bank_enabled', checked)}
              >
                <div className="space-y-2">
                  <Label htmlFor="bank_detail">{t("Bank Details")}</Label>
                  <Textarea
                    id="bank_detail"
                    value={data.bank_detail}
                    onChange={(e) => setData('bank_detail', e.target.value)}
                    placeholder={t("Bank: Your Bank Name\nAccount Number: 0000 0000\nRouting Number: 000000000")}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("Enter your bank details that customers will use for manual transfers")}
                  </p>
                  {errors.bank_detail && (
                    <p className="text-sm text-destructive">{errors.bank_detail}</p>
                  )}
                </div>
              </PaymentMethodCard>
              )}

              {/* Stripe */}
              {shouldShowMethod('stripe') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.STRIPE])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_stripe_enabled}
                onToggle={(checked) => setData('is_stripe_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.STRIPE]}
                helpText={t("Get your Stripe API keys from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="stripe_key"
                    label={t("Publishable Key")}
                    value={data.stripe_key}
                    onChange={(value) => setData('stripe_key', value)}
                    placeholder="pk_test_..."
                    error={errors.stripe_key}
                  />
                  <PaymentInputField
                    id="stripe_secret"
                    label={t("Secret Key")}
                    value={data.stripe_secret}
                    onChange={(value) => setData('stripe_secret', value)}
                    placeholder="sk_test_..."
                    isSecret
                    error={errors.stripe_secret}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* PayPal */}
              {shouldShowMethod('paypal') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.PAYPAL])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_paypal_enabled}
                onToggle={(checked) => setData('is_paypal_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.PAYPAL]}
                helpText={t("Get your PayPal API credentials from your")}
              >
                <div className="space-y-4">
                  <PaymentModeSelector
                    value={data.paypal_mode}
                    onChange={(mode) => setData('paypal_mode', mode)}
                    name="paypal"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PaymentInputField
                      id="paypal_client_id"
                      label={t("Client ID")}
                      value={data.paypal_client_id}
                      onChange={(value) => setData('paypal_client_id', value)}
                      placeholder={t("Client ID")}
                      error={errors.paypal_client_id}
                    />
                    <PaymentInputField
                      id="paypal_secret_key"
                      label={t("Secret Key")}
                      value={data.paypal_secret_key}
                      onChange={(value) => setData('paypal_secret_key', value)}
                      placeholder={t("Secret Key")}
                      isSecret
                      error={errors.paypal_secret_key}
                    />
                  </div>
                </div>
              </PaymentMethodCard>
              )}
              
              {/* Razorpay */}
              {shouldShowMethod('razorpay') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.RAZORPAY])}
                icon={<IndianRupee className="h-5 w-5" />}
                enabled={data.is_razorpay_enabled}
                onToggle={(checked) => setData('is_razorpay_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.RAZORPAY]}
                helpText={t("Get your Razorpay API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="razorpay_key"
                    label={t("Key ID")}
                    value={data.razorpay_key}
                    onChange={(value) => setData('razorpay_key', value)}
                    placeholder="rzp_test_..."
                    error={errors.razorpay_key}
                  />
                  <PaymentInputField
                    id="razorpay_secret"
                    label={t("Secret Key")}
                    value={data.razorpay_secret}
                    onChange={(value) => setData('razorpay_secret', value)}
                    placeholder="..."
                    isSecret
                    error={errors.razorpay_secret}
                  />
                </div>
              </PaymentMethodCard>
              )}
              
              {/* Mercado Pago */}
              {shouldShowMethod('mercadopago') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.MERCADOPAGO])}
                icon={<Wallet className="h-5 w-5" />}
                enabled={data.is_mercadopago_enabled}
                onToggle={(checked) => setData('is_mercadopago_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.MERCADOPAGO]}
                helpText={t("Get your Mercado Pago API credentials from your")}
              >
                <div className="space-y-4">
                  <PaymentModeSelector
                    value={data.mercadopago_mode}
                    onChange={(mode) => setData('mercadopago_mode', mode)}
                    name="mercadopago"
                  />
                  <PaymentInputField
                    id="mercadopago_access_token"
                    label={t("Access Token")}
                    value={data.mercadopago_access_token}
                    onChange={(value) => setData('mercadopago_access_token', value)}
                    placeholder={data.mercadopago_mode === 'sandbox' ? 'TEST-' : 'APP_USR-'}
                    isSecret
                    error={errors.mercadopago_access_token}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("For server-side API integration, use your Private Access Token (NOT your public key). You can find this in your MercadoPago Developer Dashboard under Credentials > Production/Test Credentials > Access token.")}
                  </p>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t("Important: Do not use your Public Key here. The Access Token is different and is required for server-side operations.")}
                    </AlertDescription>
                  </Alert>
                </div>
              </PaymentMethodCard>
              )}

              {/* Paystack */}
              {shouldShowMethod('paystack') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.PAYSTACK])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_paystack_enabled}
                onToggle={(checked) => setData('is_paystack_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.PAYSTACK]}
                helpText={t("Get your Paystack API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="paystack_public_key"
                    label={t("Public Key")}
                    value={data.paystack_public_key}
                    onChange={(value) => setData('paystack_public_key', value)}
                    placeholder="pk_test_..."
                    error={errors.paystack_public_key}
                  />
                  <PaymentInputField
                    id="paystack_secret_key"
                    label={t("Secret Key")}
                    value={data.paystack_secret_key}
                    onChange={(value) => setData('paystack_secret_key', value)}
                    placeholder="sk_test_..."
                    isSecret
                    error={errors.paystack_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Flutterwave */}
              {shouldShowMethod('flutterwave') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.FLUTTERWAVE])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_flutterwave_enabled}
                onToggle={(checked) => setData('is_flutterwave_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.FLUTTERWAVE]}
                helpText={t("Get your Flutterwave API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="flutterwave_public_key"
                    label={t("Public Key")}
                    value={data.flutterwave_public_key}
                    onChange={(value) => setData('flutterwave_public_key', value)}
                    placeholder="FLWPUBK_TEST-..."
                    error={errors.flutterwave_public_key}
                  />
                  <PaymentInputField
                    id="flutterwave_secret_key"
                    label={t("Secret Key")}
                    value={data.flutterwave_secret_key}
                    onChange={(value) => setData('flutterwave_secret_key', value)}
                    placeholder="FLWSECK_TEST-..."
                    isSecret
                    error={errors.flutterwave_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* PayTabs */}
              {shouldShowMethod('paytabs') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.PAYTABS])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_paytabs_enabled}
                onToggle={(checked) => setData('is_paytabs_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.PAYTABS]}
                helpText={t("Get your PayTabs API credentials from your")}
              >
                <div className="space-y-4">
                  <PaymentModeSelector
                    value={data.paytabs_mode}
                    onChange={(mode) => setData('paytabs_mode', mode)}
                    name="paytabs"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PaymentInputField
                      id="paytabs_profile_id"
                      label={t("Profile ID")}
                      value={data.paytabs_profile_id}
                      onChange={(value) => setData('paytabs_profile_id', value)}
                      placeholder={t("Profile ID")}
                      error={errors.paytabs_profile_id}
                    />
                    <PaymentInputField
                      id="paytabs_server_key"
                      label={t("Server Key")}
                      value={data.paytabs_server_key}
                      onChange={(value) => setData('paytabs_server_key', value)}
                      placeholder={t("Server Key")}
                      isSecret
                      error={errors.paytabs_server_key}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paytabs_region">{t("Region")}</Label>
                    <Select value={data.paytabs_region} onValueChange={(value) => setData('paytabs_region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select Region")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARE">{t("UAE")}</SelectItem>
                        <SelectItem value="SAU">{t("Saudi Arabia")}</SelectItem>
                        <SelectItem value="OMN">{t("Oman")}</SelectItem>
                        <SelectItem value="JOR">{t("Jordan")}</SelectItem>
                        <SelectItem value="EGY">{t("Egypt")}</SelectItem>
                        <SelectItem value="IRQ">{t("Iraq")}</SelectItem>
                        <SelectItem value="GLOBAL">{t("Global")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.paytabs_region && (
                      <p className="text-sm text-destructive">{errors.paytabs_region}</p>
                    )}
                  </div>
                </div>
              </PaymentMethodCard>
              )}

              {/* Skrill */}
              {shouldShowMethod('skrill') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.SKRILL])}
                icon={<Wallet className="h-5 w-5" />}
                enabled={data.is_skrill_enabled}
                onToggle={(checked) => setData('is_skrill_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.SKRILL]}
                helpText={t("Get your Skrill merchant credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="skrill_merchant_id"
                    label={t("Merchant ID")}
                    value={data.skrill_merchant_id}
                    onChange={(value) => setData('skrill_merchant_id', value)}
                    placeholder={t("Merchant ID")}
                    error={errors.skrill_merchant_id}
                  />
                  <PaymentInputField
                    id="skrill_secret_word"
                    label={t("Secret Word")}
                    value={data.skrill_secret_word}
                    onChange={(value) => setData('skrill_secret_word', value)}
                    placeholder={t("Secret Word")}
                    isSecret
                    error={errors.skrill_secret_word}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* CoinGate */}
              {shouldShowMethod('coingate') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.COINGATE])}
                icon={<Coins className="h-5 w-5" />}
                enabled={data.is_coingate_enabled}
                onToggle={(checked) => setData('is_coingate_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.COINGATE]}
                helpText={t("Get your CoinGate API credentials from your")}
              >
                <div className="space-y-4">
                  <PaymentModeSelector
                    value={data.coingate_mode}
                    onChange={(mode) => setData('coingate_mode', mode)}
                    name="coingate"
                  />
                  <PaymentInputField
                    id="coingate_api_token"
                    label={t("API Token")}
                    value={data.coingate_api_token}
                    onChange={(value) => setData('coingate_api_token', value)}
                    placeholder={t("API Token")}
                    isSecret
                    error={errors.coingate_api_token}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Payfast */}
              {shouldShowMethod('payfast') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.PAYFAST])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_payfast_enabled}
                onToggle={(checked) => setData('is_payfast_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.PAYFAST]}
                helpText={t("Get your Payfast merchant credentials from your")}
              >
                <div className="space-y-4">
                  <PaymentModeSelector
                    value={data.payfast_mode}
                    onChange={(mode) => setData('payfast_mode', mode)}
                    name="payfast"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PaymentInputField
                      id="payfast_merchant_id"
                      label={t("Merchant ID")}
                      value={data.payfast_merchant_id}
                      onChange={(value) => setData('payfast_merchant_id', value)}
                      placeholder={t("Merchant ID")}
                      error={errors.payfast_merchant_id}
                    />
                    <PaymentInputField
                      id="payfast_merchant_key"
                      label={t("Merchant Key")}
                      value={data.payfast_merchant_key}
                      onChange={(value) => setData('payfast_merchant_key', value)}
                      placeholder={t("Merchant Key")}
                      isSecret
                      error={errors.payfast_merchant_key}
                    />
                  </div>
                  <PaymentInputField
                    id="payfast_passphrase"
                    label={t("Passphrase")}
                    value={data.payfast_passphrase}
                    onChange={(value) => setData('payfast_passphrase', value)}
                    placeholder={t("Passphrase (optional)")}
                    error={errors.payfast_passphrase}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Tap */}
              {shouldShowMethod('tap') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.TAP])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_tap_enabled}
                onToggle={(checked) => setData('is_tap_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.TAP]}
                helpText={t("Get your Tap API credentials from your")}
              >
                <PaymentInputField
                  id="tap_secret_key"
                  label={t("Secret Key")}
                  value={data.tap_secret_key}
                  onChange={(value) => setData('tap_secret_key', value)}
                  placeholder={t("Secret Key")}
                  isSecret
                  error={errors.tap_secret_key}
                />
              </PaymentMethodCard>
              )}

              {/* Xendit */}
              {shouldShowMethod('xendit') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.XENDIT])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_xendit_enabled}
                onToggle={(checked) => setData('is_xendit_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.XENDIT]}
                helpText={t("Get your Xendit API credentials from your")}
              >
                <PaymentInputField
                  id="xendit_api_key"
                  label={t("API Key")}
                  value={data.xendit_api_key}
                  onChange={(value) => setData('xendit_api_key', value)}
                  placeholder={t("API Key")}
                  isSecret
                  error={errors.xendit_api_key}
                />
              </PaymentMethodCard>
              )}

              {/* PayTR */}
              {shouldShowMethod('paytr') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.PAYTR])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_paytr_enabled}
                onToggle={(checked) => setData('is_paytr_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.PAYTR]}
                helpText={t("Get your PayTR merchant credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="paytr_merchant_id"
                    label={t("Merchant ID")}
                    value={data.paytr_merchant_id}
                    onChange={(value) => setData('paytr_merchant_id', value)}
                    placeholder={t("Merchant ID")}
                    error={errors.paytr_merchant_id}
                  />
                  <PaymentInputField
                    id="paytr_merchant_key"
                    label={t("Merchant Key")}
                    value={data.paytr_merchant_key}
                    onChange={(value) => setData('paytr_merchant_key', value)}
                    placeholder={t("Merchant Key")}
                    isSecret
                    error={errors.paytr_merchant_key}
                  />
                </div>
                <PaymentInputField
                  id="paytr_merchant_salt"
                  label={t("Merchant Salt")}
                  value={data.paytr_merchant_salt}
                  onChange={(value) => setData('paytr_merchant_salt', value)}
                  placeholder={t("Merchant Salt")}
                  isSecret
                  error={errors.paytr_merchant_salt}
                />
              </PaymentMethodCard>
              )}

              {/* Mollie */}
              {shouldShowMethod('mollie') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.MOLLIE])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_mollie_enabled}
                onToggle={(checked) => setData('is_mollie_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.MOLLIE]}
                helpText={t("Get your Mollie API credentials from your")}
              >
                <PaymentInputField
                  id="mollie_api_key"
                  label={t("API Key")}
                  value={data.mollie_api_key}
                  onChange={(value) => setData('mollie_api_key', value)}
                  placeholder={t("API Key")}
                  isSecret
                  error={errors.mollie_api_key}
                />
              </PaymentMethodCard>
              )}

              {/* toyyibPay */}
              {shouldShowMethod('toyyibpay') && (
              <PaymentMethodCard
                title={t(PAYMENT_METHOD_LABELS[PAYMENT_METHODS.TOYYIBPAY])}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_toyyibpay_enabled}
                onToggle={(checked) => setData('is_toyyibpay_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.TOYYIBPAY]}
                helpText={t("Get your toyyibPay credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="toyyibpay_category_code"
                    label={t("Category Code")}
                    value={data.toyyibpay_category_code}
                    onChange={(value) => setData('toyyibpay_category_code', value)}
                    placeholder={t("Category Code")}
                    error={errors.toyyibpay_category_code}
                  />
                  <PaymentInputField
                    id="toyyibpay_secret_key"
                    label={t("Secret Key")}
                    value={data.toyyibpay_secret_key}
                    onChange={(value) => setData('toyyibpay_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.toyyibpay_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* PaymentWall */}
              {shouldShowMethod('paymentwall') && (
              <PaymentMethodCard
                title={t('PaymentWall')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_paymentwall_enabled}
                onToggle={(checked) => setData('is_paymentwall_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.PAYMENTWALL]}
                helpText={t("Get your PaymentWall API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="paymentwall_public_key"
                    label={t("Public Key")}
                    value={data.paymentwall_public_key}
                    onChange={(value) => setData('paymentwall_public_key', value)}
                    placeholder={t("Public Key")}
                    error={errors.paymentwall_public_key}
                  />
                  <PaymentInputField
                    id="paymentwall_private_key"
                    label={t("Private Key")}
                    value={data.paymentwall_private_key}
                    onChange={(value) => setData('paymentwall_private_key', value)}
                    placeholder={t("Private Key")}
                    isSecret
                    error={errors.paymentwall_private_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* SSPay */}
              {shouldShowMethod('sspay') && (
              <PaymentMethodCard
                title={t('SSPay')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_sspay_enabled}
                onToggle={(checked) => setData('is_sspay_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.SSPAY]}
                helpText={t("Get your SSPay API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="sspay_category_code"
                    label={t("Category Code")}
                    value={data.sspay_category_code}
                    onChange={(value) => setData('sspay_category_code', value)}
                    placeholder={t("Category Code")}
                    error={errors.sspay_category_code}
                  />
                  <PaymentInputField
                    id="sspay_secret_key"
                    label={t("Secret Key")}
                    value={data.sspay_secret_key}
                    onChange={(value) => setData('sspay_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.sspay_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Benefit */}
              {shouldShowMethod('benefit') && (
              <PaymentMethodCard
                title={t('Benefit')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_benefit_enabled}
                onToggle={(checked) => setData('is_benefit_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.BENEFIT]}
                helpText={t("Get your Benefit API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.benefit_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('benefit_mode', mode)}
                  name="benefit"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="benefit_public_key"
                    label={t("Public Key")}
                    value={data.benefit_public_key}
                    onChange={(value) => setData('benefit_public_key', value)}
                    placeholder={t("Public Key")}
                    error={errors.benefit_public_key}
                  />
                  <PaymentInputField
                    id="benefit_secret_key"
                    label={t("Secret Key")}
                    value={data.benefit_secret_key}
                    onChange={(value) => setData('benefit_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.benefit_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Iyzipay */}
              {shouldShowMethod('iyzipay') && (
              <PaymentMethodCard
                title={t('Iyzipay')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_iyzipay_enabled}
                onToggle={(checked) => setData('is_iyzipay_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.IYZIPAY]}
                helpText={t("Get your Iyzipay API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.iyzipay_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('iyzipay_mode', mode)}
                  name="iyzipay"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="iyzipay_public_key"
                    label={t("Public Key")}
                    value={data.iyzipay_public_key}
                    onChange={(value) => setData('iyzipay_public_key', value)}
                    placeholder={t("Public Key")}
                    error={errors.iyzipay_public_key}
                  />
                  <PaymentInputField
                    id="iyzipay_secret_key"
                    label={t("Secret Key")}
                    value={data.iyzipay_secret_key}
                    onChange={(value) => setData('iyzipay_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.iyzipay_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Aamarpay */}
              {shouldShowMethod('aamarpay') && (
              <PaymentMethodCard
                title={t('Aamarpay')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_aamarpay_enabled}
                onToggle={(checked) => setData('is_aamarpay_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.AAMARPAY]}
                helpText={t("Get your Aamarpay API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="aamarpay_store_id"
                    label={t("Store ID")}
                    value={data.aamarpay_store_id}
                    onChange={(value) => setData('aamarpay_store_id', value)}
                    placeholder={t("Store ID")}
                    error={errors.aamarpay_store_id}
                  />
                  <PaymentInputField
                    id="aamarpay_signature"
                    label={t("Signature")}
                    value={data.aamarpay_signature}
                    onChange={(value) => setData('aamarpay_signature', value)}
                    placeholder={t("Signature")}
                    isSecret
                    error={errors.aamarpay_signature}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Midtrans */}
              {shouldShowMethod('midtrans') && (
              <PaymentMethodCard
                title={t('Midtrans')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_midtrans_enabled}
                onToggle={(checked) => setData('is_midtrans_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.MIDTRANS]}
                helpText={t("Get your Midtrans API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.midtrans_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('midtrans_mode', mode)}
                  name="midtrans"
                />
                <PaymentInputField
                  id="midtrans_secret_key"
                  label={t("Secret Key")}
                  value={data.midtrans_secret_key}
                  onChange={(value) => setData('midtrans_secret_key', value)}
                  placeholder={t("Secret Key")}
                  isSecret
                  error={errors.midtrans_secret_key}
                />
              </PaymentMethodCard>
              )}

              {/* YooKassa */}
              {shouldShowMethod('yookassa') && (
              <PaymentMethodCard
                title={t('YooKassa')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_yookassa_enabled}
                onToggle={(checked) => setData('is_yookassa_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.YOOKASSA]}
                helpText={t("Get your YooKassa API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="yookassa_shop_id"
                    label={t("Shop ID")}
                    value={data.yookassa_shop_id}
                    onChange={(value) => setData('yookassa_shop_id', value)}
                    placeholder={t("Shop ID")}
                    error={errors.yookassa_shop_id}
                  />
                  <PaymentInputField
                    id="yookassa_secret_key"
                    label={t("Secret Key")}
                    value={data.yookassa_secret_key}
                    onChange={(value) => setData('yookassa_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.yookassa_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Nepalste */}
              {/* {shouldShowMethod('nepalste') && (
              <PaymentMethodCard
                title={t('Nepalste')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_nepalste_enabled}
                onToggle={(checked) => setData('is_nepalste_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.NEPALSTE]}
                helpText={t("Get your Nepalste API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.nepalste_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('nepalste_mode', mode)}
                  name="nepalste"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="nepalste_public_key"
                    label={t("Public Key")}
                    value={data.nepalste_public_key}
                    onChange={(value) => setData('nepalste_public_key', value)}
                    placeholder={t("Public Key")}
                    error={errors.nepalste_public_key}
                  />
                  <PaymentInputField
                    id="nepalste_secret_key"
                    label={t("Secret Key")}
                    value={data.nepalste_secret_key}
                    onChange={(value) => setData('nepalste_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.nepalste_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )} */}

              {/* Paiement Pro */}
              {shouldShowMethod('paiement') && (
              <PaymentMethodCard
                title={t('Paiement Pro')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_paiement_enabled}
                onToggle={(checked) => setData('is_paiement_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.PAIEMENT]}
                helpText={t("Get your Paiement Pro API credentials from your")}
              >
                <PaymentInputField
                  id="paiement_merchant_id"
                  label={t("Merchant ID")}
                  value={data.paiement_merchant_id}
                  onChange={(value) => setData('paiement_merchant_id', value)}
                  placeholder={t("Merchant ID")}
                  error={errors.paiement_merchant_id}
                />
              </PaymentMethodCard>
              )}

              {/* CinetPay */}
              {shouldShowMethod('cinetpay') && (
              <PaymentMethodCard
                title={t('CinetPay')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_cinetpay_enabled}
                onToggle={(checked) => setData('is_cinetpay_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.CINETPAY]}
                helpText={t("Get your CinetPay API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PaymentInputField
                    id="cinetpay_site_id"
                    label={t("Site ID")}
                    value={data.cinetpay_site_id}
                    onChange={(value) => setData('cinetpay_site_id', value)}
                    placeholder={t("Site ID")}
                    error={errors.cinetpay_site_id}
                  />
                  <PaymentInputField
                    id="cinetpay_api_key"
                    label={t("API Key")}
                    value={data.cinetpay_api_key}
                    onChange={(value) => setData('cinetpay_api_key', value)}
                    placeholder={t("API Key")}
                    error={errors.cinetpay_api_key}
                  />
                  <PaymentInputField
                    id="cinetpay_secret_key"
                    label={t("Secret Key")}
                    value={data.cinetpay_secret_key}
                    onChange={(value) => setData('cinetpay_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.cinetpay_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* PayHere */}
              {shouldShowMethod('payhere') && (
              <PaymentMethodCard
                title={t('PayHere')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_payhere_enabled}
                onToggle={(checked) => setData('is_payhere_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.PAYHERE]}
                helpText={t("Get your PayHere API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.payhere_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('payhere_mode', mode)}
                  name="payhere"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="payhere_merchant_id"
                    label={t("Merchant ID")}
                    value={data.payhere_merchant_id}
                    onChange={(value) => setData('payhere_merchant_id', value)}
                    placeholder={t("Merchant ID")}
                    error={errors.payhere_merchant_id}
                  />
                  <PaymentInputField
                    id="payhere_merchant_secret"
                    label={t("Merchant Secret")}
                    value={data.payhere_merchant_secret}
                    onChange={(value) => setData('payhere_merchant_secret', value)}
                    placeholder={t("Merchant Secret")}
                    isSecret
                    error={errors.payhere_merchant_secret}
                  />
                  <PaymentInputField
                    id="payhere_app_id"
                    label={t("App ID")}
                    value={data.payhere_app_id}
                    onChange={(value) => setData('payhere_app_id', value)}
                    placeholder={t("App ID")}
                    error={errors.payhere_app_id}
                  />
                  <PaymentInputField
                    id="payhere_app_secret"
                    label={t("App Secret")}
                    value={data.payhere_app_secret}
                    onChange={(value) => setData('payhere_app_secret', value)}
                    placeholder={t("App Secret")}
                    isSecret
                    error={errors.payhere_app_secret}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* FedaPay */}
              {shouldShowMethod('fedapay') && (
              <PaymentMethodCard
                title={t('FedaPay')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_fedapay_enabled}
                onToggle={(checked) => setData('is_fedapay_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.FEDAPAY]}
                helpText={t("Get your FedaPay API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.fedapay_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('fedapay_mode', mode)}
                  name="fedapay"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="fedapay_public_key"
                    label={t("Public Key")}
                    value={data.fedapay_public_key}
                    onChange={(value) => setData('fedapay_public_key', value)}
                    placeholder={t("Public Key")}
                    error={errors.fedapay_public_key}
                  />
                  <PaymentInputField
                    id="fedapay_secret_key"
                    label={t("Secret Key")}
                    value={data.fedapay_secret_key}
                    onChange={(value) => setData('fedapay_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.fedapay_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* AuthorizeNet */}
              {shouldShowMethod('authorizenet') && (
              <PaymentMethodCard
                title={t('AuthorizeNet')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_authorizenet_enabled}
                onToggle={(checked) => setData('is_authorizenet_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.AUTHORIZENET]}
                helpText={t("Get your AuthorizeNet API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.authorizenet_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('authorizenet_mode', mode)}
                  name="authorizenet"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="authorizenet_merchant_id"
                    label={t("Merchant ID")}
                    value={data.authorizenet_merchant_id}
                    onChange={(value) => setData('authorizenet_merchant_id', value)}
                    placeholder={t("Merchant ID")}
                    error={errors.authorizenet_merchant_id}
                  />
                  <PaymentInputField
                    id="authorizenet_transaction_key"
                    label={t("Transaction Key")}
                    value={data.authorizenet_transaction_key}
                    onChange={(value) => setData('authorizenet_transaction_key', value)}
                    placeholder={t("Transaction Key")}
                    isSecret
                    error={errors.authorizenet_transaction_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Khalti */}
              {shouldShowMethod('khalti') && (
              <PaymentMethodCard
                title={t('Khalti')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_khalti_enabled}
                onToggle={(checked) => setData('is_khalti_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.KHALTI]}
                helpText={t("Get your Khalti API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="khalti_public_key"
                    label={t("Public Key")}
                    value={data.khalti_public_key}
                    onChange={(value) => setData('khalti_public_key', value)}
                    placeholder={t("Public Key")}
                    error={errors.khalti_public_key}
                  />
                  <PaymentInputField
                    id="khalti_secret_key"
                    label={t("Secret Key")}
                    value={data.khalti_secret_key}
                    onChange={(value) => setData('khalti_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.khalti_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Easebuzz */}
              {shouldShowMethod('easebuzz') && (
              <PaymentMethodCard
                title={t('Easebuzz')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_easebuzz_enabled}
                onToggle={(checked) => setData('is_easebuzz_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.EASEBUZZ]}
                helpText={t("Get your Easebuzz API credentials from your")}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PaymentInputField
                    id="easebuzz_merchant_key"
                    label={t("Merchant Key")}
                    value={data.easebuzz_merchant_key}
                    onChange={(value) => setData('easebuzz_merchant_key', value)}
                    placeholder={t("Merchant Key")}
                    error={errors.easebuzz_merchant_key}
                  />
                  <PaymentInputField
                    id="easebuzz_salt_key"
                    label={t("Salt Key")}
                    value={data.easebuzz_salt_key}
                    onChange={(value) => setData('easebuzz_salt_key', value)}
                    placeholder={t("Salt Key")}
                    isSecret
                    error={errors.easebuzz_salt_key}
                  />
                  <PaymentInputField
                    id="easebuzz_environment"
                    label={t("Environment")}
                    value={data.easebuzz_environment}
                    onChange={(value) => setData('easebuzz_environment', value)}
                    placeholder={t("prod/test")}
                    error={errors.easebuzz_environment}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Ozow */}
              {shouldShowMethod('ozow') && (
              <PaymentMethodCard
                title={t('Ozow')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_ozow_enabled}
                onToggle={(checked) => setData('is_ozow_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.OZOW]}
                helpText={t("Get your Ozow API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.ozow_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('ozow_mode', mode)}
                  name="ozow"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PaymentInputField
                    id="ozow_site_key"
                    label={t("Site Key")}
                    value={data.ozow_site_key}
                    onChange={(value) => setData('ozow_site_key', value)}
                    placeholder={t("Site Key")}
                    error={errors.ozow_site_key}
                  />
                  <PaymentInputField
                    id="ozow_private_key"
                    label={t("Private Key")}
                    value={data.ozow_private_key}
                    onChange={(value) => setData('ozow_private_key', value)}
                    placeholder={t("Private Key")}
                    isSecret
                    error={errors.ozow_private_key}
                  />
                  <PaymentInputField
                    id="ozow_api_key"
                    label={t("API Key")}
                    value={data.ozow_api_key}
                    onChange={(value) => setData('ozow_api_key', value)}
                    placeholder={t("API Key")}
                    error={errors.ozow_api_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

              {/* Cashfree */}
              {shouldShowMethod('cashfree') && (
              <PaymentMethodCard
                title={t('Cashfree')}
                icon={<CreditCard className="h-5 w-5" />}
                enabled={data.is_cashfree_enabled}
                onToggle={(checked) => setData('is_cashfree_enabled', checked)}
                helpUrl={PAYMENT_METHOD_HELP_URLS[PAYMENT_METHODS.CASHFREE]}
                helpText={t("Get your Cashfree API credentials from your")}
              >
                <PaymentModeSelector
                  value={data.cashfree_mode as 'sandbox' | 'live'}
                  onChange={(mode) => setData('cashfree_mode', mode)}
                  name="cashfree"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="cashfree_public_key"
                    label={t("Public Key")}
                    value={data.cashfree_public_key}
                    onChange={(value) => setData('cashfree_public_key', value)}
                    placeholder={t("Public Key")}
                    error={errors.cashfree_public_key}
                  />
                  <PaymentInputField
                    id="cashfree_secret_key"
                    label={t("Secret Key")}
                    value={data.cashfree_secret_key}
                    onChange={(value) => setData('cashfree_secret_key', value)}
                    placeholder={t("Secret Key")}
                    isSecret
                    error={errors.cashfree_secret_key}
                  />
                </div>
              </PaymentMethodCard>
              )}

            </CardContent>
          </Card>
        </div>
      </form>
    </SettingsSection>
  );
}