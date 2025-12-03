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

interface FashionCategorySectionProps {
  categories?: Category[];
  content?: any;
}

export default function FashionCategorySection({ categories = [], content }: FashionCategorySectionProps) {
  const displayCategories = categories.length > 0 ? categories : [];
  
  const enhancedCategories = displayCategories.map(category => ({
    ...category,
    image: category.image ? getImageUrl(category.image) : `https://placehold.co/400x600/000000/ffffff?text=${encodeURIComponent(category.name)}`,
    description: category.description || 'Discover the collection',
  }));

  return (
    <section className="py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-24">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-8xl font-thin text-black tracking-tight leading-none">
                {content?.title || 'Collections'}
              </h2>
              <p className="text-gray-500 font-light text-lg mt-4 max-w-2xl">
                {content?.description || 'Curated collections for the modern wardrobe'}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-px bg-black"></div>
            </div>
          </div>
        </div>
        
        {enhancedCategories.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 h-[70vh]">
            {enhancedCategories.slice(0, 4).map((category, index) => (
              <a 
                key={category.id} 
                href={category.href}
                className="group block relative overflow-hidden bg-white"
              >
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/400x600/f5f5f5/666666?text=${encodeURIComponent(category.name)}`;
                  }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-2xl font-thin mb-2 tracking-wide">
                      {category.name}
                    </h3>
                    <div className="w-12 h-px bg-white/60 mb-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <div className="flex items-center text-white/80 text-xs font-light tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <span>Shop Now</span>
                      <svg className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Corner Element */}
                <div className="absolute top-4 right-4 w-6 h-6 border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 font-light text-lg">No collections available</p>
          </div>
        )}
      </div>
    </section>
  );
}