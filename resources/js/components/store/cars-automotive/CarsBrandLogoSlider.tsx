import React from 'react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '../../../utils/image-helper';

interface BrandLogo {
  image: string;
}

interface BrandContent {
  logos?: {
    value: BrandLogo[];
  };
  stats?: any;
}

interface CarsBrandLogoSliderProps {
  content?: BrandContent;
}

export default function CarsBrandLogoSlider({ content }: CarsBrandLogoSliderProps) {
  const brandContent = content || {};
  const logos = brandContent.logos || [
    { image: '/storage/brands/automotive-brand1.png' },
    { image: '/storage/brands/automotive-brand2.png' },
    { image: '/storage/brands/automotive-brand3.png' },
    { image: '/storage/brands/automotive-brand4.png' }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 tracking-tight">
            {brandContent.title || 'Trusted Brands'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {brandContent.description || 'We partner with the world\'s leading automotive manufacturers and performance brands'}
          </p>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-8"></div>
        </div>

        {/* Brand Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="group bg-white p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-red-600"
            >
              <img
                src={logo.image ? getImageUrl(logo.image) : `https://placehold.co/150x80/f5f5f5/666666?text=Brand+${index + 1}`}
                alt={`Brand ${index + 1}`}
                className="w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white border-2 border-red-600 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-black mb-4">{brandContent.bottom_title || 'Can\'t Find Your Brand?'}</h3>
            <p className="text-gray-600 mb-6">
              {brandContent.bottom_description || 'We work with hundreds of automotive brands. Contact us for special orders.'}
            </p>
            <a
              href={brandContent.bottom_button_link || '/contact'}
              className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-black text-white font-bold tracking-wider uppercase transition-colors"
            >
              {brandContent.bottom_button_text || 'Contact Us'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}