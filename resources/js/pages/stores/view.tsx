import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, Edit, Settings, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';

export default function ViewStore({ store, stats }) {
  const { t } = useTranslation();


  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('stores.index'))
    },
    {
      label: t('Visit Store'),
      icon: <Globe className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(store.visit_store_url || route('store.home', store.slug), '_blank')
    },
    {
      label: t('Edit Store'),
      icon: <Edit className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('stores.edit', store.id))
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
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Store Name</p>
                <p className="text-lg font-semibold">{store.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={store.is_active ? "default" : "secondary"}>
                  {store.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Domain</p>
                {store.enable_custom_domain && store.custom_domain ? (
                  <p className="text-green-600 font-medium">{store.custom_domain} (Custom Domain)</p>
                ) : store.enable_custom_subdomain && store.custom_subdomain ? (
                  <p className="text-blue-600 font-medium">{store.custom_subdomain} (Custom Subdomain)</p>
                ) : (
                  <p className="text-muted-foreground">No domain set</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{store.email || 'No email set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Theme</p>
                <p>{store.theme}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p>{new Date(store.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Orders</span>
                <span className="font-semibold">{stats?.total_orders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                <span className="font-semibold">{formatCurrency(parseFloat(stats?.total_revenue) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Products</span>
                <span className="font-semibold">{stats?.total_products || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Customers</span>
                <span className="font-semibold">{stats?.total_customers || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
}