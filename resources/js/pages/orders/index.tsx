import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, ShoppingCart, Eye, Edit, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

import { ResponsiveWrapper } from '@/components/mobile/responsive-wrapper';
import { 
  PullToRefresh, 
  List as MobileList, 
  SwipeAction, 
  Tag as MobileTag,
  Tabs as MobileTabs,
  Space as MobileSpace,
  Dialog as MobileDialog,
  Toast,
  Badge as MobileBadge
} from 'antd-mobile';

interface OrdersProps {
  orders: Array<{
    id: number;
    orderNumber: string;
    customer: string;
    email: string;
    total: number;
    status: string;
    items: number;
    date: string;
    paymentMethod: string;
  }>;
  stats: {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
}

export default function Orders({ orders = [], stats }: OrdersProps) {
  const { t } = useTranslation();
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const { hasPermission } = usePermissions();
  
  const handleDelete = () => {
    if (orderToDelete) {
      router.delete(route('orders.destroy', orderToDelete), {
        onSuccess: () => {
          setOrderToDelete(null);
          Toast.show({
            icon: 'success',
            content: t('Order deleted successfully'),
          });
        }
      });
    }
  };

  const pageActions = [];
  
  if (hasPermission('export-orders')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('orders.export'), '_blank')
    });
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Processing': return 'secondary';
      case 'Shipped': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'primary';
      case 'Shipped': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());

  const renderMobileOrders = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white sticky top-0 z-10">
        <MobileTabs activeKey={activeTab} onChange={setActiveTab}>
          <MobileTabs.Tab title={t('All')} key="all" />
          <MobileTabs.Tab title={t('Pending')} key="pending" />
          <MobileTabs.Tab title={t('Processing')} key="processing" />
          <MobileTabs.Tab title={t('Completed')} key="completed" />
        </MobileTabs>
      </div>

      <PullToRefresh onRefresh={async () => {
        await router.reload({ only: ['orders', 'stats'] });
      }}>
        <MobileList header={t('Recent Orders')}>
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-20" />
              {t('No orders found')}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <SwipeAction
                key={order.id}
                rightActions={[
                  {
                    key: 'view',
                    text: t('View'),
                    color: 'primary',
                    onClick: () => router.visit(route('orders.show', order.id))
                  },
                  {
                    key: 'delete',
                    text: t('Delete'),
                    color: 'danger',
                    onClick: () => {
                      MobileDialog.confirm({
                        content: t('Are you sure you want to delete this order?'),
                        onConfirm: () => {
                          setOrderToDelete(order.id);
                          handleDelete();
                        }
                      });
                    }
                  }
                ]}
              >
                <MobileList.Item
                  onClick={() => router.visit(route('orders.show', order.id))}
                  description={
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">{order.date}</span>
                        <MobileTag color={getStatusColor(order.status)} fill="outline">{order.status}</MobileTag>
                      </div>
                      <div className="text-sm font-medium text-gray-700 truncate">{order.customer}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-base font-bold text-primary">{formatCurrency(order.total)}</span>
                        <span className="text-xs text-gray-400">{t('{{items}} items', { items: order.items })}</span>
                      </div>
                    </div>
                  }
                >
                  <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                </MobileList.Item>
              </SwipeAction>
            ))
          )}
        </MobileList>
      </PullToRefresh>
    </div>
  );

  const renderDesktopOrders = () => (
    <PageTemplate 
      title={t('Order Management')}
      url="/orders"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Order Management') }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Orders')}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">{t('Total orders in store')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Pending Orders')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
              <p className="text-xs text-muted-foreground">{t('Need attention')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">{t('Total revenue')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Avg. Order Value')}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.avgOrderValue || 0)}</div>
              <p className="text-xs text-muted-foreground">{t('Average order value')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Recent Orders')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length > 0 ? orders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm sm:text-base">{order.orderNumber}</h3>
                        <Badge variant={getStatusVariant(order.status)} className="text-xs w-fit">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">
                        {order.customer} 
                        <span className="hidden sm:inline"> • {order.email}</span>
                      </p>
                      <div className="sm:hidden text-xs text-muted-foreground truncate mb-2">{order.email}</div>
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-3 sm:gap-x-4 gap-y-1">
                        <span className="text-xs sm:text-sm font-semibold text-primary">{formatCurrency(order.total)}</span>
                        <span className="text-xs text-muted-foreground">{t('{{items}} items', { items: order.items })}</span>
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0">
                    <Permission permission="view-orders">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.visit(route('orders.show', order.id))}
                        className="h-9 px-3 touch-manipulation"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="ml-2 sm:hidden">{t('View')}</span>
                      </Button>
                    </Permission>
                    <Permission permission="edit-orders">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.visit(route('orders.edit', order.id))}
                        className="h-9 px-3 touch-manipulation"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="ml-2 sm:hidden">{t('Edit')}</span>
                      </Button>
                    </Permission>
                    <Permission permission="delete-orders">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setOrderToDelete(order.id)}
                        className="h-9 px-3 touch-manipulation text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-2 sm:hidden">{t('Delete')}</span>
                      </Button>
                    </Permission>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('No orders found')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">{t('Delete Order')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('Are you sure you want to delete this order? This action cannot be undone.')}
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOrderToDelete(null)}>
                {t('Cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                {t('Delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );

  return (
    <ResponsiveWrapper
      mobileComponent={renderMobileOrders()}
      desktopComponent={renderDesktopOrders()}
    />
  );
}