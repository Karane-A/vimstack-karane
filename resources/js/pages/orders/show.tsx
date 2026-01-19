import React from 'react';
import { ArrowLeft, Edit, Package, User, CreditCard, Truck, MapPin, Calendar, Clock, Download, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { router, Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/utils/helpers';
import { usePermissions } from '@/hooks/usePermissions';
import { getImageUrl } from '@/utils/image-helper';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

interface OrderShowProps {
  order: {
    id: number;
    orderNumber: string;
    date: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    items: Array<{
      id: number;
      name: string;
      sku: string;
      quantity: number;
      price: number;
      image: string;
    }>;
    summary: {
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
    };
    shippingMethod: string;
    trackingNumber?: string;
    timeline?: Array<{
      status: string;
      date?: string;
      completed: boolean;
    }>;
  };
}

export default function ShowOrder({ order }: OrderShowProps) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto pb-20">
      <Head title={t('Order Details')} />

      {/* Back & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={route('orders.index')}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('Order #{{number}}', { number: order.orderNumber })}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <Calendar size={14} />
              <span>{order.date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-10 border-slate-200 text-slate-600">
            <Download className="h-4 w-4 mr-2" /> {t('Invoice')}
          </Button>
          {hasPermission('edit-orders') && (
            <Button variant="default" className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={() => router.visit(route('orders.edit', order.id))}>
              <Edit className="h-4 w-4 mr-2" /> {t('Edit Order')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content: Items & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">{t('Order Items')}</h3>
              </div>
              <span className="text-sm font-bold text-slate-500">{order.items.length} {t('Items')}</span>
            </div>
            <div>
              {order.items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 p-6 hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                    <img
                      src={item.image ? getImageUrl(item.image) : '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-bold tracking-tight mt-0.5">SKU: {item.sku}</p>
                    <p className="text-xs text-slate-500 mt-1">{t('Quantity: {{quantity}}', { quantity: item.quantity })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {t('Total: {{total}}', { total: formatCurrency(item.price * item.quantity) })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">{t('Order Timeline')}</h3>
            </div>
            <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-slate-100">
              {order.timeline?.map((event, index) => (
                <div key={index} className="relative pl-10">
                  <div className={cn(
                    "absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center z-10",
                    event.completed ? "bg-indigo-600 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]" : "bg-slate-200"
                  )}>
                    {event.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={cn("text-sm font-bold", event.completed ? "text-slate-900" : "text-slate-400")}>
                      {t(event.status)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{event.date || t('Pending')}</p>
                  </div>
                </div>
              )) || (
                  <div className="py-10 text-center">
                    <p className="text-slate-400 text-sm">{t('No timeline data available')}</p>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Side Column: Summary & Info */}
        <div className="space-y-8">
          {/* Status & Payment */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">{t('Order Status')}</span>
              <StatusBadge status={order.status} />
            </div>
            <Separator className="bg-slate-50" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">{t('Payment')}</span>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <div className="pt-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t('Method')}</p>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard size={14} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-600">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">{t('Customer')}</h3>
              <User className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                {order.customer.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{order.customer.name}</p>
                <p className="text-xs text-slate-500">{order.customer.email}</p>
              </div>
            </div>
            {order.customer.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Truck size={12} className="text-slate-400" />
                {order.customer.phone}
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">{t('Shipping')}</h3>
              <MapPin className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-900">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p className="font-bold mt-1">{order.shippingAddress.country}</p>
            </div>
            <Separator className="bg-slate-50" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t('Method')}</p>
              <p className="text-sm font-bold text-slate-600 mt-1">{order.shippingMethod}</p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-indigo-600 rounded-[24px] p-8 shadow-lg shadow-indigo-200 text-white space-y-4">
            <h3 className="font-bold text-indigo-100 text-sm tracking-widest uppercase">{t('Order Summary')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm opacity-80">
                <span>{t('Subtotal')}</span>
                <span>{formatCurrency(order.summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm opacity-80">
                <span>{t('Shipping')}</span>
                <span>{formatCurrency(order.summary.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm opacity-80">
                <span>{t('Tax')}</span>
                <span>{formatCurrency(order.summary.tax)}</span>
              </div>
              {order.summary.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-300">
                  <span>{t('Discount')}</span>
                  <span>-{formatCurrency(order.summary.discount)}</span>
                </div>
              )}
            </div>
            <Separator className="bg-white/20" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{t('Total')}</span>
              <span className="font-black text-2xl">{formatCurrency(order.summary.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ShowOrder.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;