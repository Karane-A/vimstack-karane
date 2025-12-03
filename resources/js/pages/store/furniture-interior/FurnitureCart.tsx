import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart, CartProvider } from '@/contexts/CartContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface FurnitureCartProps {
  store: any;
  storeContent?: any;
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  cartItems?: any[];
  cartSummary?: any;
}

function FurnitureCartContent({
  store,
  storeContent,
  customPages = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
}: FurnitureCartProps) {
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
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isLoggedIn={isLoggedIn}
      customPages={customPages.length > 0 ? customPages : undefined}
      storeContent={storeContent}
      storeId={store.id}
      theme={store.theme || 'furniture-interior'}
    >
      <div className="bg-yellow-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
            <div className="w-16 h-0.5 bg-amber-200 mx-auto"></div>
          </div>
        </div>
      </div>

        <div className="bg-white py-20">
          <div className="container mx-auto px-6 lg:px-12">
            {items.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="group bg-white rounded-2xl shadow-lg shadow-amber-200/20 hover:shadow-2xl hover:shadow-amber-300/30 transition-all duration-500 overflow-hidden border-2 border-amber-100 hover:border-amber-300">
                      <div className="flex flex-col lg:flex-row">
                        <div className="relative w-32 lg:w-40 aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
                          <img
                            src={item.cover_image ? getImageUrl(item.cover_image) : `/storage/products/furniture-${item.id || 'default'}.jpg`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5dc/8b7355?text=${encodeURIComponent(item.name)}`;
                            }}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 border-4 border-amber-800/15 rounded-lg m-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {(() => {
                            const hasDiscount = item.sale_price && parseFloat(item.sale_price) > 0 && parseFloat(item.sale_price) < parseFloat(item.price);
                            return hasDiscount ? (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-2 text-xs font-bold rounded-xl shadow-lg">
                                <span className="block text-xs">SAVE</span>
                                <span className="block text-sm leading-none">{Math.round(((parseFloat(item.price) - parseFloat(item.sale_price)) / parseFloat(item.price)) * 100)}%</span>
                              </div>
                            ) : null;
                          })()}
                        </div>
                        
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                  </svg>
                                  {item.category?.name || 'Furniture'}
                                </span>
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
                                    <span className="bg-amber-800 text-amber-100 px-3 py-2 text-sm font-bold rounded-full">
                                      In Variant
                                    </span>
                                  ) : null;
                                })()}
                              </div>
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={loading}
                                className={`w-12 h-12 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-md ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-tight">
                                {item.name}
                              </h3>
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
                                  <div className="flex gap-1">
                                    {Object.entries(variants).map(([key, value]) => (
                                      <span key={key} className="text-xs text-amber-800 bg-amber-100 px-2 py-1 rounded font-medium">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </div>
                                ) : null;
                              })()}
                            </div>
                            <div className="mb-4">
                              {item.stock > 0 ? (
                                <span className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  In Stock ({item.stock} available)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-amber-100">
                            <div className="flex flex-wrap items-baseline gap-2">
                              {(() => {
                                const hasDiscount = item.sale_price && parseFloat(item.sale_price) > 0 && parseFloat(item.sale_price) < parseFloat(item.price);
                                console.log('Cart item:', item.name, 'Price:', item.price, 'Sale Price:', item.sale_price, 'Has Discount:', hasDiscount);
                                
                                if (hasDiscount) {
                                  return (
                                    <>
                                      <span className="text-lg font-bold text-amber-800">
                                        {formatCurrency(item.sale_price, storeSettings, currencies)}
                                      </span>
                                      <span className="text-base text-slate-400 line-through">
                                        {formatCurrency(item.price, storeSettings, currencies)}
                                      </span>
                                      <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded-lg">
                                        Save {formatCurrency(parseFloat(item.price) - parseFloat(item.sale_price), storeSettings, currencies)}
                                      </span>
                                    </>
                                  );
                                } else {
                                  return (
                                    <span className="text-lg font-bold text-amber-800">
                                      {formatCurrency(item.price, storeSettings, currencies)}
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border-2 border-amber-200 rounded-xl overflow-hidden">
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                  disabled={loading || item.quantity <= 1}
                                  className="w-10 h-10 bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-16 text-center py-2 font-bold text-slate-900">{item.quantity}</span>
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                  disabled={loading || item.quantity >= item.stock}
                                  className="w-10 h-10 bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-slate-600">Total</div>
                                <div className="text-xl font-bold text-amber-800">
                                  {formatCurrency((item.sale_price && item.sale_price < item.price ? item.sale_price : item.price) * item.quantity, storeSettings, currencies)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-amber-50 rounded-2xl p-6 shadow-lg border-2 border-amber-100 sticky top-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-bold text-slate-900">{formatCurrency(summary.subtotal, storeSettings, currencies)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Shipping</span>
                        <span className="font-bold text-slate-900">
                          {summary.shipping === 0 ? 'Free' : formatCurrency(summary.shipping, storeSettings, currencies)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax</span>
                        <span className="font-bold text-slate-900">{formatCurrency(summary.tax, storeSettings, currencies)}</span>
                      </div>
                      <div className="border-t-2 border-amber-200 pt-4">
                        <div className="flex justify-between text-xl font-bold">
                          <span className="text-slate-900">Total</span>
                          <span className="text-amber-800">{formatCurrency(summary.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={route('store.checkout', store.slug)}
                      className="group w-full bg-yellow-800 text-white px-10 py-5 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 flex items-center justify-center gap-3 mb-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Proceed to Checkout</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>

                    <Link
                      href={route('store.products', store.slug)}
                      className="group w-full border-3 border-yellow-700 text-yellow-800 px-10 py-5 rounded-2xl font-bold hover:bg-yellow-800 hover:text-white hover:border-yellow-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Continue Shopping</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingCart className="w-16 h-16 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Discover our beautiful furniture collection and start creating your dream space
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-flex items-center gap-3 bg-yellow-800 text-white px-10 py-4 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Start Shopping</span>
                </Link>
              </div>
            )}
          </div>
        </div>
    </StoreLayout>
  );
}

export default function FurnitureCart(props: FurnitureCartProps) {
  return (
    <>
      <Head title={`Shopping Cart - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <FurnitureCartContent {...props} />
      </CartProvider>
    </>
  );
}