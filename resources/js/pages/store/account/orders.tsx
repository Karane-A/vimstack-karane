import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AccountLayout from '@/layouts/AccountLayout';

import { Eye, Package, Truck, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/currency-formatter';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface OrdersProps {
  orders: Order[];
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

export default function Orders({
  orders = [],
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  customPages = [],
}: OrdersProps) {
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific orders pages to avoid circular dependencies
  const [ThemeOrdersPage, setThemeOrdersPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeOrdersPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeOrdersPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let ordersPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            ordersPageModule = await import('@/pages/store/beauty-cosmetics/BeautyOrders');
            break;
          case 'fashion':
            ordersPageModule = await import('@/pages/store/fashion/FashionOrders');
            break;
          case 'electronics':
            ordersPageModule = await import('@/pages/store/electronics/ElectronicsOrders');
            break;
          case 'jewelry':
            ordersPageModule = await import('@/pages/store/jewelry/JewelryOrders');
            break;
          case 'watches':
            ordersPageModule = await import('@/pages/store/watches/WatchesOrders');
            break;
          case 'furniture-interior':
            ordersPageModule = await import('@/pages/store/furniture-interior/FurnitureOrders');
            break;
          case 'cars-automotive':
            ordersPageModule = await import('@/pages/store/cars-automotive/CarsOrders');
            break;
          case 'baby-kids':
            ordersPageModule = await import('@/pages/store/baby-kids/BabyKidsOrders');
            break;
          case 'perfume-fragrances':
            ordersPageModule = await import('@/pages/store/perfume-fragrances/PerfumeOrders');
            break;
          default:
            setThemeOrdersPage(null);
            setIsLoading(false);
            return;
        }
        setThemeOrdersPage(() => ordersPageModule.default);
      } catch (error) {
        console.error('Failed to load theme orders page:', error);
        setThemeOrdersPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeOrdersPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific orders page, use it
  if (ThemeOrdersPage) {
    return (
      <ThemeOrdersPage
        orders={orders}
        store={store}
        storeContent={storeContent}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
      />
    );
  }

  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head title={`My Orders - ${store.name}`} />
      
      <AccountLayout
        title="My Orders"
        description="Track and manage your order history"
        activeTab="orders"
        store={store}
        storeContent={storeContent}
        theme={theme}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order History</h2>
            <p className="mt-1 text-sm text-gray-500">
              Check the status of recent orders, manage returns, and download invoices.
            </p>
          </div>
          
          {orders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-medium text-gray-900">{formatCurrency(order.total, storeSettings, currencies)}</p>
                      </div>
                      <Link
                        href={route('store.order-detail', { storeSlug: store.slug, orderNumber: order.id })}
                        target="_blank"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Order
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
              <p className="text-gray-500 mb-4">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                href={route('store.products', store.slug)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </AccountLayout>
    </>
  );
}