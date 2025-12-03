import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface BeautyHeroSectionProps {
  content?: any;
}

export default function BeautyHeroSection({ content }: BeautyHeroSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'beauty-store';
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-rose-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-flex items-center px-4 py-2 bg-white text-rose-600 text-sm font-medium rounded-full shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {content?.badge_text || 'New Arrivals 2024'}
              </span>
            </div>
            
            {/* Title */}
            <h1 className={`text-5xl lg:text-7xl font-light text-gray-900 leading-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.title || 'Enhance Your Natural Beauty'}
            </h1>
            
            {/* Subtitle */}
            <p className={`text-xl text-gray-600 leading-relaxed max-w-xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.subtitle || 'Discover premium skincare, makeup, and wellness products that celebrate your unique beauty.'}
            </p>
            
            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a 
                href={content?.button_link ? `${props.baseUrl || ''}${content.button_link}` : route('store.products', storeSlug)}
                className="group bg-rose-600 text-white px-8 py-4 rounded-full font-medium hover:bg-rose-700 transition-all duration-300 inline-flex items-center justify-center"
              >
                <span>{content?.button_text || 'Shop Collection'}</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href={content?.secondary_button_link ? `${props.baseUrl || ''}${content.secondary_button_link}` : '/beauty-guide'}
                className="group border-2 border-rose-600 text-rose-600 px-8 py-4 rounded-full font-medium hover:bg-rose-600 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                <span>{content?.secondary_button_text || 'Beauty Guide'}</span>
              </a>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={getImageUrl(content?.image || '/storage/media/12/home-banner-beauty-cosmetics.png')}
                alt="Beauty Collection" 
                className="w-full h-[600px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/fdf2f8/ec4899?text=Beauty+Collection';
                }}
              />
              
              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-8 h-8 bg-rose-400/60 rounded-full"></div>
              <div className="absolute top-1/3 left-8 w-4 h-4 bg-white/40 rounded-full"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{content?.floating_card?.title?.value || content?.floating_card?.title || 'Loved by 50K+'}</p>
                  <p className="text-xs text-gray-500">{content?.floating_card?.subtitle?.value || content?.floating_card?.subtitle || 'Beauty enthusiasts'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Boxes */}
        <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {(content?.info_boxes || [
            { icon: 'sparkles', title: 'Clean Beauty', description: 'Cruelty-free & natural ingredients' },
            { icon: 'heart', title: 'Skin-First', description: 'Dermatologist tested formulas' },
            { icon: 'shield', title: 'Safe & Pure', description: 'No harmful chemicals' }
          ]).map((box, index) => (
            <div key={index} className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                {box.icon === 'sparkles' && (
                  <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                )}
                {box.icon === 'heart' && (
                  <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                )}
                {box.icon === 'shield' && (
                  <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{box.title}</h3>
                <p className="text-sm text-gray-600">{box.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}