import React from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContactSectionProps {
  brandColor?: string;
  flash?: {
    success?: string;
    error?: string;
  };
  settings?: {
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
  };
  sectionData?: {
    title?: string;
    subtitle?: string;
    form_title?: string;
    info_title?: string;
    info_description?: string;
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export default function ContactSection({ flash, settings, sectionData, brandColor = '#3b82f6' }: ContactSectionProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('landing-page.contact'), {
      onSuccess: () => {
        reset();
      },
      preserveState: false,
      preserveScroll: true,
      only: []
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: settings?.contact_email || 'support@Store.com',
      description: 'Send us an email anytime!'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: settings?.contact_phone || '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: settings?.contact_address || '123 Business Ave, Suite 100',
      description: 'San Francisco, CA 94105'
    }
  ].filter(info => info.content); // Only show items that have content

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData?.title || t('Get in Touch')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {sectionData?.subtitle || t('Have questions about Store? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Contact Form */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {sectionData?.form_title || t('Send us a Message')}
              </h3>

              {flash?.success && (flash.success.includes('message') || flash.success.includes('contact') || flash.success.includes('get back')) && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>{flash.success}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Contact form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Full Name')} <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                      placeholder={t("Your full name")}
                      required
                      disabled={processing}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Email Address')} <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                      placeholder={t("your@email.com")}
                      required
                      disabled={processing}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Subject')} <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={data.subject}
                    onChange={(e) => setData('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                    placeholder={t("What's this about?")}
                    required
                    disabled={processing}
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Message')} <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                    placeholder={t("Tell us more about your inquiry...")}
                    required
                    disabled={processing}
                  />
                  {errors.message && (
                    <p className="text-red-600 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full text-white px-8 py-4 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: brandColor }}
                  aria-label={processing ? t('Sending message') : t('Send contact message')}
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('Sending...')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('Send Message')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {sectionData?.info_title || 'Contact Information'}
                </h3>
                <p className="text-gray-600 mb-8">
                  {sectionData?.info_description || 'We\'re here to help and answer any question you might have. We look forward to hearing from you.'}
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColor}15` }}>
                        <IconComponent className="w-6 h-6" style={{ color: brandColor }} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h4>
                        <p className="text-gray-900 font-medium mb-1">
                          {info.content}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FAQ Section */}
              {sectionData?.faqs && sectionData.faqs.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {t('Frequently Asked Questions')}
                  </h4>
                  <div className="space-y-4">
                    {sectionData.faqs.map((faq, index) => (
                      <div key={index}>
                        <h5 className="font-medium text-gray-900 mb-1">
                          {faq.question}
                        </h5>
                        <p className="text-gray-600 text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}