import React, { useState } from 'react';
import { PageTemplate, type PageAction } from '@/components/page-template';
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
import { MobileHeader } from '@/components/mobile/mobile-header';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CouponSystem() {
  const { t } = useTranslation();
  const { coupons = { data: [] }, stats = { total: 0, active: 0, percentage: 0, flat: 0 } } = usePage().props as any;
  const [couponToDelete, setCouponToDelete] = useState<number | null>(null);

  const { hasPermission } = usePermissions();

  const handleDelete = () => {
    if (couponToDelete) {
      router.delete(route('store-coupons.destroy', couponToDelete), {
        onSuccess: () => {
          setCouponToDelete(null);
          toast.success(t('Coupon deleted successfully'));
        }
      });
    }
  };

  const pageActions: PageAction[] = [];

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
    <div className="flex flex-col h-screen bg-transparent">
      <MobileHeader
        title={t('Store Coupons')}
        right={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-8 h-8"
            onClick={() => router.reload({ only: ['coupons', 'stats'] })}
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </Button>
        }
      />

      <ScrollArea className="flex-1">
        {/* Mobile Stats Bar */}
        <div className="bg-white border-b px-4 py-4 sticky top-0 z-10 overflow-hidden">
          <div className="flex overflow-x-auto pb-1 space-x-3 no-scrollbar">
            <div className="flex-shrink-0 bg-teal-50 px-4 py-2.5 rounded-2xl border border-teal-100 min-w-[120px]">
              <div className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mb-0.5">{t('Total')}</div>
              <div className="text-xl font-black text-teal-900 leading-none">{stats.total || 0}</div>
            </div>
            <div className="flex-shrink-0 bg-green-50 px-4 py-2.5 rounded-2xl border border-green-100 min-w-[120px]">
              <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-0.5">{t('Active')}</div>
              <div className="text-xl font-black text-green-900 leading-none">{stats.active || 0}</div>
            </div>
            <div className="flex-shrink-0 bg-blue-50 px-4 py-2.5 rounded-2xl border border-blue-100 min-w-[120px]">
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">{t('Percentage')}</div>
              <div className="text-xl font-black text-blue-900 leading-none">{stats.percentage || 0}</div>
            </div>
            <div className="flex-shrink-0 bg-purple-50 px-4 py-2.5 rounded-2xl border border-purple-100 min-w-[120px]">
              <div className="text-[10px] text-purple-600 font-bold uppercase tracking-wider mb-0.5">{t('Flat')}</div>
              <div className="text-xl font-black text-purple-900 leading-none">{stats.flat || 0}</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4 pb-24 bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">{t('All Coupons')}</h2>
              <p className="text-[10px] text-gray-400 uppercase font-bold">{t('Manage your active discounts')}</p>
            </div>
            {hasPermission('create-coupon-system') && (
              <Button
                size="sm"
                className="h-9 px-4 rounded-full bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 font-bold text-xs"
                onClick={() => router.visit(route('coupon-system.create'))}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                {t('New')}
              </Button>
            )}
          </div>

          {!coupons || !coupons.data || coupons.data.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Percent className="h-10 w-10 text-gray-200" />
              </div>
              <h3 className="text-gray-900 font-bold mb-1">{t('No coupons yet')}</h3>
              <p className="text-gray-500 text-xs px-12 leading-relaxed">{t('Create your first discount coupon to boost your product sales.')}</p>
            </div>
          ) : (
            coupons.data.map((coupon: any) => {
              const hasLimit = coupon.use_limit_per_coupon && coupon.use_limit_per_coupon > 0;
              const usedCount = coupon.used_count || 0;
              const usagePercentage = hasLimit ? (usedCount / coupon.use_limit_per_coupon) * 100 : 0;

              return (
                <div
                  key={coupon.id}
                  className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{coupon.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-widest">
                          {coupon.code}
                        </span>
                        <button
                          className="text-gray-400 hover:text-teal-600 p-1 active:bg-teal-50 rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(coupon.code);
                            toast.success(t('Code copied to clipboard!'));
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <Badge className={`rounded-lg px-2 text-[10px] font-bold uppercase transition-colors ${coupon.status
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`} variant="outline">
                      {coupon.status ? t('Active') : t('Inactive')}
                    </Badge>
                  </div>

                  <div className="flex items-end justify-between mb-4 border-t border-gray-50 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                        {coupon.type === 'percentage' ? t('Percentage Off') : t('Fixed Discount')}
                      </span>
                      <span className="text-2xl font-black text-teal-600 leading-none">
                        {coupon.type === 'percentage' ? `${coupon.discount_amount}%` : formatCurrency(coupon.discount_amount)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl bg-gray-50 hover:bg-teal-50 hover:text-teal-600"
                        onClick={() => router.visit(route('coupon-system.edit', coupon.id))}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl bg-gray-50 hover:bg-red-50 text-red-500"
                        onClick={() => setCouponToDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {hasLimit && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                        <span>{t('Usability')} ({usedCount} / {coupon.use_limit_per_coupon})</span>
                        <span className={usagePercentage > 90 ? 'text-red-500' : 'text-gray-500'}>{Math.round(usagePercentage)}%</span>
                      </div>
                      <Progress
                        value={usagePercentage}
                        className={`h-2 rounded-full overflow-hidden [&>div]:transition-all ${usagePercentage > 90 ? '[&>div]:bg-red-500' : '[&>div]:bg-teal-500'
                          }`}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderDesktopCoupons = () => (
    <PageTemplate
      title={t('Coupon System')}
      description={t('Manage and track your store discount coupons')}
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
                                <span className={`font-semibold ${isAtLimit ? 'text-red-600' :
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
