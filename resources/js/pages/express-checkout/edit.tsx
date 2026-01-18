import React, { useState, useEffect } from 'react';
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

export default function EditExpressCheckout() {
  const { t } = useTranslation();
  const { checkout, availablePaymentMethods = [] } = usePage().props as any;
  const [checkoutType, setCheckoutType] = useState(checkout.type || 'buy_now');
  const [formData, setFormData] = useState({
    name: checkout.name || '',
    type: checkout.type || 'buy_now',
    description: checkout.description || '',
    button_text: checkout.button_text || 'Buy Now',
    button_color: checkout.button_color || '#000000',
    is_active: checkout.is_active !== undefined ? checkout.is_active : true,
    payment_methods: checkout.payment_methods || ['credit_card', 'paypal'],
    default_payment_method: checkout.default_payment_method || 'credit_card',
    skip_cart: checkout.skip_cart !== undefined ? checkout.skip_cart : true,
    auto_fill_customer_data: checkout.auto_fill_customer_data !== undefined ? checkout.auto_fill_customer_data : true,
    guest_checkout_allowed: checkout.guest_checkout_allowed !== undefined ? checkout.guest_checkout_allowed : false,
    mobile_optimized: checkout.mobile_optimized !== undefined ? checkout.mobile_optimized : true,
    save_payment_methods: checkout.save_payment_methods !== undefined ? checkout.save_payment_methods : false,
    success_redirect_url: checkout.success_redirect_url || '',
    cancel_redirect_url: checkout.cancel_redirect_url || ''
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
    router.put(route('express-checkout.update', checkout.id), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('express-checkout.index'))
    },
    {
      label: t('Update Checkout'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => handleSubmit()
    }
  ];

  return (
    <PageTemplate 
      title={t('Edit Express Checkout')}
      url="/express-checkout/edit"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Express Checkout'), href: route('express-checkout.index') },
        { title: t('Edit Express Checkout') }
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('Checkout Name *')}</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
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
                  />
                </div>
                <div>
                  <Label htmlFor="cancel_redirect_url">{t('Cancel Redirect URL')}</Label>
                  <Input 
                    id="cancel_redirect_url" 
                    name="cancel_redirect_url"
                    value={formData.cancel_redirect_url}
                    onChange={handleInputChange}
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