import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/utils/image-helper';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating: number;
}

// Default testimonials if none provided
const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: 'Alex Thompson',
    role: 'Store Owner',
    company: 'Fashion Hub',
    content: 'StoreGo has revolutionized how I manage my multiple online stores. The multi-store dashboard is a game-changer!',
    rating: 5
  },
  {
    id: 2,
    name: 'Maria Garcia',
    role: 'E-commerce Manager',
    company: 'Electronics Plus',
    content: 'The analytics and inventory management features help me track my sales ROI across all stores. Highly recommend for any merchant.',
    rating: 5
  },
  {
    id: 3,
    name: 'James Wilson',
    role: 'Entrepreneur',
    company: 'Home Decor Co.',
    content: 'Clean, professional, and incredibly easy to use. My customers love the seamless shopping experience across all my stores.',
    rating: 5
  }
];

interface TestimonialsSectionProps {
  brandColor?: string;
  testimonials: Testimonial[];
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    trust_title?: string;
    trust_stats?: Array<{
      value: string;
      label: string;
      color: string;
    }>;
    default_testimonials?: Array<{
      name: string;
      role: string;
      company?: string;
      content: string;
      rating: number;
    }>;
  };
}

export default function TestimonialsSection({ testimonials, settings, sectionData, brandColor = '#3b82f6' }: TestimonialsSectionProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  
  // Extract testimonials from settings
  const settingsTestimonials = settings?.config_sections?.sections?.find((section: any) => section.key === 'testimonials')?.testimonials?.map((testimonial: any, index: number) => ({
    id: index + 1,
    name: testimonial.name,
    role: testimonial.role,
    company: testimonial.company,
    content: testimonial.content,
    rating: testimonial.rating || 5,
    avatar: testimonial.avatar
  })) || [];
  
  // Fallback testimonials if none provided
  const defaultTestimonials = sectionData?.default_testimonials?.map((testimonial, index) => ({
    id: index + 1,
    ...testimonial
  })) || DEFAULT_TESTIMONIALS;

  const displayTestimonials = settingsTestimonials.length > 0 ? settingsTestimonials : (testimonials.length > 0 ? testimonials : defaultTestimonials);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-current' : 'text-gray-300'
        }`}
        style={index < rating ? { color: brandColor } : {}}
      />
    ));
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData?.title || t('What Our Clients Say')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {sectionData?.subtitle || t("Don't just take our word for it. Here's what merchants around the world are saying about StoreGo.")}
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {displayTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 left-6">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                  <Quote className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4 pt-2">
                {renderStars(testimonial.rating)}
              </div>

              {/* Testimonial Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: brandColor }}>
                  {testimonial.avatar ? (
                    <img
                      src={getImageUrl(testimonial.avatar)}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}
                    {testimonial.company && (
                      <span className="text-gray-400"> • {testimonial.company}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        {(sectionData?.trust_stats && sectionData.trust_stats.length > 0) && (
          <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {sectionData?.trust_title || 'Trusted by Professionals Worldwide'}
              </h3>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {sectionData.trust_stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}