import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter } from '@/components/store/fashion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface FashionLoginProps {
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

export default function FashionLogin({
  store = {},
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionLoginProps) {
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
                    Member Access
                  </div>
                  <h1 className="text-6xl font-thin mb-6 tracking-tight leading-none">
                    Welcome
                    <br />
                    <span className="text-white/60">Back</span>
                  </h1>
                  <p className="text-white/70 font-light text-xl leading-relaxed max-w-lg">
                    Access your personal style sanctuary and exclusive fashion collections
                  </p>
                </div>
                
                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80 font-light">Exclusive member collections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80 font-light">Personal style recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-white/80 font-light">Priority access to new arrivals</span>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Form */}
              <div className="bg-white/95 backdrop-blur-sm p-12 rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-thin tracking-wide mb-4 text-gray-900">Sign In</h2>
                  <p className="text-gray-600 font-light">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email */}
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
                  
                  {/* Password */}
                  <div className="group">
                    <div className="flex items-center justify-between mb-4">
                      <label htmlFor="password" className="block text-sm font-light tracking-widest uppercase text-gray-700">
                        Password
                      </label>
                      <Link
                        href={route('store.forgot-password', store.slug)}
                        className="text-sm text-black hover:text-gray-600 font-light tracking-wide transition-colors"
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
                        className={`block w-full px-0 py-4 border-0 border-b-2 ${
                          errors.password ? 'border-red-500' : 'border-gray-200 focus:border-black'
                        } bg-transparent focus:outline-none transition-colors font-light text-lg placeholder-gray-400`}
                        placeholder="••••••••"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                      </div>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 font-light">{errors.password}</p>
                    )}
                  </div>
                  
                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 font-light">
                        Remember me
                      </label>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-black text-white py-4 font-light tracking-widest uppercase text-sm hover:bg-gray-900 transition-all duration-300 transform hover:translate-y-[-1px] disabled:opacity-50 disabled:transform-none"
                    >
                      {processing ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                </form>
                
                {/* Divider */}
                <div className="my-10">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-6 bg-white text-gray-500 font-light">Or continue with</span>
                    </div>
                  </div>
                </div>
                
                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center py-3 px-4 border border-gray-200 bg-white text-sm font-light text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    <svg className="h-5 w-5 mr-3" fill="#4285F4" viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center py-3 px-4 border border-gray-200 bg-white text-sm font-light text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    <svg className="h-5 w-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24,12.073c0,-5.8 -4.701,-10.5 -10.5,-10.5c-5.799,0 -10.5,4.7 -10.5,10.5c0,5.24 3.84,9.58 8.86,10.37v-7.34h-2.67v-3.03h2.67v-2.31c0,-2.63 1.57,-4.09 3.97,-4.09c1.15,0 2.35,0.21 2.35,0.21v2.59h-1.32c-1.31,0 -1.72,0.81 -1.72,1.64v1.97h2.92l-0.47,3.03h-2.45v7.34c5.02,-0.79 8.86,-5.13 8.86,-10.37z"/>
                    </svg>
                    Facebook
                  </button>
                </div>
                
                {/* Register Link */}
                <div className="mt-10 text-center">
                  <p className="text-sm text-gray-600 font-light">
                    Don't have an account?{' '}
                    <Link
                      href={route('store.register', store.slug)}
                      className="font-light text-black hover:text-gray-600 tracking-wide transition-colors border-b border-black/20 hover:border-black/60"
                    >
                      Create Account
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