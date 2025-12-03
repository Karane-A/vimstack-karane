import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface BabyKidsNewsletterSectionProps {
  content?: any;
}

export default function BabyKidsNewsletterSection({ content }: BabyKidsNewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'baby-kids';

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
    <section className="py-20 bg-yellow-50 relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Unique Toy Block Newsletter Card */}
          <div className="relative">
            {/* Shadow Layer */}
            <div className="absolute top-4 left-4 w-full h-full bg-pink-300 rounded-3xl opacity-40"></div>
            
            {/* Main Newsletter Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-pink-400 p-12 text-center">
              {/* Decorative Corner Elements */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Content */}
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                {content?.title || 'Join Our Family!'}
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {content?.subtitle || 'Get exclusive deals, parenting tips, and first access to new arrivals for your little ones!'}
              </p>
              
              {/* Newsletter Form */}
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={content?.placeholder_text || 'Enter your email'}
                      required
                      className="w-full px-6 py-4 rounded-full border-3 border-pink-300 focus:border-pink-500 focus:outline-none text-gray-700 placeholder-gray-500 bg-pink-50 transition-all duration-300 text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? 'Subscribing...' : (content?.button_text || 'Subscribe')}
                  </button>
                </div>
                
                {error && (
                  <div className="text-sm mt-4 text-red-600">
                    {error}
                  </div>
                )}
              </form>

              {/* Fun Benefits Icons */}
              <div className="grid grid-cols-3 gap-6">
                {(content?.benefits || [
                  { title: 'New Arrivals', subtitle: 'First to know' },
                  { title: 'Special Offers', subtitle: 'Exclusive deals' },
                  { title: 'Parenting Tips', subtitle: 'Expert advice' }
                ]).map((benefit: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      index % 3 === 0 ? 'bg-pink-100' :
                      index % 3 === 1 ? 'bg-blue-100' :
                      'bg-yellow-100'
                    }`}>
                      <svg className={`w-8 h-8 ${
                        index % 3 === 0 ? 'text-pink-500' :
                        index % 3 === 1 ? 'text-blue-500' :
                        'text-yellow-500'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        {index === 0 && <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />}
                        {index === 1 && <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />}
                        {index === 2 && <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />}
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">{benefit.title}</h3>
                    <p className="text-xs text-gray-600">{benefit.subtitle}</p>
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