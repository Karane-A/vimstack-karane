import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Calendar, MapPin, CreditCard, Truck, ArrowLeft, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/currency-formatter';
import { getImageUrl } from '@/utils/image-helper';

interface BabyKidsOrderDetailProps {
  order: {
    id: string;
    date: string;
    status: string;
    total: number;
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    items: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
      image?: string;
      cover_image?: string;
    }>;
    shipping_address: {
      name: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    payment_method: string;
    shipping_method: string;
  };
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: any[];
  storeSettings?: any;
  currencies?: any[];
}

export default function BabyKidsOrderDetail({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = true,
  customPages = [],
  storeSettings = {},
  currencies = [],
}: BabyKidsOrderDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <>
      <Head title={`Order #${order.id} - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme="baby-kids"
      >
        {/* Hero Section */}
        <div className="bg-pink-50 py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <Link
                href={route('store.my-orders', store.slug)}
                className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 mb-6 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Orders</span>
              </Link>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">Order Details</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Invoice Header */}
                <div className="bg-pink-500 text-white p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">ORDER INVOICE</h1>
                      <p className="text-pink-100">Order #{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-pink-100">Date</p>
                      <p className="font-semibold">{new Date(order.date).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {order.status.toLowerCase() === 'delivered' ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : (
                        <Package className="h-6 w-6 text-blue-500" />
                      )}
                      <span className="text-lg font-semibold">Status:</span>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Order Items</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-2 font-semibold text-gray-700">Product</th>
                          <th className="text-center py-3 px-2 font-semibold text-gray-700">Qty</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">Price</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-4 px-2">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={getImageUrl(item.cover_image || item.image || item.product?.cover_image || item.product?.image)}
                                  alt={item.name || item.product?.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://placehold.co/80x80/fef7f7/ec4899?text=${encodeURIComponent(item.name || item.product?.name || 'Product')}`;
                                  }}
                                />
                                <span className="font-medium text-gray-800">{item.name || item.product?.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-2 text-center">{item.quantity}</td>
                            <td className="py-4 px-2 text-right">{formatCurrency(item.price, storeSettings, currencies)}</td>
                            <td className="py-4 px-2 text-right font-semibold">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-pink-500" />
                      Shipping Address
                    </h3>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="font-semibold text-gray-800">{order.shipping_address.name}</p>
                      <p className="text-gray-600">{order.shipping_address.street}</p>
                      <p className="text-gray-600">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                      <p className="text-gray-600">{order.shipping_address.country}</p>
                    </div>
                  </div>

                  {/* Payment & Shipping Info */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Payment & Shipping</h3>
                    <div className="bg-white p-4 rounded-lg space-y-3">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-pink-500" />
                        <span className="text-sm text-gray-600">Payment:</span>
                        <span className="font-medium">{order.payment_method}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-pink-500" />
                        <span className="text-sm text-gray-600">Shipping:</span>
                        <span className="font-medium">{order.shipping_method}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Total */}
                <div className="p-6 border-t">
                  <div className="max-w-sm ml-auto">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{formatCurrency(order.subtotal, storeSettings, currencies)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(order.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>{formatCurrency(order.shipping, storeSettings, currencies)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span>{formatCurrency(order.tax, storeSettings, currencies)}</span>
                      </div>
                      <div className="border-t-2 pt-2">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total:</span>
                          <span>{formatCurrency(order.total, storeSettings, currencies)}</span>
                        </div>
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