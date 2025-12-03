import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { usePage } from '@inertiajs/react';

interface Category {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  products_count?: number;
}

interface CategoryContent {
  title?: { value: string };
  description?: { value: string };
}

interface CarsCategorySectionProps {
  categories: Category[];
  content?: CategoryContent;
}

export default function CarsCategorySection({ categories, content }: CarsCategorySectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'cars-store';
  const categoryContent = content || {};

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 tracking-tight">
            {categoryContent.title || 'Shop by Category'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {categoryContent.description || 'Find the perfect parts and accessories for your vehicle.'}
          </p>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-8"></div>
        </div>

        {/* Categories Grid - Horizontal Cards */}
        <div className="space-y-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group flex items-center bg-white border-l-4 border-red-600 hover:shadow-xl transition-all duration-300 overflow-hidden ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Category Image */}
              <div className="w-1/3 h-48 overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(category.image) || `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Category Info */}
              <div className="flex-1 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-black mb-3 group-hover:text-red-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.products_count !== undefined && (
                      <p className="text-gray-500 font-bold mb-4">
                        {category.products_count} Premium Products Available
                      </p>
                    )}
                    <p className="text-gray-600 mb-6">
                      Professional-grade automotive components for enhanced performance
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <a href={route('store.products', storeSlug) + '?category=' + category.id} className="bg-red-600 hover:bg-black text-white px-6 py-3 font-bold tracking-wider uppercase transition-colors flex items-center">
                      Shop Now
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href={route('store.products', storeSlug)}
            className="inline-flex items-center px-8 py-4 bg-black hover:bg-red-600 text-white font-bold tracking-wider uppercase transition-colors"
          >
            View All Categories
            <ChevronRight className="h-5 w-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}