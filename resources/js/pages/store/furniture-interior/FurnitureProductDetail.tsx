import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Heart, ShoppingCart, Minus, Plus, Star, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/currency-formatter';
import FurnitureProductCard from '@/components/store/furniture-interior/FurnitureProductCard';

interface FurnitureProductDetailProps {
  product: any;
  store: any;
  storeContent?: any;
  storeSettings?: any;
  currencies?: any[];
  customPages?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  relatedProducts?: any[];
}

function FurnitureProductDetailContent({
  product,
  store,
  storeContent,
  storeSettings,
  currencies,
  customPages = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  relatedProducts = []
}: FurnitureProductDetailProps) {
  const { props } = usePage();
  const finalStoreSettings = storeSettings || props.storeSettings || {};
  const finalCurrencies = currencies || props.currencies || [];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specifications');
  
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, loading: cartLoading } = useCart();
  
  const isProductInWishlist = isInWishlist(product.id);
  const isOutOfStock = !product.is_active || product.stock <= 0;
  
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

  // Parse images from comma-separated string
  const productImages = (() => {
    let images: string[] = [];

    if (product.images) {
      const imageUrls = product.images.split(',').map(url => url.trim()).filter(url => url && url !== '');
      images.push(...imageUrls);
    }

    if (product.cover_image && !images.includes(product.cover_image)) {
      images.unshift(product.cover_image);
    }

    images = images.filter(url => url && url.trim() !== '');

    if (images.length === 0) {
      images.push(`https://placehold.co/600x600/fef3c7/d97706?text=${encodeURIComponent(product.name)}`);
    }

    return images;
  })();

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

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

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    if (hasVariants && !allVariantsSelected) {
      alert('Please select all options');
      return;
    }
    await addToCart(product, hasVariants ? selectedVariants : null, 1);
  };

  const handleWishlistToggle = async () => {
    await toggleWishlist(product.id);
  };

  // Set default tab based on available content
  useEffect(() => {
    if (product.specifications) {
      setActiveTab('specifications');
    } else if (product.details) {
      setActiveTab('details');
    } else {
      setActiveTab('reviews');
    }
  }, [product]);

  return (
      <>
        <div className="bg-yellow-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.visit(route('store.products', store.slug))}
                className="flex items-center gap-2 text-amber-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </button>
              <div className="text-amber-200">/</div>
              <Link href={route('store.products', store.slug) + '?category=' + product.category?.id} className="text-sm hover:text-white transition-colors">{product.category?.name}</Link>
              <div className="text-amber-200">/</div>
              <span className="text-sm font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl border-4 border-amber-200">
                  <img
                    src={getImageUrl(productImages[selectedImage]) || `https://placehold.co/600x600/fef3c7/d97706?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 border-8 border-amber-800/10 rounded-3xl m-4 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {hasDiscount && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white px-6 py-3 text-lg font-bold rounded-2xl shadow-xl">
                      <span className="block text-sm">SAVE</span>
                      <span className="block text-2xl leading-none">{discountPercentage}%</span>
                    </div>
                  )}
                  
                  {hasVariants && (
                    <div className="absolute top-6 right-6 bg-amber-800 text-amber-100 px-3 py-1 text-xs font-bold rounded-lg shadow-md">
                      In Variant
                    </div>
                  )}
                </div>
                
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                          selectedImage === index 
                            ? 'border-amber-600 shadow-xl scale-105' 
                            : 'border-amber-200 hover:border-amber-400'
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

              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    {product.category?.name || 'Furniture'}
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    {product.name}
                  </h1>
                  
                  {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => {
                          const rating = product.average_rating || product.rating || 0;
                          return (
                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(Number(rating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                          );
                        })}
                      </div>
                      <span className="text-slate-600">({Number(product.average_rating || product.rating || 0).toFixed(1)}) {product.total_reviews || product.reviews_count || product.reviews?.length || 0} reviews</span>
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-4">
                  {hasDiscount ? (
                    <>
                      <span className="text-4xl font-bold text-amber-800">
                        {formatCurrency(product.sale_price, finalStoreSettings, finalCurrencies)}
                      </span>
                      <span className="text-2xl text-slate-400 line-through">
                        {formatCurrency(product.price, finalStoreSettings, finalCurrencies)}
                      </span>
                      <span className="bg-red-100 text-red-700 text-lg font-bold px-4 py-2 rounded-xl">
                        Save {formatCurrency(product.price - product.sale_price, finalStoreSettings, finalCurrencies)}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-amber-800">
                      {formatCurrency(product.price, finalStoreSettings, finalCurrencies)}
                    </span>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-amber-100">
                  <div 
                    className="text-lg text-slate-700 leading-relaxed prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: product.description || 'Beautifully crafted furniture piece that brings warmth and elegance to your living space. Made with premium materials and attention to detail.' 
                    }}
                  />
                </div>

                {hasVariants && (
                  <div className="bg-white rounded-2xl p-6 border-2 border-amber-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Choose Options</h3>
                    <div className="space-y-6">
                      {productVariants.map((variant) => (
                        <div key={variant.name}>
                          <h4 className="text-lg font-bold text-slate-900 mb-3">{variant.name}</h4>
                          <div className="flex flex-wrap gap-3">
                            {variant.values.map((value) => (
                              <button
                                key={value}
                                onClick={() => handleVariantChange(variant.name, value)}
                                className={`px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                  selectedVariants[variant.name] === value
                                    ? 'border-amber-600 bg-amber-50 text-amber-800'
                                    : 'border-amber-200 hover:border-amber-400 text-slate-700'
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 border-2 border-amber-100">
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={cartLoading || isOutOfStock}
                      className={`flex-1 bg-yellow-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-yellow-900 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 ${cartLoading || isOutOfStock ? 'cursor-not-allowed opacity-50 transform-none' : ''}`}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span className="text-lg">
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </span>
                    </button>
                    
                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                        isProductInWishlist
                          ? 'bg-amber-600 text-white scale-110'
                          : 'bg-white text-amber-700 hover:bg-amber-50 hover:scale-110 border border-amber-200'
                      } ${wishlistLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <Heart className={`w-6 h-6 ${isProductInWishlist ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-20">
              <div className="bg-white rounded-3xl shadow-lg border border-amber-200 overflow-hidden">
                <div className="flex border-b border-amber-200">
                  {product.specifications && (
                    <button
                      onClick={() => setActiveTab('specifications')}
                      className={`px-8 py-4 text-lg font-bold transition-colors ${
                        activeTab === 'specifications'
                          ? 'bg-amber-100 text-amber-800 border-b-4 border-amber-600'
                          : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      Specifications
                    </button>
                  )}
                  {product.details && (
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`px-8 py-4 text-lg font-bold transition-colors ${
                        activeTab === 'details'
                          ? 'bg-amber-100 text-amber-800 border-b-4 border-amber-600'
                          : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      Product Details
                    </button>
                  )}
                  {hasCustomFields && (
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className={`px-8 py-4 text-lg font-bold transition-colors ${
                        activeTab === 'advanced'
                          ? 'bg-amber-100 text-amber-800 border-b-4 border-amber-600'
                          : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      Advanced
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-8 py-4 text-lg font-bold transition-colors ${
                      activeTab === 'reviews'
                        ? 'bg-amber-100 text-amber-800 border-b-4 border-amber-600'
                        : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    Reviews ({product.total_reviews || product.reviews_count || product.reviews?.length || 0})
                  </button>
                </div>

                <div className="p-8">
                  {activeTab === 'specifications' && product.specifications && (
                    <div 
                      className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.specifications }}
                    />
                  )}

                  {activeTab === 'details' && product.details && (
                    <div 
                      className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.details }}
                    />
                  )}

                  {activeTab === 'advanced' && hasCustomFields && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Advanced Product Information</h3>
                        <p className="text-slate-600 mb-6">Furniture specifications and custom attributes</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg overflow-hidden">
                        <div className="divide-y divide-amber-100">
                          {customFields.map((field, index) => (
                            <div key={index} className="px-6 py-4 hover:bg-amber-100 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center">
                                <dt className="text-sm font-bold text-amber-900 sm:w-1/3 mb-1 sm:mb-0">
                                  {field.name || field.label || `Field ${index + 1}`}
                                </dt>
                                <dd className="text-sm text-slate-700 sm:w-2/3">
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
                          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-amber-800">{Number(product.average_rating || product.rating || 0).toFixed(1)}</div>
                                <div className="flex items-center justify-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => {
                                    const rating = product.average_rating || product.rating || 0;
                                    return (
                                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(Number(rating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                    );
                                  })}
                                </div>
                                <div className="text-sm text-slate-600">{product.total_reviews || product.reviews_count || product.reviews?.length || 0} reviews</div>
                              </div>
                            </div>
                          </div>

                          {/* Reviews List */}
                          <div className="space-y-4">
                            {product.reviews.map((review) => (
                              <div key={review.id} className="bg-white rounded-2xl p-6 border border-amber-200">
                                <div className="flex items-center mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                                      <span className="text-amber-800 font-bold">{review.customer_name.charAt(0)}</span>
                                    </div>
                                    <div>
                                      <div className="font-bold text-slate-900">{review.customer_name}</div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                          ))}
                                        </div>
                                        <span className="text-sm text-slate-600">{review.created_at}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">{review.title}</h4>
                                <p className="text-slate-700">{review.content}</p>
                                {review.store_response && (
                                  <div className="bg-amber-50 border-l-4 border-amber-600 p-3 mt-3">
                                    <div className="flex items-center mb-1">
                                      <span className="text-sm font-bold text-amber-800">Store Response:</span>
                                    </div>
                                    <p className="text-sm text-slate-700">{review.store_response}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="bg-white py-20">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">You Might Also Like</h2>
                <p className="text-slate-600 text-lg">Discover more beautiful furniture pieces</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <FurnitureProductCard
                    key={relatedProduct.id}
                    product={{
                      id: relatedProduct.id,
                      name: relatedProduct.name,
                      price: relatedProduct.price,
                      sale_price: relatedProduct.sale_price,
                      cover_image: relatedProduct.cover_image,
                      image: relatedProduct.image,
                      slug: relatedProduct.slug || '',
                      href: route('store.product', { storeSlug: store.slug, id: relatedProduct.id }),
                      variants: relatedProduct.variants,
                      stock: relatedProduct.stock,
                      is_active: relatedProduct.is_active,
                      category: relatedProduct.category
                    }}
                    storeSettings={finalStoreSettings}
                    currencies={finalCurrencies}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </>
  );
}

export default function FurnitureProductDetail(props: FurnitureProductDetailProps) {
  return (
    <>
      <Head title={`${props.product.name} - ${props.store.name}`} />
      <StoreLayout
        storeName={props.store.name}
        logo={props.store.logo}
        cartCount={props.cartCount}
        wishlistCount={props.wishlistCount}
        isLoggedIn={props.isLoggedIn}
        customPages={props.customPages.length > 0 ? props.customPages : undefined}
        storeContent={props.storeContent}
        storeId={props.store.id}
        theme={props.store.theme || 'furniture-interior'}
      >
        <FurnitureProductDetailContent {...props} />
      </StoreLayout>
    </>
  );
}