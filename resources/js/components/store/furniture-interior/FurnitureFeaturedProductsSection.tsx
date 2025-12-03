import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import FurnitureProductCard from './FurnitureProductCard';

interface FurnitureFeaturedProductsSectionProps {
  products?: any[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

const FurnitureFeaturedProductsSection: React.FC<FurnitureFeaturedProductsSectionProps> = ({ 
  products = [], 
  content, 
  storeSettings, 
  currencies 
}) => {
  const { props } = usePage();
  const store = props.store || {};
  const storeSlug = props.store?.slug || 'furniture-store';
  
  return (
    <section className="py-20 lg:py-28 bg-amber-50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 bg-amber-100 border-2 border-amber-300 px-6 py-3 rounded-full mb-6 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <span className="text-sm font-bold text-amber-800 tracking-wider uppercase">Featured Collection</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content?.title || 'Designer Favorites'}
          </h2>
          <p className="text-lg lg:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
            {content?.description || 'Handpicked wooden furniture pieces by our interior design experts - the statement pieces that define contemporary living spaces.'}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <FurnitureProductCard
                key={product.id}
                product={product}
                storeSettings={storeSettings}
                currencies={currencies}
              />
            ))}
          </div>
        ) : (
          // Placeholder products when no data
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-yellow-200">
                <div className="aspect-square bg-yellow-100 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-yellow-700 text-sm font-semibold">Featured Product {index + 1}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-yellow-200 rounded mb-2"></div>
                  <div className="h-6 bg-yellow-200 rounded mb-4"></div>
                  <div className="h-4 bg-yellow-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-yellow-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-16">
          <a
            href={route('store.products', storeSlug)}
            className="inline-flex items-center gap-3 bg-yellow-800 text-white px-12 py-5 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 group shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
          >
            <span>View All Products</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FurnitureFeaturedProductsSection;