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
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';

export default function CreateExpressCheckout() {
  const { t } = useTranslation();
  const { availablePaymentMethods = [] } = usePage().props as any;
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
                <CardTitle>{t('Basic Information')}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('Configure the basic details for your express checkout')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold">
                      {t('Checkout Name')} <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('Internal name to identify this checkout configuration')}
                    </p>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('e.g., Mobile Quick Checkout')}
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-base font-semibold">
                      {t('Checkout Type')} <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('Select the checkout experience type')}
                    </p>
                    <Select value={checkoutType} onValueChange={handleTypeChange}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t('Choose type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy_now">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{t('Buy Now')}</span>
                            <span className="text-xs text-muted-foreground">{t('Quick one-click purchase')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="express_cart">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{t('Express Cart')}</span>
                            <span className="text-xs text-muted-foreground">{t('Fast cart checkout')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="guest_checkout">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{t('Guest Checkout')}</span>
                            <span className="text-xs text-muted-foreground">{t('No account required')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="mobile_optimized">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{t('Mobile Optimized')}</span>
                            <span className="text-xs text-muted-foreground">{t('Mobile-first experience')}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">{t('Description')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('Describe the purpose and use case for this checkout method')}
                  </p>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={t('e.g., Optimized checkout for mobile users with saved payment methods')}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="text-base font-semibold mb-4">{t('Button Customization')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="button_text">{t('Button Text')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Text displayed on the checkout button')}
                      </p>
                      <Input 
                        id="button_text" 
                        name="button_text"
                        value={formData.button_text}
                        onChange={handleInputChange}
                        placeholder={t('Buy Now')}
                        className="mt-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="button_color">{t('Button Color')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Choose a color for the checkout button')}
                      </p>
                      <div className="flex gap-2 items-center mt-2">
                        <Input 
                          id="button_color" 
                          name="button_color"
                          type="color" 
                          value={formData.button_color}
                          onChange={handleInputChange}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input 
                          value={formData.button_color}
                          onChange={handleInputChange}
                          name="button_color"
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex-1">
                      <Label className="text-base font-semibold">{t('Activate Checkout')}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Enable this checkout method for customers')}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('Select which payment methods customers can use for express checkout')}
                  </p>
                  
                  {availablePaymentMethods && availablePaymentMethods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availablePaymentMethods.map((method: any) => (
                        <div 
                          key={method.value} 
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                            formData.payment_methods.includes(method.value) 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border bg-background'
                          }`}
                          onClick={() => handlePaymentMethodChange(method.value, !formData.payment_methods.includes(method.value))}
                        >
                          <Checkbox 
                            id={method.value}
                            checked={formData.payment_methods.includes(method.value)}
                            onCheckedChange={(checked) => handlePaymentMethodChange(method.value, checked)}
                            className="pointer-events-none"
                          />
                          <Label htmlFor={method.value} className="font-medium cursor-pointer flex-1">
                            {t(method.label)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{t('No Payment Methods Available')}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('Please enable payment methods in your store settings first to use express checkout.')}
                      </p>
                      <Button variant="outline" size="sm" onClick={() => window.open('/settings', '_blank')}>
                        {t('Go to Payment Settings')}
                      </Button>
                    </div>
                  )}
                </div>
                
                {availablePaymentMethods && availablePaymentMethods.length > 0 && (
                  <div>
                    <Label htmlFor="default_payment" className="text-base font-semibold mb-2 block">
                      {t('Default Payment Method')}
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('This payment method will be pre-selected for customers')}
                    </p>
                    <Select 
                      value={formData.default_payment_method}
                      onValueChange={handleDefaultPaymentChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('Select default payment')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePaymentMethods.map((method: any) => (
                          <SelectItem key={method.value} value={method.value}>
                            {t(method.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Checkout Behavior')}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('Configure how the checkout process works for customers')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium">{t('Skip Cart Page')}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Bypass the cart and go directly to checkout for faster purchasing')}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.skip_cart}
                      onCheckedChange={(checked) => handleSwitchChange('skip_cart', checked)}
                    />
                  </div>
                  
                  <div className="flex items-start justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium">{t('Auto-fill Customer Data')}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Automatically fill in saved customer information for returning customers')}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.auto_fill_customer_data}
                      onCheckedChange={(checked) => handleSwitchChange('auto_fill_customer_data', checked)}
                    />
                  </div>
                  
                  <div className="flex items-start justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium">{t('Guest Checkout')}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Allow customers to checkout without creating an account')}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.guest_checkout_allowed}
                      onCheckedChange={(checked) => handleSwitchChange('guest_checkout_allowed', checked)}
                    />
                  </div>
                  
                  <div className="flex items-start justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium">{t('Mobile Optimization')}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Optimize the checkout experience for mobile devices and small screens')}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.mobile_optimized}
                      onCheckedChange={(checked) => handleSwitchChange('mobile_optimized', checked)}
                    />
                  </div>
                  
                  <div className="flex items-start justify-between p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                    <div className="flex-1 pr-4">
                      <Label className="text-base font-medium">{t('Save Payment Methods')}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Allow customers to securely save their payment methods for future purchases')}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.save_payment_methods}
                      onCheckedChange={(checked) => handleSwitchChange('save_payment_methods', checked)}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6 space-y-4">
                  <h4 className="text-base font-semibold">{t('Redirect URLs')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('Specify where customers should be redirected after checkout')}
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="success_redirect_url" className="font-medium">
                      {t('Success Page URL')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('Where to redirect after successful payment (optional)')}
                    </p>
                    <Input 
                      id="success_redirect_url" 
                      name="success_redirect_url"
                      value={formData.success_redirect_url}
                      onChange={handleInputChange}
                      placeholder={t('https://yourstore.com/thank-you')}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cancel_redirect_url" className="font-medium">
                      {t('Cancel Page URL')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('Where to redirect if customer cancels checkout (optional)')}
                    </p>
                    <Input 
                      id="cancel_redirect_url" 
                      name="cancel_redirect_url"
                      value={formData.cancel_redirect_url}
                      onChange={handleInputChange}
                      placeholder={t('https://yourstore.com/cart')}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
}