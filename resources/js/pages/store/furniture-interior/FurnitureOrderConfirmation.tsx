import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, Home, MessageCircle } from 'lucide-react';
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

interface FurnitureOrderConfirmationProps {
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

export default function FurnitureOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  whatsappRedirectUrl,
  customPages = [],
}: FurnitureOrderConfirmationProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || store.slug || 'demo';
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState(false);
  
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

  // Auto redirect to WhatsApp like WhatsStore
  useEffect(() => {
    if (whatsappRedirectUrl && orderData.payment_method === 'WhatsApp') {
      // Show prompt for 2 seconds then auto redirect
      setShowWhatsAppPrompt(true);
      
      const timer = setTimeout(() => {
        window.open(whatsappRedirectUrl, '_blank');
        // Clear session after opening WhatsApp
        fetch('/api/clear-whatsapp-session', { method: 'POST' });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [whatsappRedirectUrl, orderData]);
  
  // Handle WhatsApp redirect
  const handleWhatsAppClick = () => {
    if (whatsappRedirectUrl) {
      window.open(whatsappRedirectUrl, '_blank');
      setShowWhatsAppPrompt(false);
      // Clear session after opening WhatsApp
      fetch('/api/clear-whatsapp-session', { method: 'POST' });
    }
  };
  
  // Dismiss WhatsApp prompt
  const dismissWhatsAppPrompt = () => {
    setShowWhatsAppPrompt(false);
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
        theme="furniture-interior"
      >
        {/* Hero Section */}
        <div className="bg-yellow-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Order Confirmed!</h1>
              <p className="text-amber-200 text-xl mb-8">
                Thank you for choosing our furniture. Your order has been successfully placed.
              </p>
              <div className="inline-block bg-white text-yellow-800 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg">
                Order #{orderData.id}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Auto Redirect */}
        {showWhatsAppPrompt && whatsappRedirectUrl && (
          <div className="bg-green-50 border-t border-b border-green-200 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl shadow-lg mb-8">
                  <MessageCircle className="w-10 h-10 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-4xl font-bold text-green-800 mb-6">
                  Opening WhatsApp...
                </h3>
                <p className="text-xl text-green-700 leading-relaxed mb-8">
                  Your furniture order confirmation will open in WhatsApp automatically.
                </p>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg"
                  >
                    Open Now
                  </button>
                  <button
                    onClick={dismissWhatsAppPrompt}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:border-green-600 hover:text-green-600 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="text-center bg-amber-50 rounded-3xl p-8 border-2 border-amber-200">
                  <Calendar className="h-10 w-10 text-amber-800 mx-auto mb-4" />
                  <p className="text-sm font-bold text-amber-800 mb-2">Order Date</p>
                  <p className="text-slate-900 font-medium">{formatDate(orderData.date)}</p>
                </div>
                
                <div className="text-center bg-amber-50 rounded-3xl p-8 border-2 border-amber-200">
                  <Package className="h-10 w-10 text-amber-800 mx-auto mb-4" />
                  <p className="text-sm font-bold text-amber-800 mb-2">Status</p>
                  <p className="text-slate-900 font-medium">{orderData.status}</p>
                </div>
                
                <div className="text-center bg-amber-50 rounded-3xl p-8 border-2 border-amber-200">
                  <Truck className="h-10 w-10 text-amber-800 mx-auto mb-4" />
                  <p className="text-sm font-bold text-amber-800 mb-2">Delivery</p>
                  <p className="text-slate-900 font-medium">{orderData.shipping_method}</p>
                </div>
                
                <div className="text-center bg-amber-50 rounded-3xl p-8 border-2 border-amber-200">
                  <CreditCard className="h-10 w-10 text-amber-800 mx-auto mb-4" />
                  <p className="text-sm font-bold text-amber-800 mb-2">Payment</p>
                  <p className="text-slate-900 font-medium">{orderData.payment_method}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 mb-12">
                <div className="p-8 border-b border-amber-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-900">Order Details</h2>
                    <span className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl bg-green-100 text-green-800">
                      {orderData.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Order Items */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Your Furniture</h3>
                    
                    <div className="space-y-4">
                      {orderData.items?.map((item) => {
                        const itemTotal = parseFloat(item.price) * item.quantity;
                        
                        return (
                          <div key={item.id} className="flex items-center space-x-4 p-6 bg-amber-50 rounded-2xl border border-amber-200">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-amber-200">
                              <img 
                                className="h-full w-full object-cover" 
                                src={item.image ? getImageUrl(item.image) : `/storage/products/furniture-${item.id || 'default'}.jpg`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5dc/8b7355?text=${encodeURIComponent(item.name)}`;
                                }}
                                alt={item.name}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-bold text-slate-900">{item.name}</div>
                              <div className="text-sm text-slate-600">Quantity: {item.quantity}</div>
                              <div className="text-sm text-slate-600">Price: {formatCurrency(item.price, storeSettings, currencies)}</div>
                            </div>
                            <div className="text-xl font-bold text-amber-800">
                              {formatCurrency(itemTotal, storeSettings, currencies)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Totals */}
                    <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-200">
                      <div className="space-y-3">
                        {orderData.subtotal && (
                          <div className="flex justify-between text-slate-700">
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
                          <div className="flex justify-between text-slate-700">
                            <span>Delivery</span>
                            <span>{formatCurrency(orderData.shipping, storeSettings, currencies)}</span>
                          </div>
                        )}
                        {orderData.tax && orderData.tax > 0 && (
                          <div className="flex justify-between text-slate-700">
                            <span>Tax</span>
                            <span>{formatCurrency(orderData.tax, storeSettings, currencies)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xl font-bold text-amber-800 pt-3 border-t-2 border-amber-300">
                          <span>Total</span>
                          <span>{formatCurrency(orderData.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Payment Info */}
              <div className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 mb-12">
                <div className="p-8 border-b border-amber-200">
                  <h2 className="text-3xl font-bold text-slate-900">Delivery & Payment Information</h2>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                      <div className="flex items-start mb-4">
                        <MapPin className="h-6 w-6 text-amber-800 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-bold text-amber-800 mb-3">Delivery Address</p>
                          <p className="text-slate-900 leading-relaxed">
                            {orderData.shipping_address.name}<br />
                            {orderData.shipping_address.street}<br />
                            {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}<br />
                            {orderData.shipping_address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                      <div className="flex items-start mb-4">
                        <CreditCard className="h-6 w-6 text-amber-800 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-bold text-amber-800 mb-3">Payment Method</p>
                          <p className="text-slate-900">{orderData.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="flex justify-center">
                <Link
                  href={route('store.products', { storeSlug })}
                  className="bg-yellow-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
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