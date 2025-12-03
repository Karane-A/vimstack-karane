import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter } from '@/components/store/fashion';
import { Mail, ArrowLeft } from 'lucide-react';

interface FashionForgotPasswordProps {
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

export default function FashionForgotPassword({
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionForgotPasswordProps) {
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
        customPages={customPages.length > 0 ? customPages : undefined}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        <div className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-md mx-auto">
              <div className="bg-white/95 backdrop-blur-sm p-12 rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-thin tracking-wide mb-4 text-gray-900">Reset Password</h2>
                  <p className="text-gray-600 font-light">Enter your email to receive reset instructions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-4">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`block w-full px-0 py-4 border-0 border-b-2 ${
                          errors.email ? 'border-red-500' : 'border-gray-200 focus:border-black'
                        } bg-transparent focus:outline-none transition-colors font-light text-lg placeholder-gray-400`}
                        placeholder="your.email@example.com"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 font-light">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-black text-white py-4 font-light tracking-widest uppercase text-sm hover:bg-gray-900 transition-all duration-300 transform hover:translate-y-[-1px] disabled:opacity-50 disabled:transform-none"
                    >
                      {processing ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-10 text-center">
                  <Link
                    href={route('store.login', store.slug)}
                    className="inline-flex items-center text-sm text-gray-600 font-light hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}