import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { Eye, Package, Truck, Check, Clock, Gem, Star, Calendar, CreditCard, ArrowLeft, Shield, Heart } from 'lucide-react';
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

interface JewelryOrdersProps {
  orders: Order[];
  store: any;
  storeContent?: any;
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

export default function JewelryOrders({
  orders = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  customPages = [],
}: JewelryOrdersProps) {
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
        return <Check className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
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
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <Head title={`My Orders - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        storeId={store.id}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
        storeContent={storeContent}
        theme={store.theme}
      >
        {/* Navigation Breadcrumb */}
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-4">
            <Link
              href={route('store.home', { storeSlug: store.slug })}
              className="inline-flex items-center text-yellow-700 hover:text-yellow-800 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
        <div className="bg-yellow-50 py-16">
          <div className="container mx-auto px-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-yellow-200/50">
              <div className="bg-yellow-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Package className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-serif mb-1">My Orders</h1>
                      <p className="text-yellow-200 text-sm">
                        View and manage your order history
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <span className="text-white font-medium">{orders.length} Orders</span>
                  </div>
                </div>
              </div>
          
              {orders.length > 0 ? (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-serif text-gray-800 tracking-wide">Order History</h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>All orders are fully insured</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded border border-gray-200 hover:border-yellow-300 transition-colors">
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <h3 className="font-medium text-gray-900">#{order.id}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <span className="text-sm text-gray-500">{formatDate(order.date)}</span>
                              <span className="text-sm text-gray-500">{order.items?.length || 0} items</span>
                              <span className="font-semibold text-gray-900">{formatCurrency(order.total, storeSettings, currencies)}</span>
                            </div>
                            <Link
                              href={route('store.order-detail', { storeSlug: store.slug, orderNumber: order.id })}
                              target="_blank"
                              className="px-3 py-1 text-yellow-600 hover:text-yellow-700 text-sm"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-yellow-100 rounded-full mb-8 shadow-xl">
                    <Gem className="h-16 w-16 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-serif text-gray-800 mb-4">No Orders Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start shopping to see your orders here. Browse our collection and find something special.
                  </p>
                  <Link
                    href={route('store.home', { storeSlug: store.slug })}
                    className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    <Link href={route('store.products', store.slug)} className="bg-yellow-600 text-white px-8 py-4 font-medium hover:bg-yellow-700 transition-colors">
                      Start Shopping
                    </Link>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}