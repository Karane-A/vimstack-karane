import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

interface JewelryHeroSectionProps {
  content?: any;
}

export default function JewelryHeroSection({ content }: JewelryHeroSectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'jewelry-store';
  const baseUrl = props.base_url;
  return (
    <section className="relative min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={getImageUrl(content?.image || '/storage/media/21/home-banner-jewelry.png')}
          alt="Luxury Jewelry" 
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/1920x1080/1a1a1a/d4af37?text=Luxury+Jewelry';
          }}
        />
      </div>
      
      {/* Content Card */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="bg-white/95 backdrop-blur-md p-16 shadow-2xl border border-neutral-200">
          <div className="w-16 h-px bg-yellow-600 mx-auto mb-8"></div>
          
          <span className="text-yellow-700 text-sm font-medium uppercase tracking-widest mb-6 block">
            {content?.badge_text || 'Exclusive Collection 2024'}
          </span>
          
          <h1 className="text-5xl font-serif text-neutral-900 mb-6 leading-tight">
            {content?.title || 'Timeless Elegance'}
          </h1>
          
          <p className="text-neutral-600 mb-10 text-lg leading-relaxed">
            {content?.subtitle || 'Discover exquisite jewelry crafted with precision and passion.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={content?.button_link ? `${baseUrl}${content.button_link}` : '#'}
              className="bg-yellow-600 text-white px-8 py-4 uppercase text-sm font-medium tracking-wide hover:bg-yellow-700 transition-colors"
            >
              {content?.button_text || 'Explore Collection'}
            </Link>
            <Link 
              href={content?.secondary_button_link ? `${baseUrl}${content.secondary_button_link}` : '#'}
              className="border-2 border-yellow-600 text-yellow-600 px-8 py-4 uppercase text-sm font-medium tracking-wide hover:bg-yellow-600 hover:text-white transition-colors"
            >
              {content?.secondary_button_text || 'Book Consultation'}
            </Link>
          </div>
          
          <div className="w-16 h-px bg-yellow-600 mx-auto mt-8"></div>
        </div>
        
        {/* Info Boxes */}
        <div className="grid grid-cols-3 gap-8 mt-12">
          {(content?.info_boxes || [
            { icon: 'shield', title: 'Lifetime Warranty', description: 'Protected' },
            { icon: 'gem', title: 'Certified', description: 'Authentic' },
            { icon: 'crown', title: 'Bespoke', description: 'Custom Made' }
          ]).map((box, index) => (
            <div key={index} className="text-center text-white">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm mx-auto mb-3 flex items-center justify-center">
                <div className="w-6 h-6 text-yellow-400">
                  {box.icon === 'shield' && <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                  {box.icon === 'gem' && <svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707l-6 6a1 1 0 01-1.414 0l-6-6A1 1 0 013 6V4z" /></svg>}
                  {box.icon === 'crown' && <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                </div>
              </div>
              <h3 className="text-sm font-medium uppercase tracking-wider mb-1">{box.title}</h3>
              <p className="text-xs text-neutral-300">{box.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}