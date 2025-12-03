import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Settings, Building2, Globe, Users, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { formatCompanyCurrency } from '@/utils/helpers';

export default function StoreView({ store, stats }) {
  const { t } = useTranslation();

  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('stores.index'))
    },
    {
      label: t('Edit'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('stores.edit', store.id))
    },
    {
      label: t('Settings'),
      icon: <Settings className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('stores.settings', store.id))
    }
  ];

  return (
    <PageTemplate 
      title={store.name}
      url={`/stores/${store.id}`}
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Store Management', href: route('stores.index') },
        { title: store.name }
      ]}
    >
      <div className="space-y-6">
        {/* Store Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Store Overview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold">{store.name}</h2>
                    <Badge variant={store.is_active ? 'default' : 'secondary'}>
                      {store.is_active ? t('Active') : t('Inactive')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {store.enable_custom_domain && store.custom_domain ? (
                      <span className="text-green-600">{store.custom_domain} (Custom Domain)</span>
                    ) : store.enable_custom_subdomain && store.custom_subdomain ? (
                      <span className="text-blue-600">{store.custom_subdomain} (Custom Subdomain)</span>
                    ) : (
                      t('No domain set')
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-sm">
                  <span className="font-medium">{t('Theme')}:</span> {store.theme}
                </p>
                <p className="text-sm">
                  <span className="font-medium">{t('Created')}:</span> {new Date(store.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Products')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_products || 0}</div>
              <p className="text-xs text-muted-foreground">{t('Active products')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Orders')}</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
              <p className="text-xs text-muted-foreground">{t('All time orders')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Customers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_customers || 0}</div>
              <p className="text-xs text-muted-foreground">{t('Registered customers')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Revenue')}</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_revenue ? formatCompanyCurrency(parseFloat(stats.total_revenue)) : '¥ 0'}</div>
              <p className="text-xs text-muted-foreground">{t('Total revenue')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Store Description */}
        {store.description && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{store.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
}