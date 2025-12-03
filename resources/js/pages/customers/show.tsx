import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/helpers';
import { usePermissions } from '@/hooks/usePermissions';

export default function ShowCustomer() {
  const { t } = useTranslation();
  const { customer, billingAddress, shippingAddress, recentOrders } = usePage().props as any;

  const { hasPermission } = usePermissions();

  const formatDate = (dateString) => {
    if (!dateString) return t('Not specified');
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
      label: t('Edit Customer'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('customers.edit', customer.id))
    });
  }

  return (
    <PageTemplate 
      title={t('Customer Details')}
      url="/customers/show"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Customer Management'), href: route('customers.index') },
        { title: t('Customer Details') }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('Customer Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={customer.avatar ? getImageUrl(customer.avatar) : ''} alt={customer.full_name} />
                  <AvatarFallback>{customer.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold">{customer.full_name}</h2>
                    <Badge variant={customer.is_active ? 'default' : 'secondary'}>
                      {customer.is_active ? t('Active') : t('Inactive')}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{t('Joined {{date}}', { date: formatDate(customer.created_at) })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Customer Stats')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingBag className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{customer.total_orders}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Total Orders')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(customer.total_spent || 0)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Total Spent')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold">
                    {formatCurrency(customer.avg_order_value || 0)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Avg. Order Value')}</p>
              </div>
              {customer.last_order_date && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-lg font-bold">
                      {formatDate(customer.last_order_date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('Last Order')}</p>
                </div>
              )}
              {customer.pending_orders > 0 && (
                <div className="text-center p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-yellow-600">
                      {customer.pending_orders}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('Pending Orders')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Billing Address')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {billingAddress ? (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p>{billingAddress.address}</p>
                    <p>{billingAddress.city}, {billingAddress.state} {billingAddress.postal_code}</p>
                    <p>{billingAddress.country === 'us' ? t('United States') : 
                        billingAddress.country === 'ca' ? t('Canada') : 
                        billingAddress.country === 'uk' ? t('United Kingdom') : 
                        billingAddress.country === 'au' ? t('Australia') : billingAddress.country}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t('No billing address provided')}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Shipping Address')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shippingAddress ? (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</p>
                    <p>{shippingAddress.country === 'us' ? t('United States') : 
                        shippingAddress.country === 'ca' ? t('Canada') : 
                        shippingAddress.country === 'uk' ? t('United Kingdom') : 
                        shippingAddress.country === 'au' ? t('Australia') : shippingAddress.country}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t('No shipping address provided')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Personal Details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Date of Birth')}</span>
                <span>{formatDate(customer.date_of_birth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Gender')}</span>
                <span>
                  {customer.gender === 'male' ? t('Male') : 
                   customer.gender === 'female' ? t('Female') : 
                   customer.gender === 'other' ? t('Other') : 
                   customer.gender === 'prefer_not_to_say' ? t('Prefer not to say') : t('Not specified')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Customer Group')}</span>
                <Badge variant="outline">
                  {customer.customer_group === 'regular' ? t('Regular Customer') : 
                   customer.customer_group === 'vip' ? t('VIP Customer') : 
                   customer.customer_group === 'wholesale' ? t('Wholesale Customer') : customer.customer_group}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Preferred Language')}</span>
                <span>
                  {customer.preferred_language === 'en' ? t('English') : 
                   customer.preferred_language === 'es' ? t('Spanish') : 
                   customer.preferred_language === 'fr' ? t('French') : 
                   customer.preferred_language === 'de' ? t('German') : customer.preferred_language}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Communication Preferences')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Email Marketing')}</span>
                <Badge variant={customer.email_marketing ? 'default' : 'secondary'}>
                  {customer.email_marketing ? t('Enabled') : t('Disabled')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('SMS Notifications')}</span>
                <Badge variant={customer.sms_notifications ? 'default' : 'secondary'}>
                  {customer.sms_notifications ? t('Enabled') : t('Disabled')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Order Updates')}</span>
                <Badge variant={customer.order_updates ? 'default' : 'secondary'}>
                  {customer.order_updates ? t('Enabled') : t('Disabled')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {recentOrders && recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Recent Orders')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total)}</p>
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

        {customer.notes && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Notes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{customer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
}