import React from 'react';
import { Zap, ShieldCheck, Wrench } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { getImageUrl } from '../../../utils/image-helper';

interface HeroContent {
  badge_text?: { value: string };
  title?: { value: string };
  subtitle?: { value: string };
  button_text?: { value: string };
  button_link?: { value: string };
  secondary_button_text?: { value: string };
  secondary_button_link?: { value: string };
  image?: { value: string };
  info_boxes?: {
    value: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

interface CarsHeroSectionProps {
  content?: HeroContent;
}

const iconMap = {
  zap: Zap,
  'shield-check': ShieldCheck,
  wrench: Wrench,
};

export default function CarsHeroSection({ content }: CarsHeroSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'cars-store';
  const baseUrl = props.base_url;
  const heroContent = content || {};

  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroContent.image ? getImageUrl(heroContent.image) : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'})`
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-20 container mx-auto px-4 py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh]">
          <div className="space-y-8">
            {/* Badge */}
            {heroContent.badge_text && (
              <div className="inline-flex items-center px-6 py-3 bg-red-600 text-white text-sm font-bold tracking-wider uppercase">
                {heroContent.badge_text}
              </div>
            )}

            {/* Title */}
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-none">
              {heroContent.title || 'Drive Your Passion'}
            </h1>

            {/* Subtitle */}
            <p className="text-2xl text-gray-200 leading-relaxed max-w-2xl">
              {heroContent.subtitle || 'Discover premium automotive parts and performance upgrades that unleash your vehicle\'s true potential.'}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <a
                href={heroContent.button_link ? `${baseUrl}${heroContent.button_link}` : '#'}
                className="inline-flex items-center justify-center px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-bold tracking-wider uppercase transition-all transform hover:scale-105"
              >
                {heroContent.button_text || 'Shop Parts'}
              </a>
              <a
                href={heroContent.secondary_button_link ? `${baseUrl}${heroContent.secondary_button_link}` : '#'}
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white hover:bg-white hover:text-black font-bold tracking-wider uppercase transition-all transform hover:scale-105"
              >
                {heroContent.secondary_button_text || 'View Catalog'}
              </a>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="space-y-6">
            {heroContent.info_boxes?.map((box, index) => {
              const IconComponent = iconMap[box.icon as keyof typeof iconMap] || Zap;
              return (
                <div key={index} className="flex items-start space-x-6 bg-black/60 backdrop-blur-md p-8 border border-gray-700 hover:border-red-600 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{box.title}</h3>
                    <p className="text-gray-300 text-lg">{box.description}</p>
                  </div>
                </div>
              );
            }) || (
              // Default info boxes if none provided
              <>
                <div className="flex items-start space-x-6 bg-black/60 backdrop-blur-md p-8 border border-gray-700 hover:border-red-600 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Performance Boost</h3>
                    <p className="text-gray-300 text-lg">High-quality performance parts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 bg-black/60 backdrop-blur-md p-8 border border-gray-700 hover:border-red-600 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Warranty Protected</h3>
                    <p className="text-gray-300 text-lg">2-year comprehensive warranty</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 bg-black/60 backdrop-blur-md p-8 border border-gray-700 hover:border-red-600 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <Wrench className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Expert Installation</h3>
                    <p className="text-gray-300 text-lg">Professional installation service</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-600"></div>
    </section>
  );
}