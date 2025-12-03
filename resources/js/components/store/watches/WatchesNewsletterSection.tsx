import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface WatchesNewsletterSectionProps {
  content?: any;
}

export default function WatchesNewsletterSection({ content }: WatchesNewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'watches';

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
    <section className="py-24 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-5xl font-light text-slate-900 mb-6 tracking-tight">
            {content?.title || 'Timekeeper\'s Circle'}
          </h2>
          <p className="text-lg text-slate-600 font-light mb-12 leading-relaxed">
            {content?.subtitle || 'Join our exclusive community for early access to new releases, collector insights, and horological expertise.'}
          </p>

          {/* Newsletter Form */}
          {isSubmitted ? (
            <div className="max-w-lg mx-auto mb-8 p-6 bg-slate-50 border border-slate-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500 mb-4">
                  <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-2 tracking-wide text-slate-900">Thank You!</h3>
                <p className="text-slate-600 font-light">You've joined our exclusive timekeeper's circle.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content?.placeholder_text || 'Enter your email for exclusive updates'}
                  className="flex-1 px-6 py-4 border border-slate-300 focus:border-slate-900 focus:outline-none font-light text-slate-900 placeholder-slate-500"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-slate-900 text-white font-medium tracking-wider uppercase text-sm hover:bg-slate-800 transition-colors duration-300 disabled:bg-slate-400"
                >
                  {isSubmitting ? 'Joining...' : (content?.button_text || 'Join Circle')}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-light">
                  {error}
                </div>
              )}
            </form>
          )}

          {/* Privacy Text */}
          <p className="text-sm text-slate-500 font-light">
            {content?.privacy_text || 'Unsubscribe anytime. Your time, your choice.'}
          </p>

          {/* Decorative Elements */}
          <div className="flex items-center justify-center mt-12 gap-8">
            <div className="w-16 h-px bg-slate-300"></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="w-16 h-px bg-slate-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}