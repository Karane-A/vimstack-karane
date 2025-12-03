import React, { useState } from 'react';
import { getImageUrl } from '@/utils/image-helper';
import { usePage, Link, router } from '@inertiajs/react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  cover_image?: string;
  image?: string;
  images?: string[];
  rating?: number;
  reviews_count?: number;
  variants?: any;
  category?: {
    name: string;
  };
}

interface BeautyProductCardProps {
  product: Product;
  storeSettings?: any;
  currencies?: any[];
}

export default function BeautyProductCard({ product, storeSettings, currencies }: BeautyProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'beauty-demo';
  const finalStoreSettings = storeSettings || props.storeSettings || {};
  const finalCurrencies = currencies || props.currencies || [];
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();
  
  const isProductInWishlist = isInWishlist(product.id);
  const isOutOfStock = !product.is_active || product.stock <= 0;

  const fallbackImage = `https://placehold.co/300x400/fdf2f8/ec4899?text=${encodeURIComponent(product.name)}`;

  const displayPrice = Number(product.sale_price || product.price);
  const hasDiscount = product.sale_price && Number(product.sale_price) < Number(product.price);
  const discountPercentage = hasDiscount ? Math.round(((Number(product.price) - Number(product.sale_price!)) / Number(product.price)) * 100) : 0;
  
  // Check if product has variants
  const hasVariants = product.variants && 
    ((Array.isArray(product.variants) && product.variants.length > 0) ||
     (typeof product.variants === 'string' && product.variants.trim() !== '' && product.variants !== '[]'));

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {hasDiscount && (
          <div className="bg-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
            -{discountPercentage}% OFF
          </div>
        )}
        {hasVariants && (
          <div className="bg-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
            Variants
          </div>
        )}
      </div>

      {/* Wishlist Heart */}
      <button 
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await toggleWishlist(product.id);
        }}
        disabled={wishlistLoading}
        className={`absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'} hover:bg-white ${isProductInWishlist ? 'text-rose-500' : 'hover:text-rose-500'} ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <svg className="w-5 h-5" fill={isProductInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Product Image with Glassmorphism Effect */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageError ? fallbackImage : getImageUrl(product.cover_image || product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Floating Action Button */}
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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
            className={`bg-white/90 backdrop-blur-md text-rose-600 px-6 py-3 rounded-full font-semibold shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-300 flex items-center gap-2 ${cartLoading || isOutOfStock ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Add to Bag
          </button>
        </div>
      </div>

      {/* Product Info with Modern Typography */}
      <div className="p-5 bg-white/60 backdrop-blur-sm">
        {/* Category Tag */}
        {product.category && (
          <span className="inline-block bg-rose-100 text-rose-600 px-2 py-1 rounded-full text-xs font-medium mb-2">
            {product.category.name}
          </span>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors duration-300">
          <Link href={route('store.product', { storeSlug, id: product.id })} className="hover:text-rose-600 transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Rating Stars */}
        {(product.total_reviews > 0 || product.reviews_count > 0) && (
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => {
                const rating = product.average_rating || product.rating || 0;
                return (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
            </div>
            <span className="text-xs text-gray-500 ml-2">({product.total_reviews || product.reviews_count || 0})</span>
          </div>
        )}

        {/* Price with Modern Styling */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-rose-600">
              {formatCurrency(displayPrice, finalStoreSettings, finalCurrencies)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.price, finalStoreSettings, finalCurrencies)}
              </span>
            )}
          </div>
          
          {/* Quick View Icon */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.visit(route('store.product', { storeSlug, id: product.id }));
            }}
            className="w-8 h-8 bg-rose-50 hover:bg-rose-100 rounded-full flex items-center justify-center text-rose-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle Border */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-rose-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
    </div>
  );
}