import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ElectronicsFooter } from '@/components/store/electronics';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ElectronicsForgotPasswordProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  errors?: any;
  status?: string;
}

export default function ElectronicsForgotPassword({ 
  store, 
  storeContent,
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  errors = {},
  status = ''
}: ElectronicsForgotPasswordProps) {
  const [emailSent, setEmailSent] = useState(!!status);
  
  const { data, setData, post, processing } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.forgot-password', store.slug), {
      onSuccess: () => setEmailSent(true)
    });
  };

  return (
    <>
      <Head title={`Forgot Password - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={false}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            {!emailSent ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                  <p className="text-gray-600">No worries! Enter your email and we'll send you reset instructions</p>
                </div>

                {/* Forgot Password Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="email"
                          type="email"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {processing ? (
                        <>
                          <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Instructions...
                        </>
                      ) : (
                        'Send Reset Instructions'
                      )}
                    </button>
                  </form>

                  {/* Back to Login */}
                  <div className="mt-6 text-center">
                    <Link
                      href={route('store.login', store.slug)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                  <p className="text-gray-600">We've sent password reset instructions to your email address</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <button
                      onClick={() => setEmailSent(false)}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Try Again
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <Link
                      href={route('store.login', store.slug)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </StoreLayout>
    </>
  );
}