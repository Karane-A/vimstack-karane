import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

interface WatchesRegisterProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function WatchesRegister({ 
  store, 
  storeContent, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: WatchesRegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.register', store.slug));
  };

  return (
    <>
      <Head title={`Create Account - ${store.name}`} />
      
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
          {/* Left Side - Membership Benefits */}
          <div className="hidden lg:flex lg:w-1/2 bg-slate-100 items-center justify-center p-12">
            <div className="max-w-md">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-amber-500 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-3xl font-light text-slate-900 mb-4">Become a Member</h2>
                <p className="text-slate-600 leading-relaxed">
                  Join thousands of watch enthusiasts and unlock exclusive benefits.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Free Shipping</div>
                    <div className="text-slate-600 text-sm">On all orders over $500</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Early Access</div>
                    <div className="text-slate-600 text-sm">New collections & limited editions</div>
                  </div>
                </div>
                
                <div className="bg-white p-4 flex items-center border border-slate-200">
                  <div className="w-10 h-10 bg-amber-500 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Expert Support</div>
                    <div className="text-slate-600 text-sm">24/7 horological assistance</div>
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
                <h1 className="text-3xl font-light text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-600">Begin your horological journey</p>
              </div>

              {/* Register Form */}
              <div className="bg-white p-8 shadow-lg border border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                      First Name
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      value={data.first_name}
                      onChange={(e) => setData('first_name', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300"
                      placeholder="First name"
                      required
                    />
                    {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                  </div>
                  
                  <div className="group">
                    <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      value={data.last_name}
                      onChange={(e) => setData('last_name', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300"
                      placeholder="Last name"
                      required
                    />
                    {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                  </div>
                </div>

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
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                      placeholder="Create a password"
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
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="group">
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-amber-600 transition-colors">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      className="w-full px-4 py-4 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 pl-12 pr-12"
                      placeholder="Confirm your password"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
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
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6 pt-6 border-t border-slate-200">
                <p className="text-slate-600 mb-3">
                  Already have an account?
                </p>
                <Link
                  href={route('store.login', store.slug)}
                  className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  Sign In
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