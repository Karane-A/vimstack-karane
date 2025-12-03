import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

export default function CreateExpressCheckout() {
  const { t } = useTranslation();
  const [checkoutType, setCheckoutType] = useState('buy_now');
  const [formData, setFormData] = useState({
    name: '',
    type: 'buy_now',
    description: '',
    button_text: 'Buy Now',
    button_color: '#000000',
    is_active: true,
    payment_methods: ['credit_card', 'paypal'],
    default_payment_method: 'credit_card',
    skip_cart: true,
    auto_fill_customer_data: true,
    guest_checkout_allowed: false,
    mobile_optimized: true,
    save_payment_methods: false,
    success_redirect_url: '',
    cancel_redirect_url: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (value) => {
    setCheckoutType(value);
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePaymentMethodChange = (method, checked) => {
    setFormData(prev => {
      let methods = [...(prev.payment_methods || [])];
      
      if (checked && !methods.includes(method)) {
        methods.push(method);
      } else if (!checked && methods.includes(method)) {
        methods = methods.filter(m => m !== method);
      }
      
      return {
        ...prev,
        payment_methods: methods
      };
    });
  };

  const handleDefaultPaymentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      default_payment_method: value
    }));
  };

  const handleSubmit = () => {
    router.post(route('express-checkout.store'), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('express-checkout.index'))
    },
    {
      label: t('Save Checkout'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => handleSubmit()
    }
  ];

  return (
    <PageTemplate 
      title={t('Create Express Checkout')}
      url="/express-checkout/create"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Express Checkout'), href: route('express-checkout.index') },
        { title: t('Create Express Checkout') }
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">{t('General')}</TabsTrigger>
            <TabsTrigger value="payment">{t('Payment')}</TabsTrigger>
            <TabsTrigger value="settings">{t('Settings')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Checkout Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('Checkout Name *')}</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('Enter checkout name')} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">{t('Checkout Type *')}</Label>
                    <Select value={checkoutType} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy_now">{t('Buy Now')}</SelectItem>
                        <SelectItem value="express_cart">{t('Express Cart')}</SelectItem>
                        <SelectItem value="guest_checkout">{t('Guest Checkout')}</SelectItem>
                        <SelectItem value="mobile_optimized">{t('Mobile Optimized')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">{t('Description')}</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={t('Describe this checkout method')} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="button_text">{t('Button Text')}</Label>
                    <Input 
                      id="button_text" 
                      name="button_text"
                      value={formData.button_text}
                      onChange={handleInputChange}
                      placeholder={t('Buy Now')} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="button_color">{t('Button Color')}</Label>
                    <Input 
                      id="button_color" 
                      name="button_color"
                      type="color" 
                      value={formData.button_color}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Checkout Status')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Enable or disable this checkout')}</p>
                  </div>
                  <Switch 
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="credit_card" 
                      checked={formData.payment_methods.includes('credit_card')}
                      onCheckedChange={(checked) => handlePaymentMethodChange('credit_card', checked)}
                    />
                    <Label htmlFor="credit_card">{t('Credit/Debit Cards')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="paypal" 
                      checked={formData.payment_methods.includes('paypal')}
                      onCheckedChange={(checked) => handlePaymentMethodChange('paypal', checked)}
                    />
                    <Label htmlFor="paypal">{t('PayPal')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="apple_pay" 
                      checked={formData.payment_methods.includes('apple_pay')}
                      onCheckedChange={(checked) => handlePaymentMethodChange('apple_pay', checked)}
                    />
                    <Label htmlFor="apple_pay">{t('Apple Pay')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="google_pay" 
                      checked={formData.payment_methods.includes('google_pay')}
                      onCheckedChange={(checked) => handlePaymentMethodChange('google_pay', checked)}
                    />
                    <Label htmlFor="google_pay">{t('Google Pay')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="samsung_pay" 
                      checked={formData.payment_methods.includes('samsung_pay')}
                      onCheckedChange={(checked) => handlePaymentMethodChange('samsung_pay', checked)}
                    />
                    <Label htmlFor="samsung_pay">{t('Samsung Pay')}</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="default_payment">{t('Default Payment Method')}</Label>
                  <Select 
                    value={formData.default_payment_method}
                    onValueChange={handleDefaultPaymentChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select default payment')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">{t('Credit/Debit Cards')}</SelectItem>
                      <SelectItem value="paypal">{t('PayPal')}</SelectItem>
                      <SelectItem value="apple_pay">{t('Apple Pay')}</SelectItem>
                      <SelectItem value="google_pay">{t('Google Pay')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Checkout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Skip Cart Page')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Go directly to checkout')}</p>
                  </div>
                  <Switch 
                    checked={formData.skip_cart}
                    onCheckedChange={(checked) => handleSwitchChange('skip_cart', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Auto-fill Customer Data')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Use saved customer information')}</p>
                  </div>
                  <Switch 
                    checked={formData.auto_fill_customer_data}
                    onCheckedChange={(checked) => handleSwitchChange('auto_fill_customer_data', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Guest Checkout Allowed')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow checkout without account')}</p>
                  </div>
                  <Switch 
                    checked={formData.guest_checkout_allowed}
                    onCheckedChange={(checked) => handleSwitchChange('guest_checkout_allowed', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Mobile Optimized')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Optimize for mobile devices')}</p>
                  </div>
                  <Switch 
                    checked={formData.mobile_optimized}
                    onCheckedChange={(checked) => handleSwitchChange('mobile_optimized', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Save Payment Methods')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow customers to save payment info')}</p>
                  </div>
                  <Switch 
                    checked={formData.save_payment_methods}
                    onCheckedChange={(checked) => handleSwitchChange('save_payment_methods', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="success_redirect_url">{t('Success Redirect URL')}</Label>
                  <Input 
                    id="success_redirect_url" 
                    name="success_redirect_url"
                    value={formData.success_redirect_url}
                    onChange={handleInputChange}
                    placeholder={t('https://example.com/thank-you')} 
                  />
                </div>
                <div>
                  <Label htmlFor="cancel_redirect_url">{t('Cancel Redirect URL')}</Label>
                  <Input 
                    id="cancel_redirect_url" 
                    name="cancel_redirect_url"
                    value={formData.cancel_redirect_url}
                    onChange={handleInputChange}
                    placeholder={t('https://example.com/cart')} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
}