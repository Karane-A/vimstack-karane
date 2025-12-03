import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface JewelryCategorySectionProps {
  categories?: any[];
  content?: any;
}

function JewelryCategorySection({ categories = [], content }: JewelryCategorySectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'jewelry-store';
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">
            {content?.title || 'Shop by Category'}
          </h2>
          <div className="w-24 h-1 bg-yellow-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {content?.description || 'Browse our carefully curated jewelry collections'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={category.href || "#"}
              className="group flex items-center bg-neutral-50 hover:bg-yellow-50 border-l-4 border-yellow-600 p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden mr-6">
                <img 
                  src={category.image ? getImageUrl(category.image) : `https://placehold.co/80x80/f5f5f5/d4af37?text=${encodeURIComponent(category.name.charAt(0))}`}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/80x80/f5f5f5/d4af37?text=${encodeURIComponent(category.name.charAt(0))}`;
                  }}
                  loading="lazy"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-serif text-xl text-neutral-900 mb-2 group-hover:text-yellow-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-2">
                  {category.products_count} {category.products_count === 1 ? 'item' : 'items'} available
                </p>
                <div className="flex items-center text-yellow-600 text-sm font-medium">
                  <span>Browse Collection</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href={route('store.products', storeSlug)}
            className="inline-flex items-center px-8 py-4 bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-colors"
          >
            <span>View All Categories</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default JewelryCategorySection;