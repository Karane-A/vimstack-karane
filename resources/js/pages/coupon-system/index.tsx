import React, { useEffect, useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, Percent, Eye, Edit, Trash2, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from '@/components/custom-toast';

export default function CouponSystem() {
  const { t } = useTranslation();
  const { coupons = { data: [] }, stats = { total: 0, active: 0, percentage: 0, flat: 0 }, flash } = usePage().props as any;
  const [couponToDelete, setCouponToDelete] = useState<number | null>(null);

  const { hasPermission } = usePermissions();
  

  
  const handleDelete = () => {
    if (couponToDelete) {
      router.delete(route('store-coupons.destroy', couponToDelete));
      setCouponToDelete(null);
    }
  };

  const pageActions = [];
  
  if (hasPermission('export-coupon-system')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('coupon-system.export'), '_blank')
    });
  }
  
  if (hasPermission('create-coupon-system')) {
    pageActions.push({
      label: t('Create Coupon'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('coupon-system.create'))
    });
  }

  return (
    <PageTemplate 
      title={t('Coupon System')}
      url="/coupon-system"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Coupon System') }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Coupons')}</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total || 0}</div>
              <p className="text-xs text-muted-foreground">{t('All coupons')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Coupons')}</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% {t('active rate')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Percentage Coupons')}</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.percentage || 0}</div>
              <p className="text-xs text-muted-foreground">{t('Discount percentage')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Fixed Amount Coupons')}</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.flat || 0}</div>
              <p className="text-xs text-muted-foreground">{t('Fixed discount')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Coupons List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Store Coupons')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!coupons || !coupons.data || coupons.data.length === 0 ? (
                <div className="text-center py-8">
                  <Percent className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">{t('No coupons found')}</p>
                  <Permission permission="create-coupon-system">
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => router.visit(route('coupon-system.create'))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Create your first coupon')}
                    </Button>
                  </Permission>
                </div>
              ) : (
                coupons.data.map((coupon: any) => (
                  <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Percent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{coupon.name}</h3>
                          <Badge variant={coupon.status ? 'default' : 'secondary'}>
                            {coupon.status ? t('Active') : t('Inactive')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{coupon.code}</code>
                          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {coupon.type === 'percentage' ? t('Percentage') : t('Fixed')}: 
                            {coupon.type === 'percentage' ? `${coupon.discount_amount}%` : formatCurrency(coupon.discount_amount)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t('Used')}: {coupon.used_count}/{coupon.use_limit_per_coupon || t('Unlimited')}
                          </span>
                          {coupon.expiry_date && (
                            <span className="text-xs text-muted-foreground">
                              {t('Expires')}: {new Date(coupon.expiry_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Permission permission="view-coupon-system">
                        <Button variant="ghost" size="sm" onClick={() => router.visit(route('store-coupons.show', coupon.id))}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Permission>
                      <Permission permission="edit-coupon-system">
                        <Button variant="ghost" size="sm" onClick={() => router.visit(route('coupon-system.edit', coupon.id))}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Permission>
                      <Permission permission="toggle-status-coupon-system">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            router.post(route('store-coupons.toggle-status', coupon.id), {}, {
                              preserveScroll: true
                            });
                          }}
                        >
                          {coupon.status ? t('Disable') : t('Enable')}
                        </Button>
                      </Permission>
                      <Permission permission="delete-coupon-system">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCouponToDelete(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Permission>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!couponToDelete} onOpenChange={(open) => !open && setCouponToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Coupon')}</DialogTitle>
            <DialogDescription>
              {t('Are you sure you want to delete this coupon? This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCouponToDelete(null)}>
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
