import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, Mail, MessageCircle } from 'lucide-react';
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

interface FashionOrderConfirmationProps {
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

export default function FashionOrderConfirmation({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  whatsappRedirectUrl,
  customPages = [],
}: FashionOrderConfirmationProps) {
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
        theme="fashion"
      >
        {/* Hero Section */}
        <div className="bg-black text-white py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-8">
                <CheckCircle className="h-10 w-10 text-black" />
              </div>
              <h1 className="text-5xl font-thin tracking-wide mb-6">Order Confirmed</h1>
              <p className="text-white/70 font-light text-lg mb-8">
                Thank you for choosing us. Your order has been successfully placed.
              </p>
              <div className="inline-block bg-white text-black px-8 py-3 font-light tracking-widest uppercase text-sm">
                Order #{orderData.id}
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Auto Redirect */}
        {showWhatsAppPrompt && whatsappRedirectUrl && (
          <div className="bg-green-50 border-t border-b border-green-200 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-8">
                  <MessageCircle className="h-10 w-10 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-3xl font-thin tracking-wide text-green-800 mb-6">
                  Opening WhatsApp...
                </h3>
                <p className="text-green-700 font-light text-lg mb-8">
                  Your order confirmation will open in WhatsApp automatically.
                </p>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-green-600 text-white px-8 py-3 font-light tracking-widest uppercase text-sm hover:bg-green-700 transition-colors"
                  >
                    Open Now
                  </button>
                  <button
                    onClick={dismissWhatsAppPrompt}
                    className="border border-gray-300 text-black px-8 py-3 font-light tracking-widest uppercase text-sm hover:border-green-600 hover:text-green-600 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-xs font-light tracking-widest uppercase text-gray-500 mb-2">Order Date</p>
                  <p className="font-light">{formatDate(orderData.date)}</p>
                </div>
                
                <div className="text-center">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-xs font-light tracking-widest uppercase text-gray-500 mb-2">Status</p>
                  <p className="font-light">{orderData.status}</p>
                </div>
                
                <div className="text-center">
                  <Truck className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-xs font-light tracking-widest uppercase text-gray-500 mb-2">Shipping</p>
                  <p className="font-light">{orderData.shipping_method}</p>
                </div>
                
                <div className="text-center">
                  <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-xs font-light tracking-widest uppercase text-gray-500 mb-2">Payment</p>
                  <p className="font-light">{orderData.payment_method}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white border border-gray-200 mb-16">
                <div className="p-8 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-thin tracking-wide">Order Details</h2>
                    <span className="inline-flex items-center px-3 py-1 text-xs font-light tracking-wide uppercase bg-yellow-100 text-yellow-800">
                      {orderData.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Order Items Table */}
                  <div className="mb-8">
                    <h3 className="text-lg font-light tracking-wide mb-6">Order Items</h3>
                    
                    <div className="overflow-hidden border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-light tracking-widest uppercase text-gray-500">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-light tracking-widest uppercase text-gray-500">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-light tracking-widest uppercase text-gray-500">
                              Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-light tracking-widest uppercase text-gray-500">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orderData.items?.map((item) => {
                            const itemTotal = parseFloat(item.price) * item.quantity;
                            
                            return (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-12 w-12 flex-shrink-0">
                                      <img 
                                        className="h-12 w-12 object-cover" 
                                        src={item.image ? getImageUrl(item.image) : `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`}
                                        alt={item.name}
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                        }}
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-light text-black">{item.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 font-light">
                                  {formatCurrency(item.price, storeSettings, currencies)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 font-light">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                                  {formatCurrency(itemTotal, storeSettings, currencies)}
                                </td>
                              </tr>
                            );
                          })}
                          {orderData.subtotal && orderData.discount > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-600 font-light">
                                Subtotal
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-gray-600 font-light">
                                {formatCurrency(orderData.subtotal, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          {orderData.discount && orderData.discount > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-green-600 font-light">
                                Discount {orderData.coupon_code && `(${orderData.coupon_code})`}
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-green-600 font-light">
                                -{formatCurrency(orderData.discount, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          {orderData.shipping && orderData.shipping > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-600 font-light">
                                Shipping
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-gray-600 font-light">
                                {formatCurrency(orderData.shipping, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          {orderData.tax && orderData.tax > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-600 font-light">
                                Tax
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-gray-600 font-light">
                                {formatCurrency(orderData.tax, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          <tr className="bg-gray-50">
                            <td colSpan={3} className="px-6 py-4 text-right text-sm font-light text-black">
                              Total
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-light text-black">
                              {formatCurrency(orderData.total, storeSettings, currencies)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses & Info */}
              <div className="bg-white border border-gray-200 mb-16">
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-thin tracking-wide">Shipping & Payment Information</h2>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-start mb-4">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-light tracking-wide uppercase text-gray-500 mb-2">Shipping Address</p>
                          <p className="text-sm text-black font-light leading-relaxed">
                            {orderData.shipping_address.name}<br />
                            {orderData.shipping_address.street}<br />
                            {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}<br />
                            {orderData.shipping_address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-start mb-4">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-light tracking-wide uppercase text-gray-500 mb-2">Payment Method</p>
                          <p className="text-sm text-black font-light">{orderData.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white border border-gray-200 mb-16">
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-thin tracking-wide">What's Next?</h2>
                </div>
                
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 bg-black text-white">
                          <Package className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-light text-black">Order Processing</h3>
                        <p className="mt-2 text-base text-gray-500 font-light">
                          We're currently processing your order. You'll receive an email when your order ships.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 bg-black text-white">
                          <Truck className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-light text-black">Shipping</h3>
                        <p className="mt-2 text-base text-gray-500 font-light">
                          Your order will be shipped via {orderData.shipping_method}. You can track your order in your account.
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
                  className="bg-black text-white px-8 py-3 font-light tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors text-center"
                >
                  Track Your Order
                </Link>
                <Link
                  href={route('store.products', { storeSlug })}
                  className="border border-gray-300 text-black px-8 py-3 font-light tracking-widest uppercase text-sm hover:border-black transition-colors text-center"
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