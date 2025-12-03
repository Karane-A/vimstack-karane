import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface PerfumeNewsletterSectionProps {
  content?: any;
}

export default function PerfumeNewsletterSection({ content }: PerfumeNewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'perfume-fragrances';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

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
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        
        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-purple-200">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
              <span className="text-purple-800 text-sm font-medium">Newsletter</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900">
              Join Our {content?.title || 'Scent Society'}
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {content?.subtitle || 'Be the first to discover new arrivals, limited editions, and receive personalized fragrance recommendations.'}
            </p>
            
            {/* Form */}
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content?.placeholder_text || 'Enter your email address'}
                    className="flex-1 px-6 py-4 border border-purple-200 rounded-full focus:outline-none focus:border-purple-500 transition-colors duration-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-purple-800 text-white rounded-full font-medium hover:bg-purple-900 transition-colors duration-300 disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSubmitting ? 'Joining...' : (content?.button_text || 'Join Society')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center space-x-4 p-6 bg-green-50 rounded-2xl border border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Welcome to Scent Society!</h3>
                  <p className="text-gray-600">Thank you for joining our exclusive fragrance community.</p>
                </div>
              </div>
            )}
            
            <p className="text-gray-500 text-sm">
              {content?.privacy_text || 'Unsubscribe anytime. Your privacy is our priority.'}
            </p>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
          </div>
          
          {/* Right Visual */}
          <div className="relative">
            <div className="space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                {(content?.stats || [
                  { "number": "500+", "label": "Premium Scents" },
                  { "number": "50+", "label": "Luxury Brands" }
                ]).map((stat: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 text-center">
                    <div className="text-2xl font-light text-purple-800 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Main Feature Card */}
              <div className="bg-purple-800 p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-3">{content?.benefits_title || 'Member Benefits'}</h3>
                  <ul className="space-y-2 text-purple-100">
                    {(content?.benefits || [
                      { text: 'Early access to new releases' },
                      { text: 'Exclusive member discounts' },
                      { text: 'Personalized recommendations' }
                    ]).map((benefit: any, index: number) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-amber-400 rounded-full mr-3"></div>
                        {benefit.text || benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}