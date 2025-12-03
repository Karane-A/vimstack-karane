import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

// Default FAQs if none provided
const DEFAULT_FAQS = [
  {
    id: 1,
    question: 'How does Store SaaS work?',
    answer: 'Store SaaS allows you to create digital business cards that can be shared via QR codes, NFC technology, or direct links. Simply create your card, customize it with your information, and start sharing!'
  },
  {
    id: 2,
    question: 'Is my data secure?',
    answer: 'Yes, we use enterprise-grade security measures to protect your data. All information is encrypted and stored securely. You have full control over your privacy settings.'
  },
  {
    id: 3,
    question: 'Can I customize my digital business card?',
    answer: 'Absolutely! You can customize colors, fonts, layout, add your logo, social media links, and much more. Our platform offers extensive customization options.'
  },
  {
    id: 4,
    question: 'Do I need technical skills to use Store SaaS?',
    answer: 'Not at all! Store SaaS is designed to be user-friendly. You can create and customize your digital business card in minutes without any technical knowledge.'
  },
  {
    id: 5,
    question: 'Can I track who views my card?',
    answer: 'Yes, our analytics feature allows you to track views, clicks, and engagement metrics so you can understand how your network interacts with your card.'
  }
];

interface FaqSectionProps {
  brandColor?: string;
  faqs: Faq[];
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    cta_text?: string;
    button_text?: string;
    default_faqs?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export default function FaqSection({ faqs, settings, sectionData, brandColor = '#3b82f6' }: FaqSectionProps) {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Extract FAQs from settings
  const settingsFaqs = settings?.config_sections?.sections?.find((section: any) => section.key === 'faq')?.faqs?.map((faq: any, index: number) => ({
    id: index + 1,
    question: faq.question,
    answer: faq.answer
  })) || [];
  
  const backendFaqs = sectionData?.default_faqs?.map((faq, index) => ({
    id: index + 1,
    ...faq
  })) || DEFAULT_FAQS;
  
  const displayFaqs = settingsFaqs.length > 0 ? settingsFaqs : (faqs.length > 0 ? faqs : backendFaqs);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData?.title || 'Frequently Asked Questions'}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            {sectionData?.subtitle || 'Got questions? We\'ve got answers. If you can\'t find what you\'re looking for, feel free to contact our support team.'}
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {displayFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-gray-50 border border-gray-200 rounded-lg"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
                aria-expanded={openFaq === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
                aria-describedby={`faq-question-${faq.id}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4" id={`faq-question-${faq.id}`}>
                  {faq.question}
                </h3>
                {openFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
              
              {openFaq === faq.id && (
                <div className="px-6 pb-4 border-t border-gray-200" id={`faq-answer-${faq.id}`} role="region" aria-labelledby={`faq-question-${faq.id}`}>
                  <p className="text-gray-600 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {(sectionData?.cta_text || sectionData?.button_text) && (
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-gray-600 mb-4">
              {sectionData?.cta_text || t('Still have questions?')}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              style={{ backgroundColor: brandColor }}
            >
              {sectionData?.button_text || t('Contact Support')}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}