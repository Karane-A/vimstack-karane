import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

interface FurnitureNewsletterSectionProps {
  content?: any;
}

const FurnitureNewsletterSection: React.FC<FurnitureNewsletterSectionProps> = ({ content }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'furniture-interior';

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
    <section className="py-20 lg:py-28 bg-amber-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl shadow-amber-200/50 overflow-hidden border-2 border-amber-200 hover:shadow-3xl transition-all duration-500">
            <div className="grid lg:grid-cols-2">
              {/* Left Content */}
              <div className="p-8 lg:p-16 bg-amber-100">
                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 border-amber-300 px-6 py-3 rounded-full mb-8 hover:scale-105 transition-transform duration-300">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  <span className="text-sm font-bold text-amber-800 tracking-wider uppercase">Newsletter</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                  {content?.title || 'Wooden Craft Stories'}
                </h2>
                <p className="text-lg lg:text-xl text-slate-700 mb-10 leading-relaxed">
                  {content?.subtitle || 'Join our community of furniture lovers and get exclusive access to new collections, design tips, and artisan stories.'}
                </p>

                {/* Benefits */}
                <div className="space-y-3">
                  {(content?.benefits || [
                    { text: 'New handcrafted arrivals' },
                    { text: 'Design tips & inspiration' }, 
                    { text: 'Exclusive member offers' }
                  ]).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full flex-shrink-0"></div>
                      <span className="text-slate-700 font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Form */}
              <div className="p-8 lg:p-16 flex items-center">
                {!isSubscribed ? (
                  <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="text-center mb-10">
                      <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900">Stay Connected</h3>
                    </div>

                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={content?.placeholder_text || 'your@email.com'}
                        className="w-full px-8 py-5 border-2 border-amber-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white text-slate-900 font-medium text-lg hover:border-amber-300"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-yellow-800 text-white py-5 px-8 rounded-2xl font-bold hover:bg-yellow-900 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Joining...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          {content?.button_text || 'Join Community'}
                        </>
                      )}
                    </button>

                    <p className="text-sm text-slate-600 text-center">
                      {content?.privacy_text || 'Unsubscribe anytime. Your privacy is protected.'}
                    </p>
                    
                    {error && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                        {error}
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center w-full py-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Welcome! 🎉</h3>
                    <p className="text-lg text-slate-700">
                      You're now part of our wooden craft community. Check your inbox!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FurnitureNewsletterSection;