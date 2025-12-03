import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Copy, Users, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { usePermissions } from '@/hooks/usePermissions';

export default function ShowCoupon() {
  const { t } = useTranslation();
  const { coupon, stats, recentOrders } = usePage().props as any;

  const { hasPermission } = usePermissions();

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('coupon-system.index'))
    },
    {
      label: t('Copy Code'),
      icon: <Copy className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => navigator.clipboard.writeText(coupon.code)
    }
  ];
  
  if (hasPermission('edit-coupon-system')) {
    pageActions.push({
      label: t('Edit Coupon'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('coupon-system.edit', coupon.id))
    });
  }

  return (
    <PageTemplate 
      title={t('Coupon Details')}
      url="/coupon-system/show"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Coupon System'), href: route('coupon-system.index') },
        { title: t('Coupon Details') }
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('Coupon Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold">{coupon.name}</h2>
                  <Badge variant={coupon.status ? "default" : "secondary"}>
                    {coupon.status ? t('Active') : t('Inactive')}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <code className="text-lg bg-muted px-3 py-2 rounded font-mono">{coupon.code}</code>
                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {coupon.description && (
                  <p className="text-muted-foreground mb-4">{coupon.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Discount Type')}</p>
                    <p className="font-semibold">
                      {coupon.type === 'percentage' ? t('Percentage Discount') : t('Fixed Amount')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('Discount Value')}</p>
                    <p className="font-semibold text-green-600">
                      {coupon.type === 'percentage' 
                        ? `${coupon.discount_amount}%` 
                        : formatCurrency(coupon.discount_amount)}
                    </p>
                  </div>
                  {coupon.start_date && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('Start Date')}</p>
                      <p>{new Date(coupon.start_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {coupon.expiry_date && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('End Date')}</p>
                      <p>{new Date(coupon.expiry_date).toLocaleDateString()}</p>
                    </div>
                  )}
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
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{stats?.total_usage || coupon.used_count || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Times Used')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{formatCurrency(stats?.total_savings || 0)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Total Savings')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold">{stats?.unique_users || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Unique Users')}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold">{formatCurrency(stats?.avg_savings_per_use || 0)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t('Avg. Savings per Use')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('Usage Restrictions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Minimum Spend')}</span>
                <span>{coupon.minimum_spend ? formatCurrency(coupon.minimum_spend) : t('No minimum')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Maximum Spend')}</span>
                <span>{coupon.maximum_spend ? formatCurrency(coupon.maximum_spend) : t('No maximum')}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Usage Limits')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Usage Limit per Coupon')}</span>
                <span>{coupon.use_limit_per_coupon || t('Unlimited')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Usage Limit per User')}</span>
                <span>{coupon.use_limit_per_user || t('Unlimited')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Used Count')}</span>
                <span className="font-semibold">
                  {coupon.used_count || 0} 
                  {coupon.use_limit_per_coupon ? ` / ${coupon.use_limit_per_coupon}` : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {recentOrders && recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Recent Orders Using This Coupon')}</CardTitle>
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
                      <p className="font-medium">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('Additional Information')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Created Date')}</span>
              <span>{new Date(coupon.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t('Last Updated')}</span>
              <span>{new Date(coupon.updated_at).toLocaleDateString()}</span>
            </div>
            {stats?.recent_usage > 0 && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('Usage (Last 30 Days)')}</span>
                <span className="font-semibold">{stats.recent_usage}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}
