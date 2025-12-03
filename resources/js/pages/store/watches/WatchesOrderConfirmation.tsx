import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, Clock, Shield, MessageCircle } from 'lucide-react';
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

interface WatchesOrderConfirmationProps {
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

export default function WatchesOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  whatsappRedirectUrl,
  customPages = [],
}: WatchesOrderConfirmationProps) {
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
                    Order Confirmed
                  </span>
                </div>
                <h1 className="text-6xl font-light text-white mb-6 leading-none tracking-tight">
                  Thank You
                </h1>
                <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                  Your luxury timepiece order <span className="bg-amber-500 text-slate-900 px-3 py-1 rounded font-medium">#{orderData.id}</span> has been successfully placed
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
        </section>

        {/* WhatsApp Auto Redirect */}
        {showWhatsAppPrompt && whatsappRedirectUrl && (
          <div className="bg-green-50 border-t border-b border-green-200 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-lg shadow-lg mb-8">
                  <MessageCircle className="w-10 h-10 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-4xl font-light text-green-800 mb-6 tracking-tight">
                  Opening WhatsApp...
                </h3>
                <div className="w-16 h-px bg-green-500 mx-auto mb-6"></div>
                <p className="text-xl text-green-700 leading-relaxed mb-8">
                  Your luxury timepiece order confirmation will open in WhatsApp automatically.
                </p>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
                  >
                    Open Now
                  </button>
                  <button
                    onClick={dismissWhatsAppPrompt}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-green-600 hover:text-green-600 transition-colors"
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
              
              {/* Order Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-200">
                  <Calendar className="h-8 w-8 text-amber-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-slate-700 mb-2">Order Date</p>
                  <p className="text-slate-900">{formatDate(orderData.date)}</p>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-200">
                  <Package className="h-8 w-8 text-amber-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-slate-700 mb-2">Status</p>
                  <p className="text-slate-900">{orderData.status}</p>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-200">
                  <Truck className="h-8 w-8 text-amber-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-slate-700 mb-2">Shipping</p>
                  <p className="text-slate-900">{orderData.shipping_method}</p>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-200">
                  <CreditCard className="h-8 w-8 text-amber-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-slate-700 mb-2">Payment</p>
                  <p className="text-slate-900">{orderData.payment_method}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium text-slate-900 flex items-center">
                      <Clock className="w-5 h-5 text-amber-500 mr-2" />
                      Order Details
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                      {orderData.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Order Items */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-slate-900 mb-6">Your Timepieces</h3>
                    
                    <div className="overflow-hidden border border-slate-200 rounded-lg">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-700">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-slate-700">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-slate-700">
                              Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-slate-700">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {orderData.items?.map((item) => {
                            const itemTotal = parseFloat(item.price) * item.quantity;
                            
                            return (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-16 w-16 flex-shrink-0 rounded border border-slate-200">
                                      <img 
                                        className="h-16 w-16 object-cover rounded" 
                                        src={item.image ? getImageUrl(item.image) : `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`}
                                        alt={item.name}
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                        }}
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                                  {formatCurrency(item.price, storeSettings, currencies)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-900">
                                  {formatCurrency(itemTotal, storeSettings, currencies)}
                                </td>
                              </tr>
                            );
                          })}
                          {orderData.subtotal && orderData.discount > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-slate-600">
                                Subtotal
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-slate-600">
                                {formatCurrency(orderData.subtotal, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          {orderData.discount && orderData.discount > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-green-600">
                                Discount {orderData.coupon_code && `(${orderData.coupon_code})`}
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-green-600">
                                -{formatCurrency(orderData.discount, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          {orderData.shipping && orderData.shipping > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-slate-600">
                                Shipping
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-slate-600">
                                {formatCurrency(orderData.shipping, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          {orderData.tax && orderData.tax > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-slate-600">
                                Tax
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-slate-600">
                                {formatCurrency(orderData.tax, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          <tr className="bg-slate-50">
                            <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                              Total
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                              {formatCurrency(orderData.total, storeSettings, currencies)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Payment Info */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-medium text-slate-900">Delivery & Payment Information</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-amber-500 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-3">Delivery Address</p>
                          <p className="text-sm text-slate-900 leading-relaxed">
                            {orderData.shipping_address.name}<br />
                            {orderData.shipping_address.street}<br />
                            {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}<br />
                            {orderData.shipping_address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <div className="flex items-start">
                        <CreditCard className="h-5 w-5 text-amber-500 mr-3 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-3">Payment Method</p>
                          <p className="text-sm text-slate-900">{orderData.payment_method}</p>
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
                  className="bg-amber-500 text-slate-900 px-8 py-4 rounded-xl font-medium hover:bg-amber-600 transition-colors"
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