import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

export default function CreateOrder() {
  const { t } = useTranslation();
  const [orderItems, setOrderItems] = useState([{ product: '', quantity: 1, price: 0 }]);

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('orders.index'))
    },
    {
      label: t('Create Order'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => console.log('Save clicked')
    }
  ];

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product: '', quantity: 1, price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  return (
    <PageTemplate 
      title={t('Create Order')}
      url="/orders/create"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Order Management'), href: route('orders.index') },
        { title: t('Create Order') }
      ]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer">{t('Customer')}</TabsTrigger>
            <TabsTrigger value="items">{t('Items')}</TabsTrigger>
            <TabsTrigger value="shipping">{t('Shipping')}</TabsTrigger>
            <TabsTrigger value="payment">{t('Payment')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Customer Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer">{t('Select Customer')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Choose existing customer or create new')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe - john.doe@example.com</SelectItem>
                      <SelectItem value="jane">Jane Smith - jane.smith@example.com</SelectItem>
                      <SelectItem value="new">{t('+ Create New Customer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">{t('Customer Name')}</Label>
                    <Input id="customer_name" placeholder={t('Enter customer name')} />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">{t('Email Address')}</Label>
                    <Input id="customer_email" type="email" placeholder={t('customer@example.com')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_phone">{t('Phone Number')}</Label>
                    <Input id="customer_phone" placeholder={t('+1 (555) 123-4567')} />
                  </div>
                  <div>
                    <Label htmlFor="order_notes">{t('Order Notes')}</Label>
                    <Textarea id="order_notes" placeholder={t('Special instructions...')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('Order Items')}</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Add Item')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{t('Item {{number}}', { number: index + 1 })}</h4>
                      {orderItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>{t('Product')}</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t('Select product')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iphone">iPhone 15 Pro - $999.99</SelectItem>
                            <SelectItem value="airpods">AirPods Pro - $249.99</SelectItem>
                            <SelectItem value="macbook">MacBook Air - $1299.99</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t('Quantity')}</Label>
                        <Input type="number" min="1" defaultValue="1" />
                      </div>
                      <div>
                        <Label>{t('Price')}</Label>
                        <Input type="number" step="0.01" placeholder={t('0.00')} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Shipping Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shipping_method">{t('Shipping Method')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select shipping method')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t('Standard Shipping - $9.99')}</SelectItem>
                      <SelectItem value="express">{t('Express Shipping - $19.99')}</SelectItem>
                      <SelectItem value="free">{t('Free Shipping - $0.00')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shipping_address">{t('Shipping Address')}</Label>
                  <Textarea id="shipping_address" placeholder={t('Enter full shipping address')} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_city">{t('City')}</Label>
                    <Input id="shipping_city" placeholder={t('City')} />
                  </div>
                  <div>
                    <Label htmlFor="shipping_postal">{t('Postal Code')}</Label>
                    <Input id="shipping_postal" placeholder={t('Postal code')} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tracking_number">{t('Tracking Number (Optional)')}</Label>
                  <Input id="tracking_number" placeholder={t('Enter tracking number')} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Payment Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment_method">{t('Payment Method')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select payment method')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">{t('Credit Card')}</SelectItem>
                        <SelectItem value="paypal">{t('PayPal')}</SelectItem>
                        <SelectItem value="bank_transfer">{t('Bank Transfer')}</SelectItem>
                        <SelectItem value="cash">{t('Cash on Delivery')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="payment_status">{t('Payment Status')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select payment status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t('Pending')}</SelectItem>
                        <SelectItem value="paid">{t('Paid')}</SelectItem>
                        <SelectItem value="failed">{t('Failed')}</SelectItem>
                        <SelectItem value="refunded">{t('Refunded')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="subtotal">{t('Subtotal')}</Label>
                    <Input id="subtotal" type="number" step="0.01" placeholder={t('0.00')} />
                  </div>
                  <div>
                    <Label htmlFor="tax">{t('Tax Amount')}</Label>
                    <Input id="tax" type="number" step="0.01" placeholder={t('0.00')} />
                  </div>
                  <div>
                    <Label htmlFor="total">{t('Total Amount')}</Label>
                    <Input id="total" type="number" step="0.01" placeholder={t('0.00')} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="order_status">{t('Order Status')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select order status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('Pending')}</SelectItem>
                      <SelectItem value="processing">{t('Processing')}</SelectItem>
                      <SelectItem value="shipped">{t('Shipped')}</SelectItem>
                      <SelectItem value="delivered">{t('Delivered')}</SelectItem>
                      <SelectItem value="cancelled">{t('Cancelled')}</SelectItem>
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