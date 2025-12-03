import React, { useState } from 'react';
import { Heart, Eye, Star } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';
import AddToCartButton from '../AddToCartButton';
import { useWishlist } from '@/contexts/WishlistContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface FashionProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    sale_price?: number | null;
    cover_image: string;
    category?: { id: number; name: string };
    stock: number;
    is_active: boolean;
    variants?: Array<{
      name: string;
      values: string[];
    }>;
  };
  storeSettings?: any;
  currencies?: any[];
}

export default function FashionProductCard({
  product,
  storeSettings,
  currencies
}: FashionProductCardProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'fashion-store';
  const finalStoreSettings = storeSettings || props.storeSettings || {};
  const finalCurrencies = currencies || props.currencies || [];
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  
  const [isHovered, setIsHovered] = useState(false);
  
  const isProductInWishlist = isInWishlist(product.id);
  const hasVariants = product.variants && Array.isArray(product.variants) && product.variants.length > 0;
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price);
  const isInStock = product.stock > 0 && product.is_active;
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.visit(route('store.product', { storeSlug, id: product.id }));
  };
  
  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  return (
    <div 
      className="group relative bg-white overflow-hidden border border-gray-100 hover:border-black transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link 
        href={route('store.product', { storeSlug, id: product.id })} 
        className="block relative overflow-hidden aspect-[3/4]"
      >
        <img 
          src={getImageUrl(product.cover_image)} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x500/f5f5f5/666666?text=${encodeURIComponent(product.name)}`;
          }}
        />
        
        {/* Overlay for out of stock products */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-black text-sm font-light px-4 py-2 tracking-wide uppercase">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-4 left-4">
            <span className="bg-black text-white text-xs font-light px-3 py-1 tracking-wider uppercase">
              Sale
            </span>
          </div>
        )}
        
        {/* Quick actions overlay */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className="bg-white p-3 hover:bg-black hover:text-white transition-colors"
            aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isProductInWishlist ? 'text-red-500 fill-red-500' : ''}`} />
          </button>
          <button 
            onClick={handleQuickView}
            className="bg-white p-3 hover:bg-black hover:text-white transition-colors"
            aria-label="Quick view"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-6 text-center">
        {product.category && (
          <Link 
            href={route('store.products', storeSlug) + '?category=' + product.category.id} 
            className="text-xs text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
          >
            {product.category.name}
          </Link>
        )}
        
        <Link href={route('store.product', { storeSlug, id: product.id })}>
          <h3 className="font-light text-lg mt-2 mb-3 hover:text-gray-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        {(product.total_reviews > 0 || product.reviews_count > 0) && (
          <div className="flex items-center justify-center mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = product.average_rating || product.rating || 0;
                return (
                  <Star 
                    key={star} 
                    className={`h-3 w-3 ${star <= Math.floor(Number(rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                );
              })}
            </div>
            <span className="text-xs text-gray-500 ml-2">({Number(product.average_rating || product.rating || 0).toFixed(1)})</span>
          </div>
        )}
        
        {/* Price */}
        <div className="mb-4">
          {isOnSale ? (
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium text-lg">{formatCurrency(product.sale_price || 0, finalStoreSettings, finalCurrencies)}</span>
              <span className="text-gray-500 text-sm line-through">{formatCurrency(product.price, finalStoreSettings, finalCurrencies)}</span>
            </div>
          ) : (
            <span className="font-medium text-lg">{formatCurrency(product.price, finalStoreSettings, finalCurrencies)}</span>
          )}
        </div>
        
        {/* Add to cart button */}
        <AddToCartButton
          product={product}
          storeSlug={storeSlug}
          className="w-full py-3 bg-black text-white font-light tracking-widest uppercase text-sm hover:bg-gray-800 transition-colors"
        />
      </div>
    </div>
  );
}