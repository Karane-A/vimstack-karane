import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, CheckCircle, Package, Truck, Calendar, MapPin, CreditCard, MessageCircle } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { getThemeComponents } from '@/config/theme-registry';
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

interface OrderConfirmationProps {
  order?: Order;
  store: any;
  storeContent?: any;
  theme?: string;
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

export default function OrderConfirmation({
  order,
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  userName = '',
  customPages = [],
}: OrderConfirmationProps) {
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
  
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  const components = getThemeComponents(actualTheme);
  const { OrderConfirmationPage } = components;
  
  // If theme has a specific order confirmation page, use it
  if (OrderConfirmationPage && (actualTheme === 'fashion' || actualTheme === 'electronics' || actualTheme === 'beauty-cosmetics' || actualTheme === 'jewelry' || actualTheme === 'watches' || actualTheme === 'furniture-interior' || actualTheme === 'baby-kids' || actualTheme === 'perfume-fragrances')) {
    return (
      <OrderConfirmationPage
        order={orderData}
        store={store}
        storeContent={storeContent}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
      />
    );
  }
  
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
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
        theme={actualTheme}
      >
        {/* Hero Section */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmation</h1>
              <p className="text-white/80">
                Thank you for your purchase!
              </p>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', { storeSlug })} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">Order Confirmation</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Success Message */}
              <div className="bg-green-50 rounded-lg p-6 mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your order has been placed!</h2>
                <p className="text-gray-600 mb-4">
                  We've sent a confirmation email to {orderData.shipping_address?.name ? orderData.shipping_address.name.split(' ')[0] : 'you'} with the order details.
                </p>
                <div className="inline-flex items-center justify-center bg-white rounded-md px-4 py-2 border border-gray-300 shadow-sm">
                  <span className="text-sm font-medium text-gray-700 mr-2">Order Number:</span>
                  <span className="text-sm font-bold text-gray-900">{orderData.id}</span>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {orderData.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order Date</p>
                        <p className="text-sm text-gray-900">{formatDate(orderData.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Shipping Method</p>
                        <p className="text-sm text-gray-900">{orderData.shipping_method}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                        <p className="text-sm text-gray-900">
                          {orderData.shipping_address.name}<br />
                          {orderData.shipping_address.street}<br />
                          {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}<br />
                          {orderData.shipping_address.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Payment Method</p>
                        <p className="text-sm text-gray-900">{orderData.payment_method}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="mt-8">
                    <h3 className="text-base font-medium text-gray-900 mb-4">Order Items</h3>
                    
                    <div className="overflow-hidden border border-gray-200 rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    <div className="h-10 w-10 flex-shrink-0">
                                      <img 
                                        className="h-10 w-10 rounded-md object-cover" 
                                        src={item.image ? getImageUrl(item.image) : `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`}
                                        alt={item.name}
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                        }}
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                  {formatCurrency(item.price, storeSettings, currencies)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  {formatCurrency(itemTotal, storeSettings, currencies)}
                                </td>
                              </tr>
                            );
                          })}
                          {orderData.subtotal && orderData.discount && orderData.discount > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-600">
                                Subtotal
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-gray-600">
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
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-600">
                                Shipping
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-gray-600">
                                {formatCurrency(orderData.shipping, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          {orderData.tax && orderData.tax > 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-right text-sm text-gray-600">
                                Tax
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-gray-600">
                                {formatCurrency(orderData.tax, storeSettings, currencies)}
                              </td>
                            </tr>
                          )}
                          <tr className="bg-gray-50">
                            <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                              Total
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                              {formatCurrency(orderData.total, storeSettings, currencies)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Next Steps */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">What's Next?</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                          <Package className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Order Processing</h3>
                        <p className="mt-2 text-base text-gray-500">
                          We're currently processing your order. You'll receive an email when your order ships.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary">
                          <Truck className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Shipping</h3>
                        <p className="mt-2 text-base text-gray-500">
                          Your order will be shipped via {orderData.shipping_method}. You can track your order in your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href={route('store.my-orders', { storeSlug })}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  View My Orders
                </Link>
                <Link
                  href={route('store.products', { storeSlug })}
                  className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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