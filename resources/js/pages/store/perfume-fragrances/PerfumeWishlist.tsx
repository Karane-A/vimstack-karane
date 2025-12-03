import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { PerfumeFooter } from '@/components/store/perfume-fragrances';
import PerfumeProductCard from '@/components/store/perfume-fragrances/PerfumeProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface PerfumeWishlistProps {
  store: any;
  wishlistItems?: any[];
  relatedProducts?: any[];
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function PerfumeWishlistContent({
  store = {},
  wishlistItems = [],
  relatedProducts = [],
  storeContent = {},
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: PerfumeWishlistProps) {
  
  function WishlistInner() {
    const { props } = usePage();
    const storeSettings = props.storeSettings || {};
    const currencies = props.currencies || [];
    
    const { items, removeFromWishlist, loading } = useWishlist();
    const { addToCart, loading: cartLoading } = useCart();
    
    const handleRemoveFromWishlist = async (item: any) => {
      await removeFromWishlist(item.product_id || item.id);
    };
    
    const handleAddToCart = async (item: any) => {
      if (item.variants && Array.isArray(item.variants) && item.variants.length > 0) {
        window.location.href = route('store.product', { storeSlug: store.slug, id: item.product_id || item.id });
        return;
      }
      
      const product = {
        id: item.product_id || item.id,
        name: item.name,
        price: item.price,
        sale_price: item.sale_price,
        cover_image: item.cover_image
      };
      await addToCart(product, {});
    };

    return (
      <>
        {/* Hero Section */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                Your Fragrance Wishlist
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Curated scents that captured your heart
              </p>
            </div>
          </div>
        </section>

        {/* Wishlist Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {items.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-2xl font-light text-gray-900">
                    {items.length} Saved {items.length === 1 ? 'Fragrance' : 'Fragrances'}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => {
                        items.forEach(item => removeFromWishlist(item.product_id || item.id));
                      }}
                      disabled={loading}
                      className={`text-purple-800 hover:text-purple-900 font-medium transition-colors duration-300 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      Clear All
                    </button>
                    <Link
                      href={route('store.products', store.slug)}
                      className="inline-flex items-center px-6 py-3 bg-purple-800 text-white rounded-full font-medium hover:bg-purple-900 transition-colors duration-300"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => handleRemoveFromWishlist(item)}
                        disabled={loading}
                        className={`absolute top-2 right-2 z-10 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={getImageUrl(item.cover_image || item.featured_image || item.image) || `https://placehold.co/250x250/fafaf9/7c3aed?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/250x250/fafaf9/7c3aed?text=${encodeURIComponent(item.name)}`;
                          }}
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 text-sm">{item.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                          {item.sale_price && item.sale_price < item.price ? (
                            <div className="flex items-center space-x-1">
                              <span className="text-purple-800 font-semibold text-sm">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                              <span className="text-gray-400 line-through text-xs">{formatCurrency(item.price, storeSettings, currencies)}</span>
                            </div>
                          ) : (
                            <span className="text-purple-800 font-semibold text-sm">{formatCurrency(item.price, storeSettings, currencies)}</span>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Link
                            href={route('store.product', { storeSlug: store.slug, id: item.product_id || item.id })}
                            className="flex-1 bg-purple-800 text-white py-2 rounded-lg text-xs font-medium hover:bg-purple-900 transition-colors duration-300 text-center"
                          >
                            View
                          </Link>
                          <button 
                            onClick={() => handleAddToCart(item)}
                            disabled={cartLoading || item.stock <= 0}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors duration-300 ${
                              item.stock <= 0 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            } ${cartLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                          >
                            {item.stock <= 0 ? 'Out of Stock' : 'Add Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Related Products Section - Show when wishlist has items */}
                {relatedProducts.length > 0 && (
                  <div className="mt-20">
                    <h2 className="text-3xl font-light text-purple-800 text-center mb-12">You Might Also Love</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {relatedProducts.slice(0, 4).map((product) => (
                        <PerfumeProductCard
                          key={product.id}
                          product={product}
                          storeSettings={storeSettings}
                          currencies={currencies}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-light text-gray-900 mb-4">Your Wishlist is Empty</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Discover our exquisite fragrance collection and save your favorites for later.
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-flex items-center px-8 py-4 bg-purple-800 text-white rounded-full font-medium hover:bg-purple-900 transition-colors duration-300"
                >
                  <span>Explore Fragrances</span>
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>
        
        {/* Related Products Section - Show when wishlist is empty */}
        {items.length === 0 && relatedProducts.length > 0 && (
          <section className="py-16 bg-stone-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-purple-800 mb-4">Discover Our Fragrances</h2>
                <p className="text-gray-600">Start building your wishlist with these premium scents</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((product) => (
                  <PerfumeProductCard
                    key={product.id}
                    product={product}
                    storeSettings={storeSettings}
                    currencies={currencies}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </>
    );
  }
  
  return (
    <StoreLayout
      storeName={store.name}
      logo={store.logo}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isLoggedIn={isLoggedIn}
      customPages={customPages}
      storeId={store.id}
      customFooter={<PerfumeFooter storeName={store.name} logo={store.logo} content={storeContent?.footer} />}
    >
      <WishlistInner />
    </StoreLayout>
  );
}

export default function PerfumeWishlist(props: PerfumeWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WishlistProvider>
          <PerfumeWishlistContent {...props} />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}