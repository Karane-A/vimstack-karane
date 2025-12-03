import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, MapPin, CreditCard, Sparkles, Calendar, Star } from 'lucide-react';
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

interface PerfumeOrderDetailProps {
  order: Order;
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customer?: any;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function PerfumeOrderDetail({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customer = null,
  customPages = [],
}: PerfumeOrderDetailProps) {
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
      <Head title={`Order #${order.id} - ${store.name}`} />
      
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
                Order Details
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Your fragrance order information and delivery details.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white p-8 rounded-t-3xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-purple-900" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-light">Order #{order.id}</h2>
                      <p className="text-purple-200 text-sm">Placed on {formatDate(order.date)}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border-x border-purple-100 p-8">
                <h3 className="text-xl font-medium text-purple-800 mb-6">Your Fragrance Collection</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-stone-50 rounded-xl border border-purple-100">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg border border-purple-200">
                        <img 
                          className="w-full h-full object-cover" 
                          src={getImageUrl(item.cover_image || item.image || item.product?.cover_image || item.product?.image)}
                          alt={item.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/200x200/f5f5f5/7c3aed?text=${encodeURIComponent(item.name)}`;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Unit Price</p>
                        <p className="text-lg font-medium text-purple-800">{formatCurrency(item.price, storeSettings, currencies)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-medium text-purple-800">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="bg-white border-x border-purple-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Shipping Address */}
                  <div className="bg-stone-50 p-6 rounded-xl border border-purple-100">
                    <h4 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Delivery Address
                    </h4>
                    <div className="space-y-1 text-gray-900">
                      <p className="font-medium">{order.shipping_address.name}</p>
                      <p>{order.shipping_address.street}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                  </div>

                  {/* Payment & Shipping Info */}
                  <div className="bg-stone-50 p-6 rounded-xl border border-purple-100">
                    <h4 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment & Delivery
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-medium text-gray-900">{order.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivery Method</p>
                        <p className="font-medium text-gray-900">{order.shipping_method}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-purple-800 to-purple-900 text-white p-8 rounded-b-3xl">
                <h4 className="text-xl font-light mb-6 flex items-center">
                  <Sparkles className="h-6 w-6 text-amber-400 mr-2" />
                  Order Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-purple-200">
                    <span>Subtotal</span>
                    <span className="text-white">{formatCurrency(order.subtotal, storeSettings, currencies)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount, storeSettings, currencies)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-purple-200">
                    <span>Shipping</span>
                    <span className="text-white">{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping, storeSettings, currencies)}</span>
                  </div>
                  <div className="flex justify-between text-purple-200">
                    <span>Tax</span>
                    <span className="text-white">{formatCurrency(order.tax, storeSettings, currencies)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-medium text-white pt-3 border-t-2 border-amber-400">
                    <span>Total</span>
                    <span className="text-amber-400">{formatCurrency(order.total, storeSettings, currencies)}</span>
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