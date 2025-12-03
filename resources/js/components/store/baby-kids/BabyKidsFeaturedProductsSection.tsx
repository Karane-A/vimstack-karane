import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { BabyKidsProductCard } from '@/components/store/baby-kids';
import { useStoreCurrency } from '@/hooks/use-store-currency';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  image?: string;
  cover_image?: string;
  variants?: any[];
  is_featured: boolean;
}

interface BabyKidsFeaturedProductsSectionProps {
  products?: Product[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function BabyKidsFeaturedProductsSection({ 
  products = [], 
  content, 
  storeSettings,
  currencies = []
}: BabyKidsFeaturedProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'baby-kids-store';
  const storeCurrency = useStoreCurrency();
  
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return `${storeCurrency.symbol}0.00`;
    return `${storeCurrency.symbol}${numPrice.toFixed(storeCurrency.decimals)}`;
  };

  const addToWishlist = (productId: number) => {
    console.log('Add to wishlist:', productId);
  };

  const addToCart = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      window.location.href = `/products/${product.slug}`;
    } else {
      console.log('Add to cart:', product.id);
    }
  };

  return (
    <section className="py-20 bg-pink-50">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            {content?.title || 'Parent Favorites'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {content?.description || 'Loved by parents and kids alike - these bestsellers combine comfort, durability, and adorable designs.'}
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
                  name: `Adorable Baby Outfit ${index + 1}`,
                  slug: `baby-outfit-${index + 1}`,
                  price: 29.99,
                  image: `https://placehold.co/400x400/fef7f7/ec4899?text=Baby+Product+${index + 1}`
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
            <span>View All Products</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}