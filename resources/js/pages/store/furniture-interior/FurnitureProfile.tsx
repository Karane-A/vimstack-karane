import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { User, Mail, Phone, MapPin, Lock, Home, Edit3, Shield } from 'lucide-react';

interface FurnitureProfileProps {
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

export default function FurnitureProfile({
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FurnitureProfileProps) {
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
        theme="furniture-interior"
      >
        {/* Hero Section */}
        <div className="bg-yellow-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">My Profile</h1>
              <p className="text-amber-200 text-lg">
                Manage your account and personal information
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Profile Header Card */}
              <div className="bg-amber-50 rounded-3xl shadow-lg border-2 border-amber-200 p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="w-32 h-32 bg-yellow-800 rounded-full flex items-center justify-center shadow-xl">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{user.first_name} {user.last_name}</h2>
                    <p className="text-amber-800 text-lg mb-4">{user.email}</p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-yellow-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-yellow-900 transition-colors flex items-center justify-center"
                      >
                        <Edit3 className="h-5 w-5 mr-2" />
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                      </button>
                      <button 
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="border-2 border-amber-600 text-amber-800 px-6 py-3 rounded-2xl font-bold hover:bg-amber-50 transition-colors flex items-center justify-center"
                      >
                        <Shield className="h-5 w-5 mr-2" />
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <User className="h-6 w-6 text-amber-800 mr-3" />
                    Personal Details
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-amber-800 mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.first_name}
                          onChange={(e) => profileForm.setData('first_name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:border-amber-600 transition-colors text-lg"
                        />
                      ) : (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                          <span className="text-lg text-slate-900">{user.first_name}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-amber-800 mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.last_name}
                          onChange={(e) => profileForm.setData('last_name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:border-amber-600 transition-colors text-lg"
                        />
                      ) : (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                          <span className="text-lg text-slate-900">{user.last_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <Mail className="h-6 w-6 text-amber-800 mr-3" />
                    Contact Info
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-amber-800 mb-2">Email Address</label>
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <span className="text-lg text-slate-900">{user.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-amber-800 mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileForm.data.phone}
                          onChange={(e) => profileForm.setData('phone', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:border-amber-600 transition-colors text-lg"
                        />
                      ) : (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                          <span className="text-lg text-slate-900">{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 p-8 mt-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <Home className="h-6 w-6 text-amber-800 mr-3" />
                  Home Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-amber-800 mb-2">Street Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.address}
                          onChange={(e) => profileForm.setData('address', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:border-amber-600 transition-colors text-lg"
                        />
                      ) : (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                          <span className="text-lg text-slate-900">{user.address?.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-amber-800 mb-2">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.city}
                          onChange={(e) => profileForm.setData('city', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:border-amber-600 transition-colors text-lg"
                        />
                      ) : (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                          <span className="text-lg text-slate-900">{user.address?.city || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-amber-800 mb-2">Postal Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.postal_code}
                          onChange={(e) => profileForm.setData('postal_code', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:border-amber-600 transition-colors text-lg"
                        />
                      ) : (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                          <span className="text-lg text-slate-900">{user.address?.postal_code || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6 pt-6 border-t border-amber-200">
                      <button 
                        onClick={handleProfileSubmit}
                        disabled={profileForm.processing}
                        className="bg-yellow-800 text-white px-8 py-3 rounded-2xl font-bold hover:bg-yellow-900 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <Edit3 className="h-5 w-5 mr-2" />
                        {profileForm.processing ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              
              {/* Password Change Form */}
              {showPasswordForm && (
                <div className="bg-white rounded-3xl shadow-lg border-2 border-red-200 p-8 mt-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <Lock className="h-6 w-6 text-red-600 mr-3" />
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-red-800 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-xl bg-red-50 focus:outline-none focus:border-red-600 transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-red-800 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-xl bg-red-50 focus:outline-none focus:border-red-600 transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-red-800 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-xl bg-red-50 focus:outline-none focus:border-red-600 transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <button 
                        type="submit"
                        disabled={passwordForm.processing}
                        className="bg-yellow-800 text-white px-8 py-3 rounded-2xl font-bold hover:bg-yellow-900 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <Lock className="h-5 w-5 mr-2" />
                        {passwordForm.processing ? 'Updating...' : 'Update Password'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-2xl font-bold hover:bg-red-50 transition-colors"
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
      </StoreLayout>
    </>
  );
}