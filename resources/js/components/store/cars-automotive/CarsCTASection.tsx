import React from 'react';
import { Settings, Phone, Truck, Award, ArrowRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface CTABox {
  icon: string;
  title: string;
  subtitle: string;
}

interface CTAContent {
  badge_text?: string;
  title?: string;
  description?: string;
  bottom_title?: string;
  bottom_description?: string;
  primary_button_text?: string;
  primary_button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
}

interface CarsCTASectionProps {
  content?: CTAContent & { cta_boxes?: CTABox[] };
  ctaBoxes?: CTABox[];
}

const iconMap = {
  settings: Settings,
  phone: Phone,
  truck: Truck,
  award: Award,
};

export default function CarsCTASection({ content, ctaBoxes }: CarsCTASectionProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'cars-store';
  const ctaContent = content || {};
  const boxes = ctaBoxes || content?.cta_boxes || [
    { icon: 'settings', title: 'Custom Builds', subtitle: 'Personalized performance packages' },
    { icon: 'phone', title: 'Expert Support', subtitle: 'Technical assistance available' },
    { icon: 'truck', title: 'Fast Shipping', subtitle: 'Same-day shipping on most orders' },
    { icon: 'award', title: 'Pro Installation', subtitle: 'Certified mechanic network' }
  ];

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-red-600 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-red-600 opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-red-600 text-white px-6 py-2 text-sm font-bold tracking-widest uppercase mb-6">
            {ctaContent.badge_text || 'AUTOMOTIVE SERVICES'}
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
            {ctaContent.title || 'Performance Excellence'}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {ctaContent.description || 'Professional automotive services designed for enthusiasts who demand the best'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {boxes.map((box, index) => {
            const IconComponent = iconMap[box.icon as keyof typeof iconMap] || Settings;
            return (
              <div
                key={index}
                className="group text-center p-8 bg-gray-900 hover:bg-red-600 border-2 border-gray-800 hover:border-red-600 transition-all duration-300 cursor-pointer"
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-red-600 group-hover:bg-white mx-auto flex items-center justify-center transition-colors duration-300">
                    <IconComponent className="h-10 w-10 text-white group-hover:text-red-600" />
                  </div>
                </div>
                <h3 className="text-xl font-black mb-3 text-white">
                  {box.title}
                </h3>
                <p className="text-gray-300 group-hover:text-white transition-colors">
                  {box.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-red-600 p-12 text-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
          
          <h3 className="text-4xl font-black text-white mb-6 tracking-tight">{ctaContent.bottom_title?.value || ctaContent.bottom_title || 'Ready to Boost Your Performance?'}</h3>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            {ctaContent.bottom_description?.value || ctaContent.bottom_description || 'Join thousands of automotive enthusiasts who trust our expertise for their performance needs'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={ctaContent.primary_button_link?.value || ctaContent.primary_button_link || route('store.products', storeSlug)}
              className="inline-flex items-center px-10 py-4 bg-white text-red-600 hover:bg-gray-900 hover:text-white font-bold tracking-wider uppercase transition-colors"
            >
              {ctaContent.primary_button_text?.value || ctaContent.primary_button_text || 'Shop Performance Parts'}
              <ArrowRight className="h-5 w-5 ml-3" />
            </a>
            <a
              href={ctaContent.secondary_button_link?.value || ctaContent.secondary_button_link || '/contact'}
              className="inline-flex items-center px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-black font-bold tracking-wider uppercase transition-colors"
            >
              {ctaContent.secondary_button_text?.value || ctaContent.secondary_button_text || 'Get Expert Consultation'}
              <Phone className="h-5 w-5 ml-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}