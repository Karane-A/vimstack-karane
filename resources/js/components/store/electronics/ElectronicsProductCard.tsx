import React, { useState } from 'react';
import { Heart, Eye, Star, Zap } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';
import AddToCartButton from '../AddToCartButton';
import { useWishlist } from '@/contexts/WishlistContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface ElectronicsProductCardProps {
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
    average_rating?: number;
    total_reviews?: number;
  };
  storeSettings?: any;
  currencies?: any[];
}

export default function ElectronicsProductCard({
  product,
  storeSettings,
  currencies
}: ElectronicsProductCardProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'electronics-store';
  const finalStoreSettings = storeSettings || props.storeSettings || {};
  const finalCurrencies = currencies || props.currencies || [];
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  
  const [isHovered, setIsHovered] = useState(false);
  
  const isProductInWishlist = isInWishlist(product.id);
  const hasVariants = product.variants && Array.isArray(product.variants) && product.variants.length > 0;
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price);
  const isInStock = product.stock > 0 && product.is_active;
  const discountPercentage = isOnSale ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0;
  
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
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link 
        href={route('store.product', { storeSlug, id: product.id })} 
        className="block relative overflow-hidden aspect-square"
      >
        <img 
          src={getImageUrl(product.cover_image)} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f1f5f9/3b82f6?text=${encodeURIComponent(product.name)}`;
          }}
        />
        
        {/* Overlay for out of stock products */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-4 left-4">
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              {discountPercentage}% OFF
            </div>
          </div>
        )}
        
        {/* New Badge for recently added products */}
        {!isOnSale && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              NEW
            </span>
          </div>
        )}
        
        {/* Quick actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all duration-300"
            aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isProductInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
          <button 
            onClick={handleQuickView}
            className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'} delay-75`}
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-6">
        {product.category && (
          <Link 
            href={route('store.products', storeSlug) + '?category=' + product.category.id} 
            className="text-xs text-blue-600 uppercase tracking-wider font-semibold hover:text-blue-800 transition-colors"
          >
            {product.category.name}
          </Link>
        )}
        
        <Link href={route('store.product', { storeSlug, id: product.id })}>
          <h3 className="font-bold text-lg mt-2 mb-3 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        {(product.total_reviews > 0 || product.reviews_count > 0) && (
          <div className="flex items-center mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = product.average_rating || product.rating || 0;
                return (
                  <Star 
                    key={star} 
                    className={`h-4 w-4 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                );
              })}
            </div>
            <span className="text-sm text-gray-500 ml-2">({Number(product.average_rating || product.rating || 0).toFixed(1)})</span>
            <span className="text-xs text-gray-400 ml-1">• {product.total_reviews || product.reviews_count || 0} reviews</span>
          </div>
        )}
        
        {/* Price */}
        <div className="mb-4">
          {isOnSale ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(product.sale_price || 0, finalStoreSettings, finalCurrencies)}</span>
              <span className="text-lg text-gray-500 line-through">{formatCurrency(product.price, finalStoreSettings, finalCurrencies)}</span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(product.price, finalStoreSettings, finalCurrencies)}</span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="mb-4">
          {isInStock ? (
            <div className="flex items-center text-green-600 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>In Stock ({product.stock} available)</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span>Out of Stock</span>
            </div>
          )}
        </div>
        
        {/* Add to cart button */}
        <AddToCartButton
          product={product}
          storeSlug={storeSlug}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        />
      </div>
    </div>
  );
}