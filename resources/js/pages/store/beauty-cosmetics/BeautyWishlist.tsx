import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { BeautyFooter, BeautyProductCard } from '@/components/store/beauty-cosmetics';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface BeautyWishlistProps {
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

function BeautyWishlistContent({
  store = {},
  storeContent,
  wishlistItems = [],
  relatedProducts = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BeautyWishlistProps) {
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
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6">
              Beauty Wishlist
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your curated collection of beauty essentials
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item) => (
                <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
                    <img
                      src={getImageUrl(item.cover_image)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop&crop=center`;
                      }}
                    />
                    <button 
                      onClick={() => handleRemoveFromWishlist(item)}
                      disabled={loading}
                      className={`absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-lg ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-rose-600 bg-rose-100 px-2 py-1 rounded-full inline-block">
                        {item.category.name}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.sale_price ? (
                          <>
                            <span className="text-xl font-bold text-rose-600">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                            <span className="text-sm text-gray-400 line-through">{formatCurrency(item.price, storeSettings, currencies)}</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-rose-600">{formatCurrency(item.price, storeSettings, currencies)}</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleAddToCart(item)}
                        disabled={cartLoading || item.stock <= 0}
                        className={`flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-rose-700 transition-colors ${cartLoading || item.stock <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="h-12 w-12 text-rose-400" />
              </div>
              <h2 className="text-3xl font-light text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Discover beautiful products and add them to your wishlist
              </p>
              <Link
                href={route('store.products', store.slug)}
                className="inline-flex items-center px-8 py-4 bg-rose-600 text-white font-semibold rounded-full shadow-lg hover:bg-rose-700 hover:shadow-xl transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-light text-center mb-16 text-gray-900">You Might Also Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.slice(0, 4).map((product) => (
                <BeautyProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    sale_price: product.sale_price,
                    cover_image: product.cover_image,
                    slug: product.slug || '',
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
    </StoreLayout>
  );
}

export default function BeautyWishlist(props: BeautyWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WishlistProvider>
          <BeautyWishlistContent {...props} />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}