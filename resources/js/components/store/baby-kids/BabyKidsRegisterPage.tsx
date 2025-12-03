import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';

interface BabyKidsRegisterPageProps {
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

export default function BabyKidsRegisterPage({
  store = {},
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BabyKidsRegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  
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
      <Head title={`Register - ${store.name}`} />
      
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
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Join Our Family!</h1>
                <p className="text-gray-600 text-lg">Create your account and start shopping</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={data.first_name}
                      onChange={(e) => setData('first_name', e.target.value)}
                      className={`w-full px-4 py-3 border-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all duration-300 ${
                        errors.first_name ? 'border-red-400 bg-red-50' : 'border-pink-300 focus:border-pink-500 bg-pink-50'
                      }`}
                      placeholder="John"
                      required
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-xs text-red-600 font-semibold">{errors.first_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={data.last_name}
                      onChange={(e) => setData('last_name', e.target.value)}
                      className={`w-full px-4 py-3 border-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all duration-300 ${
                        errors.last_name ? 'border-red-400 bg-red-50' : 'border-pink-300 focus:border-pink-500 bg-pink-50'
                      }`}
                      placeholder="Doe"
                      required
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-xs text-red-600 font-semibold">{errors.last_name}</p>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className={`w-full px-6 py-4 pr-16 border-3 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all duration-300 ${
                        errors.password ? 'border-red-400 bg-red-50' : 'border-pink-300 focus:border-pink-500 bg-pink-50'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors p-1"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        {showPassword ? (
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        ) : (
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 font-semibold">{errors.password}</p>
                  )}
                </div>
                
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      className={`w-full px-6 py-4 pr-16 border-3 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all duration-300 ${
                        errors.password_confirmation ? 'border-red-400 bg-red-50' : 'border-pink-300 focus:border-pink-500 bg-pink-50'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors p-1"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        {showPasswordConfirmation ? (
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        ) : (
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-2 text-sm text-red-600 font-semibold">{errors.password_confirmation}</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-pink-500 text-white py-5 rounded-2xl font-bold text-xl hover:bg-pink-600 focus:ring-4 focus:ring-pink-200 transition-all duration-300 shadow-xl disabled:opacity-50 transform hover:scale-105"
                >
                  {processing ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              
              {/* Login Link */}
              <div className="mt-6 text-center bg-pink-50 p-4 rounded-2xl">
                <p className="text-gray-600 text-lg">
                  Already part of our family?{' '}
                  <Link
                    href={route('store.login', store.slug)}
                    className="font-bold text-pink-500 hover:text-pink-600 transition-colors underline"
                  >
                    Sign In
                  </Link>
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