import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, Mail, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  shipping_method: string;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  coupon_code?: string;
}

interface BeautyOrderConfirmationProps {
  order?: Order;
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function BeautyOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  customPages = [],
}: BeautyOrderConfirmationProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || store.slug || 'demo';
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const defaultOrder = {
    id: 'ORD-12345',
    date: new Date().toISOString(),
    status: 'Processing',
    total: 0,
    items: [],
    shipping_address: {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    billing_address: {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    payment_method: 'Credit Card',
    shipping_method: 'Standard Shipping'
  };
  
  const orderData = order || defaultOrder;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Head title={`Order Confirmation - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
        storeId={store.id}
        storeContent={storeContent}
        theme="beauty-cosmetics"
      >
        {/* Hero Section */}
        <div className="bg-rose-50 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-500 mb-8 shadow-2xl">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6">
                Order Confirmed!
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Thank you for choosing us for your beauty journey. Your order has been successfully placed.
              </p>
              <div className="inline-block bg-white text-rose-600 px-8 py-4 rounded-full font-semibold shadow-lg">
                Order #{orderData.id}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="text-center bg-rose-50 rounded-2xl p-6">
                  <Calendar className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-500 mb-2">Order Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(orderData.date)}</p>
                </div>
                
                <div className="text-center bg-rose-50 rounded-2xl p-6">
                  <Package className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                  <p className="font-semibold text-gray-900">{orderData.status}</p>
                </div>
                
                <div className="text-center bg-rose-50 rounded-2xl p-6">
                  <Truck className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-500 mb-2">Shipping</p>
                  <p className="font-semibold text-gray-900">{orderData.shipping_method}</p>
                </div>
                
                <div className="text-center bg-rose-50 rounded-2xl p-6">
                  <CreditCard className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-500 mb-2">Payment</p>
                  <p className="font-semibold text-gray-900">{orderData.payment_method}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-3xl shadow-xl border border-rose-100 mb-16 overflow-hidden">
                <div className="bg-rose-500 p-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-light text-white">Order Details</h2>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                      {orderData.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Order Items */}
                  <div className="mb-8">
                    <h3 className="text-xl font-medium text-gray-900 mb-6">Beauty Items</h3>
                    
                    <div className="space-y-4">
                      {orderData.items?.map((item) => {
                        const itemTotal = parseFloat(item.price) * item.quantity;
                        
                        return (
                          <div key={item.id} className="flex items-center space-x-4 p-4 bg-rose-50 rounded-2xl">
                            <div className="h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden">
                              <img 
                                className="h-full w-full object-cover" 
                                src={item.image ? getImageUrl(item.image) : `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=64&h=64&fit=crop&crop=center`}
                                alt={item.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=64&h=64&fit=crop&crop=center`;
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-rose-600">{formatCurrency(itemTotal, storeSettings, currencies)}</p>
                              <p className="text-sm text-gray-500">{formatCurrency(item.price, storeSettings, currencies)} each</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-8 bg-rose-50 rounded-2xl p-6">
                      <div className="space-y-3">
                        {orderData.subtotal && orderData.discount > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(orderData.subtotal, storeSettings, currencies)}</span>
                          </div>
                        )}
                        {orderData.discount && orderData.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount {orderData.coupon_code && `(${orderData.coupon_code})`}</span>
                            <span>-{formatCurrency(orderData.discount, storeSettings, currencies)}</span>
                          </div>
                        )}
                        {orderData.shipping && orderData.shipping > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{formatCurrency(orderData.shipping, storeSettings, currencies)}</span>
                          </div>
                        )}
                        {orderData.tax && orderData.tax > 0 && (
                          <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>{formatCurrency(orderData.tax, storeSettings, currencies)}</span>
                          </div>
                        )}
                        <div className="border-t border-rose-200 pt-3">
                          <div className="flex justify-between text-xl font-bold text-gray-900">
                            <span>Total</span>
                            <span className="text-rose-600">{formatCurrency(orderData.total, storeSettings, currencies)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses & Info */}
              <div className="bg-white rounded-3xl shadow-xl border border-rose-100 mb-16 overflow-hidden">
                <div className="bg-rose-500 p-8">
                  <h2 className="text-3xl font-light text-white">Shipping & Payment Information</h2>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-rose-50 rounded-2xl p-6">
                      <div className="flex items-start">
                        <MapPin className="h-6 w-6 text-rose-500 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-3">Shipping Address</p>
                          <p className="text-gray-900 leading-relaxed">
                            {orderData.shipping_address.name}<br />
                            {orderData.shipping_address.street}<br />
                            {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}<br />
                            {orderData.shipping_address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-rose-50 rounded-2xl p-6">
                      <div className="flex items-start">
                        <CreditCard className="h-6 w-6 text-rose-500 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-3">Payment Method</p>
                          <p className="text-gray-900">{orderData.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-3xl shadow-xl border border-rose-100 mb-16 overflow-hidden">
                <div className="bg-rose-500 p-8">
                  <h2 className="text-3xl font-light text-white">What's Next?</h2>
                </div>
                
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rose-100">
                          <Package className="h-6 w-6 text-rose-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Order Processing</h3>
                        <p className="mt-2 text-gray-600">
                          We're carefully preparing your beauty products. You'll receive an email when your order ships.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rose-100">
                          <Truck className="h-6 w-6 text-rose-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Beauty Delivery</h3>
                        <p className="mt-2 text-gray-600">
                          Your beauty essentials will be shipped via {orderData.shipping_method}. Track your order in your account.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rose-100">
                          <Sparkles className="h-6 w-6 text-rose-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Enjoy Your Beauty Journey</h3>
                        <p className="mt-2 text-gray-600">
                          Get ready to glow! Your carefully selected beauty products are on their way to enhance your routine.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  href={route('store.my-orders', { storeSlug })}
                  className="bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-700 transition-colors text-center shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Package className="h-5 w-5" />
                  Track Your Order
                </Link>
                <Link
                  href={route('store.products', { storeSlug })}
                  className="border-2 border-rose-200 text-rose-600 px-8 py-4 rounded-full font-semibold hover:border-rose-300 hover:bg-rose-50 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Heart className="h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}