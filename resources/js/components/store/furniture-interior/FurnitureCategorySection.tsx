import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface FurnitureCategorySectionProps {
  categories?: any[];
  content?: any;
}

const FurnitureCategorySection: React.FC<FurnitureCategorySectionProps> = ({ categories = [], content }) => {
  const { props } = usePage();
  const store = props.store || {};
  const storeSlug = props.store?.slug || 'furniture-store';
  
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 bg-amber-100 border-2 border-amber-300 px-6 py-3 rounded-full mb-6 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <span className="text-sm font-bold text-amber-800 tracking-wider uppercase">Room Collections</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {content?.title || 'Shop by Room'}
          </h2>
          <p className="text-lg lg:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'Find the perfect wooden furniture pieces for every space in your home.'}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.length > 0 ? categories.slice(0, 4).map((category, index) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative block"
            >
              <div className="relative bg-white rounded-2xl shadow-lg shadow-amber-200/50 hover:shadow-2xl hover:shadow-amber-300/60 transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(category.image) || `/storage/categories/${category.name.toLowerCase().replace(' ', '-')}.jpg`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/300x375/f5f5dc/8b7355?text=${encodeURIComponent(category.name)}`;
                    }}
                  />
                  
                  <div className="absolute top-3 left-3 bg-amber-800 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md">
                    {category.name}
                  </div>
                  
                  <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/30 transition-colors duration-300 flex items-end">
                    <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                        <span className="text-amber-800 font-bold text-sm">Explore Collection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors duration-300">
                  {category.name}
                </h3>
                <div className="w-6 h-0.5 bg-amber-600 mx-auto mt-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>
          )) : (
            [
              { name: 'Living Room', image: '/storage/categories/living-room.jpg' },
              { name: 'Bedroom', image: '/storage/categories/bedroom.jpg' },
              { name: 'Dining Room', image: '/storage/categories/dining-room.jpg' },
              { name: 'Office', image: '/storage/categories/office.jpg' }
            ].map((category, index) => (
              <div
                key={index}
                className="group relative block cursor-pointer"
              >
                <div className="relative bg-white rounded-2xl shadow-lg shadow-amber-200/50 hover:shadow-2xl hover:shadow-amber-300/60 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(category.image) || category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/300x375/f5f5dc/8b7355?text=${encodeURIComponent(category.name)}`;
                      }}
                    />
                    
                    <div className="absolute top-3 left-3 bg-amber-800 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md">
                      {category.name}
                    </div>
                    
                    <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/30 transition-colors duration-300 flex items-end">
                      <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                          <span className="text-amber-800 font-bold text-sm">Explore Collection</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="w-6 h-0.5 bg-amber-600 mx-auto mt-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <a
            href={route('store.products', storeSlug)}
            className="inline-flex items-center gap-3 bg-yellow-800 text-white px-12 py-5 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 group shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
          >
            <span>View All Categories</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FurnitureCategorySection;