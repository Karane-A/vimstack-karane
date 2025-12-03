import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BabyKidsFooter } from '@/components/store/baby-kids';

interface BabyKidsLoginProps {
  store: any;
  storeContent: any;
  customPages: any[];
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
}

export default function BabyKidsLogin({
  store,
  storeContent,
  customPages,
  cartCount,
  wishlistCount,
  isLoggedIn
}: BabyKidsLoginProps) {
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
            <div className="max-w-md w-full">
              {/* Playful Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-4xl font-black text-gray-800 mb-3">Welcome Back!</h1>
                <p className="text-lg text-gray-600">Sign in to your parent account</p>
              </div>

              {/* Block Card Design */}
              <div className="relative">
                {/* Shadow Block */}
                <div className="absolute top-2 left-2 w-full h-full rounded-2xl bg-pink-300 opacity-40"></div>
                
                {/* Main Block */}
                <div className="relative bg-white rounded-2xl shadow-xl border-4 border-pink-400 p-8">

                <form onSubmit={handleSubmit} className="space-y-6">
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
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label htmlFor="password" className="block text-sm font-bold text-gray-700 flex items-center">
                        <div className="w-5 h-5 bg-blue-400 rounded-full mr-2 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Password
                      </label>
                      <Link
                        href={route('store.forgot-password', store.slug)}
                        className="text-sm text-pink-500 hover:text-pink-600 font-bold transition-colors duration-300"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`w-full px-6 py-4 border-3 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 focus:outline-none transition-all duration-300 text-lg ${
                          errors.password ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50/50'
                        }`}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>
                  
                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-5 w-5 text-pink-500 focus:ring-pink-400 border-2 border-pink-300 rounded-lg"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm font-bold text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-pink-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-pink-600 focus:ring-4 focus:ring-pink-200 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Sign In</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                </form>
                
                {/* Register Link */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 text-lg">
                    Don't have an account?{' '}
                    <Link
                      href={route('store.register', store.slug)}
                      className="text-pink-500 hover:text-pink-600 font-bold transition-colors duration-300"
                    >
                      Create Account
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