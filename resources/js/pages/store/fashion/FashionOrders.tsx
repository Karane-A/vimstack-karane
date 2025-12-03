import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter } from '@/components/store/fashion';
import { Package, Calendar, CreditCard, Truck } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface FashionOrdersProps {
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

export default function FashionOrders({
  orders = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionOrdersProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
        <div className="bg-black text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-thin tracking-wide mb-6">My Orders</h1>
              <p className="text-white/70 font-light text-lg">
                Track your fashion journey
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {orders.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 p-8">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-light tracking-wide">Order #{order.id}</h3>
                          <span className={`px-3 py-1 text-xs font-medium tracking-wider uppercase ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-gray-500 font-light">
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
                          className="px-6 py-2 border border-gray-300 text-sm font-light tracking-wide uppercase hover:border-black transition-colors text-center"
                        >
                          View Details
                        </Link>
                        {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed') && (
                          <button className="px-6 py-2 bg-black text-white text-sm font-light tracking-wide uppercase hover:bg-gray-800 transition-colors">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>


                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-thin text-gray-900 mb-4">No orders yet</h2>
                <p className="text-gray-600 font-light mb-8">
                  Start shopping to see your orders here
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-block bg-black text-white px-8 py-3 font-light tracking-wide uppercase hover:bg-gray-800 transition-colors"
                >
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