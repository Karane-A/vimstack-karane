import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BabyKidsFooter } from '@/components/store/baby-kids';

interface BabyKidsRegisterProps {
  store: any;
  storeContent: any;
  customPages: any[];
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
}

export default function BabyKidsRegister({
  store,
  storeContent,
  customPages,
  cartCount,
  wishlistCount,
  isLoggedIn
}: BabyKidsRegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
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
        storeId={store.id}
        storeContent={storeContent}
        customFooter={<BabyKidsFooter storeName={store.name} logo={store.logo} content={storeContent.footer} />}
      >
        <div className="min-h-screen bg-pink-50 relative overflow-hidden">
          {/* Playful Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-16 h-16 bg-pink-300 rounded-lg opacity-40 animate-float transform rotate-12"></div>
            <div className="absolute top-40 right-32 w-12 h-12 bg-blue-300 rounded-full opacity-50 animate-float-delayed"></div>
            <div className="absolute bottom-32 left-40 w-20 h-20 bg-yellow-300 rounded-lg opacity-35 animate-float-slow transform -rotate-6"></div>
            <div className="absolute bottom-20 right-20 w-14 h-14 bg-green-300 rounded-full opacity-45 animate-bounce"></div>
            <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-purple-300 rounded-lg opacity-30 animate-pulse transform rotate-45"></div>
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-70 animate-pulse"></div>
          </div>

          <div className="flex items-center justify-center min-h-screen py-12 px-4 relative z-10">
            <div className="max-w-lg w-full">
              {/* Playful Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-black text-gray-800 mb-3">Join Our Family!</h1>
                <p className="text-lg text-gray-600">Create your parent account</p>
              </div>

              {/* Block Card Design */}
              <div className="relative">
                {/* Shadow Block */}
                <div className="absolute top-2 left-2 w-full h-full rounded-2xl bg-pink-300 opacity-40"></div>
                
                {/* Main Block */}
                <div className="relative bg-white rounded-2xl shadow-xl border-4 border-pink-400 p-8">

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                        <div className="w-5 h-5 bg-green-400 rounded-full mr-2 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        First Name
                      </label>
                      <input
                        id="first_name"
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className={`w-full px-4 py-3 border-3 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-400 focus:outline-none transition-all duration-300 ${
                          errors.first_name ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50/50'
                        }`}
                        placeholder="First name"
                        required
                      />
                      {errors.first_name && (
                        <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                        <div className="w-5 h-5 bg-purple-400 rounded-full mr-2 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Last Name
                      </label>
                      <input
                        id="last_name"
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className={`w-full px-4 py-3 border-3 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 focus:outline-none transition-all duration-300 ${
                          errors.last_name ? 'border-red-300 bg-red-50' : 'border-purple-200 bg-purple-50/50'
                        }`}
                        placeholder="Last name"
                        required
                      />
                      {errors.last_name && (
                        <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <div className="w-5 h-5 bg-pink-400 rounded-full mr-2 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className={`w-full px-6 py-4 border-3 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 focus:outline-none transition-all duration-300 text-lg ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-pink-200 bg-pink-50/50'
                      }`}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <div className="w-5 h-5 bg-blue-400 rounded-full mr-2 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`w-full px-6 py-4 border-3 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all duration-300 text-lg ${
                          errors.password ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50/50'
                        }`}
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            {showPassword ? (
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            ) : (
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            )}
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full mr-2 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={`w-full px-6 py-4 border-3 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 focus:outline-none transition-all duration-300 text-lg ${
                          errors.password_confirmation ? 'border-red-300 bg-red-50' : 'border-yellow-200 bg-yellow-50/50'
                        }`}
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            {showConfirmPassword ? (
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            ) : (
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            )}
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                  </div>
                  
                  {/* Terms */}
                  <div className="flex items-start">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={data.terms}
                      onChange={(e) => setData('terms', e.target.checked)}
                      className="h-5 w-5 text-pink-500 focus:ring-pink-400 border-2 border-pink-300 rounded-lg mt-1"
                      required
                    />
                    <label htmlFor="terms" className="ml-3 block text-sm font-bold text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-pink-500 hover:text-pink-600">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-pink-500 hover:text-pink-600">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-600">{errors.terms}</p>
                  )}
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-pink-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-pink-600 focus:ring-4 focus:ring-pink-200 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Create Account</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                </form>
                
                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 text-lg">
                    Already have an account?{' '}
                    <Link
                      href={route('store.login', store.slug)}
                      className="text-pink-500 hover:text-pink-600 font-bold transition-colors duration-300"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-3deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-10px) scale(1.05); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 5s ease-in-out infinite 1s;
          }
          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite 2s;
          }
        `}</style>
      </StoreLayout>
    </>
  );
}