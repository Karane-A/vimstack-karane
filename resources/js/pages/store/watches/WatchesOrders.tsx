import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Calendar, CreditCard, Truck, Clock, Shield, Eye, Filter, Search } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface WatchesOrdersProps {
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

export default function WatchesOrders({
  orders = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WatchesOrdersProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Shield className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: orders.length,
    processing: orders.filter(o => o.status.toLowerCase() === 'processing').length,
    shipped: orders.filter(o => o.status.toLowerCase() === 'shipped').length,
    delivered: orders.filter(o => o.status.toLowerCase() === 'delivered').length,
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
        theme="watches"
      >
        {/* Hero Section */}
        <section className="relative h-96 flex items-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="mb-6">
                  <span className="bg-amber-500 text-slate-900 px-6 py-2 text-sm font-medium tracking-wider uppercase">
                    Order History
                  </span>
                </div>
                <h1 className="text-6xl font-light text-white mb-6 leading-none tracking-tight">
                  My Orders
                </h1>
                <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                  Track your luxury timepiece orders and delivery status
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
        </section>

        <div className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {orders.length > 0 ? (
                <>
                  {/* Filters and Search */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Status Filter */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Filter className="w-5 h-5 text-slate-600 mr-2" />
                          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
                        </div>
                        <div className="flex space-x-2">
                          {[
                            { key: 'all', label: 'All', count: statusCounts.all },
                            { key: 'processing', label: 'Processing', count: statusCounts.processing },
                            { key: 'shipped', label: 'Shipped', count: statusCounts.shipped },
                            { key: 'delivered', label: 'Delivered', count: statusCounts.delivered },
                          ].map(({ key, label, count }) => (
                            <button
                              key={key}
                              onClick={() => setStatusFilter(key)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                statusFilter === key
                                  ? 'bg-amber-500 text-slate-900'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {label} ({count})
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by order number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 w-64"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Link
                        key={order.id}
                        href={route('store.order-detail', { storeSlug: store.slug, orderNumber: order.id })}
                        className="block bg-white border border-slate-200 hover:border-amber-500 transition-all duration-300 hover:shadow-lg group"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-slate-900 flex items-center justify-center">
                                <Package className="w-6 h-6 text-amber-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-light text-slate-900 group-hover:text-amber-600 transition-colors">
                                  Order #{order.id}
                                </h3>
                                <p className="text-sm text-slate-500 font-light">
                                  {new Date(order.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <div className="text-sm text-slate-500 font-light">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                                <div className="text-lg font-light text-slate-900">{formatCurrency(order.total, storeSettings, currencies)}</div>
                              </div>
                              
                              <div className={`px-4 py-2 text-xs font-medium tracking-wider uppercase flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span>{order.status}</span>
                              </div>
                              
                              <div className="w-8 h-8 bg-amber-500 flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                                <Eye className="w-4 h-4 text-slate-900" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
                        <Package className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                        <h3 className="text-xl font-medium text-slate-900 mb-2">No orders found</h3>
                        <p className="text-slate-600 mb-6">
                          No orders match your current filters. Try adjusting your search criteria.
                        </p>
                        <button
                          onClick={() => {
                            setStatusFilter('all');
                            setSearchTerm('');
                          }}
                          className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-10 w-10 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-light text-slate-900 mb-4">No Orders Yet</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      Your luxury timepiece collection awaits. Start exploring our exquisite watches to place your first order.
                    </p>
                    <Link
                      href={route('store.products', store.slug)}
                      className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-medium hover:bg-amber-600 transition-colors inline-flex items-center"
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      Explore Timepieces
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}