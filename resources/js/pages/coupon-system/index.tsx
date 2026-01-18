import React, { useEffect, useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, Percent, Eye, Edit, Trash2, Copy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from '@/components/custom-toast';

import { ResponsiveWrapper } from '@/components/mobile/responsive-wrapper';
import { 
  PullToRefresh, 
  List as MobileList, 
  SwipeAction, 
  Tag as MobileTag,
  Dialog as MobileDialog,
  Toast,
  ProgressBar,
  Space as MobileSpace
} from 'antd-mobile';

export default function CouponSystem() {
  const { t } = useTranslation();
  const { coupons = { data: [] }, stats = { total: 0, active: 0, percentage: 0, flat: 0 }, flash } = usePage().props as any;
  const [couponToDelete, setCouponToDelete] = useState<number | null>(null);

  const { hasPermission } = usePermissions();
  
  const handleDelete = () => {
    if (couponToDelete) {
      router.delete(route('store-coupons.destroy', couponToDelete), {
        onSuccess: () => {
          setCouponToDelete(null);
          Toast.show({
            icon: 'success',
            content: t('Coupon deleted successfully'),
          });
        }
      });
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

  const renderMobileCoupons = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <PullToRefresh onRefresh={async () => {
        await router.reload({ only: ['coupons', 'stats'] });
      }}>
        <MobileList header={t('Store Coupons')}>
          {!coupons || !coupons.data || coupons.data.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Percent className="h-12 w-12 mx-auto mb-2 opacity-20" />
              {t('No coupons found')}
            </div>
          ) : (
            coupons.data.map((coupon: any) => {
              const hasLimit = coupon.use_limit_per_coupon && coupon.use_limit_per_coupon > 0;
              const usedCount = coupon.used_count || 0;
              const usagePercentage = hasLimit ? (usedCount / coupon.use_limit_per_coupon) * 100 : 0;
              
              return (
                <SwipeAction
                  key={coupon.id}
                  rightActions={[
                    {
                      key: 'edit',
                      text: t('Edit'),
                      color: 'primary',
                      onClick: () => router.visit(route('coupon-system.edit', coupon.id))
                    },
                    {
                      key: 'delete',
                      text: t('Delete'),
                      color: 'danger',
                      onClick: () => {
                        MobileDialog.confirm({
                          content: t('Are you sure you want to delete this coupon?'),
                          onConfirm: () => {
                            setCouponToDelete(coupon.id);
                            handleDelete();
                          }
                        });
                      }
                    }
                  ]}
                >
                  <MobileList.Item
                    onClick={() => router.visit(route('store-coupons.show', coupon.id))}
                    description={
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{coupon.code}</code>
                          <MobileTag color={coupon.status ? 'success' : 'default'} fill="outline">
                            {coupon.status ? t('Active') : t('Inactive')}
                          </MobileTag>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-primary">
                            {coupon.type === 'percentage' ? `${coupon.discount_amount}%` : formatCurrency(coupon.discount_amount)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {t('Used')}: {usedCount}{hasLimit ? ` / ${coupon.use_limit_per_coupon}` : ''}
                          </span>
                        </div>
                        {hasLimit && (
                          <ProgressBar 
                            percent={usagePercentage} 
                            style={{ '--track-width': '4px' }}
                          />
                        )}
                      </div>
                    }
                  >
                    <span className="font-semibold text-gray-900">{coupon.name}</span>
                  </MobileList.Item>
                </SwipeAction>
              );
            })
          )}
        </MobileList>
      </PullToRefresh>
    </div>
  );

  const renderDesktopCoupons = () => (
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
                coupons.data.map((coupon: any) => {
                  const hasLimit = coupon.use_limit_per_coupon && coupon.use_limit_per_coupon > 0;
                  const usedCount = coupon.used_count || 0;
                  const remaining = hasLimit ? coupon.use_limit_per_coupon - usedCount : null;
                  const usagePercentage = hasLimit ? (usedCount / coupon.use_limit_per_coupon) * 100 : 0;
                  const isExpired = coupon.expiry_date && new Date(coupon.expiry_date) < new Date();
                  const isNearLimit = hasLimit && remaining !== null && remaining <= 5 && remaining > 0;
                  const isAtLimit = hasLimit && remaining === 0;
                  
                  return (
                    <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Percent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{coupon.name}</h3>
                            <Badge variant={coupon.status ? 'default' : 'secondary'}>
                              {coupon.status ? t('Active') : t('Inactive')}
                            </Badge>
                            {isExpired && (
                              <Badge variant="destructive">{t('Expired')}</Badge>
                            )}
                            {isAtLimit && (
                              <Badge variant="destructive">{t('Limit Reached')}</Badge>
                            )}
                            {isNearLimit && (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">{t('Low Stock')}</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">{coupon.code}</code>
                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                            <span className="flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {coupon.type === 'percentage' ? t('Percentage') : t('Fixed')}: 
                              <span className="font-semibold ml-1">
                                {coupon.type === 'percentage' ? `${coupon.discount_amount}%` : formatCurrency(coupon.discount_amount)}
                              </span>
                            </span>
                            {coupon.expiry_date && (
                              <span>
                                {t('Expires')}: {new Date(coupon.expiry_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          {/* Usage Progress */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {t('Used')}: <span className="font-semibold text-foreground">{usedCount}</span>
                                {hasLimit ? ` / ${coupon.use_limit_per_coupon}` : ` (${t('Unlimited')})`}
                              </span>
                              {hasLimit && remaining !== null && (
                                <span className={`font-semibold ${
                                  isAtLimit ? 'text-red-600' : 
                                  isNearLimit ? 'text-orange-600' : 
                                  'text-green-600'
                                }`}>
                                  {remaining > 0 ? `${remaining} ${t('remaining')}` : t('No uses left')}
                                </span>
                              )}
                            </div>
                            {hasLimit && (
                              <Progress 
                                value={usagePercentage} 
                                className="h-2"
                              />
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
                  );
                })
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

  return (
    <ResponsiveWrapper
      mobileComponent={renderMobileCoupons()}
      desktopComponent={renderDesktopCoupons()}
    />
  );
}
