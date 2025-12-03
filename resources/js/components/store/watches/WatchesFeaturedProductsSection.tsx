import React from 'react';
import { usePage } from '@inertiajs/react';
import WatchesProductCard from './WatchesProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image?: string;
  slug: string;
  stock: number;
  is_active: boolean;
  variants?: any;
  category?: {
    name: string;
  };
}

interface WatchesFeaturedProductsSectionProps {
  products: Product[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function WatchesFeaturedProductsSection({ 
  products, 
  content, 
  storeSettings = {}, 
  currencies = [] 
}: WatchesFeaturedProductsSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const { props } = usePage();
  const storeSlug = props.store?.slug || 'watches';

  return (
    <section className="relative py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-slate-900 mb-6 tracking-tight">
            {content?.title || 'Master Collection'}
          </h2>
          <p className="text-lg text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'Handpicked by our horologists - exceptional timepieces that represent the pinnacle of watchmaking excellence.'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => (
            <WatchesProductCard
              key={product.id}
              product={product}
              storeSlug={storeSlug}
              storeSettings={storeSettings}
              currencies={currencies}
            />
          ))}
        </div>

        {/* View All Button */}
        {products.length > 8 && (
          <div className="text-center mt-16">
            <a
              href={route('store.products', storeSlug)}
              className="inline-flex items-center px-10 py-4 bg-slate-900 text-white font-medium tracking-wider uppercase text-sm hover:bg-slate-800 transition-colors duration-300"
            >
              View All Timepieces
              <svg className="w-4 h-4 ml-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/2 w-24 h-px bg-amber-500 opacity-30"></div>
      <div className="absolute right-0 top-1/3 w-16 h-px bg-amber-500 opacity-30"></div>
    </section>
  );
}