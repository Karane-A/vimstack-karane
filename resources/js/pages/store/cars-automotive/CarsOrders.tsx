import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Calendar, CreditCard, Truck, Eye, ShoppingBag, Wrench, Settings, Zap } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface CarsOrdersProps {
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

export default function CarsOrders({
  orders = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: CarsOrdersProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-400 bg-green-900/20 border-green-600';
      case 'shipped':
        return 'text-blue-400 bg-blue-900/20 border-blue-600';
      case 'processing':
        return 'text-red-400 bg-red-900/20 border-red-600';
      case 'cancelled':
        return 'text-gray-400 bg-gray-900/20 border-gray-600';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-600';
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
        theme="cars-automotive"
      >
        {/* Industrial Header */}
        <div className="bg-black text-white py-20 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <Package className="h-6 w-6 text-white transform -rotate-45" />
                </div>
                <div>
                  <h1 className="text-5xl font-black tracking-wider">ORDER HISTORY</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Performance Parts Tracking</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl">
              Track your automotive parts orders and installation status
            </p>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            {orders.length > 0 ? (
              <div className="max-w-6xl mx-auto space-y-8">
                {orders.map((order, index) => (
                  <div key={order.id} className="bg-white border-l-8 border-red-600 shadow-lg">
                    {/* Order Card */}
                    <div className="bg-white p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-red-600 text-white px-4 py-2 font-black uppercase tracking-wider">
                              #{String(index + 1).padStart(3, '0')}
                            </div>
                            <h3 className="text-2xl font-black tracking-wider uppercase text-gray-900">ORDER {order.id}</h3>
                            <span className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 border-l-4 border-red-600">
                              <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-red-600" />
                                <div>
                                  <div className="text-xs font-bold tracking-wider uppercase text-gray-600">Order Date</div>
                                  <div className="font-bold text-gray-900">
                                    {new Date(order.date).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 border-l-4 border-red-600">
                              <div className="flex items-center space-x-3">
                                <CreditCard className="h-5 w-5 text-red-600" />
                                <div>
                                  <div className="text-xs font-bold tracking-wider uppercase text-gray-600">Total Amount</div>
                                  <div className="font-bold text-gray-900 text-lg">{formatCurrency(order.total, storeSettings, currencies)}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 border-l-4 border-red-600">
                              <div className="flex items-center space-x-3">
                                <Wrench className="h-5 w-5 text-red-600" />
                                <div>
                                  <div className="text-xs font-bold tracking-wider uppercase text-gray-600">Parts Count</div>
                                  <div className="font-bold text-gray-900">{order.items.length} Part{order.items.length !== 1 ? 's' : ''}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-3 lg:ml-8">
                          <Link
                            href={route('store.order-detail', { storeSlug: store.slug, orderNumber: order.id })}
                            className="bg-red-600 hover:bg-black text-white px-8 py-4 font-bold tracking-wider uppercase transition-colors flex items-center justify-center min-w-[200px]"
                          >
                            <Eye className="h-5 w-5 mr-2" />
                            View Details
                          </Link>
                          
                          {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed') && (
                            <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 font-bold tracking-wider uppercase transition-all flex items-center justify-center min-w-[200px]">
                              <Zap className="h-5 w-5 mr-2" />
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>



                    {/* Progress Bar */}
                    <div className="bg-black px-8 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${order.status === 'processing' ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                          <div className={`w-3 h-3 rounded-full ${order.status === 'shipped' ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                          <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                          <div className={`w-3 h-3 rounded-full ${order.status === 'completed' ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                        </div>
                        <div className="text-red-400 font-bold tracking-wider uppercase text-sm">
                          {order.status === 'delivered' ? 'Parts Delivered' : 
                           order.status === 'shipped' ? 'Parts Shipped' : 
                           order.status === 'processing' ? 'Processing Order' : 
                           order.status === 'completed' ? 'Installation Complete' :
                           'Order Status'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-2xl mx-auto bg-white border-2 border-dashed border-gray-300 p-16">
                  <div className="w-32 h-32 bg-gray-100 flex items-center justify-center mx-auto mb-8 transform rotate-45">
                    <Package className="h-16 w-16 text-gray-400 transform -rotate-45" />
                  </div>
                  <h2 className="text-4xl font-black text-black mb-6 tracking-wider uppercase">EMPTY GARAGE</h2>
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                    No performance parts orders yet. Start building your automotive setup with premium components.
                  </p>
                  <Link
                    href={route('store.products', store.slug)}
                    className="bg-red-600 hover:bg-black text-white px-12 py-4 font-bold tracking-wider uppercase transition-colors inline-flex items-center"
                  >
                    <Wrench className="h-6 w-6 mr-3" />
                    Browse Performance Parts
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