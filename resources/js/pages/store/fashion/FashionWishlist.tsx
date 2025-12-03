import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { FashionFooter, FashionProductCard } from '@/components/store/fashion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface FashionWishlistProps {
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

function FashionWishlistContent({
  store = {},
  storeContent,
  wishlistItems = [],
  relatedProducts = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: FashionWishlistProps) {
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
              <h1 className="text-5xl font-thin tracking-wide mb-6">Your Wishlist</h1>
              <p className="text-white/70 font-light text-lg">
                Curated pieces for your perfect style
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                      <img
                        src={getImageUrl(item.cover_image)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/600x800/f5f5f5/666666?text=${encodeURIComponent(item.name)}`;
                        }}
                      />
                      <button 
                        onClick={() => handleRemoveFromWishlist(item)}
                        disabled={loading}
                        className={`absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-light text-lg text-gray-900 group-hover:text-black transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-light">{item.category.name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {item.sale_price ? (
                            <>
                              <span className="text-lg font-light text-black">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                              <span className="text-sm text-gray-500 line-through">{formatCurrency(item.price, storeSettings, currencies)}</span>
                            </>
                          ) : (
                            <span className="text-lg font-light text-black">{formatCurrency(item.price, storeSettings, currencies)}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => handleAddToCart(item)}
                          disabled={cartLoading || item.stock <= 0}
                          className={`flex items-center space-x-2 bg-black text-white px-4 py-2 text-sm font-light tracking-wide uppercase hover:bg-gray-800 transition-colors ${cartLoading || item.stock <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-thin text-gray-900 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-600 font-light mb-8">
                  Start adding items you love to create your perfect collection
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-block bg-black text-white px-8 py-3 font-light tracking-wide uppercase hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-thin text-center mb-12 tracking-wide">You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((product) => (
                  <FashionProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      sale_price: product.sale_price,
                      cover_image: product.cover_image,
                      slug: product.slug || '',
                      href: route('store.product', { storeSlug: store.slug, id: product.id }),
                      variants: product.variants,
                      stock: product.stock,
                      is_active: product.is_active
                    }}
                    storeSettings={storeSettings}
                    currencies={currencies}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </StoreLayout>
  );
}

export default function FashionWishlist(props: FashionWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WishlistProvider>
          <FashionWishlistContent {...props} />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}