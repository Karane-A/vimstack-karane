import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { getImageUrl } from '@/utils/image-helper';
import { formatCurrency } from '@/utils/currency-formatter';
import BabyKidsProductCard from '@/components/store/baby-kids/BabyKidsProductCard';

interface BabyKidsProductDetailProps {
  product: any;
  relatedProducts?: any[];
  store: any;
  storeContent?: any;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function BabyKidsProductDetailContent({
  product,
  relatedProducts = [],
  store = {},
  storeContent,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: BabyKidsProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();
  
  const isProductInWishlist = isInWishlist(product.id);
  
  // Parse custom fields safely
  const customFields = (() => {
    if (!product.custom_fields) return [];
    if (Array.isArray(product.custom_fields)) return product.custom_fields;
    if (typeof product.custom_fields === 'object') {
      return Object.entries(product.custom_fields).map(([key, value]) => ({
        name: key,
        value: value
      }));
    }
    try {
      const parsed = JSON.parse(product.custom_fields);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object') {
        return Object.entries(parsed).map(([key, value]) => ({
          name: key,
          value: value
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  })();

  const hasCustomFields = customFields && customFields.length > 0;
  
  // Parse images from comma-separated string and ensure all images are included
  const images = (() => {
    let imageList: string[] = [];

    // Parse additional images first if they exist (comma-separated)
    if (product.images) {
      const imageUrls = product.images.split(',').map(url => url.trim()).filter(url => url && url !== '');
      imageList.push(...imageUrls);
    }

    // Add cover image if it exists and not already included
    if (product.cover_image && !imageList.includes(product.cover_image)) {
      imageList.unshift(product.cover_image); // Add cover image at the beginning
    }

    // Remove any empty or invalid URLs
    imageList = imageList.filter(url => url && url.trim() !== '');

    // Fallback to placeholder if no images
    if (imageList.length === 0) {
      imageList.push(`https://placehold.co/600x600/fef7f7/ec4899?text=${encodeURIComponent(product.name)}`);
    }

    return imageList;
  })();
  const productVariants = (() => {
    if (!product.variants) return [];
    if (Array.isArray(product.variants)) return product.variants;
    try {
      return JSON.parse(product.variants);
    } catch (error) {
      return [];
    }
  })();
  
  const hasVariants = productVariants && productVariants.length > 0;

  const handleAddToCart = async () => {
    if (hasVariants) {
      const allVariantsSelected = productVariants.every(
        variant => selectedVariants[variant.name]
      );
      if (!allVariantsSelected) {
        alert('Please select all options');
        return;
      }
    }
    
    await addToCart(product, selectedVariants, quantity);
  };

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }));
  };

  return (
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        {/* Hero Section */}
        <div className="bg-pink-50 py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm mb-8">
              <a href={route('store.home', store.slug)} className="text-gray-500 hover:text-pink-600 transition-colors">
                Home
              </a>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {product.category && (
                <>
                  <Link href={route('store.products', store.slug) + '?category=' + product.category.id} className="text-gray-500 hover:text-pink-500 transition-colors">{product.category.name}</Link>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
              <span className="text-gray-800 font-medium">{product.name}</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600">
                Perfect for your little ones
              </p>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                <div className="relative bg-white rounded-3xl shadow-xl border-4 border-pink-400 overflow-hidden">
                  {/* Main Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={images[selectedImage] ? getImageUrl(images[selectedImage]) : `https://placehold.co/600x600/fef7f7/ec4899?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x600/fef7f7/ec4899?text=${encodeURIComponent(product.name)}`;
                      }}
                    />
                  </div>
                  
                  {/* Image Thumbnails */}
                  {images.length > 1 && (
                    <div className="p-4 bg-pink-50">
                      <div className="flex space-x-3 overflow-x-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                              selectedImage === index ? 'border-pink-500' : 'border-pink-200'
                            }`}
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/64x64/fef7f7/ec4899?text=${index + 1}`;
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white p-8">
                  {/* Category */}
                  {product.category && (
                    <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block mb-4">
                      {product.category.name}
                    </span>
                  )}

                  {/* Product Name */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => {
                          const rating = product.average_rating || product.rating || 0;
                          return (
                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        })}
                      </div>
                      <span className="text-gray-600">({(product.average_rating || product.rating || 0).toFixed(1)}) {product.total_reviews || product.reviews_count || product.reviews?.length || 0} reviews</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center space-x-3 mb-6">
                    {product.sale_price ? (
                      <>
                        <span className="text-3xl font-bold text-red-500">
                          {formatCurrency(product.sale_price, storeSettings, currencies)}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          {formatCurrency(product.price, storeSettings, currencies)}
                        </span>
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Save {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-800">
                        {formatCurrency(product.price, storeSettings, currencies)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6">
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-full font-semibold">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-red-700 bg-red-100 px-4 py-2 rounded-full font-semibold">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Variants */}
                  {hasVariants && (
                    <div className="mb-6 space-y-4">
                      {(() => {
                        const productVariants = (() => {
                          if (!product.variants) return [];
                          if (Array.isArray(product.variants)) return product.variants;
                          try {
                            return JSON.parse(product.variants);
                          } catch (error) {
                            return [];
                          }
                        })();
                        
                        return productVariants.map((variant) => (
                          <div key={variant.name}>
                            <label className="block text-sm font-bold text-gray-700 mb-2 capitalize">
                              {variant.name}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {variant.values.map((value) => (
                                <button
                                  key={value}
                                  onClick={() => handleVariantChange(variant.name, value)}
                                  className={`px-4 py-2 rounded-full border-2 font-semibold transition-all ${
                                    selectedVariants[variant.name] === value
                                      ? 'border-pink-500 bg-pink-500 text-white'
                                      : 'border-pink-300 text-pink-500 hover:border-pink-500'
                                  }`}
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full font-bold hover:bg-pink-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xl font-bold text-gray-800 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full font-bold hover:bg-pink-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                      onClick={handleAddToCart}
                      disabled={cartLoading || product.stock <= 0}
                      className="flex-1 bg-pink-500 text-white py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span>{cartLoading ? 'Adding...' : 'Add to Cart'}</span>
                    </button>
                    
                    <button
                      onClick={async () => await toggleWishlist(product.id)}
                      disabled={wishlistLoading}
                      className={`px-6 py-4 rounded-full font-bold transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                        isProductInWishlist
                          ? 'bg-pink-500 text-white'
                          : 'border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white'
                      } ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{isProductInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                    </button>
                  </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-16 relative">
              <div className="absolute top-4 left-4 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl shadow-xl border-4 border-pink-400 overflow-hidden">
                {/* Tab Headers */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800">Product Information</h2>
                </div>
                
                <div className="flex border-b border-pink-200">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-6 py-4 font-bold transition-colors ${
                      activeTab === 'description'
                        ? 'bg-pink-100 text-pink-600 border-b-4 border-pink-500'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    Description
                  </button>
                  {product.specifications && (
                    <button
                      onClick={() => setActiveTab('specifications')}
                      className={`px-6 py-4 font-bold transition-colors ${
                        activeTab === 'specifications'
                          ? 'bg-pink-100 text-pink-600 border-b-4 border-pink-500'
                          : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                      }`}
                    >
                      Specifications
                    </button>
                  )}
                  {product.details && (
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`px-6 py-4 font-bold transition-colors ${
                        activeTab === 'details'
                          ? 'bg-pink-100 text-pink-600 border-b-4 border-pink-500'
                          : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                      }`}
                    >
                      Details
                    </button>
                  )}
                  {hasCustomFields && (
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className={`px-6 py-4 font-bold transition-colors ${
                        activeTab === 'advanced'
                          ? 'bg-pink-100 text-pink-600 border-b-4 border-pink-500'
                          : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                      }`}
                    >
                      Advanced
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-4 font-bold transition-colors ${
                      activeTab === 'reviews'
                        ? 'bg-pink-100 text-pink-600 border-b-4 border-pink-500'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    Reviews ({product.reviews?.length || product.total_reviews || 0})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {activeTab === 'description' && (
                    <div 
                      className="prose prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
                    />
                  )}

                  {activeTab === 'specifications' && product.specifications && (
                    <div 
                      className="prose prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: product.specifications }}
                    />
                  )}

                  {activeTab === 'details' && product.details && (
                    <div 
                      className="prose prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: product.details }}
                    />
                  )}

                  {activeTab === 'advanced' && hasCustomFields && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Product Information</h3>
                        <p className="text-gray-600 mb-6">Baby & kids product specifications and custom attributes</p>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded-2xl overflow-hidden">
                        <div className="divide-y divide-pink-100">
                          {customFields.map((field, index) => (
                            <div key={index} className="px-6 py-4 hover:bg-pink-100 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center">
                                <dt className="text-sm font-bold text-pink-900 sm:w-1/3 mb-1 sm:mb-0">
                                  {field.name || field.label || `Field ${index + 1}`}
                                </dt>
                                <dd className="text-sm text-gray-700 sm:w-2/3">
                                  {typeof field.value === 'object' ? JSON.stringify(field.value) : (field.value || 'N/A')}
                                </dd>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      {product.reviews && product.reviews.length > 0 ? (
                        <>
                          {/* Rating Summary */}
                          <div className="bg-pink-50 rounded-2xl p-6 border-2 border-pink-200">
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-pink-600">{(product.average_rating || product.rating || 0).toFixed(1)}</div>
                                <div className="flex items-center justify-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => {
                                    const rating = product.average_rating || product.rating || 0;
                                    return (
                                      <svg key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    );
                                  })}
                                </div>
                                <div className="text-sm text-gray-600">{product.total_reviews || product.reviews_count || product.reviews?.length || 0} reviews</div>
                              </div>
                            </div>
                          </div>

                          {/* Reviews List */}
                          <div className="space-y-4">
                            {product.reviews.map((review) => (
                              <div key={review.id} className="bg-white rounded-2xl p-6 border-2 border-pink-200">
                                <div className="flex items-center mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center">
                                      <span className="text-pink-600 font-bold">{review.customer_name?.charAt(0) || 'U'}</span>
                                    </div>
                                    <div>
                                      <div className="font-bold text-gray-800">{review.customer_name || 'Anonymous'}</div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                          ))}
                                        </div>
                                        <span className="text-sm text-gray-500">{review.created_at}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {review.title && (
                                  <h4 className="font-bold text-gray-800 mb-2">{review.title}</h4>
                                )}
                                <p className="text-gray-700">{review.content}</p>
                                {review.store_response && (
                                  <div className="bg-pink-50 border-l-4 border-pink-500 p-4 mt-4">
                                    <div className="font-bold text-pink-600 mb-2">Store Response:</div>
                                    <p className="text-gray-700">{review.store_response}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">No Reviews Yet</h3>
                          <p className="text-gray-600">Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-pink-50 py-16">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">You Might Also Love</h2>
                <p className="text-gray-600 text-lg">More amazing products for your little ones</p>

              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <BabyKidsProductCard
                    key={relatedProduct.id}
                    product={{
                      id: relatedProduct.id,
                      name: relatedProduct.name,
                      price: relatedProduct.price,
                      sale_price: relatedProduct.sale_price,
                      image: relatedProduct.cover_image,
                      slug: relatedProduct.slug || '',
                      variants: relatedProduct.variants,
                      is_featured: false
                    }}
                    storeSettings={storeSettings}
                    currencies={currencies}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </StoreLayout>
  );
}

export default function BabyKidsProductDetail(props: BabyKidsProductDetailProps) {
  return (
    <>
      <Head title={`${props.product.name} - ${props.store.name}`} />
      <CartProvider storeId={props.store.id} isLoggedIn={props.isLoggedIn}>
        <WishlistProvider>
          <BabyKidsProductDetailContent {...props} />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}