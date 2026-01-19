import React, { useState } from 'react';
import { Plus, RefreshCw, Download, Users, Eye, Edit, Trash2, Mail, Phone, Search, Filter, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { router, usePage, Link, Head } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/helpers';
import { usePermissions } from '@/hooks/usePermissions';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

export default function Customers() {
  const { t } = useTranslation();
  const { customers, stats } = usePage().props as any;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { hasPermission } = usePermissions();

  const handleDelete = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCustomer) {
      router.delete(route('customers.destroy', selectedCustomer.id));
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <Head title={t('Customer Management')} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('Customers')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('Maintain relationships and view customer insights')}</p>
        </div>
        <div className="flex items-center gap-3">
          {hasPermission('export-customers') && (
            <Button variant="outline" className="rounded-lg h-9" onClick={() => window.open(route('customers.export'), '_blank')}>
              <Download className="h-4 w-4 mr-2" /> {t('Export')}
            </Button>
          )}
          {hasPermission('create-customers') && (
            <Button variant="default" className="rounded-lg h-9 bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={() => router.visit(route('customers.create'))}>
              <Plus className="h-4 w-4 mr-2" /> {t('Add Member')}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('Total Customers')}
          value={stats?.totalCustomers || 0}
          icon={Users}
          trend={{ value: `${stats?.newThisMonth || 0}`, isUp: true, label: 'new this month' }}
        />
        <MetricCard
          title={t('Active Customers')}
          value={stats?.activeCustomers || 0}
          icon={Users}
          trend={{ value: `${stats?.totalCustomers > 0 ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0}%`, isUp: true, label: 'active rate' }}
        />
        <MetricCard
          title={t('New This Month')}
          value={stats?.newThisMonth || 0}
          icon={Users}
          trend={{ value: '18%', isUp: true }}
        />
        <MetricCard
          title={t('Avg. Order Value')}
          value={formatCurrency(stats?.avgOrderValue || 0)}
          icon={Users}
          trend={{ value: '4.5%', isUp: true }}
        />
      </div>

      {/* Customers Table Section */}
      <div className="bg-white rounded-[14px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('Search by name or email...')}
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 gap-2 border border-slate-100">
              <Filter size={14} /> {t('Filter')}
            </Button>
          </div>
        </div>

        <DataTable
          columns={[
            {
              key: 'customer',
              header: t('Customer'),
              render: (customer: any) => (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <AvatarImage src={customer.avatar ? getImageUrl(customer.avatar) : ''} alt={customer.full_name} />
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xs">{customer.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={route('customers.show', customer.id)} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      {customer.full_name}
                    </Link>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </div>
                </div>
              )
            },
            {
              key: 'phone',
              header: t('Phone'),
              render: (customer: any) => (
                <span className="text-slate-600 text-sm">{customer.phone || '-'}</span>
              )
            },
            {
              key: 'orders',
              header: t('Orders'),
              render: (customer: any) => (
                <div>
                  <p className="font-bold text-slate-900">{customer.total_orders}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{t('Orders')}</p>
                </div>
              )
            },
            {
              key: 'spent',
              header: t('Total Spent'),
              render: (customer: any) => (
                <span className="font-bold text-slate-900">{formatCurrency(customer.total_spent || 0)}</span>
              )
            },
            {
              key: 'status',
              header: t('Status'),
              render: (customer: any) => (
                <StatusBadge status={customer.is_active ? 'Active' : 'Inactive'} />
              )
            },
            {
              key: 'joined',
              header: t('Joined'),
              render: (customer: any) => (
                <span className="text-slate-500 text-sm">{new Date(customer.created_at).toLocaleDateString()}</span>
              )
            },
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (customer: any) => (
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => router.visit(route('customers.show', customer.id))} className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4 text-slate-500" />
                  </Button>
                  {hasPermission('edit-customers') && (
                    <Button variant="ghost" size="sm" onClick={() => router.visit(route('customers.edit', customer.id))} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4 text-slate-500" />
                    </Button>
                  )}
                  {hasPermission('delete-customers') && (
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(customer)} className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            }
          ]}
          data={customers}
          keyExtractor={(item: any, _index: number) => item.id}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent className="max-w-md rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">{t('Delete Member')}</DialogTitle>
            <DialogDescription className="text-slate-600 mt-2 leading-relaxed">
              {t('Are you sure you want to remove "{{name}}" from your customers? This action is permanent and will delete all associated records.', { name: selectedCustomer?.full_name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 gap-3">
            <Button variant="ghost" className="rounded-xl px-6" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('Keep Member')}
            </Button>
            <Button variant="destructive" className="rounded-xl px-6 font-bold" onClick={handleDeleteConfirm}>
              {t('Yes, Remove')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

Customers.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;