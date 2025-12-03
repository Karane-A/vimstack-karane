import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  products_count?: number;
}

interface WatchesCategorySectionProps {
  categories: Category[];
  content?: any;
}

export default function WatchesCategorySection({ categories, content }: WatchesCategorySectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-slate-900 mb-6 tracking-tight">
            {content?.title || 'Shop by Collection'}
          </h2>
          <p className="text-lg text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'Explore our curated selection of luxury timepieces, from classic dress watches to modern sports chronographs.'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category, index) => (
            <a
              key={category.id}
              href={category.href || route('store.products', storeSlug) + '?category=' + category.id}
              className="group relative bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Category Image */}
              <div className="aspect-square overflow-hidden bg-slate-50">
                <img
                  src={getImageUrl(category.image) || `https://placehold.co/300x300/f8fafc/64748b?text=${encodeURIComponent(category.name)}`}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/300x300/f8fafc/64748b?text=${encodeURIComponent(category.name)}`;
                  }}
                />
              </div>

              {/* Category Info */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-medium text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {category.products_count || 0} items
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        {categories.length > 4 && (
          <div className="text-center mt-16">
            <a
              href={route('store.products', storeSlug)}
              className="inline-flex items-center px-8 py-3 border-2 border-slate-900 text-slate-900 font-medium tracking-wider uppercase text-sm hover:bg-slate-900 hover:text-white transition-all duration-300"
            >
              View All Collections
              <svg className="w-4 h-4 ml-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}