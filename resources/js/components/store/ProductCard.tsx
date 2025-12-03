import React, { useState } from 'react';
import { Heart, Eye, Star } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';
import AddToCartButton from './AddToCartButton';
import { useWishlist } from '@/contexts/WishlistContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';

interface ProductProps {
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
  onAddToCart?: (product: any, quantity: number) => void;
  onQuickView?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  storeSettings?: any;
  currencies?: any[];
}

export default function ProductCard({
  id,
  name,
  price,
  sale_price,
  cover_image,
  category,
  stock,
  is_active,
  variants = [],
  average_rating,
  total_reviews,
  onAddToCart,
  onQuickView,
  onAddToWishlist,
  storeSettings,
  currencies
}: ProductProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  const finalStoreSettings = storeSettings || props.storeSettings || {};
  const finalCurrencies = currencies || props.currencies || [];
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const isProductInWishlist = isInWishlist(id);
  
  const hasVariants = variants && Array.isArray(variants) && variants.length > 0;
  const isOnSale = sale_price && parseFloat(sale_price) < parseFloat(price);
  const isInStock = stock > 0 && is_active;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInStock) return;
    
    if (hasVariants) {
      // If product has variants, show quick view instead
      if (onQuickView) onQuickView({ id, name, price, sale_price, cover_image, category, stock, is_active, variants });
      return;
    }
    
    setIsAddingToCart(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onAddToCart) onAddToCart({ id, name, price, sale_price, cover_image, category, stock, is_active }, 1);
      setIsAddingToCart(false);
    }, 600);
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to product detail page using Inertia router
    router.visit(route('store.product', { storeSlug, id }));
  };
  
  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(id);
    if (onAddToWishlist) onAddToWishlist({ id, name, price, sale_price, cover_image, category, stock, is_active });
  };



  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link 
        href={route('store.product', { storeSlug, id })} 
        className="block relative overflow-hidden aspect-square"
      >
        <img 
          src={getImageUrl(cover_image)} 
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(name)}`;
          }}
        />
        
        {/* Overlay for out of stock products */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white/80 text-gray-800 text-sm font-medium px-3 py-1 rounded-md backdrop-blur-sm">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Badges */}
        {hasVariants && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
              In Variant
            </span>
          </div>
        )}
        
        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className={`bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors transform opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 ${wishlistLoading ? 'cursor-not-allowed' : ''}`}
            aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 transition-colors ${isProductInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
          <button 
            onClick={handleQuickView}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors transform opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 delay-75"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        {category && (
          <Link href={route('store.products', storeSlug) + '?category=' + category.id} className="text-xs text-gray-500 uppercase tracking-wider hover:text-primary transition-colors">
            {category.name}
          </Link>
        )}
        
        {/* Product name and rating in a tighter layout */}
        <div className="mb-1">
          <Link href={route('store.product', { storeSlug, id })} className="block">
            <h3 className="font-medium mt-1 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] mb-0">
              {name}
            </h3>
          </Link>
          
          {/* Rating */}
          {total_reviews > 0 && (
            <div className="flex items-center -mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = average_rating || 0;
                  return (
                    <Star 
                      key={star} 
                      className={`h-3 w-3 ${star <= Math.floor(Number(rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  );
                })}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({Number(average_rating || 0).toFixed(1)})
              </span>
            </div>
          )}
        </div>
        
        {/* Price */}
        <div className="mt-1 flex items-center">
          {isOnSale ? (
            <>
              <span className="font-bold text-primary">{formatCurrency(sale_price || 0, finalStoreSettings, finalCurrencies)}</span>
              <span className="text-gray-500 text-sm line-through ml-2">{formatCurrency(price, finalStoreSettings, finalCurrencies)}</span>
            </>
          ) : (
            <span className="font-bold">{formatCurrency(price, finalStoreSettings, finalCurrencies)}</span>
          )}
        </div>
        
        {/* Add to cart button */}
        <div className="mt-3">
          <AddToCartButton
            product={{ id, name, price, sale_price, cover_image, variants, stock, is_active }}
            storeSlug={storeSlug}
            className="w-full py-2 rounded-md text-sm font-medium transition-all duration-300 bg-primary text-white hover:bg-blue-700"
          />
        </div>
      </div>
    </div>
  );
}