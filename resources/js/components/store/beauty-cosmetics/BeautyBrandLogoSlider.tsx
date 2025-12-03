import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface BeautyBrandLogoSliderProps {
  content?: any;
}

export default function BeautyBrandLogoSlider({ content }: BeautyBrandLogoSliderProps) {
  const logos = content?.logos || content?.value || content || [
    { image: '/storage/brands/beauty-brand1.png' },
    { image: '/storage/brands/beauty-brand2.png' },
    { image: '/storage/brands/beauty-brand3.png' },
    { image: '/storage/brands/beauty-brand4.png' },
    { image: '/storage/brands/beauty-brand5.png' },
    { image: '/storage/brands/beauty-brand6.png' }
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-16 bg-white border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Trusted Beauty Brands
          </h2>
          <p className="text-gray-600">
            Partnering with the world's most loved beauty brands
          </p>
        </div>

        {/* Logo Slider */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-16">
            {duplicatedLogos.map((logo, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={getImageUrl(logo.image)}
                  alt={`Beauty Brand ${index + 1}`}
                  className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/120x60/f9fafb/6b7280?text=Brand+${index + 1}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {(content?.stats || [
            { number: '50K+', label: 'Happy Customers' },
            { number: '200+', label: 'Beauty Brands' },
            { number: '5K+', label: 'Products' },
            { number: '98%', label: 'Satisfaction Rate' }
          ]).map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-light text-rose-600 mb-2">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
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