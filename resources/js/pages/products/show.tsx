import React, { useState } from 'react';
import { ArrowLeft, Edit, Star, Package, DollarSign, Eye, ChevronLeft, ShoppingCart, Tag, Info, Layers, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { router, usePage, Head, Link } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/helpers';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function ShowProduct() {
  const { t } = useTranslation();
  const { product, stats } = usePage().props as any;
  const [activeImage, setActiveImage] = useState(product.cover_image || null);

  // Parse product images
  const productImages = product.images ? product.images.split(',').filter(Boolean) : [];
  const allImages = [product.cover_image, ...productImages].filter(Boolean);

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto pb-24">
      <Head title={t('Product Details')} />

      {/* Back & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={route('products.index')}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('SKU')}: {product.sku || '-'}</p>
              <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
              {product.stock <= 0 && <StatusBadge status="out_of_stock" />}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 font-bold px-6" onClick={() => router.visit(route('products.edit', product.id))}>
            <Edit className="h-4 w-4 mr-2" /> {t('Edit Product')}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Images & Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative group">
              <img
                src={activeImage ? getImageUrl(activeImage) : '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-6 gap-3 mt-4">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-white",
                      activeImage === img ? "border-indigo-600 shadow-md scale-105" : "border-slate-50 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="space-y-8">
            {product.description && (
              <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Info className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">{t('Description')}</h3>
                </div>
                <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:font-bold prose-strong:text-slate-900" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {(product.specifications || product.details) && (
              <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">{t('Product Specifications')}</h3>
                </div>
                {product.specifications && (
                  <div className="prose prose-slate max-w-none mb-8" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                )}
                {product.details && (
                  <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: product.details }} />
                )}
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-sm">{t('Variants & Options')}</h3>
                <div className="space-y-6">
                  {product.variants.map((variant: any, index: number) => (
                    <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-3 text-sm">{variant.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {variant.values.map((value: string, vIdx: number) => (
                          <span key={vIdx} className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Pricing & Stats */}
        <div className="space-y-8">
          {/* Price Section */}
          <div className="bg-indigo-600 rounded-[32px] p-8 shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Tag size={120} />
            </div>
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-2">{t('Current Pricing')}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black">{formatCurrency(product.sale_price || product.price)}</h2>
              {product.sale_price && (
                <span className="text-indigo-300 line-through font-bold">{formatCurrency(product.price)}</span>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
              <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                <span className="text-sm font-bold text-indigo-50">{t('Stock Level')}</span>
                <span className={cn(
                  "text-xl font-black",
                  product.stock <= 5 ? "text-amber-300" : "text-white"
                )}>{product.stock}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('Revenue')}</p>
              <p className="text-lg font-black text-slate-900">{formatCurrency(stats.revenue || 0)}</p>
            </div>
            <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('Total Sold')}</p>
              <p className="text-lg font-black text-slate-900">{stats.total_sold || 0}</p>
            </div>
          </div>

          {/* Product Context */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">{t('Context Details')}</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center group">
                <span className="text-sm text-slate-500 font-bold">{t('Category')}</span>
                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.category?.name || '-'}</span>
              </div>
              <Separator className="bg-slate-50" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-bold">{t('Tax Class')}</span>
                <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{product.tax?.name || '-'}</span>
              </div>
              <Separator className="bg-slate-50" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-bold">{t('Downloadable')}</span>
                <span className={cn(
                  "text-xs font-black px-3 py-1 rounded-full uppercase",
                  product.is_downloadable ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400"
                )}>{product.is_downloadable ? t('Yes') : t('No')}</span>
              </div>
              {product.downloadable_file && (
                <div className="pt-2">
                  <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1">{t('File Path')}</p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-500 truncate">
                    {product.downloadable_file}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="p-4 bg-slate-50 rounded-[24px] border border-slate-100 space-y-2">
            <div className="flex justify-between opacity-50">
              <span className="text-[10px] font-bold uppercase">{t('Created')}</span>
              <span className="text-[10px] font-bold">{new Date(product.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between opacity-50">
              <span className="text-[10px] font-bold uppercase">{t('Updated')}</span>
              <span className="text-[10px] font-bold">{new Date(product.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ShowProduct.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;
