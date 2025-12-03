import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface PerfumeHeroSectionProps {
  content?: any;
}

export default function PerfumeHeroSection({ content }: PerfumeHeroSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'perfume-store';
  const baseUrl = props.base_url;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full opacity-20 -translate-y-36 translate-x-36"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100 rounded-full opacity-15 translate-y-48 -translate-x-48"></div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center min-h-screen gap-12">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-purple-200">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-purple-800 text-sm font-medium">
                  {content?.badge_text || 'Signature Collection 2024'}
                </span>
              </div>
            </div>
            
            {/* Title */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-purple-800 leading-tight">
                {content?.title || 'Discover Your Signature Scent'}
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className={`text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.subtitle || 'Immerse yourself in our curated collection of luxury fragrances, where each bottle tells a unique story of elegance and sophistication.'}
            </p>
            
            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a 
                href={content?.button_link ? `${baseUrl}${content.button_link}` : '#'}
                className="bg-purple-800 text-white px-8 py-4 rounded-full font-medium hover:bg-purple-900 transition-colors duration-300 text-center"
              >
                {content?.button_text || 'Explore Fragrances'}
              </a>
              <a 
                href={content?.secondary_button_link ? `${baseUrl}${content.secondary_button_link}` : '#'}
                className="border-2 border-purple-800 text-purple-800 px-8 py-4 rounded-full font-medium hover:bg-purple-800 hover:text-white transition-colors duration-300 text-center"
              >
                {content?.secondary_button_text || 'Fragrance Guide'}
              </a>
            </div>
          </div>

          {/* Right Image Stack */}
          <div className="flex-1 relative max-w-lg">
            {/* Main Image Container */}
            <div className="relative">
              {/* Background Shape */}
              <div className="absolute inset-0 bg-purple-200 rounded-t-full transform rotate-12 scale-110 opacity-20"></div>
              
              {/* Main Image */}
              <div className="relative bg-white p-8 rounded-t-full shadow-2xl">
                <img 
                  src={getImageUrl(content?.image || '/storage/media/28/home-banner-perfume-fragrances.png')}
                  alt="Luxury Perfume Collection" 
                  className="w-full h-96 md:h-[500px] object-cover rounded-t-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x500/fafaf9/7c3aed?text=Luxury+Perfume';
                  }}
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-amber-400 text-white p-3 rounded-full shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-purple-800 text-white p-3 rounded-full shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}