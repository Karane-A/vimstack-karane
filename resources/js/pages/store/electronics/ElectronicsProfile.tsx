import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ElectronicsFooter } from '@/components/store/electronics';
import { User, Mail, Phone, MapPin, Lock, Edit } from 'lucide-react';

interface ElectronicsProfileProps {
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

export default function ElectronicsProfile({
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: ElectronicsProfileProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const profileForm = useForm({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address?.address || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    postal_code: user.address?.postal_code || '',
    country: user.address?.country || 'United States',
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
        theme={store.theme}
      >
        <div className="bg-gray-50 min-h-screen">
          {/* Header */}
          <section className="bg-slate-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">My Profile</h1>
              <p className="text-xl text-blue-100">Manage your account information</p>
            </div>
          </section>

          {/* Profile Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Profile Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {user.first_name} {user.last_name}
                      </h2>
                      <p className="text-gray-600 mb-6">{user.email}</p>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4 inline mr-2" />
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                      </button>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div className="bg-blue-600 text-white p-6">
                        <h3 className="text-xl font-bold">Personal Information</h3>
                      </div>
                      <div className="p-6">
                        {isEditing ? (
                          <form onSubmit={handleProfileSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.data.first_name}
                                  onChange={(e) => profileForm.setData('first_name', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                                {profileForm.errors.first_name && (
                                  <p className="mt-1 text-sm text-red-600">{profileForm.errors.first_name}</p>
                                )}
                              </div>
                              
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.data.last_name}
                                  onChange={(e) => profileForm.setData('last_name', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                                {profileForm.errors.last_name && (
                                  <p className="mt-1 text-sm text-red-600">{profileForm.errors.last_name}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-4">
                              <button 
                                type="submit"
                                disabled={profileForm.processing}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {profileForm.processing ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                First Name
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={user.first_name}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                                  readOnly
                                />
                                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Last Name
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={user.last_name}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                                  readOnly
                                />
                                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div className="bg-slate-900 text-white p-6">
                        <h3 className="text-xl font-bold">Contact Information</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            {isEditing ? (
                              <input
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            ) : (
                              <input
                                type="email"
                                value={user.email}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                                readOnly
                              />
                            )}
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                          {profileForm.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{profileForm.errors.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            {isEditing ? (
                              <input
                                type="tel"
                                value={profileForm.data.phone}
                                onChange={(e) => profileForm.setData('phone', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter phone number"
                              />
                            ) : (
                              <input
                                type="tel"
                                value={user.phone || 'Not provided'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                                readOnly
                              />
                            )}
                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    {user.address && (
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-blue-600 text-white p-6">
                          <h3 className="text-xl font-bold flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Address Information
                          </h3>
                        </div>
                        <div className="p-6 space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={user.address.address || 'Not provided'}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                              readOnly
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                value={user.address.city || 'Not provided'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                                readOnly
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Postal Code
                              </label>
                              <input
                                type="text"
                                value={user.address.postal_code || 'Not provided'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Password Section */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div className="bg-slate-900 text-white p-6">
                        <h3 className="text-xl font-bold flex items-center">
                          <Lock className="w-5 h-5 mr-2" />
                          Security
                        </h3>
                      </div>
                      <div className="p-6">
                        {!showPasswordForm ? (
                          <button 
                            onClick={() => setShowPasswordForm(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Change Password
                          </button>
                        ) : (
                          <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Password
                              </label>
                              <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div className="flex space-x-4">
                              <button 
                                type="submit"
                                disabled={passwordForm.processing}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                              </button>
                              <button 
                                type="button"
                                onClick={() => setShowPasswordForm(false)}
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </StoreLayout>
    </>
  );
}