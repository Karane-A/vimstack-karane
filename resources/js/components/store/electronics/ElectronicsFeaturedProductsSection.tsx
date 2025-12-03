import React from 'react';
import ElectronicsProductCard from './ElectronicsProductCard';
import { usePage } from '@inertiajs/react';

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

interface ElectronicsFeaturedProductsSectionProps {
  products: Product[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function ElectronicsFeaturedProductsSection({ products, content, storeSettings = {}, currencies = [] }: ElectronicsFeaturedProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'electronics-store';
  
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {content?.title || 'Featured Electronics'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content?.description || 'Handpicked premium electronics and gadgets that deliver exceptional performance and value.'}
          </p>
        </div>

        {/* Products Grid */}
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

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <a
            href={route('store.products', storeSlug)}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>View All Products</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>


      </div>
    </section>
  );
}