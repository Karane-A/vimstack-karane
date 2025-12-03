import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface WatchesHeroSectionProps {
  content?: any;
}

export default function WatchesHeroSection({ content }: WatchesHeroSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'watches-store';
  const baseUrl = props.base_url;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={getImageUrl(content?.image || '/storage/media/61/home-banner-watches.png')}
          alt="Luxury Watches" 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/1920x1080/1e293b/ffffff?text=Luxury+Timepieces';
          }}
        />
        <div className="absolute inset-0 bg-slate-900/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="bg-amber-500 text-slate-900 px-6 py-2 text-sm font-medium tracking-wider uppercase">
                {content?.badge_text || 'Swiss Precision 2024'}
              </span>
            </div>
            
            {/* Title */}
            <h1 className={`text-8xl font-light text-white mb-8 leading-none tracking-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.title || 'Master Time'}
            </h1>
            
            {/* Subtitle */}
            <p className={`text-xl text-slate-300 mb-12 font-light leading-relaxed max-w-2xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.subtitle || 'Discover exceptional timepieces that blend traditional craftsmanship with modern innovation.'}
            </p>
            
            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a 
                href={content?.button_link ? `${baseUrl}${content.button_link}` : '#'}
                className="group bg-amber-500 text-slate-900 px-10 py-4 font-medium tracking-wider uppercase text-sm hover:bg-amber-400 transition-all duration-300 inline-flex items-center justify-center min-w-[220px]"
              >
                <span>{content?.button_text || 'Explore Collection'}</span>
                <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href={content?.secondary_button_link ? `${baseUrl}${content.secondary_button_link}` : '#'}
                className="group border-2 border-white text-white px-10 py-4 font-medium tracking-wider uppercase text-sm hover:bg-white hover:text-slate-900 transition-all duration-300 inline-flex items-center justify-center min-w-[220px]"
              >
                <span>{content?.secondary_button_text || 'Watch Guide'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      

      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
      <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
    </section>
  );
}