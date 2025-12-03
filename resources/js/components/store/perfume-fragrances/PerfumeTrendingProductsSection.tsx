import React from 'react';
import PerfumeProductCard from './PerfumeProductCard';
import { usePage } from '@inertiajs/react';

interface PerfumeTrendingProductsSectionProps {
  products?: any[];
  content?: any;
  storeSettings?: any;
  currencies?: any[];
  stats?: any;
  designProcess?: any;
}

export default function PerfumeTrendingProductsSection({ 
  products = [], 
  content, 
  storeSettings, 
  currencies,
  stats,
  designProcess
}: PerfumeTrendingProductsSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'perfume-store';
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-purple-100 rounded-full mb-8">
            <svg className="w-5 h-5 text-purple-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span className="text-purple-800 font-medium text-sm">Trending Now</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
            {content?.title || 'Trending Scents'}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            {content?.description || 'The most sought-after fragrances of the season - from timeless classics to contemporary masterpieces that capture the essence of modern luxury.'}
          </p>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-stone-50 rounded-2xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-light text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Premium Fragrances</p>
            </div>
            
            <div className="text-center p-8 bg-stone-50 rounded-2xl">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-3xl font-light text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Luxury Brands</p>
            </div>
            
            <div className="text-center p-8 bg-stone-50 rounded-2xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-light text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {products.slice(0, 8).map((product) => (
              <PerfumeProductCard
                key={product.id}
                product={product}
                storeSettings={storeSettings}
                currencies={currencies}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-16">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-4">Trending Products Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Our trending fragrance collection is being curated. 
              Discover the most popular scents that everyone is talking about.
            </p>
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mb-16">
            <a
              href={route('store.products', storeSlug)}
              className="inline-flex items-center px-8 py-4 bg-purple-800 hover:bg-purple-900 text-white font-medium rounded-full transition-colors duration-300 group"
            >
              <span className="mr-3">View All Products</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}

        {/* Fragrance Journey Section */}
        {designProcess && (
          <div className="bg-gradient-to-r from-purple-50 to-stone-50 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-light text-purple-800 mb-4">
                  {designProcess?.title || 'The Art of Perfumery'}
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {designProcess?.description || 'Every fragrance tells a story. Discover the craftsmanship behind our curated collection.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(designProcess?.steps || [
                  {
                    icon: 'sparkles',
                    title: 'Curated Selection',
                    description: 'Each fragrance is carefully selected by our expert perfumers for its unique character and quality.'
                  },
                  {
                    icon: 'star',
                    title: 'Premium Quality',
                    description: 'Only the finest ingredients and master craftsmanship make it into our exclusive collection.'
                  },
                  {
                    icon: 'heart',
                    title: 'Personal Journey',
                    description: 'Find your signature scent with our personalized consultation and fragrance matching service.'
                  }
                ]).map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-10 h-10 text-purple-800" fill="currentColor" viewBox="0 0 20 20">
                        {step.icon === 'sparkles' && (
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                        )}
                        {step.icon === 'star' && (
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        )}
                        {step.icon === 'heart' && (
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-gray-900 mb-3">{step.title}</h4>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}