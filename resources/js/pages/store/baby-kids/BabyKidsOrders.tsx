import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Calendar, DollarSign, Eye, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/utils/currency-formatter';

interface BabyKidsOrdersProps {
  orders: Array<{
    id: string;
    date: string;
    status: string;
    total: number;
    items: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }>;
  }>;
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: any[];
  storeSettings?: any;
  currencies?: any[];
}

export default function BabyKidsOrders({
  orders,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  customPages = [],
  storeSettings = {},
  currencies = [],
}: BabyKidsOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <>
      <Head title={`My Orders - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme="baby-kids"
      >
        {/* Hero Section */}
        <div className="bg-pink-50 py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">My Orders</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Orders Content */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                  <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShoppingBag className="h-16 w-16 text-pink-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet!</h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">Ready to find something special for your little one? Let's start shopping together!</p>
                  <Link
                    href={route('store.home', store.slug)}
                    className="bg-pink-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-pink-100 hover:border-pink-200 transition-all duration-300">
                      {/* Order Header */}
                      <div className="bg-pink-50 px-6 py-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center">
                              <Package className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">Order #{order.id}</h3>
                              <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(order.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="font-semibold">{formatCurrency(order.total, storeSettings, currencies)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <Link
                              href={route('store.order-detail', { storeSlug: store.slug, orderNumber: order.id })}
                              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-md"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="px-6 pb-6">
                        <div className="bg-pink-25 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">
                                {order.items.length} special item{order.items.length !== 1 ? 's' : ''} for your little one
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              Ordered {new Date(order.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}