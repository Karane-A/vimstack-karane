import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, User, Zap, Shield, Wrench } from 'lucide-react';

interface CarsRegisterProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function CarsRegister({ 
  store, 
  storeContent, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: CarsRegisterProps) {
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
        {/* Light Industrial Layout */}
        <div className="min-h-screen bg-gray-100 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-80 h-80 border-2 border-red-600 opacity-5 rotate-12"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 border-2 border-red-600 opacity-5 rotate-45"></div>
            <div className="absolute top-1/3 right-1/4 w-40 h-40 border border-red-600 opacity-3 rotate-12"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
              {/* Left Side - Branding */}
              <div className="text-black space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-red-600 rotate-45"></div>
                    <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Join The Crew</span>
                    <div className="w-4 h-4 bg-red-600 rotate-45"></div>
                  </div>
                  
                  <h1 className="text-7xl font-black tracking-tight leading-none">
                    ENTER
                    <br />
                    <span className="text-red-600">GARAGE</span>
                  </h1>
                  
                  <p className="text-xl text-gray-700 font-medium leading-relaxed max-w-lg">
                    Join the elite automotive community. Get access to premium parts, exclusive deals, and expert support.
                  </p>
                </div>

                {/* Member Benefits */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Premium Access</h3>
                      <p className="text-gray-600 text-sm">Exclusive automotive parts catalog</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Member Pricing</h3>
                      <p className="text-gray-600 text-sm">Special discounts and early access</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Pro Support</h3>
                      <p className="text-gray-600 text-sm">Direct access to automotive experts</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Register Form */}
              <div className="bg-white border-2 border-red-600 shadow-2xl p-10">
                <div className="mb-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-2 h-2 bg-red-600 rotate-45 mr-3"></div>
                    <h2 className="text-3xl font-black text-black tracking-wider">REGISTER</h2>
                    <div className="w-2 h-2 bg-red-600 rotate-45 ml-3"></div>
                  </div>
                  <p className="text-gray-600 text-center font-medium">Create your automotive account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-red-600 font-bold tracking-widest uppercase text-xs mb-3">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          id="first_name"
                          type="text"
                          value={data.first_name}
                          onChange={(e) => setData('first_name', e.target.value)}
                          className={`w-full bg-gray-50 border-2 text-black px-4 py-3 font-medium focus:outline-none transition-all ${
                            errors.first_name 
                              ? 'border-red-500' 
                              : 'border-gray-300 focus:border-red-600'
                          } placeholder-gray-500`}
                          placeholder="John"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <User className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      {errors.first_name && (
                        <p className="mt-2 text-xs text-red-500 font-medium">{errors.first_name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="last_name" className="block text-red-600 font-bold tracking-widest uppercase text-xs mb-3">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          id="last_name"
                          type="text"
                          value={data.last_name}
                          onChange={(e) => setData('last_name', e.target.value)}
                          className={`w-full bg-gray-50 border-2 text-black px-4 py-3 font-medium focus:outline-none transition-all ${
                            errors.last_name 
                              ? 'border-red-500' 
                              : 'border-gray-300 focus:border-red-600'
                          } placeholder-gray-500`}
                          placeholder="Doe"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <User className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      {errors.last_name && (
                        <p className="mt-2 text-xs text-red-500 font-medium">{errors.last_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-red-600 font-bold tracking-widest uppercase text-xs mb-3">
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
                      <p className="mt-2 text-xs text-red-500 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-red-600 font-bold tracking-widest uppercase text-xs mb-3">
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
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <Lock className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      {errors.password && (
                        <p className="mt-2 text-xs text-red-500 font-medium">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password_confirmation" className="block text-red-600 font-bold tracking-widest uppercase text-xs mb-3">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="password_confirmation"
                          type={showPasswordConfirmation ? 'text' : 'password'}
                          value={data.password_confirmation}
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          className={`w-full bg-gray-50 border-2 text-black px-6 py-4 font-medium focus:outline-none transition-all ${
                            errors.password_confirmation 
                              ? 'border-red-500' 
                              : 'border-gray-300 focus:border-red-600'
                          } placeholder-gray-500`}
                          placeholder="••••••••••••"
                          required
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <Lock className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      {errors.password_confirmation && (
                        <p className="mt-2 text-xs text-red-500 font-medium">{errors.password_confirmation}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-5 font-black tracking-widest uppercase text-lg transition-all transform hover:scale-105 disabled:scale-100 border-2 border-red-600 hover:border-red-500 mt-8"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>JOINING...</span>
                      </div>
                    ) : (
                      'JOIN GARAGE'
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                  <div className="w-full h-px bg-gray-300 mb-6"></div>
                  <p className="text-gray-600 font-medium">
                    Already a member?{' '}
                    <Link
                      href={route('store.login', store.slug)}
                      className="text-red-600 hover:text-red-700 font-bold tracking-wider uppercase transition-colors"
                    >
                      Access Account
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