import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { BabyKidsProductCard } from '@/components/store/baby-kids';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  image?: string;
  cover_image?: string;
  variants?: any[];
}

interface BabyKidsTrendingProductsSectionProps {
  products?: Product[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function BabyKidsTrendingProductsSection({ 
  products = [], 
  content,
  storeSettings,
  currencies = []
}: BabyKidsTrendingProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'baby-kids-store';
  
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            {content?.title || 'Trending Now'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {content?.description || 'The cutest styles that parents are loving right now - from playtime essentials to special occasion outfits.'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? products.slice(0, 8).map((product) => (
            <BabyKidsProductCard
              key={product.id}
              product={product}
              storeSettings={storeSettings}
              currencies={currencies}
            />
          )) : (
            // Default products when no data
            [...Array(8)].map((_, index) => (
              <BabyKidsProductCard
                key={index}
                product={{
                  id: index,
                  name: `Trending Baby Item ${index + 1}`,
                  slug: `trending-baby-item-${index + 1}`,
                  price: 34.99,
                  image: `https://placehold.co/400x400/fef7f7/ec4899?text=Trending+${index + 1}`
                }}
                storeSettings={storeSettings}
                currencies={currencies}
              />
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href={route('store.products', storeSlug)}
            className="inline-flex items-center px-8 py-4 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 shadow-lg"
          >
            <span>View All Trending</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}