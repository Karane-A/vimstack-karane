import React from 'react';

interface FurnitureCTASectionProps {
  content?: any;
  ctaBoxes?: any;
  bottomSection?: any;
}

function FurnitureCTASection({ content, ctaBoxes, bottomSection }: FurnitureCTASectionProps) {
  const boxes = ctaBoxes?.value || ctaBoxes || content?.value || content || [
    { icon: 'palette', title: 'Interior Design', subtitle: 'Professional design consultation' },
    { icon: 'ruler', title: 'Custom Furniture', subtitle: 'Bespoke pieces made to order' },
    { icon: 'home', title: 'Room Planning', subtitle: '3D visualization & layout' },
    { icon: 'award', title: 'Premium Materials', subtitle: 'Sustainable & luxury finishes' }
  ];
  
  const ctaBottom = bottomSection || {};

  const renderIcon = (iconName: string) => {
    const iconClass = "w-8 h-8";
    
    switch (iconName) {
      case 'palette':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
      case 'ruler':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'home':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      case 'award':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-stone-50 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* CTA Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {boxes.map((box, index) => (
            <div
              key={index}
              className="group bg-white/95 backdrop-blur-sm rounded-3xl p-8 lg:p-10 text-center hover:shadow-2xl transition-all duration-500 border-2 border-yellow-200 shadow-lg transform hover:-translate-y-3 hover:scale-105"
            >
              <div className="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-yellow-700 group-hover:bg-yellow-200 transition-all duration-500 shadow-xl group-hover:scale-110">
                {renderIcon(box.icon)}
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                {box.title}
              </h3>
              <p className="text-slate-700 text-base font-medium leading-relaxed">
                {box.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              {ctaBottom?.title || 'Ready to Transform Your Space?'}
            </h2>
            <p className="text-lg lg:text-xl text-slate-700 mb-12 leading-relaxed max-w-4xl mx-auto">
              {ctaBottom?.description || 'Schedule a free consultation with our wooden furniture experts and discover how we can bring your vision to life.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href={ctaBottom?.primary_button_link || '#consultation'}
                className="bg-yellow-800 text-white px-12 py-5 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {ctaBottom?.primary_button_text || 'Book Free Consultation'}
              </a>
              <a
                href={ctaBottom?.secondary_button_link || '#portfolio'}
                className="border-3 border-yellow-700 text-yellow-800 px-12 py-5 rounded-2xl font-bold hover:bg-yellow-800 hover:text-white hover:border-yellow-800 transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {ctaBottom?.secondary_button_text || 'View Portfolio'}
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>
    </section>
  );
}

export default FurnitureCTASection;