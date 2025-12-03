import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Mail, ArrowLeft, Sofa } from 'lucide-react';

interface FurnitureForgotPasswordProps {
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
  status?: string;
}

export default function FurnitureForgotPassword({
  store = {},
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
  status,
}: FurnitureForgotPasswordProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.forgot-password', store.slug));
  };

  return (
    <>
      <Head title={`Reset Password - ${store.name}`} />
      
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
              
              <div className="mb-6">
                <Link
                  href={route('store.login', store.slug)}
                  className="inline-flex items-center gap-2 text-yellow-800 hover:text-amber-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-800 to-amber-900 rounded-2xl mb-6 shadow-lg">
                  <Sofa className="w-10 h-10 text-amber-100" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
                <p className="text-slate-600">Enter your email to receive reset instructions</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                {status && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 text-sm">{status}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="Enter your email address"
                        required
                      />
                      <Mail className="absolute right-3 top-3 h-5 w-5 text-amber-600" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-yellow-800 text-white py-3 px-4 rounded-xl font-semibold hover:bg-amber-900 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-200 disabled:opacity-50 shadow-lg"
                  >
                    {processing ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link
                      href={route('store.register', store.slug)}
                      className="font-semibold text-yellow-800 hover:text-amber-900"
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