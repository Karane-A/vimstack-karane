import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

interface WatchesLoginProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function WatchesLogin({ 
  store, 
  storeContent, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: WatchesLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.login', store.slug));
  };

  return (
    <>
      <Head title={`Login - ${store.name}`} />
      
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
          {/* Left Side - Watch Collection */}
          <div className="hidden lg:flex lg:w-1/2 bg-slate-100 items-center justify-center p-12">
            <div className="max-w-md">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-amber-500 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-3xl font-light text-slate-900 mb-4">Your Collection</h2>
                <p className="text-slate-600 leading-relaxed">
                  Access your saved watches, order history, and exclusive member benefits.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Saved Watches</div>
                    <div className="text-slate-600 text-sm">Your wishlist & favorites</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Order History</div>
                    <div className="text-slate-600 text-sm">Track your purchases</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Member Benefits</div>
                    <div className="text-slate-600 text-sm">Exclusive offers & support</div>
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
                <h1 className="text-3xl font-light text-slate-900 mb-2">Sign In</h1>
                <p className="text-slate-600">Access your horological collection</p>
              </div>

              {/* Login Form */}
              <div className="bg-white p-8 shadow-lg border border-slate-200">
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
                        placeholder="your.email@example.com"
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

                  {/* Password */}
                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-4 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 pl-12 pr-12"
                        placeholder="Enter your password"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="w-4 h-4 mr-1">⚠</span>{errors.password}</p>}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-4 w-4 text-amber-500 border-slate-300 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-slate-600">Remember me</span>
                    </label>
                    <Link
                      href={route('store.forgot-password', store.slug)}
                      className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
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
                        Signing In...
                      </>
                    ) : 'Sign In'}
                  </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-6 pt-6 border-t border-slate-200">
                  <p className="text-slate-600 mb-3">
                    Don't have an account?
                  </p>
                  <Link
                    href={route('store.register', store.slug)}
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    Create Account
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