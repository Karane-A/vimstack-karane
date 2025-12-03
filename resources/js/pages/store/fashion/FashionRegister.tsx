import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter } from '@/components/store/fashion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface FashionRegisterProps {
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

export default function FashionRegister({
  store = {},
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionRegisterProps) {
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
      <Head title={`Create Account - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages.length > 0 ? customPages : undefined}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme || 'fashion'}
      >
        {/* Modern Full-Screen Layout */}
        <div className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Content */}
              <div className="text-white">
                <div className="mb-8">
                  <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-light tracking-wider uppercase mb-6">
                    Join Community
                  </div>
                  <h1 className="text-6xl font-thin mb-6 tracking-tight leading-none">
                    Start Your
                    <br />
                    <span className="text-white/60">Journey</span>
                  </h1>
                  <p className="text-white/70 font-light text-xl leading-relaxed max-w-lg">
                    Create your account to unlock exclusive collections and personalized style experiences
                  </p>
                </div>
                
                {/* Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80 font-light">Curated fashion recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80 font-light">Early access to sales & collections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80 font-light">Exclusive member-only events</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Form */}
              <div className="bg-white/95 backdrop-blur-sm p-12 rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-thin tracking-wide mb-4 text-gray-900">Create Account</h2>
                  <p className="text-gray-600 font-light">Fill in your details to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="first_name" className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          id="first_name"
                          type="text"
                          value={data.first_name}
                          onChange={(e) => setData('first_name', e.target.value)}
                          className={`block w-full px-0 py-3 border-0 border-b-2 ${
                            errors.first_name ? 'border-red-500' : 'border-gray-200 focus:border-black'
                          } bg-transparent focus:outline-none transition-colors font-light placeholder-gray-400`}
                          placeholder="John"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <User className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                      </div>
                      {errors.first_name && (
                        <p className="mt-2 text-sm text-red-600 font-light">{errors.first_name}</p>
                      )}
                    </div>
                    
                    <div className="group">
                      <label htmlFor="last_name" className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          id="last_name"
                          type="text"
                          value={data.last_name}
                          onChange={(e) => setData('last_name', e.target.value)}
                          className={`block w-full px-0 py-3 border-0 border-b-2 ${
                            errors.last_name ? 'border-red-500' : 'border-gray-200 focus:border-black'
                          } bg-transparent focus:outline-none transition-colors font-light placeholder-gray-400`}
                          placeholder="Doe"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <User className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                      </div>
                      {errors.last_name && (
                        <p className="mt-2 text-sm text-red-600 font-light">{errors.last_name}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`block w-full px-0 py-3 border-0 border-b-2 ${
                          errors.email ? 'border-red-500' : 'border-gray-200 focus:border-black'
                        } bg-transparent focus:outline-none transition-colors font-light placeholder-gray-400`}
                        placeholder="your.email@example.com"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 font-light">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Password */}
                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`block w-full px-0 py-3 border-0 border-b-2 ${
                          errors.password ? 'border-red-500' : 'border-gray-200 focus:border-black'
                        } bg-transparent focus:outline-none transition-colors font-light placeholder-gray-400`}
                        placeholder="••••••••"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                      </div>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 font-light">{errors.password}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 font-light">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="group">
                    <label htmlFor="password-confirmation" className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="password-confirmation"
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={`block w-full px-0 py-3 border-0 border-b-2 ${
                          errors.password_confirmation ? 'border-red-500' : 'border-gray-200 focus:border-black'
                        } bg-transparent focus:outline-none transition-colors font-light placeholder-gray-400`}
                        placeholder="••••••••"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                        >
                          {showPasswordConfirmation ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                      </div>
                    </div>
                    {errors.password_confirmation && (
                      <p className="mt-2 text-sm text-red-600 font-light">{errors.password_confirmation}</p>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-black text-white py-4 font-light tracking-widest uppercase text-sm hover:bg-gray-900 transition-all duration-300 transform hover:translate-y-[-1px] disabled:opacity-50 disabled:transform-none"
                    >
                      {processing ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </form>
                
                {/* Divider */}
                <div className="my-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-6 bg-white text-gray-500 font-light">Or sign up with</span>
                    </div>
                  </div>
                </div>
                
                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center py-3 px-4 border border-gray-200 bg-white text-sm font-light text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="#4285F4" viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center py-3 px-4 border border-gray-200 bg-white text-sm font-light text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    <svg className="h-4 w-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24,12.073c0,-5.8 -4.701,-10.5 -10.5,-10.5c-5.799,0 -10.5,4.7 -10.5,10.5c0,5.24 3.84,9.58 8.86,10.37v-7.34h-2.67v-3.03h2.67v-2.31c0,-2.63 1.57,-4.09 3.97,-4.09c1.15,0 2.35,0.21 2.35,0.21v2.59h-1.32c-1.31,0 -1.72,0.81 -1.72,1.64v1.97h2.92l-0.47,3.03h-2.45v7.34c5.02,-0.79 8.86,-5.13 8.86,-10.37z"/>
                    </svg>
                    Facebook
                  </button>
                </div>
                
                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 font-light">
                    Already have an account?{' '}
                    <Link
                      href={route('store.login', store.slug)}
                      className="font-light text-black hover:text-gray-600 tracking-wide transition-colors border-b border-black/20 hover:border-black/60"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}