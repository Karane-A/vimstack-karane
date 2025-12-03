import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, MapPin, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { usePermissions } from '@/hooks/usePermissions';

export default function ShowShipping() {
  const { t } = useTranslation();
  const { shipping, stats, recentOrders } = usePage().props as any;

  const { hasPermission } = usePermissions();

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
      label: t('Edit Shipping'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('shipping.edit', shipping.id))
    });
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTypeLabel = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <PageTemplate 
      title={t('Shipping Method Details')}
      url="/shipping/show"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Shipping Management'), href: route('shipping.index') },
        { title: t('Shipping Method Details') }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('Shipping Method Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold">{shipping.name}</h2>
                  <Badge variant={shipping.is_active ? 'default' : 'secondary'}>
                    {shipping.is_active ? t('Active') : t('Inactive')}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  {shipping.description || t('No description provided.')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Shipping Type')}</p>
                    <p className="font-semibold">{getTypeLabel(shipping.type)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Shipping Cost')}</p>
                    <p className="font-semibold text-green-600">
                      {shipping.type === 'free_shipping' ? t('Free') : formatCurrency(shipping.cost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Delivery Time')}</p>
                    <p>{shipping.delivery_time || t('Not specified')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Minimum Order')}</p>
                    <p>{formatCurrency(shipping.min_order_amount || 0)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Usage Statistics')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Package className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{stats?.total_orders || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Total Orders')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(stats?.total_revenue || 0)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Total Revenue')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold">{Math.round(stats?.delivery_rate || 0)}%</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Delivery Rate')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{stats?.avg_delivery_days || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Avg. Delivery Days')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Shipping Zones')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Zone Type')}</span>
                <span>{shipping.zone_type ? getTypeLabel(shipping.zone_type) : t('Not specified')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Countries')}</span>
                <span>{shipping.countries || t('Not specified')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Postal Codes')}</span>
                <span>{shipping.postal_codes || t('All')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Max Distance')}</span>
                <span>{shipping.max_distance ? `${shipping.max_distance} km` : t('Unlimited')}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Advanced Settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Maximum Weight')}</span>
                <span>{shipping.max_weight ? `${shipping.max_weight} kg` : t('Unlimited')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Maximum Dimensions')}</span>
                <span>{shipping.max_dimensions || t('Unlimited')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Require Signature')}</span>
                <Badge variant={shipping.require_signature ? 'default' : 'secondary'}>
                  {shipping.require_signature ? t('Yes') : t('No')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Insurance Required')}</span>
                <Badge variant={shipping.insurance_required ? 'default' : 'secondary'}>
                  {shipping.insurance_required ? t('Yes') : t('No')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Tracking Available')}</span>
                <Badge variant={shipping.tracking_available ? 'default' : 'secondary'}>
                  {shipping.tracking_available ? t('Yes') : t('No')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Handling Fee')}</span>
                <span>{formatCurrency(shipping.handling_fee || 0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('Additional Information')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Created Date')}</span>
              <span>{formatDate(shipping.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Last Modified')}</span>
              <span>{formatDate(shipping.updated_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Sort Order')}</span>
              <span>{shipping.sort_order}</span>
            </div>
          </CardContent>
        </Card>

        {recentOrders && recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Recent Orders Using This Shipping Method')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.shipping_cost || 0)}</p>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('Performance Metrics')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Page Views')}</span>
              <span className="font-semibold">{stats?.views || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Orders (Last 30 Days)')}</span>
              <span className="font-semibold">{stats?.recent_orders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Average Shipping Cost')}</span>
              <span className="font-semibold">{formatCurrency(stats?.avg_shipping_cost || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Delivered Orders')}</span>
              <span className="font-semibold">{stats?.delivered_orders || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}