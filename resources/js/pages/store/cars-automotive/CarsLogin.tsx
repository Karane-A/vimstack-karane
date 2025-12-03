import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, Zap, Shield, Wrench } from 'lucide-react';

interface CarsLoginProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function CarsLogin({ 
  store, 
  storeContent, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: CarsLoginProps) {
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
        {/* Light Industrial Layout */}
        <div className="min-h-screen bg-gray-100 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 border-2 border-red-600 opacity-5 rotate-45"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-red-600 opacity-5 rotate-12"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-red-600 opacity-3 rotate-45"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
              {/* Left Side - Branding */}
              <div className="text-black space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-red-600 rotate-45"></div>
                    <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Member Access</span>
                    <div className="w-4 h-4 bg-red-600 rotate-45"></div>
                  </div>
                  
                  <h1 className="text-7xl font-black tracking-tight leading-none">
                    DRIVE
                    <br />
                    <span className="text-red-600">ACCESS</span>
                  </h1>
                  
                  <p className="text-xl text-gray-700 font-medium leading-relaxed max-w-lg">
                    Enter the garage. Access premium automotive parts, exclusive deals, and performance upgrades.
                  </p>
                </div>

                {/* Performance Features */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Performance Parts</h3>
                      <p className="text-gray-600 text-sm">High-grade automotive components</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Warranty Protection</h3>
                      <p className="text-gray-600 text-sm">Comprehensive coverage included</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Expert Support</h3>
                      <p className="text-gray-600 text-sm">Technical assistance available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="bg-white border-2 border-red-600 shadow-2xl p-10">
                <div className="mb-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-2 h-2 bg-red-600 rotate-45 mr-3"></div>
                    <h2 className="text-3xl font-black text-black tracking-wider">LOGIN</h2>
                    <div className="w-2 h-2 bg-red-600 rotate-45 ml-3"></div>
                  </div>
                  <p className="text-gray-600 text-center font-medium">Access your automotive account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-red-600 font-bold tracking-widest uppercase text-sm mb-4">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`w-full bg-gray-50 border-2 text-black px-6 py-4 font-medium focus:outline-none transition-all ${
                          errors.email 
                            ? 'border-red-500' 
                            : 'border-gray-300 focus:border-red-600'
                        } placeholder-gray-500`}
                        placeholder="your.email@example.com"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Mail className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-3 text-sm text-red-500 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-red-600 font-bold tracking-widest uppercase text-sm mb-4">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`w-full bg-gray-50 border-2 text-black px-6 py-4 font-medium focus:outline-none transition-all ${
                          errors.password 
                            ? 'border-red-500' 
                            : 'border-gray-300 focus:border-red-600'
                        } placeholder-gray-500`}
                        placeholder="••••••••••••"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <Lock className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    {errors.password && (
                      <p className="mt-3 text-sm text-red-500 font-medium">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="w-5 h-5 bg-white border-2 border-gray-300 text-red-600 focus:ring-red-600 focus:ring-2"
                      />
                      <span className="ml-3 text-gray-700 font-medium">Remember me</span>
                    </label>
                    <Link
                      href={route('store.forgot-password', store.slug)}
                      className="text-red-600 hover:text-red-400 font-bold text-sm tracking-wider uppercase transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-5 font-black tracking-widest uppercase text-lg transition-all transform hover:scale-105 disabled:scale-100 border-2 border-red-600 hover:border-red-500"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>ACCESSING...</span>
                      </div>
                    ) : (
                      'ACCESS GARAGE'
                    )}
                  </button>
                </form>

                {/* Register Link */}
                <div className="mt-10 text-center">
                  <div className="w-full h-px bg-gray-300 mb-6"></div>
                  <p className="text-gray-600 font-medium">
                    New to the garage?{' '}
                    <Link
                      href={route('store.register', store.slug)}
                      className="text-red-600 hover:text-red-700 font-bold tracking-wider uppercase transition-colors"
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