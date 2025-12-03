import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface Category {
  id: number;
  name: string;
  slug: string;
  href: string;
  image?: string;
  description?: string;
}

interface BeautyCategorySectionProps {
  categories?: Category[];
  content?: any;
}

export default function BeautyCategorySection({ categories = [], content }: BeautyCategorySectionProps) {
  const displayCategories = categories.length > 0 ? categories : [];
  
  const enhancedCategories = displayCategories.map(category => ({
    ...category,
    image: category.image ? getImageUrl(category.image) : `https://placehold.co/400x500/fdf2f8/ec4899?text=${encodeURIComponent(category.name)}`,
    description: category.description || 'Discover the collection',
  }));

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">
            {content?.title || 'Shop by Category'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'Explore our carefully curated beauty collections designed to enhance your natural radiance.'}
          </p>
        </div>
        
        {enhancedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {enhancedCategories.slice(0, 4).map((category, index) => (
              <a 
                key={category.id} 
                href={category.href}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x500/fdf2f8/ec4899?text=${encodeURIComponent(category.name)}`;
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating Icon */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-rose-600 font-medium text-sm">
                      <span>Explore Collection</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No collections available</p>
          </div>
        )}
      </div>
    </section>
  );
}