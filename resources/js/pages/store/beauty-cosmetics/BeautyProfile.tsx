import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BeautyFooter } from '@/components/store/beauty-cosmetics';
import { User, Mail, Phone, MapPin, Lock, Heart, Sparkles, Calendar } from 'lucide-react';

interface BeautyProfileProps {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: {
      address: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  store: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function BeautyProfile({
  user,
  store = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BeautyProfileProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.post(route('store.profile.password', { storeSlug: store.slug }), {
      onSuccess: () => {
        setShowPasswordForm(false);
        passwordForm.reset();
      }
    });
  };
  
  return (
    <>
      <Head title={`My Profile - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeId={store.id}
        customFooter={<BeautyFooter storeName={store.name} logo={store.logo} />}
      >
        <div className="bg-rose-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500 mb-8 shadow-2xl">
                <User className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6">
                Beauty Profile
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Manage your beauty journey and account preferences
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
                <div className="bg-rose-500 p-8">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-light text-white">{user.first_name} {user.last_name}</h2>
                      <p className="text-white/80">Beauty Enthusiast</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="space-y-12">
                    {/* Personal Information */}
                    <div>
                      <div className="flex items-center mb-8">
                        <Sparkles className="h-6 w-6 text-rose-500 mr-3" />
                        <h3 className="text-2xl font-light text-gray-900">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-rose-50 rounded-2xl p-6">
                          <label className="block text-sm font-medium text-gray-500 mb-3">
                            First Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={user.first_name}
                              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                              readOnly
                            />
                            <User className="absolute right-4 top-3 h-5 w-5 text-rose-400" />
                          </div>
                        </div>
                        
                        <div className="bg-rose-50 rounded-2xl p-6">
                          <label className="block text-sm font-medium text-gray-500 mb-3">
                            Last Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={user.last_name}
                              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                              readOnly
                            />
                            <User className="absolute right-4 top-3 h-5 w-5 text-rose-400" />
                          </div>
                        </div>

                        {user.date_of_birth && (
                          <div className="bg-rose-50 rounded-2xl p-6">
                            <label className="block text-sm font-medium text-gray-500 mb-3">
                              Date of Birth
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={user.date_of_birth}
                                className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                                readOnly
                              />
                              <Calendar className="absolute right-4 top-3 h-5 w-5 text-rose-400" />
                            </div>
                          </div>
                        )}

                        {user.gender && (
                          <div className="bg-rose-50 rounded-2xl p-6">
                            <label className="block text-sm font-medium text-gray-500 mb-3">
                              Gender
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={user.gender}
                                className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                                readOnly
                              />
                              <Heart className="absolute right-4 top-3 h-5 w-5 text-rose-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <div className="flex items-center mb-8">
                        <Mail className="h-6 w-6 text-rose-500 mr-3" />
                        <h3 className="text-2xl font-light text-gray-900">Contact Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-rose-50 rounded-2xl p-6">
                          <label className="block text-sm font-medium text-gray-500 mb-3">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={user.email}
                              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                              readOnly
                            />
                            <Mail className="absolute right-4 top-3 h-5 w-5 text-rose-400" />
                          </div>
                        </div>
                        
                        <div className="bg-rose-50 rounded-2xl p-6">
                          <label className="block text-sm font-medium text-gray-500 mb-3">
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={user.phone || 'Not provided'}
                              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                              readOnly
                            />
                            <Phone className="absolute right-4 top-3 h-5 w-5 text-rose-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    {user.address && (
                      <div>
                        <div className="flex items-center mb-8">
                          <MapPin className="h-6 w-6 text-rose-500 mr-3" />
                          <h3 className="text-2xl font-light text-gray-900">Address Information</h3>
                        </div>
                        <div className="space-y-6">
                          <div className="bg-rose-50 rounded-2xl p-6">
                            <label className="block text-sm font-medium text-gray-500 mb-3">
                              Street Address
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={user.address.address || 'Not provided'}
                                className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                                readOnly
                              />
                              <MapPin className="absolute right-4 top-3 h-5 w-5 text-rose-400" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-rose-50 rounded-2xl p-6">
                              <label className="block text-sm font-medium text-gray-500 mb-3">
                                City
                              </label>
                              <input
                                type="text"
                                value={user.address.city || 'Not provided'}
                                className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                                readOnly
                              />
                            </div>
                            
                            <div className="bg-rose-50 rounded-2xl p-6">
                              <label className="block text-sm font-medium text-gray-500 mb-3">
                                State
                              </label>
                              <input
                                type="text"
                                value={user.address.state || 'Not provided'}
                                className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                                readOnly
                              />
                            </div>
                            
                            <div className="bg-rose-50 rounded-2xl p-6">
                              <label className="block text-sm font-medium text-gray-500 mb-3">
                                Postal Code
                              </label>
                              <input
                                type="text"
                                value={user.address.postal_code || 'Not provided'}
                                className="w-full px-4 py-3 bg-white rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-8">
                      <button className="bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Edit Profile
                      </button>
                      <button 
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="border-2 border-rose-200 text-rose-600 px-8 py-4 rounded-full font-semibold hover:border-rose-300 hover:bg-rose-50 transition-colors flex items-center gap-2"
                      >
                        <Lock className="h-5 w-5" />
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>
                    
                    {/* Password Change Form */}
                    {showPasswordForm && (
                      <div className="bg-rose-50 rounded-3xl p-8">
                        <div className="flex items-center mb-8">
                          <Lock className="h-6 w-6 text-rose-500 mr-3" />
                          <h3 className="text-2xl font-light text-gray-900">Change Password</h3>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                          <div className="bg-white rounded-2xl p-6">
                            <label className="block text-sm font-medium text-gray-500 mb-3">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.data.current_password}
                              onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                              required
                            />
                          </div>
                          
                          <div className="bg-white rounded-2xl p-6">
                            <label className="block text-sm font-medium text-gray-500 mb-3">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.data.password}
                              onChange={(e) => passwordForm.setData('password', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                              required
                            />
                          </div>
                          
                          <div className="bg-white rounded-2xl p-6">
                            <label className="block text-sm font-medium text-gray-500 mb-3">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.data.password_confirmation}
                              onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:outline-none focus:border-rose-500 transition-colors"
                              required
                            />
                          </div>
                          
                          <div className="flex gap-4">
                            <button 
                              type="submit"
                              disabled={passwordForm.processing}
                              className="bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                              <Lock className="h-5 w-5" />
                              {passwordForm.processing ? 'Updating...' : 'Update Password'}
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowPasswordForm(false)}
                              className="border-2 border-rose-200 text-rose-600 px-8 py-4 rounded-full font-semibold hover:border-rose-300 hover:bg-rose-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
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