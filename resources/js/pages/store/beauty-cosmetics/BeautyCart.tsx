import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BeautyFooter } from '@/components/store/beauty-cosmetics';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useCart } from '@/contexts/CartContext';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface BeautyCartProps {
  store: any;
  storeContent?: any;
  cartItems: any[];
  cartSummary: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function BeautyCartContent({
  store = {},
  storeContent,
  cartItems = [],
  cartSummary = { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 },
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BeautyCartProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const { items, updateQuantity, removeItem, summary, loading } = useCart();
  const dynamicCartItems = items;
  const dynamicSummary = summary;
  
  const handleQuantityChange = async (id: number, newQuantity: number, stock: number) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > stock) newQuantity = stock;
    await updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = async (id: number) => {
    await removeItem(id);
    await refreshCart();

  React.useEffect(() => {
    refreshCart();
  }, []);
  };

  return (
    <StoreLayout
      storeName={store.name}
      logo={store.logo}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isLoggedIn={isLoggedIn}
      customPages={customPages.length > 0 ? customPages : undefined}
      storeContent={storeContent}
      storeId={store.id}
      theme={store.theme}
    >
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6">
              Beauty Bag
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your curated beauty essentials ready for checkout
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          {dynamicCartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {dynamicCartItems.map((item) => (
                    <div key={item.id} className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-rose-100 ${loading ? 'opacity-50' : ''}`}>
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-32 bg-rose-50 rounded-xl overflow-hidden">
                          <img
                            src={getImageUrl(item.cover_image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=250&fit=crop&crop=center`;
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <p className="text-rose-600 bg-rose-100 px-2 py-1 rounded-full text-sm inline-block mb-3">
                            {item.category.name}
                          </p>
                          
                          <div className="flex items-center space-x-2 mb-4">
                            {item.sale_price ? (
                              <>
                                <span className="text-xl font-bold text-rose-600">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                                <span className="text-sm text-gray-400 line-through">{formatCurrency(item.price, storeSettings, currencies)}</span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-rose-600">{formatCurrency(item.price, storeSettings, currencies)}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                className="w-10 h-10 bg-rose-100 hover:bg-rose-200 rounded-full flex items-center justify-center transition-colors"
                              >
                                <Minus className="h-4 w-4 text-rose-600" />
                              </button>
                              <span className="font-semibold text-lg min-w-[2rem] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                className="w-10 h-10 bg-rose-100 hover:bg-rose-200 rounded-full flex items-center justify-center transition-colors"
                              >
                                <Plus className="h-4 w-4 text-rose-600" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Subtotal</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatCurrency((item.sale_price || item.price) * item.quantity, storeSettings, currencies)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 shadow-lg sticky top-8">
                  <h2 className="text-2xl font-light mb-8 text-gray-900">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(dynamicSummary.subtotal, storeSettings, currencies)}</span>
                    </div>
                    
                    {dynamicSummary.discount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">-{formatCurrency(dynamicSummary.discount, storeSettings, currencies)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-gray-900">
                        {dynamicSummary.shipping === 0 ? 'Free' : formatCurrency(dynamicSummary.shipping, storeSettings, currencies)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(dynamicSummary.tax, storeSettings, currencies)}</span>
                    </div>
                    
                    <div className="border-t border-rose-200 pt-4">
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-rose-600">{formatCurrency(dynamicSummary.total, storeSettings, currencies)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Link
                      href={route('store.checkout', store.slug)}
                      className="block w-full bg-rose-600 text-white text-center py-4 rounded-full font-semibold hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-5 w-5" />
                      Proceed to Checkout
                    </Link>
                    
                    <Link
                      href={route('store.products', store.slug)}
                      className="block w-full border-2 border-rose-200 text-rose-600 text-center py-4 rounded-full font-semibold hover:border-rose-300 hover:bg-rose-50 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                  
                  {/* Benefits */}
                  <div className="mt-8 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-rose-500" />
                      <span>Free shipping on orders over $75</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4 text-rose-500" />
                      <span>30-day easy returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="h-12 w-12 text-rose-400" />
              </div>
              <h2 className="text-3xl font-light text-gray-900 mb-4">Your beauty bag is empty</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Discover amazing beauty products and start building your perfect routine
              </p>
              <Link
                href={route('store.products', store.slug)}
                className="inline-flex items-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-full shadow-lg hover:bg-rose-700 hover:shadow-xl transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}

export default function BeautyCart(props: BeautyCartProps) {
  return (
    <>
      <Head title={`Shopping Cart - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <BeautyCartContent {...props} />
      </CartProvider>
    </>
  );
}