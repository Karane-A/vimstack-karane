import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Plus, RefreshCw, Download, Users, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

import { ResponsiveWrapper } from '@/components/mobile/responsive-wrapper';
import { 
  PullToRefresh, 
  List as MobileList, 
  SwipeAction, 
  Avatar as MobileAvatar,
  Tag as MobileTag,
  Dialog as MobileDialog,
  Toast,
  SearchBar
} from 'antd-mobile';
import { UserOutline } from 'antd-mobile-icons';

export default function Customers() {
  const { t } = useTranslation();
  const { customers, stats } = usePage().props as any;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { hasPermission } = usePermissions();

  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    router.delete(route('customers.destroy', selectedCustomer.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        Toast.show({
          icon: 'success',
          content: t('Customer deleted successfully'),
        });
      }
    });
  };

  const pageActions = [];
  
  if (hasPermission('export-customers')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.open(route('customers.export'), '_blank')
    });
  }
  
  if (hasPermission('create-customers')) {
    pageActions.push({
      label: t('Add Customer'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => router.visit(route('customers.create'))
    });
  }

  const filteredCustomers = customers.filter((c: any) => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMobileCustomers = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-3 bg-white border-bottom sticky top-0 z-10">
        <SearchBar 
          placeholder={t('Search customers...')} 
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />
      </div>

      <PullToRefresh onRefresh={async () => {
        await router.reload({ only: ['customers', 'stats'] });
      }}>
        <MobileList header={t('Customer Directory')}>
          {filteredCustomers.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
              {t('No customers found')}
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <SwipeAction
                key={customer.id}
                rightActions={[
                  {
                    key: 'edit',
                    text: t('Edit'),
                    color: 'primary',
                    onClick: () => router.visit(route('customers.edit', customer.id))
                  },
                  {
                    key: 'delete',
                    text: t('Delete'),
                    color: 'danger',
                    onClick: () => {
                      MobileDialog.confirm({
                        content: t('Are you sure you want to delete this customer?'),
                        onConfirm: () => {
                          setSelectedCustomer(customer);
                          handleDeleteConfirm();
                        }
                      });
                    }
                  }
                ]}
              >
                <MobileList.Item
                  onClick={() => router.visit(route('customers.show', customer.id))}
                  prefix={
                    <MobileAvatar
                      src={customer.avatar ? getImageUrl(customer.avatar) : ''}
                      style={{ '--size': '48px', '--border-radius': '24px' }}
                      fallback={<UserOutline />}
                    />
                  }
                  description={
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">{customer.email}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{t('{{count}} orders', { count: customer.total_orders })}</span>
                        <span className="text-xs font-bold text-primary">{formatCurrency(customer.total_spent || 0)}</span>
                      </div>
                    </div>
                  }
                  extra={
                    <MobileTag color={customer.is_active ? 'success' : 'default'} fill="outline">
                      {customer.is_active ? t('Active') : t('Inactive')}
                    </MobileTag>
                  }
                >
                  <span className="font-semibold text-gray-900">{customer.full_name}</span>
                </MobileList.Item>
              </SwipeAction>
            ))
          )}
        </MobileList>
      </PullToRefresh>
    </div>
  );

  const renderDesktopCustomers = () => (
    <PageTemplate 
      title={t('Customer Management')}
      url="/customers"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Customer Management') }
      ]}
    >
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Customers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">{stats.newThisMonth > 0 ? t('+{{count}} from last month', { count: stats.newThisMonth }) : t('No new customers')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Customers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {t('{{percent}}% active rate', { percent: stats.totalCustomers > 0 ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0 })}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('New This Month')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalCustomers > 0 ? t('{{percent}}% growth', { percent: Math.round((stats.newThisMonth / stats.totalCustomers) * 100) }) : t('No growth')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Avg. Order Value')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.avgOrderValue)}</div>
              <p className="text-xs text-muted-foreground">{t('Per order')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Customer Directory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">{t('No customers found')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('Get started by adding your first customer.')}
                  </p>
                  <Permission permission="create-customers">
                    <Button 
                      onClick={() => router.visit(route('customers.create'))} 
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Customer')}
                    </Button>
                  </Permission>
                </div>
              ) : (
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={customer.avatar ? getImageUrl(customer.avatar) : ''} alt={customer.full_name} />
                          <AvatarFallback>{customer.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{customer.full_name}</h3>
                            <Badge variant={customer.is_active ? 'default' : 'secondary'}>
                              {customer.is_active ? t('Active') : t('Inactive')}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{customer.email}</span>
                            {customer.phone && (
                              <>
                                <Phone className="h-3 w-3 ml-2" />
                                <span>{customer.phone}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-muted-foreground">{t('{{count}} orders', { count: customer.total_orders })}</span>
                            <span className="text-xs text-muted-foreground">{t('{{amount}} spent', { amount: formatCurrency(customer.total_spent || 0) })}</span>
                            <span className="text-xs text-muted-foreground">{t('Joined {{date}}', { date: new Date(customer.created_at).toLocaleDateString() })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Permission permission="view-customers">
                          <Button variant="ghost" size="sm" onClick={() => router.visit(route('customers.show', customer.id))}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Permission>
                        <Permission permission="edit-customers">
                          <Button variant="ghost" size="sm" onClick={() => router.visit(route('customers.edit', customer.id))}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Permission>
                        <Permission permission="delete-customers">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(customer)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Permission>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Customer')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('Are you sure you want to delete the customer "{{name}}"?', { name: selectedCustomer?.full_name })}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('This action cannot be undone.')}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t('Cancel')}</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>{t('Delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );

  return (
    <ResponsiveWrapper
      mobileComponent={renderMobileCustomers()}
      desktopComponent={renderDesktopCustomers()}
    />
  );
}