import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';
import { getImageUrl } from '@/utils/image-helper';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  image?: string;
  cover_image?: string;
  variants?: any[];
  is_featured?: boolean;
}

interface BabyKidsProductCardProps {
  product: Product;
  storeSettings?: any;
  currencies?: any[];
}

export default function BabyKidsProductCard({ product, storeSettings, currencies = [] }: BabyKidsProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);



  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const isProductInWishlist = isInWishlist(product.id);

  const { addToCart, loading: cartLoading } = useCart();
  const { props } = usePage();
  const storeSlug = props.store?.slug;

  const handleAddToCart = async (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      window.location.href = route('store.product', { storeSlug, id: product.id });
    } else {
      await addToCart(product, {});
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toy Block Style Card */}
      <div className="relative">
        {/* Shadow Layer */}
        <div className="absolute top-3 left-3 w-full h-full bg-pink-300 rounded-3xl opacity-50"></div>
        
        {/* Main Card */}
        <div className="relative bg-white rounded-3xl shadow-xl border-4 border-pink-400 overflow-hidden transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-2xl">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <Link href={route('store.product', { storeSlug, id: product.id })}>
              <img
                src={getImageUrl(product.cover_image || product.image)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x400/fef7f7/ec4899?text=${encodeURIComponent(product.name)}`;
                }}
              />
            </Link>
            
            {/* Discount Badge */}
            {product.sale_price && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
              </div>
            )}
            
            {/* Variant Badge */}
            {product.variants && product.variants.length > 0 && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                In Variant
              </div>
            )}
            
            {/* Action Buttons */}
            <div className={`absolute inset-0 bg-pink-500/20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex space-x-3">
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await toggleWishlist(product.id);
                  }}
                  disabled={wishlistLoading}
                  className={`p-3 rounded-full transition-all duration-300 shadow-lg transform hover:scale-110 ${
                    isProductInWishlist 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white text-pink-500 hover:bg-pink-500 hover:text-white'
                  } ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
                <Link
                  href={route('store.product', { storeSlug, id: product.id })}
                  className="p-3 bg-white rounded-full text-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-6">
            <Link href={route('store.product', { storeSlug, id: product.id })}>
              <h3 className="font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2 text-lg">
                {product.name}
              </h3>
            </Link>
            
            {/* Price */}
            <div className="flex items-center space-x-2 mb-4">
              {product.sale_price ? (
                <>
                  <span className="text-xl font-bold text-red-500">
                    {formatCurrency(product.sale_price, storeSettings, currencies)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.price, storeSettings, currencies)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-800">
                  {formatCurrency(product.price, storeSettings, currencies)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {(product.total_reviews > 0 || product.reviews_count > 0) && (
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => {
                    const rating = product.average_rating || product.rating || 0;
                    return (
                      <svg key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    );
                  })}
                </div>
                <span className="text-xs text-gray-500 ml-2">({product.total_reviews || product.reviews_count || 0})</span>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(product)}
              disabled={cartLoading}
              className={`w-full bg-pink-500 text-white py-3 rounded-full font-bold hover:bg-pink-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${cartLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>{product.variants && product.variants.length > 0 ? 'Select Options' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}