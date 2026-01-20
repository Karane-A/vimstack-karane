import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import {
  LayoutGrid,
  Building2,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowRight,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  Briefcase,
  ShieldCheck,
  CreditCard,
  PieChart,
  BarChart3,
  ExternalLink,
  Copy,
  Download,
  Check,
  PlusCircle,
  Tag,
  LifeBuoy,
  Target
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/metric-card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/helpers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Props {
  dashboardData: any;
  currentStore?: any;
  storeUrl?: string;
  isSuperAdmin: boolean;
}

export default function Dashboard({ dashboardData, currentStore, storeUrl, isSuperAdmin }: Props) {
  const { t } = useTranslation();
  const { auth } = usePage().props as any;
  const user = auth?.user;

  const [greeting, setGreeting] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('Good Morning'));
    else if (hour < 18) setGreeting(t('Good Afternoon'));
    else setGreeting(t('Good Evening'));
  }, [t]);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="animate-spin text-primary" />
      </div>
    );
  }

  const metrics = dashboardData.metrics || {};

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

  const downloadQRCode = () => {
    const svg = document.querySelector("#qr-code-svg") as SVGGraphicsElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const padding = 40;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${currentStore?.name || 'store'}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // --- Render Superadmin View ---
  if (isSuperAdmin) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 bg-slate-50/30 min-h-screen">
        <Head title={t('Superadmin Command Center')} />

        {/* --- Header & Quick Stats --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {greeting}, <span className="text-primary">{user?.name?.split(' ')[0] || 'Admin'}</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl font-bold bg-white text-slate-600 border-slate-200" onClick={() => router.visit(route('superadmin.metrics'))}>
              <BarChart3 size={16} className="mr-2" />
              {t('Full Analytics')}
            </Button>
            <Button size="sm" className="rounded-xl font-bold gap-2 bg-primary" onClick={() => router.visit(route('support.index'))}>
              <LifeBuoy size={16} />
              {t('Support Center')}
            </Button>
          </div>
        </div>

        {/* --- Action Items Banner (High Urgency) --- */}
        {(metrics.approvalQueue > 0 || dashboardData.pendingSupportTickets > 0) && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-32 bg-primary/5 -skew-x-[20deg] translate-x-16"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap size={24} className="text-primary animate-pulse" />
              </div>
              <div>
                <p className="text-base font-bold text-primary leading-tight">{t('Attention Required')}</p>
                <p className="text-sm text-slate-600 font-medium opacity-90">
                  {metrics.approvalQueue || 0} {t('plan requests')} & {dashboardData.pendingSupportTickets || 0} {t('support tickets')} {t('waiting for action.')}
                </p>
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              className="bg-primary text-white rounded-xl font-bold relative z-10 w-full md:w-auto"
              onClick={() => router.visit(route('plan-orders.index'))}
            >
              {t('Review All Items')}
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        )}

        {/* --- Primary Metrics Grid (MetricCard) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <MetricCard
            title={t('Total Revenue')}
            value={formatCurrency(metrics.totalRevenue || 0)}
            icon={DollarSign}
            description={t('Lifetime platform earnings')}
          />
          <MetricCard
            title={t('Monthly Revenue')}
            value={formatCurrency(metrics.monthlyRevenue || 0)}
            icon={TrendingUp}
            trend={{
              value: `${metrics.monthlyGrowth || 0}%`,
              isUp: (metrics.monthlyGrowth || 0) >= 0
            }}
          />
          <MetricCard
            title={t('Total Companies')}
            value={(metrics.totalCompanies || 0).toLocaleString()}
            icon={Building2}
            description={t('Registered entities')}
          />
          <MetricCard
            title={t('Active Plans')}
            value={(metrics.activePlans || 0).toLocaleString()}
            icon={ShieldCheck}
            description={t('Subscriptions in use')}
          />
        </div>

        {/* --- Secondary Metrics Grid (Support & Requests) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div onClick={() => router.visit(route('support.index'))} className="cursor-pointer">
            <MetricCard
              title={t('Support Tickets')}
              value={(dashboardData.pendingSupportTickets || 0).toLocaleString()}
              icon={LifeBuoy}
              description={t('Open tickets')}
            />
          </div>
          <div onClick={() => router.visit(route('support.index'))} className="cursor-pointer">
            <MetricCard
              title={t('Critical Tickets')}
              value={(dashboardData.criticalSupportTickets?.length || 0).toLocaleString()}
              icon={AlertCircle}
              description={t('High priority')}
            />
          </div>
          <div onClick={() => router.visit(route('plan-orders.index'))} className="cursor-pointer">
            <MetricCard
              title={t('Plan Requests')}
              value={(metrics.approvalQueue || 0).toLocaleString()}
              icon={Package}
              description={t('Pending approval')}
            />
          </div>
        </div>

        {/* --- Secondary Grid: Chart + Platform Pulse --- */}
        <div className="grid grid-cols-12 gap-6">
          {/* Revenue Performance (Tesla-style styled bars) */}
          <Card className="col-span-12 lg:col-span-8 rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col">
            <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">{t('Performance pulse')}</CardTitle>
                <CardDescription className="text-xs">{t('Visual revenue trends and capacity tracking.')}</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('Live Monitor')}</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 flex-1 flex items-end gap-2 justify-between pt-10 min-h-[300px]">
              {(() => {
                const revenueData = dashboardData.monthlyRevenueBreakdown || [];
                const maxRevenue = Math.max(...revenueData.map((m: any) => m.revenue), 1);

                return revenueData.map((monthData: any, i: number) => {
                  const heightPercent = maxRevenue > 0 ? (monthData.revenue / maxRevenue) * 100 : 0;

                  return (
                    <div key={i} className="flex-1 bg-primary/80 rounded-t-sm group relative hover:bg-primary transition-colors" style={{ height: `${Math.max(heightPercent, 2)}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl">
                        {monthData.month}: {formatCurrency(monthData.revenue)}
                      </div>
                    </div>
                  );
                });
              })()}
            </CardContent>
            <div className="px-6 pb-6 mt-auto flex justify-between border-t border-slate-50 pt-4">
              {(dashboardData.monthlyRevenueBreakdown || []).map((m: any, idx: number) => (
                <span key={idx} className="text-[10px] font-bold text-slate-300">{m.month.toUpperCase()}</span>
              ))}
            </div>
          </Card>

          {/* Platform Health & Quick Actions (Capacity) */}
          <Card className="col-span-12 lg:col-span-4 rounded-2xl border-slate-100 shadow-sm bg-white p-6 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{t('Platform Health')}</h3>
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase">
                    <span className="text-slate-400">{t('User Population')}</span>
                    <span className="text-slate-900">{dashboardData.systemStats?.totalUsers || 0} / 5,000</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (dashboardData.systemStats?.totalUsers || 0) / 50)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase">
                    <span className="text-slate-400">{t('System Utilization')}</span>
                    <span className="text-slate-900">{dashboardData.systemStats?.planUtilization || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${dashboardData.systemStats?.planUtilization || 0}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('Avg Stores/Co')}</p>
                    <p className="text-xl font-bold text-slate-900">{dashboardData.systemStats?.avgMerchantsPerStore || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('Active Stores')}</p>
                    <p className="text-xl font-bold text-slate-900">{dashboardData.systemStats?.activeStores || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <Button variant="ghost" className="w-full justify-between group hover:bg-primary/5 text-primary font-bold rounded-xl" onClick={() => router.visit(route('superadmin.metrics'))}>
                {t('Deep Dive Capacity')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>

        {/* --- Activity & Support radar (Streams) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Stream */}
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col">
            <CardHeader className="p-6 border-b border-slate-50 flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                {t('Activity stream')}
              </CardTitle>
              <Button variant="ghost" size="sm" className="font-bold text-xs" onClick={() => router.visit(route('plan-orders.index'))}>
                {t('View Logs')}
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-slate-50">
                {(dashboardData.recentOrders || []).slice(0, 5).map((order: any, idx: number) => (
                  <div key={idx} className="p-4 md:px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 text-xs font-bold border border-slate-200 shrink-0">
                        {order.company ? order.company[0] : '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{order.company || t('Entity')}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{order.plan}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(order.amount)}</p>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                        order.status?.toLowerCase() === 'approved' ? "text-emerald-500 bg-emerald-50" : "text-amber-500 bg-amber-50"
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support Radar */}
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col">
            <CardHeader className="p-6 border-b border-slate-50 flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <LifeBuoy size={20} className="text-primary" />
                {t('Support Radar')}
              </CardTitle>
              <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                {dashboardData.pendingSupportTickets || 0} {t('Pending')}
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-slate-50">
                {(dashboardData.criticalSupportTickets || []).length > 0 ? (
                  dashboardData.criticalSupportTickets.map((ticket: any, idx: number) => (
                    <div key={idx} className="p-4 md:px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => router.visit(route('support.show', ticket.id))}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <AlertCircle size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{ticket.subject}</p>
                          <p className="text-[11px] text-slate-400 font-medium truncate">{ticket.company}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 size={32} className="text-primary/20 mb-3" />
                    <p className="text-sm font-bold text-slate-900">{t('Safe Operations')}</p>
                    <p className="text-xs text-slate-400">{t('No critical support events.')}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
              <Button variant="ghost" size="sm" className="text-[11px] font-bold text-primary uppercase tracking-widest hover:bg-primary/5" onClick={() => router.visit(route('support.index'))}>
                {t('Open Support Portal')}
              </Button>
            </div>
          </Card>
        </div>

        {/* --- Quick Actions (Bottom Operatons) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: Building2, label: t('Companies'), route: 'companies.index' },
            { icon: Package, label: t('Plans'), route: 'plans.index' },
            { icon: Tag, label: t('Coupons'), route: 'coupon-system.index' },
            { icon: BarChart3, label: t('Analytics'), route: 'superadmin.metrics' },
            { icon: Users, label: t('Direct Users'), route: 'users.index' },
            { icon: Activity, label: t('Sys Logs'), route: 'plan-orders.index' },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => router.visit(route(action.route))}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                <action.icon size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-primary transition-colors whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Render Vendor View ---
  return (
    <div className="p-8 pb-24 space-y-10 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <Head title={t('Dashboard')} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {greeting}, {user?.name?.split(' ')[0] || t('Friend')}! 👋
          </h1>
          <p className="text-slate-500 font-medium">{t("Here's what's happening with your store today.")}</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={currentStore?.url || storeUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 flex items-center gap-2.5 px-6 rounded-xl bg-white border border-slate-100 text-slate-900 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all w-fit"
          >
            <ExternalLink size={18} className="text-primary" />
            {t('Visit Store')}
          </a>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('Total Revenue')}
          value={formatCurrency(metrics.revenue || 0)}
          icon={DollarSign}
          description={t('Lifetime earnings')}
        />
        <MetricCard
          title={t('Monthly Revenue')}
          value={formatCurrency(metrics.monthlyRevenue || 0)}
          icon={TrendingUp}
          trend={{
            value: `${metrics.monthlyGrowth || 0}%`,
            isUp: (metrics.monthlyGrowth || 0) >= 0
          }}
        />
        <MetricCard
          title={t('Avg Order Value')}
          value={formatCurrency(metrics.avgOrderValue || 0)}
          icon={ShoppingCart}
          description={t('Per transaction')}
        />
        <MetricCard
          title={t('Conversion Rate')}
          value={`${metrics.conversionRate || 0}%`}
          icon={Target}
          description={t('Orders / Customers')}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('Total Orders')}
          value={(metrics.orders || 0).toLocaleString()}
          icon={Package}
        />
        <MetricCard
          title={t('Active Products')}
          value={(metrics.activeProducts || 0).toLocaleString()}
          icon={Sparkles}
          description={t('Sold in last 30 days')}
        />
        <MetricCard
          title={t('Total Customers')}
          value={(metrics.customers || 0).toLocaleString()}
          icon={Users}
        />
        <MetricCard
          title={t('Repeat Rate')}
          value={`${metrics.repeatRate || 0}%`}
          icon={Activity}
          description={t('2+ purchases')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2 rounded-2xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-900">{t('Revenue Trend')}</CardTitle>
            <CardDescription className="text-xs">{t('Last 6 months performance')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 flex-1 flex items-end gap-2 justify-between pt-10 min-h-[300px]">
            {(() => {
              const revenueData = dashboardData.monthlyRevenueBreakdown || [];
              const maxRevenue = Math.max(...revenueData.map((m: any) => m.revenue), 1);

              return revenueData.map((monthData: any, i: number) => {
                const heightPercent = maxRevenue > 0 ? (monthData.revenue / maxRevenue) * 100 : 0;

                return (
                  <div key={i} className="flex-1 bg-primary/80 rounded-t-sm group relative hover:bg-primary transition-colors" style={{ height: `${Math.max(heightPercent, 2)}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl">
                      {monthData.month}: {formatCurrency(monthData.revenue)}
                    </div>
                  </div>
                );
              });
            })()}
          </CardContent>
          <div className="px-6 pb-6 mt-auto flex justify-between border-t border-slate-50 pt-4">
            {(dashboardData.monthlyRevenueBreakdown || []).map((m: any, idx: number) => (
              <span key={idx} className="text-[10px] font-bold text-slate-300">{m.month.toUpperCase()}</span>
            ))}
          </div>
        </Card>

        <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-lg font-bold">{t('Top Products')}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {(dashboardData.topProducts || []).slice(0, 4).map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-bold border border-slate-100">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.sold || 0} {t('Units')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">{formatCurrency(item.price || 0)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{t('Recent Orders')}</h3>
          <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 font-bold" onClick={() => router.visit(route('orders.index'))}>
            {t('View All')}
          </Button>
        </div>
        <DataTable
          columns={[
            {
              key: 'order_number',
              header: t('Order ID'),
              render: (order) => <span className="font-bold text-slate-900">#{order.order_number || order.id}</span>
            },
            {
              key: 'customer',
              header: t('Customer'),
              render: (order) => <span className="font-medium text-slate-600">{order.customer || 'N/A'}</span>
            },
            {
              key: 'amount',
              header: t('Amount'),
              render: (order) => <span className="font-bold text-slate-900">{formatCurrency(order.amount)}</span>
            },
            {
              key: 'status',
              header: t('Status'),
              render: (order) => (
                <div className={cn(
                  "ds-stat-pill",
                  order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'approved' ? "bg-emerald-100 text-emerald-700" :
                    order.status?.toLowerCase() === 'pending' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                )}>
                  {order.status}
                </div>
              )
            },
            {
              key: 'date',
              header: t('Date'),
              render: (order) => <span className="text-slate-500 text-xs">{order.date || 'Today'}</span>
            }
          ]}
          data={dashboardData.recentOrders || []}
          keyExtractor={(item: any) => item.id}
        />
      </div>

      {/* QR Code & Support Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Section */}
        <div className="bg-slate-900 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="flex-1 z-10 space-y-6">
            <h3 className="text-3xl font-bold tracking-tight">{t('Expand Your Reach')}</h3>
            <p className="text-slate-400 font-medium max-w-sm">
              {t('Deploy your store URL anywhere. Professional, responsive, and ready for high-volume commerce.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button onClick={copyToClipboard} className="bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-2xl h-12 w-full sm:w-auto gap-2">
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? t('Copied') : t('Copy Store Link')}
              </Button>
              <Button variant="outline" onClick={downloadQRCode} className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold px-8 rounded-2xl h-12 w-full sm:w-auto gap-2">
                <Download size={18} />
                {t('Download QR')}
              </Button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-2xl z-10 relative">
            <QRCode id="qr-code-svg" value={currentStore?.qr_code_url || storeUrl || ''} size={140} fgColor="#0F172A" />
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-8 h-full text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight">{t('Need Expert Advice?')}</h2>
              <p className="text-indigo-200 font-medium max-w-md mx-auto">
                {t('Our dedicated support team is here to help you grow your business. Submit a ticket for any technical or billing issues.')}
              </p>
            </div>
            <Button
              onClick={() => router.visit(route('support.index'))}
              className="bg-white text-indigo-900 hover:bg-slate-100 rounded-2xl h-14 px-10 font-black shadow-xl transition-all hover:scale-105"
            >
              <LifeBuoy className="mr-3" size={24} />
              {t('Contact Support')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;