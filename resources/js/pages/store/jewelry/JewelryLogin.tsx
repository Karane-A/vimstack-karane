import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { Mail, Lock, Eye, EyeOff, Gem } from 'lucide-react';

interface JewelryLoginProps {
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

export default function JewelryLogin({
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: JewelryLoginProps) {
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
        theme={store.theme}
      >
        {/* Luxury Cream Background with Subtle Pattern */}
        <div className="min-h-screen bg-yellow-50 relative">
          {/* Elegant Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-lg mx-auto">
              {/* Header with Luxury Styling */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600 rounded-full shadow-lg mb-8">
                  <Gem className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-light text-gray-800 mb-4 tracking-wide">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-lg font-light">
                  Access your exclusive jewelry collection
                </p>
              </div>

              {/* Login Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-yellow-200/50 p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email Field */}
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

                  {/* Password Field */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 tracking-wide uppercase">
                        Password
                      </label>
                      <Link
                        href={route('store.forgot-password', store.slug)}
                        className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-yellow-600 group-focus-within:text-yellow-700 transition-colors" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`block w-full pl-12 pr-12 py-4 border-2 ${
                          errors.password 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-yellow-200 focus:border-yellow-500'
                        } rounded-xl bg-white/70 focus:outline-none focus:ring-0 transition-all duration-300 text-gray-800 placeholder-gray-500`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-yellow-600 hover:text-yellow-700 focus:outline-none transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 font-light">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 font-light">
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Submit Button */}
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
                        Signing In...
                      </div>
                    ) : (
                      'Sign In to Your Account'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-10">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-yellow-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-6 bg-white text-gray-500 font-light">New to our collection?</span>
                    </div>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-gray-600 font-light">
                    Discover exclusive jewelry pieces.{' '}
                    <Link
                      href={route('store.register', store.slug)}
                      className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors border-b border-yellow-300 hover:border-yellow-500"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 text-center">
                <div className="flex items-center justify-center space-x-8 text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-light">Secure Login</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-light">Premium Experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-light">Exclusive Access</span>
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