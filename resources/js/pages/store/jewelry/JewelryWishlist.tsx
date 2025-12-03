import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { JewelryFooter, JewelryProductCard } from '@/components/store/jewelry';
import { Heart, ShoppingCart, Trash2, Gem } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

interface JewelryWishlistProps {
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

function JewelryWishlistContent({
  store = {},
  storeContent,
  wishlistItems = [],
  relatedProducts = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: JewelryWishlistProps) {
  
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
        window.location.href = '#';
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
        {/* Luxury Header */}
        <div className="bg-yellow-50 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600 rounded-full shadow-lg mb-8">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">
                Your Wishlist
              </h1>
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto leading-relaxed">
                Curated luxury pieces for your perfect collection
              </p>
              
              {/* Elegant Divider */}
              <div className="flex items-center justify-center mt-8">
                <div className="w-16 h-px bg-yellow-300"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-4"></div>
                <div className="w-16 h-px bg-yellow-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((item) => (
                  <div key={item.id} className="relative group">
                    <JewelryProductCard
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
                      storeSettings={storeSettings}
                      currencies={currencies}
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item)}
                      disabled={loading}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-yellow-200/50 p-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-8">
                      <Heart className="w-10 h-10 text-yellow-600" />
                    </div>
                    <h2 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
                      Your Wishlist is Empty
                    </h2>
                    <p className="text-gray-600 font-light mb-8 leading-relaxed">
                      Start adding luxury jewelry pieces you love to create your perfect collection
                    </p>
                    
                    {/* Elegant Divider */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="w-16 h-px bg-yellow-300"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mx-4"></div>
                      <div className="w-16 h-px bg-yellow-300"></div>
                    </div>
                    
                    <Link
                      href={route('store.products', store.slug)}
                      className="inline-flex items-center bg-yellow-600 text-white px-8 py-4 font-medium hover:bg-yellow-700 transition-colors"
                    >
                      <Gem className="w-5 h-5 mr-2" />
                      Explore Collections
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-yellow-50 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif text-neutral-900 mb-4">
                  You Might Also Like
                </h2>
                <div className="w-24 h-1 bg-yellow-600 mx-auto mb-4"></div>
                <p className="text-neutral-600 max-w-2xl mx-auto">
                  Discover more exquisite pieces from our luxury collection
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((product) => (
                  <JewelryProductCard
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

export default function JewelryWishlist(props: JewelryWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <JewelryWishlistContent {...props} />
    </>
  );
}