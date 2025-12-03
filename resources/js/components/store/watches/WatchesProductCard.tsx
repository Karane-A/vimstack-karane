import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/currency-formatter';
import { getImageUrl } from '@/utils/image-helper';
import AddToCartButton from '@/components/store/AddToCartButton';
import { useWishlist } from '@/contexts/WishlistContext';
import { usePage, router } from '@inertiajs/react';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image?: string;
  image?: string;
  slug: string;
  stock: number;
  is_active: boolean;
  variants?: any;
  category?: {
    name: string;
  };
  href?: string;
}

interface WatchesProductCardProps {
  product: Product;
  storeSlug: string;
  storeSettings?: any;
  currencies?: any[];
  showDeleteIcon?: boolean;
}

export default function WatchesProductCard({ product, storeSlug, storeSettings = {}, currencies = [], showDeleteIcon = false }: WatchesProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { props } = usePage();
  const finalStoreSlug = storeSlug || props.store?.slug;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0;
  const isOutOfStock = !product.is_active || product.stock <= 0;
  const isInStock = product.stock > 0 && product.is_active;
  const hasVariants = product.variants && 
    ((Array.isArray(product.variants) && product.variants.length > 0) ||
     (typeof product.variants === 'string' && product.variants.trim() !== '' && product.variants !== '[]'));
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const isProductInWishlist = isInWishlist(product.id);

  return (
    <div 
      className="group relative bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={getImageUrl(product.cover_image) || `https://placehold.co/400x400/f8fafc/64748b?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f8fafc/64748b?text=${encodeURIComponent(product.name)}`;
          }}
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-amber-500 text-slate-900 px-3 py-1 text-xs font-medium tracking-wider uppercase">
            -{discountPercentage}% OFF
          </div>
        )}

        {/* Stock Status */}
        {!isInStock && (
          <div className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
            Out of Stock
          </div>
        )}

        {/* Variant Badge */}
        {hasVariants && (
          <div className="absolute bottom-4 left-4 bg-slate-700 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
            In Variant
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {showDeleteIcon && isProductInWishlist ? (
            <button 
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await toggleWishlist(product.id);

              }}
              disabled={wishlistLoading}
              className={`w-10 h-10 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              title="Remove from wishlist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await toggleWishlist(product.id);
              }}
              disabled={wishlistLoading}
              className={`w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <svg className={`w-4 h-4 transition-colors ${isProductInWishlist ? 'text-red-500 fill-red-500' : 'text-slate-700'}`} fill={isProductInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.visit(route('store.product', { storeSlug: finalStoreSlug, id: product.id }));
            }}
            className="w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Eye className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category */}
        {product.category && (
          <p className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-2">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-light text-slate-900 mb-3 leading-tight">
          <button
            onClick={(e) => {
              e.preventDefault();
              router.visit(route('store.product', { storeSlug: finalStoreSlug, id: product.id }));
            }}
            className="hover:text-amber-600 transition-colors duration-300 text-left"
          >
            {product.name}
          </button>
        </h3>

        {/* Price and Reviews */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-xl font-light text-slate-900">
                  {formatCurrency(product.sale_price!, storeSettings, currencies)}
                </span>
                <span className="text-sm text-slate-500 line-through font-light">
                  {formatCurrency(product.price, storeSettings, currencies)}
                </span>
              </>
            ) : (
              <span className="text-xl font-light text-slate-900">
                {formatCurrency(product.price, storeSettings, currencies)}
              </span>
            )}
          </div>
          
          {/* Reviews */}
          {(product.total_reviews > 0 || product.reviews_count > 0) && (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => {
                const rating = product.average_rating || product.rating || 0;
                return (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(Number(rating)) ? 'text-amber-500' : 'text-slate-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
              <span className="text-xs text-slate-500 ml-2">({product.total_reviews || product.reviews_count || 0})</span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          product={product}
          storeSlug={storeSlug}
          className="w-full py-3 bg-slate-900 text-white font-medium tracking-wider uppercase text-sm hover:bg-slate-800 transition-colors duration-300 disabled:bg-slate-400"
          disabled={!isInStock}
          isShowOption={hasVariants}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}