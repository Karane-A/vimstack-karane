import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter } from '@/components/store/fashion';
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react';

interface FashionProfileProps {
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

export default function FashionProfile({
  user,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionProfileProps) {
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
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        <div className="bg-black text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-thin tracking-wide mb-6">My Profile</h1>
              <p className="text-white/70 font-light text-lg">
                Manage your account information
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 p-8">
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-2xl font-thin mb-6 tracking-wide">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                          First Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={user.first_name}
                            className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                            readOnly
                          />
                          <User className="absolute right-0 top-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                          Last Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={user.last_name}
                            className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                            readOnly
                          />
                          <User className="absolute right-0 top-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h2 className="text-2xl font-thin mb-6 tracking-wide">Contact Information</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user.email}
                            className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                            readOnly
                          />
                          <Mail className="absolute right-0 top-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={user.phone || 'Not provided'}
                            className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                            readOnly
                          />
                          <Phone className="absolute right-0 top-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  {user.address && (
                    <div>
                      <h2 className="text-2xl font-thin mb-6 tracking-wide">Address Information</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                            Address
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={user.address.address || 'Not provided'}
                              className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                              readOnly
                            />
                            <MapPin className="absolute right-0 top-3 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                              City
                            </label>
                            <input
                              type="text"
                              value={user.address.city || 'Not provided'}
                              className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              value={user.address.postal_code || 'Not provided'}
                              className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-8 flex space-x-4">
                    <button className="bg-black text-white px-8 py-3 font-light tracking-wide uppercase text-sm hover:bg-gray-800 transition-colors">
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="border border-gray-300 px-8 py-3 font-light tracking-wide uppercase text-sm hover:border-black transition-colors"
                    >
                      {showPasswordForm ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>
                  
                  {/* Password Change Form */}
                  {showPasswordForm && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <h2 className="text-2xl font-thin mb-6 tracking-wide">Change Password</h2>
                      <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                            className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.data.password}
                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                            className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-light tracking-widest uppercase text-gray-700 mb-3">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.data.password_confirmation}
                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                            className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-colors font-light"
                            required
                          />
                        </div>
                        
                        <div className="flex space-x-4">
                          <button 
                            type="submit"
                            disabled={passwordForm.processing}
                            className="bg-black text-white px-8 py-3 font-light tracking-wide uppercase text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 border-0 focus:outline-none focus:ring-0"
                            style={{ backgroundColor: '#000000', color: '#ffffff' }}
                          >
                            {passwordForm.processing ? 'Updating...' : 'Update Password'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setShowPasswordForm(false)}
                            className="border border-gray-300 px-8 py-3 font-light tracking-wide uppercase text-sm hover:border-black transition-colors"
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
      </StoreLayout>
    </>
  );
}