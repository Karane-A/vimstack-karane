import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import MediaPicker from '@/components/MediaPicker';
import { usePermissions } from '@/hooks/usePermissions';

export default function EditCustomer() {
  const { t } = useTranslation();
  const { customer, billingAddress, shippingAddress, sameAsBilling, countries = [], languages = [] } = usePage().props as any;
  const { hasPermission } = usePermissions();
  const [avatar, setAvatar] = useState(customer.avatar || '');
  const [formData, setFormData] = useState({
    first_name: customer.first_name || '',
    last_name: customer.last_name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    date_of_birth: customer.date_of_birth || '',
    gender: customer.gender || '',
    notes: customer.notes || '',
    is_active: customer.is_active !== undefined ? customer.is_active : true,
    preferred_language: customer.preferred_language || 'en',
    customer_group: customer.customer_group || 'regular',
    email_marketing: customer.email_marketing !== undefined ? customer.email_marketing : true,
    sms_notifications: customer.sms_notifications !== undefined ? customer.sms_notifications : false,
    order_updates: customer.order_updates !== undefined ? customer.order_updates : true,
    billing_address: {
      address: billingAddress?.address || '',
      city: billingAddress?.city || '',
      state: billingAddress?.state || '',
      postal_code: billingAddress?.postal_code || '',
      country: billingAddress?.country || 'us'
    },
    shipping_address: {
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || '',
      postal_code: shippingAddress?.postal_code || '',
      country: shippingAddress?.country || 'us'
    },
    same_as_billing: sameAsBilling || false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSwitchChange = (name, checked) => {
    if (name === 'same_as_billing' && checked) {
      setFormData(prev => ({
        ...prev,
        same_as_billing: checked,
        shipping_address: { ...prev.billing_address }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelectChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    // Add avatar to form data
    const submitData = {
      ...formData,
      avatar
    };
    
    router.put(route('customers.update', customer.id), submitData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('customers.index'))
    }
  ];
  
  if (hasPermission('edit-customers')) {
    pageActions.push({
      label: t('Update Customer'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => handleSubmit()
    });
  }

  return (
    <PageTemplate 
      title={t('Edit Customer')}
      url="/customers/edit"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Customer Management'), href: route('customers.index') },
        { title: t('Edit Customer') }
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">{t('Personal Info')}</TabsTrigger>
            <TabsTrigger value="address">{t('Address')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('Preferences')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Personal Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <MediaPicker
                    label={t('Profile Picture')}
                    value={avatar}
                    onChange={setAvatar}
                    placeholder={t('Select profile picture...')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">{t('First Name *')}</Label>
                    <Input 
                      id="first_name" 
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">{t('Last Name *')}</Label>
                    <Input 
                      id="last_name" 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t('Email Address *')}</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('Phone Number')}</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth">{t('Date of Birth')}</Label>
                    <Input 
                      id="date_of_birth" 
                      name="date_of_birth"
                      type="date" 
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">{t('Gender')}</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select gender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('Male')}</SelectItem>
                        <SelectItem value="female">{t('Female')}</SelectItem>
                        <SelectItem value="other">{t('Other')}</SelectItem>
                        <SelectItem value="prefer_not_to_say">{t('Prefer not to say')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">{t('Notes')}</Label>
                  <Textarea 
                    id="notes" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Customer Status')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Enable or disable customer account')}</p>
                  </div>
                  <Switch 
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Billing Address')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="billing_address">{t('Street Address')}</Label>
                  <Input 
                    id="billing_address" 
                    value={formData.billing_address.address}
                    onChange={(e) => handleAddressChange('billing_address', 'address', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billing_city">{t('City')}</Label>
                    <Input 
                      id="billing_city" 
                      value={formData.billing_address.city}
                      onChange={(e) => handleAddressChange('billing_address', 'city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billing_state">{t('State/Province')}</Label>
                    <Input 
                      id="billing_state" 
                      value={formData.billing_address.state}
                      onChange={(e) => handleAddressChange('billing_address', 'state', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billing_postal">{t('Postal Code')}</Label>
                    <Input 
                      id="billing_postal" 
                      value={formData.billing_address.postal_code}
                      onChange={(e) => handleAddressChange('billing_address', 'postal_code', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billing_country">{t('Country')}</Label>
                    <Select
                      value={formData.billing_address.country}
                      onValueChange={(value) => handleAddressSelectChange('billing_address', 'country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries && countries.length > 0 ? (
                          countries.map((country: any) => (
                            <SelectItem key={country.id} value={country.id.toString()}>
                              {country.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>{t('No countries available')}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('Shipping Address')}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={formData.same_as_billing}
                      onCheckedChange={(checked) => handleSwitchChange('same_as_billing', checked)}
                    />
                    <Label className="text-sm">{t('Same as billing')}</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shipping_address">{t('Street Address')}</Label>
                  <Input 
                    id="shipping_address" 
                    value={formData.shipping_address.address}
                    onChange={(e) => handleAddressChange('shipping_address', 'address', e.target.value)}
                    disabled={formData.same_as_billing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_city">{t('City')}</Label>
                    <Input 
                      id="shipping_city" 
                      value={formData.shipping_address.city}
                      onChange={(e) => handleAddressChange('shipping_address', 'city', e.target.value)}
                      disabled={formData.same_as_billing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_state">{t('State/Province')}</Label>
                    <Input 
                      id="shipping_state" 
                      value={formData.shipping_address.state}
                      onChange={(e) => handleAddressChange('shipping_address', 'state', e.target.value)}
                      disabled={formData.same_as_billing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_postal">{t('Postal Code')}</Label>
                    <Input 
                      id="shipping_postal" 
                      value={formData.shipping_address.postal_code}
                      onChange={(e) => handleAddressChange('shipping_address', 'postal_code', e.target.value)}
                      disabled={formData.same_as_billing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_country">{t('Country')}</Label>
                    <Select
                      value={formData.shipping_address.country}
                      onValueChange={(value) => handleAddressSelectChange('shipping_address', 'country', value)}
                      disabled={formData.same_as_billing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries && countries.length > 0 ? (
                          countries.map((country: any) => (
                            <SelectItem key={country.id} value={country.id.toString()}>
                              {country.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>{t('No countries available')}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Communication Preferences')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Email Marketing')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Receive promotional emails')}</p>
                  </div>
                  <Switch 
                    checked={formData.email_marketing}
                    onCheckedChange={(checked) => handleSwitchChange('email_marketing', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('SMS Notifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Receive SMS updates')}</p>
                  </div>
                  <Switch 
                    checked={formData.sms_notifications}
                    onCheckedChange={(checked) => handleSwitchChange('sms_notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Order Updates')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Receive order status updates')}</p>
                  </div>
                  <Switch 
                    checked={formData.order_updates}
                    onCheckedChange={(checked) => handleSwitchChange('order_updates', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="preferred_language">{t('Preferred Language')}</Label>
                  <Select
                    value={formData.preferred_language}
                    onValueChange={(value) => handleSelectChange('preferred_language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select language')} />
                    </SelectTrigger>
                    <SelectContent>
                      {languages && languages.length > 0 ? (
                        languages.map((language: any) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="en">{t('English')}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="customer_group">{t('Customer Group')}</Label>
                  <Select
                    value={formData.customer_group}
                    onValueChange={(value) => handleSelectChange('customer_group', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">{t('Regular Customer')}</SelectItem>
                      <SelectItem value="vip">{t('VIP Customer')}</SelectItem>
                      <SelectItem value="wholesale">{t('Wholesale Customer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTemplate>
  );
}