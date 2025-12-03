import React from 'react';
import ElectronicsProductCard from './ElectronicsProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image?: string;
  slug: string;
  stock: number;
  is_active: boolean;
  average_rating?: number;
  total_reviews?: number;
}

interface ElectronicsTrendingProductsSectionProps {
  products: Product[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function ElectronicsTrendingProductsSection({ products, content, storeSettings = {}, currencies = [] }: ElectronicsTrendingProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {content?.title || 'Trending Gadgets'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content?.description || 'The hottest electronics and gadgets that tech enthusiasts are talking about right now.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => (
            <ElectronicsProductCard
              key={product.id}
              product={product}
              storeSettings={storeSettings}
              currencies={currencies}
            />
          ))}
        </div>
      </div>
    </section>
  );
}