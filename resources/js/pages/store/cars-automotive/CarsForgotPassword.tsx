import React from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, ArrowLeft, Zap, Shield, Wrench } from 'lucide-react';

interface CarsForgotPasswordProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function CarsForgotPassword({ 
  store, 
  storeContent, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: CarsForgotPasswordProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <>
      <Head title={`Forgot Password - ${store.name}`} />
      
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
            <div className="absolute top-20 right-20 w-72 h-72 border-2 border-red-600 opacity-5 rotate-45"></div>
            <div className="absolute bottom-20 left-20 w-56 h-56 border-2 border-red-600 opacity-5 rotate-12"></div>
            <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-red-600 opacity-3 rotate-45"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
              {/* Left Side - Branding */}
              <div className="text-black space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-red-600 rotate-45"></div>
                    <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Account Recovery</span>
                    <div className="w-4 h-4 bg-red-600 rotate-45"></div>
                  </div>
                  
                  <h1 className="text-7xl font-black tracking-tight leading-none">
                    RESET
                    <br />
                    <span className="text-red-600">ACCESS</span>
                  </h1>
                  
                  <p className="text-xl text-gray-700 font-medium leading-relaxed max-w-lg">
                    Regain access to your automotive account. Enter your email to receive password reset instructions.
                  </p>
                </div>

                {/* Security Features */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Secure Recovery</h3>
                      <p className="text-gray-600 text-sm">Encrypted password reset process</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Quick Process</h3>
                      <p className="text-gray-600 text-sm">Instant email delivery</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">Support Ready</h3>
                      <p className="text-gray-600 text-sm">Need help? Contact our team</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Reset Form */}
              <div className="bg-white border-2 border-red-600 shadow-2xl p-10">
                <div className="mb-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-2 h-2 bg-red-600 rotate-45 mr-3"></div>
                    <h2 className="text-3xl font-black text-black tracking-wider">RESET</h2>
                    <div className="w-2 h-2 bg-red-600 rotate-45 ml-3"></div>
                  </div>
                  <p className="text-gray-600 text-center font-medium">Enter your email for password reset</p>
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
                        className={`w-full bg-gray-50 border-2 text-black px-6 py-5 font-medium focus:outline-none transition-all ${
                          errors.email 
                            ? 'border-red-500' 
                            : 'border-gray-300 focus:border-red-600'
                        } placeholder-gray-500 text-lg`}
                        placeholder="your.email@example.com"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Mail className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-3 text-sm text-red-500 font-medium">{errors.email}</p>
                    )}
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
                        <span>SENDING...</span>
                      </div>
                    ) : (
                      'SEND RESET LINK'
                    )}
                  </button>
                </form>



                {/* Back to Login */}
                <div className="mt-8 text-center">
                  <div className="w-full h-px bg-gray-300 mb-6"></div>
                  <Link
                    href={route('store.login', store.slug)}
                    className="inline-flex items-center text-gray-600 hover:text-red-600 font-bold tracking-wider uppercase transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-3" />
                    Back to Login
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