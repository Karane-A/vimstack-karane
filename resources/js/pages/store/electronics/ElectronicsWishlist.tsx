import React from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { ElectronicsFooter } from '@/components/store/electronics';
import { Heart, ShoppingCart, X, Star } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    sale_price?: number;
    cover_image?: string;
    slug: string;
    stock: number;
    is_active: boolean;
    average_rating?: number;
  };
}

interface ElectronicsWishlistProps {
  store: any;
  storeContent?: any;
  wishlistItems: WishlistItem[];
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

function ElectronicsWishlistContent({ 
  store, 
  storeContent,
  wishlistItems, 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: ElectronicsWishlistProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();
  
  const handleRemoveFromWishlist = async (item: any) => {
    await removeFromWishlist(item.product_id || item.id);
  };
  
  const handleAddToCart = async (item: any) => {
    const product = item.product || item;
    if (product?.variants && ((Array.isArray(product.variants) && product.variants.length > 0) || 
        (typeof product.variants === 'string' && product.variants.trim() !== '' && product.variants !== '[]'))) {
      router.visit(route('store.product', { storeSlug: store.slug, id: product.id }));
      return;
    }
    
    const productData = {
      id: product?.id,
      name: product?.name,
      price: product?.price,
      sale_price: product?.sale_price,
      cover_image: product?.cover_image
    };
    await addToCart(productData);
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
        <div className="bg-gray-50 min-h-screen">
          {/* Page Header */}
          <section className="bg-slate-900 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold mb-6">My Wishlist</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Keep track of your favorite electronics and gadgets
              </p>
            </div>
          </section>

          {/* Wishlist Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {items.length > 0 ? (
                <>
                  {/* Wishlist Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {items.length} Item{items.length !== 1 ? 's' : ''} in Wishlist
                    </h2>
                  </div>

                  {/* Wishlist Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => {
                      const product = item.product || item; // Handle both nested and flat structure
                      const hasDiscount = product?.sale_price && product.sale_price < product.price;
                      const isInStock = product?.stock > 0 && product?.is_active;

                      return (
                        <div
                          key={item.id}
                          className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        >
                          {/* Product Image */}
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={getImageUrl(product.cover_image) || 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop&crop=center'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop&crop=center';
                              }}
                            />
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveFromWishlist(item)}
                              disabled={loading}
                              className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:text-red-600 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                              <X className="w-5 h-5" />
                            </button>

                            {/* Discount Badge */}
                            {hasDiscount && (
                              <div className="absolute top-4 left-4">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                  -{Math.round(((product.price - product.sale_price!) / product.price) * 100)}% OFF
                                </span>
                              </div>
                            )}

                            {/* Stock Status */}
                            {!isInStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-6">
                            {/* Rating */}
                            {product.average_rating && (
                              <div className="flex items-center mb-3">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${star <= product.average_rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">
                                  ({product.average_rating.toFixed(1)})
                                </span>
                              </div>
                            )}

                            {/* Product Name */}
                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                              <a 
                                href={route('store.product', { storeSlug: store.slug, id: product.id })}
                                className="hover:text-blue-600 transition-colors duration-300"
                              >
                                {product.name}
                              </a>
                            </h3>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-4">
                              {hasDiscount ? (
                                <>
                                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(product?.sale_price!, storeSettings, currencies)}</span>
                                  <span className="text-lg text-gray-500 line-through">{formatCurrency(product?.price, storeSettings, currencies)}</span>
                                </>
                              ) : (
                                <span className="text-2xl font-bold text-gray-900">{formatCurrency(product?.price, storeSettings, currencies)}</span>
                              )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={cartLoading || !isInStock}
                              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${cartLoading || !isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>{!isInStock ? 'Out of Stock' : cartLoading ? 'Adding...' : 'Add to Cart'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Empty Wishlist */
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Heart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start adding your favorite electronics and gadgets to keep track of items you love
                  </p>
                  <Link
                    href={route('store.products', store.slug)}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span>Continue Shopping</span>
                    <ShoppingCart className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </StoreLayout>
  );
}

export default function ElectronicsWishlist(props: ElectronicsWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WishlistProvider>
          <ElectronicsWishlistContent {...props} />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}