import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';

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
  onAddToCart?: (product: any, quantity: number) => void;
  onQuickView?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
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
  onAddToCart,
  onQuickView,
  onAddToWishlist
}: ProductProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const hasVariants = variants && variants.length > 0;
  const isOnSale = sale_price && sale_price < price;
  const isInStock = stock > 0 && is_active;
  const isNew = true; // This would be determined by creation date in a real app
  
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
    if (onQuickView) onQuickView({ id, name, price, sale_price, cover_image, category, stock, is_active, variants });
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) onAddToWishlist({ id, name, price, sale_price, cover_image, category, stock, is_active });
  };

  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link href={route('store.product', { storeSlug, id })} className="block relative overflow-hidden aspect-square">
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
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
              NEW
            </span>
          )}
          {isOnSale && (
            <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md">
              SALE
            </span>
          )}
          {hasVariants && (
            <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-md">
              OPTIONS
            </span>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            onClick={handleAddToWishlist}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors transform opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4 text-gray-600" />
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
          

        </div>
        
        {/* Price */}
        <div className="mt-1 flex items-center">
          {isOnSale ? (
            <>
              <span className="font-bold text-primary">${sale_price?.toFixed(2)}</span>
              <span className="text-gray-500 text-sm line-through ml-2">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold">${price.toFixed(2)}</span>
          )}
        </div>
        
        {/* Add to cart button */}
        <div className="mt-3">
          <button 
            onClick={handleAddToCart}
            disabled={!isInStock || isAddingToCart}
            className={`w-full py-2 rounded-md text-sm font-medium flex items-center justify-center transition-all duration-300 ${
              !isInStock 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : isAddingToCart 
                  ? 'bg-primary/80 text-white' 
                  : 'bg-primary text-white hover:bg-blue-700'
            }`}
          >
            {isAddingToCart ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ShoppingCart className="h-4 w-4 mr-1" />
            )}
            {hasVariants ? 'Select Options' : isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}