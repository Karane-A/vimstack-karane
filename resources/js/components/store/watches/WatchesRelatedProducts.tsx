import React from 'react';
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

interface WatchesRelatedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  storeSettings?: any;
  currencies?: any[];
}

export default function WatchesRelatedProducts({ 
  products, 
  title = 'Related Timepieces',
  subtitle = 'Discover similar watches that complement your collection',
  storeSettings = {}, 
  currencies = [] 
}: WatchesRelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const storeSlug = window.location.pathname.split('/')[1];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <WatchesProductCard
              key={product.id}
              product={product}
              storeSlug={storeSlug}
              storeSettings={storeSettings}
              currencies={currencies}
            />
          ))}
        </div>
      </div>
    </section>
  );
}