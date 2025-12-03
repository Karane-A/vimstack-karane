import React from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface Category {
  id: number;
  name: string;
  slug: string;
  href: string;
  image?: string;
  description?: string;
}

interface CategorySectionProps {
  title?: string;
  categories?: Category[];
  content?: any;
}

export default function CategorySection({
  title = "Shop by Category",
  categories = [],
  content
}: CategorySectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  
  // Use dynamic categories or fallback to empty array
  const displayCategories = categories.length > 0 ? categories : [];
  
  // Enhance categories with fallback images if not provided
  const enhancedCategories = displayCategories.map(category => ({
    ...category,
    image: category.image ? getImageUrl(category.image) : `https://placehold.co/600x400?text=${encodeURIComponent(category.name)}`,
    description: category.description || 'Explore our collection',
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content?.title || title}</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {content?.description || 'Browse our carefully curated collections for every room in your home'}
          </p>
        </div>
        
        {enhancedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enhancedCategories.map((category) => (
              <a 
                key={category.id} 
                href={category.href}
                className="group block overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full"
              >
              <div className="relative h-64 overflow-hidden">
                {/* Image */}
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/600x400?text=${encodeURIComponent(category.name)}`;
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-1 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                  
                  {/* Button */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                    <span className="inline-flex items-center text-sm font-medium">
                      Shop Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available at the moment.</p>
          </div>
        )}
        
        {/* View All Categories Button */}
        {enhancedCategories.length > 0 && (
          <div className="text-center mt-12">
            <a 
              href={route('store.products', { storeSlug })}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View All Categories
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}