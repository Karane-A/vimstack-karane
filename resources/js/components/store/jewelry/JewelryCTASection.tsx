import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface JewelryCTASectionProps {
  content?: any;
  ctaBoxes?: any;
  bottomSection?: any;
}

export default function JewelryCTASection({ content, ctaBoxes, bottomSection }: JewelryCTASectionProps) {
  const { props } = usePage();

  const boxes = ctaBoxes?.value || ctaBoxes || content?.value || content || [
    { icon: 'diamond', title: 'Custom Design', subtitle: 'Bring your vision to life' },
    { icon: 'clock', title: 'Watch Services', subtitle: 'Expert maintenance & repair' },
    { icon: 'gift', title: 'Gift Concierge', subtitle: 'Personalized gift selection' },
    { icon: 'star', title: 'VIP Membership', subtitle: 'Exclusive privileges & events' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'diamond':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707l-6 6a1 1 0 01-1.414 0l-6-6A1 1 0 013 6V4z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
        );
      case 'gift':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="20,12 20,22 4,22 4,12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="m5,7 0,0a2,2 0 0,1 0,-4c1.1,0 2.1,.9 2,2h6c-.1,-1.1 .9,-2 2,-2a2,2 0 0,1 0,4"></path>
          </svg>
        );
      case 'star':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707l-6 6a1 1 0 01-1.414 0l-6-6A1 1 0 013 6V4z" />
          </svg>
        );
    }
  };

  return (
    <section className="py-24 bg-stone-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {boxes.map((box, index) => (
            <div key={index} className="group text-center p-8 bg-white hover:bg-stone-50 transition-colors duration-300 border border-stone-200 hover:border-amber-300">
              {/* Icon */}
              <div className="w-16 h-16 bg-stone-100 group-hover:bg-amber-700 flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <div className="text-stone-600 group-hover:text-white transition-colors duration-300">
                  {getIcon(box.icon)}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-light text-stone-900 mb-3 tracking-wide group-hover:text-amber-700 transition-colors duration-300">
                {box.title}
              </h3>
              <p className="text-stone-600 font-light text-sm leading-relaxed">
                {box.subtitle}
              </p>
              
              {/* Hover Accent */}
              <div className="w-8 h-px bg-amber-600 mx-auto mt-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-extralight text-stone-900 mb-6 tracking-tight">
            {bottomSection?.title?.value || bottomSection?.title || 'Experience Luxury Service'}
          </h3>
          <p className="text-lg text-stone-600 font-light mb-8 max-w-2xl mx-auto">
            {bottomSection?.description?.value || bottomSection?.description || 'Our dedicated team of jewelry experts is here to provide personalized service and ensure your complete satisfaction.'}
          </p>
          <Link
            href={bottomSection?.button_link?.value || bottomSection?.button_link || '#'}
            className="inline-flex items-center bg-yellow-600 text-white px-10 py-4 font-medium uppercase text-sm hover:bg-yellow-700 transition-colors duration-300"
          >
            <span>{bottomSection?.button_text?.value || bottomSection?.button_text || 'Contact Our Experts'}</span>
            <svg className="w-4 h-4 ml-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}