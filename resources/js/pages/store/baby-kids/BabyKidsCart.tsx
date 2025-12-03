import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { useCart, CartProvider } from '@/contexts/CartContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface BabyKidsCartProps {
  store: any;
  storeContent?: any;
  cartItems?: any[];
  cartSummary?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function BabyKidsCartContent({
  store = {},
  storeContent,
  cartItems = [],
  cartSummary,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BabyKidsCartProps) {
  const { items, updateQuantity, removeItem, refreshCart, loading, summary } = useCart();
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'baby-kids';
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [dynamicSummary, setDynamicSummary] = useState(summary);

  useEffect(() => {
    refreshCart();
  }, []);

  useEffect(() => {
    setDynamicSummary(summary);
    if (couponApplied) {
      setCouponApplied(false);
      setCouponCode('');
    }
  }, [summary]);

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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (couponApplied) {
      setCouponApplied(false);
      setCouponCode('');
      setDynamicSummary(summary);
    } else if (couponCode) {
      try {
        const response = await fetch(route('api.coupon.validate'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({
            store_id: store.id,
            coupon_code: couponCode,
          }),
        });
        
        const data = await response.json();
        
        if (data.valid) {
          setCouponApplied(true);
          setDynamicSummary({
            ...summary,
            discount: data.discount,
            total: summary.subtotal - data.discount + summary.shipping + summary.tax
          });
          alert(data.message);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert('Error validating coupon. Please try again.');
      }
    }
  };

  return (
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
        {/* Hero Section */}
        <div className="bg-pink-50 py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600">
                Review your items for your little ones
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6 lg:px-12">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {items.map((item) => {
                      const itemPrice = item.sale_price || item.price;
                      const itemSubtotal = itemPrice * item.quantity;
                      
                      return (
                        <div key={item.id} className="group relative">
                          {/* Toy Block Style Card */}
                          <div className="absolute top-4 left-4 right-0 bottom-0 bg-pink-200 rounded-3xl opacity-30"></div>
                          <div className="relative bg-white rounded-3xl shadow-xl border-4 border-pink-400 overflow-hidden hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row h-full">
                              {/* Product Image */}
                              <div className="relative w-full md:w-40 h-48 md:h-auto overflow-hidden flex-shrink-0">
                                <a href={route('store.product', { storeSlug, id: item.id })}>
                                  <img
                                    src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/400x300/fef7f7/ec4899?text=${encodeURIComponent(item.name)}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fef7f7/ec4899?text=${encodeURIComponent(item.name)}`;
                                    }}
                                  />
                                </a>
                                
                                {/* Remove Button */}
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>

                                {/* Sale Badge */}
                                {item.sale_price && item.sale_price < item.price && (
                                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    Sale
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 p-6">
                                {/* Category */}
                                <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                                  {item.category.name}
                                </span>

                                {/* Title */}
                                <a href={route('store.product', { storeSlug, id: item.id })}>
                                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                                    {item.name}
                                  </h3>
                                </a>

                                {/* Price and Quantity */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                  <div className="flex items-center space-x-2">
                                    {item.sale_price && item.sale_price < item.price ? (
                                      <>
                                        <span className="text-lg font-bold text-red-500">
                                          {formatCurrency(item.sale_price, storeSettings, currencies)}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                          {formatCurrency(item.price, storeSettings, currencies)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-lg font-bold text-gray-800">
                                        {formatCurrency(item.price, storeSettings, currencies)}
                                      </span>
                                    )}
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                      className="w-8 h-8 bg-pink-100 text-pink-500 rounded-full font-bold hover:bg-pink-200 transition-colors"
                                    >
                                      -
                                    </button>
                                    <span className="text-lg font-bold text-gray-800 min-w-[2rem] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                      className="w-8 h-8 bg-pink-100 text-pink-500 rounded-full font-bold hover:bg-pink-200 transition-colors"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Subtotal */}
                                <div className="mt-4 pt-4 border-t border-pink-200">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="text-xl font-bold text-gray-800">
                                      {formatCurrency(itemSubtotal, storeSettings, currencies)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cart Summary */}
                <div className="relative">
                  <div className="relative bg-white rounded-3xl shadow-xl border-4 border-blue-400 p-8 sticky top-8">
                    <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-blue-200 rounded-3xl opacity-30 -z-10"></div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-bold">{formatCurrency(dynamicSummary.subtotal, storeSettings, currencies)}</span>
                      </div>
                      
                      {dynamicSummary.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-{formatCurrency(dynamicSummary.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-bold">{formatCurrency(dynamicSummary.shipping, storeSettings, currencies)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-bold">{formatCurrency(dynamicSummary.tax, storeSettings, currencies)}</span>
                      </div>
                      
                      <div className="border-t border-pink-200 pt-4 mt-4">
                        <div className="flex justify-between">
                          <span className="text-xl font-bold">Total</span>
                          <span className="text-xl font-bold text-pink-500">{formatCurrency(dynamicSummary.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                      
                      {/* Coupon Code */}
                      <div className="mt-6">
                        <form onSubmit={handleApplyCoupon} className="space-y-3">
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500 transition-colors"
                            disabled={couponApplied}
                          />
                          <button 
                            type="submit"
                            className={`w-full py-3 rounded-2xl font-bold transition-colors ${
                              couponApplied 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'bg-pink-500 hover:bg-pink-600 text-white'
                            }`}
                          >
                            {couponApplied ? 'Remove Coupon' : 'Apply Coupon'}
                          </button>
                        </form>
                        {couponApplied && (
                          <p className="text-sm text-green-600 mt-2 font-semibold">Coupon applied successfully!</p>
                        )}
                      </div>
                      
                      {/* Checkout Button */}
                      <div className="mt-8">
                        <a
                          href={route('store.checkout', { storeSlug })}
                          className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-pink-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                          </svg>
                          <span>Proceed to Checkout</span>
                        </a>
                      </div>
                      

                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="relative inline-block">
                  <div className="absolute top-3 left-3 right-0 bottom-0 bg-pink-200 rounded-3xl opacity-30"></div>
                  <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 p-12">
                    <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h3>
                    <p className="text-gray-600 mb-6">
                      Start adding amazing products for your little ones!
                    </p>
                    <a
                      href={route('store.products', store.slug)}
                      className="inline-flex items-center bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-colors shadow-lg"
                    >
                      Start Shopping
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Shopping */}
        {items.length > 0 && (
          <div className="bg-pink-50 py-12">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center">
                <a
                  href={route('store.products', store.slug)}
                  className="inline-flex items-center bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </StoreLayout>
  );
}

export default function BabyKidsCart(props: BabyKidsCartProps) {
  return (
    <>
      <Head title={`Shopping Cart - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <BabyKidsCartContent {...props} />
      </CartProvider>
    </>
  );
}