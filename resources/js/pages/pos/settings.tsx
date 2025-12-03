import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/custom-toast';

export default function POSSettings() {
  const { t } = useTranslation();
  const { settings, currencies, flash } = usePage().props as any;
  

  
  // Form state
  const [formData, setFormData] = useState({
    tax_rate: settings?.tax_rate || 10,
    default_discount: settings?.default_discount || 0,
    receipt_header: settings?.receipt_header || 'Thank you for shopping with us!',
    receipt_footer: settings?.receipt_footer || 'All sales are final. Returns accepted within 30 days with receipt.',
    enable_guest_checkout: settings?.enable_guest_checkout !== false,
    low_stock_alerts: settings?.low_stock_alerts !== false,
    auto_sync_online_orders: settings?.auto_sync_online_orders === true,
    show_logo_on_receipt: settings?.show_logo_on_receipt !== false,
    show_tax_details: settings?.show_tax_details !== false,
    show_cashier_name: settings?.show_cashier_name !== false,
    email_receipt: settings?.email_receipt !== false,
    receipt_printer: settings?.receipt_printer || 'thermal',
    barcode_scanner: settings?.barcode_scanner || 'usb',
    cash_drawer: settings?.cash_drawer || 'manual',
    card_reader: settings?.card_reader || 'integrated',
    auto_open_cash_drawer: settings?.auto_open_cash_drawer !== false,
    auto_print_receipt: settings?.auto_print_receipt !== false,
  });
  
  // Handle input changes
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle switch changes
  const handleSwitchChange = (name) => {
    setFormData({
      ...formData,
      [name]: !formData[name]
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    router.post(route('pos.update-settings'), formData, {
      preserveScroll: true,
      onError: (errors) => {
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to save POS settings');
        toast.error(errorMessage);
      }
    });
  };

  const pageActions = [
    {
      label: t('Back to POS'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('pos.index'))
    },
    {
      label: t('Save Settings'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: handleSubmit
    }
  ];

  return (
    <PageTemplate 
      title={t('POS Settings')}
      url="/pos/settings"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Point of Sale (POS)'), href: route('pos.index') },
        { title: t('Settings') }
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">{t('General')}</TabsTrigger>
            <TabsTrigger value="receipt">{t('Receipt')}</TabsTrigger>
            <TabsTrigger value="hardware">{t('Hardware')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('General Settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="store_name">{t('Store Name')}</Label>
                  <Input id="store_name" defaultValue={settings?.store_name || "My Store"} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax_rate">{t('Default Tax Rate (%)')}</Label>
                    <Input 
                      id="tax_rate" 
                      type="number" 
                      value={formData.tax_rate}
                      onChange={(e) => handleChange('tax_rate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default_discount">{t('Default Discount (%)')}</Label>
                    <Input 
                      id="default_discount" 
                      type="number" 
                      value={formData.default_discount}
                      onChange={(e) => handleChange('default_discount', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Enable Guest Checkout')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Allow checkout without customer selection')}</p>
                  </div>
                  <Switch 
                    checked={formData.enable_guest_checkout}
                    onCheckedChange={() => handleSwitchChange('enable_guest_checkout')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Low Stock Alerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Show alerts for low inventory items')}</p>
                  </div>
                  <Switch 
                    checked={formData.low_stock_alerts}
                    onCheckedChange={() => handleSwitchChange('low_stock_alerts')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Auto Sync Online Orders')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Automatically sync with online store orders')}</p>
                  </div>
                  <Switch 
                    checked={formData.auto_sync_online_orders}
                    onCheckedChange={() => handleSwitchChange('auto_sync_online_orders')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="receipt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Receipt Settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receipt_header">{t('Receipt Header')}</Label>
                  <Textarea 
                    id="receipt_header" 
                    value={formData.receipt_header}
                    onChange={(e) => handleChange('receipt_header', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt_footer">{t('Receipt Footer')}</Label>
                  <Textarea 
                    id="receipt_footer" 
                    value={formData.receipt_footer}
                    onChange={(e) => handleChange('receipt_footer', e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Show Store Logo')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Display store logo on receipts')}</p>
                  </div>
                  <Switch 
                    checked={formData.show_logo_on_receipt}
                    onCheckedChange={() => handleSwitchChange('show_logo_on_receipt')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Show Tax Details')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Display tax breakdown on receipts')}</p>
                  </div>
                  <Switch 
                    checked={formData.show_tax_details}
                    onCheckedChange={() => handleSwitchChange('show_tax_details')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Show Cashier Name')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Display cashier name on receipts')}</p>
                  </div>
                  <Switch 
                    checked={formData.show_cashier_name}
                    onCheckedChange={() => handleSwitchChange('show_cashier_name')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Email Receipt')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Send receipt to customer email')}</p>
                  </div>
                  <Switch 
                    checked={formData.email_receipt}
                    onCheckedChange={() => handleSwitchChange('email_receipt')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hardware" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Hardware Settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receipt_printer">{t('Receipt Printer')}</Label>
                  <Select 
                    value={formData.receipt_printer}
                    onValueChange={(value) => handleChange('receipt_printer', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thermal">{t('Thermal Printer')}</SelectItem>
                      <SelectItem value="inkjet">{t('Inkjet Printer')}</SelectItem>
                      <SelectItem value="laser">{t('Laser Printer')}</SelectItem>
                      <SelectItem value="none">{t('None')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode_scanner">{t('Barcode Scanner')}</Label>
                  <Select 
                    value={formData.barcode_scanner}
                    onValueChange={(value) => handleChange('barcode_scanner', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usb">{t('USB Scanner')}</SelectItem>
                      <SelectItem value="bluetooth">{t('Bluetooth Scanner')}</SelectItem>
                      <SelectItem value="none">{t('None')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cash_drawer">{t('Cash Drawer')}</Label>
                  <Select 
                    value={formData.cash_drawer}
                    onValueChange={(value) => handleChange('cash_drawer', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">{t('Manual Drawer')}</SelectItem>
                      <SelectItem value="automatic">{t('Automatic Drawer')}</SelectItem>
                      <SelectItem value="none">{t('None')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card_reader">{t('Card Reader')}</Label>
                  <Select 
                    value={formData.card_reader}
                    onValueChange={(value) => handleChange('card_reader', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="integrated">{t('Integrated Terminal')}</SelectItem>
                      <SelectItem value="external">{t('External Terminal')}</SelectItem>
                      <SelectItem value="mobile">{t('Mobile Card Reader')}</SelectItem>
                      <SelectItem value="none">{t('None')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Auto-Open Cash Drawer')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Automatically open cash drawer after sale')}</p>
                  </div>
                  <Switch 
                    checked={formData.auto_open_cash_drawer}
                    onCheckedChange={() => handleSwitchChange('auto_open_cash_drawer')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('Auto-Print Receipt')}</Label>
                    <p className="text-sm text-muted-foreground">{t('Automatically print receipt after sale')}</p>
                  </div>
                  <Switch 
                    checked={formData.auto_print_receipt}
                    onCheckedChange={() => handleSwitchChange('auto_print_receipt')}
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