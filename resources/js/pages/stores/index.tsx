import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, Building2, Globe, Users, BarChart, Settings, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

interface PageAction {
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
}

export default function StoreManagement({ stores = [], aggregatedStats = {} }) {
  const { t } = useTranslation();
  const [storeToDelete, setStoreToDelete] = useState<number | null>(null);

  const { hasPermission } = usePermissions();
  
  const handleDelete = () => {
    if (storeToDelete) {
      router.delete(route('stores.destroy', storeToDelete));
      setStoreToDelete(null);
    }
  };

  const pageActions: PageAction[] = [];
  
  if (hasPermission('export-stores')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline',
      onClick: () => window.open(route('stores.export'), '_blank')
    });
  }
  
  if (hasPermission('create-stores')) {
    pageActions.push({
      label: t('Create Store'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default',
      onClick: () => router.visit(route('stores.create'))
    });
  }

  return (
    <PageTemplate 
      title={t('Store Management')}
      url="/stores"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Store Management' }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Stores')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stores.length}</div>
              <p className="text-xs text-muted-foreground">{t('Your store count')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Stores')}</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stores.filter(store => store.is_active).length}</div>
              <p className="text-xs text-muted-foreground">
                {stores.length > 0 ? 
                  t('{{percent}}% active rate', { percent: Math.round((stores.filter(store => store.is_active).length / stores.length) * 100) }) : 
                  t('No stores yet')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Customers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aggregatedStats.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground">{t('Across all stores')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Revenue')}</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(parseFloat(aggregatedStats.totalRevenue) || 0)}</div>
              <p className="text-xs text-muted-foreground">{t('Total revenue')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Stores List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Your Stores')}</CardTitle>
          </CardHeader>
          <CardContent>
            {stores.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('No stores yet')}</h3>
                <p className="text-muted-foreground mb-4">{t('Create your first store to get started')}</p>
                <Permission permission="create-stores">
                  <Button onClick={() => router.visit(route('stores.create'))}>
                    <Plus className="h-4 w-4 mr-2" /> {t('Create Store')}
                  </Button>
                </Permission>
              </div>
            ) : (
              <div className="space-y-4">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{store.name}</h3>
                        <Badge variant={store.is_active ? 'default' : 'secondary'}>
                          {store.is_active ? t('Active') : t('Inactive')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {store.enable_custom_domain && store.custom_domain ? (
                          <span className="text-green-600">{store.custom_domain} (Custom Domain)</span>
                        ) : store.enable_custom_subdomain && store.custom_subdomain ? (
                          <span className="text-blue-600">{store.custom_subdomain} (Custom Subdomain)</span>
                        ) : (
                          t('No domain set')
                        )}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground">{t('Theme: {{theme}}', { theme: store.theme })}</span>
                        <span className="text-xs text-muted-foreground">{t('Created: {{date}}', { date: new Date(store.created_at).toLocaleDateString() })}</span>
                        <span className="text-xs text-muted-foreground">{t('{{orders}} orders', { orders: store.total_orders || 0 })}</span>
                        <span className="text-xs text-muted-foreground">{t('{{revenue}} revenue', { revenue: formatCurrency(parseFloat(store.total_revenue) || 0) })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      const url = store.visit_store_url || route('store.home', store.slug);
                      if (url) window.open(url, '_blank');
                    }} title={t('Visit Store')}>
                      <Globe className="h-4 w-4" />
                    </Button>
                    <Permission permission="view-stores">
                      <Button variant="ghost" size="sm" onClick={() => router.visit(route('stores.show', store.id))}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Permission>
                    <Permission permission="edit-stores">
                      <Button variant="ghost" size="sm" onClick={() => router.visit(route('stores.edit', store.id))}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Permission>
                    <Permission permission="manage-store-settings">
                      <Button variant="ghost" size="sm" onClick={() => router.visit(route('stores.settings', store.id))}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </Permission>
                    <Permission permission="delete-stores">
                      <Button variant="ghost" size="sm" onClick={() => setStoreToDelete(store.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Permission>
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!storeToDelete} onOpenChange={(open) => !open && setStoreToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Store')}</DialogTitle>
            <DialogDescription>
              {t('Are you sure you want to delete this store? This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStoreToDelete(null)}>
              {t('Cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}