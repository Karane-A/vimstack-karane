import React, { useState } from 'react';
import StoreLayout from '@/layouts/StoreLayout';
import { Head, usePage } from '@inertiajs/react';
import { ElectronicsFooter } from '@/components/store/electronics';
import { Star, Heart, Share2, ChevronRight, Minus, Plus, Check, Info, Zap, Shield, Cpu } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import AddToCartButton from '@/components/store/AddToCartButton';
import { ElectronicsProductCard } from '@/components/store/electronics';
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

interface ElectronicsProductDetailProps {
  product: Product;
  store: any;
  storeContent?: any;
  relatedProducts?: Product[];
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

function ElectronicsProductDetail({ 
  product, 
  store, 
  storeContent,
  relatedProducts = [], 
  customPages = [], 
  cartCount = 0, 
  wishlistCount = 0, 
  isLoggedIn = false 
}: ElectronicsProductDetailProps) {
  const { props } = usePage();
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const productImages = (() => {
    let images: string[] = [];
    if (product.images) {
      const imageUrls = product.images.split(',').map(url => url.trim()).filter(url => url && url !== '');
      images.push(...imageUrls);
    }
    if (product.cover_image && !images.includes(product.cover_image)) {
      images.unshift(product.cover_image);
    }
    if (images.length === 0) {
      images.push(`https://placehold.co/600x600/1e293b/60a5fa?text=${encodeURIComponent(product.name)}`);
    }
    return images;
  })();

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0;
  const isInStock = product.stock > 0 && product.is_active;
  
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
        <div className="bg-gray-50 min-h-screen">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
              <nav className="text-sm">
                <a href={route('store.home', store.slug)} className="text-gray-500 hover:text-blue-600 transition-colors">Home</a>
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400 inline" />
                {product.category && (
                  <>
                    <a href={route('store.products', store.slug) + '?category=' + product.category.id} className="text-gray-500 hover:text-blue-600 transition-colors">{product.category.name}</a>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400 inline" />
                  </>
                )}
                <span className="text-gray-900 font-semibold">{product.name}</span>
              </nav>
            </div>
          </div>

          {/* Product Detail Section */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={getImageUrl(productImages[selectedImage])}
                      alt={product.name}
                      className="w-full h-[500px] object-cover"
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          -{discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {productImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {productImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
                            selectedImage === index ? 'ring-2 ring-blue-500' : ''
                          }`}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Category & Title */}
                  <div>
                    {product.category && (
                      <p className="text-sm font-semibold tracking-wide uppercase text-blue-600 mb-4">
                        {product.category.name}
                      </p>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    
                    {/* Rating */}
                    {(product.total_reviews > 0 || product.reviews_count > 0 || (product.reviews && product.reviews.length > 0)) && (
                      <div className="flex items-center mb-4">
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
                        <span className="text-sm text-gray-600 ml-3">
                          ({(product.average_rating || product.rating || 0).toFixed(1)}) - {product.total_reviews || product.reviews_count || product.reviews?.length || 0} Reviews
                        </span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center gap-4 mb-6">
                      {hasDiscount ? (
                        <>
                          <span className="text-4xl font-bold text-blue-600">{formatCurrency(product.sale_price!, storeSettings, currencies)}</span>
                          <span className="text-2xl text-gray-500 line-through">{formatCurrency(product.price, storeSettings, currencies)}</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-gray-900">{formatCurrency(product.price, storeSettings, currencies)}</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description?.replace(/<[^>]*>/g, '').substring(0, 200)}
                      {product.description && product.description.replace(/<[^>]*>/g, '').length > 200 ? '...' : ''}
                    </p>
                  </div>



                  {/* Stock Status */}
                  <div className="flex items-center">
                    {isInStock ? (
                      <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        <Check className="h-5 w-5 mr-2" />
                        <span className="font-semibold">In Stock ({product.stock} available)</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                        <Info className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Variants */}
                  {hasVariants && productVariants && (
                    <div className="space-y-4">
                      {productVariants.map((variant) => (
                        <div key={variant.name}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{variant.name}</h3>
                          <div className="flex flex-wrap gap-3">
                            {variant.values.map((value) => (
                              <button
                                key={value}
                                onClick={() => handleVariantChange(variant.name, value)}
                                className={`px-6 py-3 border-2 rounded-lg font-semibold transition-all duration-300 ${
                                  selectedVariants[variant.name] === value
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-gray-300 hover:border-blue-500 text-gray-700'
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                    <div className="flex items-center border-2 border-gray-300 rounded-lg w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-300"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <div className="w-16 h-12 flex items-center justify-center font-semibold text-lg">
                        {quantity}
                      </div>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-300"
                        disabled={product.stock !== null && quantity >= product.stock}
                      >
                        <Plus className="h-5 w-5" />
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
                      className="flex-1 py-4 font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      isShowOption={false}
                    />
                    <button className="p-4 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-300 rounded-lg">
                      <Heart className="h-6 w-6 text-gray-600 hover:text-red-500" />
                    </button>
                    <button className="p-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 rounded-lg">
                      <Share2 className="h-6 w-6 text-gray-600 hover:text-blue-500" />
                    </button>
                  </div>

                  {/* Product Tabs */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex border-b border-gray-200">
                      <button
                        onClick={() => setActiveTab('description')}
                        className={`pb-4 px-6 text-lg font-semibold transition-colors ${
                          activeTab === 'description'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Description
                      </button>
                      {product.specifications && (
                        <button
                          onClick={() => setActiveTab('specifications')}
                          className={`pb-4 px-6 text-lg font-semibold transition-colors ${
                            activeTab === 'specifications'
                              ? 'border-b-2 border-blue-500 text-blue-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Specifications
                        </button>
                      )}
                      {hasCustomFields && (
                        <button
                          onClick={() => setActiveTab('advanced')}
                          className={`pb-4 px-6 text-lg font-semibold transition-colors ${
                            activeTab === 'advanced'
                              ? 'border-b-2 border-blue-500 text-blue-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Advanced
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-4 px-6 text-lg font-semibold transition-colors ${
                          activeTab === 'reviews'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Reviews ({product.total_reviews || product.reviews_count || product.reviews?.length || 0})
                      </button>
                    </div>

                    <div className="py-6">
                      {activeTab === 'description' && (
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                      )}

                      {activeTab === 'specifications' && product.specifications && (
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                      )}

                      {activeTab === 'advanced' && hasCustomFields && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Product Information</h3>
                            <p className="text-gray-600 mb-6">Technical specifications and custom attributes</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
                            <div className="divide-y divide-blue-100">
                              {customFields.map((field, index) => (
                                <div key={index} className="px-6 py-4 hover:bg-blue-100 transition-colors">
                                  <div className="flex flex-col sm:flex-row sm:items-center">
                                    <dt className="text-sm font-semibold text-blue-900 sm:w-1/3 mb-1 sm:mb-0">
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
                            product.reviews.map((review) => (
                              <div key={review.id} className="bg-white rounded-xl p-6 shadow-md">
                                <div className="flex items-center mb-4">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-3 font-semibold text-gray-900">{review.customer_name}</span>
                                  <span className="ml-auto text-sm text-gray-500">{review.created_at}</span>
                                </div>
                                <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                                <p className="text-gray-600 mb-4">{review.content}</p>
                                {review.store_response && (
                                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                    <div className="flex items-center mb-2">
                                      <span className="font-semibold text-blue-900">Store Response:</span>
                                    </div>
                                    <p className="text-blue-800">{review.store_response}</p>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
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

          {/* Featured Products */}
          {relatedProducts.length > 0 && (
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.slice(0, 4).map((product) => (
                    <ElectronicsProductCard
                      key={product.id}
                      product={product}
                      storeSettings={storeSettings}
                      currencies={currencies}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </StoreLayout>
    </>
  );
}

export default ElectronicsProductDetail;