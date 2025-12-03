import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NewsletterSectionProps {
  brandColor?: string;
  flash?: {
    success?: string;
    error?: string;
  };
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    privacy_text?: string;
    benefits?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

export default function NewsletterSection({ flash, settings, sectionData, brandColor = '#3b82f6' }: NewsletterSectionProps) {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('landing-page.subscribe'), {
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    });
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-xl p-8 md:p-12 border border-gray-200">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${brandColor}15` }}>
            <Mail className="w-8 h-8" style={{ color: brandColor }} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData?.title || t('Stay Updated with StoreGo')}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-medium" id="newsletter-description">
            {sectionData?.subtitle || t('Get the latest e-commerce tips, StoreGo updates, and exclusive insights delivered straight to your inbox. Join our community of successful merchants.')}
          </p>

          {flash?.success && (flash.success.includes('newsletter') || flash.success.includes('subscribing') || flash.success.includes('subscribe')) && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>{flash.success}</span>
              </div>
            </div>
          )}

          {isSubmitted && !flash?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>{t("Thank you for subscribing!")}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                  required
                  disabled={processing}
                  aria-label="Email address for newsletter subscription"
                  aria-describedby="newsletter-description"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={processing}
                className="text-white px-8 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
                style={{ backgroundColor: brandColor }}
                aria-label={processing ? t('Subscribing to newsletter') : t('Subscribe to newsletter')}
              >
                {processing && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {processing ? t('Subscribing...') : t('Subscribe')}
              </button>
            </div>
          </form>

          <p className="text-gray-500 text-sm mt-4">
            {sectionData?.privacy_text || 'No spam, unsubscribe at any time. We respect your privacy.'}
          </p>

          {/* Benefits */}
          {sectionData?.benefits && sectionData.benefits.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {sectionData.benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-gray-700 text-xl">{benefit.icon}</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}