import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';
import FurnitureProductCard from '@/components/store/furniture-interior/FurnitureProductCard';

interface FurnitureWishlistProps {
  store: any;
  storeContent?: any;
  wishlistItems: any[];
  relatedProducts: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function FurnitureWishlistContent({
  store = {},
  storeContent,
  wishlistItems = [],
  relatedProducts = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FurnitureWishlistProps) {
  
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
        <div className="bg-yellow-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
              <div className="w-16 h-0.5 bg-amber-200 mx-auto"></div>
            </div>
          </div>
        </div>

        <div className="bg-white py-20">
          <div className="container mx-auto px-6 lg:px-12">
            {items.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'} in Your Wishlist
                  </h2>
                  <div className="text-sm text-slate-600">
                    Save your favorites and shop them later
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="group bg-white rounded-2xl shadow-lg shadow-amber-200/20 hover:shadow-2xl hover:shadow-amber-300/30 transition-all duration-500 overflow-hidden border-2 border-amber-100 hover:border-amber-300">
                      <div className="flex flex-col lg:flex-row">
                        <div className="relative w-32 lg:w-40 aspect-square overflow-hidden bg-amber-50">
                          <img
                            src={item.cover_image ? getImageUrl(item.cover_image) : `/storage/products/furniture-${item.id || 'default'}.jpg`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5dc/8b7355?text=${encodeURIComponent(item.name)}`;
                            }}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 border-4 border-amber-800/15 rounded-lg m-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {item.sale_price && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-xl shadow-lg">
                              <span className="block text-xs">SAVE</span>
                              <span className="block text-lg leading-none">
                                {Math.round(((item.price - item.sale_price) / item.price) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                                {item.category.name}
                              </span>
                              <div className="flex gap-2">
                                <Link
                                  href={route('store.product', { storeSlug: store.slug, id: item.product_id || item.id })}
                                  className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-md"
                                >
                                  <Eye className="w-5 h-5" />
                                </Link>
                                <button 
                                  onClick={() => handleRemoveFromWishlist(item)}
                                  disabled={loading}
                                  className={`w-12 h-12 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-md ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-amber-800 transition-colors leading-tight">
                              {item.name}
                            </h3>
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
                            <div className="flex items-baseline gap-3">
                              {item.sale_price ? (
                                <>
                                  <span className="text-lg font-bold text-amber-800">
                                    {formatCurrency(item.sale_price, storeSettings, currencies)}
                                  </span>
                                  <span className="text-base text-slate-400 line-through">
                                    {formatCurrency(item.price, storeSettings, currencies)}
                                  </span>
                                  <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded-lg">
                                    Save {formatCurrency(item.price - item.sale_price, storeSettings, currencies)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-amber-800">
                                  {formatCurrency(item.price, storeSettings, currencies)}
                                </span>
                              )}
                            </div>
                            <button 
                              onClick={() => handleAddToCart(item)}
                              disabled={cartLoading || item.stock <= 0}
                              className={`inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold hover:bg-amber-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${cartLoading || item.stock <= 0 ? 'cursor-not-allowed opacity-50 transform-none' : ''}`}
                            >
                              <ShoppingCart className="w-5 h-5" />
                              <span>
                                {item.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Heart className="w-16 h-16 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Your wishlist is empty</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Start building your dream home by adding furniture pieces you love
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

        {relatedProducts.length > 0 && (
          <div className="bg-amber-50 py-20">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">You Might Also Love</h2>
                <p className="text-slate-600 text-lg">Discover more beautiful furniture pieces</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((product) => (
                  <FurnitureProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      sale_price: product.sale_price,
                      cover_image: product.cover_image,
                      image: product.image,
                      slug: product.slug || '',
                      href: route('store.product', { storeSlug: store.slug, id: product.id }),
                      variants: product.variants,
                      stock: product.stock,
                      is_active: product.is_active,
                      category: product.category
                    }}
                    storeSettings={storeSettings}
                    currencies={currencies}
                  />
                ))}
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
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isLoggedIn={isLoggedIn}
      customPages={customPages.length > 0 ? customPages : undefined}
      storeContent={storeContent}
      storeId={store.id}
      theme={store.theme || 'furniture-interior'}
    >
      <WishlistInner />
    </StoreLayout>
  );
}

export default function FurnitureWishlist(props: FurnitureWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WishlistProvider>
          <FurnitureWishlistContent {...props} />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}