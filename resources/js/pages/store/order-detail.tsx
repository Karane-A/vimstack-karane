import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { getThemeComponents } from '@/config/theme-registry';
import { Package, Truck, Check, MapPin, CreditCard } from 'lucide-react';
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

interface OrderDetailProps {
  order: Order;
  store: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customer?: any;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function OrderDetail({
  order,
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customer = null,
  customPages = [],
}: OrderDetailProps) {
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  const components = getThemeComponents(actualTheme);
  const { OrderDetailPage } = components;
  
  // If theme has a specific order detail page, use it
  if (OrderDetailPage && (actualTheme === 'fashion' || actualTheme === 'electronics' || actualTheme === 'beauty-cosmetics' || actualTheme === 'jewelry' || actualTheme === 'watches' || actualTheme === 'furniture-interior' || actualTheme === 'baby-kids' || actualTheme === 'cars-automotive' || actualTheme === 'perfume-fragrances')) {
    return (
      <OrderDetailPage
        order={order}
        store={store}
        storeContent={storeContent}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
      />
    );
  }
  
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
        return <Check className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        theme={store.theme}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Placed on {formatDate(order.date)}
                  </p>
                </div>
                <span className={`mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{order.status}</span>
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <img className="h-12 w-12 rounded-md object-cover" src={getImageUrl(item.image)} alt={item.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(item.price, storeSettings, currencies)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(item.price * item.quantity, storeSettings, currencies)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary and Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">{order.shipping_address.name}</p>
                    <p>{order.shipping_address.street}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>

                {/* Payment & Shipping Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment & Shipping
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Payment Method:</span>
                      <p className="font-medium">{order.payment_method}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Shipping Method:</span>
                      <p className="font-medium">{order.shipping_method}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal, storeSettings, currencies)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between py-2 text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(order.discount, storeSettings, currencies)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span>Shipping:</span>
                    <span>{formatCurrency(order.shipping, storeSettings, currencies)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax:</span>
                    <span>{formatCurrency(order.tax, storeSettings, currencies)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total, storeSettings, currencies)}</span>
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