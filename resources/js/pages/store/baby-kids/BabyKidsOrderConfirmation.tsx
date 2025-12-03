import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Check, Package, Heart, Star, Gift, Smile, MessageCircle } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface BabyKidsOrderConfirmationProps {
  order: any;
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  whatsappRedirectUrl?: string;
  customPages?: any[];
}

export default function BabyKidsOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  userName = '',
  whatsappRedirectUrl,
  customPages = [],
}: BabyKidsOrderConfirmationProps) {
  const storeSlug = store.slug || 'demo';
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const [showWhatsappPrompt, setShowWhatsappPrompt] = useState(false);
  
  useEffect(() => {
    console.log('Order payment method:', order?.payment_method);
    console.log('WhatsApp redirect URL:', whatsappRedirectUrl);
    
    if (whatsappRedirectUrl && (order?.payment_method === 'whatsapp' || order?.payment_method === 'WhatsApp')) {
      setShowWhatsappPrompt(true);
      
      const timer = setTimeout(() => {
        window.open(whatsappRedirectUrl, '_blank');
        fetch('/api/clear-whatsapp-session', { method: 'POST' });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [whatsappRedirectUrl, order?.payment_method]);
  


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
        storeContent={storeContent}
        storeId={store.id}
        theme="baby-kids"
      >
        {/* Hero Section */}
        <div className="bg-pink-50 py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 mb-4">
                Thank you for your order! Your little ones will love their new items.
              </p>
              <p className="text-lg text-gray-500">
                Order #{order.order_number || order.id}
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Auto Redirect */}
        {whatsappRedirectUrl && (order?.payment_method === 'whatsapp' || order?.payment_method === 'WhatsApp') && (
          <div className="bg-pink-50 py-16 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Opening WhatsApp...</h3>
                <div className="w-16 h-1 bg-pink-400 mx-auto rounded-full mb-4"></div>
                <p className="text-lg text-gray-600 mb-3">
                  Your order confirmation will open in WhatsApp automatically for your little ones!
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  You'll receive all order details and can chat with us directly.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      window.open(whatsappRedirectUrl, '_blank');
                      fetch('/api/clear-whatsapp-session', { method: 'POST' });
                    }}
                    className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors"
                  >
                    Open WhatsApp Now
                  </button>
                  <button
                    onClick={() => setShowWhatsappPrompt(false)}
                    className="border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-full font-bold hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Order Information */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute top-4 left-4 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                  <div className="relative bg-white rounded-3xl shadow-xl border-4 border-pink-400 p-8">
                    <div className="flex items-center mb-6">
                      <Package className="h-6 w-6 text-pink-500 mr-3" />
                      <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                    </div>
                    
                    {/* Order Items */}
                    <div className="space-y-4 mb-8">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-pink-50 rounded-2xl">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 border-pink-200">
                            <img
                              src={getImageUrl(item.cover_image || item.image || item.product?.cover_image || item.product?.image)}
                              alt={item.product?.name || item.name || 'Product'}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/80x80/fef7f7/ec4899?text=${encodeURIComponent(item.product?.name || item.name || 'Product')}`;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{item.product?.name || item.name}</h3>
                            <p className="text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-lg font-bold text-pink-500">
                            {formatCurrency(parseFloat(item.price || 0) * parseInt(item.quantity || 0), storeSettings, currencies)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery Information</h3>
                      
                      <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-bold text-pink-600 mb-2">Contact Details</p>
                            <p className="text-gray-800">{order.customer_first_name || ''} {order.customer_last_name || ''}</p>
                            <p className="text-gray-800">{order.customer_email || ''}</p>
                            <p className="text-gray-800">{order.customer_phone || ''}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-pink-600 mb-2">Delivery Address</p>
                            <p className="text-gray-800">{typeof order.shipping_address === 'object' ? order.shipping_address?.street || '' : order.shipping_address || ''}</p>
                            <p className="text-gray-800">{typeof order.shipping_address === 'object' ? `${order.shipping_address?.city || ''}, ${order.shipping_address?.state || ''} ${order.shipping_address?.zip || ''}` : `${order.shipping_city || ''}, ${order.shipping_state || ''} ${order.shipping_postal_code || ''}`}</p>
                            <p className="text-gray-800">{typeof order.shipping_address === 'object' ? order.shipping_address?.country || '' : order.shipping_country || ''}</p>
                          </div>
                        </div>
                        <div className="mt-6 pt-6 border-t-2 border-pink-300">
                          <p className="text-sm font-bold text-pink-600 mb-2">Delivery Method</p>
                          <p className="text-gray-800">{order.shipping_method || 'Standard Delivery'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Information</h3>
                      
                      <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-bold text-pink-600 mb-2">Payment Method</p>
                            <p className="text-gray-800 capitalize">{order.payment_method || ''}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-pink-600 mb-2">Billing Address</p>
                            <p className="text-gray-800">{typeof order.billing_address === 'object' ? order.billing_address?.street || '' : order.billing_address || ''}</p>
                            <p className="text-gray-800">{typeof order.billing_address === 'object' ? `${order.billing_address?.city || ''}, ${order.billing_address?.state || ''} ${order.billing_address?.zip || ''}` : `${order.billing_city || ''}, ${order.billing_state || ''} ${order.billing_postal_code || ''}`}</p>
                            <p className="text-gray-800">{typeof order.billing_address === 'object' ? order.billing_address?.country || '' : order.billing_country || ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t-2 border-pink-200 pt-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>{formatCurrency(parseFloat(order.subtotal || 0), storeSettings, currencies)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(parseFloat(order.discount || 0), storeSettings, currencies)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>{formatCurrency(parseFloat(order.shipping || 0), storeSettings, currencies)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span>
                          <span>{formatCurrency(parseFloat(order.tax || 0), storeSettings, currencies)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t-2 border-pink-400">
                          <span>Total</span>
                          <span className="text-pink-500">{formatCurrency(parseFloat(order.total || 0), storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="relative">
                <div className="relative bg-white rounded-3xl shadow-xl border-4 border-blue-400 p-8 sticky top-8">
                  <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-blue-200 rounded-3xl opacity-30 -z-10"></div>
                  <div className="flex items-center mb-6">
                    <Heart className="h-6 w-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
                  </div>
                  
                  {/* Status */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-bold text-gray-800 capitalize">{order.status}</p>
                    <p className="text-sm text-gray-600">We're preparing your order with love!</p>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600 border-b border-blue-200 pb-2">
                      <p className="font-bold">Order Date</p>
                      <p className="font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between text-gray-600 border-b border-blue-200 pb-2">
                      <p className="font-bold">Payment</p>
                      <p className="font-bold capitalize">{order.payment_method}</p>
                    </div>
                    {order.shipping_method && (
                      <div className="flex justify-between text-gray-600 border-b border-blue-200 pb-2">
                        <p className="font-bold">Shipping</p>
                        <p className="font-bold">{order.shipping_method}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mb-6">
                    <Link
                      href={route('store.products', store.slug)}
                      className="w-full bg-pink-500 text-white py-3 rounded-2xl font-bold text-center hover:bg-pink-600 transition-colors block"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Secure Checkout */}
                  <div className="flex items-center justify-center mb-4">
                    <Gift className="h-4 w-4 text-blue-500 mr-2" />
                    <p className="text-xs text-gray-600 font-bold">Order Confirmed & Secure</p>
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