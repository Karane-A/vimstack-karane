import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface BeautyNewsletterSectionProps {
  content?: any;
}

function BeautyNewsletterSection({ content }: BeautyNewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'beauty';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(route('api.newsletter.subscribe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          email: email,
          store_slug: storeSlug
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSubscribed(true);
        setEmail('');
        
        // Reset the success message after 5 seconds
        setTimeout(() => {
          setIsSubscribed(false);
        }, 5000);
      } else {
        setError(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-rose-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden shadow-xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-100/50 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-rose-200/60 rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-rose-200/40 rounded-full"></div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-5xl font-light text-gray-900 mb-4">
                {content?.title || 'Join Our Beauty Community'}
              </h2>
              
              {/* Highlight */}
              {content?.highlight_text && (
                <p className="text-rose-600 font-semibold mb-6">
                  {content.highlight_text}
                </p>
              )}

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {content?.subtitle || 'Be the first to discover new products, get exclusive beauty tips, and enjoy member-only discounts.'}
              </p>

              {/* Newsletter Form */}
              {isSubscribed ? (
                <div className="max-w-md mx-auto mb-8 p-6 bg-rose-100 rounded-2xl">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-600 mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Our Beauty Community!</h3>
                    <p className="text-gray-600">You've been successfully subscribed to our newsletter.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={content?.placeholder_text || 'Enter your email for beauty updates'}
                        className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-rose-200 transition-all duration-300"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-rose-600 text-white font-semibold rounded-full hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Joining...
                        </div>
                      ) : (
                        content?.button_text || 'Join Community'
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                </form>
              )}

              {/* Privacy Text */}
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                {(content?.privacy_features || ['✓ No spam, ever', '✓ Unsubscribe anytime', '✓ 50K+ happy subscribers']).map((feature, index) => (
                  <span key={index}>{feature}</span>
                ))}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {(content?.benefits || [
                  { icon: '🎁', title: 'Exclusive Offers', description: 'Member-only discounts & early access' },
                  { icon: '✨', title: 'Beauty Tips', description: 'Weekly tutorials & expert advice' },
                  { icon: '💌', title: 'New Arrivals', description: 'First to know about latest products' }
                ]).map((benefit, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-xl">{benefit.icon}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BeautyNewsletterSection;