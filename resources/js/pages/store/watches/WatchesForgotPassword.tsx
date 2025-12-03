import React from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, useForm, Link } from '@inertiajs/react';

interface WatchesForgotPasswordProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  status?: string;
}

export default function WatchesForgotPassword({ 
  store, 
  storeContent, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false,
  status 
}: WatchesForgotPasswordProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.forgot-password', store.slug));
  };

  return (
    <>
      <Head title={`Reset Password - ${store.name}`} />
      
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
        <div className="min-h-screen bg-slate-50 flex">
          {/* Left Side - Account Security */}
          <div className="hidden lg:flex lg:w-1/2 bg-slate-100 items-center justify-center p-12">
            <div className="max-w-md">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-amber-500 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8A6 6 0 006 8v1H3a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-3V8zM8 8a4 4 0 118 0v1H8V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-3xl font-light text-slate-900 mb-4">Account Recovery</h2>
                <p className="text-slate-600 leading-relaxed">
                  We'll help you regain access to your account quickly and securely.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Email Verification</div>
                    <div className="text-slate-600 text-sm">Secure reset link sent to your email</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Secure Process</div>
                    <div className="text-slate-600 text-sm">Your account remains protected</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Quick Access</div>
                    <div className="text-slate-600 text-sm">Back to your collection in minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-light text-slate-900 mb-2">Account Recovery</h1>
                <p className="text-slate-600">We'll send secure reset instructions to your email</p>
              </div>

              {/* Reset Form */}
              <div className="bg-white p-8 shadow-lg border border-slate-200">
              {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-light flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="w-full px-4 py-4 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 pl-12"
                      placeholder="Enter your email address"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-4 h-4 mr-1">⚠</span>{errors.email}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 flex items-center justify-center"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Reset Link'}
                </button>
              </form>

              {/* Navigation Links */}
              <div className="text-center mt-6 pt-6 border-t border-slate-200 space-y-3">
                <div>
                  <Link
                    href={route('store.login', store.slug)}
                    className="text-slate-600 hover:text-amber-600 transition-colors inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Sign In
                  </Link>
                </div>
                <div className="text-slate-400">or</div>
                <div>
                  <Link
                    href={route('store.register', store.slug)}
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    Create New Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </StoreLayout>
    </>
  );
}