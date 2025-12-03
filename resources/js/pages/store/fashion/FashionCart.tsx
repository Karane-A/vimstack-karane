import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter } from '@/components/store/fashion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useCart } from '@/contexts/CartContext';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface FashionCartProps {
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

function FashionCartContent({
  store = {},
  storeContent,
  cartItems = [],
  cartSummary = { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 },
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionCartProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const { items, updateQuantity, removeItem, summary, refreshCart } = useCart();
  // Always use cart context items for real-time updates
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
  };
  
  React.useEffect(() => {
    refreshCart();
  }, []);
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
        <div className="bg-black text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-thin tracking-wide mb-6">Shopping Cart</h1>
              <p className="text-white/70 font-light text-lg">
                Review your selected items
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {dynamicCartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {dynamicCartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-6 p-6 border border-gray-200">
                        <div className="w-24 h-32 bg-gray-100 overflow-hidden">
                          <img
                            src={getImageUrl(item.cover_image) || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/200x250/f5f5f5/666666?text=${encodeURIComponent(item.name)}`;
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-light text-lg mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.category.name}</p>
                          <div className="flex items-center space-x-2 mb-4">
                            {item.sale_price ? (
                              <>
                                <span className="text-lg font-medium">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                                <span className="text-sm text-gray-500 line-through">{formatCurrency(item.price, storeSettings, currencies)}</span>
                              </>
                            ) : (
                              <span className="text-lg font-medium">{formatCurrency(item.price, storeSettings, currencies)}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-8">
                    <h2 className="text-2xl font-thin mb-6 tracking-wide">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="font-light">Subtotal</span>
                        <span className="font-medium">{formatCurrency(dynamicSummary.subtotal, storeSettings, currencies)}</span>
                      </div>
                      
                      {dynamicSummary.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span className="font-light">Discount</span>
                          <span className="font-medium">-{formatCurrency(dynamicSummary.discount, storeSettings, currencies)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="font-light">Shipping</span>
                        <span className="font-medium">
                          {dynamicSummary.shipping === 0 ? 'Free' : formatCurrency(dynamicSummary.shipping, storeSettings, currencies)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-light">Tax</span>
                        <span className="font-medium">{formatCurrency(dynamicSummary.tax, storeSettings, currencies)}</span>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg">
                          <span className="font-medium">Total</span>
                          <span className="font-medium">{formatCurrency(dynamicSummary.total, storeSettings, currencies)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href={route('store.checkout', store.slug)}
                      className="block w-full bg-black text-white text-center py-4 font-light tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors mb-4"
                    >
                      Proceed to Checkout
                    </Link>
                    
                    <Link
                      href={route('store.products', store.slug)}
                      className="block w-full border border-gray-300 text-center py-4 font-light tracking-widest uppercase text-sm hover:border-black transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-thin text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 font-light mb-8">
                  Discover our latest collections and add items to your cart
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-block bg-black text-white px-8 py-3 font-light tracking-wide uppercase hover:bg-gray-800 transition-colors"
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

export default function FashionCart(props: FashionCartProps) {
  return (
    <>
      <Head title={`Shopping Cart - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <FashionCartContent {...props} />
      </CartProvider>
    </>
  );
}