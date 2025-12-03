import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Truck, Check, MapPin, CreditCard, Clock, Shield, ArrowLeft, Calendar } from 'lucide-react';
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

interface WatchesOrderDetailProps {
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

export default function WatchesOrderDetail({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WatchesOrderDetailProps) {
  const { props } = usePage();
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Shield className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'processing':
        return <Clock className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
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
        theme="watches"
      >
        {/* Navigation */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <Link
              href={route('store.my-orders', { storeSlug: store.slug })}
              className="inline-flex items-center text-slate-600 hover:text-amber-600 transition-colors font-light"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>

        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Order Header */}
              <div className="bg-slate-900 text-white p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-light mb-2">Order #{order.id}</h1>
                    <p className="text-slate-300 font-light">Placed on {formatDate(order.date)}</p>
                  </div>
                  <div className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium tracking-wider uppercase ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{order.status}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-slate-200 mb-8">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-light text-slate-900">Order Items</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-16 w-16 flex-shrink-0">
                                <img 
                                  className="h-16 w-16 object-cover border border-slate-200" 
                                  src={item.image ? getImageUrl(item.image) : `https://placehold.co/64x64?text=${encodeURIComponent(item.name)}`}
                                  alt={item.name}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://placehold.co/64x64?text=${encodeURIComponent(item.name)}`;
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{formatCurrency(item.price, storeSettings, currencies)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{item.quantity}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shipping Address */}
                <div className="bg-white border border-slate-200">
                  <div className="p-6">
                    <h3 className="text-lg font-light text-slate-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                      Shipping Address
                    </h3>
                    <div className="bg-slate-50 p-4">
                      <p className="font-medium text-slate-900">{order.shipping_address?.name}</p>
                      <p className="text-slate-600">{order.shipping_address?.street}</p>
                      <p className="text-slate-600">{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}</p>
                      <p className="text-slate-600">{order.shipping_address?.country}</p>
                    </div>
                  </div>
                </div>

                {/* Payment & Shipping Info */}
                <div className="bg-white border border-slate-200">
                  <div className="p-6">
                    <h3 className="text-lg font-light text-slate-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-amber-500" />
                      Payment & Shipping
                    </h3>
                    <div className="bg-slate-50 p-4 space-y-3">
                      <div>
                        <span className="text-sm text-slate-500">Payment Method:</span>
                        <p className="font-medium text-slate-900">{order.payment_method}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500">Shipping Method:</span>
                        <p className="font-medium text-slate-900">{order.shipping_method}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-slate-200 mt-8">
                <div className="p-6">
                  <h3 className="text-lg font-light text-slate-900 mb-4">Order Summary</h3>
                  <div className="bg-slate-50 p-4">
                    <div className="flex justify-between py-2 text-slate-600">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotal, storeSettings, currencies)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between py-2 text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(order.discount, storeSettings, currencies)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 text-slate-600">
                      <span>Shipping:</span>
                      <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping, storeSettings, currencies)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-slate-600">
                      <span>Tax:</span>
                      <span>{formatCurrency(order.tax, storeSettings, currencies)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t border-slate-300 font-medium text-lg text-slate-900">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total, storeSettings, currencies)}</span>
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