import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { Mail, ArrowLeft, Shield } from 'lucide-react';

interface JewelryForgotPasswordProps {
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
  status?: string;
}

export default function JewelryForgotPassword({
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
  status,
}: JewelryForgotPasswordProps) {
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
        theme={store.theme}
      >
        <div className="min-h-screen bg-yellow-50 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600 rounded-full shadow-lg mb-8">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-light text-gray-800 mb-4 tracking-wide">
                  Reset Password
                </h1>
                <p className="text-gray-600 text-lg font-light">
                  Secure your account with a new password
                </p>
              </div>

              {status && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 text-sm font-light text-center">{status}</p>
                </div>
              )}

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-yellow-200/50 p-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-800 mb-3">
                    Forgot Your Password?
                  </h2>
                  <p className="text-gray-600 font-light leading-relaxed">
                    No worries! Enter your email address and we'll send you a secure link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 tracking-wide uppercase">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-yellow-600 group-focus-within:text-yellow-700 transition-colors" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`block w-full pl-12 pr-4 py-4 border-2 ${
                          errors.email 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-yellow-200 focus:border-yellow-500'
                        } rounded-xl bg-white/70 focus:outline-none focus:ring-0 transition-all duration-300 text-gray-800 placeholder-gray-500`}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 font-light">{errors.email}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-yellow-600 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Reset Link...
                      </div>
                    ) : (
                      'Send Password Reset Link'
                    )}
                  </button>
                </form>

                <div className="mt-10 text-center">
                  <Link
                    href={route('store.login', store.slug)}
                    className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Sign In
                  </Link>
                </div>
              </div>



              <div className="mt-8 text-center">
                <p className="text-gray-600 font-light">
                  Need help?{' '}
                  <Link
                    href="#"
                    className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors border-b border-yellow-300 hover:border-yellow-500"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}