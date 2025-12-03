import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface FashionNewsletterSectionProps {
  content?: any;
}

export default function FashionNewsletterSection({ content }: FashionNewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'fashion';

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
        setIsSubmitted(true);
        setEmail('');
        
        // Reset the success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
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
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-thin mb-6 tracking-wide">
            {content?.title || 'Style Insider'}
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-white/80 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            {content?.subtitle || 'Be the first to know about new arrivals, exclusive sales, and styling tips from our fashion experts.'}
          </p>
          
          {/* Newsletter Form */}
          {isSubmitted ? (
            <div className="max-w-md mx-auto mb-8 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-2 tracking-wide">Thank You!</h3>
                <p className="text-white/80 font-light">You've been successfully subscribed to our newsletter.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content?.placeholder_text || 'Enter your email for style updates'}
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-white text-black font-medium tracking-wide uppercase text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Joining...' : (content?.button_text || 'Join Now')}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded text-sm font-light">
                  {error}
                </div>
              )}
            </form>
          )}
          
          {/* Privacy Text */}
          <p className="text-white/60 text-sm font-light">
            {content?.privacy_text || 'Unsubscribe anytime. Your style, your choice.'}
          </p>
          

        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 w-2 h-2 bg-white/20 rotate-45"></div>
      <div className="absolute bottom-1/4 right-12 w-3 h-3 bg-white/10 rotate-45"></div>
      <div className="absolute top-1/2 right-8 w-1 h-1 bg-white/30 rotate-45"></div>
    </section>
  );
}