import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface ElectronicsHeroSectionProps {
  content?: any;
}

export default function ElectronicsHeroSection({ content }: ElectronicsHeroSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'electronics-store';
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            {/* Badge */}
            <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg">
                {content?.badge_text || 'Latest Tech 2024'}
              </span>
            </div>
            
            {/* Title */}
            <h1 className={`text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.title || 'Power Your Digital Life'}
            </h1>
            
            {/* Subtitle */}
            <p className={`text-xl text-blue-100 mb-12 leading-relaxed max-w-lg transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {content?.subtitle || 'Discover cutting-edge electronics and innovative gadgets that enhance your productivity and entertainment experience.'}
            </p>
            
            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a 
                href={content?.button_link ? `${props.baseUrl || ''}${content.button_link}` : route('store.products', storeSlug)}
                className="group bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span>{content?.button_text || 'Shop Tech'}</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href={content?.secondary_button_link ? `${props.baseUrl || ''}${content.secondary_button_link}` : '/catalog'}
                className="group border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                <span>{content?.secondary_button_text || 'View Catalog'}</span>
              </a>
            </div>

            {/* Info Boxes */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              {(content?.info_boxes || [
                { icon: 'zap', title: 'Fast Charging', description: 'Quick power solutions' },
                { icon: 'shield', title: '2-Year Warranty', description: 'Extended protection' },
                { icon: 'cpu', title: 'Latest Tech', description: 'Cutting-edge innovation' }
              ]).map((box, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-8 h-8 mb-3 text-cyan-400">
                    {box.icon === 'zap' && (
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    )}
                    {box.icon === 'shield' && (
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {box.icon === 'cpu' && (
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 7H7v6h6V7z" />
                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{box.title}</h3>
                  <p className="text-blue-200 text-xs">{box.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={getImageUrl(content?.image || '/storage/media/79/home-banner-electronics.png')}
                alt="Electronics Collection" 
                className="w-full h-auto rounded-2xl shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/60a5fa?text=Electronics+%26+Gadgets';
                }}
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-80 animate-bounce"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-500 rounded-lg opacity-70 animate-pulse"></div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl transform scale-110"></div>
          </div>
        </div>
      </div>
    </section>
  );
}