import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Calendar, Gem, Crown, Edit3, Save } from 'lucide-react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface JewelryProfileProps {
  user: User;
  store: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customer?: any;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function JewelryProfile({
  user,
  store = {},
  storeContent,
  theme = 'jewelry',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  customer,
  customPages = [],
}: JewelryProfileProps) {
  // Profile form
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

  // Password form
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.post(route('store.profile.update', { storeSlug: store.slug }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.post(route('store.profile.password', { storeSlug: store.slug }), {
      onSuccess: () => {
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
        storeId={store.id}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        theme={store.theme}
      >
        {/* Hero Section */}
        <div className="bg-yellow-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full shadow-xl mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-2 tracking-wide">
                Account Settings
              </h1>
              <p className="text-gray-600 font-light text-base max-w-lg mx-auto leading-relaxed">
                Keep your information up to date for the best shopping experience
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-yellow-200 overflow-hidden">
                
                {/* Profile Header */}
                <div className="bg-yellow-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif mb-1">
                          Welcome, {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-yellow-200 flex items-center text-sm">
                          <Gem className="w-3 h-3 mr-1" />
                          Valued Customer
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-yellow-200">
                      <p>Last updated</p>
                      <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-yellow-200">
                  <nav className="flex -mb-px px-8">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'profile'
                          ? 'border-yellow-600 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-yellow-600 hover:border-yellow-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Personal Information
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'password'
                          ? 'border-yellow-600 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-yellow-600 hover:border-yellow-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </div>
                    </button>
                  </nav>
                </div>
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="p-8">
                    <form onSubmit={handleProfileSubmit}>
                      <div className="space-y-8">
                        
                        {/* Personal Information */}
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                                <User className="w-5 h-5 text-yellow-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-serif text-gray-800 tracking-wide">Personal Details</h3>
                                <p className="text-sm text-gray-500 mt-1">Your basic information for account identification</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                              <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                First Name
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={profileForm.data.first_name}
                                  onChange={(e) => profileForm.setData('first_name', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors font-medium text-gray-800"
                                  required
                                />
                                <Gem className="absolute right-3 top-3 h-5 w-5 text-yellow-500" />
                              </div>
                              {profileForm.errors.first_name && (
                                <p className="mt-1 text-sm text-red-600">{profileForm.errors.first_name}</p>
                              )}
                            </div>
                            
                            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                              <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                Last Name
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={profileForm.data.last_name}
                                  onChange={(e) => profileForm.setData('last_name', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors font-medium text-gray-800"
                                  required
                                />
                                <Gem className="absolute right-3 top-3 h-5 w-5 text-yellow-500" />
                              </div>
                              {profileForm.errors.last_name && (
                                <p className="mt-1 text-sm text-red-600">{profileForm.errors.last_name}</p>
                              )}
                            </div>
                            
                            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                              <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                Date of Birth
                              </label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={profileForm.data.date_of_birth}
                                  onChange={(e) => profileForm.setData('date_of_birth', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors font-medium text-gray-800"
                                />
                                <Calendar className="absolute right-3 top-3 h-5 w-5 text-yellow-500" />
                              </div>
                            </div>
                            
                            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                              <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                Gender
                              </label>
                              <select
                                value={profileForm.data.gender}
                                onChange={(e) => profileForm.setData('gender', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors font-medium text-gray-800"
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <Mail className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-serif text-gray-800 tracking-wide">Contact Details</h3>
                                <p className="text-sm text-gray-500 mt-1">How we can reach you for order updates and promotions</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                              <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                Email Address
                              </label>
                              <div className="relative">
                                <input
                                  type="email"
                                  value={profileForm.data.email}
                                  onChange={(e) => profileForm.setData('email', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors font-medium text-gray-800"
                                  required
                                />
                                <Mail className="absolute right-3 top-3 h-5 w-5 text-blue-500" />
                              </div>
                              {profileForm.errors.email && (
                                <p className="mt-1 text-sm text-red-600">{profileForm.errors.email}</p>
                              )}
                            </div>
                            
                            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                              <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                Phone Number
                              </label>
                              <div className="relative">
                                <input
                                  type="tel"
                                  value={profileForm.data.phone}
                                  onChange={(e) => profileForm.setData('phone', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors font-medium text-gray-800"
                                />
                                <Phone className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Address Information */}
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                <MapPin className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-serif text-gray-800 tracking-wide">Shipping Address</h3>
                                <p className="text-sm text-gray-500 mt-1">Default delivery address for your jewelry orders</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                              <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                Street Address
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={profileForm.data.address}
                                  onChange={(e) => profileForm.setData('address', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors font-medium text-gray-800"
                                />
                                <MapPin className="absolute right-3 top-3 h-5 w-5 text-purple-500" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                                <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                  City
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.data.city}
                                  onChange={(e) => profileForm.setData('city', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors font-medium text-gray-800"
                                />
                              </div>
                              
                              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                                <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                  State
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.data.state}
                                  onChange={(e) => profileForm.setData('state', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors font-medium text-gray-800"
                                />
                              </div>
                              
                              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                                <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                  Postal Code
                                </label>
                                <input
                                  type="text"
                                  value={profileForm.data.postal_code}
                                  onChange={(e) => profileForm.setData('postal_code', e.target.value)}
                                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors font-medium text-gray-800"
                                />
                              </div>
                            </div>
                            
                            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                              <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                                Country
                              </label>
                              <select
                                value={profileForm.data.country}
                                onChange={(e) => profileForm.setData('country', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors font-medium text-gray-800"
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

                        {/* Action Buttons */}
                        <div className="pt-8 border-t border-yellow-200">
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={profileForm.processing}
                              className="flex items-center justify-center bg-yellow-600 text-white px-6 py-3 font-medium text-sm hover:bg-yellow-700 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {profileForm.processing ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Password Tab */}
                {activeTab === 'password' && (
                  <div className="p-8">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                            <Lock className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif text-gray-800 tracking-wide">Security Settings</h3>
                            <p className="text-sm text-gray-500 mt-1">Keep your account secure with a strong password</p>
                          </div>
                        </div>
                      </div>
                      

                      
                      <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                          <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordForm.data.current_password}
                              onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                              className="w-full px-4 py-3 pr-10 bg-white border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors font-medium"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-500"
                            >
                              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {passwordForm.errors.current_password && (
                            <p className="mt-1 text-sm text-red-600">{passwordForm.errors.current_password}</p>
                          )}
                        </div>
                        
                        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                          <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordForm.data.password}
                              onChange={(e) => passwordForm.setData('password', e.target.value)}
                              className="w-full px-4 py-3 pr-10 bg-white border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors font-medium"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-500"
                            >
                              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {passwordForm.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>
                          )}
                        </div>
                        
                        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                          <label className="block text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordForm.data.password_confirmation}
                              onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                              className="w-full px-4 py-3 pr-10 bg-white border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors font-medium"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-500"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end pt-6">
                          <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="flex items-center justify-center bg-red-600 text-white px-6 py-3 font-medium text-sm hover:bg-red-700 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            {passwordForm.processing ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}