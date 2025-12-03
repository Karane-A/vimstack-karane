import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AddToCartButton from '@/components/store/AddToCartButton';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface PerfumeProductCardProps {
  product: any;
  storeSettings?: any;
  currencies?: any[];
}

export default function PerfumeProductCard({ product, storeSettings, currencies }: PerfumeProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'perfume-demo';
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();
  
  const isProductInWishlist = isInWishlist(product.id);
  const isOutOfStock = !product.is_active || product.stock <= 0;
  
  // Check if product has variants
  const hasVariants = product.variants && 
    ((Array.isArray(product.variants) && product.variants.length > 0) ||
     (typeof product.variants === 'string' && product.variants.trim() !== '' && product.variants !== '[]'));

  const productImage = product.cover_image || product.image;
  const fallbackImage = `https://placehold.co/300x400/fafaf9/7c3aed?text=${encodeURIComponent(product.name)}`;

  const discountPercentage = product.sale_price && product.price ? 
    Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-100 hover:border-purple-300 transform hover:-translate-y-2">
      
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link href={route('store.product', { storeSlug, id: product.id })}>
          <img
            src={imageError ? fallbackImage : getImageUrl(productImage)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImageError(true)}
          />
        </Link>
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-amber-400 text-white px-3 py-1 text-xs font-medium rounded-full">
              New
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-full">
              -{discountPercentage}%
            </span>
          )}
          {product.variants && product.variants.length > 0 && (
            <span className="bg-purple-800 text-white px-3 py-1 text-xs font-medium rounded-full">
              Variants
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await toggleWishlist(product.id);
          }}
          disabled={wishlistLoading}
          className={`absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-300 ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <svg 
            className={`w-5 h-5 transition-colors duration-300 ${isProductInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
            fill={isProductInWishlist ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick View Button */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <Link
            href={route('store.product', { storeSlug, id: product.id })}
            className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-sm text-purple-800 rounded-full text-sm font-medium hover:bg-white transition-colors duration-300 shadow-lg"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Quick View
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Brand */}
        {product.brand && (
          <p className="text-purple-600 text-sm font-medium mb-2 uppercase tracking-wide">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <Link href={route('store.product', { storeSlug, id: product.id })}>
          <h3 className="text-lg font-medium text-gray-900 mb-3 hover:text-purple-800 transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {(product.total_reviews > 0 || product.reviews_count > 0) && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                const rating = product.average_rating || product.rating || 0;
                return (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(Number(rating)) ? 'text-amber-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
            </div>
            <span className="text-gray-500 text-sm ml-2">({product.total_reviews || product.reviews_count || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.sale_price && product.sale_price < product.price ? (
              <>
                <span className="text-xl font-semibold text-purple-800">
                  {formatCurrency(product.sale_price, storeSettings, currencies)}
                </span>
                <span className="text-gray-500 line-through text-sm">
                  {formatCurrency(product.price, storeSettings, currencies)}
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold text-purple-800">
                {formatCurrency(product.price, storeSettings, currencies)}
              </span>
            )}
          </div>
          
          {/* Size/Volume Info */}
          {product.volume && (
            <span className="text-gray-500 text-sm">
              {product.volume}ml
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="space-y-3">
          {hasVariants ? (
            <Link
              href={route('store.product', { storeSlug, id: product.id })}
              className="w-full bg-purple-100 text-purple-800 py-3 rounded-full font-medium hover:bg-purple-200 transition-colors duration-300 text-center block"
            >
              Select Options
            </Link>
          ) : (
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isOutOfStock) return;
                await addToCart(product);
              }}
              disabled={cartLoading || isOutOfStock}
              className={`w-full py-3 rounded-full font-medium transition-colors duration-300 ${
                isOutOfStock 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-800 text-white hover:bg-purple-900'
              } ${cartLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isOutOfStock ? 'Out of Stock' : cartLoading ? 'Adding...' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}