import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';
import BabyKidsProductCard from '@/components/store/baby-kids/BabyKidsProductCard';

interface Product {
  id: number;
  product_id?: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image: string;
  stock: number;
  is_active: boolean;
  variants?: Array<{
    name: string;
    values: string[];
  }>;
  category: {
    id: number;
    name: string;
  };
}

interface BabyKidsWishlistProps {
  store: any;
  storeContent?: any;
  wishlistItems?: Product[];
  relatedProducts?: Product[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function BabyKidsWishlistContent({
  store = {},
  storeContent,
  wishlistItems = [],
  relatedProducts = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BabyKidsWishlistProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'baby-kids';
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  function WishlistInner() {
    const { items, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = async (item: any) => {
      if (item.variants && Array.isArray(item.variants) && item.variants.length > 0) {
        window.location.href = route('store.product', { storeSlug, id: item.product_id || item.id });
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

    const handleRemoveFromWishlist = async (product: any) => {
      await removeFromWishlist(product.product_id || product.id);
    };

    return (
      <>
        {/* Hero Section */}
        <div className="bg-pink-50 py-16 relative overflow-hidden">
          {/* Playful Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">My Wishlist</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600">
                Your favorite items for your little ones
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6 lg:px-12">
            {items.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'} in Your Wishlist
                  </h2>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {items.map((item) => (
                    <div key={item.id} className="group relative">
                      {/* Toy Block Style Card */}
                      <div className="absolute top-4 left-4 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                      <div className="relative bg-white rounded-3xl shadow-xl border-4 border-pink-400 overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className="flex flex-col md:flex-row">
                          {/* Product Image */}
                          <div className="relative w-full md:w-48 h-48 overflow-hidden">
                            <a href={route('store.product', { storeSlug, id: item.product_id || item.id })}>
                              <img
                                src={getImageUrl(item.cover_image)}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://placehold.co/400x300/fef7f7/ec4899?text=${encodeURIComponent(item.name)}`;
                                }}
                              />
                            </a>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveFromWishlist(item)}
                              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>

                            {/* Discount Badge */}
                            {item.sale_price && (
                              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {Math.round(((item.price - item.sale_price) / item.price) * 100)}% OFF
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
                            <a href={route('store.product', { storeSlug, id: item.product_id || item.id })}>
                              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                                {item.name}
                              </h3>
                            </a>

                            {/* Stock Status */}
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

                            {/* Price and Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-pink-200">
                              <div className="flex items-center space-x-2">
                                {item.sale_price ? (
                                  <>
                                    <span className="text-xl font-bold text-red-500">
                                      {formatCurrency(item.sale_price, storeSettings, currencies)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatCurrency(item.price, storeSettings, currencies)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xl font-bold text-gray-800">
                                    {formatCurrency(item.price, storeSettings, currencies)}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleAddToCart(item)}
                                disabled={item.stock <= 0}
                                className="bg-pink-500 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-600 transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                <span>{item.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="relative inline-block">
                  <div className="absolute top-3 left-3 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                  <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 p-12">
                    <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h3>
                    <p className="text-gray-600 mb-6">
                      Start adding items you love for your little ones!
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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="bg-pink-50 py-16">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">You Might Also Love</h2>
                <p className="text-gray-600 text-lg">Discover more amazing products for your little ones</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((product) => (
                  <BabyKidsProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      sale_price: product.sale_price,
                      image: product.cover_image,
                      slug: product.slug || '',
                      variants: product.variants,
                      is_featured: false
                    }}
                    storeSettings={storeSettings}
                    currencies={currencies}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Continue Shopping */}
        {items.length > 0 && (
          <div className="bg-white py-12">
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
      </>
    );
  }
  
  return (
    <StoreLayout
      storeName={store.name}
      logo={store.logo}
      isLoggedIn={isLoggedIn}
      customPages={customPages}
      storeContent={storeContent}
      storeId={store.id}
      theme={store.theme}
    >
      <WishlistInner />
    </StoreLayout>
  );
}

export default function BabyKidsWishlist(props: BabyKidsWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <BabyKidsWishlistContent {...props} />
    </>
  );
}