import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface FashionBrandLogoSliderProps {
  content?: {
    logos?: Array<{
      image: string;
    }>;
  };
}

export default function FashionBrandLogoSlider({ content }: FashionBrandLogoSliderProps) {
  // Handle both nested structure (logos.value) and extracted structure (logos)
  const logos = content?.logos?.value || content?.logos || [
    { image: '/storage/media/37/brand-logo-fashion-1.png' },
    { image: '/storage/media/38/brand-logo-fashion-2.png' },
    { image: '/storage/media/39/brand-logo-fashion-3.png' },
    { image: '/storage/media/40/brand-logo-fashion-4.png' }
  ];

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-thin tracking-wide text-gray-600 uppercase">
            Featured Brands
          </h3>
        </div>
        
        <div className="flex items-center justify-center space-x-12 md:space-x-16 opacity-60 hover:opacity-80 transition-opacity duration-300">
          {logos.map((logo, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={getImageUrl(logo.image)}
                alt={`Brand ${index + 1}`}
                className="h-8 md:h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/120x40/cccccc/666666?text=Brand+${index + 1}`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}