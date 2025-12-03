import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import JewelryProductCard from './JewelryProductCard';

interface JewelryFeaturedProductsSectionProps {
  products?: any[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function JewelryFeaturedProductsSection({ products = [], content, storeSettings = {}, currencies = [] }: JewelryFeaturedProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'jewelry-store';
  return (
    <section className="py-24 bg-stone-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extralight text-stone-900 mb-6 tracking-tight">
            {content?.title || 'Signature Pieces'}
          </h2>
          <p className="text-lg text-stone-600 font-light max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'Handpicked masterpieces that embody our commitment to exceptional craftsmanship and timeless beauty.'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <JewelryProductCard key={product.id} product={product} storeSettings={storeSettings} currencies={currencies} />
          ))}
        </div>

        {/* View All Products */}
        <div className="text-center mt-16">
          <Link
            href={route('store.products', storeSlug)}
            className="inline-flex items-center border-2 border-yellow-600 text-yellow-600 px-10 py-4 font-medium uppercase text-sm hover:bg-yellow-600 hover:text-white transition-all duration-300"
          >
            <span>View All Pieces</span>
            <svg className="w-4 h-4 ml-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}