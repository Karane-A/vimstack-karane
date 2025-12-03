import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, Sparkles, Star, Heart, MessageCircle } from 'lucide-react';
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

interface PerfumeOrderConfirmationProps {
  order?: Order;
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  whatsappRedirectUrl?: string;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function PerfumeOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  whatsappRedirectUrl,
  customPages = [],
}: PerfumeOrderConfirmationProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || store.slug || 'demo';
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const [showWhatsappPrompt, setShowWhatsappPrompt] = useState(false);
  
  useEffect(() => {
    if (whatsappRedirectUrl && (order?.payment_method === 'whatsapp' || order?.payment_method === 'WhatsApp')) {
      setShowWhatsappPrompt(true);
      
      const timer = setTimeout(() => {
        window.open(whatsappRedirectUrl, '_blank');
        fetch('/api/clear-whatsapp-session', { method: 'POST' });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [whatsappRedirectUrl, order?.payment_method]);
  
  // Provide default order data if none provided
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
    payment_method: 'Cash on Delivery',
    shipping_method: 'Standard Delivery'
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
        theme="perfume-fragrances"
      >
        {/* Elegant Success Header */}
        <div className="bg-gradient-to-r from-purple-50 to-stone-50 py-20 border-b border-purple-200">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-px bg-amber-400"></div>
                <div className="mx-6">
                  <div className="w-20 h-20 bg-purple-800 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="w-16 h-px bg-amber-400"></div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                Order Confirmed
              </h1>
              
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
                Your fragrance journey begins now. We've received your order and will prepare it with the utmost care.
              </p>
              
              <div className="inline-flex items-center bg-white border-2 border-purple-200 rounded-full px-8 py-4 shadow-lg">
                <span className="text-purple-800 font-medium mr-3">Order Number:</span>
                <span className="text-purple-800 font-bold text-lg">{orderData.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Auto Redirect */}
        {whatsappRedirectUrl && (order?.payment_method === 'whatsapp' || order?.payment_method === 'WhatsApp') && (
          <div className="bg-gradient-to-r from-purple-50 to-stone-50 py-12 border-b border-purple-200">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-px bg-amber-400"></div>
                  <div className="mx-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-white animate-pulse" />
                    </div>
                  </div>
                  <div className="w-12 h-px bg-amber-400"></div>
                </div>
                
                <h3 className="text-2xl font-light text-purple-800 mb-4">
                  Opening WhatsApp...
                </h3>
                
                <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                  Your fragrance order confirmation will open in WhatsApp automatically.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      window.open(whatsappRedirectUrl, '_blank');
                      fetch('/api/clear-whatsapp-session', { method: 'POST' });
                    }}
                    className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
                  >
                    Open WhatsApp Now
                  </button>
                  <button
                    onClick={() => setShowWhatsappPrompt(false)}
                    className="border-2 border-purple-800 text-purple-800 px-6 py-3 rounded-full font-medium hover:bg-purple-800 hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Cards */}
        <div className="bg-white py-16 border-b border-purple-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gradient-to-br from-purple-50 to-stone-50 rounded-3xl p-6 text-center border border-purple-100">
                  <Calendar className="h-12 w-12 text-purple-800 mx-auto mb-4" />
                  <p className="text-sm font-medium text-purple-800 mb-2">Order Date</p>
                  <p className="text-gray-900 font-medium">{formatDate(orderData.date)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-stone-50 rounded-3xl p-6 text-center border border-purple-100">
                  <Package className="h-12 w-12 text-purple-800 mx-auto mb-4" />
                  <p className="text-sm font-medium text-purple-800 mb-2">Status</p>
                  <p className="text-gray-900 font-medium">{orderData.status}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-stone-50 rounded-3xl p-6 text-center border border-purple-100">
                  <Truck className="h-12 w-12 text-purple-800 mx-auto mb-4" />
                  <p className="text-sm font-medium text-purple-800 mb-2">Delivery</p>
                  <p className="text-gray-900 font-medium">{orderData.shipping_method}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-stone-50 rounded-3xl p-6 text-center border border-purple-100">
                  <CreditCard className="h-12 w-12 text-purple-800 mx-auto mb-4" />
                  <p className="text-sm font-medium text-purple-800 mb-2">Payment</p>
                  <p className="text-gray-900 font-medium">{orderData.payment_method}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-stone-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              
              {/* Fragrance Collection Section */}
              <div className="bg-white rounded-3xl shadow-lg mb-12 border border-purple-100">
                <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-6 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sparkles className="h-8 w-8 text-amber-400 mr-4" />
                      <h2 className="text-3xl font-light">Your Fragrance Collection</h2>
                    </div>
                    <span className="bg-amber-400 text-purple-900 px-4 py-2 rounded-full font-medium text-sm">
                      {orderData.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Order Items */}
                  <div className="space-y-6 mb-8">
                    {orderData.items?.map((item) => {
                      const itemTotal = parseFloat(item.price) * item.quantity;
                      
                      return (
                        <div key={item.id} className="flex items-center space-x-6 p-6 bg-stone-50 rounded-xl border border-purple-100">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-purple-200">
                            <img 
                              className="h-full w-full object-cover" 
                              src={getImageUrl(item.cover_image || item.image || item.product?.cover_image || item.product?.image)}
                              alt={item.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f5f5f5/7c3aed?text=${encodeURIComponent(item.name)}`;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-xl font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</div>
                            <div className="text-sm text-gray-600">Unit Price: {formatCurrency(item.price, storeSettings, currencies)}</div>
                          </div>
                          <div className="text-2xl font-medium text-purple-800">
                            {formatCurrency(itemTotal, storeSettings, currencies)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Totals */}
                  <div className="bg-gradient-to-br from-purple-800 to-purple-900 text-white p-8 rounded-xl">
                    <div className="space-y-4">
                      {orderData.subtotal && (
                        <div className="flex justify-between text-purple-200 border-b border-purple-700 pb-2">
                          <span className="font-medium">Subtotal</span>
                          <span className="font-medium text-white">{formatCurrency(orderData.subtotal, storeSettings, currencies)}</span>
                        </div>
                      )}
                      {orderData.discount && orderData.discount > 0 && (
                        <div className="flex justify-between text-green-400 border-b border-purple-700 pb-2">
                          <span className="font-medium">Discount {orderData.coupon_code && `(${orderData.coupon_code})`}</span>
                          <span className="font-medium">-{formatCurrency(orderData.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      {orderData.shipping && orderData.shipping > 0 && (
                        <div className="flex justify-between text-purple-200 border-b border-purple-700 pb-2">
                          <span className="font-medium">Shipping</span>
                          <span className="font-medium text-white">{formatCurrency(orderData.shipping, storeSettings, currencies)}</span>
                        </div>
                      )}
                      {orderData.tax && orderData.tax > 0 && (
                        <div className="flex justify-between text-purple-200 border-b border-purple-700 pb-2">
                          <span className="font-medium">Tax</span>
                          <span className="font-medium text-white">{formatCurrency(orderData.tax, storeSettings, currencies)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-2xl font-medium text-white pt-4 border-t-2 border-amber-400">
                        <span>Total</span>
                        <span className="text-amber-400">{formatCurrency(orderData.total, storeSettings, currencies)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Payment Info */}
              <div className="bg-white rounded-3xl shadow-lg mb-12 border border-purple-100">
                <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-6 rounded-t-3xl">
                  <div className="flex items-center">
                    <Heart className="h-8 w-8 text-amber-400 mr-4" />
                    <h2 className="text-3xl font-light">Delivery & Payment Details</h2>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-stone-50 p-6 rounded-xl border border-purple-100">
                      <div className="flex items-start mb-4">
                        <MapPin className="h-8 w-8 text-purple-800 mr-4 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-purple-800 mb-3">Delivery Address</p>
                          <p className="text-gray-900 leading-relaxed">
                            {orderData.shipping_address.name}<br />
                            {orderData.shipping_address.street}<br />
                            {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}<br />
                            {orderData.shipping_address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-stone-50 p-6 rounded-xl border border-purple-100">
                      <div className="flex items-start mb-4">
                        <CreditCard className="h-8 w-8 text-purple-800 mr-4 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-purple-800 mb-3">Payment Method</p>
                          <p className="text-gray-900">{orderData.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="text-center space-x-4">
                <Link
                  href={route('store.my-orders', { storeSlug })}
                  className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
                >
                  View My Orders
                </Link>
                <Link 
                  href={route('store.products', { storeSlug })} 
                  className="border border-purple-800 text-purple-800 px-8 py-4 rounded-full font-medium hover:bg-purple-800 hover:text-white transition-colors inline-block"
                >
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