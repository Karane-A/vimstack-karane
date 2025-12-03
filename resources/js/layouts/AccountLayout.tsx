import React from 'react';
import { Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { User, Package, CreditCard, Heart, LogOut, ChevronRight } from 'lucide-react';

interface AccountLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  activeTab: 'profile' | 'orders' | 'payment' | 'wishlist';
  store: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function AccountLayout({
  children,
  title,
  description,
  activeTab,
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  customPages = [],
}: AccountLayoutProps) {
  const tabs = [
    {
      id: 'profile',
      name: 'My Profile',
      icon: User,
      route: 'store.my-profile',
    },
    {
      id: 'orders',
      name: 'My Orders',
      icon: Package,
      route: 'store.my-orders',
    },
    {
      id: 'wishlist',
      name: 'My Wishlist',
      icon: Heart,
      route: 'store.wishlist',
    },
  ];

  return (
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
      theme={store.theme}
    >
      {/* Hero Section */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            {description && (
              <p className="text-white/80">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href={route('store.home', { storeSlug: theme })} className="text-gray-500 hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-gray-800 font-medium">{title}</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-gray-50 border-b">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                      {userName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-500">Customer</p>
                    </div>
                  </div>
                </div>
                <nav className="space-y-1 p-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Link
                        key={tab.id}
                        href={route(tab.route, store.slug || store.theme || 'demo')}
                        className={`flex items-center px-4 py-3 rounded-md ${
                          activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'} mr-3`} />
                        <span>{tab.name}</span>
                      </Link>
                    );
                  })}
                  <Link
                    href={route('store.logout', store.slug || store.theme || 'demo')}
                    method="post"
                    as="button"
                    className="flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    <LogOut className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Logout</span>
                  </Link>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}