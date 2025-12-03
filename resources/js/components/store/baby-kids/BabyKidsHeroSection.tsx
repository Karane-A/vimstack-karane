import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface BabyKidsHeroSectionProps {
  content?: any;
}

export default function BabyKidsHeroSection({ content }: BabyKidsHeroSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'baby-kids-store';
  const baseUrl = props.base_url;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Curved Wave */}
        <svg className="absolute bottom-0 w-full h-64 animate-pulse" viewBox="0 0 1440 320" fill="none">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0V96Z" fill="#fdf2f8"/>
        </svg>
        
        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-pink-50 opacity-40"></div>
        
        {/* Baby Blocks & Toys */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-pink-300 rounded-lg opacity-40 animate-float transform rotate-12"></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-blue-300 rounded-full opacity-50 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-yellow-300 rounded-lg opacity-35 animate-float-slow transform -rotate-6"></div>
        <div className="absolute bottom-20 right-20 w-14 h-14 bg-green-300 rounded-full opacity-45 animate-bounce"></div>
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-purple-300 rounded-lg opacity-30 animate-pulse transform rotate-45"></div>
        
        {/* Small Decorative Dots */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-yellow-400 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-16">
        {/* Centered Content Layout */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center bg-pink-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl">
              <div className="w-6 h-6 bg-white rounded-full mr-3 flex items-center justify-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
              </div>
              {content?.badge_text || 'New Arrivals 2024'}
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className={`text-6xl lg:text-8xl font-black text-gray-800 mb-8 leading-none transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {content?.title || 'Little Ones, Big Dreams'}
          </h1>
          
          {/* Subtitle */}
          <p className={`text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {content?.subtitle || 'Discover adorable, comfortable, and safe clothing designed for your precious little ones.'}
          </p>
        </div>

        {/* Unique Card-Based Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Image Card */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 h-80 overflow-hidden">
              <img 
                src={getImageUrl(content?.image || '/storage/media/52/home-banner-baby-kids.png')}
                alt="Baby & Kids Collection" 
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/fef7f7/ec4899?text=Baby+Collection';
                }}
              />
              
              {/* Overlay Badge */}
              <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {content?.overlay_badge_text || 'Premium Quality'}
              </div>
              
              {/* Bottom Action */}
              <div className="absolute bottom-4 left-4 right-4">
                <a 
                  href={content?.button_link ? `${baseUrl}${content.button_link}` : '#'}
                  className="w-full bg-pink-500 text-white py-3 rounded-2xl font-bold hover:bg-pink-600 transition-colors duration-300 shadow-xl flex items-center justify-center"
                >
                  <span>{content?.button_text || 'Shop Now'}</span>
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="space-y-6">
            {/* Dynamic Trust Badges */}
            {(content?.trust_badges || [
              { title: "Premium Quality", subtitle: "Safety First" },
              { title: "50K+ Families", subtitle: "Love our products" },
              { title: "4.9 Star Rating", subtitle: "Trusted by parents" }
            ]).map((badge: any, index: number) => {
              const colors = ['green', 'blue', 'pink', 'yellow'];
              const color = colors[index % colors.length];
              
              return (
                <div key={index} className={`bg-white border-2 border-${color}-200 rounded-2xl p-6 shadow-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: `${900 + (index * 200)}ms` }}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <svg className={`w-6 h-6 text-${color}-600`} fill="currentColor" viewBox="0 0 20 20">
                        {index === 0 && <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />}
                        {index === 1 && <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {index === 2 && <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />}
                        {index === 3 && <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />}
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">{badge.title}</div>
                      {badge.subtitle && <div className="text-sm text-gray-600">{badge.subtitle}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
}