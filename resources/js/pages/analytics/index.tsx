import React from 'react';
import { Download, Users, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Package, User, Target, Activity, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, AreaChart, Area } from 'recharts';
import { formatCurrency } from '@/utils/helpers';
import { usePermissions } from '@/hooks/usePermissions';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

interface Props {
  analytics: {
    metrics: any;
    topProducts: any[];
    topCustomers: any[];
    recentActivity: any[];
    revenueChart: any[];
    salesChart: any[];
    monthlyRevenueBreakdown?: any[];
  };
}

export default function Analytics({ analytics }: Props) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
          <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
          <p className="text-sm font-bold text-indigo-600">
            {payload[0].name === 'Revenue' ? formatCurrency(payload[0].value) : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <Head title={t('Analytics & Reporting')} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('Analytics')}</h1>
          <p className="text-sm text-slate-500 mt-1 hidden md:block">{t('In-depth overview of your business performance')}</p>
        </div>
        <div className="flex items-center gap-3">
          {hasPermission('export-analytics') && (
            <Button variant="default" className="rounded-lg h-9 bg-indigo-600 hover:bg-indigo-700 font-bold w-full md:w-auto" onClick={() => window.open(route('analytics.export'), '_blank')}>
              <Download className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">{t('Export Report')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('Total Revenue')}
          value={formatCurrency(analytics.metrics.revenue.total || analytics.metrics.revenue.current)}
          icon={DollarSign}
          description={t('Lifetime earnings')}
        />
        <MetricCard
          title={t('Monthly Revenue')}
          value={formatCurrency(analytics.metrics.revenue.current)}
          icon={TrendingUp}
          trend={{
            value: `${Math.abs(analytics.metrics.revenue.change).toFixed(1)}%`,
            isUp: analytics.metrics.revenue.change >= 0,
            label: 'vs last month'
          }}
        />
        <MetricCard
          title={t('Avg Order Value')}
          value={formatCurrency(analytics.metrics.revenue.avgOrderValue || 0)}
          icon={ShoppingCart}
          description={t('Per transaction')}
        />
        <MetricCard
          title={t('Conversion Rate')}
          value={`${analytics.metrics.conversionRate || 0}%`}
          icon={Target}
          description={t('Orders / Customers')}
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('Total Orders')}
          value={(analytics.metrics.orders.total || analytics.metrics.orders.current).toLocaleString()}
          icon={Package}
          trend={{
            value: `${Math.abs(analytics.metrics.orders.change)}`,
            isUp: analytics.metrics.orders.change >= 0,
            label: 'vs last month'
          }}
        />
        <MetricCard
          title={t('Active Products')}
          value={(analytics.metrics.products?.active || 0).toLocaleString()}
          icon={Sparkles}
          description={t('Sold in last 30 days')}
        />
        <MetricCard
          title={t('Total Customers')}
          value={analytics.metrics.customers.total.toLocaleString()}
          icon={Users}
          trend={{
            value: `${analytics.metrics.customers.new}`,
            isUp: true,
            label: 'new this month'
          }}
        />
        <MetricCard
          title={t('Repeat Rate')}
          value={`${analytics.metrics.customers.repeatRate || 0}%`}
          icon={Activity}
          description={t('2+ purchases')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">{t('Revenue Overview')}</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-xs text-slate-500">{t('Revenue')}</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">{t('Sales Trend')}</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-slate-500">{t('Orders')}</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={analytics.salesChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Top Products and Customers Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Products */}
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold text-slate-900">{t('Top Selling Products')}</h3>
            </div>
            <div className="p-0">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Package className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{t('{{count}} items sold', { count: product.sales })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {typeof product.revenue === 'number' ? formatCurrency(product.revenue) : product.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold text-slate-900">{t('Top Customers')}</h3>
            </div>
            <div className="p-0">
              {analytics.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{t('{{count}} orders placed', { count: customer.orders })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">
                      {typeof customer.spent === 'number' ? formatCurrency(customer.spent) : customer.spent}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-slate-900">{t('Recent Activity')}</h3>
          </div>
          <div className="p-0">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    activity.type === 'Order' ? "bg-emerald-50 text-emerald-600" :
                      activity.type === 'Customer' ? "bg-indigo-50 text-indigo-600" :
                        activity.type === 'Product' ? "bg-amber-50 text-amber-600" :
                          "bg-slate-50 text-slate-600"
                  )}>
                    {activity.type === 'Order' && <ShoppingCart className="h-5 w-5" />}
                    {activity.type === 'Customer' && <Users className="h-5 w-5" />}
                    {activity.type === 'Product' && <Package className="h-5 w-5" />}
                    {activity.type === 'Payment' && <DollarSign className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <div className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-xs font-bold">
                    {typeof activity.amount === 'number' ? formatCurrency(activity.amount) : activity.amount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Analytics.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;