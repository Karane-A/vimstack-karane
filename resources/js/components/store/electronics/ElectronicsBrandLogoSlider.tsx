import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface ElectronicsBrandLogoSliderProps {
  content?: any;
}

export default function ElectronicsBrandLogoSlider({ content }: ElectronicsBrandLogoSliderProps) {
  // Handle both nested structure (logos.value) and extracted structure (logos)
  const logos = content?.logos?.value || content?.logos || [
    { image: '/storage/media/80/brand-logo-electronics-1.png' },
    { image: '/storage/media/81/brand-logo-electronics-3.png' },
    { image: '/storage/media/82/brand-logo-electronics-4.png' },
    { image: '/storage/media/83/brand-logo-electronics-5.png' },
    { image: '/storage/media/84/brand-logo-electronics-6.png' },
    { image: '/storage/media/85/brand-logo-electronics-7.png' },
    { image: '/storage/media/86/brand-logo-electronics-8.png' }
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Trusted by Leading Brands
          </h2>
          <p className="text-gray-600">
            We partner with the world's most innovative technology companies
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-16 items-center">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <img
                  src={getImageUrl(logo.image)}
                  alt={`Brand ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/120x60/f1f5f9/475569?text=Brand+${(index % logos.length) + 1}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}