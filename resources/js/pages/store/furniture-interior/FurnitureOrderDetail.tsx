import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Package, Truck, Check, MapPin, CreditCard, ArrowLeft, Home } from 'lucide-react';
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

interface FurnitureOrderDetailProps {
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

export default function FurnitureOrderDetail({
  order,
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FurnitureOrderDetailProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Check className="h-6 w-6 text-green-300" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-blue-300" />;
      case 'processing':
        return <Package className="h-6 w-6 text-amber-300" />;
      default:
        return <Package className="h-6 w-6 text-slate-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
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
        theme="furniture-interior"
      >
        {/* Hero Section */}
        <div className="bg-yellow-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Order Details</h1>
              <p className="text-amber-200 text-lg">
                Track your furniture order and delivery information
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <div className="mb-8">
                <Link
                  href={route('store.my-orders', { storeSlug: store.slug })}
                  className="inline-flex items-center text-amber-800 hover:text-amber-900 font-medium"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to My Orders
                </Link>
              </div>

              {/* Invoice Container */}
              <div className="bg-white rounded-3xl shadow-2xl border-4 border-yellow-800 overflow-hidden">
                {/* Order Header */}
                <div className="bg-yellow-800 text-white p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">ORDER DETAILS</h1>
                      <p className="text-amber-200 text-lg">{store.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white text-yellow-800 px-6 py-3 rounded-2xl font-bold text-xl shadow-lg">
                        #{order.id}
                      </div>
                      <div className="mt-4 flex items-center justify-end space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 text-sm font-bold rounded-xl ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Delivery Address */}
                    <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
                      <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        DELIVERY ADDRESS
                      </h3>
                      <div className="text-slate-900 space-y-1">
                        <p className="font-bold text-lg">{order.shipping_address.name}</p>
                        <p>{order.shipping_address.street}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                        <p>{order.shipping_address.zip}, {order.shipping_address.country}</p>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
                      <h3 className="text-lg font-bold text-amber-800 mb-4">ORDER INFORMATION</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Order Date:</span>
                          <span className="font-bold text-slate-900">{formatDate(order.date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Payment Method:</span>
                          <span className="font-bold text-slate-900">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Delivery Method:</span>
                          <span className="font-bold text-slate-900">{order.shipping_method}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">FURNITURE ITEMS</h3>
                    <div className="overflow-hidden border-2 border-amber-200 rounded-2xl">
                      <table className="w-full">
                        <thead className="bg-yellow-800 text-white">
                          <tr>
                            <th className="text-left p-4 font-bold">ITEM</th>
                            <th className="text-center p-4 font-bold">QTY</th>
                            <th className="text-right p-4 font-bold">UNIT PRICE</th>
                            <th className="text-right p-4 font-bold">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {order.items.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? 'bg-amber-25' : 'bg-white'}>
                              <td className="p-4">
                                <div className="flex items-center space-x-4">
                                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 border-amber-200">
                                    <img 
                                      className="h-full w-full object-cover" 
                                      src={item.image ? getImageUrl(item.image) : `/storage/products/furniture-${item.id || 'default'}.jpg`}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5dc/8b7355?text=${encodeURIComponent(item.name)}`;
                                      }}
                                      alt={item.name}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{item.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-center font-bold text-slate-900">{item.quantity}</td>
                              <td className="p-4 text-right font-bold text-slate-900">{formatCurrency(item.price, storeSettings, currencies)}</td>
                              <td className="p-4 text-right font-bold text-amber-800">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Invoice Summary */}
                  <div className="flex justify-end">
                    <div className="w-full max-w-md">
                      <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
                        <h4 className="text-xl font-bold text-amber-800 mb-4">ORDER SUMMARY</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2">
                            <span className="text-slate-600">Subtotal:</span>
                            <span className="font-bold text-slate-900">{formatCurrency(order.subtotal, storeSettings, currencies)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between py-2">
                              <span className="text-green-600">Discount:</span>
                              <span className="font-bold text-green-600">-{formatCurrency(order.discount, storeSettings, currencies)}</span>
                            </div>
                          )}
                          <div className="flex justify-between py-2">
                            <span className="text-slate-600">Delivery:</span>
                            <span className="font-bold text-slate-900">{formatCurrency(order.shipping, storeSettings, currencies)}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-slate-600">Tax:</span>
                            <span className="font-bold text-slate-900">{formatCurrency(order.tax, storeSettings, currencies)}</span>
                          </div>
                          <div className="border-t-3 border-amber-300 pt-3">
                            <div className="flex justify-between">
                              <span className="text-2xl font-bold text-amber-800">TOTAL:</span>
                              <span className="text-2xl font-bold text-amber-800">{formatCurrency(order.total, storeSettings, currencies)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="mt-8 pt-8 border-t-2 border-amber-200 text-center">
                    <p className="text-slate-600 mb-2">Thank you for choosing our furniture collection!</p>
                    <p className="text-sm text-slate-500">For any questions about this order, please contact our customer service.</p>
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