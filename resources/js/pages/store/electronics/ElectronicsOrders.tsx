import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ElectronicsFooter } from '@/components/store/electronics';
import { Package, Calendar, CreditCard, Truck, Eye } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface ElectronicsOrdersProps {
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

export default function ElectronicsOrders({
  orders = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: ElectronicsOrdersProps) {
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
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
        <div className="bg-gray-50 min-h-screen">
          {/* Header */}
          <section className="bg-slate-900 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">My Orders</h1>
              <p className="text-xl text-blue-100">Track your electronics purchases</p>
            </div>
          </section>

          {/* Orders Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {orders.length > 0 ? (
                <div className="max-w-6xl mx-auto space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* Order Header */}
                      <div className="bg-slate-900 text-white p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                              <h3 className="text-xl font-bold">Order #{order.id}</h3>
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-blue-100">
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
                              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                            {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed') && (
                              <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-colors">
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
                <div className="max-w-2xl mx-auto text-center py-20">
                  <div className="bg-white rounded-2xl shadow-lg p-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-10 w-10 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                      Start shopping for the latest electronics and gadgets
                    </p>
                    <Link
                      href={route('store.products', store.slug)}
                      className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <Package className="w-5 h-5 mr-2" />
                      Start Shopping
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </StoreLayout>
    </>
  );
}