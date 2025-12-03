import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/currency-formatter';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { usePage, router, Link } from '@inertiajs/react';

interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image?: string;
  stock: number;
  is_active: boolean;
  variants?: any;
  category?: {
    name: string;
  };
}

interface CarsProductCardProps {
  product: Product;
  storeSettings?: any;
  currencies?: any[];
}

export default function CarsProductCard({ product, storeSettings = {}, currencies = [] }: CarsProductCardProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug;
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();
  
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0;
  const isInStock = product.stock > 0 && product.is_active;
  const hasVariants = product.variants && (Array.isArray(product.variants) ? product.variants.length > 0 : Object.keys(product.variants).length > 0);
  const isProductInWishlist = isInWishlist(product.id);
  const productUrl = route('store.product', { storeSlug, id: product.id });

  return (
    <div className="group bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-600">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(product.cover_image) || `https://placehold.co/400x400/f5f5f5/666666?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {hasVariants && (
            <span className="bg-black text-white px-3 py-1 text-xs font-bold tracking-wider uppercase">
              IN VARIANT
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold tracking-wider uppercase">
              -{discountPercentage}% OFF
            </span>
          )}
          {!isInStock && (
            <span className="bg-gray-900 text-white px-3 py-1 text-xs font-bold tracking-wider uppercase">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button 
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await toggleWishlist(product.id);
            }}
            disabled={wishlistLoading}
            className={`w-10 h-10 ${isProductInWishlist ? 'bg-red-600' : 'bg-gray-600'} hover:bg-black text-white flex items-center justify-center transition-colors ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isProductInWishlist ? 'fill-white' : ''}`} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.visit(route('store.product', { storeSlug, id: product.id }));
            }}
            className="w-10 h-10 bg-red-600 hover:bg-black text-white flex items-center justify-center transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 border-l-4 border-red-600">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3">
          {product.category && (
            <span className="text-xs font-bold tracking-widest uppercase text-red-600">
              {product.category.name}
            </span>
          )}
          {(product.total_reviews > 0 || product.reviews_count > 0) && (
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-3 w-3 ${star <= Math.floor(product.average_rating || product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.total_reviews || product.reviews_count || 0})</span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-black mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
          <Link href={productUrl} className="hover:text-red-600 cursor-pointer">
            {product.name}
          </Link>
        </h3>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(product.sale_price!, storeSettings, currencies)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price, storeSettings, currencies)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-black">
              {formatCurrency(product.price, storeSettings, currencies)}
            </span>
          )}
        </div>

        {/* Stock & Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isInStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold tracking-wider uppercase text-gray-600">
              {isInStock ? `${product.stock} In Stock` : 'Out of Stock'}
            </span>
          </div>

          <button 
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isInStock) return;
              if (hasVariants) {
                router.visit(route('store.product', { storeSlug, id: product.id }));
                return;
              }
              await addToCart(product, {});
            }}
            className="bg-red-600 hover:bg-black text-white px-4 py-2 font-bold text-sm tracking-wider uppercase transition-colors flex items-center gap-2 disabled:bg-gray-400"
            disabled={!isInStock || cartLoading}
          >
            <ShoppingCart className="h-4 w-4" />
            {hasVariants ? 'Options' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}