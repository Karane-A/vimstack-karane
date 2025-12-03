import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';

interface BabyKidsForgotPasswordPageProps {
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

export default function BabyKidsForgotPasswordPage({
  store = {},
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BabyKidsForgotPasswordPageProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.forgot-password', store.slug));
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
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute top-40 right-32 w-8 h-8 bg-blue-200 rounded-full opacity-50 animate-bounce"></div>
            <div className="absolute bottom-32 left-40 w-16 h-16 bg-yellow-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 right-20 w-6 h-6 bg-green-200 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>

          <div className="w-full max-w-md relative z-10">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-400 relative">
              {/* Top Decoration */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-pink-400 rounded-b-full"></div>
              
              {/* Header */}
              <div className="text-center mb-8 pt-2">
                <div className="w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Forgot Password?</h1>
                <p className="text-gray-600 text-lg">Don't worry! We'll help you reset it quickly</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={`w-full px-6 py-4 border-3 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all duration-300 ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-pink-300 focus:border-pink-500 bg-pink-50'
                    }`}
                    placeholder="your.email@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 font-semibold">{errors.email}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    We'll send you a secure link to reset your password
                  </p>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-pink-500 text-white py-5 rounded-2xl font-bold text-xl hover:bg-pink-600 focus:ring-4 focus:ring-pink-200 transition-all duration-300 shadow-xl disabled:opacity-50 transform hover:scale-105"
                >
                  {processing ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              {/* Back to Login */}
              <div className="mt-8 text-center bg-pink-50 p-4 rounded-2xl">
                <Link
                  href={route('store.login', store.slug)}
                  className="inline-flex items-center font-bold text-pink-500 hover:text-pink-600 transition-colors text-lg underline"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Login
                </Link>
              </div>
              
              {/* Help Text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Remember your password? No problem!
                </p>
              </div>
              
              {/* Bottom Decoration */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-pink-400 rounded-t-full"></div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}