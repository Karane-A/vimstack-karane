import React, { useState } from 'react';
import { RefreshCw, Download, ShoppingCart, Eye, Edit, Trash2, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { router, Link, Head } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { usePermissions } from '@/hooks/usePermissions';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

interface OrdersProps {
  orders: any[];
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
  const { hasPermission } = usePermissions();

  const handleDelete = () => {
    if (orderToDelete) {
      router.delete(route('orders.destroy', orderToDelete));
      setOrderToDelete(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <Head title={t('Order Management')} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('Orders')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('Manage and track your customer orders')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-lg h-9" onClick={() => router.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" /> {t('Refresh')}
          </Button>
          {hasPermission('export-orders') && (
            <Button variant="outline" className="rounded-lg h-9" onClick={() => window.open(route('orders.export'), '_blank')}>
              <Download className="h-4 w-4 mr-2" /> {t('Export')}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('Total Orders')}
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          trend={{ value: '8.2%', isUp: true }}
        />
        <MetricCard
          title={t('Pending Orders')}
          value={stats?.pendingOrders || 0}
          icon={Package}
          trend={{ value: '2.4%', isUp: false }}
        />
        <MetricCard
          title={t('Total Revenue')}
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={ShoppingCart}
          trend={{ value: '14.5%', isUp: true }}
        />
        <MetricCard
          title={t('Avg. Order Value')}
          value={formatCurrency(stats?.avgOrderValue || 0)}
          icon={ShoppingCart}
          trend={{ value: '1.2%', isUp: true }}
        />
      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-[14px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('Search orders...')}
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-lg">{t('Filter')}</Button>
          </div>
        </div>

        <DataTable
          columns={[
            {
              key: 'orderNumber',
              header: t('Order #'),
              render: (order: any) => (
                <Link
                  href={route('orders.show', order.id)}
                  className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {order.orderNumber}
                </Link>
              )
            },
            {
              key: 'customer',
              header: t('Customer'),
              render: (order: any) => (
                <div>
                  <p className="font-semibold text-slate-900">{order.customer}</p>
                  <p className="text-xs text-slate-500">{order.email}</p>
                </div>
              )
            },
            {
              key: 'total',
              header: t('Total'),
              render: (order: any) => (
                <span className="font-bold text-slate-900">{formatCurrency(order.total)}</span>
              )
            },
            {
              key: 'status',
              header: t('Status'),
              render: (order: any) => (
                <StatusBadge status={order.status} />
              )
            },
            {
              key: 'date',
              header: t('Date'),
              render: (order: any) => (
                <span className="text-slate-500 text-sm">{order.date}</span>
              )
            },
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (order: any) => (
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.visit(route('orders.show', order.id))}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4 text-slate-500" />
                  </Button>
                  {hasPermission('edit-orders') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.visit(route('orders.edit', order.id))}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4 text-slate-500" />
                    </Button>
                  )}
                  {hasPermission('delete-orders') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOrderToDelete(order.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            }
          ]}
          data={orders}
          keyExtractor={(item: any, _index: number) => item.id}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('Delete Order')}</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {t('Are you sure you want to delete this order? This action cannot be undone and will permanently remove the record from your database.')}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" className="rounded-xl px-6" onClick={() => setOrderToDelete(null)}>
                {t('Keep it')}
              </Button>
              <Button variant="destructive" className="rounded-xl px-6 font-bold" onClick={handleDelete}>
                {t('Yes, Delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Orders.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;