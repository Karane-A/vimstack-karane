import React from 'react';
import { getImageUrl } from '@/utils/image-helper';
import JewelryProductCard from './JewelryProductCard';

interface JewelryTrendingProductsSectionProps {
  products?: any[];
  content?: any;
  stats?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function JewelryTrendingProductsSection({ products = [], content, stats, storeSettings = {}, currencies = [] }: JewelryTrendingProductsSectionProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extralight text-stone-900 mb-6 tracking-tight">
            {content?.title || 'Coveted Now'}
          </h2>
          <p className="text-lg text-stone-600 font-light max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'The most sought-after pieces from our collection - timeless designs that capture the essence of luxury.'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <JewelryProductCard key={product.id} product={product} storeSettings={storeSettings} currencies={currencies} />
          ))}
        </div>

        {/* Trending Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border border-stone-200">
            <div className="text-3xl font-extralight text-amber-700 mb-2">{stats?.stat1_value || '95%'}</div>
            <p className="text-stone-600 font-light text-sm uppercase tracking-wider">{stats?.stat1_label || 'Customer Satisfaction'}</p>
          </div>
          <div className="p-8 border border-stone-200">
            <div className="text-3xl font-extralight text-amber-700 mb-2">{stats?.stat2_value || '24/7'}</div>
            <p className="text-stone-600 font-light text-sm uppercase tracking-wider">{stats?.stat2_label || 'Concierge Service'}</p>
          </div>
          <div className="p-8 border border-stone-200">
            <div className="text-3xl font-extralight text-amber-700 mb-2">{stats?.stat3_value || '∞'}</div>
            <p className="text-stone-600 font-light text-sm uppercase tracking-wider">{stats?.stat3_label || 'Lifetime Warranty'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}