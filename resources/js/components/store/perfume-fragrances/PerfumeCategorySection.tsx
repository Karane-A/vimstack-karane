import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface PerfumeCategorySectionProps {
  categories?: any[];
  content?: any;
}

export default function PerfumeCategorySection({ categories = [], content }: PerfumeCategorySectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'perfume-store';
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
            {content?.title || 'Fragrance Families'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            {content?.description || 'Explore our carefully curated fragrance categories.'}
          </p>
        </div>

        {/* Modern Grid Layout */}
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={route('store.products', storeSlug) + '?category=' + category.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(category.image) || `https://placehold.co/400x300/fafaf9/7c3aed?text=${encodeURIComponent(category.name)}`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fafaf9/7c3aed?text=${encodeURIComponent(category.name)}`;
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-purple-900/20 to-transparent"></div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {category.products_count || 0} Items
                  </div>
                  
                  {/* Hover Icon */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-purple-800 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Explore our curated collection
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link
            href={route('store.products', storeSlug)}
            className="inline-flex items-center px-8 py-4 bg-purple-800 text-white rounded-full font-medium hover:bg-purple-900 transition-colors duration-300"
          >
            <span>View All Collections</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}