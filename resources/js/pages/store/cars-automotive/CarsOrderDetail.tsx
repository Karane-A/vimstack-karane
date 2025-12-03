import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Truck, Check, MapPin, CreditCard, ArrowLeft, Wrench, Settings, Zap } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  items: OrderItem[];
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
}

interface CarsOrderDetailProps {
  order: Order;
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function CarsOrderDetail({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: CarsOrderDetailProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Check className="h-6 w-6 text-green-400" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-blue-400" />;
      case 'processing':
        return <Package className="h-6 w-6 text-red-400" />;
      default:
        return <Package className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-900/20 text-green-400 border-green-600';
      case 'shipped':
        return 'bg-blue-900/20 text-blue-400 border-blue-600';
      case 'processing':
        return 'bg-red-900/20 text-red-400 border-red-600';
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-600';
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
        theme="cars-automotive"
      >
        {/* Industrial Header */}
        <div className="bg-black text-white py-20 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <Package className="h-6 w-6 text-white transform -rotate-45" />
                </div>
                <div>
                  <h1 className="text-5xl font-black tracking-wider">ORDER DETAILS</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Performance Parts Invoice</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl">
              Complete breakdown of your automotive parts order and installation details
            </p>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Back Button */}
              <div className="mb-8">
                <Link
                  href={route('store.my-orders', { storeSlug: store.slug })}
                  className="inline-flex items-center text-red-600 hover:text-black font-bold tracking-wider uppercase transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Order History
                </Link>
              </div>

              {/* Invoice Container */}
              <div className="bg-white border-l-8 border-red-600 shadow-2xl overflow-hidden">
                {/* Order Header */}
                <div className="bg-black text-white p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-4xl font-black tracking-wider uppercase mb-2">Performance Invoice</h1>
                      <p className="text-red-400 text-lg font-bold tracking-wider">{store.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-red-600 text-white px-8 py-4 font-black text-2xl tracking-wider uppercase">
                        #{order.id}
                      </div>
                      <div className="mt-4 flex items-center justify-end space-x-3">
                        {getStatusIcon(order.status)}
                        <span className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Installation Address */}
                    <div className="bg-gray-50 p-6 border-2 border-gray-200">
                      <h3 className="text-lg font-black tracking-wider uppercase text-red-600 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Installation Address
                      </h3>
                      <div className="text-gray-900 space-y-1 font-medium">
                        <p className="font-bold text-xl">{order.shipping_address.name}</p>
                        <p>{order.shipping_address.street}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                        <p>{order.shipping_address.zip}, {order.shipping_address.country}</p>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="bg-gray-50 p-6 border-2 border-gray-200">
                      <h3 className="text-lg font-black tracking-wider uppercase text-red-600 mb-4">Order Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-bold tracking-wider uppercase">Order Date:</span>
                          <span className="font-bold text-gray-900">{formatDate(order.date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-bold tracking-wider uppercase">Payment:</span>
                          <span className="font-bold text-gray-900">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-bold tracking-wider uppercase">Delivery:</span>
                          <span className="font-bold text-gray-900">{order.shipping_method}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-12">
                    <div className="bg-black text-white px-6 py-4 mb-6">
                      <div className="flex items-center">
                        <Wrench className="h-6 w-6 text-red-600 mr-3" />
                        <h3 className="text-2xl font-black tracking-wider uppercase">Performance Parts</h3>
                      </div>
                    </div>
                    <div className="overflow-hidden border-2 border-gray-200">
                      <table className="w-full">
                        <thead className="bg-black text-white">
                          <tr>
                            <th className="text-left p-4 font-black tracking-wider uppercase">Part</th>
                            <th className="text-center p-4 font-black tracking-wider uppercase">Qty</th>
                            <th className="text-right p-4 font-black tracking-wider uppercase">Unit Price</th>
                            <th className="text-right p-4 font-black tracking-wider uppercase">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {order.items.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="p-4">
                                <div className="flex items-center space-x-4">
                                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden border-2 border-gray-300">
                                    <img 
                                      className="h-full w-full object-cover" 
                                      src={item.image ? getImageUrl(item.image) : `https://placehold.co/400x400/f5f5f5/666666?text=${encodeURIComponent(item.name)}`}
                                      alt={item.name}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                                    <p className="text-sm text-gray-600 font-medium">Professional Grade Component</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-center font-bold text-gray-900 text-lg">{item.quantity}</td>
                              <td className="p-4 text-right font-bold text-gray-900 text-lg">{formatCurrency(item.price, storeSettings, currencies)}</td>
                              <td className="p-4 text-right font-bold text-red-600 text-lg">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Invoice Summary */}
                  <div className="flex justify-end">
                    <div className="w-full max-w-md">
                      <div className="bg-black text-white p-8">
                        <div className="flex items-center mb-6">
                          <Settings className="h-6 w-6 text-red-600 mr-3" />
                          <h4 className="text-2xl font-black tracking-wider uppercase">Order Summary</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-300 font-bold tracking-wider uppercase">Subtotal:</span>
                            <span className="font-black text-white">{formatCurrency(order.subtotal, storeSettings, currencies)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between py-2 border-b border-gray-700">
                              <span className="text-green-400 font-bold tracking-wider uppercase">Discount:</span>
                              <span className="font-black text-green-400">-{formatCurrency(order.discount, storeSettings, currencies)}</span>
                            </div>
                          )}
                          <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-300 font-bold tracking-wider uppercase">Shipping:</span>
                            <span className="font-black text-white">{formatCurrency(order.shipping, storeSettings, currencies)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-300 font-bold tracking-wider uppercase">Tax:</span>
                            <span className="font-black text-white">{formatCurrency(order.tax, storeSettings, currencies)}</span>
                          </div>
                          <div className="border-t-2 border-red-600 pt-4">
                            <div className="flex justify-between">
                              <span className="text-2xl font-black text-white tracking-wider uppercase">Total:</span>
                              <span className="text-2xl font-black text-red-400">{formatCurrency(order.total, storeSettings, currencies)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="mt-12 pt-8 border-t-2 border-gray-300 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-red-600 mr-3" />
                      <p className="text-gray-900 font-bold tracking-wider uppercase">Professional Grade Installation Complete</p>
                    </div>
                    <p className="text-sm text-gray-600">For technical support or installation questions, contact our automotive specialists.</p>
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