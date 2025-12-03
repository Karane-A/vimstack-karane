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

interface WatchesTrendingProductsSectionProps {
  products: Product[];
  content?: any;
  stats?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function WatchesTrendingProductsSection({ 
  products, 
  content, 
  stats,
  storeSettings = {}, 
  currencies = [] 
}: WatchesTrendingProductsSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const { props } = usePage();
  const storeSlug = props.store?.slug || 'watches';

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-slate-900 mb-6 tracking-tight">
            {content?.title || 'Trending Timepieces'}
          </h2>
          <p className="text-lg text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'The most sought-after watches by collectors and enthusiasts - from vintage classics to modern innovations.'}
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-light text-slate-900 mb-2">500+</div>
              <div className="text-sm font-medium tracking-wider uppercase text-slate-600">Luxury Brands</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-slate-900 mb-2">50K+</div>
              <div className="text-sm font-medium tracking-wider uppercase text-slate-600">Happy Collectors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-slate-900 mb-2">25+</div>
              <div className="text-sm font-medium tracking-wider uppercase text-slate-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-slate-900 mb-2">100%</div>
              <div className="text-sm font-medium tracking-wider uppercase text-slate-600">Authentic</div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              className="inline-flex items-center px-8 py-3 border-2 border-slate-900 text-slate-900 font-medium tracking-wider uppercase text-sm hover:bg-slate-900 hover:text-white transition-all duration-300"
            >
              View All Timepieces
              <svg className="w-4 h-4 ml-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}