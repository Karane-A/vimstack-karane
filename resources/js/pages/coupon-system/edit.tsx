import React, { useState } from 'react';
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

export default function EditCoupon() {
  const { t } = useTranslation();
  const { coupon } = usePage().props as any;
  const { hasPermission } = usePermissions();
  
  // Format dates for input fields (YYYY-MM-DD format)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    name: coupon.name || '',
    code: coupon.code || '',
    description: coupon.description || '',
    type: coupon.type || 'percentage',
    discount_amount: coupon.discount_amount || '',
    minimum_spend: coupon.minimum_spend || '',
    maximum_spend: coupon.maximum_spend || '',
    start_date: formatDate(coupon.start_date),
    expiry_date: formatDate(coupon.expiry_date),
    use_limit_per_coupon: coupon.use_limit_per_coupon || '',
    use_limit_per_user: coupon.use_limit_per_user || '',
    status: coupon.status !== undefined ? coupon.status : true,
    code_type: coupon.code_type || 'manual'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSubmit = () => {
    // Format dates properly before submission
    const submissionData = {
      ...formData,
      start_date: formData.start_date || null,
      expiry_date: formData.expiry_date || null
    };
    router.put(route('store-coupons.update', coupon.id), submissionData);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      code: result
    });
  };

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('coupon-system.index'))
    }
  ];
  
  if (hasPermission('edit-coupon-system')) {
    pageActions.push({
      label: t('Update Coupon'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit
    });
  }

  return (
    <PageTemplate 
      title={t('Edit Coupon')}
      url="/coupon-system/edit"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Coupon System'), href: route('coupon-system.index') },
        { title: t('Edit Coupon') }
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">{t('General')}</TabsTrigger>
            <TabsTrigger value="restrictions">{t('Restrictions')}</TabsTrigger>
            <TabsTrigger value="usage">{t('Usage Limits')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Coupon Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('Coupon Name *')}</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('Enter coupon name')} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">{t('Coupon Code *')}</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="code" 
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder={t('SAVE20')} 
                      />
                      <button 
                        type="button"
                        onClick={generateCode}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        {t('Generate')}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">{t('Description')}</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('Coupon description')} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">{t('Discount Type *')}</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">{t('Percentage Discount')}</SelectItem>
                        <SelectItem value="flat">{t('Fixed Amount')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discount_amount">
                      {formData.type === 'percentage' ? t('Discount Percentage (%)') : t('Discount Amount ({{symbol}})', { symbol: getCurrencySymbol() })}
                    </Label>
                    <Input 
                      id="discount_amount" 
                      name="discount_amount"
                      type="number" 
                      step={formData.type === 'percentage' ? '1' : '0.01'} 
                      value={formData.discount_amount}
                      onChange={handleChange}
                      placeholder={formData.type === 'percentage' ? t('20') : t('10.00')} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">{t('Start Date')}</Label>
                    <Input 
                      id="start_date" 
                      name="start_date"
                      type="date" 
                      value={formData.start_date}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry_date">{t('End Date')}</Label>
                    <Input 
                      id="expiry_date" 
                      name="expiry_date"
                      type="date" 
                      value={formData.expiry_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Coupon Status')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Enable or disable coupon')}</p>
                  </div>
                  <Switch 
                    checked={formData.status}
                    onCheckedChange={(checked) => handleSwitchChange('status', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restrictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Usage Restrictions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minimum_spend">{t('Minimum Spend Amount')}</Label>
                    <Input 
                      id="minimum_spend" 
                      name="minimum_spend"
                      type="number" 
                      step="0.01" 
                      value={formData.minimum_spend}
                      onChange={handleChange}
                      placeholder="0.00" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="maximum_spend">{t('Maximum Spend Amount')}</Label>
                    <Input 
                      id="maximum_spend" 
                      name="maximum_spend"
                      type="number" 
                      step="0.01" 
                      value={formData.maximum_spend}
                      onChange={handleChange}
                      placeholder="0.00" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Usage Limits')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="use_limit_per_coupon">{t('Usage Limit per Coupon')}</Label>
                    <Input 
                      id="use_limit_per_coupon" 
                      name="use_limit_per_coupon"
                      type="number" 
                      value={formData.use_limit_per_coupon}
                      onChange={handleChange}
                      placeholder={t('Unlimited')} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="use_limit_per_user">{t('Usage Limit per User')}</Label>
                    <Input 
                      id="use_limit_per_user" 
                      name="use_limit_per_user"
                      type="number" 
                      value={formData.use_limit_per_user}
                      onChange={handleChange}
                      placeholder={t('1')} 
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
