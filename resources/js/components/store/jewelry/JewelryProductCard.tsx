import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface JewelryProductCardProps {
  product: any;
  storeSettings?: any;
  currencies?: any[];
}

function JewelryProductCard({ product, storeSettings, currencies }: JewelryProductCardProps) {
  const { props } = usePage();
  const finalStoreSettings = storeSettings || props.storeSettings || {};
  const finalCurrencies = currencies || props.currencies || [];
  const [imageError, setImageError] = useState(false);
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();
  
  // Debug: Log image information
  const imageSource = product.cover_image || product.image;
  const imageUrl = imageSource ? getImageUrl(imageSource) : '';
  console.log('Product:', product.name, 'Image URL:', imageUrl, 'Cover Image:', product.cover_image, 'Image:', product.image);
  
  const isProductInWishlist = isInWishlist(product.id);
  const isOutOfStock = !product.is_active || product.stock <= 0;
  
  // Check if product has variants
  const hasVariants = product.variants && 
    ((Array.isArray(product.variants) && product.variants.length > 0) ||
     (typeof product.variants === 'string' && product.variants.trim() !== '' && product.variants !== '[]'));
  
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;
  
  return (
    <div className="group bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={imageError || !imageUrl ? `https://placehold.co/400x400/f5f5f5/d4af37?text=${encodeURIComponent(product.name)}` : imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-medium uppercase">
            -{discountPercentage}%
          </div>
        )}
        
        {hasVariants && (
          <div className={`absolute left-4 ${hasDiscount ? 'top-12' : 'top-4'} bg-yellow-600 text-white px-3 py-1 text-xs font-medium uppercase`}>
            Variants
          </div>
        )}
        
        <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.visit(route('store.product', { storeSlug: props.store?.slug || 'jewelry', id: product.id }));
              }}
              className="bg-white text-neutral-900 p-3 hover:bg-yellow-600 hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button 
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await toggleWishlist(product.id);
              }}
              disabled={wishlistLoading}
              className={`bg-white text-neutral-900 p-3 hover:bg-yellow-600 hover:text-white transition-colors duration-300 ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <svg className={`w-5 h-5 ${isProductInWishlist ? 'text-red-500 fill-red-500' : ''}`} fill={isProductInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isOutOfStock) return;
                if (hasVariants) {
                  router.visit(route('store.product', { storeSlug: props.store?.slug || 'jewelry', id: product.id }));
                  return;
                }
                await addToCart(product);
              }}
              disabled={cartLoading || isOutOfStock}
              className={`bg-white text-neutral-900 p-3 hover:bg-yellow-600 hover:text-white transition-colors duration-300 ${cartLoading || isOutOfStock ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 text-center">
        <h3 className="font-serif text-lg text-neutral-900 mb-2 group-hover:text-yellow-700 transition-colors">
          <Link href={route('store.product', { storeSlug: props.store?.slug || 'jewelry', id: product.id })} className="hover:text-yellow-700">
            {product.name}
          </Link>
        </h3>
        
        <p className="text-neutral-500 text-sm mb-3 uppercase tracking-wider">
          {product.category?.name}
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-3">
          {product.sale_price ? (
            <>
              <span className="text-xl font-medium text-neutral-900">{formatCurrency(product.sale_price, finalStoreSettings, finalCurrencies)}</span>
              <span className="text-sm text-neutral-500 line-through">{formatCurrency(product.price, finalStoreSettings, finalCurrencies)}</span>
            </>
          ) : (
            <span className="text-xl font-medium text-neutral-900">{formatCurrency(product.price, finalStoreSettings, finalCurrencies)}</span>
          )}
        </div>
        
        {(product.total_reviews > 0 || product.reviews_count > 0) && (
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => {
              const rating = product.average_rating || product.rating || 0;
              return (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(Number(rating)) ? 'text-yellow-500' : 'text-neutral-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            })}
            <span className="text-xs text-neutral-500 ml-2">({product.total_reviews || product.reviews_count || 0})</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default JewelryProductCard;