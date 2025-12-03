import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { User, Mail, Phone, MapPin, Lock, Edit3, Shield, Sparkles, Star, Heart } from 'lucide-react';

interface PerfumeProfileProps {
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

export default function PerfumeProfile({
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: PerfumeProfileProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const profileForm = useForm({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone || '',
    address: user.address?.address || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    postal_code: user.address?.postal_code || '',
    country: user.address?.country || '',
  });
  
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
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.post(route('store.profile.update', { storeSlug: store.slug }), {
      onSuccess: () => {
        setIsEditing(false);
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
        storeContent={storeContent}
        storeId={store.id}
        theme="perfume-fragrances"
      >
        {/* Hero Section */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                My Profile
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Manage your fragrance preferences and personal information with elegance and sophistication.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-purple-800 to-purple-900 text-white p-8 rounded-3xl shadow-lg mb-12 border border-purple-700">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center shadow-xl">
                    <User className="h-16 w-16 text-purple-900" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-light mb-2">{user.first_name} {user.last_name}</h2>
                    <p className="text-amber-400 text-lg mb-6 font-medium">{user.email}</p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-amber-400 hover:bg-amber-500 text-purple-900 px-8 py-3 rounded-full font-medium transition-colors flex items-center justify-center"
                      >
                        <Edit3 className="h-5 w-5 mr-2" />
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                      </button>
                      <button 
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-purple-900 px-8 py-3 rounded-full font-medium transition-all flex items-center justify-center"
                      >
                        <Shield className="h-5 w-5 mr-2" />
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Personal Information */}
                <div className="bg-white rounded-3xl shadow-lg border border-purple-100">
                  <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 rounded-t-3xl">
                    <div className="flex items-center">
                      <Sparkles className="h-6 w-6 text-amber-400 mr-3" />
                      <h3 className="text-2xl font-light">Personal Details</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.first_name}
                          onChange={(e) => profileForm.setData('first_name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                          <span className="text-lg text-gray-900">{user.first_name}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.last_name}
                          onChange={(e) => profileForm.setData('last_name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                          <span className="text-lg text-gray-900">{user.last_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-3xl shadow-lg border border-purple-100">
                  <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 rounded-t-3xl">
                    <div className="flex items-center">
                      <Mail className="h-6 w-6 text-amber-400 mr-3" />
                      <h3 className="text-2xl font-light">Contact Information</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Email Address</label>
                      <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                        <span className="text-lg text-gray-900">{user.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileForm.data.phone}
                          onChange={(e) => profileForm.setData('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                          <span className="text-lg text-gray-900">{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-3xl shadow-lg border border-purple-100 mt-12">
                <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 rounded-t-3xl">
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-amber-400 mr-3" />
                    <h3 className="text-2xl font-light">Delivery Address</h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-purple-800 mb-2">Street Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.address}
                          onChange={(e) => profileForm.setData('address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                          <span className="text-lg text-gray-900">{profileForm.data.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.city}
                          onChange={(e) => profileForm.setData('city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                          <span className="text-lg text-gray-900">{profileForm.data.city || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.state}
                          onChange={(e) => profileForm.setData('state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                          <span className="text-lg text-gray-900">{profileForm.data.state || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Postal Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.postal_code}
                          onChange={(e) => profileForm.setData('postal_code', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                          <span className="text-lg text-gray-900">{profileForm.data.postal_code || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Country</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.country}
                          onChange={(e) => profileForm.setData('country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        />
                      ) : (
                        <div className="bg-stone-50 p-4 rounded-xl border border-purple-100">
                          <span className="text-lg text-gray-900">{profileForm.data.country || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-8 pt-6 border-t border-purple-200">
                      <button 
                        onClick={handleProfileSubmit}
                        disabled={profileForm.processing}
                        className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-4 rounded-full font-medium transition-colors disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        {profileForm.processing ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Password Change Form */}
              {showPasswordForm && (
                <div className="bg-white rounded-3xl shadow-lg border border-purple-100 mt-12">
                  <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-4 rounded-t-3xl">
                    <div className="flex items-center">
                      <Lock className="h-6 w-6 text-amber-400 mr-3" />
                      <h3 className="text-2xl font-light">Security Settings</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-purple-800 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={passwordForm.data.current_password}
                          onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-purple-800 mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.data.password}
                          onChange={(e) => passwordForm.setData('password', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-purple-800 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.data.password_confirmation}
                          onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          required
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                        <button 
                          type="submit"
                          disabled={passwordForm.processing}
                          className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-4 rounded-full font-medium transition-colors disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <Shield className="h-5 w-5 mr-2" />
                          {passwordForm.processing ? 'Updating...' : 'Update Password'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowPasswordForm(false)}
                          className="border-2 border-purple-800 text-purple-800 hover:bg-purple-800 hover:text-white px-8 py-4 rounded-full font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}