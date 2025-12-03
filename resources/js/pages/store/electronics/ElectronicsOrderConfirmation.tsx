import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, ChevronRight, MessageCircle } from 'lucide-react';
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

interface ElectronicsOrderConfirmationProps {
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

export default function ElectronicsOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  whatsappRedirectUrl,
  customPages = [],
}: ElectronicsOrderConfirmationProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || store.slug || 'demo';
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState(false);
  
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
        theme="electronics"
      >
        <div className="bg-gray-50 min-h-screen">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
              <nav className="text-sm">
                <Link href={route('store.home', { storeSlug })} className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400 inline" />
                <span className="text-gray-900 font-semibold">Order Confirmation</span>
              </nav>
            </div>
          </div>

          {/* Success Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                  <p className="text-xl text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been successfully placed.
                  </p>
                  <div className="inline-flex items-center bg-blue-50 rounded-lg px-6 py-3">
                    <span className="text-blue-600 font-semibold mr-2">Order ID:</span>
                    <span className="text-blue-900 font-bold text-lg">{orderData.id}</span>
                  </div>
                </div>

                {/* WhatsApp Auto Redirect */}
                {showWhatsAppPrompt && whatsappRedirectUrl && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl shadow-lg p-8 mb-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-green-600 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Opening WhatsApp...
                    </h3>
                    <p className="text-green-700 mb-6">
                      Your order confirmation will open in WhatsApp automatically.
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleWhatsAppClick}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Open Now
                      </button>
                      <button
                        onClick={dismissWhatsAppPrompt}
                        className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-green-600 hover:text-green-600 transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-gray-500 mb-2">Order Date</p>
                    <p className="text-gray-900 font-bold">{formatDate(orderData.date)}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <Package className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-gray-500 mb-2">Status</p>
                    <p className="text-gray-900 font-bold">{orderData.status}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <Truck className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-gray-500 mb-2">Shipping</p>
                    <p className="text-gray-900 font-bold">{orderData.shipping_method}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-gray-500 mb-2">Payment</p>
                    <p className="text-gray-900 font-bold">{orderData.payment_method}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Order Details */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Order Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-slate-900 text-white p-6">
                      <h2 className="text-2xl font-bold">Order Items</h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        {orderData.items?.map((item) => {
                          const itemTotal = parseFloat(item.price) * item.quantity;
                          
                          return (
                            <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                <img 
                                  className="w-full h-full object-cover" 
                                  src={item.image ? getImageUrl(item.image) : `https://placehold.co/600x600/1e293b/60a5fa?text=${encodeURIComponent(item.name)}`}
                                  alt={item.name}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://placehold.co/600x600/1e293b/60a5fa?text=${encodeURIComponent(item.name)}`;
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-blue-600">{formatCurrency(itemTotal, storeSettings, currencies)}</p>
                                <p className="text-sm text-gray-500">{formatCurrency(item.price, storeSettings, currencies)} each</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary & Info */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-blue-600 text-white p-6">
                      <h3 className="text-xl font-bold">Order Summary</h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {orderData.subtotal && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">{formatCurrency(orderData.subtotal, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      {orderData.discount && orderData.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount {orderData.coupon_code && `(${orderData.coupon_code})`}</span>
                          <span className="font-semibold">-{formatCurrency(orderData.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      {orderData.shipping && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">{formatCurrency(orderData.shipping, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      {orderData.tax && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-semibold">{formatCurrency(orderData.tax, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <span className="text-lg font-bold text-blue-600">{formatCurrency(orderData.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-slate-900 text-white p-6">
                      <h3 className="text-xl font-bold flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Shipping Address
                      </h3>
                    </div>
                    
                    <div className="p-6">
                      <div className="text-gray-900">
                        <p className="font-semibold">{orderData.shipping_address.name}</p>
                        <p>{orderData.shipping_address.street}</p>
                        <p>{orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}</p>
                        <p>{orderData.shipping_address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-slate-900 text-white p-6">
                    <h2 className="text-2xl font-bold">What Happens Next?</h2>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Package className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Processing</h3>
                        <p className="text-gray-600">We're preparing your order for shipment</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Truck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Shipping</h3>
                        <p className="text-gray-600">Your order will be shipped with tracking</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delivery</h3>
                        <p className="text-gray-600">Enjoy your new electronics!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="py-8">
            <div className="container mx-auto px-4 text-center">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href={route('store.my-orders', { storeSlug })}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Track Your Order
                </Link>
                <Link
                  href={route('store.products', { storeSlug })}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </section>
        </div>
      </StoreLayout>
    </>
  );
}