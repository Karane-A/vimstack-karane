import React from 'react';
import CarsProductCard from './CarsProductCard';
import { ChevronRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image?: string;
  stock: number;
  is_active: boolean;
  variants?: any;
  category?: {
    name: string;
  };
}

interface FeaturedContent {
  title?: { value: string };
  description?: { value: string };
}

interface CarsFeaturedProductsSectionProps {
  products: Product[];
  content?: FeaturedContent;
  storeSettings?: any;
  currencies?: any[];
}

export default function CarsFeaturedProductsSection({ 
  products, 
  content, 
  storeSettings = {}, 
  currencies = [] 
}: CarsFeaturedProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'cars-store';
  const featuredContent = content || {};

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 tracking-tight">
            {featuredContent.title || 'Performance Picks'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {featuredContent.description || 'Hand-selected by our automotive experts.'}
          </p>
          
          {/* Red accent line */}
          <div className="w-24 h-1 bg-red-600 mx-auto mt-8"></div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <CarsProductCard
                key={product.id}
                product={product}
                storeSettings={storeSettings}
                currencies={currencies}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l3-3 3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">No Featured Products</h3>
              <p className="text-gray-400">Featured products will appear here once they are added.</p>
            </div>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <a
              href={route('store.products', storeSlug)}
              className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-black text-white font-bold tracking-wider uppercase transition-colors"
            >
              View All Products
              <ChevronRight className="h-5 w-5 ml-2" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}