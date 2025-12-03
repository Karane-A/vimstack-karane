import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface NewsletterContent {
  title?: { value: string };
  subtitle?: { value: string };
  placeholder_text?: { value: string };
  button_text?: { value: string };
  privacy_text?: { value: string };
}

interface CarsNewsletterSectionProps {
  content?: NewsletterContent;
}

export default function CarsNewsletterSection({ content }: CarsNewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'cars';

  const newsletterContent = content || {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight">
                {newsletterContent.title || 'Auto Insider'}
              </h2>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {newsletterContent.subtitle || 'Get the latest updates on new arrivals, exclusive deals, and expert automotive tips.'}
            </p>
          </div>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterContent.placeholder_text || 'Enter your email for auto updates'}
                    className="w-full px-6 py-4 bg-white text-black font-medium placeholder-gray-500 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      {newsletterContent.button_text || 'Subscribe'}
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-400">
                {newsletterContent.privacy_text || 'Unsubscribe anytime. Your privacy matters.'}
              </p>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500 mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Successfully Subscribed!</h3>
                  <p className="text-gray-300">You'll receive the latest automotive updates and exclusive deals.</p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {(newsletterContent.features || [
              { number: '1', title: 'New Arrivals', description: 'Be first to know about latest automotive parts and accessories' },
              { number: '2', title: 'Exclusive Deals', description: 'Get access to subscriber-only discounts and promotions' },
              { number: '3', title: 'Expert Tips', description: 'Receive installation guides and maintenance advice from pros' }
            ]).map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{feature.number}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
    </section>
  );
}