import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Calendar, CreditCard, Truck, Eye, ShoppingBag, Sparkles, Star, Heart } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface PerfumeOrdersProps {
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

export default function PerfumeOrders({
  orders = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: PerfumeOrdersProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-purple-600 bg-purple-50 border-purple-200';
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
        theme="perfume-fragrances"
      >
        {/* Hero Section */}
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                My Orders
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Track your fragrance orders and discover your scent journey history.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {orders.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-6">
                  {orders.map((order, index) => (
                    <div key={order.id} className="bg-white p-6 rounded-2xl shadow-md border border-purple-100 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        {/* Left Side - Order Info */}
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Package className="h-7 w-7 text-purple-800" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {/* Center - Status & Total */}
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-lg font-semibold text-purple-800">{formatCurrency(order.total, storeSettings, currencies)}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        {/* Right Side - Actions */}
                        <div className="flex items-center space-x-3">
                          <Link
                            href={route('store.order-detail', { storeSlug: store.slug, orderNumber: order.id })}
                            className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                          
                          {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed') && (
                            <button className="border border-purple-300 text-purple-800 hover:bg-purple-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-stone-50 border-2 border-dashed border-purple-200 rounded-3xl p-16">
                  <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Package className="h-16 w-16 text-purple-800" />
                  </div>
                  <h2 className="text-4xl font-light text-purple-800 mb-6">No Orders Yet</h2>
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                    Your fragrance journey awaits. Discover our curated collection of luxury scents and create your first order.
                  </p>
                  <Link
                    href={route('store.products', store.slug)}
                    className="bg-purple-800 hover:bg-purple-900 text-white px-12 py-4 rounded-full font-medium transition-colors inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Sparkles className="h-6 w-6 mr-3" />
                    Explore Fragrances
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </StoreLayout>
    </>
  );
}