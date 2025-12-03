import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface JewelryNewsletterSectionProps {
  content?: any;
}

export default function JewelryNewsletterSection({ content }: JewelryNewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'jewelry';

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
    <section className="py-20 bg-yellow-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="w-16 h-px bg-yellow-600 mb-8"></div>
            <h2 className="text-4xl font-serif text-neutral-900 mb-6">
              {content?.title || 'Luxury Insider'}
            </h2>
            <p className="text-neutral-600 text-lg mb-8 leading-relaxed">
              {content?.subtitle || 'Be the first to discover new collections and exclusive events.'}
            </p>
            
            {/* Features List */}
            <div className="space-y-4">
              {(content?.features || [
                { title: 'Exclusive collection previews' },
                { title: 'VIP event invitations' },
                { title: 'Personal styling consultations' }
              ]).map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-600"></div>
                  <span className="text-neutral-700">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Form */}
          <div className="bg-white p-10 shadow-2xl border border-neutral-100">
            <div className="text-center mb-8">
              <div className="w-12 h-px bg-yellow-600 mx-auto mb-4"></div>
              <h3 className="text-2xl font-serif text-neutral-900 mb-2">Stay Connected</h3>
              <p className="text-neutral-600 text-sm">Join our exclusive community</p>
            </div>
            
            {isSubscribed ? (
              <div className="text-center p-6 bg-yellow-50 border border-yellow-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-600 mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-neutral-900 mb-2">Welcome to Our Elite Circle!</h3>
                <p className="text-neutral-600">You've been successfully subscribed to our newsletter.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content?.placeholder_text || 'Enter your email address'}
                    className="w-full px-0 py-4 border-0 border-b-2 border-neutral-200 bg-transparent focus:border-yellow-600 focus:outline-none transition-colors text-lg placeholder-neutral-400"
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-600 transition-all duration-300 focus-within:w-full"></div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-600 text-white py-4 font-medium uppercase text-sm tracking-wide hover:bg-yellow-700 transition-colors duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Joining...' : (content?.button_text || 'Join Elite Circle')}
                </button>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="text-center pt-4">
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    {content?.privacy_text || 'Unsubscribe anytime. Privacy guaranteed.'}
                  </p>
                  <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-neutral-400">
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>No Spam</span>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}