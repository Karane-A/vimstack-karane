import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Calendar, CreditCard, Truck, Eye, ShoppingBag } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface FurnitureOrdersProps {
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

export default function FurnitureOrders({
  orders = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FurnitureOrdersProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-800 bg-green-100 border-green-300';
      case 'shipped':
        return 'text-blue-800 bg-blue-100 border-blue-300';
      case 'processing':
        return 'text-amber-800 bg-amber-100 border-amber-300';
      case 'cancelled':
        return 'text-red-800 bg-red-100 border-red-300';
      default:
        return 'text-slate-800 bg-slate-100 border-slate-300';
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
        theme="furniture-interior"
      >
        {/* Hero Section */}
        <div className="bg-yellow-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">My Furniture Orders</h1>
              <p className="text-amber-200 text-lg">
                Track your furniture purchases and delivery status
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {orders.length > 0 ? (
              <div className="max-w-5xl mx-auto space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-amber-50 p-6 border-b border-amber-200">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <h3 className="text-2xl font-bold text-slate-900">Order #{order.id}</h3>
                            <span className={`px-4 py-2 text-sm font-bold rounded-2xl border-2 ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2 text-amber-800">
                              <Calendar className="h-5 w-5" />
                              <span className="font-medium">
                                {new Date(order.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-amber-800">
                              <CreditCard className="h-5 w-5" />
                              <span className="font-medium">{formatCurrency(order.total, storeSettings, currencies)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-amber-800">
                              <Package className="h-5 w-5" />
                              <span className="font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                          <Link
                            href={route('store.order-detail', { storeSlug: store.slug, orderNumber: order.id })}
                            className="bg-yellow-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-yellow-900 transition-colors flex items-center justify-center"
                          >
                            <Eye className="h-5 w-5 mr-2" />
                            View Details
                          </Link>
                          {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed') && (
                            <button className="border-2 border-amber-600 text-amber-800 px-6 py-3 rounded-2xl font-bold hover:bg-amber-50 transition-colors flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 mr-2" />
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
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Package className="h-16 w-16 text-amber-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">No Furniture Orders Yet</h2>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    Start browsing our beautiful furniture collection to place your first order
                  </p>
                  <Link
                    href={route('store.products', store.slug)}
                    className="bg-yellow-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
                  >
                    <ShoppingBag className="h-6 w-6 mr-3" />
                    Browse Furniture
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