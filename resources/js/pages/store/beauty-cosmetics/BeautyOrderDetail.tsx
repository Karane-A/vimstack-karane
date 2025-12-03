import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BeautyFooter } from '@/components/store/beauty-cosmetics';
import { Package, Calendar, CreditCard, MapPin, ChevronRight, Sparkles, Heart, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
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
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  items: OrderItem[];
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment_method: string;
  shipping_method: string;
}

interface BeautyOrderDetailProps {
  order: Order;
  store: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function BeautyOrderDetail({
  order,
  store = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BeautyOrderDetailProps) {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-600';
      case 'shipped':
        return 'bg-blue-100 text-blue-600';
      case 'processing':
        return 'bg-rose-100 text-rose-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <Head title={`Order #${order.id} - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeId={store.id}
        customFooter={<BeautyFooter storeName={store.name} logo={store.logo} />}
      >
        <div className="bg-rose-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500 mb-8 shadow-2xl">
                <Package className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6">
                Order Details
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Order #{order.id}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
                {/* Order Header */}
                <div className="bg-rose-500 p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-2xl font-medium text-white">Order #{order.id}</h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)} bg-white/20 text-white backdrop-blur-sm`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-white/80">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Placed on {formatDate(order.date)}</span>
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
                    
                    <div className="mt-4 md:mt-0">
                      <Link
                        href={route('store.my-orders', store.slug)}
                        className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Orders
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Order Items */}
                  <div className="mb-12">
                    <div className="flex items-center mb-8">
                      <Sparkles className="h-6 w-6 text-rose-500 mr-3" />
                      <h3 className="text-2xl font-light text-gray-900">Beauty Items</h3>
                    </div>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-6 p-6 bg-rose-50 rounded-2xl">
                          <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                            <img 
                              className="w-full h-full object-cover" 
                              src={item.image ? getImageUrl(item.image) : `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop&crop=center`}
                              alt={item.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop&crop=center`;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                            <p className="text-gray-600">Qty: {item.quantity} × {formatCurrency(item.price, storeSettings, currencies)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-rose-600">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary & Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Shipping Address */}
                    <div>
                      <div className="flex items-center mb-6">
                        <MapPin className="h-6 w-6 text-rose-500 mr-3" />
                        <h3 className="text-2xl font-light text-gray-900">Shipping Address</h3>
                      </div>
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6">
                        <div className="space-y-2 text-gray-900">
                          <p className="font-semibold text-lg">{order.shipping_address.name}</p>
                          <p>{order.shipping_address.street}</p>
                          <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                          <p>{order.shipping_address.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <div className="flex items-center mb-6">
                        <CreditCard className="h-6 w-6 text-rose-500 mr-3" />
                        <h3 className="text-2xl font-light text-gray-900">Order Summary</h3>
                      </div>
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(order.subtotal, storeSettings, currencies)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between items-center text-green-600">
                              <span>Discount:</span>
                              <span className="font-semibold">-{formatCurrency(order.discount, storeSettings, currencies)}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(order.shipping, storeSettings, currencies)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tax:</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(order.tax, storeSettings, currencies)}</span>
                          </div>
                          <div className="border-t border-rose-200 pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-gray-900">Total:</span>
                              <span className="text-xl font-bold text-rose-600">{formatCurrency(order.total, storeSettings, currencies)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Shipping Info */}
                  <div className="mt-12 pt-8 border-t border-rose-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-rose-50 rounded-2xl p-6">
                        <div className="flex items-center mb-4">
                          <CreditCard className="h-5 w-5 text-rose-500 mr-2" />
                          <h4 className="font-semibold text-gray-900">Payment Method</h4>
                        </div>
                        <p className="text-gray-700">{order.payment_method}</p>
                      </div>
                      <div className="bg-rose-50 rounded-2xl p-6">
                        <div className="flex items-center mb-4">
                          <Package className="h-5 w-5 text-rose-500 mr-2" />
                          <h4 className="font-semibold text-gray-900">Shipping Method</h4>
                        </div>
                        <p className="text-gray-700">{order.shipping_method}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-12 flex flex-wrap gap-4 justify-center">
                    <Link
                      href={route('store.my-orders', store.slug)}
                      className="px-8 py-4 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Package className="h-5 w-5" />
                      View All Orders
                    </Link>
                    <Link
                      href={route('store.products', store.slug)}
                      className="px-8 py-4 border-2 border-rose-200 text-rose-600 rounded-full font-semibold hover:border-rose-300 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <Heart className="h-5 w-5" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}