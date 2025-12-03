import React from 'react';
import { FashionProductCard } from './';
import { usePage } from '@inertiajs/react';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image?: string;
  slug: string;
  href?: string;
}

interface FashionTrendingProductsSectionProps {
  products?: Product[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function FashionTrendingProductsSection({ products = [], content, storeSettings = {}, currencies = [] }: FashionTrendingProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'fashion-boutique';
  
  const enhancedProducts = products.slice(0, 6).map(product => ({
    ...product,
    href: product.href || route('store.product', { storeSlug, id: product.id })
  }));

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-thin mb-6 tracking-wide text-black">
            {content?.title || 'Trending Now'}
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg leading-relaxed">
            {content?.description || 'The hottest pieces everyone\'s talking about - from runway to street style.'}
          </p>
        </div>
        
        {enhancedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {enhancedProducts.map((product) => (
              <FashionProductCard key={product.id} product={product} storeSettings={storeSettings} currencies={currencies} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 font-light">No trending products available.</p>
          </div>
        )}
      </div>
    </section>
  );
}