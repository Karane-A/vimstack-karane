import React from 'react';
import FashionProductCard from './FashionProductCard';
import { usePage } from '@inertiajs/react';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image?: string;
  slug: string;
  href?: string;
}

interface FashionRelatedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  storeSettings?: any;
  currencies?: any[];
}

export default function FashionRelatedProducts({ 
  products, 
  title = "You May Also Like",
  subtitle = "Discover similar styles that complement your taste",
  storeSettings = {},
  currencies = []
}: FashionRelatedProductsProps) {
  if (!products || products.length === 0) return null;

  const { props } = usePage();
  const storeSlug = props.store?.slug || 'fashion-boutique';
  
  const enhancedProducts = products.slice(0, 4).map(product => ({
    ...product,
    href: product.href || route('store.product', { storeSlug, id: product.id })
  }));

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-thin mb-6 tracking-wide text-black">
            {title}
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {enhancedProducts.map((product) => (
            <FashionProductCard key={product.id} product={product} storeSettings={storeSettings} currencies={currencies} />
          ))}
        </div>
      </div>
    </section>
  );
}