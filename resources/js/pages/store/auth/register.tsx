import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';


import { ChevronRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  store: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function Register({
  store = {},
  storeContent = {},
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: RegisterProps) {
  // Always call hooks first to maintain hook order
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific register pages to avoid circular dependencies
  const [ThemeRegisterPage, setThemeRegisterPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeRegisterPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeRegisterPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let registerPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            registerPageModule = await import('@/pages/store/beauty-cosmetics/BeautyRegister');
            break;
          case 'fashion':
            registerPageModule = await import('@/pages/store/fashion/FashionRegister');
            break;
          case 'electronics':
            registerPageModule = await import('@/pages/store/electronics/ElectronicsRegister');
            break;
          case 'jewelry':
            registerPageModule = await import('@/pages/store/jewelry/JewelryRegister');
            break;
          case 'watches':
            registerPageModule = await import('@/pages/store/watches/WatchesRegister');
            break;
          case 'furniture-interior':
            registerPageModule = await import('@/pages/store/furniture-interior/FurnitureRegister');
            break;
          case 'cars-automotive':
            registerPageModule = await import('@/pages/store/cars-automotive/CarsRegister');
            break;
          case 'baby-kids':
            registerPageModule = await import('@/pages/store/baby-kids/BabyKidsLogin');
            break;
          case 'perfume-fragrances':
            registerPageModule = await import('@/pages/store/perfume-fragrances/PerfumeRegister');
            break;
          default:
            setThemeRegisterPage(null);
            setIsLoading(false);
            return;
        }
        setThemeRegisterPage(() => registerPageModule.default);
      } catch (error) {
        console.error('Failed to load theme register page:', error);
        setThemeRegisterPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeRegisterPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific register page, use it
  if (ThemeRegisterPage) {
    return (
      <ThemeRegisterPage
        store={store}
        storeContent={storeContent}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
      />
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('store.register', store.slug));
  };

  return (
    <>
      <Head title={`Register - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme || theme}
      >
        {/* Hero Section */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Create an Account</h1>
              <p className="text-white/80">
                Join us to enjoy personalized shopping experience and exclusive offers
              </p>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', store.slug)} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">Register</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <form onSubmit={handleSubmit}>
                  {/* First Name */}
                  <div className="mb-6">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="first_name"
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.first_name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                        placeholder="John"
                        required
                      />
                    </div>
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                    )}
                  </div>
                  
                  {/* Last Name */}
                  <div className="mb-6">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="last_name"
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.last_name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                        placeholder="Doe"
                        required
                      />
                    </div>
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Password */}
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`block w-full pl-10 pr-10 py-2 border ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                        placeholder="••••••••"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label htmlFor="password-confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password-confirmation"
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className={`block w-full pl-10 pr-10 py-2 border ${
                          errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                        placeholder="••••••••"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showPasswordConfirmation ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.password_confirmation && (
                      <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                  </div>
                  

                  
                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                      {processing ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </form>
                
                {/* Divider */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                  </div>
                </div>
                
                {/* Social Login */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="#4285F4" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24,12.073c0,-5.8 -4.701,-10.5 -10.5,-10.5c-5.799,0 -10.5,4.7 -10.5,10.5c0,5.24 3.84,9.58 8.86,10.37v-7.34h-2.67v-3.03h2.67v-2.31c0,-2.63 1.57,-4.09 3.97,-4.09c1.15,0 2.35,0.21 2.35,0.21v2.59h-1.32c-1.31,0 -1.72,0.81 -1.72,1.64v1.97h2.92l-0.47,3.03h-2.45v7.34c5.02,-0.79 8.86,-5.13 8.86,-10.37z"/>
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
                
                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      href={route('store.login', store.slug)}
                      className="font-medium text-primary hover:text-primary-700"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}