import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Heart, Star, Gift, Baby, Smile, Sparkles, Crown, Cake, Home, Globe, FileText, Lock } from 'lucide-react';

interface BabyKidsProfileProps {
  user: any;
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  customPages?: any[];
}

export default function BabyKidsProfile({
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  customPages = [],
}: BabyKidsProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const storeSlug = store.slug || 'demo';

  const { data, setData, post, processing, errors } = useForm({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postal_code: user?.address?.postal_code || '',
    country: user?.address?.country || '',
  });

  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.profile.update', storeSlug), {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.post(route('store.profile.password', storeSlug), {
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
        userName={userName}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme="baby-kids"
      >
        {/* Hero Section */}
        <div className="bg-pink-50 py-20 relative overflow-hidden">
          {/* Playful Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">My Profile</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.name || 'User'}
                    </h2>
                    <p className="text-gray-600 mb-6 text-sm">{user?.email}</p>
                    

                  </div>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <Edit3 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            Profile Information
                          </h2>
                          <p className="text-sm text-gray-600">Keep your details up to date</p>
                        </div>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center space-x-2"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* First Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Enter your first name"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                  isEditing 
                                    ? 'border-pink-300 focus:border-pink-500 bg-white' 
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                            {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Enter your last name"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                  isEditing 
                                    ? 'border-pink-300 focus:border-pink-500 bg-white' 
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                            {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={!isEditing}
                                placeholder="your.email@example.com"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                  isEditing 
                                    ? 'border-blue-300 focus:border-blue-500 bg-white' 
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={!isEditing}
                                placeholder="(555) 123-4567"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                  isEditing 
                                    ? 'border-green-300 focus:border-green-500 bg-white' 
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                          </div>

                          {/* Address */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                disabled={!isEditing}
                                placeholder="123 Main Street"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                  isEditing 
                                    ? 'border-purple-300 focus:border-purple-500 bg-white' 
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              />
                            </div>
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                          </div>

                          {/* City */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={data.city}
                              onChange={(e) => setData('city', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Your city"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                isEditing 
                                  ? 'border-gray-300 focus:border-pink-500 bg-white' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                          </div>

                          {/* State */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              value={data.state}
                              onChange={(e) => setData('state', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Your state"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                isEditing 
                                  ? 'border-gray-300 focus:border-pink-500 bg-white' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                          </div>

                          {/* ZIP */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              value={data.postal_code}
                              onChange={(e) => setData('postal_code', e.target.value)}
                              disabled={!isEditing}
                              placeholder="12345"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                isEditing 
                                  ? 'border-gray-300 focus:border-pink-500 bg-white' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                            {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>}
                          </div>

                          {/* Country */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              value={data.country}
                              onChange={(e) => setData('country', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Your country"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                                isEditing 
                                  ? 'border-gray-300 focus:border-pink-500 bg-white' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                          </div>
                        </div>

                        {isEditing && (
                          <div className="flex justify-end pt-6">
                            <button
                              type="submit"
                              disabled={processing}
                              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                            >
                              <Save className="h-4 w-4" />
                              <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                          </div>
                        )}
                      </form>

                      {/* Password Section */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                              <Lock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">Password</h3>
                              <p className="text-sm text-gray-600">Update your password</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                          >
                            {showPasswordForm ? 'Cancel' : 'Change Password'}
                          </button>
                        </div>

                        {showPasswordForm && (
                          <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                              </label>
                              <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-500"
                                required
                              />
                            </div>
                            <div className="flex justify-end pt-4">
                              <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50"
                              >
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
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
        </div>
      </StoreLayout>
    </>
  );
}