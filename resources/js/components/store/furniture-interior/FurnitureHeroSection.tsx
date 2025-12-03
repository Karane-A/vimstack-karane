import React, { useState, useEffect } from 'react';
import { Home, Sofa, Palette, Truck } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { usePage } from '@inertiajs/react';

interface FurnitureHeroSectionProps {
  content?: any;
}

const FurnitureHeroSection: React.FC<FurnitureHeroSectionProps> = ({ content = {} }) => {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'furniture-store';
  const baseUrl = props.base_url;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-stone-100 overflow-hidden">
      {/* Room Showcase Layout */}
      <div className="min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-amber-200 py-4">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <div className={`flex items-center gap-3 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="w-10 h-10 bg-amber-800 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-amber-800 tracking-wider uppercase">
                {content?.badge_text || 'Handcrafted Furniture'}
              </span>
            </div>
            
            <div className={`flex items-center gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              {(content?.stats || [
                { number: '4.9★', label: 'Rating' },
                { number: '25+', label: 'Years' }
              ]).map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-amber-800">{stat.number}</div>
                  <div className="text-xs text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Left Content Panel */}
              <div className="lg:col-span-1 space-y-8">
                <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                    {content?.title || 'Beautiful Spaces Start Here'}
                  </h1>
                  <p className="text-lg text-slate-700 leading-relaxed mb-8">
                    {content?.subtitle || 'Discover thoughtfully designed furniture that brings warmth and character to every room in your home.'}
                  </p>
                </div>

                {/* Room Types */}
                <div className={`space-y-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-4">{content?.room_section?.title || 'Shop by Room'}</h3>
                  {(content?.room_section?.rooms || [
                    { name: 'Living Room' },
                    { name: 'Bedroom' },
                    { name: 'Dining Room' },
                    { name: 'Office' }
                  ]).map((room, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-xl hover:bg-white transition-all duration-300 cursor-pointer group">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <svg className="w-4 h-4 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium group-hover:text-amber-800 transition-colors">{room.name}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className={`space-y-3 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <a 
                    href={content?.button_link ? `${baseUrl}${content.button_link}` : '#'}
                    className="w-full bg-yellow-800 text-white py-4 px-6 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{content?.button_text || 'Shop Collection'}</span>
                  </a>
                  <a 
                    href={content?.secondary_button_link ? `${baseUrl}${content.secondary_button_link}` : '#'}
                    className="w-full border-2 border-yellow-700 text-yellow-800 py-4 px-6 rounded-2xl font-bold hover:bg-yellow-800 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    <span>{content?.secondary_button_text || 'Design Services'}</span>
                  </a>
                </div>
              </div>

              {/* Center - Furniture Catalog Display */}
              <div className={`lg:col-span-2 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="relative">
                  {/* Furniture Catalog Layout */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Main Featured Image */}
                    <div className="col-span-2 relative bg-white rounded-2xl p-4 shadow-lg border border-amber-200 hover:border-amber-300 transition-colors duration-200">
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                        <img 
                          src={getImageUrl(content?.image || '/storage/media/70/home-banner-furniture-interior.png')}
                          alt="Featured Furniture" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/f5f5dc/8b7355?text=Featured+Furniture';
                          }}
                        />
                      </div>
                    </div>
                    

                  </div>
                  
                  {/* Catalog Info Panel */}
                  <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{content?.catalog_info?.title || 'Furniture Catalog 2024'}</h3>
                          <p className="text-sm text-slate-600">{content?.catalog_info?.description || 'Premium handcrafted collection'}</p>
                        </div>
                      </div>
                      <a 
                        href={content?.catalog_info?.button_link || route('store.products', storeSlug)}
                        className="bg-yellow-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-yellow-900 transition-colors inline-block"
                      >
                        {content?.catalog_info?.button_text || 'Browse All'}
                      </a>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {(content?.catalog_info?.stats || [
                        { number: '150+', label: 'Products' },
                        { number: '12', label: 'Categories' },
                        { number: '4.9★', label: 'Rating' }
                      ]).map((stat, index) => (
                        <div key={index} className="text-center p-3 bg-amber-50 rounded-xl">
                          <div className="text-2xl font-bold text-amber-800">{stat.number}</div>
                          <div className="text-xs text-slate-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-3 -right-3 bg-amber-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                    {content?.floating_badge || 'NEW 2024'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default FurnitureHeroSection;