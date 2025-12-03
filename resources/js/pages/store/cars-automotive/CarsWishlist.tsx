import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { CarsFooter, CarsProductCard } from '@/components/store/cars-automotive';
import { Heart, ShoppingCart, Trash2, Wrench, Car } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

import { formatCurrency } from '@/utils/currency-formatter';

interface CarsWishlistProps {
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

function CarsWishlistContent({
  store = {},
  storeContent,
  wishlistItems = [],
  relatedProducts = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: CarsWishlistProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  


  return (
    <StoreLayout
      storeName={store.name}
      logo={store.logo}
      isLoggedIn={isLoggedIn}
      customPages={customPages.length > 0 ? customPages : undefined}
      storeContent={storeContent}
      storeId={store.id}
      theme={store.theme}
    >
      <CarsWishlistInner />
    </StoreLayout>
  );
}

function CarsWishlistInner() {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  const store = props.store || {};
  const relatedProducts = props.relatedProducts || [];
  
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
      {/* Header */}
      <div className="bg-black text-white py-20 border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                <div className="w-6 h-6 bg-white transform -rotate-45"></div>
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-wider">GARAGE WISHLIST</h1>
                <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Performance Parts Collection</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600"></div>
              <div className="w-3 h-3 bg-red-600"></div>
              <div className="w-3 h-3 bg-red-600"></div>
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Your curated collection of premium automotive parts and performance accessories
          </p>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {items.length > 0 ? (
            <>
              {/* Stats Bar */}
              <div className="bg-black text-white p-6 border-l-4 border-red-600 mb-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-black text-red-600">{items.length}</div>
                      <div className="text-sm font-bold tracking-widest uppercase">Parts Selected</div>
                    </div>
                    <div className="w-px h-12 bg-gray-600"></div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-red-600">{items.filter(item => item.stock > 0).length}</div>
                      <div className="text-sm font-bold tracking-widest uppercase">In Stock</div>
                    </div>
                  </div>
                  <div className="flex items-center text-red-400">
                    <Wrench className="h-5 w-5 mr-2" />
                    <span className="font-bold tracking-wider uppercase">Ready for Installation</span>
                  </div>
                </div>
              </div>

              {/* Premium Wishlist Grid */}
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-white border-l-8 border-red-600 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                      {/* Product Image */}
                      <div className="relative h-48 lg:h-32 bg-black overflow-hidden">
                        <img
                          src={getImageUrl(item.cover_image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/600x400/000000/ffffff?text=${encodeURIComponent(item.name)}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-black tracking-wider">
                          #{String(index + 1).padStart(2, '0')}
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="lg:col-span-2 p-6 flex flex-col justify-center">
                        <div className="flex items-center mb-2">
                          <span className="bg-black text-white px-3 py-1 text-xs font-bold tracking-widest uppercase mr-3">
                            {item.category.name}
                          </span>
                          <div className={`w-3 h-3 rounded-full ${item.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`ml-2 text-xs font-bold tracking-wider uppercase ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.stock > 0 ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-black text-black mb-3 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center space-x-4">
                          {item.sale_price ? (
                            <>
                              <span className="text-2xl font-black text-red-600">
                                {formatCurrency(item.sale_price, storeSettings, currencies)}
                              </span>
                              <span className="text-lg text-gray-400 line-through">
                                {formatCurrency(item.price, storeSettings, currencies)}
                              </span>
                              <span className="bg-red-600 text-white px-2 py-1 text-xs font-black tracking-wider">
                                SAVE {Math.round(((item.price - item.sale_price) / item.price) * 100)}%
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-black text-black">
                              {formatCurrency(item.price, storeSettings, currencies)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="p-6 flex flex-col justify-center space-y-3">
                        <button 
                          onClick={() => handleAddToCart(item)}
                          disabled={cartLoading || item.stock <= 0}
                          className={`flex items-center justify-center space-x-2 py-3 px-4 font-black text-sm uppercase tracking-widest transition-all ${
                            item.stock <= 0 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-red-600 hover:bg-black text-white hover:shadow-lg transform hover:-translate-y-1'
                          } ${cartLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>{item.stock <= 0 ? 'UNAVAILABLE' : 'ADD TO CART'}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleRemoveFromWishlist(item)}
                          disabled={loading}
                          className={`flex items-center justify-center space-x-2 border-2 border-gray-300 hover:border-red-600 text-gray-600 hover:text-red-600 py-3 px-4 font-bold text-sm uppercase tracking-widest transition-all ${loading ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Performance Indicator */}
                    <div className="bg-black text-white px-6 py-2 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold tracking-widest uppercase">Performance Grade</span>
                        </div>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 ${i < 4 ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase text-red-400">Professional Install Recommended</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white border-2 border-dashed border-gray-300 p-16 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Heart className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-4xl font-black text-black mb-6">EMPTY GARAGE</h2>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Your performance parts wishlist is empty. Start building your dream setup with premium automotive components.
                </p>
                <Link
                  href={route('store.products', store.slug)}
                  className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-10 py-4 font-bold text-sm uppercase tracking-widest transition-colors"
                >
                  <Car className="h-5 w-5" />
                  <span>Browse Performance Parts</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">RECOMMENDED FOR YOU</h2>
              <p className="text-gray-600">Premium parts selected by our automotive experts</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((product) => (
                <CarsProductCard
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
    </>
  );
}

export default function CarsWishlist(props: CarsWishlistProps) {
  return (
    <>
      <Head title={`Wishlist - ${props.store.name}`} />
      <CarsWishlistContent {...props} />
    </>
  );
}