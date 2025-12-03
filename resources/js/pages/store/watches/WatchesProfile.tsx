import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { User, Mail, Phone, MapPin, Lock, Clock, Shield, Edit3, Save, X } from 'lucide-react';

interface WatchesProfileProps {
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

export default function WatchesProfile({
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WatchesProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const profileForm = useForm({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    date_of_birth: user.date_of_birth || '',
    gender: user.gender || '',
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
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.post(route('store.profile.update', { storeSlug: store.slug }), {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };
  
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
        storeContent={storeContent}
        storeId={store.id}
        theme="watches"
      >
        {/* Hero Section */}
        <section className="relative h-96 flex items-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="mb-6">
                  <span className="bg-amber-500 text-slate-900 px-6 py-2 text-sm font-medium tracking-wider uppercase">
                    Account
                  </span>
                </div>
                <h1 className="text-6xl font-light text-white mb-6 leading-none tracking-tight">
                  My Profile
                </h1>
                <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                  Manage your luxury timepiece collection preferences and account details
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
        </section>

        <div className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Profile Header Card */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-slate-900" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-light mb-2">
                        {isEditing ? profileForm.data.first_name + ' ' + profileForm.data.last_name : user.first_name + ' ' + user.last_name}
                      </h2>
                      <p className="text-slate-300 text-lg">{user.email}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="w-4 h-4 text-amber-500 mr-2" />
                        <span className="text-sm text-slate-400">Member since {new Date().getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="border border-slate-400 text-white px-6 py-3 rounded-lg font-medium hover:border-slate-300 transition-colors flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-medium text-slate-900">Personal Details</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                          <input
                            type="text"
                            value={isEditing ? profileForm.data.first_name : user.first_name}
                            onChange={(e) => profileForm.setData('first_name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                              isEditing 
                                ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                                : 'border-slate-200 bg-slate-50'
                            }`}
                            readOnly={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            value={isEditing ? profileForm.data.last_name : user.last_name}
                            onChange={(e) => profileForm.setData('last_name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                              isEditing 
                                ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                                : 'border-slate-200 bg-slate-50'
                            }`}
                            readOnly={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={isEditing ? profileForm.data.date_of_birth : user.date_of_birth || ''}
                          onChange={(e) => profileForm.setData('date_of_birth', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                        <select
                          value={isEditing ? profileForm.data.gender : user.gender || ''}
                          onChange={(e) => profileForm.setData('gender', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          disabled={!isEditing}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                        <Mail className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-medium text-slate-900">Contact Information</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={isEditing ? profileForm.data.email : user.email}
                          onChange={(e) => profileForm.setData('email', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={isEditing ? profileForm.data.phone : user.phone || ''}
                          onChange={(e) => profileForm.setData('phone', e.target.value)}
                          placeholder={!isEditing && !user.phone ? 'Not provided' : ''}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                        <MapPin className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-medium text-slate-900">Address Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          value={isEditing ? profileForm.data.address : user.address?.address || ''}
                          onChange={(e) => profileForm.setData('address', e.target.value)}
                          placeholder={!isEditing && !user.address?.address ? 'Not provided' : ''}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                        <input
                          type="text"
                          value={isEditing ? profileForm.data.city : user.address?.city || ''}
                          onChange={(e) => profileForm.setData('city', e.target.value)}
                          placeholder={!isEditing && !user.address?.city ? 'Not provided' : ''}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">State/Province</label>
                        <input
                          type="text"
                          value={isEditing ? profileForm.data.state : user.address?.state || ''}
                          onChange={(e) => profileForm.setData('state', e.target.value)}
                          placeholder={!isEditing && !user.address?.state ? 'Not provided' : ''}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={isEditing ? profileForm.data.postal_code : user.address?.postal_code || ''}
                          onChange={(e) => profileForm.setData('postal_code', e.target.value)}
                          placeholder={!isEditing && !user.address?.postal_code ? 'Not provided' : ''}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                        <select
                          value={isEditing ? profileForm.data.country : user.address?.country || 'United States'}
                          onChange={(e) => profileForm.setData('country', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' 
                              : 'border-slate-200 bg-slate-50'
                          }`}
                          disabled={!isEditing}
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Save Button */}
                {isEditing && (
                  <div className="mt-8 flex justify-center">
                    <button 
                      type="submit"
                      disabled={profileForm.processing}
                      className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center text-lg"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {profileForm.processing ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>

              {/* Security Section */}
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-900">Security Settings</h3>
                  </div>
                  <button 
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:border-amber-500 hover:text-amber-600 transition-colors flex items-center"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {showPasswordForm ? 'Cancel' : 'Change Password'}
                  </button>
                </div>
                
                {showPasswordForm && (
                  <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-3 flex justify-center mt-4">
                      <button 
                        type="submit"
                        disabled={passwordForm.processing}
                        className="bg-amber-500 text-slate-900 px-8 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        {passwordForm.processing ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}