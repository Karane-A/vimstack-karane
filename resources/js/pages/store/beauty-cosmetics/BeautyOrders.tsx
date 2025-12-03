import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BeautyFooter } from '@/components/store/beauty-cosmetics';
import { Package, Calendar, CreditCard, Truck, Sparkles, Heart, Eye } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface BeautyOrdersProps {
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
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function BeautyOrders({
  orders = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BeautyOrdersProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-rose-600 bg-rose-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
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
        theme={store.theme}
      >
        <div className="bg-rose-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500 mb-8 shadow-2xl">
                <Package className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6">
                Beauty Orders
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Track your beauty journey and past purchases
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            {orders.length > 0 ? (
              <div className="max-w-5xl mx-auto space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-rose-500 p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <h3 className="text-xl font-medium text-white">Order #{order.id}</h3>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)} bg-white/20 text-white backdrop-blur-sm`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-white/80">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4" />
                              <span>Total: {formatCurrency(order.total, storeSettings, currencies)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4" />
                              <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                          <Link
                            href={route('store.order-detail', { storeSlug: store.slug, orderNumber: order.id })}
                            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/30 transition-colors text-center flex items-center justify-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                          {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed') && (
                            <button className="px-6 py-3 bg-white text-rose-600 rounded-full font-medium hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                              <Heart className="h-4 w-4" />
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>


                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Package className="h-12 w-12 text-rose-400" />
                </div>
                <h2 className="text-3xl font-light text-gray-900 mb-4">No beauty orders yet</h2>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Start your beauty journey and discover amazing products
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-flex items-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-full shadow-lg hover:bg-rose-700 hover:shadow-xl transition-all duration-300 gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </StoreLayout>
    </>
  );
}