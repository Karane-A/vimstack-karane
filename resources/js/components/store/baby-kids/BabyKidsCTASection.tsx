import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface BabyKidsCTASectionProps {
  content?: any;
  ctaBoxes?: any;
}

export default function BabyKidsCTASection({ content, ctaBoxes }: BabyKidsCTASectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'baby-kids-store';
  
  const boxes = Array.isArray(ctaBoxes?.value) ? ctaBoxes.value :
                Array.isArray(ctaBoxes) ? ctaBoxes :
                Array.isArray(content?.cta_boxes?.value) ? content.cta_boxes.value :
                Array.isArray(content?.cta_boxes) ? content.cta_boxes :
                Array.isArray(content?.value) ? content.value :
                Array.isArray(content) ? content : [
    { icon: 'gift', title: 'Gift Cards', subtitle: 'Perfect for baby showers' },
    { icon: 'star', title: 'Size Exchange', subtitle: 'Easy returns & exchanges' },
    { icon: 'users', title: 'Parent Community', subtitle: 'Join our parenting tips group' },
    { icon: 'truck', title: 'Fast Delivery', subtitle: 'Same-day delivery available' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'gift':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
            <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
          </svg>
        );
      case 'star':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      case 'truck':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <section className="py-20 bg-yellow-50 relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            {content?.title || 'Why Parents Choose Us'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {content?.description || 'We\'re committed to making your parenting journey easier with quality products and exceptional service.'}
          </p>
        </div>

        {/* CTA Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {boxes.map((box, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/50"
            >
              {/* Icon Container */}
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                index % 4 === 0 ? 'bg-gradient-to-br from-pink-400 to-pink-500' :
                index % 4 === 1 ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
                index % 4 === 2 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                'bg-gradient-to-br from-green-400 to-green-500'
              }`}>
                {getIcon(box.icon)}
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-500 transition-colors duration-300">
                  {box.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {box.subtitle}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-blue-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Decorative Corner */}
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                index % 4 === 0 ? 'bg-pink-300' :
                index % 4 === 1 ? 'bg-blue-300' :
                index % 4 === 2 ? 'bg-yellow-300' :
                'bg-green-300'
              } opacity-60 group-hover:scale-150 transition-transform duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 max-w-4xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              {content?.bottom_title || 'Ready to Shop for Your Little One?'}
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content?.bottom_description || 'Join thousands of happy parents who trust us for their children\'s clothing needs.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={route('store.products', storeSlug)}
                className="inline-flex items-center px-8 py-4 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 shadow-lg"
              >
                <span>{content?.primary_button_text || 'Start Shopping'}</span>
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link
                href="/size-guide"
                className="inline-flex items-center px-8 py-4 border-2 border-pink-400 text-pink-500 font-semibold rounded-full hover:bg-pink-400 hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>{content?.secondary_button_text || 'Size Guide'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}