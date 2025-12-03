import React from 'react';
import PerfumeProductCard from './PerfumeProductCard';
import { usePage } from '@inertiajs/react';

interface PerfumeFeaturedProductsSectionProps {
  products?: any[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function PerfumeFeaturedProductsSection({ 
  products = [], 
  content, 
  storeSettings, 
  currencies 
}: PerfumeFeaturedProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'perfume-store';
  
  return (
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-px bg-amber-400"></div>
            <div className="mx-6">
              <svg className="w-8 h-8 text-purple-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="w-16 h-px bg-amber-400"></div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
            {content?.title || 'Signature Selections'}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            {content?.description || 'Handpicked by our fragrance experts - the most coveted scents that define luxury and sophistication in the world of perfumery.'}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <PerfumeProductCard
                key={product.id}
                product={product}
                storeSettings={storeSettings}
                currencies={currencies}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-4">No Featured Products Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Our curated selection of signature fragrances will be available soon. 
              Check back for our expertly chosen collection.
            </p>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="relative mt-20">
          <div className="absolute left-1/4 top-0 w-32 h-32 bg-purple-100/30 rounded-full blur-3xl"></div>
          <div className="absolute right-1/4 top-0 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl"></div>
          
          {/* Bottom CTA */}
          <div className="text-center relative z-10">
            <a
              href={route('store.products', storeSlug)}
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-purple-200 rounded-full hover:border-purple-300 transition-colors duration-300 group"
            >
              <span className="text-purple-800 font-medium mr-3">Discover More Fragrances</span>
              <svg className="w-5 h-5 text-purple-800 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}