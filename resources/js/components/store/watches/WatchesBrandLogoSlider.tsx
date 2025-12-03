import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface WatchesBrandLogoSliderProps {
  content?: any;
}

export default function WatchesBrandLogoSlider({ content }: WatchesBrandLogoSliderProps) {
  // Handle both nested structure (logos.value) and extracted structure (logos)
  const logos = content?.logos?.value || content?.logos || [
    { image: '/storage/media/62/brand-logo-watches-1.png' },
    { image: '/storage/media/63/brand-logo-watches-2.png' },
    { image: '/storage/media/64/brand-logo-watches-3.png' },
    { image: '/storage/media/65/brand-logo-watches-4.png' },
    { image: '/storage/media/66/brand-logo-watches-5.png' },
    { image: '/storage/media/67/brand-logo-watches-6.png' }
  ];

  if (!logos || logos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white border-t border-b border-slate-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-light text-slate-900 mb-4 tracking-wide">
            Authorized Dealer
          </h3>
          <p className="text-slate-600 font-light">
            Trusted by the world's most prestigious watch manufacturers
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center group">
              <img
                src={logo.image ? getImageUrl(logo.image) : `https://placehold.co/200x80/f8fafc/64748b?text=Brand+${index + 1}`}
                alt={`Brand ${index + 1}`}
                className="max-h-12 w-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/200x80/f8fafc/64748b?text=Brand+${index + 1}`;
                }}
              />
            </div>
          ))}
        </div>

        {/* Decorative Line */}
        <div className="flex items-center justify-center mt-12">
          <div className="w-24 h-px bg-amber-500"></div>
        </div>
      </div>
    </section>
  );
}