import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { CheckCircle, Package, Truck, Gem, Star, ArrowRight, Download, Mail, Clock, Shield, Heart, Phone, MessageCircle } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  cover_image: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  items: OrderItem[];
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  created_at: string;
}

interface JewelryOrderConfirmationProps {
  order: Order;
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

function JewelryOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  whatsappRedirectUrl,
  customPages = [],
}: JewelryOrderConfirmationProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState(false);
  
  const storeSlug = store.slug || 'demo';

  // Auto redirect to WhatsApp like WhatsStore
  useEffect(() => {
    if (whatsappRedirectUrl && order?.payment_method === 'WhatsApp') {
      // Show prompt for 2 seconds then auto redirect
      setShowWhatsAppPrompt(true);
      
      const timer = setTimeout(() => {
        window.open(whatsappRedirectUrl, '_blank');
        // Clear session after opening WhatsApp
        fetch('/api/clear-whatsapp-session', { method: 'POST' });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [whatsappRedirectUrl, order]);
  
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
        storeId={store.id}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
        storeContent={storeContent}
        theme={store.theme}
      >
        {/* Luxury Header */}
        <div className="bg-yellow-50 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full shadow-lg mb-8">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">
                Order Confirmed
              </h1>
              <div className="w-24 h-px bg-yellow-500 mx-auto mb-6"></div>
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                Thank you for choosing our luxury jewelry collection
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 border border-yellow-200 shadow-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Number</p>
                  <p className="text-xl font-semibold text-yellow-600 tracking-wider">{order.order_number || order.id || 'N/A'}</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 border border-yellow-200 shadow-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Date</p>
                  <p className="text-xl font-semibold text-gray-700">{new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Auto Redirect */}
        {showWhatsAppPrompt && whatsappRedirectUrl && (
          <div className="bg-green-50 border-t border-b border-green-200 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full shadow-lg mb-8">
                  <MessageCircle className="w-10 h-10 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-4xl font-light text-green-800 mb-6 tracking-wide">
                  Opening WhatsApp...
                </h3>
                <div className="w-24 h-px bg-green-500 mx-auto mb-6"></div>
                <p className="text-xl text-green-700 leading-relaxed mb-8">
                  Your luxury jewelry order confirmation will open in WhatsApp automatically.
                </p>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Open Now
                  </button>
                  <button
                    onClick={dismissWhatsAppPrompt}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-green-600 hover:text-green-600 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-50 to-yellow-50/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Order Details */}
              <div className="lg:col-span-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-yellow-200/50 overflow-hidden">
                  <div className="p-8">
                    
                    {/* Order Progress */}
                    <div className="mb-8">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-green-800">Order Status: Confirmed</h3>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Processing</span>
                        </div>
                        
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-green-700">Confirmed</span>
                          </div>
                          <div className="flex-1 h-1 bg-yellow-200 mx-4 rounded"></div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <span className="ml-2 text-sm font-medium text-yellow-700">Processing</span>
                          </div>
                          <div className="flex-1 h-1 bg-gray-200 mx-4 rounded"></div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <Truck className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="ml-2 text-sm text-gray-500">Shipped</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/70 rounded-lg p-4">
                          <div className="flex items-start">
                            <Clock className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">What happens next?</p>
                              <p className="text-sm text-gray-600 mt-1">Our artisans are carefully preparing your jewelry. You'll receive email updates at each step, including tracking information once shipped.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif text-gray-800 tracking-wide">Your Exquisite Selection</h2>
                        <div className="flex items-center space-x-2">
                          <Gem className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-gray-600 font-medium">{order.items?.length || 0} precious item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {(order.items || []).map((item, index) => (
                          <div key={item.id} className="group relative">
                            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-yellow-50/70 to-amber-50/70 rounded-2xl border border-yellow-200/60 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
                              <div className="relative">
                                <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-yellow-300/50 shadow-md group-hover:shadow-lg transition-shadow">
                                  <img 
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                    src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/600x600/f5f5dc/d4af37?text=${encodeURIComponent(item.name)}`}
                                    alt={item.name}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5dc/d4af37?text=${encodeURIComponent(item.name)}`;
                                    }}
                                  />
                                </div>

                              </div>
                              
                              <div className="flex-1">
                                <div className="text-xl font-serif text-gray-800 mb-2 group-hover:text-yellow-700 transition-colors">{item.name}</div>
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center bg-white/80 px-3 py-1.5 rounded-full border border-yellow-200">
                                    <Package className="w-3 h-3 mr-1.5 text-yellow-600" />
                                    <span className="text-yellow-700 font-medium">Qty: {item.quantity}</span>
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-medium">{formatCurrency(item.price || 0, storeSettings, currencies)}</span> each
                                  </div>
                                </div>

                              </div>
                              
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800 mb-1">
                                  {formatCurrency((parseFloat(item.price || 0) * item.quantity), storeSettings, currencies)}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">Item Total</div>
                                <div className="mt-2 text-xs text-green-600 font-medium">
                                  ✓ In Stock
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      

                    </div>

                    {/* Delivery Information */}
                    <div className="pt-8 border-t border-yellow-200">
                      <h3 className="text-2xl font-serif text-gray-800 mb-6 tracking-wide">Delivery & Care Information</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Shipping Address */}
                        <div className="bg-gradient-to-br from-yellow-50/70 to-amber-50/70 rounded-2xl p-6 border border-yellow-200/60 hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-semibold text-gray-800 text-lg">Delivery Address</h4>
                          </div>
                          <div className="bg-white/80 rounded-lg p-4">
                            <p className="font-semibold text-gray-800 text-lg">{order.shipping_address?.name || 'N/A'}</p>
                            <p className="text-gray-600 mt-2 leading-relaxed">
                              {order.shipping_address?.street || 'N/A'}<br/>
                              {order.shipping_address?.city || 'N/A'}, {order.shipping_address?.state || 'N/A'} {order.shipping_address?.zip || 'N/A'}<br/>
                              {order.shipping_address?.country || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Estimated Delivery */}
                        <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/70 rounded-2xl p-6 border border-blue-200/60 hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                              <Truck className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-semibold text-gray-800 text-lg">Shipping Details</h4>
                          </div>
                          <div className="bg-white/80 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <Clock className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="font-semibold text-gray-800">3-5 Business Days</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">Express insured shipping with signature confirmation</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center text-green-600">
                                <Shield className="w-4 h-4 mr-2" />
                                <span>Fully insured delivery</span>
                              </div>
                              <div className="flex items-center text-blue-600">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>Real-time tracking updates</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary & Actions */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  
                  {/* Order Summary Card */}
                  <div className="bg-yellow-600 text-white rounded-2xl shadow-2xl overflow-hidden sticky top-6">
                    <div className="p-6">
                      
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3">
                          <Star className="w-7 h-7 text-yellow-200" />
                        </div>
                        <h2 className="text-xl font-serif tracking-wide">Order Summary</h2>
                        <p className="text-yellow-200 text-sm mt-1">#{order.order_number || order.id || 'N/A'}</p>
                      </div>

                      {/* Price Breakdown */}
                      <div className="bg-white/10 rounded-xl p-4 mb-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-yellow-100">
                            <span>Subtotal ({order.items?.length || 0} items)</span>
                            <span className="font-semibold">{formatCurrency(order.subtotal || 0, storeSettings, currencies)}</span>
                          </div>
                          
                          {parseFloat(order.discount || 0) > 0 && (
                            <div className="flex justify-between text-sm text-green-200">
                              <span>Special Discount</span>
                              <span className="font-semibold">-{formatCurrency(order.discount || 0, storeSettings, currencies)}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-sm text-yellow-100">
                            <span>Shipping</span>
                            <span className="font-semibold">{formatCurrency(order.shipping || 0, storeSettings, currencies)}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm text-yellow-100">
                            <span>Tax</span>
                            <span className="font-semibold">{formatCurrency(order.tax || 0, storeSettings, currencies)}</span>
                          </div>
                          
                          <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-yellow-400">
                            <span>Total Paid</span>
                            <span>{formatCurrency(order.total || 0, storeSettings, currencies)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Link
                          href={route('store.products', { storeSlug })}
                          className="w-full bg-white text-yellow-600 px-6 py-4 rounded-xl font-semibold hover:bg-yellow-50 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <Gem className="w-5 h-5 mr-2" />
                          Explore More Jewelry
                        </Link>
                        
                        {isLoggedIn && (
                          <Link
                            href={route('store.my-orders', { storeSlug })}
                            className="w-full bg-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                          >
                            <Package className="w-5 h-5 mr-2" />
                            Track This Order
                          </Link>
                        )}
                      </div>
                    </div>
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

export default JewelryOrderConfirmation;