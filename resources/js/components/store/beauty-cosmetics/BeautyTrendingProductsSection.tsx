import React from 'react';
import BeautyProductCard from './BeautyProductCard';
import { usePage } from '@inertiajs/react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  image?: string;
  images?: string[];
  rating?: number;
  reviews_count?: number;
  is_trending?: boolean;
  category?: {
    name: string;
  };
}

interface BeautyTrendingProductsSectionProps {
  products?: Product[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function BeautyTrendingProductsSection({ products = [], content, storeSettings = {}, currencies = [] }: BeautyTrendingProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'beauty-store';
  
  const trendingProducts = products.slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Trending
          </div>
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            {content?.title || 'Trending Now'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'The most-loved products that beauty enthusiasts can\'t stop talking about.'}
          </p>
        </div>

        {trendingProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product) => (
                <BeautyProductCard key={product.id} product={product} storeSettings={storeSettings} currencies={currencies} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <a 
                href={route('store.products', storeSlug)} 
                className="inline-flex items-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-full hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>View All Trending</span>
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No trending products available</p>
          </div>
        )}
      </div>
    </section>
  );
}