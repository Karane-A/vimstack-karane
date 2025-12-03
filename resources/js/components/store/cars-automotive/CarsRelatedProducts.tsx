import React from 'react';
import CarsProductCard from './CarsProductCard';

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

interface CarsRelatedProductsProps {
  products: Product[];
  title: string;
  subtitle: string;
  storeSettings?: any;
  currencies?: any[];
}

export default function CarsRelatedProducts({ 
  products, 
  title, 
  subtitle, 
  storeSettings = {}, 
  currencies = [] 
}: CarsRelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {/* Red accent line */}
          <div className="w-24 h-1 bg-red-600 mx-auto mt-8"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <CarsProductCard
              key={product.id}
              product={product}
              storeSettings={storeSettings}
              currencies={currencies}
            />
          ))}
        </div>
      </div>
    </section>
  );
}