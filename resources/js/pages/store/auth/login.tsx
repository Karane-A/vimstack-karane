import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';


import { ChevronRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
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

export default function Login({
  store = {},
  storeContent = {},
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: LoginProps) {
  // Always call hooks first to maintain hook order
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });
  
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific login pages to avoid circular dependencies
  const [ThemeLoginPage, setThemeLoginPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeLoginPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeLoginPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let loginPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            loginPageModule = await import('@/pages/store/beauty-cosmetics/BeautyLogin');
            break;
          case 'fashion':
            loginPageModule = await import('@/pages/store/fashion/FashionLogin');
            break;
          case 'electronics':
            loginPageModule = await import('@/pages/store/electronics/ElectronicsLogin');
            break;
          case 'jewelry':
            loginPageModule = await import('@/pages/store/jewelry/JewelryLogin');
            break;
          case 'watches':
            loginPageModule = await import('@/pages/store/watches/WatchesLogin');
            break;
          case 'furniture-interior':
            loginPageModule = await import('@/pages/store/furniture-interior/FurnitureLogin');
            break;
          case 'cars-automotive':
            loginPageModule = await import('@/pages/store/cars-automotive/CarsLogin');
            break;
          case 'baby-kids':
            loginPageModule = await import('@/pages/store/baby-kids/BabyKidsLogin');
            break;
          case 'perfume-fragrances':
            loginPageModule = await import('@/pages/store/perfume-fragrances/PerfumeLogin');
            break;
          default:
            setThemeLoginPage(null);
            setIsLoading(false);
            return;
        }
        setThemeLoginPage(() => loginPageModule.default);
      } catch (error) {
        console.error('Failed to load theme login page:', error);
        setThemeLoginPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeLoginPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific login page, use it
  if (ThemeLoginPage) {
    return (
      <ThemeLoginPage
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
    post(route('store.login', store.slug));
  };

  return (
    <>
      <Head title={`Login - ${store.name}`} />
      
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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Login</h1>
              <p className="text-white/80">
                Sign in to your account to access your orders, wishlist, and more
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
              <span className="text-gray-800 font-medium">Login</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <form onSubmit={handleSubmit}>
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
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Link
                        href={route('store.forgot-password', store.slug)}
                        className="text-sm text-primary hover:text-primary-700"
                      >
                        Forgot password?
                      </Link>
                    </div>
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
                  </div>
                  
                  {/* Remember Me */}
                  <div className="flex items-center mb-6">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                      {processing ? 'Signing In...' : 'Sign In'}
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
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
                
                {/* Register Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      href={route('store.register', store.slug)}
                      className="font-medium text-primary hover:text-primary-700"
                    >
                      Sign up now
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