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
import { usePermissions } from '@/hooks/usePermissions';

interface EditOrderProps {
  order: {
    id: number;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    customer: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
    shippingAddress: {
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    items: Array<{
      id: number;
      productId: number;
      name: string;
      quantity: number;
      price: number;
    }>;
    summary: {
      subtotal: number;
      shipping: number;
      tax: number;
      total: number;
    };
    shippingMethodId: number;
    trackingNumber?: string;
    notes?: string;
  };
  customers: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    price: number;
    variants: Array<{
      name: string;
      values: string[];
    }>;
  }>;
  shippingMethods: Array<{
    id: number;
    name: string;
    cost: number;
  }>;
}

export default function EditOrder({ order, customers, products, shippingMethods }: EditOrderProps) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [orderItems, setOrderItems] = useState(order.items.map(item => ({
    ...item,
    variants: item.variants || {}
  })));
  const [formData, setFormData] = useState({
    status: order.status,
    payment_status: order.paymentStatus,
    tracking_number: order.trackingNumber || '',
    notes: order.notes || '',
    items: orderItems,
  });

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('orders.index'))
    }
  ];
  
  if (hasPermission('edit-orders')) {
    pageActions.push({
      label: t('Update Order'),
      icon: <Save className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => {
        router.put(route('orders.update', order.id), formData);
      }
    });
  }

  const addOrderItem = () => {
    setOrderItems([...orderItems, { id: Date.now(), productId: 0, name: '', quantity: 1, price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  return (
    <PageTemplate 
      title={t('Edit Order') + ' ' + order.orderNumber}
      url="/orders/edit"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Order Management'), href: route('orders.index') },
        { title: t('Edit Order') }
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
                  <Select defaultValue={order.customer.id ? order.customer.id.toString() : ''}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select Customer')} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name} - {customer.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">{t('Customer Name')}</Label>
                    <Input id="customer_name" defaultValue={order.customer.name} />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">{t('Email Address')}</Label>
                    <Input id="customer_email" type="email" defaultValue={order.customer.email} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_phone">{t('Phone Number')}</Label>
                    <Input id="customer_phone" defaultValue={order.customer.phone} />
                  </div>
                  <div>
                    <Label htmlFor="order_notes">{t('Order Notes')}</Label>
                    <Textarea 
                      id="order_notes" 
                      defaultValue={order.notes || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
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
                        <Select 
                          defaultValue={item.productId ? item.productId.toString() : ''}
                          onValueChange={(value) => {
                            const newItems = [...orderItems];
                            newItems[index].productId = parseInt(value);
                            newItems[index].variants = {}; // Reset variants when product changes
                            setOrderItems(newItems);
                            setFormData(prev => ({ ...prev, items: newItems }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name} - ${product.price.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {/* Show variant selection if product has variants */}
                        {item.productId > 0 && products.find(p => p.id === item.productId)?.variants?.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {products.find(p => p.id === item.productId)?.variants.map((variant, vIndex) => (
                              <div key={vIndex}>
                                <Label className="text-xs">{variant.name}</Label>
                                <Select onValueChange={(value) => {
                                  const newItems = [...orderItems];
                                  if (!newItems[index].variants) newItems[index].variants = {};
                                  newItems[index].variants[variant.name] = value;
                                  setOrderItems(newItems);
                                  setFormData(prev => ({ ...prev, items: newItems }));
                                }}>
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder={t('Select {{name}}', { name: variant.name })} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {variant.values.map((value, valueIndex) => (
                                      <SelectItem key={valueIndex} value={value}>
                                        {value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>{t('Quantity')}</Label>
                        <Input type="number" min="1" defaultValue={item.quantity} />
                      </div>
                      <div>
                        <Label>{t('Price')}</Label>
                        <Input type="number" step="0.01" defaultValue={item.price} />
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
                  <Select defaultValue={order.shippingMethodId.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id.toString()}>
                          {method.name} - ${method.cost.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shipping_address">{t('Shipping Address')}</Label>
                  <Textarea 
                    id="shipping_address" 
                    defaultValue={order.shippingAddress.address} 
                    rows={3} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_city">{t('City')}</Label>
                    <Input id="shipping_city" defaultValue={order.shippingAddress.city} />
                  </div>
                  <div>
                    <Label htmlFor="shipping_postal">{t('Postal Code')}</Label>
                    <Input id="shipping_postal" defaultValue={order.shippingAddress.postalCode} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tracking_number">{t('Tracking Number')}</Label>
                  <Input 
                    id="tracking_number" 
                    defaultValue={order.trackingNumber || ''} 
                    onChange={(e) => setFormData(prev => ({ ...prev, tracking_number: e.target.value }))}
                  />
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
                    <Select defaultValue={order.paymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Select defaultValue={order.paymentStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Input id="subtotal" type="number" step="0.01" defaultValue={order.summary.subtotal.toFixed(2)} />
                  </div>
                  <div>
                    <Label htmlFor="tax">{t('Tax Amount')}</Label>
                    <Input id="tax" type="number" step="0.01" defaultValue={order.summary.tax.toFixed(2)} />
                  </div>
                  <div>
                    <Label htmlFor="total">{t('Total Amount')}</Label>
                    <Input id="total" type="number" step="0.01" defaultValue={order.summary.total.toFixed(2)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="order_status">{t('Order Status')}</Label>
                  <Select defaultValue={order.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('Pending')}</SelectItem>
                      <SelectItem value="processing">{t('Processing')}</SelectItem>
                      <SelectItem value="shipped">{t('Shipped')}</SelectItem>
                      <SelectItem value="delivered">{t('Delivered')}</SelectItem>
                      <SelectItem value="cancelled">{t('Cancelled')}</SelectItem>
                      <SelectItem value="completed">{t('Completed')}</SelectItem>
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