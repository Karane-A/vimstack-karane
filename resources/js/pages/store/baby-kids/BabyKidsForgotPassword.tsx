import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BabyKidsFooter } from '@/components/store/baby-kids';

interface BabyKidsForgotPasswordProps {
  store: any;
  storeContent: any;
  customPages: any[];
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
  status?: string;
}

export default function BabyKidsForgotPassword({
  store,
  storeContent,
  customPages,
  cartCount,
  wishlistCount,
  isLoggedIn,
  status
}: BabyKidsForgotPasswordProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.forgot-password', store.slug));
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
        storeId={store.id}
        storeContent={storeContent}
        customFooter={<BabyKidsFooter storeName={store.name} logo={store.logo} content={storeContent.footer} />}
      >
        <div className="min-h-screen bg-pink-50 relative overflow-hidden">
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
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-4xl font-black text-gray-800 mb-3">Forgot Password?</h1>
                <p className="text-lg text-gray-600">No worries! We'll help you reset it</p>
              </div>

              {status && (
                <div className="mb-6 p-4 bg-green-100 border-3 border-green-300 rounded-2xl">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-700 font-bold">{status}</p>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="absolute top-2 left-2 w-full h-full rounded-2xl bg-pink-300 opacity-40"></div>
                
                <div className="relative bg-white rounded-2xl shadow-xl border-4 border-pink-400 p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full mr-2 flex items-center justify-center">
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
                        className={`w-full px-6 py-4 border-3 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 focus:outline-none transition-all duration-300 text-lg ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-yellow-200 bg-yellow-50/50'
                        }`}
                        placeholder="Enter your email address"
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
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-pink-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-pink-600 focus:ring-4 focus:ring-pink-200 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span>Send Reset Link</span>
                        </div>
                      )}
                    </button>
                  </form>
                  
                  <div className="mt-8 text-center">
                    <Link
                      href={route('store.login', store.slug)}
                      className="inline-flex items-center text-lg text-blue-500 hover:text-blue-600 font-bold transition-colors duration-300"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Back to Sign In
                    </Link>
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