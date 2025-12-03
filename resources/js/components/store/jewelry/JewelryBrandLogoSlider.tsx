import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface JewelryBrandLogoSliderProps {
  content?: any;
}

export default function JewelryBrandLogoSlider({ content }: JewelryBrandLogoSliderProps) {
  // Handle both nested structure (logos.value) and extracted structure (logos)
  const logos = content?.logos?.value || content?.logos || [
    { image: '/storage/media/22/brand-logo-jewelry-1.png' },
    { image: '/storage/media/23/brand-logo-jewelry-2.png' },
    { image: '/storage/media/24/brand-logo-jewelry-3.png' },
    { image: '/storage/media/25/brand-logo-jewelry-4.png' }
  ];

  return (
    <section className="py-20 bg-white border-t border-b border-stone-200">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extralight text-stone-900 mb-4 tracking-wide">
            Prestigious Partners
          </h2>
          <p className="text-stone-600 font-light">
            Collaborating with the world's finest jewelry houses and luxury brands
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
          {logos.map((logo, index) => (
            <div key={index} className="group flex items-center justify-center p-8 hover:bg-stone-50 transition-colors duration-300">
              <img
                src={getImageUrl(logo.image)}
                alt={`Partner Brand ${index + 1}`}
                className="max-h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/200x80/f5f5dc/8b7355?text=Brand+${index + 1}`;
                }}
              />
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}