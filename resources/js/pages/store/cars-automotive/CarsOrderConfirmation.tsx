import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, Wrench, Settings, Zap, MessageCircle } from 'lucide-react';
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

interface CarsOrderConfirmationProps {
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

export default function CarsOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  whatsappRedirectUrl,
  customPages = [],
}: CarsOrderConfirmationProps) {
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
        theme="cars-automotive"
      >
        {/* Industrial Success Header */}
        <div className="bg-black text-white py-20 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <CheckCircle className="h-6 w-6 text-white transform -rotate-45" />
                </div>
                <div>
                  <h1 className="text-5xl font-black tracking-wider">ORDER CONFIRMED</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Professional Parts Installation Ready</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl">
              Your automotive parts order has been successfully processed and is ready for installation.
            </p>
            <div className="mt-6">
              <div className="inline-block bg-red-600 text-white px-8 py-4 font-black text-xl tracking-wider uppercase">
                ORDER #{orderData.id}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Auto Redirect */}
        {showWhatsAppPrompt && whatsappRedirectUrl && (
          <div className="bg-green-50 border-t-4 border-b-4 border-green-600 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 transform rotate-45 mb-8">
                  <MessageCircle className="w-10 h-10 text-white transform -rotate-45 animate-pulse" />
                </div>
                <h3 className="text-4xl font-black tracking-wider uppercase text-green-800 mb-6">
                  Opening WhatsApp...
                </h3>
                <p className="text-xl text-green-700 leading-relaxed mb-8">
                  Your automotive parts order confirmation will open in WhatsApp automatically.
                </p>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-green-600 text-white px-8 py-4 font-black tracking-wider uppercase hover:bg-green-700 transition-colors"
                  >
                    Open Now
                  </button>
                  <button
                    onClick={dismissWhatsAppPrompt}
                    className="border-2 border-gray-600 text-gray-700 px-8 py-4 font-black tracking-wider uppercase hover:border-green-600 hover:text-green-600 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Grid */}
        <div className="bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-black border-l-4 border-red-600 p-6 text-center">
                  <Calendar className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <p className="text-sm font-black tracking-wider uppercase text-red-400 mb-2">Order Date</p>
                  <p className="text-white font-bold">{formatDate(orderData.date)}</p>
                </div>
                
                <div className="bg-black border-l-4 border-red-600 p-6 text-center">
                  <Package className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <p className="text-sm font-black tracking-wider uppercase text-red-400 mb-2">Status</p>
                  <p className="text-white font-bold">{orderData.status}</p>
                </div>
                
                <div className="bg-black border-l-4 border-red-600 p-6 text-center">
                  <Truck className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <p className="text-sm font-black tracking-wider uppercase text-red-400 mb-2">Delivery</p>
                  <p className="text-white font-bold">{orderData.shipping_method}</p>
                </div>
                
                <div className="bg-black border-l-4 border-red-600 p-6 text-center">
                  <CreditCard className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <p className="text-sm font-black tracking-wider uppercase text-red-400 mb-2">Payment</p>
                  <p className="text-white font-bold">{orderData.payment_method}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              
              {/* Performance Parts Section */}
              <div className="bg-white border-l-8 border-red-600 shadow-lg mb-12">
                <div className="bg-black text-white px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wrench className="h-8 w-8 text-red-600 mr-4" />
                      <h2 className="text-3xl font-black tracking-wider uppercase">Performance Parts</h2>
                    </div>
                    <span className="bg-red-600 text-white px-4 py-2 font-black text-sm uppercase tracking-wider">
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
                        <div key={item.id} className="flex items-center space-x-6 p-6 bg-gray-50 border-2 border-gray-200">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden border-2 border-gray-300">
                            <img 
                              className="h-full w-full object-cover" 
                              src={item.image ? getImageUrl(item.image) : `https://placehold.co/400x400/f5f5f5/666666?text=${encodeURIComponent(item.name)}`}
                              alt={item.name}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-xl font-bold text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</div>
                            <div className="text-sm text-gray-600">Unit Price: {formatCurrency(item.price, storeSettings, currencies)}</div>
                          </div>
                          <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(itemTotal, storeSettings, currencies)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Totals */}
                  <div className="bg-black text-white p-8">
                    <div className="space-y-4">
                      {orderData.subtotal && (
                        <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                          <span className="font-bold tracking-wider uppercase">Subtotal</span>
                          <span className="font-black text-white">{formatCurrency(orderData.subtotal, storeSettings, currencies)}</span>
                        </div>
                      )}
                      {orderData.discount && orderData.discount > 0 && (
                        <div className="flex justify-between text-green-400 border-b border-gray-700 pb-2">
                          <span className="font-bold tracking-wider uppercase">Discount {orderData.coupon_code && `(${orderData.coupon_code})`}</span>
                          <span className="font-black">-{formatCurrency(orderData.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      {orderData.shipping && orderData.shipping > 0 && (
                        <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                          <span className="font-bold tracking-wider uppercase">Shipping</span>
                          <span className="font-black text-white">{formatCurrency(orderData.shipping, storeSettings, currencies)}</span>
                        </div>
                      )}
                      {orderData.tax && orderData.tax > 0 && (
                        <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                          <span className="font-bold tracking-wider uppercase">Tax</span>
                          <span className="font-black text-white">{formatCurrency(orderData.tax, storeSettings, currencies)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-2xl font-black text-white pt-4 border-t-2 border-red-600">
                        <span className="tracking-wider uppercase">Total</span>
                        <span className="text-red-400">{formatCurrency(orderData.total, storeSettings, currencies)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installation & Payment Info */}
              <div className="bg-white border-l-8 border-red-600 shadow-lg mb-12">
                <div className="bg-black text-white px-8 py-6">
                  <div className="flex items-center">
                    <Settings className="h-8 w-8 text-red-600 mr-4" />
                    <h2 className="text-3xl font-black tracking-wider uppercase">Installation & Payment</h2>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 border-2 border-gray-200">
                      <div className="flex items-start mb-4">
                        <MapPin className="h-8 w-8 text-red-600 mr-4 mt-1" />
                        <div>
                          <p className="text-sm font-black tracking-wider uppercase text-red-600 mb-3">Installation Address</p>
                          <p className="text-gray-900 leading-relaxed font-medium">
                            {orderData.shipping_address.name}<br />
                            {orderData.shipping_address.street}<br />
                            {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}<br />
                            {orderData.shipping_address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 border-2 border-gray-200">
                      <div className="flex items-start mb-4">
                        <CreditCard className="h-8 w-8 text-red-600 mr-4 mt-1" />
                        <div>
                          <p className="text-sm font-black tracking-wider uppercase text-red-600 mb-3">Payment Method</p>
                          <p className="text-gray-900 font-medium">{orderData.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              {/* Action Button */}
              <div className="text-center">
                <Link
                  href={route('store.products', { storeSlug })}
                  className="bg-red-600 hover:bg-black text-white px-12 py-4 font-bold tracking-wider uppercase transition-colors inline-flex items-center"
                >
                  <Wrench className="h-6 w-6 mr-3" />
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