import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { PerfumeFooter } from '@/components/store/perfume-fragrances';

interface PerfumeForgotPasswordProps {
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function PerfumeForgotPassword({
  store = {},
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: PerfumeForgotPasswordProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.forgot-password.send', store.slug));
  };

  return (
    <>
      <Head title={`Forgot Password - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeId={store.id}
        customFooter={<PerfumeFooter storeName={store.name} logo={store.logo} content={storeContent?.footer} />}
      >
        <div className="min-h-screen bg-stone-100 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            
            {/* Card */}
            <div className="bg-purple-50 rounded-3xl p-8 shadow-xl border border-purple-200">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <svg className="w-10 h-10 text-purple-800" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-light text-purple-800 mb-2">Reset Password</h1>
                <p className="text-gray-600">Enter your email to receive reset instructions</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                      errors.email ? 'border-red-300' : ''
                    }`}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-purple-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-900 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50"
                >
                  {processing ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href={route('store.login', store.slug)}
                  className="inline-flex items-center text-purple-800 hover:text-purple-900 font-medium transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}