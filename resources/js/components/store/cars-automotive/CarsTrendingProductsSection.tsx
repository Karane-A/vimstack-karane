import React from 'react';
import CarsProductCard from './CarsProductCard';
import { TrendingUp, ChevronRight } from 'lucide-react';
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

interface TrendingContent {
  title?: { value: string };
  description?: { value: string };
}

interface CarsTrendingProductsSectionProps {
  products: Product[];
  content?: TrendingContent;
  storeSettings?: any;
  currencies?: any[];
  stats?: any;
  designProcess?: any;
}

export default function CarsTrendingProductsSection({ 
  products, 
  content, 
  storeSettings = {}, 
  currencies = [] 
}: CarsTrendingProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'cars-store';
  const trendingContent = content || {};

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-black">
              {trendingContent.title || 'Hot Sellers'}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {trendingContent.description || 'The most popular automotive parts that enthusiasts are buying right now.'}
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
                <TrendingUp className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">No Trending Products</h3>
              <p className="text-gray-400">Trending products will appear here once they are added.</p>
            </div>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <a
              href={route('store.products', storeSlug)}
              className="inline-flex items-center px-8 py-4 bg-black hover:bg-red-600 text-white font-bold tracking-wider uppercase transition-colors"
            >
              View All Trending
              <ChevronRight className="h-5 w-5 ml-2" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}