import React, { useState } from 'react';
import { type PageAction } from '@/components/page-template';
import { RefreshCw, BarChart3, Download, Building2, ShoppingCart, Users, DollarSign, Package, TrendingUp, QrCode, Copy, Check, CreditCard, FileText, Tag, Activity, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Head, Link, router, usePage } from '@inertiajs/react';
import QRCode from 'react-qr-code';

import { formatCurrency } from '@/utils/helpers';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { MetricCard } from '@/components/ui/metric-card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';


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
  const user = auth?.user;

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
      // Set canvas size (with padding)
      const padding = 40;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;

      if (ctx) {
        // Draw white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw SVG image
        ctx.drawImage(img, padding, padding);

        // Export as PNG
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${currentStore?.name || 'store'}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!currentStore && !isSuperAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center space-y-6">
        <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
          <Package size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{t('No Store Selected')}</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">{t('Please select a store from the sidebar to view your analytics.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto pb-20">
      <Head title={isSuperAdmin ? t('Admin Dashboard') : t('Dashboard')} />

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {t('Welcome back')}, {user?.name || 'Admin'}! 👋
          </h1>
          <p className="text-slate-500 font-medium">{t("Here's what's happening with your store today.")}</p>
        </div>

        {!isSuperAdmin && (
          <a
            href={currentStore?.url || storeUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 flex items-center gap-2.5 px-6 rounded-xl bg-white border border-slate-100 text-slate-900 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all w-fit"
          >
            <ExternalLink size={18} className="text-indigo-600" />
            {t('Visit Store')}
          </a>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('Total Revenue')}
          value={formatCurrency(isSuperAdmin ? (dashboardData.metrics.totalRevenue || 0) : (dashboardData.metrics.revenue || 0))}
          icon={DollarSign}
          trend={{ value: '12.5%', isUp: true, label: t('from last month') }}
        />
        <MetricCard
          title={t('Total Orders')}
          value={(dashboardData.metrics.orders || dashboardData.metrics.totalOrders || 0).toLocaleString()}
          icon={ShoppingCart}
          trend={{ value: '8.2%', isUp: true, label: t('from last month') }}
        />
        <MetricCard
          title={t('Total Customers')}
          value={(dashboardData.metrics.customers || 0).toLocaleString()}
          icon={Users}
          trend={{ value: '3.1%', isUp: false, label: t('from last month') }}
        />
        <MetricCard
          title={t('Total Products')}
          value={(dashboardData.metrics.products || 0).toLocaleString()}
          icon={Package}
          trend={{ value: '15.3%', isUp: true, label: t('from last month') }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">{t('Sales Overview')}</h3>
          </div>
          <div className="h-[300px] w-full bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
              <TrendingUp className="text-indigo-400 h-8 w-8" />
            </div>
            <p className="text-slate-500 font-medium text-sm">{t('Sales visualization will appear here.')}</p>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">{t('Top Products')}</h3>
          </div>
          <div className="space-y-6">
            {(dashboardData.topProducts || dashboardData.topPlans || []).slice(0, 4).map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-bold border border-slate-100">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.sold || item.orders || 0} {t('Units')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">{formatCurrency(item.price || item.revenue || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{t('Recent Orders')}</h3>
          <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 font-semibold" onClick={() => router.visit(isSuperAdmin ? route('plan-orders.index') : route('orders.index'))}>
            {t('View All')}
          </Button>
        </div>
        <DataTable
          columns={[
            {
              key: 'order_number',
              header: t('Order ID'),
              render: (order) => (
                <span className="font-bold text-slate-900">#{order.order_number || order.id}</span>
              )
            },
            {
              key: 'customer',
              header: t('Customer'),
              render: (order) => (
                <span className="font-medium text-slate-600">{order.customer || order.company || 'N/A'}</span>
              )
            },
            {
              key: 'product',
              header: t('Product'),
              render: (order: any) => (
                <span className="text-slate-600 text-sm">{order.plan || order.description || t('Product Item')}</span>
              )
            },
            {
              key: 'amount',
              header: t('Amount'),
              render: (order: any) => (
                <span className="font-bold text-slate-900">{formatCurrency(order.amount)}</span>
              )
            },
            {
              key: 'status',
              header: t('Status'),
              render: (order: any) => (
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight w-fit",
                  order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'approved' ? "bg-emerald-100 text-emerald-700" :
                    order.status?.toLowerCase() === 'pending' ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                )}>
                  {order.status}
                </div>
              )
            },
            {
              key: 'date',
              header: t('Date'),
              render: (order: any) => (
                <span className="text-slate-500 text-xs">{order.date || order.time || 'Today'}</span>
              )
            }
          ]}
          data={dashboardData.recentOrders}
          keyExtractor={(item: any, _index: number) => item.id}
        />
      </div>

      {/* QR Code Section (Only if vendor view) */}
      {!isSuperAdmin && (
        <div className="bg-slate-900 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="flex-1 z-10 space-y-6">
            <h3 className="text-3xl font-bold tracking-tight">
              {t('Expand Your Reach')}
            </h3>
            <p className="text-slate-400 font-medium max-w-sm">
              {t('Deploy your store URL anywhere. Professional, responsive, and ready for high-volume commerce.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                variant="default"
                onClick={copyToClipboard}
                className="bg-primary hover:bg-primary/90 text-white border-none font-bold px-8 rounded-xl h-12 w-full sm:w-auto gap-2"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? t('Copied') : t('Copy Store Link')}
              </Button>
              <Button
                variant="outline"
                onClick={downloadQRCode}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold px-8 rounded-xl h-12 w-full sm:w-auto gap-2"
              >
                <Download size={18} />
                {t('Download QR')}
              </Button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-2xl z-10 relative">
            <QRCode id="qr-code-svg" value={currentStore?.qr_code_url || storeUrl || ''} size={140} fgColor="#0F172A" />
          </div>
        </div>
      )}
    </div>
  );
}

Dashboard.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;