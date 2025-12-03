import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Package, User, CreditCard, Truck, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { usePermissions } from '@/hooks/usePermissions';
import { getImageUrl } from '@/utils/image-helper';

interface OrderShowProps {
  order: {
    id: number;
    orderNumber: string;
    date: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    items: Array<{
      id: number;
      name: string;
      sku: string;
      quantity: number;
      price: number;
      image: string;
    }>;
    summary: {
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
    };
    shippingMethod: string;
    trackingNumber?: string;
  };
}

export default function ShowOrder({ order }: OrderShowProps) {
  const { t } = useTranslation();

  const { hasPermission } = usePermissions();

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
      label: t('Edit Order'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('orders.edit', order.id))
    });
  }

  return (
    <PageTemplate 
      title={t('Order Details')}
      url="/orders/show"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Order Management'), href: route('orders.index') },
        { title: t('Order Details') }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('Order {{number}}', { number: order.orderNumber })}</CardTitle>
                <Badge variant={order.status.toLowerCase() === 'completed' ? 'default' : 'secondary'}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Order Date')}</p>
                  <p>{order.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Payment Method')}</p>
                  <p>{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Payment Status')}</p>
                  <Badge variant={order.paymentStatus.toLowerCase() === 'paid' ? 'default' : 'secondary'}>{order.paymentStatus}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Fulfillment Status')}</p>
                  <Badge variant={order.status.toLowerCase() === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Order Summary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">{t('Subtotal')}</span>
                <span>{formatCurrency(order.summary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('Shipping')}</span>
                <span>{formatCurrency(order.summary.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('Tax')}</span>
                <span>{formatCurrency(order.summary.tax)}</span>
              </div>
              {order.summary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">{t('Discount')}</span>
                  <span>-{formatCurrency(order.summary.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>{t('Total')}</span>
                <span>{formatCurrency(order.summary.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>{t('Customer Information')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                {order.customer.phone && (
                  <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <CardTitle>{t('Shipping Address')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <CardTitle>{t('Order Items')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border">
                    <img
                      src={getImageUrl(item.image)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{t('SKU: {{sku}}', { sku: item.sku })}</p>
                    <p className="text-sm text-muted-foreground">{t('Quantity: {{quantity}}', { quantity: item.quantity })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('{{total}} total', { total: formatCurrency(item.price * item.quantity) })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <CardTitle>{t('Shipping Information')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Shipping Method')}</span>
              <span>{order.shippingMethod}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Tracking Number')}</span>
                <span className="font-mono">{order.trackingNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Shipping Status')}</span>
              <Badge variant={order.status.toLowerCase() === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Order Timeline')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.timeline?.map((timeline, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${timeline.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <p className="font-medium">{t(timeline.status)}</p>
                    <p className="text-sm text-muted-foreground">
                      {timeline.date || t('Pending')}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground">{t('No timeline data available')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}