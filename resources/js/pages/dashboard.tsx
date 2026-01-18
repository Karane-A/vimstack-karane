import React, { useState } from 'react';
import { PageTemplate, type PageAction } from '@/components/page-template';
import { RefreshCw, BarChart3, Download, Building2, ShoppingCart, Users, DollarSign, Package, TrendingUp, QrCode, Copy, Check, CreditCard, FileText, Tag, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link, router, usePage } from '@inertiajs/react';
import QRCode from 'react-qr-code';

import { formatCurrency } from '@/utils/helpers';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';

import { ResponsiveWrapper } from '@/components/mobile/responsive-wrapper';
import { 
  PullToRefresh, 
  Grid, 
  Card as MobileCard, 
  Divider, 
  List as MobileList, 
  SwipeAction, 
  Avatar, 
  Badge,
  Space as MobileSpace,
  Tag as MobileTag
} from 'antd-mobile';
import { UserOutline, ShopOutline } from 'antd-mobile-icons';

// Simple Statistic component for mobile
const MobileStatistic = ({ title, value, prefix }: { title: string, value: string | number, prefix?: React.ReactNode }) => (
  <div className="flex flex-col">
    <div className="text-xs text-gray-500 mb-1 flex items-center">
      {prefix}
      {title}
    </div>
    <div className="text-lg font-bold text-gray-900">{value}</div>
  </div>
);

interface Props {
  dashboardData: {
    metrics: {
      orders?: number;
      products?: number;
      customers?: number;
      revenue?: number;
      totalCompanies?: number;
      totalPlans?: number;
      activePlans?: number;
      totalRevenue?: number;
      monthlyRevenue?: number;
      monthlyGrowth?: number;
      pendingRequests?: number;
      pendingOrders?: number;
      approvedOrders?: number;
      totalOrders?: number;
      activeCoupons?: number;
      totalCoupons?: number;
      formattedTotalRevenue?: string;
    };
    recentOrders: any[];
    topProducts?: any[];
    topPlans?: any[];
  };
  currentStore: any;
  storeUrl?: string;
  isSuperAdmin: boolean;
}

export default function Dashboard({ dashboardData, currentStore, storeUrl, isSuperAdmin }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const { auth } = usePage().props as any;
  const permissions = auth?.permissions || [];
  const { themeColor, customColor } = useBrand();
  
  // Get dynamic theme color value
  const getThemeColorValue = () => {
    return themeColor === 'custom' ? customColor : THEME_COLORS[themeColor];
  };
  
  const copyToClipboard = async () => {
    try {
      const urlToCopy = currentStore?.copy_link_url || storeUrl;
      if (!urlToCopy) return;
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const pageActions: PageAction[] = isSuperAdmin ? [
    {
      label: t('Refresh'),
      icon: <RefreshCw className="h-4 w-4" />,
      variant: 'outline',
      onClick: () => router.reload({ only: ['dashboardData'] })
    }
  ] : [
    ...(permissions.includes('view-analytics') ? [{
      label: t('Analytics'),
      icon: <BarChart3 className="h-4 w-4" />,
      variant: 'outline',
      onClick: () => window.location.href = route('analytics.index')
    }] : []),
    ...(permissions.includes('export-dashboard') ? [{
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'default',
      onClick: () => window.open(route('dashboard.export'), '_blank')
    }] : [])
  ];

  const renderMobileDashboard = () => (
    <div className="p-4 space-y-4">
      <PullToRefresh onRefresh={async () => {
        await router.reload({ only: ['dashboardData'] });
      }}>
        {isSuperAdmin ? (
          <>
            <Grid columns={2} gap={12}>
              <MobileCard className="bg-purple-50">
                <MobileStatistic 
                  title={t('Active Plans')} 
                  value={dashboardData.metrics.activePlans || 0} 
                  prefix={<Package className="h-4 w-4 text-purple-600 mr-1" />}
                />
              </MobileCard>
              <MobileCard className="bg-orange-50">
                <MobileStatistic 
                  title={t('Pending')} 
                  value={dashboardData.metrics.pendingRequests || 0} 
                  prefix={<FileText className="h-4 w-4 text-orange-600 mr-1" />}
                />
              </MobileCard>
              <MobileCard className="bg-green-50">
                <MobileStatistic 
                  title={t('Growth')} 
                  value={`${(dashboardData.metrics.monthlyGrowth || 0) >= 0 ? '+' : ''}${dashboardData.metrics.monthlyGrowth || 0}%`}
                  prefix={<TrendingUp className="h-4 w-4 text-green-600 mr-1" />}
                />
              </MobileCard>
              <MobileCard className="bg-blue-50">
                <MobileStatistic 
                  title={t('Companies')} 
                  value={dashboardData.metrics.totalCompanies || 0} 
                  prefix={<Building2 className="h-4 w-4 text-blue-600 mr-1" />}
                />
              </MobileCard>
            </Grid>

            <Divider contentPosition="left">{t('Recent Activity')}</Divider>
            
            <MobileList>
              {dashboardData.recentOrders.map((order, index) => (
                <SwipeAction
                  key={index}
                  rightActions={[
                    { key: 'view', text: t('View'), color: 'primary' }
                  ]}
                >
                  <MobileList.Item
                    prefix={<Avatar icon={<UserOutline />} />}
                    description={order.date || order.time}
                    extra={
                      <Badge 
                        content={order.status} 
                        style={{ 
                          '--background-color': order.status === 'company' || order.status === 'approved' ? '#00b578' : '#ff8f1f'
                        }} 
                      />
                    }
                  >
                    {order.company || order.description}
                  </MobileList.Item>
                </SwipeAction>
              ))}
            </MobileList>
          </>
        ) : (
          <>
            <Grid columns={2} gap={12}>
              <MobileCard>
                <MobileStatistic 
                  title={t('Orders')} 
                  value={dashboardData.metrics.orders || 0} 
                />
              </MobileCard>
              <MobileCard>
                <MobileStatistic 
                  title={t('Revenue')} 
                  value={formatCurrency(dashboardData.metrics.revenue || 0)} 
                />
              </MobileCard>
              <MobileCard>
                <MobileStatistic 
                  title={t('Products')} 
                  value={dashboardData.metrics.products || 0} 
                />
              </MobileCard>
              <MobileCard>
                <MobileStatistic 
                  title={t('Customers')} 
                  value={dashboardData.metrics.customers || 0} 
                />
              </MobileCard>
            </Grid>

            <Divider contentPosition="left">{t('Recent Orders')}</Divider>
            
            <MobileList>
              {dashboardData.recentOrders.map((order, index) => (
                <SwipeAction
                  key={index}
                  rightActions={[
                    { 
                      key: 'view', 
                      text: t('View'), 
                      color: 'primary',
                      onClick: () => router.visit(route('orders.show', order.id))
                    }
                  ]}
                >
                  <MobileList.Item
                    description={order.customer}
                    extra={
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(order.amount)}</div>
                        <MobileTag color="primary" fill="outline">{order.status}</MobileTag>
                      </div>
                    }
                  >
                    {order.order_number}
                  </MobileList.Item>
                </SwipeAction>
              ))}
            </MobileList>

            <Divider contentPosition="left">{t('Store QR')}</Divider>
            <MobileCard>
              <MobileSpace direction="vertical" align="center" block>
                <div className="bg-white p-2 rounded-lg">
                  <QRCode value={currentStore?.qr_code_url || storeUrl} size={100} />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="w-full"
                >
                  {copied ? t('Copied!') : t('Copy Link')}
                </Button>
              </MobileSpace>
            </MobileCard>
          </>
        )}
      </PullToRefresh>
    </div>
  );

  const renderDesktopDashboard = () => {
    // Super Admin Dashboard
    if (isSuperAdmin) {
      return (
        <PageTemplate title={t('Dashboard')} description={t('System-wide statistics and overview')} url="/dashboard" actions={pageActions}>
          <div className="space-y-4 sm:space-y-6">
            {/* Top Metric Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-xs sm:text-sm font-medium">{t('Active Plans')}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl sm:text-2xl font-bold">{dashboardData.metrics.activePlans || 0}</div>
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t('Currently enabled subscription plans')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('Pending Requests')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{dashboardData.metrics.pendingRequests || 0}</div>
                    <div className="p-3 bg-orange-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('Awaiting approval')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('Monthly Growth')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">
                      {(dashboardData.metrics.monthlyGrowth || 0) >= 0 ? '+' : ''}{dashboardData.metrics.monthlyGrowth || 0}%
                    </div>
                    <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('System growing monthly')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('Total Companies')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{dashboardData.metrics.totalCompanies || 0}</div>
                    <div className="p-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('Registered companies')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{dashboardData.metrics.formattedTotalRevenue || formatCurrency(dashboardData.metrics.totalRevenue || 0)}</div>
                    <div className="p-3 bg-yellow-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('All-time earnings')}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activities and Top Plans */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t('Recent Activity')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.recentOrders.map((order, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          order.status === 'company' || order.status === 'approved' ? 'bg-green-500' :
                          order.status === 'payment' ? 'bg-green-500' :
                          order.status === 'plan' || order.status === 'pending' ? 'bg-orange-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {order.company || order.description}
                          </p>
                          <p className="text-xs text-gray-500">{order.date || order.time}</p>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded font-medium ${
                          order.status === 'company' || order.status === 'approved' ? 'bg-green-100 text-green-700' :
                          order.status === 'payment' ? 'bg-green-100 text-green-700' :
                          order.status === 'plan' || order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t('Top Performing Plans')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.topPlans?.map((plan, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-primary/10 text-primary' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            #{index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">{plan.name}</p>
                            <p className="text-sm text-gray-500">{plan.orders || plan.subscribers} {t('subscribers')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">{plan.formatted_revenue || formatCurrency(plan.revenue || 0)}</p>
                          <p className="text-xs text-gray-500">{t('revenue')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Features Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  {t('Features')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t('Comprehensive system management and oversight tools')}</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="group">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="rounded-full p-3 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-secondary text-secondary-foreground">
                            {dashboardData.metrics.totalCompanies}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{t('Company Management')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t('Manage all registered companies and their subscriptions')}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-between hover:bg-primary/10"
                          onClick={() => router.visit(route('companies.index'))}
                        >
                          {t('Explore')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="rounded-full p-3 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                            <Package className="h-6 w-6" />
                          </div>
                          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-secondary text-secondary-foreground">
                            {dashboardData.metrics.totalPlans}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{t('Plan Management')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t('Create and manage subscription plans')}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-between hover:bg-primary/10"
                          onClick={() => router.visit(route('plans.index'))}
                        >
                          {t('Explore')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="rounded-full p-3 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                            <Tag className="h-6 w-6" />
                          </div>
                          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-secondary text-secondary-foreground">
                            {dashboardData.metrics.activeCoupons || 0}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{t('Coupon Management')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t('Manage system-wide coupons and discounts')}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-between hover:bg-primary/10"
                          onClick={() => router.visit(route('coupons.index'))}
                        >
                          {t('Explore')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageTemplate>
      );
    }


    
    
    if (!currentStore) {
      return (
        <PageTemplate title={t('Dashboard')} description={t('Please select a store to view dashboard')} url="/dashboard">
          <div className="text-center py-12">
            <p className="text-gray-500">{t('Please select a store to view dashboard')}</p>
          </div>
        </PageTemplate>
      );
    }

    return (
      <PageTemplate 
        title={t('Dashboard')}
        description={t('Store dashboard and analytics')}
        url="/dashboard"
        actions={pageActions}
      >
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Orders')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.orders?.toLocaleString() || 0}</div>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{currentStore.name}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Products')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.products?.toLocaleString() || 0}</div>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{t('Active products')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Customers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.customers?.toLocaleString() || 0}</div>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{t('Registered customers')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData.metrics.revenue || 0)}</div>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{t('All time revenue')}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('Recent Orders')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <Link 
                          href={route('orders.show', order.id)} 
                          className="font-medium hover:underline"
                          style={{ color: getThemeColorValue() }}
                        >
                          {order.order_number}
                        </Link>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.amount)}</p>
                        <p className="text-sm text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('Top Products')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topProducts?.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <Link 
                          href={route('products.show', product.id)} 
                          className="font-medium hover:underline"
                          style={{ color: getThemeColorValue() }}
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{product.sold} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  {t('Store QR Code')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCode value={currentStore?.qr_code_url || storeUrl} size={120} />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">{currentStore.name}</p>
                    <p className="text-xs text-muted-foreground">{t('Scan to visit store')}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? t('Copied!') : t('Copy Link')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTemplate>
    );
  };

  return (
    <ResponsiveWrapper
      mobileComponent={renderMobileDashboard()}
      desktopComponent={renderDesktopDashboard()}
    />
  );
}