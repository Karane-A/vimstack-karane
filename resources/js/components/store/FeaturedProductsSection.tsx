import React from 'react';
import ProductCard from './ProductCard';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface FeaturedProductsSectionProps {
  title?: string;
  subtitle?: string;
  products?: any[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function FeaturedProductsSection({
  title = "Featured Products",
  subtitle = "Discover our most popular home accessories and decor items",
  products = [],
  content,
  storeSettings = {},
  currencies = []
}: FeaturedProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  
  const handleAddToCart = (product: any, quantity: number) => {
    console.log('Adding to cart:', product, quantity);
  };
  
  const handleQuickView = (product: any) => {
    console.log('Quick view:', product);
  };
  
  const handleAddToWishlist = (product: any) => {
    console.log('Adding to wishlist:', product);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content?.title || title}</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {content?.description || subtitle}
          </p>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                cover_image={product.cover_image ? getImageUrl(product.cover_image) : `https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onAddToWishlist={handleAddToWishlist}
                storeSettings={storeSettings}
                currencies={currencies}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href={route('store.products', { storeSlug })}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            View All Products
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}