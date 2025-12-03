import React, { useState, useMemo } from 'react';
import { PageTemplate } from '@/components/page-template';
import { ArrowLeft, RefreshCw, Download, Search, Eye, Receipt, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

export default function POSTransactions() {
  const { t } = useTranslation();
  const { transactions, stats } = usePage().props as any;

  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = usePermissions();
  
  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    return transactions.filter(transaction => 
      transaction.transaction_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const pageActions = [
    {
      label: t('Back to POS'),
      icon: <ArrowLeft className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.visit(route('pos.index'))
    },
    {
      label: t('Refresh'),
      icon: <RefreshCw className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => router.reload()
    }
  ];
  
  if (hasPermission('view-transactions-pos')) {
    pageActions.push({
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => console.log('Export clicked')
    });
  }



  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'refunded':
        return 'destructive';
      case 'partial refund':
      case 'partial_refund':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <PageTemplate 
      title={t('POS Transactions')}
      url="/pos/transactions"
      actions={pageActions}
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Point of Sale (POS)'), href: route('pos.index') },
        { title: t('Transactions') }
      ]}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Today\'s Sales')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.todaySales)}</div>
              <p className="text-xs text-muted-foreground">{t('{{count}} transactions', { count: stats.todayCount })}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('This Week')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.weekSales)}</div>
              <p className="text-xs text-muted-foreground">{t('{{count}} transactions', { count: stats.weekCount })}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Average Sale')}</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageSale)}</div>
              <p className="text-xs text-muted-foreground">{t('Per transaction')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Refunds')}</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.refundAmount)}</div>
              <p className="text-xs text-muted-foreground">{t('{{count}} transactions', { count: stats.refundCount })}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('Search transactions...')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">


          </div>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Recent Transactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-3 text-left font-medium">{t('Transaction ID')}</th>
                    <th className="p-3 text-left font-medium">{t('Date & Time')}</th>
                    <th className="p-3 text-left font-medium">{t('Customer')}</th>
                    <th className="p-3 text-left font-medium">{t('Items')}</th>
                    <th className="p-3 text-right font-medium">{t('Total')}</th>
                    <th className="p-3 text-center font-medium">{t('Status')}</th>
                    <th className="p-3 text-center font-medium">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t">
                      <td className="p-3 font-medium">{transaction.transaction_number}</td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span>{transaction.date}</span>
                          <span className="text-xs text-muted-foreground">{transaction.time}</span>
                        </div>
                      </td>
                      <td className="p-3">{transaction.customer}</td>
                      <td className="p-3">{transaction.items}</td>
                      <td className="p-3 text-right">{formatCurrency(transaction.total)}</td>
                      <td className="p-3 text-center">
                        <Badge variant={getStatusVariant(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center space-x-1">
                          <Permission permission="view-transactions-pos">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => router.visit(route('pos.receipt', transaction.id))}
                            >
                              <Receipt className="h-4 w-4" />
                            </Button>
                          </Permission>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}