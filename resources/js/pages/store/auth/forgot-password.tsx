import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';

import { ChevronRight, Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
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

export default function ForgotPassword({
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: ForgotPasswordProps) {
  // Always call hooks first to maintain hook order
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });
  
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific forgot password pages to avoid circular dependencies
  const [ThemeForgotPasswordPage, setThemeForgotPasswordPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeForgotPasswordPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeForgotPasswordPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let forgotPasswordPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            forgotPasswordPageModule = await import('@/pages/store/beauty-cosmetics/BeautyForgotPassword');
            break;
          case 'fashion':
            forgotPasswordPageModule = await import('@/pages/store/fashion/FashionForgotPassword');
            break;
          case 'electronics':
            forgotPasswordPageModule = await import('@/pages/store/electronics/ElectronicsForgotPassword');
            break;
          case 'jewelry':
            forgotPasswordPageModule = await import('@/pages/store/jewelry/JewelryForgotPassword');
            break;
          case 'watches':
            forgotPasswordPageModule = await import('@/pages/store/watches/WatchesForgotPassword');
            break;
          case 'furniture-interior':
            forgotPasswordPageModule = await import('@/pages/store/furniture-interior/FurnitureForgotPassword');
            break;
          case 'cars-automotive':
            forgotPasswordPageModule = await import('@/pages/store/cars-automotive/CarsForgotPassword');
            break;
          case 'baby-kids':
            forgotPasswordPageModule = await import('@/pages/store/baby-kids/BabyKidsLogin');
            break;
          case 'perfume-fragrances':
            forgotPasswordPageModule = await import('@/pages/store/perfume-fragrances/PerfumeForgotPassword');
            break;
          default:
            setThemeForgotPasswordPage(null);
            setIsLoading(false);
            return;
        }
        setThemeForgotPasswordPage(() => forgotPasswordPageModule.default);
      } catch (error) {
        console.error('Failed to load theme forgot password page:', error);
        setThemeForgotPasswordPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeForgotPasswordPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific forgot password page, use it
  if (ThemeForgotPasswordPage) {
    return (
      <ThemeForgotPasswordPage
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
    post(route('store.forgot-password', store.slug));
  };

  return (
    <>
      <Head title={`Forgot Password - ${store.name}`} />
      
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
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Forgot Password</h1>
              <p className="text-white/80">
                Enter your email address to receive password reset instructions
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', store.slug)} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">Forgot Password</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <form onSubmit={handleSubmit}>
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
                  
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                      {processing ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
                
                <div className="text-center">
                  <Link
                    href={route('store.login', store.slug)}
                    className="inline-flex items-center text-sm text-primary hover:text-primary-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}