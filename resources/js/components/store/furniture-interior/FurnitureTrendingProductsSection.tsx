import React from 'react';
import FurnitureProductCard from './FurnitureProductCard';

interface FurnitureTrendingProductsSectionProps {
  products?: any[];
  content?: any;
  stats?: any;
  storeSettings?: any;
  currencies?: any[];
  designProcess?: any;
}

function FurnitureTrendingProductsSection({ 
  products = [], 
  content, 
  stats,
  storeSettings, 
  currencies,
  designProcess
}: FurnitureTrendingProductsSectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 bg-amber-100 border-2 border-amber-300 px-6 py-3 rounded-full mb-6 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <span className="text-sm font-bold text-amber-800 tracking-wider uppercase">Popular Collection</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
            {content?.title || 'Trending Designs'}
          </h2>
          <p className="text-lg lg:text-xl text-slate-700 leading-relaxed max-w-4xl mx-auto">
            {content?.description || 'The most popular wooden furniture pieces and interior design trends that are transforming homes this season.'}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <FurnitureProductCard
                key={product.id}
                product={product}
                storeSettings={storeSettings}
                currencies={currencies}
              />
            ))}
          </div>
        ) : (
          // Placeholder products when no data
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9z" />
                    </svg>
                    <p className="text-yellow-700 text-sm font-semibold">Trending Item {index + 1}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-yellow-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 bg-yellow-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-4 bg-yellow-200 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="h-10 bg-yellow-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Design Process Section */}
        <div className="mt-24 bg-white/90 backdrop-blur-sm rounded-3xl p-12 lg:p-16 border-2 border-yellow-200 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              {designProcess?.title || 'Our Design Process'}
            </h3>
            <p className="text-lg lg:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              {designProcess?.description || 'From concept to completion, we guide you through every step of creating your perfect wooden furniture space.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {(designProcess?.steps || [
              { step: '01', title: 'Consultation', description: 'Understanding your vision and needs' },
              { step: '02', title: 'Design', description: '3D visualization and planning' },
              { step: '03', title: 'Selection', description: 'Curating the perfect pieces' },
              { step: '04', title: 'Installation', description: 'Professional setup and styling' }
            ]).map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:bg-yellow-200 transition-all duration-500">
                  {item.step}
                </div>
                <h4 className="text-lg lg:text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-800 transition-colors duration-300">{item.title}</h4>
                <p className="text-slate-700 text-base font-medium leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FurnitureTrendingProductsSection;