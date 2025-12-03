import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, Minus, Plus, X, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { useCart, CartProvider } from '@/contexts/CartContext';
import { getImageUrl } from '@/utils/image-helper';

import { formatCurrency } from '@/utils/currency-formatter';

interface CartItem {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image: string;
  quantity: number;
  stock: number;
  is_active: boolean;
  category: {
    id: number;
    name: string;
  };
}

interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface CartProps {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  store: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function Cart({
  cartItems = [],
  cartSummary,
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: CartProps) {
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific cart pages to avoid circular dependencies
  const [ThemeCartPage, setThemeCartPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeCartPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeCartPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let cartPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            cartPageModule = await import('@/pages/store/beauty-cosmetics/BeautyCart');
            break;
          case 'fashion':
            cartPageModule = await import('@/pages/store/fashion/FashionCart');
            break;
          case 'electronics':
            cartPageModule = await import('@/pages/store/electronics/ElectronicsCart');
            break;
          case 'jewelry':
            cartPageModule = await import('@/pages/store/jewelry/JewelryCart');
            break;
          case 'watches':
            cartPageModule = await import('@/pages/store/watches/WatchesCart');
            break;
          case 'furniture-interior':
            cartPageModule = await import('@/pages/store/furniture-interior/FurnitureCart');
            break;
          case 'cars-automotive':
            cartPageModule = await import('@/pages/store/cars-automotive/CarsCart');
            break;
          case 'baby-kids':
            cartPageModule = await import('@/pages/store/baby-kids/BabyKidsCart');
            break;
          case 'perfume-fragrances':
            cartPageModule = await import('@/pages/store/perfume-fragrances/PerfumeCart');
            break;
          default:
            setThemeCartPage(null);
            setIsLoading(false);
            return;
        }
        setThemeCartPage(() => cartPageModule.default);
      } catch (error) {
        console.error('Failed to load theme cart page:', error);
        setThemeCartPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeCartPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific cart page, use it
  if (ThemeCartPage) {
    return (
      <ThemeCartPage
        store={store}
        storeContent={storeContent}
        cartItems={cartItems}
        cartSummary={cartSummary}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
      />
    );
  }
  
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  
  return (
    <CartProvider storeId={store.id || 1} isLoggedIn={isLoggedIn}>
      <CartContent 
        cartItems={cartItems}
        cartSummary={cartSummary}
        store={store}
        storeContent={storeContent}
        theme={theme}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeSlug={storeSlug}
      />
    </CartProvider>
  );
}

function CartContent({
  cartItems,
  cartSummary,
  store,
  storeContent,
  theme,
  cartCount,
  wishlistCount,
  isLoggedIn,
  customPages,
  storeSlug
}: CartProps & { storeSlug: string }) {
  const { items, updateQuantity, removeItem, refreshCart, loading, summary } = useCart();
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const dynamicCartItems = items;
  console.log('📋 Cart items count:', dynamicCartItems.length, '| Loading:', loading);
  
  useEffect(() => {
    refreshCart();
  }, []);
  
  useEffect(() => {
    setDynamicSummary(summary);
    // Reset coupon if cart changes
    if (couponApplied) {
      setCouponApplied(false);
      setCouponCode('');
      setCouponDiscount(0);
    }
  }, [summary]);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [dynamicSummary, setDynamicSummary] = useState(summary);
  
  const handleQuantityChange = async (id: number, newQuantity: number, stock: number) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > stock) newQuantity = stock;
    
    console.log('🔄 Updating quantity:', { id, newQuantity });
    
    try {
      await updateQuantity(id, newQuantity);
      console.log('✅ Quantity updated successfully');
    } catch (error) {
      console.error('❌ Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (id: number) => {
    await removeItem(id);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (couponApplied) {
      // Remove coupon
      setCouponApplied(false);
      setCouponCode('');
      setCouponDiscount(0);
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
          setCouponDiscount(data.discount);
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
    } else {
      alert('Please enter a coupon code');
    }
  };

  const handleAddToCart = (product: any) => {
    console.log('Add to cart', product);
    // In a real app, this would dispatch an action to add the product to the cart
  };

  const handleQuickView = (product: any) => {
    console.log('Quick view', product);
    // In a real app, this would open a quick view modal
  };

  const handleAddToWishlist = (product: any) => {
    console.log('Add to wishlist', product);
    // In a real app, this would dispatch an action to add the product to the wishlist
  };

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
        storeId={store.id || 1}
        theme={store.theme}
      >
        {console.log('StoreLayout props - storeId:', store.id || 1, 'isLoggedIn:', isLoggedIn)}
        {/* Hero Section */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Shopping Cart</h1>
              <p className="text-white/80">
                Review your items and proceed to checkout
              </p>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', { storeSlug })} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">Shopping Cart</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            {dynamicCartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="py-4 px-6 text-center text-sm font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Price</th>
                          <th className="py-4 px-6 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="py-4 px-6 text-right text-sm font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Subtotal</th>
                          <th className="py-4 px-6 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dynamicCartItems.map((item) => {
                          const itemPrice = item.sale_price || item.price;
                          const itemSubtotal = itemPrice * item.quantity;
                          
                          return (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="py-4 px-6">
                                <div className="flex items-center">
                                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={item.cover_image ? getImageUrl(item.cover_image) : `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`}
                                      alt={item.name}
                                      className="h-full w-full object-cover object-center"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                      }}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <Link 
                                      href={route('store.product', { storeSlug, id: item.id })}
                                      className="font-medium text-gray-900 hover:text-primary"
                                    >
                                      {item.name}
                                    </Link>
                                    <p className="text-sm text-gray-500">{item.category.name}</p>
                                    
                                    {/* Show price on mobile */}
                                    <div className="md:hidden mt-1">
                                      {item.sale_price ? (
                                        <div>
                                          <span className="text-primary font-medium">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                                          <span className="text-gray-400 line-through ml-2">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                        </div>
                                      ) : (
                                        <span className="font-medium">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                      )}
                                    </div>
                                    
                                    {/* Show subtotal on mobile */}
                                    <div className="md:hidden mt-1">
                                      <span className="text-sm text-gray-500">Subtotal: </span>
                                      <span className="font-medium">{formatCurrency(itemSubtotal, storeSettings, currencies)}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center hidden md:table-cell">
                                {item.sale_price ? (
                                  <div>
                                    <span className="text-primary font-medium">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                                    <span className="text-gray-400 line-through ml-2 block">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                  </div>
                                ) : (
                                  <span className="font-medium">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center">
                                  <button 
                                    type="button"
                                    className="p-1 rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                    style={{ pointerEvents: 'auto', zIndex: 1 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleQuantityChange(item.id, item.quantity - 1, item.stock);
                                    }}
                                  >
                                    <Minus className="h-4 w-4 text-gray-500" style={{ pointerEvents: 'none' }} />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max={item.stock}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const newValue = parseInt(e.target.value) || 1;
                                      handleQuantityChange(item.id, newValue, item.stock);
                                    }}
                                    className="w-12 text-center border-t border-b border-gray-300 py-1"
                                  />
                                  <button 
                                    type="button"
                                    className="p-1 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                    style={{ pointerEvents: 'auto', zIndex: 1 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleQuantityChange(item.id, item.quantity + 1, item.stock);
                                    }}
                                  >
                                    <Plus className="h-4 w-4 text-gray-500" style={{ pointerEvents: 'none' }} />
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right font-medium hidden md:table-cell">
                                {formatCurrency(itemSubtotal, storeSettings, currencies)}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button 
                                  className="text-gray-400 hover:text-red-500"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <Link 
                      href={route('store.products', { storeSlug })}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
                
                {/* Cart Summary */}
                <div>
                  <div className="bg-gray-50 rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">Cart Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(dynamicSummary.subtotal, storeSettings, currencies)}</span>
                      </div>
                      
                      {dynamicSummary.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-{formatCurrency(dynamicSummary.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">{formatCurrency(dynamicSummary.shipping, storeSettings, currencies)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">{formatCurrency(dynamicSummary.tax, storeSettings, currencies)}</span>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold">Total</span>
                          <span className="text-lg font-bold text-primary">{formatCurrency(dynamicSummary.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                      
                      {/* Coupon Code */}
                      <div className="mt-6">
                        <form onSubmit={handleApplyCoupon} className="flex">
                          <input
                            type="text"
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={couponApplied}
                          />
                          <button 
                            type="submit"
                            className={`px-4 py-2 ${couponApplied ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-r-md`}
                          >
                            {couponApplied ? 'Remove' : 'Apply'}
                          </button>
                        </form>
                        {couponApplied && (
                          <p className="text-sm text-green-600 mt-2">Coupon applied successfully!</p>
                        )}
                      </div>
                      
                      {/* Checkout Button */}
                      <div className="mt-6">
                        <Link 
                          href={route('store.checkout', { storeSlug })}
                          className="w-full py-3 px-4 bg-primary text-white rounded-md font-medium hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center transition-colors duration-200"
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Proceed to Checkout
                        </Link>
                      </div>
                      
                      {/* Shipping Info */}
                      <div className="mt-6 text-sm text-gray-500">
                        <div className="flex items-center mb-2">
                          <Truck className="h-4 w-4 mr-2" />
                          <span>Free shipping on orders over $100</span>
                        </div>
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          <span>30-day easy returns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet</p>
                <Link 
                  href={route('store.products', { storeSlug })}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
        

      </StoreLayout>
    </>
  );
}