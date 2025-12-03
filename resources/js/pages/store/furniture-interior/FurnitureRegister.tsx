import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Mail, Lock, Eye, EyeOff, User, Sofa } from 'lucide-react';

interface FurnitureRegisterProps {
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

export default function FurnitureRegister({
  store = {},
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FurnitureRegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
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
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme || 'furniture-interior'}
      >
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-800 to-amber-900 rounded-2xl mb-6 shadow-lg">
                  <Sofa className="w-10 h-10 text-amber-100" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Our Family</h1>
                <p className="text-slate-600">Create your furniture account</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                          errors.name 
                            ? 'border-red-400 bg-red-50' 
                            : 'border-amber-200 focus:border-yellow-800 bg-amber-50/30 focus:bg-white'
                        }`}
                        placeholder="Enter your full name"
                        required
                      />
                      <User className="absolute right-3 top-3 h-5 w-5 text-amber-600" />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                          errors.email 
                            ? 'border-red-400 bg-red-50' 
                            : 'border-amber-200 focus:border-yellow-800 bg-amber-50/30 focus:bg-white'
                        }`}
                        placeholder="your.email@example.com"
                        required
                      />
                      <Mail className="absolute right-3 top-3 h-5 w-5 text-amber-600" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                          errors.password 
                            ? 'border-red-400 bg-red-50' 
                            : 'border-amber-200 focus:border-yellow-800 bg-amber-50/30 focus:bg-white'
                        }`}
                        placeholder="Create password"
                        required
                      />
                      <div className="absolute right-3 top-3 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-amber-600 hover:text-yellow-800"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <Lock className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                          errors.password_confirmation 
                            ? 'border-red-400 bg-red-50' 
                            : 'border-amber-200 focus:border-yellow-800 bg-amber-50/30 focus:bg-white'
                        }`}
                        placeholder="Confirm password"
                        required
                      />
                      <div className="absolute right-3 top-3 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-amber-600 hover:text-yellow-800"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <Lock className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                  </div>
                  
                  <div className="flex items-start pt-2">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={data.terms}
                      onChange={(e) => setData('terms', e.target.checked)}
                      className="h-4 w-4 text-yellow-800 focus:ring-amber-500 border-amber-300 rounded mt-0.5"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-slate-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-yellow-800 hover:text-amber-900 font-semibold">
                        Terms
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-yellow-800 hover:text-amber-900 font-semibold">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}
                  
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-yellow-800 text-white py-3 px-4 rounded-xl font-semibold hover:bg-amber-900 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-200 disabled:opacity-50 shadow-lg mt-6"
                  >
                    {processing ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link
                      href={route('store.login', store.slug)}
                      className="font-semibold text-yellow-800 hover:text-amber-900"
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