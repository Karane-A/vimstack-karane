import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import WatchesProductCard from '@/components/store/watches/WatchesProductCard';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface WatchesWishlistProps {
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

function WatchesWishlistContent({
  store = {},
  storeContent,
  wishlistItems = [],
  relatedProducts = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WatchesWishlistProps) {
  
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
        <section className="relative h-96 flex items-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="mb-6">
                  <span className="bg-amber-500 text-slate-900 px-6 py-2 text-sm font-medium tracking-wider uppercase">
                    Collection
                  </span>
                </div>
                <h1 className="text-6xl font-light text-white mb-6 leading-none tracking-tight">
                  Your Wishlist
                </h1>
                <p className="text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                  Curated timepieces that caught your discerning eye
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 left-12 w-px h-24 bg-amber-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500 rounded-full"></div>
        </section>

        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((item) => (
                  <div key={item.id} className="relative group">
                    <WatchesProductCard
                      product={{
                        id: item.product_id || item.id,
                        name: item.name,
                        price: item.price,
                        sale_price: item.sale_price,
                        cover_image: item.cover_image,
                        slug: item.slug || '',
                        variants: item.variants,
                        stock: item.stock,
                        is_active: item.is_active,
                        category: item.category
                      }}
                      storeSlug={store.slug}
                      storeSettings={storeSettings}
                      currencies={currencies}
                    />

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Heart className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                <h2 className="text-2xl font-light text-slate-900 mb-4">Your wishlist is empty</h2>
                <p className="text-slate-600 font-light mb-8">
                  Start adding exceptional timepieces you love to create your perfect collection
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-flex items-center bg-slate-900 text-white px-8 py-3 font-medium tracking-wider uppercase hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Explore Collection
                </Link>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="bg-slate-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-light text-center mb-12 tracking-wide text-slate-900">You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((product) => (
                  <WatchesProductCard
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
                    storeSlug={store.slug}
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
      storeId={store.id}
      wishlistCount={wishlistCount}
      isLoggedIn={isLoggedIn}
      customPages={customPages.length > 0 ? customPages : undefined}
      storeContent={storeContent}
      theme={store.theme}
    >
      <WishlistInner />
    </StoreLayout>
  );
}

export default function WatchesWishlist(props: WatchesWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WishlistProvider>
          <WatchesWishlistContent {...props} />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}