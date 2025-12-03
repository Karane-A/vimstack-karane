import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { User, Mail, Phone, MapPin, Lock, Wrench, Edit3, Shield, Settings, Zap } from 'lucide-react';

interface CarsProfileProps {
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

export default function CarsProfile({
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: CarsProfileProps) {
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
        theme="cars-automotive"
      >
        {/* Industrial Header */}
        <div className="bg-black text-white py-20 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <User className="h-6 w-6 text-white transform -rotate-45" />
                </div>
                <div>
                  <h1 className="text-5xl font-black tracking-wider">DRIVER PROFILE</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Account Management</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl">
              Manage your automotive account and personal information
            </p>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Profile Header */}
              <div className="bg-black text-white p-8 border-l-8 border-red-600 shadow-lg mb-12">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="w-32 h-32 bg-red-600 flex items-center justify-center transform rotate-45 shadow-xl">
                    <User className="h-16 w-16 text-white transform -rotate-45" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-black tracking-wider uppercase mb-2">{user.first_name} {user.last_name}</h2>
                    <p className="text-red-400 text-lg mb-6 font-bold tracking-wider">{user.email}</p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-bold tracking-wider uppercase transition-colors flex items-center justify-center"
                      >
                        <Edit3 className="h-5 w-5 mr-2" />
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                      </button>
                      <button 
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 font-bold tracking-wider uppercase transition-all flex items-center justify-center"
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
                <div className="bg-white border-l-8 border-red-600 shadow-lg">
                  <div className="bg-black text-white px-6 py-4">
                    <div className="flex items-center">
                      <User className="h-6 w-6 text-red-600 mr-3" />
                      <h3 className="text-2xl font-black tracking-wider uppercase">Personal Details</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.first_name}
                          onChange={(e) => profileForm.setData('first_name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                        />
                      ) : (
                        <div className="bg-gray-50 p-4 border-2 border-gray-200">
                          <span className="text-lg font-bold text-gray-900">{user.first_name}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.last_name}
                          onChange={(e) => profileForm.setData('last_name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                        />
                      ) : (
                        <div className="bg-gray-50 p-4 border-2 border-gray-200">
                          <span className="text-lg font-bold text-gray-900">{user.last_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white border-l-8 border-red-600 shadow-lg">
                  <div className="bg-black text-white px-6 py-4">
                    <div className="flex items-center">
                      <Mail className="h-6 w-6 text-red-600 mr-3" />
                      <h3 className="text-2xl font-black tracking-wider uppercase">Contact Info</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">Email Address</label>
                      <div className="bg-gray-50 p-4 border-2 border-gray-200">
                        <span className="text-lg font-bold text-gray-900">{user.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileForm.data.phone}
                          onChange={(e) => profileForm.setData('phone', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                        />
                      ) : (
                        <div className="bg-gray-50 p-4 border-2 border-gray-200">
                          <span className="text-lg font-bold text-gray-900">{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white border-l-8 border-red-600 shadow-lg mt-12">
                <div className="bg-black text-white px-6 py-4">
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-red-600 mr-3" />
                    <h3 className="text-2xl font-black tracking-wider uppercase">Garage Address</h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">Street Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.address}
                          onChange={(e) => profileForm.setData('address', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                        />
                      ) : (
                        <div className="bg-gray-50 p-4 border-2 border-gray-200">
                          <span className="text-lg font-bold text-gray-900">{user.address?.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.city}
                          onChange={(e) => profileForm.setData('city', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                        />
                      ) : (
                        <div className="bg-gray-50 p-4 border-2 border-gray-200">
                          <span className="text-lg font-bold text-gray-900">{user.address?.city || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">Postal Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.data.postal_code}
                          onChange={(e) => profileForm.setData('postal_code', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                        />
                      ) : (
                        <div className="bg-gray-50 p-4 border-2 border-gray-200">
                          <span className="text-lg font-bold text-gray-900">{user.address?.postal_code || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-8 pt-6 border-t-2 border-gray-300">
                      <button 
                        onClick={handleProfileSubmit}
                        disabled={profileForm.processing}
                        className="bg-red-600 hover:bg-black text-white px-8 py-4 font-bold tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center"
                      >
                        <Wrench className="h-5 w-5 mr-2" />
                        {profileForm.processing ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Password Change Form */}
              {showPasswordForm && (
                <div className="bg-white border-l-8 border-red-600 shadow-lg mt-12">
                  <div className="bg-black text-white px-6 py-4">
                    <div className="flex items-center">
                      <Lock className="h-6 w-6 text-red-600 mr-3" />
                      <h3 className="text-2xl font-black tracking-wider uppercase">Security Update</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={passwordForm.data.current_password}
                          onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.data.password}
                          onChange={(e) => passwordForm.setData('password', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-black tracking-wider uppercase text-red-600 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.data.password_confirmation}
                          onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors font-medium"
                          required
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                        <button 
                          type="submit"
                          disabled={passwordForm.processing}
                          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center"
                        >
                          <Shield className="h-5 w-5 mr-2" />
                          {passwordForm.processing ? 'Updating...' : 'Update Password'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowPasswordForm(false)}
                          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 font-bold tracking-wider uppercase transition-all"
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