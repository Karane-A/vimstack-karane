import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { RefreshCw, Download, BarChart, TrendingUp, Users, ShoppingCart, DollarSign, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { formatCurrency } from '@/utils/helpers';
import { Permission } from '@/components/Permission';
import { usePermissions } from '@/hooks/usePermissions';

interface Props {
  analytics: {
    metrics: any;
    topProducts: any[];
    topCustomers: any[];
    recentActivity: any[];
    revenueChart: any[];
    salesChart: any[];
  };
}

export default function Analytics({ analytics }: Props) {
  const { t } = useTranslation();

  const { hasPermission } = usePermissions();

  const pageActions = hasPermission('export-analytics') ? [
    {
      label: t('Export Report'),
      icon: <Download className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => window.open(route('analytics.export'), '_blank')
    }
  ] : [];

  return (
    <PageTemplate 
      title={t('Analytics & Reporting')}
      url="/analytics"
      actions={pageActions}
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Analytics & Reporting' }
      ]}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.metrics.revenue.current)}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.metrics.revenue.change >= 0 ? '+' : ''}{analytics.metrics.revenue.change.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.metrics.orders.current.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.metrics.orders.change >= 0 ? '+' : ''}{analytics.metrics.orders.change} from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.metrics.customers.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.metrics.customers.new} new this month
              </p>
            </CardContent>
          </Card>
          

        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={analytics.revenueChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.salesChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, 'Orders']} />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products & Customers */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{typeof product.revenue === 'number' ? formatCurrency(product.revenue) : product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{typeof customer.spent === 'number' ? formatCurrency(customer.spent) : customer.spent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {activity.type === 'Order' && <ShoppingCart className="h-4 w-4 text-primary" />}
                      {activity.type === 'Customer' && <Users className="h-4 w-4 text-primary" />}
                      {activity.type === 'Product' && <Eye className="h-4 w-4 text-primary" />}
                      {activity.type === 'Payment' && <DollarSign className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <Badge variant="outline">{typeof activity.amount === 'number' ? formatCurrency(activity.amount) : activity.amount}</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}