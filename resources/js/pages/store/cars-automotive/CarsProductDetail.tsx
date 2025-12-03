import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, usePage } from '@inertiajs/react';
import { CarsFooter, CarsRelatedProducts, CarsImageGallery } from '@/components/store/cars-automotive';
import { Star, Heart, Share2, ChevronRight, Minus, Plus, Check, Info, Zap, Wrench, Settings, ShoppingCart, Eye } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatCurrency } from '@/utils/currency-formatter';

interface ProductVariant {
  name: string;
  values: string[];
}

interface Product {
  id: number;
  name: string;
  sku?: string;
  description: string;
  specifications?: string;
  details?: string;
  price: number;
  sale_price?: number;
  stock: number;
  cover_image?: string;
  images?: string;
  category?: {
    id: number;
    name: string;
  };
  is_active: boolean;
  variants?: ProductVariant[];
  custom_fields?: Record<string, any>;
  reviews?: Array<{
    id: number;
    rating: number;
    title: string;
    content: string;
    customer_name: string;
    created_at: string;
    store_response?: string;
  }>;
  average_rating?: number;
  total_reviews?: number;
}

interface CarsProductDetailProps {
  product: Product;
  store: any;
  storeContent?: any;
  relatedProducts?: Product[];
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

function CarsProductDetailContent({ 
  product, 
  store, 
  storeContent,
  relatedProducts = [], 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: CarsProductDetailProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Parse images from comma-separated string and ensure all images are included
  const productImages = (() => {
    let images: string[] = [];

    // Parse additional images first if they exist (comma-separated)
    if (product.images) {
      const imageUrls = product.images.split(',').map(url => url.trim()).filter(url => url && url !== '');
      images.push(...imageUrls);
    }

    // Add cover image if it exists and not already included
    if (product.cover_image && !images.includes(product.cover_image)) {
      images.unshift(product.cover_image); // Add cover image at the beginning
    }

    // Remove any empty or invalid URLs
    images = images.filter(url => url && url.trim() !== '');

    // Fallback to placeholder if no images
    if (images.length === 0) {
      images.push(`https://placehold.co/600x800/f5f5f5/666666?text=${encodeURIComponent(product.name)}`);
    }

    return images;
  })();

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0;
  const isInStock = product.stock > 0 && product.is_active;
  
  // Parse variants safely
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
  
  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }));
  };
  
  // Check if all required variants are selected
  const allVariantsSelected = !hasVariants ||
    (productVariants && productVariants.every(variant => selectedVariants[variant.name]));

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
      <CarsProductDetailInner
        product={product}
        store={store}
        storeContent={storeContent}
        relatedProducts={relatedProducts}
        customPages={customPages}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        productImages={productImages}
        hasDiscount={hasDiscount}
        discountPercentage={discountPercentage}
        isInStock={isInStock}
        productVariants={productVariants}
        hasVariants={hasVariants}
        selectedVariants={selectedVariants}
        setSelectedVariants={setSelectedVariants}
        quantity={quantity}
        setQuantity={setQuantity}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleVariantChange={handleVariantChange}
        allVariantsSelected={allVariantsSelected}
      />
    </StoreLayout>
  );
}

function CarsProductDetailInner({
  product,
  store,
  storeContent,
  relatedProducts,
  customPages,
  cartCount,
  wishlistCount,
  isLoggedIn,
  productImages,
  hasDiscount,
  discountPercentage,
  isInStock,
  productVariants,
  hasVariants,
  selectedVariants,
  setSelectedVariants,
  quantity,
  setQuantity,
  selectedImage,
  setSelectedImage,
  activeTab,
  setActiveTab,
  handleVariantChange,
  allVariantsSelected
}: any) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const { addToCart, loading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
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

  const handleAddToCart = async () => {
    if (!isInStock) return;
    if (hasVariants && !allVariantsSelected) return;
    
    await addToCart(product, hasVariants ? selectedVariants : {});
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(product.id);
  };

  return (
    <>
        {/* Industrial Header */}
        <div className="bg-black text-white py-16 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <div className="w-6 h-6 bg-white transform -rotate-45"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-wider">{product.name}</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">
                    {product.category?.name || 'Performance Part'} • SKU: {product.sku || product.id}
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm font-bold tracking-wide text-gray-300">
              <a href={route('store.home', store.slug)} className="hover:text-red-400 transition-colors">Garage</a>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-500 inline" />
              {product.category && (
                <>
                  <a href={route('store.products', store.slug) + '?category=' + product.category.id} className="hover:text-red-400 transition-colors">{product.category.name}</a>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-500 inline" />
                </>
              )}
              <span className="text-white">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Product Images */}
              <div className="space-y-6">
                <div className="bg-white border-4 border-red-600/20 p-4">
                  <div className="aspect-square bg-gray-100 overflow-hidden relative group">
                    <img
                      src={getImageUrl(productImages[selectedImage])}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5f5/666666?text=${encodeURIComponent(product.name)}`;
                      }}
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 font-black text-sm">
                        -{discountPercentage}% OFF
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 text-xs font-bold">
                      {selectedImage + 1} / {productImages.length}
                    </div>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-white border-2 p-2 transition-colors ${
                          selectedImage === index ? 'border-red-600' : 'border-gray-300 hover:border-red-400'
                        }`}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="bg-white p-8 border-l-8 border-red-600 shadow-lg h-fit">
                {/* Rating & Reviews */}
                {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = product.average_rating || product.rating || 0;
                          return (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-sm text-gray-600 ml-3 font-bold">
                        ({(product.average_rating || product.rating || 0).toFixed(1)}) • {product.total_reviews || product.reviews_count || product.reviews?.length || 0} Reviews
                      </span>
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold tracking-wider uppercase ${
                      isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isInStock ? `${product.stock} In Stock` : 'Out of Stock'}
                    </div>
                  </div>
                )}
                
                {/* Price */}
                <div className="mb-8">
                  {hasDiscount ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl font-black text-red-600">
                        {formatCurrency(product.sale_price!, storeSettings, currencies)}
                      </span>
                      <span className="text-2xl text-gray-500 line-through">
                        {formatCurrency(product.price, storeSettings, currencies)}
                      </span>
                      <span className="bg-red-600 text-white px-3 py-1 text-sm font-black">
                        SAVE {formatCurrency(product.price - product.sale_price!, storeSettings, currencies)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-4xl font-black text-black">
                      {formatCurrency(product.price, storeSettings, currencies)}
                    </span>
                  )}

                </div>

                {/* Description */}
                <div className="mb-8">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description?.replace(/<[^>]*>/g, '').substring(0, 300)}
                    {product.description && product.description.replace(/<[^>]*>/g, '').length > 300 ? '...' : ''}
                  </p>
                </div>



                {/* Variants */}
                {hasVariants && productVariants && (
                  <div className="space-y-6 mb-8">
                    {productVariants.map((variant) => (
                      <div key={variant.name}>
                        <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-gray-900">
                          {variant.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {variant.values.map((value) => (
                            <button
                              key={value}
                              onClick={() => handleVariantChange(variant.name, value)}
                              className={`py-2 px-4 border text-sm font-medium transition-all ${
                                selectedVariants[variant.name] === value
                                  ? 'border-red-600 bg-red-600 text-white'
                                  : 'border-gray-300 hover:border-red-600'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-black tracking-widest uppercase mb-4">Quantity</h3>
                    <div className="flex items-center border-2 border-gray-300 w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="w-20 h-12 flex items-center justify-center font-black text-lg">
                        {quantity}
                      </div>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                        disabled={product.stock !== null && quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={!isInStock || cartLoading || (hasVariants && !allVariantsSelected)}
                      className={`w-full flex items-center justify-center space-x-3 py-4 font-black text-sm uppercase tracking-widest transition-all ${
                        !isInStock || (hasVariants && !allVariantsSelected)
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transform hover:-translate-y-1'
                      } ${cartLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>
                        {!isInStock ? 'Out of Stock' : 
                         hasVariants && !allVariantsSelected ? 'Select Options' : 
                         'Add to Cart'}
                      </span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className={`flex items-center justify-center space-x-2 py-3 border-2 font-bold text-sm uppercase tracking-wider transition-all ${
                          isProductInWishlist
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-gray-300 hover:border-red-600 hover:bg-red-50'
                        } ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <Heart className={`h-4 w-4 ${isProductInWishlist ? 'fill-white' : ''}`} />
                        <span>Wishlist</span>
                      </button>
                      
                      <button className="flex items-center justify-center space-x-2 py-3 border-2 border-gray-300 hover:border-red-600 hover:bg-red-50 font-bold text-sm uppercase tracking-wider transition-all">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="bg-white mt-16 border-l-8 border-red-600 shadow-lg">
              <div className="bg-black text-white px-8 py-4">
                <h2 className="text-2xl font-black tracking-wider uppercase">Technical Details</h2>
              </div>
              
              <div className="p-8">
                <div className="flex border-b-2 border-gray-200 mb-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-4 px-6 text-sm font-black tracking-wider uppercase transition-colors ${
                      activeTab === 'description'
                        ? 'border-b-2 border-red-600 text-red-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Overview
                  </button>
                  {product.specifications && (
                    <button
                      onClick={() => setActiveTab('specifications')}
                      className={`pb-4 px-6 text-sm font-black tracking-wider uppercase transition-colors ${
                        activeTab === 'specifications'
                          ? 'border-b-2 border-red-600 text-red-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Specifications
                    </button>
                  )}
                  {hasCustomFields && (
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className={`pb-4 px-6 text-sm font-black tracking-wider uppercase transition-colors ${
                        activeTab === 'advanced'
                          ? 'border-b-2 border-red-600 text-red-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Advanced
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-4 px-6 text-sm font-black tracking-wider uppercase transition-colors ${
                      activeTab === 'reviews'
                        ? 'border-b-2 border-red-600 text-red-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Reviews ({product.total_reviews || product.reviews_count || product.reviews?.length || 0})
                  </button>
                </div>

                <div>
                  {activeTab === 'description' && (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                  )}

                  {activeTab === 'specifications' && product.specifications && (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                  )}

                  {activeTab === 'advanced' && hasCustomFields && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-wider uppercase">Advanced Product Information</h3>
                        <p className="text-gray-600 mb-6">Performance specifications and custom attributes</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                        <div className="divide-y divide-red-100">
                          {customFields.map((field, index) => (
                            <div key={index} className="px-6 py-4 hover:bg-red-100 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center">
                                <dt className="text-sm font-black text-red-900 sm:w-1/3 mb-1 sm:mb-0 tracking-wider uppercase">
                                  {field.name || field.label || `Field ${index + 1}`}
                                </dt>
                                <dd className="text-sm text-gray-700 sm:w-2/3 font-medium">
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
                    <div className="space-y-8">
                      {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 pb-8">
                            <div className="flex items-center mb-4">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-3 font-bold">{review.customer_name}</span>
                              <span className="ml-auto text-sm text-gray-500">{review.created_at}</span>
                            </div>
                            <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                            <p className="text-gray-700">{review.content}</p>
                            {review.store_response && (
                              <div className="bg-gray-50 border-l-4 border-red-600 p-4 mt-4">
                                <div className="font-bold text-red-600 mb-2">Store Response:</div>
                                <p className="text-gray-700">{review.store_response}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
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
          <div className="bg-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-black mb-4 tracking-wider uppercase">Related Performance Parts</h2>
                <p className="text-gray-600">Complete your build with these compatible components</p>
              </div>
              <CarsRelatedProducts
                products={relatedProducts}
                title=""
                subtitle=""
                storeSettings={storeSettings}
                currencies={currencies}
              />
            </div>
          </div>
        )}
    </>
  );
}

function CarsProductDetail(props: CarsProductDetailProps) {
  return (
    <>
      <Head title={`${props.product.name} - ${props.store.name}`} />
      <CarsProductDetailContent {...props} />
    </>
  );
}

export default CarsProductDetail;