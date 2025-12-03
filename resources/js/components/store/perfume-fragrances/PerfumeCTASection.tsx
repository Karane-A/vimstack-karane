import React from 'react';
import { Link } from '@inertiajs/react';

interface PerfumeCTASectionProps {
  content?: any;
  ctaBoxes?: any;
  bottomSection?: any;
}

export default function PerfumeCTASection({ content, ctaBoxes, bottomSection }: PerfumeCTASectionProps) {
  const boxes = ctaBoxes?.value || ctaBoxes || content?.cta_boxes?.value || content?.cta_boxes || [
    { icon: 'nose', title: 'Scent Profiling', subtitle: 'Discover your fragrance personality' },
    { icon: 'star', title: 'VIP Rewards', subtitle: 'Exclusive member benefits' },
    { icon: 'truck', title: 'White Glove Delivery', subtitle: 'Premium packaging & delivery' },
    { icon: 'users', title: 'Fragrance Concierge', subtitle: 'Personal shopping service' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'nose':
        return (
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1s1-.45 1-1v-2.26c.31-.13.64-.24 1-.24s.69.11 1 .24V17c0 .55.45 1 1 1s1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 2.76-2.24 5-5 5s-5-2.24-5-5c0-2.76 2.24-5 5-5z"/>
          </svg>
        );
      case 'star':
        return (
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'truck':
        return (
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white border border-purple-200 rounded-full mb-8">
            <svg className="w-5 h-5 text-purple-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <span className="text-purple-800 font-medium text-sm">{content?.badge_text || 'Premium Services'}</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
            {content?.title || 'Luxury Experience'}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            {content?.description || 'Discover our exclusive services designed to elevate your fragrance journey with personalized attention and premium care.'}
          </p>
        </div>

        {/* CTA Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {boxes.map((box, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-purple-100 hover:border-purple-200 transform hover:-translate-y-2"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className="relative z-10 mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                  <div className="w-8 h-8 text-purple-800">
                    {getIcon(box.icon)}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-purple-800 transition-colors duration-300">
                  {box.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {box.subtitle}
                </p>
                
                {/* CTA Link */}
                <Link
                  href={box.link || '#'}
                  className="inline-flex items-center text-purple-800 font-medium text-sm group-hover:text-purple-900 transition-colors duration-300"
                >
                  <span>{box.button_text || 'Learn More'}</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              {/* Decorative Line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-purple-50 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-light text-gray-900 mb-4">
                {bottomSection?.title?.value || bottomSection?.title || content?.bottom_title || 'Ready to Find Your Signature Scent?'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                {bottomSection?.description?.value || bottomSection?.description || content?.bottom_description || 'Book a complimentary consultation with our fragrance experts and discover the perfect scent that tells your unique story.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={bottomSection?.primary_button_link?.value || bottomSection?.primary_button_link || content?.primary_button_link || '/consultation'}
                  className="inline-flex items-center px-8 py-4 bg-purple-800 text-white rounded-full font-medium hover:bg-purple-900 transition-colors duration-300"
                >
                  <span>{bottomSection?.primary_button_text?.value || bottomSection?.primary_button_text || content?.primary_button_text || 'Book Consultation'}</span>
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                <Link
                  href={bottomSection?.secondary_button_link?.value || bottomSection?.secondary_button_link || content?.secondary_button_link || '/fragrance-quiz'}
                  className="inline-flex items-center px-8 py-4 border-2 border-purple-800 text-purple-800 rounded-full font-medium hover:bg-purple-800 hover:text-white transition-colors duration-300"
                >
                  <span>{bottomSection?.secondary_button_text?.value || bottomSection?.secondary_button_text || content?.secondary_button_text || 'Take Fragrance Quiz'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}