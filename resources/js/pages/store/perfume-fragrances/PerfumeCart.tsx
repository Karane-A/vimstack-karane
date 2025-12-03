import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { PerfumeFooter } from '@/components/store/perfume-fragrances';
import { useCart } from '@/contexts/CartContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface PerfumeCartProps {
  store: any;
  cartItems?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  storeContent?: any;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function PerfumeCartContent({
  store = {},
  cartItems = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  storeContent = {},
  customPages = [],
}: PerfumeCartProps) {
  const { items, updateQuantity, removeItem, loading, summary, refreshCart } = useCart();
  
  React.useEffect(() => {
    refreshCart();
  }, []);
  
  // Calculate total quantity for cart count
  const totalQuantity = items.reduce((total, item) => total + (item.quantity || 1), 0);
  
  function CartInner() {
    const { props } = usePage();
    const storeSettings = props.storeSettings || {};
    const currencies = props.currencies || [];
    
    const [processingItems, setProcessingItems] = React.useState(new Set());
    
    const handleQuantityChange = React.useCallback(async (item: any, newQuantity: number) => {
      if (processingItems.has(item.id)) return;
      setProcessingItems(prev => new Set(prev).add(item.id));
      
      try {
        if (newQuantity <= 0) {
          await removeItem(item.id);
        } else {
          await updateQuantity(item.id, newQuantity);
        }
      } finally {
        setProcessingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }
    }, [processingItems, removeItem, updateQuantity]);
    
    const handleRemoveItem = React.useCallback(async (id: number) => {
      if (processingItems.has(id)) return;
      setProcessingItems(prev => new Set(prev).add(id));
      
      try {
        await removeItem(id);
    await refreshCart();

  React.useEffect(() => {
    refreshCart();
  }, []);
      } finally {
        setProcessingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }, [processingItems, removeItem]);

    return (
      <>
        {/* Hero Section */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                Shopping Cart
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Your selected fragrances
              </p>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {items.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-12">
                
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-light text-gray-900 mb-8">
                    Cart Items ({items.length})
                  </h2>
                  
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-stone-50 rounded-xl p-3 hover:bg-purple-50 transition-colors duration-300">
                        <div className="flex gap-4 items-center">
                          
                          {/* Product Image */}
                          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                            <img
                              src={getImageUrl(item.cover_image || item.image) || `https://placehold.co/96x96/fafaf9/7c3aed?text=${encodeURIComponent(item.name)}`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/96x96/fafaf9/7c3aed?text=${encodeURIComponent(item.name)}`;
                              }}
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                                  {item.sale_price && item.sale_price < item.price && (
                                    <span className="bg-red-100 text-red-700 px-1.5 py-0.5 text-xs font-medium rounded">
                                      -{Math.round(((item.price - item.sale_price) / item.price) * 100)}%
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    {item.category && (
                                      <p className="text-sm text-purple-600">{item.category.name}</p>
                                    )}
                                    
                                    {/* Stock Status */}
                                    <div className={`inline-flex items-center gap-1 text-sm ${
                                      item.stock > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${
                                        item.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                                      }`}></div>
                                      <span>{item.stock > 0 ? `${item.stock} available` : 'Out of stock'}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Variants - Right Side */}
                                  {item.selected_variants && Object.keys(item.selected_variants).length > 0 && (
                                    <div className="flex flex-col gap-1">
                                      {Object.entries(item.selected_variants).map(([key, value]) => (
                                        <span key={key} className="bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded text-right">
                                          {key}: {String(value)}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={loading || processingItems.has(item.id)}
                                className={`text-gray-400 hover:text-red-500 transition-colors duration-300 ml-2 ${loading || processingItems.has(item.id) ? 'cursor-not-allowed opacity-50' : ''}`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {item.sale_price && item.sale_price < item.price ? (
                                  <>
                                    <span className="text-lg font-semibold text-purple-800">
                                      {formatCurrency(item.sale_price, storeSettings, currencies)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatCurrency(item.price, storeSettings, currencies)}
                                    </span>
                                    <span className="text-xs text-green-600 font-medium">
                                      Save {formatCurrency(item.price - item.sale_price, storeSettings, currencies)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-semibold text-purple-800">
                                    {formatCurrency(item.price, storeSettings, currencies)}
                                  </span>
                                )}
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600">Qty:</span>
                                <button
                                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                  disabled={loading || item.quantity <= 1 || processingItems.has(item.id)}
                                  className={`w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center hover:bg-purple-200 transition-colors duration-300 ${loading || item.quantity <= 1 || processingItems.has(item.id) ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                
                                <button
                                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                  disabled={loading || item.quantity >= item.stock || processingItems.has(item.id)}
                                  className={`w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center hover:bg-purple-200 transition-colors duration-300 ${loading || item.quantity >= item.stock || processingItems.has(item.id) ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Item Total */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Item Total:</span>
                                <span className="font-semibold text-purple-800">
                                  {formatCurrency((item.sale_price && item.sale_price < item.price ? item.sale_price : item.price) * item.quantity, storeSettings, currencies)}
                                </span>
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
                  <div className="bg-stone-50 rounded-2xl p-6 sticky top-8">
                    <h3 className="text-xl font-medium text-gray-900 mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(summary.subtotal, storeSettings, currencies)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">{summary.shipping === 0 ? 'Free' : formatCurrency(summary.shipping, storeSettings, currencies)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">{formatCurrency(summary.tax || 0, storeSettings, currencies)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-medium text-gray-900">Total</span>
                          <span className="text-lg font-semibold text-purple-800">{formatCurrency(summary.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href={route('store.checkout', store.slug)}
                      className="w-full bg-purple-800 text-white py-3 rounded-full font-medium hover:bg-purple-900 transition-colors duration-300 text-center block mb-4"
                    >
                      Proceed to Checkout
                    </Link>
                    
                    <Link
                      href={route('store.products', store.slug)}
                      className="w-full bg-purple-100 text-purple-800 py-3 rounded-full font-medium hover:bg-purple-200 transition-colors duration-300 text-center block"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-light text-gray-900 mb-4">Your Cart is Empty</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Discover our exquisite fragrance collection and add your favorites to cart.
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-flex items-center px-8 py-4 bg-purple-800 text-white rounded-full font-medium hover:bg-purple-900 transition-colors duration-300"
                >
                  <span>Start Shopping</span>
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
  
  return (
    <StoreLayout
      storeName={store.name}
      logo={store.logo}
      cartCount={totalQuantity > 0 ? totalQuantity : cartCount}
      wishlistCount={wishlistCount}
      isLoggedIn={isLoggedIn}
      customPages={customPages}
      storeId={store.id}
      customFooter={<PerfumeFooter storeName={store.name} logo={store.logo} content={storeContent?.footer} />}
    >
      <CartInner />
    </StoreLayout>
  );
}



export default function PerfumeCart(props: PerfumeCartProps) {
  return (
    <>
      <Head title={`Shopping Cart - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WishlistProvider>
          <PerfumeCartContent {...props} />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}