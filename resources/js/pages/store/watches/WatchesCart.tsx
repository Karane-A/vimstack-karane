import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useCart } from '@/contexts/CartContext';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface WatchesCartProps {
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

function WatchesCartContent({
  store = {},
  storeContent,
  cartItems = [],
  cartSummary = { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 },
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WatchesCartProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const { items, updateQuantity, removeItem, summary, refreshCart } = useCart();
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
      <section className="relative h-96 flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-slate-900/80"></div>
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="mb-6">
                <span className="bg-amber-500 text-slate-900 px-6 py-2 text-sm font-medium tracking-wider uppercase">
                  Shopping
                </span>
              </div>
              <h1 className="text-6xl font-light text-white mb-6 leading-none tracking-tight">
                Your Cart
              </h1>
              <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                Review your selected timepieces before checkout
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
      </section>

      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          {dynamicCartItems.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3 space-y-6">
                {dynamicCartItems.map((item, index) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-slate-200/30 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="p-8">
                      <div className="flex items-center space-x-8">
                        <div className="relative flex-shrink-0">
                          <div className="w-40 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                            <img
                              src={getImageUrl(item.cover_image) || '/placeholder.jpg'}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/200x250/f8fafc/64748b?text=${encodeURIComponent(item.name)}`;
                              }}
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            #{index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-light text-slate-900 mb-2 group-hover:text-amber-600 transition-colors leading-tight">
                                {item.name}
                              </h3>
                              <div className="flex items-center space-x-3 mb-3">
                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide">
                                  {item.category?.name || 'Timepiece'}
                                </span>
                                <span className="text-slate-400 text-sm">•</span>
                                <span className="text-slate-600 text-sm font-medium">SKU: #{item.id}</span>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 ml-4"
                              title="Remove timepiece"
                            >
                              <Trash2 className="h-6 w-6" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Price</label>
                              <div className="flex items-center space-x-3">
                                {item.sale_price ? (
                                  <>
                                    <span className="text-3xl font-light text-slate-900">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                                    <span className="text-lg text-slate-500 line-through">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">SALE</span>
                                  </>
                                ) : (
                                  <span className="text-3xl font-light text-slate-900">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Quantity</label>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                  className="w-12 h-12 bg-slate-100 hover:bg-amber-500 hover:text-white border border-slate-200 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-5 w-5" />
                                </button>
                                <div className="w-16 h-12 bg-slate-50 border-2 border-slate-200 rounded-xl flex items-center justify-center">
                                  <span className="text-lg font-semibold text-slate-900">{item.quantity}</span>
                                </div>
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                  className="w-12 h-12 bg-slate-100 hover:bg-amber-500 hover:text-white border border-slate-200 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                                  disabled={item.quantity >= item.stock}
                                >
                                  <Plus className="h-5 w-5" />
                                </button>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{item.stock} available</p>
                            </div>
                            
                            <div className="space-y-2 text-right">
                              <label className="text-sm font-medium text-slate-600 uppercase tracking-wide">Total</label>
                              <div className="text-3xl font-light text-slate-900">
                                {formatCurrency((item.sale_price || item.price) * item.quantity, storeSettings, currencies)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="xl:col-span-1">
                <div className="bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden sticky top-6">
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500 rounded-full mb-3">
                        <ShoppingBag className="w-6 h-6 text-slate-900" />
                      </div>
                      <h2 className="text-xl font-light tracking-wide">Order Summary</h2>
                      <p className="text-slate-300 text-sm mt-1">{dynamicCartItems.length} luxury timepiece{dynamicCartItems.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-200">
                          <span>Subtotal</span>
                          <span className="font-medium">{formatCurrency(dynamicSummary.subtotal, storeSettings, currencies)}</span>
                        </div>
                        
                        {dynamicSummary.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-300">
                            <span>Discount</span>
                            <span className="font-medium">-{formatCurrency(dynamicSummary.discount, storeSettings, currencies)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm text-slate-200">
                          <span>Shipping</span>
                          <span className="font-medium">
                            {dynamicSummary.shipping === 0 ? 'Free' : formatCurrency(dynamicSummary.shipping, storeSettings, currencies)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm text-slate-200">
                          <span>Tax</span>
                          <span className="font-medium">{formatCurrency(dynamicSummary.tax, storeSettings, currencies)}</span>
                        </div>
                        
                        <div className="flex justify-between text-lg font-medium text-white pt-3 border-t border-slate-600">
                          <span>Total</span>
                          <span>{formatCurrency(dynamicSummary.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Link
                        href={route('store.checkout', store.slug)}
                        className="w-full bg-amber-500 text-slate-900 px-6 py-4 rounded-xl font-medium hover:bg-amber-400 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2 rotate-180" />
                        Secure Checkout
                      </Link>
                      
                      <Link
                        href={route('store.products', store.slug)}
                        className="w-full bg-white/20 text-white px-6 py-4 rounded-xl font-medium hover:bg-white/30 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 p-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-8 shadow-lg">
                    <ShoppingBag className="w-12 h-12 text-slate-600" />
                  </div>
                  <h2 className="text-3xl font-light text-slate-900 mb-4 tracking-wide">
                    Your Cart Awaits
                  </h2>
                  <p className="text-slate-600 font-light mb-8 leading-relaxed text-lg">
                    Discover our exceptional timepiece collections and curate your perfect selection of luxury watches
                  </p>
                  
                  <Link
                    href={route('store.products', store.slug)}
                    className="inline-flex items-center bg-slate-900 text-white px-8 py-4 font-medium hover:bg-slate-800 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Explore Our Collections
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}

export default function WatchesCart(props: WatchesCartProps) {
  return (
    <>
      <Head title={`Shopping Cart - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WatchesCartContent {...props} />
      </CartProvider>
    </>
  );
}