import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter } from '@/components/store/jewelry';
import { Minus, Plus, Trash2, ShoppingBag, Gem, Heart, Shield, Star, Truck, ArrowRight } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useCart, CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface JewelryCartProps {
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

function JewelryCartContent({
  store = {},
  storeContent,
  cartItems = [],
  cartSummary = { subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 },
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: JewelryCartProps) {
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
  };
  
  React.useEffect(() => {
    refreshCart();
  }, []);

  return (
    <StoreLayout
      storeName={store.name}
      logo={store.logo}
      storeId={store.id}
      wishlistCount={wishlistCount}
      isLoggedIn={isLoggedIn}
      customPages={customPages.length > 0 ? customPages : undefined}
      storeContent={storeContent}
      theme={store.theme}
    >
      <div className="bg-yellow-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full shadow-xl mb-6">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-3 tracking-wide">
              Your Jewelry Collection
            </h1>
            <p className="text-gray-600 font-light text-lg max-w-xl mx-auto leading-relaxed mb-6">
              Review and perfect your selection of luxury pieces
            </p>
            

          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {dynamicCartItems.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-yellow-200/50 overflow-hidden">
                  <div className="p-6 border-b border-yellow-200/50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-serif text-gray-800 tracking-wide">Selected Items</h2>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                        {dynamicCartItems.length} item{dynamicCartItems.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-yellow-200/30">
                    {dynamicCartItems.map((item, index) => (
                      <div key={item.id} className="p-6 hover:bg-yellow-50/50 transition-colors group">
                        <div className="flex items-start space-x-6">
                          <div className="relative">
                            <div className="w-32 h-40 bg-yellow-50 overflow-hidden rounded-2xl border-2 border-yellow-200/60 shadow-md group-hover:shadow-lg transition-shadow">
                              <img
                                src={getImageUrl(item.cover_image) || '/placeholder.jpg'}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/200x250/f5f5dc/d4af37?text=${encodeURIComponent(item.name)}`;
                                }}
                              />
                            </div>

                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-serif text-xl text-gray-800 mb-1 group-hover:text-yellow-700 transition-colors">{item.name}</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">{item.category?.name || 'Jewelry'}</p>
                              </div>
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                title="Remove item"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-3 mb-4">
                              {item.sale_price ? (
                                <>
                                  <span className="text-2xl font-bold text-gray-800">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                                  <span className="text-lg text-gray-500 line-through">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">SALE</span>
                                </>
                              ) : (
                                <span className="text-2xl font-bold text-gray-800">{formatCurrency(item.price, storeSettings, currencies)}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center bg-white border-2 border-yellow-200 rounded-xl shadow-sm">
                                  <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                    className="px-4 py-2 hover:bg-yellow-50 transition-colors rounded-l-xl"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-6 py-2 font-semibold text-gray-800 bg-yellow-50">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                    className="px-4 py-2 hover:bg-yellow-50 transition-colors rounded-r-xl"
                                    disabled={item.quantity >= item.stock}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Stock: {item.stock}</span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800">
                                  {formatCurrency((item.sale_price || item.price) * item.quantity, storeSettings, currencies)}
                                </div>
                                <div className="text-sm text-gray-500">Item Total</div>
                              </div>
                            </div>
                            

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="xl:col-span-1">
                <div className="space-y-6">
                  
                  {/* Order Summary */}
                  <div className="bg-yellow-600 text-white rounded-2xl shadow-2xl overflow-hidden sticky top-6">
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                          <Star className="w-6 h-6 text-yellow-200" />
                        </div>
                        <h2 className="text-xl font-serif tracking-wide">Order Summary</h2>
                        <p className="text-yellow-200 text-sm mt-1">{dynamicCartItems.length} luxury item{dynamicCartItems.length !== 1 ? 's' : ''}</p>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4 mb-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-yellow-100">
                            <span>Subtotal</span>
                            <span className="font-semibold">{formatCurrency(dynamicSummary.subtotal, storeSettings, currencies)}</span>
                          </div>
                          
                          {dynamicSummary.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-200">
                              <span>Special Discount</span>
                              <span className="font-semibold">-{formatCurrency(dynamicSummary.discount, storeSettings, currencies)}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-sm text-yellow-100">
                            <span>Shipping</span>
                            <span className="font-semibold">
                              {dynamicSummary.shipping === 0 ? 'Free' : formatCurrency(dynamicSummary.shipping, storeSettings, currencies)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-sm text-yellow-100">
                            <span>Tax</span>
                            <span className="font-semibold">{formatCurrency(dynamicSummary.tax, storeSettings, currencies)}</span>
                          </div>
                          
                          <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-yellow-400">
                            <span>Total</span>
                            <span>{formatCurrency(dynamicSummary.total, storeSettings, currencies)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Link
                          href={route('store.checkout', store.slug)}
                          className="w-full bg-white text-yellow-600 px-6 py-4 rounded-xl font-bold hover:bg-yellow-50 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <ArrowRight className="w-5 h-5 mr-2" />
                          Secure Checkout
                        </Link>
                        
                        <Link
                          href={route('store.products', store.slug)}
                          className="w-full bg-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                        >
                          <Gem className="w-5 h-5 mr-2" />
                          Continue Shopping
                        </Link>
                      </div>
                    </div>
                  </div>
                  

                  
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-yellow-200/50 p-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-8 shadow-lg">
                    <ShoppingBag className="w-12 h-12 text-yellow-600" />
                  </div>
                  <h2 className="text-3xl font-serif text-gray-800 mb-4 tracking-wide">
                    Your Cart Awaits
                  </h2>
                  <p className="text-gray-600 font-light mb-8 leading-relaxed text-lg">
                    Discover our exquisite jewelry collections and curate your perfect selection of luxury pieces
                  </p>
                  
                  <div className="space-y-4">
                    <Link
                      href={route('store.products', store.slug)}
                      className="inline-flex items-center bg-yellow-600 text-white px-8 py-4 font-semibold hover:bg-yellow-700 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Gem className="w-5 h-5 mr-2" />
                      Explore Our Collections
                    </Link>
                    

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}

const JewelryCart = (props: JewelryCartProps) => {
  return (
    <>
      <Head title={`Shopping Cart - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <JewelryCartContent {...props} />
      </CartProvider>
    </>
  );
};

export default JewelryCart;