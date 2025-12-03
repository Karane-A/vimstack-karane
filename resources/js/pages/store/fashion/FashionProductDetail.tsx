import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, usePage } from '@inertiajs/react';
import { FashionFooter, FashionRelatedProducts, FashionImageGallery } from '@/components/store/fashion';
import { Star, Heart, Share2, ChevronRight, Minus, Plus, Check, Info } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import AddToCartButton from '@/components/store/AddToCartButton';
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

interface FashionProductDetailProps {
  product: Product;
  store: any;
  storeContent?: any;
  relatedProducts?: Product[];
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

function FashionProductDetail({ 
  product, 
  store, 
  storeContent,
  relatedProducts = [], 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: FashionProductDetailProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
  
  // Check if all required variants are selected
  const allVariantsSelected = !hasVariants ||
    (productVariants && productVariants.every(variant => selectedVariants[variant.name]));

  return (
    <>
      <Head title={`${product.name} - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        <div className="bg-white min-h-screen">
          {/* Breadcrumb */}
          <div className="border-b border-gray-100">
            <div className="container mx-auto px-4 py-6">
              <nav className="text-sm font-light tracking-wide">
                <a href={route('store.home', store.slug)} className="text-gray-500 hover:text-black transition-colors">Home</a>
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400 inline" />
                {product.category && (
                  <>
                    <a href={route('store.products', store.slug) + '?category=' + product.category.id} className="text-gray-500 hover:text-black transition-colors">{product.category.name}</a>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400 inline" />
                  </>
                )}
                <span className="text-black">{product.name}</span>
              </nav>
            </div>
          </div>

          {/* Product Detail Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Product Images */}
                <div>
                  <FashionImageGallery 
                    images={productImages.map(img => getImageUrl(img))}
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                  {/* Category & Title */}
                  <div>
                    {product.category && (
                      <p className="text-sm font-light tracking-widest uppercase text-gray-500 mb-4">
                        {product.category.name}
                      </p>
                    )}
                    <h1 className="text-4xl font-thin tracking-wide mb-6">{product.name}</h1>
                    
                    {/* Rating */}
                    {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                      <div className="flex items-center mb-6">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = product.average_rating || product.rating || 0;
                            return (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= Math.floor(Number(rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            );
                          })}
                        </div>
                        <span className="text-sm text-gray-500 ml-2 font-light">
                          ({Number(product.average_rating || product.rating || 0).toFixed(1)}) - {product.total_reviews || product.reviews_count || product.reviews?.length || 0} Reviews
                        </span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center gap-4 mb-8">
                      {hasDiscount ? (
                        <>
                          <span className="text-3xl font-light">{formatCurrency(product.sale_price!, storeSettings, currencies)}</span>
                          <span className="text-xl text-gray-500 line-through font-light">{formatCurrency(product.price, storeSettings, currencies)}</span>
                          <span className="bg-black text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
                            -{discountPercentage}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-light">{formatCurrency(product.price, storeSettings, currencies)}</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 font-light leading-relaxed">
                      {product.description?.replace(/<[^>]*>/g, '').substring(0, 200)}
                      {product.description && product.description.replace(/<[^>]*>/g, '').length > 200 ? '...' : ''}
                    </p>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center">
                    {isInStock ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-2" />
                        <span className="font-light text-sm">In Stock ({product.stock} available)</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <Info className="h-4 w-4 mr-2" />
                        <span className="font-light text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Variants */}
                  {hasVariants && productVariants && (
                    <div className="space-y-6">
                      {productVariants.map((variant) => (
                        <div key={variant.name}>
                          <h3 className="text-sm font-light tracking-widest uppercase mb-4">{variant.name}</h3>
                          <div className="flex flex-wrap gap-3">
                            {variant.values.map((value) => (
                              <button
                                key={value}
                                onClick={() => handleVariantChange(variant.name, value)}
                                className={`px-4 py-2 border text-sm font-light tracking-wide transition-colors ${
                                  selectedVariants[variant.name] === value
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 hover:border-black'
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

                  {/* Quantity */}
                  <div>
                    <h3 className="text-sm font-light tracking-widest uppercase mb-4">Quantity</h3>
                    <div className="flex items-center border border-gray-300 w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-300"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="w-16 h-12 flex items-center justify-center font-light text-center">
                        {quantity}
                      </div>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-300"
                        disabled={product.stock !== null && quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart & Actions */}
                  <div className="flex flex-wrap gap-4">
                    <AddToCartButton
                      product={{
                        ...product,
                        variants: hasVariants ? (allVariantsSelected ? selectedVariants : productVariants) : null
                      }}
                      storeSlug={store.slug}
                      className="flex-1 py-3 font-light tracking-widest uppercase text-sm bg-black text-white hover:bg-gray-900 transition-colors"
                      isShowOption={false}
                    />
                    <button className="p-3 border border-gray-300 hover:bg-gray-50 transition-colors">
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-3 border border-gray-300 hover:bg-gray-50 transition-colors">
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>



                  {/* Product Tabs */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex border-b border-gray-200">
                      <button
                        onClick={() => setActiveTab('description')}
                        className={`pb-4 px-4 text-sm font-light tracking-wide ${
                          activeTab === 'description'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Description
                      </button>
                      {product.specifications && (
                        <button
                          onClick={() => setActiveTab('specifications')}
                          className={`pb-4 px-4 text-sm font-light tracking-wide ${
                            activeTab === 'specifications'
                              ? 'border-b-2 border-black text-black'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Specifications
                        </button>
                      )}
                      {product.details && (
                        <button
                          onClick={() => setActiveTab('details')}
                          className={`pb-4 px-4 text-sm font-light tracking-wide ${
                            activeTab === 'details'
                              ? 'border-b-2 border-black text-black'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Additional Details
                        </button>
                      )}
                      {hasCustomFields && (
                        <button
                          onClick={() => setActiveTab('advanced')}
                          className={`pb-4 px-4 text-sm font-light tracking-wide ${
                            activeTab === 'advanced'
                              ? 'border-b-2 border-black text-black'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Advanced
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-4 px-4 text-sm font-light tracking-wide ${
                          activeTab === 'reviews'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Reviews ({product.total_reviews || product.reviews_count || product.reviews?.length || 0})
                      </button>
                    </div>

                    <div className="py-6">
                      {activeTab === 'description' && (
                        <div className="prose max-w-none font-light" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                      )}

                      {activeTab === 'specifications' && product.specifications && (
                        <div className="prose max-w-none font-light" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                      )}

                      {activeTab === 'details' && product.details && (
                        <div className="prose max-w-none font-light" dangerouslySetInnerHTML={{ __html: product.details }} />
                      )}

                      {activeTab === 'advanced' && (
                        <div className="space-y-4">
                          {customFields.map((field, index) => (
                            <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-light text-gray-700">{field.name}:</span>
                              <span className="text-gray-600 font-light">{field.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'reviews' && (
                        <div className="space-y-6">
                          {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review) => (
                              <div key={review.id} className="border-b border-gray-200 pb-6">
                                <div className="flex items-center mb-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm font-light">{review.customer_name}</span>
                                  <span className="ml-auto text-sm text-gray-500 font-light">{review.created_at}</span>
                                </div>
                                <h4 className="font-light mb-2">{review.title}</h4>
                                <p className="text-gray-600 font-light">{review.content}</p>
                                {review.store_response && (
                                  <div className="bg-gray-50 border-l-4 border-black p-3 mt-3">
                                    <div className="flex items-center mb-1">
                                      <span className="text-sm font-light text-black">Store Response:</span>
                                    </div>
                                    <p className="text-sm text-gray-700 font-light">{review.store_response}</p>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500 font-light">No reviews yet. Be the first to review this product!</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <FashionRelatedProducts
              products={relatedProducts}
              title="You May Also Like"
              subtitle="Discover similar styles that complement your taste"
              storeSettings={storeSettings}
              currencies={currencies}
            />
          )}
        </div>
      </StoreLayout>
    </>
  );
}

export default FashionProductDetail;