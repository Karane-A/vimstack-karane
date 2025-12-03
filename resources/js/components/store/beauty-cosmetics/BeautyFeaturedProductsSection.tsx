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
  is_featured?: boolean;
  category?: {
    name: string;
  };
}

interface BeautyFeaturedProductsSectionProps {
  products?: Product[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function BeautyFeaturedProductsSection({ products = [], content, storeSettings = {}, currencies = [] }: BeautyFeaturedProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'beauty-store';
  
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            {content?.title || 'Beauty Essentials'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'Handpicked by beauty experts - the must-have products that deliver results.'}
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <BeautyProductCard key={product.id} product={product} storeSettings={storeSettings} currencies={currencies} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No featured products available</p>
          </div>
        )}

        {/* View All Button */}
        {featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <a 
              href={route('store.products', storeSlug)} 
              className="inline-flex items-center px-8 py-4 bg-white text-rose-600 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-rose-600 hover:text-white transition-all duration-300"
            >
              <span>View All Products</span>
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}