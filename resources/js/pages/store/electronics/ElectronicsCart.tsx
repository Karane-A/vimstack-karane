import React from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { ElectronicsFooter } from '@/components/store/electronics';
import { ShoppingCart, Plus, Minus, X, ArrowRight, Shield, Truck } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useCart, CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    sale_price?: number;
    cover_image?: string;
    slug: string;
    stock: number;
  };
  variants?: Record<string, string>;
}

interface ElectronicsCartProps {
  store: any;
  storeContent?: any;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export default function ElectronicsCart({ 
  store, 
  storeContent,
  cartItems, 
  subtotal, 
  tax, 
  shipping, 
  total, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: ElectronicsCartProps) {
  return (
    <CartProvider storeId={store.id || 1} isLoggedIn={isLoggedIn}>
      <ElectronicsCartContent 
        store={store}
        storeContent={storeContent}
        cartItems={cartItems}
        subtotal={subtotal}
        tax={tax}
        shipping={shipping}
        total={total}
        customPages={customPages}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
      />
    </CartProvider>
  );
}

function ElectronicsCartContent({ 
  store, 
  storeContent,
  cartItems, 
  subtotal, 
  tax, 
  shipping, 
  total, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: ElectronicsCartProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const { updateQuantity, removeItem, loading, items, refreshCart, summary } = useCart();
  
  // Use dynamic cart items from context, only fallback to props if context hasn't loaded yet
  const dynamicCartItems = items;
  const dynamicSummary = items.length > 0 ? summary : { 
    subtotal: subtotal || 0, 
    tax: tax || 0, 
    shipping: shipping || 0, 
    total: total || 0, 
    discount: 0 
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeItem(itemId);
    await refreshCart();
  };
  
  React.useEffect(() => {
    refreshCart();
  }, []);

  return (
    <>
      <Head title={`Shopping Cart - ${store.name}`} />
      
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
        <div className="bg-gray-50 min-h-screen">
          {/* Page Header */}
          <section className="bg-slate-900 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold mb-6">Shopping Cart</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Review your selected electronics and proceed to checkout
              </p>
            </div>
          </section>

          {/* Cart Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {dynamicCartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cart Items */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Cart Items ({dynamicCartItems.length})
                      </h2>
                      
                      <div className="space-y-6">
                        {dynamicCartItems.map((item) => {
                          const product = item.product || item; // Handle both nested and flat structure
                          const hasDiscount = product?.sale_price && product.sale_price < product.price;
                          const itemPrice = parseFloat(hasDiscount ? product.sale_price! : product?.price || 0);
                          const isUpdating = loading;

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors duration-300"
                            >
                              {/* Product Image */}
                              <div className="w-20 h-20 flex-shrink-0">
                                <img
                                  src={getImageUrl(product.cover_image) || 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=80&h=80&fit=crop&crop=center'}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=80&h=80&fit=crop&crop=center';
                                  }}
                                />
                              </div>

                              {/* Product Details */}
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">
                                  <a 
                                    href={route('store.product', { storeSlug: store.slug, id: product.id })}
                                    className="hover:text-blue-600 transition-colors duration-300"
                                  >
                                    {product.name || item.name}
                                  </a>
                                </h3>
                                
                                {/* Category */}
                                <p className="text-sm text-gray-500 mb-2">
                                  {item.category?.name || product.category?.name || 'Electronics'}
                                </p>

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-blue-600">
                                    {formatCurrency(itemPrice, storeSettings, currencies)}
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatCurrency(parseFloat(product?.price || 0), storeSettings, currencies)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || isUpdating}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <div className="w-12 h-10 flex items-center justify-center font-semibold">
                                    {isUpdating ? (
                                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      item.quantity
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= product.stock || isUpdating}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={isUpdating}
                                  className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>

                              {/* Item Total */}
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  {formatCurrency(itemPrice * item.quantity, storeSettings, currencies)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                      
                      {/* Summary Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">{formatCurrency(dynamicSummary.subtotal || 0, storeSettings, currencies)}</span>
                        </div>
                        
                        {(dynamicSummary.discount || 0) > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-semibold">-{formatCurrency(dynamicSummary.discount || 0, storeSettings, currencies)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">
                            {(dynamicSummary.shipping || 0) === 0 ? 'Free' : formatCurrency(dynamicSummary.shipping || 0, storeSettings, currencies)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-semibold">{formatCurrency(dynamicSummary.tax || 0, storeSettings, currencies)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-blue-600">{formatCurrency(dynamicSummary.total || 0, storeSettings, currencies)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <a
                        href={route('store.checkout', store.slug)}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 mb-4"
                      >
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-5 h-5" />
                      </a>

                      {/* Security Features */}
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>Secure checkout with SSL encryption</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span>Free shipping on orders over $99</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Cart */
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Looks like you haven't added any electronics to your cart yet. Start shopping to fill it up!
                  </p>
                  <Link
                    href={route('store.products', store.slug)}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span>Continue Shopping</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </StoreLayout>
    </>
  );
}