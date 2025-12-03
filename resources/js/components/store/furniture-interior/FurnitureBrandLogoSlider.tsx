import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface FurnitureBrandLogoSliderProps {
  content?: any;
}

function FurnitureBrandLogoSlider({ content }: FurnitureBrandLogoSliderProps) {
  // Handle both nested structure (logos.value) and extracted structure (logos)
  const logos = content?.logos?.value || content?.logos || [
    { image: '/storage/media/71/brand-logo-furniture-interior-1.png' },
    { image: '/storage/media/72/brand-logo-furniture-interior-2.png' },
    { image: '/storage/media/73/brand-logo-furniture-interior-3.png' },
    { image: '/storage/media/74/brand-logo-furniture-interior-4.png' },
    { image: '/storage/media/75/brand-logo-furniture-interior-5.png' },
    { image: '/storage/media/76/brand-logo-furniture-interior-6.png' }
  ];

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-20 lg:py-24 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            {content?.title || 'Trusted by Premium Brands'}
          </h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            {content?.description || 'We partner with the world\'s leading furniture manufacturers and designers to bring you exceptional quality and craftsmanship.'}
          </p>
        </div>

        {/* Logo Slider */}
        <div className="relative">
          <div className="flex animate-scroll space-x-16 items-center">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 hover:scale-110"
              >
                <img
                  src={getImageUrl(logo.image)}
                  alt={logo.name || `Brand ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/128x80/f5f5dc/8b7355?text=Brand+${(index % logos.length) + 1}`;
                  }}
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-stone-50 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-stone-50 to-transparent pointer-events-none"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mt-20 pt-16 border-t-2 border-amber-200">
          {(content?.stats?.value || content?.stats || [
            { number: '50+', label: 'Premium Brands' },
            { number: '25+', label: 'Years Experience' },
            { number: '10K+', label: 'Happy Customers' },
            { number: '99%', label: 'Satisfaction Rate' }
          ]).map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 group-hover:text-amber-800 transition-colors duration-300">{stat.number}</div>
              <p className="text-slate-700 text-base font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

export default FurnitureBrandLogoSlider;