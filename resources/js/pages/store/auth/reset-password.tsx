import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface ResetPasswordProps {
  store: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  token?: string;
  email?: string;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function ResetPassword({
  store = {},
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  token = '',
  email = '',
  customPages = [],
}: ResetPasswordProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = 'Please confirm your password';
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real app, this would dispatch an action to reset the password
    console.log('Reset password with token', token, 'for email', email, 'to', password);
    
    // Show success message
    setSubmitted(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
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
      >
        {/* Hero Section */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Reset Password</h1>
              <p className="text-white/80">
                Create a new password for your account
              </p>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', { storeSlug })} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <Link href={route('store.login', { storeSlug })} className="text-gray-500 hover:text-primary">Login</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <Link href={route('store.forgot-password', { storeSlug })} className="text-gray-500 hover:text-primary">Forgot Password</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">Reset Password</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                {submitted ? (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful</h2>
                    <p className="text-gray-600 mb-6">
                      Your password has been reset successfully. You can now log in with your new password.
                    </p>
                    <div className="flex justify-center">
                      <Link
                        href={route('store.login', { storeSlug })}
                        className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Log In Now
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-6">
                      Please enter your new password below. Your password must be at least 8 characters long.
                    </p>
                    <form onSubmit={handleSubmit}>
                      {/* Hidden Email Field */}
                      <input type="hidden" name="email" value={email} />
                      <input type="hidden" name="token" value={token} />
                      
                      {/* Password */}
                      <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`block w-full pl-10 pr-10 py-2 border ${
                              errors.password ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                      </div>
                      
                      {/* Password Confirmation */}
                      <div className="mb-6">
                        <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="passwordConfirmation"
                            type={showPasswordConfirmation ? "text" : "password"}
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className={`block w-full pl-10 pr-10 py-2 border ${
                              errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordConfirmationVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswordConfirmation ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.passwordConfirmation && (
                          <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation}</p>
                        )}
                      </div>
                      
                      {/* Password Requirements */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li className="flex items-center">
                            <span className={`inline-block w-4 h-4 mr-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            At least 8 characters long
                          </li>
                          <li className="flex items-center">
                            <span className={`inline-block w-4 h-4 mr-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            Contains at least one uppercase letter
                          </li>
                          <li className="flex items-center">
                            <span className={`inline-block w-4 h-4 mr-2 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            Contains at least one lowercase letter
                          </li>
                          <li className="flex items-center">
                            <span className={`inline-block w-4 h-4 mr-2 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            Contains at least one number
                          </li>
                          <li className="flex items-center">
                            <span className={`inline-block w-4 h-4 mr-2 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            Contains at least one special character
                          </li>
                        </ul>
                      </div>
                      
                      {/* Submit Button */}
                      <div className="mb-6">
                        <button
                          type="submit"
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          Reset Password
                        </button>
                      </div>
                      
                      {/* Back to Login */}
                      <div className="text-center">
                        <Link
                          href={route('store.login', { storeSlug })}
                          className="inline-flex items-center text-primary hover:text-primary-700"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to login
                        </Link>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}