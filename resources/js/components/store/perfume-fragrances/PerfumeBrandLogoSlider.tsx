import React from 'react';
import { getImageUrl } from '@/utils/image-helper';

interface PerfumeBrandLogoSliderProps {
  content?: any;
}

export default function PerfumeBrandLogoSlider({ content }: PerfumeBrandLogoSliderProps) {
  // Handle both nested structure (logos.value) and extracted structure (logos)
  const logos = content?.logos?.value || content?.logos || [
    { image: '/storage/media/29/brand-logo-perfume-1.png', name: 'Brand 1' },
    { image: '/storage/media/30/brand-logo-perfume-2.png', name: 'Brand 2' },
    { image: '/storage/media/31/brand-logo-perfume-4.png', name: 'Brand 4' },
    { image: '/storage/media/32/brand-logo-perfume-5.png', name: 'Brand 5' },
    { image: '/storage/media/33/brand-logo-perfume-6.png', name: 'Brand 6' }
  ];

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-16 bg-white border-t border-b border-purple-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-px bg-amber-400"></div>
            <div className="mx-4">
              <svg className="w-6 h-6 text-purple-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="w-12 h-px bg-amber-400"></div>
          </div>
          
          <h2 className="text-2xl font-light text-purple-800 mb-4">
            {content?.title || 'Prestigious Partners'}
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            {content?.description || 'We proudly feature the world\'s most renowned fragrance houses and emerging artisan perfumers, curating an exclusive collection of luxury scents.'}
          </p>
        </div>

        {/* Logo Slider */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-infinite">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 mx-8 flex items-center justify-center group"
              >
                <div className="relative w-full h-full bg-stone-50 rounded-xl border border-purple-100 flex items-center justify-center hover:border-purple-200 hover:bg-white transition-all duration-300 group-hover:shadow-lg">
                  <img
                    src={getImageUrl(logo.image)}
                    alt={logo.name || `Brand ${index + 1}`}
                    className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/160x60/fafaf9/7c3aed?text=${encodeURIComponent(logo.name || `Brand+${(index % logos.length) + 1}`)}`;
                    }}
                  />
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>


        
        {/* Bottom CTA Section */}
        {(content?.bottom_title || content?.bottom_description || content?.bottom_button_text) && (
          <div className="text-center mt-12 p-8 bg-purple-50 rounded-2xl">
            <h3 className="text-xl font-medium text-purple-800 mb-3">
              {content?.bottom_title || 'Looking for a Specific Brand?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {content?.bottom_description || 'We work with hundreds of fragrance brands. Contact us for special requests.'}
            </p>
            <a
              href={content?.bottom_button_link || '/contact'}
              className="inline-flex items-center px-6 py-3 bg-purple-800 text-white rounded-full font-medium hover:bg-purple-900 transition-colors duration-300"
            >
              {content?.bottom_button_text || 'Contact Us'}
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-infinite {
          animation: scroll-infinite 30s linear infinite;
        }
        
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}