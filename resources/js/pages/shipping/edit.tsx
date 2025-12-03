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
import { usePermissions } from '@/hooks/usePermissions';
import { getCurrencySymbol } from '@/utils/helpers';

export default function EditShipping() {
  const { t } = useTranslation();
  const { shipping } = usePage().props as any;
  const { hasPermission } = usePermissions();
  const [shippingType, setShippingType] = useState(shipping.type || 'flat_rate');
  const [formData, setFormData] = useState({
    name: shipping.name || '',
    type: shipping.type || 'flat_rate',
    description: shipping.description || '',
    cost: shipping.cost || 0,
    min_order_amount: shipping.min_order_amount || 0,
    delivery_time: shipping.delivery_time || '',
    sort_order: shipping.sort_order || 0,
    is_active: shipping.is_active !== undefined ? shipping.is_active : true,
    zone_type: shipping.zone_type || 'domestic',
    countries: shipping.countries || '',
    postal_codes: shipping.postal_codes || '',
    max_distance: shipping.max_distance || null,
    max_weight: shipping.max_weight || null,
    max_dimensions: shipping.max_dimensions || '',
    require_signature: shipping.require_signature !== undefined ? shipping.require_signature : false,
    insurance_required: shipping.insurance_required !== undefined ? shipping.insurance_required : false,
    tracking_available: shipping.tracking_available !== undefined ? shipping.tracking_available : true,
    handling_fee: shipping.handling_fee || 0
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (name, value) => {
    if (name === 'type') {
      setShippingType(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = () => {
    router.put(route('shipping.update', shipping.id), formData);
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('shipping.index'))
    }
  ];
  
  if (hasPermission('edit-shipping')) {
    pageActions.push({
      label: t('Update Shipping'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => handleSubmit()
    });
  }

  return (
    <PageTemplate 
      title={t('Edit Shipping Method')}
      url="/shipping/edit"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Shipping Management'), href: route('shipping.index') },
        { title: t('Edit Shipping Method') }
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">{t('General')}</TabsTrigger>
            <TabsTrigger value="zones">{t('Shipping Zones')}</TabsTrigger>
            <TabsTrigger value="advanced">{t('Advanced')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Shipping Method Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('Method Name *')}</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">{t('Shipping Type *')}</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat_rate">{t('Flat Rate')}</SelectItem>
                        <SelectItem value="free_shipping">{t('Free Shipping')}</SelectItem>
                        <SelectItem value="weight_based">{t('Weight Based')}</SelectItem>
                        <SelectItem value="distance_based">{t('Distance Based')}</SelectItem>
                        <SelectItem value="percentage_based">{t('Percentage Based')}</SelectItem>
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
                {shippingType !== 'free_shipping' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cost">
                        {shippingType === 'percentage_based' ? t('Percentage (%)') : t('Shipping Cost ({{symbol}})', { symbol: getCurrencySymbol() })}
                      </Label>
                      <Input 
                        id="cost" 
                        name="cost"
                        type="number" 
                        step={shippingType === 'percentage_based' ? '0.1' : '0.01'} 
                        value={formData.cost}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="min_order">{t('Minimum Order Amount')}</Label>
                      <Input 
                        id="min_order" 
                        name="min_order_amount"
                        type="number" 
                        step="0.01" 
                        value={formData.min_order_amount}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="delivery_time">{t('Estimated Delivery Time')}</Label>
                    <Input 
                      id="delivery_time" 
                      name="delivery_time"
                      value={formData.delivery_time}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sort_order">{t('Sort Order')}</Label>
                    <Input 
                      id="sort_order" 
                      name="sort_order"
                      type="number" 
                      value={formData.sort_order}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Method Status')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Enable or disable shipping method')}</p>
                  </div>
                  <Switch 
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Zones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zone_type">{t('Zone Type')}</Label>
                  <Select
                    value={formData.zone_type}
                    onValueChange={(value) => handleSelectChange('zone_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestic">{t('Domestic')}</SelectItem>
                      <SelectItem value="international">{t('International')}</SelectItem>
                      <SelectItem value="local">{t('Local')}</SelectItem>
                      <SelectItem value="regional">{t('Regional')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="countries">{t('Countries/Regions')}</Label>
                  <Textarea 
                    id="countries" 
                    name="countries"
                    value={formData.countries}
                    onChange={handleInputChange}
                    rows={4} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal_codes">{t('Postal Codes')}</Label>
                    <Input 
                      id="postal_codes" 
                      name="postal_codes"
                      value={formData.postal_codes}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_distance">{t('Max Distance (km)')}</Label>
                    <Input 
                      id="max_distance" 
                      name="max_distance"
                      type="number" 
                      value={formData.max_distance || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Advanced Settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max_weight">{t('Maximum Weight (kg)')}</Label>
                    <Input 
                      id="max_weight" 
                      name="max_weight"
                      type="number" 
                      step="0.1" 
                      value={formData.max_weight || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_dimensions">{t('Maximum Dimensions (cm)')}</Label>
                    <Input 
                      id="max_dimensions" 
                      name="max_dimensions"
                      value={formData.max_dimensions}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Require Signature')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Require signature on delivery')}</p>
                  </div>
                  <Switch 
                    checked={formData.require_signature}
                    onCheckedChange={(checked) => handleSwitchChange('require_signature', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Insurance Required')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Require shipping insurance')}</p>
                  </div>
                  <Switch 
                    checked={formData.insurance_required}
                    onCheckedChange={(checked) => handleSwitchChange('insurance_required', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Tracking Available')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Provide tracking information')}</p>
                  </div>
                  <Switch 
                    checked={formData.tracking_available}
                    onCheckedChange={(checked) => handleSwitchChange('tracking_available', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="handling_fee">{t('Handling Fee ({{symbol}})', { symbol: getCurrencySymbol() })}</Label>
                  <Input 
                    id="handling_fee" 
                    name="handling_fee"
                    type="number" 
                    step="0.01" 
                    value={formData.handling_fee}
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