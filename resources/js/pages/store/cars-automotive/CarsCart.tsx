import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Zap, Wrench, Settings } from 'lucide-react';
import { useCart, CartProvider } from '@/contexts/CartContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface CarsCartProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

function CarsCartContent({ 
  store, 
  storeContent, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false
}: CarsCartProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const { items, updateQuantity, removeItem, refreshCart, loading, summary } = useCart();
  
  useEffect(() => {
    refreshCart();
  }, []);

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
      isLoggedIn={isLoggedIn}
      customPages={customPages.length > 0 ? customPages : undefined}
      storeContent={storeContent}
      storeId={store.id}
      theme={store.theme}
    >
      {/* Industrial Header */}
      <div className="bg-black text-white py-20 border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                <div className="w-6 h-6 bg-white transform -rotate-45"></div>
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-wider">GARAGE CART</h1>
                <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Performance Parts Ready</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600"></div>
              <div className="w-3 h-3 bg-red-600"></div>
              <div className="w-3 h-3 bg-red-600"></div>
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Review your selected automotive components before installation
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {items.length > 0 ? (
            <>
              {/* Stats Bar */}
              <div className="bg-black text-white p-6 border-l-4 border-red-600 mb-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-black text-red-600">{items.length}</div>
                      <div className="text-sm font-bold tracking-widest uppercase">Parts Selected</div>
                    </div>
                    <div className="w-px h-12 bg-gray-600"></div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-red-600">{formatCurrency(summary.total, storeSettings, currencies)}</div>
                      <div className="text-sm font-bold tracking-widest uppercase">Total Value</div>
                    </div>
                  </div>
                  <div className="flex items-center text-red-400">
                    <Wrench className="h-5 w-5 mr-2" />
                    <span className="font-bold tracking-wider uppercase">Ready to Install</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id} className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-red-600 group transform hover:-translate-y-1">
                      <div className="flex flex-col lg:flex-row">
                        {/* Product Image */}
                        <div className="lg:w-48 h-48 lg:h-auto relative bg-gray-100 overflow-hidden">
                          <img
                            src={getImageUrl(item.cover_image)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f5f5f5/666666?text=${encodeURIComponent(item.name)}`;
                            }}
                          />
                          {item.sale_price && item.sale_price < item.price && (
                            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold">
                              -{Math.round(((item.price - item.sale_price) / item.price) * 100)}% OFF
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 text-xs font-bold">
                            #{String(index + 1).padStart(2, '0')}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between h-full">
                            <div className="flex-1 mb-4 lg:mb-0">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                  {item.category?.name || 'Auto Part'}
                                </span>
                                <div className={`flex items-center gap-2 ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  <div className={`w-2 h-2 rounded-full ${item.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <span className="text-sm font-medium">
                                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                  </span>
                                </div>
                              </div>
                              
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                {item.name}
                              </h3>
                              
                              {/* Variants */}
                              {(() => {
                                let variants = null;
                                if (item.variants) {
                                  if (typeof item.variants === 'object' && item.variants !== null) {
                                    variants = item.variants;
                                  } else if (typeof item.variants === 'string') {
                                    try {
                                      variants = JSON.parse(item.variants);
                                    } catch (e) {
                                      variants = null;
                                    }
                                  }
                                }
                                const hasValidVariants = variants && typeof variants === 'object' && Object.keys(variants).length > 0;
                                return hasValidVariants ? (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {Object.entries(variants).map(([key, value]) => (
                                      <span key={key} className="bg-red-100 text-red-700 px-3 py-1 text-sm font-medium rounded">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </div>
                                ) : null;
                              })()}
                              
                              <div className="flex items-center gap-3 mb-4">
                                {item.sale_price && item.sale_price < item.price ? (
                                  <>
                                    <span className="text-2xl font-bold text-red-600">
                                      {formatCurrency(item.sale_price, storeSettings, currencies)}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                      {formatCurrency(item.price, storeSettings, currencies)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(item.price, storeSettings, currencies)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="flex flex-col lg:items-end gap-4">
                              {/* Quantity Control */}
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-700 mr-4">Qty:</span>
                                <div className="flex items-center border-2 border-gray-300 rounded">
                                  <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                    disabled={loading || item.quantity <= 1}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <div className="w-16 h-10 flex items-center justify-center font-bold text-center border-x-2 border-gray-300">
                                    {item.quantity}
                                  </div>
                                  <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                    disabled={loading || item.quantity >= item.stock}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Item Total */}
                              <div className="text-right">
                                <div className="text-sm text-gray-600 mb-1">Item Total</div>
                                <div className="text-2xl font-bold text-red-600">
                                  {formatCurrency((item.sale_price && item.sale_price < item.price ? item.sale_price : item.price) * item.quantity, storeSettings, currencies)}
                                </div>
                              </div>

                              {/* Remove Button */}
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={loading}
                                className={`flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-black text-white p-8 border-l-4 border-red-600 sticky top-8">
                    <div className="flex items-center mb-6">
                      <Settings className="h-6 w-6 text-red-600 mr-3" />
                      <h2 className="text-2xl font-black tracking-wider">ORDER SUMMARY</h2>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="font-bold tracking-wider uppercase text-gray-300">Subtotal</span>
                        <span className="font-black text-white">
                          {formatCurrency(summary.subtotal, storeSettings, currencies)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="font-bold tracking-wider uppercase text-gray-300">Shipping</span>
                        <span className="font-black text-green-400">
                          {summary.shipping === 0 ? 'FREE' : formatCurrency(summary.shipping, storeSettings, currencies)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="font-bold tracking-wider uppercase text-gray-300">Tax</span>
                        <span className="font-black text-white">
                          {formatCurrency(summary.tax, storeSettings, currencies)}
                        </span>
                      </div>
                      <div className="border-t-2 border-red-600 pt-4">
                        <div className="flex justify-between">
                          <span className="text-xl font-black tracking-wider uppercase text-white">Total</span>
                          <span className="text-3xl font-black text-red-600">
                            {formatCurrency(summary.total, storeSettings, currencies)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={route('store.checkout', store.slug)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 mb-4 hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <ArrowRight className="h-5 w-5" />
                      <span>Proceed to Checkout</span>
                    </Link>

                    <Link
                      href={route('store.products', store.slug)}
                      className="w-full border-2 border-gray-600 hover:border-red-600 text-gray-300 hover:text-red-600 py-4 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                    >
                      <Wrench className="h-5 w-5" />
                      <span>Browse More Parts</span>
                    </Link>


                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white border-2 border-dashed border-gray-300 p-16 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-4xl font-black text-black mb-6">EMPTY GARAGE</h2>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Your cart is empty. Start building your performance setup with premium automotive components.
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-10 py-4 font-bold text-sm uppercase tracking-widest transition-colors"
                >
                  <Wrench className="h-5 w-5" />
                  <span>Browse Performance Parts</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}

export default function CarsCart(props: CarsCartProps) {
  return (
    <>
      <Head title={`Shopping Cart - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <CarsCartContent {...props} />
      </CartProvider>
    </>
  );
}