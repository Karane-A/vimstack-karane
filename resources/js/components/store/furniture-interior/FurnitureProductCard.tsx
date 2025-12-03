import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useStoreCurrency } from '@/hooks/use-store-currency';

interface FurnitureProductCardProps {
  product: any;
  storeSettings?: any;
  currencies?: any[];
}

const FurnitureProductCard: React.FC<FurnitureProductCardProps> = ({ product, storeSettings, currencies }) => {
  const [imageError, setImageError] = useState(false);
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'furniture-demo';
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();
  const storeCurrency = useStoreCurrency();
  
  const isProductInWishlist = isInWishlist(product.id);
  const isOutOfStock = !product.is_active || product.stock <= 0;
  
  // Check if product has variants
  const hasVariants = product.variants && 
    ((Array.isArray(product.variants) && product.variants.length > 0) ||
     (typeof product.variants === 'string' && product.variants.trim() !== '' && product.variants !== '[]'));

  const formatPrice = (price: number) => {
    const numPrice = Number(price) || 0;
    return `${storeCurrency.symbol}${numPrice.toFixed(storeCurrency.decimals)}`;
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return `/storage/products/furniture-placeholder.jpg`;
    }
    return getImageUrl(product.cover_image) || `/storage/products/furniture-placeholder.jpg`;
  };

  return (
    <div className="group bg-white rounded-3xl shadow-lg shadow-amber-200/30 hover:shadow-2xl hover:shadow-amber-300/40 transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-200 transform hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-amber-50">
        <img
          src={getImageSrc()}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={handleImageError}
        />
        
        {/* Wooden Frame Effect */}
        <div className="absolute inset-0 border-4 border-amber-800/20 rounded-lg m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Link
            href={route('store.product', { storeSlug, id: product.id })}
            className="w-10 h-10 rounded-xl bg-white/95 text-amber-700 hover:bg-amber-50 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
          
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              isProductInWishlist 
                ? 'bg-amber-600 text-white scale-110' 
                : 'bg-white/95 text-amber-700 hover:bg-amber-50 hover:scale-110'
            } ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <svg className="w-5 h-5" fill={isProductInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_featured && (
            <span className="bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded-lg shadow-md">
              ⭐ Featured
            </span>
          )}
          {product.variants && product.variants.length > 0 && (
            <span className="bg-amber-800 text-amber-100 px-2 py-1 text-xs font-bold rounded-lg shadow-md">
              In Variant
            </span>
          )}
          {product.discount_percentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-lg shadow-md">
              -{product.discount_percentage}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 bg-white">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between mb-2">
          {product.category && (
            <span className="text-amber-700 text-xs font-bold uppercase tracking-wider bg-amber-100 px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          )}
          
          {(product.total_reviews > 0 || product.reviews_count > 0) && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => {
                  const rating = product.average_rating || product.rating || 0;
                  return (
                    <svg key={i} className={`w-3 h-3 ${i < Math.floor(Number(rating)) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  );
                })}
              </div>
              <span className="text-xs text-slate-600 ml-1">({product.total_reviews || product.reviews_count || 0})</span>
            </div>
          )}
        </div>
        
        {/* Product Name */}
        <Link
          href={route('store.product', { storeSlug, id: product.id })}
          className="block group-hover:text-amber-800 transition-colors duration-300"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Description */}
        {product.description && (
          <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {product.sale_price && product.sale_price < product.price ? (
            <>
              <span className="text-2xl font-bold text-amber-800">
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-slate-400 line-through text-sm">
                {formatPrice(product.price)}
              </span>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full ml-auto">
                Save {formatPrice(product.price - product.sale_price)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-amber-800">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isOutOfStock) return;
            if (hasVariants) {
              router.visit(route('store.product', { storeSlug, id: product.id }));
              return;
            }
            await addToCart(product);
          }}
          disabled={cartLoading || isOutOfStock}
          className={`w-full bg-amber-700 text-white py-3 px-4 rounded-2xl font-bold hover:bg-amber-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${cartLoading || isOutOfStock ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default FurnitureProductCard;