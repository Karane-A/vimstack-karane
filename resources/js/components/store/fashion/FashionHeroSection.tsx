import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface FashionHeroSectionProps {
  content?: any;
}

export default function FashionHeroSection({ content }: FashionHeroSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'fashion-boutique';
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-white">
      {/* Split Layout */}
      <div className="flex w-full h-full">
        {/* Left Content */}
        <div className="w-1/2 flex items-center justify-center bg-white relative">
          {/* Geometric Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 transform rotate-45 translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/3 transform rotate-45 -translate-x-16 translate-y-16"></div>
          </div>
          
          <div className="max-w-lg px-12 relative z-10">
            {/* Badge */}
            <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="bg-black text-white px-4 py-1 text-xs font-medium tracking-widest uppercase">
                {content?.badge_text || 'Spring Collection 2024'}
              </span>
            </div>
            
            {/* Title */}
            <h1 className={`text-7xl font-thin text-black mb-8 leading-none tracking-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.title || 'Define Your Style'}
            </h1>
            
            {/* Subtitle */}
            <p className={`text-lg text-gray-600 mb-12 font-light leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.subtitle || 'Discover the latest trends and timeless pieces that express your unique personality.'}
            </p>
            
            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a 
                href={content?.button_link ? `${props.baseUrl || ''}${content.button_link}` : route('store.products', storeSlug)}
                className="group bg-black text-white px-12 py-5 font-light tracking-widest uppercase text-xs hover:bg-gray-900 transition-all duration-500 inline-flex items-center justify-center min-w-[200px]"
              >
                <span>{content?.button_text || 'Shop Now'}</span>
                <svg className="w-3 h-3 ml-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href={content?.secondary_button_link ? `${props.baseUrl || ''}${content.secondary_button_link}` : '/lookbook'}
                className="group border-2 border-black text-black px-12 py-5 font-light tracking-widest uppercase text-xs hover:bg-black hover:text-white transition-all duration-500 inline-flex items-center justify-center min-w-[200px] relative overflow-hidden"
              >
                <span className="relative z-10">{content?.secondary_button_text || 'View Lookbook'}</span>
                <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Right Image */}
        <div className="w-1/2 relative overflow-hidden">
          <div className="h-full relative">
            <img 
              src={getImageUrl(content?.image || '/storage/media/36/home-banner-fashion.png')}
              alt="Fashion Collection" 
              className="w-full h-full object-cover object-center"
              style={{ minHeight: '100vh' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/960x1080/f5f5f5/666666?text=Fashion+Collection';
              }}
            />
            
            {/* Image Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-12 right-12 w-20 h-20 border border-white/60 backdrop-blur-sm"></div>
            <div className="absolute bottom-12 left-12 w-3 h-20 bg-white shadow-lg"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-1/3 right-12 w-2 h-2 bg-white/80 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Info Boxes - Bottom */}
      <div className={`absolute bottom-12 left-12 flex gap-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {(content?.info_boxes || [
          { icon: 'truck', title: 'Express Delivery', description: 'Next-day delivery' },
          { icon: 'refresh-cw', title: 'Easy Exchanges', description: '60-day policy' },
          { icon: 'award', title: 'Premium Quality', description: 'Curated pieces' }
        ]).map((box, index) => (
          <div key={index} className="text-black">
            <div className="w-6 h-6 mb-2">
              {box.icon === 'truck' && (
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                </svg>
              )}
              {box.icon === 'refresh-cw' && (
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              )}
              {box.icon === 'award' && (
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </div>
            <h3 className="font-light text-xs uppercase tracking-widest mb-1">{box.title}</h3>
            <p className="text-gray-600 text-xs font-light">{box.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}