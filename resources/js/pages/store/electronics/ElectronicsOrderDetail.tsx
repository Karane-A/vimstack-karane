import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Calendar, CreditCard, MapPin, ChevronRight } from 'lucide-react';
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

interface ElectronicsOrderDetailProps {
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

export default function ElectronicsOrderDetail({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: ElectronicsOrderDetailProps) {
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
        storeId={store.id}
        storeContent={storeContent}
        theme="electronics"
      >
        <div className="bg-slate-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold tracking-wide mb-6">Order Details</h1>
              <p className="text-blue-200 font-light text-lg">
                Order #{order.id}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="border border-gray-200 p-8">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-2xl font-bold tracking-wide">Order #{order.id}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
                        order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Placed on {formatDate(order.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Total: {formatCurrency(order.total, storeSettings, currencies)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <Link
                      href={route('store.my-orders', store.slug)}
                      className="px-6 py-2 border border-gray-300 text-sm font-semibold tracking-wide uppercase hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      Back to Orders
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 overflow-hidden">
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
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price, storeSettings, currencies)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 p-4">
                      <p className="font-semibold">{order.shipping_address.name}</p>
                      <p>{order.shipping_address.street}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Order Summary</h3>
                    <div className="bg-gray-50 p-4 space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">{formatCurrency(order.subtotal, storeSettings, currencies)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span className="font-semibold">-{formatCurrency(order.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="font-semibold">{formatCurrency(order.shipping, storeSettings, currencies)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span className="font-semibold">{formatCurrency(order.tax, storeSettings, currencies)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold">Total:</span>
                          <span className="text-lg font-bold text-blue-600">{formatCurrency(order.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment & Shipping Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                      <p className="text-gray-600">{order.payment_method}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Shipping Method</h4>
                      <p className="text-gray-600">{order.shipping_method}</p>
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