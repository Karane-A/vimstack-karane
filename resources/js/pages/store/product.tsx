import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import storeTheme from '@/config/store-theme';

import { Star, ShoppingCart, Heart, Share2, ChevronRight, Minus, Plus, Check, Info } from 'lucide-react';
import ProductSlider from '@/components/store/ProductSlider';
import ImageGallery from '@/components/store/ImageGallery';
import { getImageUrl } from '@/utils/image-helper';
import { useCart } from '@/contexts/CartContext';
import AddToCartButton from '@/components/store/AddToCartButton';
import { formatCurrency } from '@/utils/currency-formatter';

interface ProductVariant {
  name: string;
  values: string[];
}

interface ProductImage {
  id: string;
  url: string;
}

interface ProductProps {
  product: {
    id: number;
    name: string;
    sku: string;
    description: string;
    specifications?: string;
    details?: string;
    price: number;
    sale_price?: number | null;
    stock: number;
    cover_image: string;
    images?: string;
    category?: { id: number; name: string };
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
  };
  relatedProducts?: any[];
  store?: any;
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

export default function ProductDetail({
  product,
  relatedProducts = [],
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: ProductProps & { theme?: string }) {
  // Always call hooks first to maintain hook order
  const { props } = usePage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific product detail pages to avoid circular dependencies
  const [ThemeProductDetailPage, setThemeProductDetailPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeProductDetailPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeProductDetailPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let productDetailPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            productDetailPageModule = await import('@/pages/store/beauty-cosmetics/BeautyProductDetail');
            break;
          case 'fashion':
            productDetailPageModule = await import('@/pages/store/fashion/FashionProductDetail');
            break;
          case 'electronics':
            productDetailPageModule = await import('@/pages/store/electronics/ElectronicsProductDetail');
            break;
          case 'jewelry':
            productDetailPageModule = await import('@/pages/store/jewelry/JewelryProductDetail');
            break;
          case 'watches':
            productDetailPageModule = await import('@/pages/store/watches/WatchesProductDetail');
            break;
          case 'furniture-interior':
            productDetailPageModule = await import('@/pages/store/furniture-interior/FurnitureProductDetail');
            break;
          case 'cars-automotive':
            productDetailPageModule = await import('@/pages/store/cars-automotive/CarsProductDetail');
            break;
          case 'baby-kids':
            productDetailPageModule = await import('@/pages/store/baby-kids/BabyKidsProductDetail');
            break;
          case 'perfume-fragrances':
            productDetailPageModule = await import('@/pages/store/perfume-fragrances/PerfumeProductDetail');
            break;
          default:
            setThemeProductDetailPage(null);
            setIsLoading(false);
            return;
        }
        setThemeProductDetailPage(() => productDetailPageModule.default);
      } catch (error) {
        console.error('Failed to load theme product detail page:', error);
        setThemeProductDetailPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeProductDetailPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific product detail page, use it
  if (ThemeProductDetailPage) {
    return (
      <ThemeProductDetailPage
        product={product}
        store={store}
        storeContent={storeContent}
        relatedProducts={relatedProducts}
        customPages={customPages}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
      />
    );
  }
  
  // Default product detail page implementation
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  // Parse images from comma-separated string and ensure cover image is included
  const productImages: ProductImage[] = (() => {
    let images: ProductImage[] = [];

    // Add cover image first if it exists
    if (product.cover_image) {
      images.push({ id: '0', url: product.cover_image });
    }

    // Parse additional images if they exist (comma-separated)
    if (product.images) {
      const imageUrls = product.images.split(',').map(url => url.trim()).filter(url => url);
      imageUrls.forEach((url, index) => {
        // Avoid duplicates with cover image
        if (url !== product.cover_image) {
          images.push({ id: (index + 1).toString(), url });
        }
      });
    }

    // Fallback to placeholder if no images
    if (images.length === 0) {
      images.push({ id: '1', url: `https://placehold.co/600x600?text=${encodeURIComponent(product.name)}` });
    }

    return images;
  })();

  const isOnSale = product.sale_price && product.sale_price < product.price;
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

  // Check if all required variants are selected
  const allVariantsSelected = !hasVariants ||
    (productVariants && productVariants.every(variant => selectedVariants[variant.name]));

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product.stock && value > product.stock) return;
    setQuantity(value);
  };

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!isInStock || !allVariantsSelected) return;

    setIsAddingToCart(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product, hasVariants ? selectedVariants : null);
      }
      // Show success message
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = () => {
    // Here you would implement the actual add to wishlist functionality
    console.log('Adding to wishlist:', product);
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

  // Enhanced image URL helper
  const getProductImageUrl = (path: string): string => {
    if (!path) return `https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`;

    // If it's already an absolute URL, return as is
    if (path.startsWith('http')) {
      return path;
    }

    // Use the image helper for proper URL construction
    return getImageUrl(path);
  };

  return (
    <>
      <Head title={`${product.name} - ${store.name || storeTheme.store.name}`} />

      <StoreLayout
        storeName={store.name || storeTheme.store.name}
        logo={store.logo || storeTheme.store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id || 1}
        theme={store.theme || theme}
      >
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', { storeSlug })} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              {product.category && (
                <>
                  <Link href={route('store.products', { storeSlug, category: product.category.id })} className="text-gray-500 hover:text-primary">
                    {product.category.name}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                </>
              )}
              <span className="text-gray-800 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Detail Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="sticky top-24">
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                  <ImageGallery images={productImages.map(img => getProductImageUrl(img.url))} />
                </div>
              </div>

              {/* Product Info */}
              <div>
                {/* Category */}
                {product.category && (
                  <Link
                    href={route('store.products', { storeSlug, category: product.category.id })}
                    className="inline-block text-sm text-primary mb-2"
                  >
                    {product.category.name}
                  </Link>
                )}

                {/* Product Name */}
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                {/* Rating */}
                {product.total_reviews > 0 && (
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = product.average_rating || 0;
                        return (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${star <= Math.floor(Number(rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({Number(product.average_rating || 0).toFixed(1)}) - {product.total_reviews || 0} Reviews
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  {isOnSale ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-primary">{formatCurrency(product.sale_price || 0, storeSettings, currencies)}</span>
                      <span className="text-gray-500 text-lg line-through ml-3">{formatCurrency(product.price, storeSettings, currencies)}</span>
                      <span className="ml-3 bg-primary/10 text-primary text-sm px-2 py-1 rounded">
                        {Math.round(((product.price - (product.sale_price || 0)) / product.price) * 100)}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold">{formatCurrency(product.price, storeSettings, currencies)}</span>
                  )}
                </div>

                {/* Short Description */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    {product.description?.replace(/<[^>]*>/g, '').substring(0, 200)}
                    {product.description && product.description.replace(/<[^>]*>/g, '').length > 200 ? '...' : ''}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-6 flex items-center">
                  {isInStock ? (
                    <div className="flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-2" />
                      <span>In Stock ({product.stock} available)</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <Info className="h-5 w-5 mr-2" />
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* SKU */}
                {product.sku && (
                  <div className="mb-6 text-sm text-gray-500">
                    SKU: {product.sku}
                  </div>
                )}

                {/* Variants */}
                {hasVariants && productVariants && (
                  <div className="mb-6 space-y-4">
                    {productVariants.map((variant) => (
                      <div key={variant.name}>
                        <h3 className="text-sm font-medium mb-2">{variant.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {variant.values.map((value) => (
                            <button
                              key={value}
                              onClick={() => handleVariantChange(variant.name, value)}
                              className={`px-4 py-2 border rounded-md text-sm ${selectedVariants[variant.name] === value
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-gray-300 hover:border-primary'
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
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                      className="w-16 text-center border-t border-b border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                      disabled={product.stock !== null && quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart & Wishlist */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {/* <button
                    onClick={handleAddToCart}
                    disabled={!isInStock || !allVariantsSelected || isAddingToCart}
                    className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center ${
                      !isInStock || !allVariantsSelected || isAddingToCart
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-blue-700'
                    }`}
                  >
                    {isAddingToCart ? (
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    )}
                    {!isInStock ? 'Out of Stock' : !allVariantsSelected ? 'Select Options' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </button> */}
                  <AddToCartButton
                    product={{...product, variants: hasVariants ? (allVariantsSelected ? selectedVariants : productVariants) : null}}
                    storeSlug={storeSlug}
                    className="w-full py-2 rounded-md text-sm font-medium transition-all duration-300 bg-primary text-white hover:bg-blue-700"
                    isShowOption={false}
                  />

                  <button
                    onClick={handleAddToWishlist}
                    className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>

                  <button
                    className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                    aria-label="Share product"
                  >
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Product Tabs */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`pb-4 px-4 text-sm font-medium ${activeTab === 'description'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Description
                    </button>
                    {product.specifications && (
                      <button
                        onClick={() => setActiveTab('specifications')}
                        className={`pb-4 px-4 text-sm font-medium ${activeTab === 'specifications'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        Specifications
                      </button>
                    )}
                    {product.details && (
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`pb-4 px-4 text-sm font-medium ${activeTab === 'details'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        Additional Details
                      </button>
                    )}
                    {hasCustomFields && (
                      <button
                        onClick={() => setActiveTab('advanced')}
                        className={`pb-4 px-4 text-sm font-medium ${activeTab === 'advanced'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        Advanced
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`pb-4 px-4 text-sm font-medium ${activeTab === 'reviews'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Reviews ({product.total_reviews || 0})
                    </button>
                  </div>

                  <div className="py-6">
                    {activeTab === 'description' && (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                    )}

                    {activeTab === 'specifications' && product.specifications && (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                    )}

                    {activeTab === 'details' && product.details && (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.details }} />
                    )}

                    {activeTab === 'advanced' && hasCustomFields && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Product Information</h3>
                          <p className="text-sm text-gray-600 mb-6">Additional product specifications and custom attributes</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div className="divide-y divide-gray-200">
                            {customFields.map((field, index) => (
                              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                  <dt className="text-sm font-medium text-gray-900 sm:w-1/3 mb-1 sm:mb-0">
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
                      <div>
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="flex mr-4">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const rating = product.average_rating || 0;
                                  return (
                                    <Star
                                      key={star}
                                      className={`h-5 w-5 ${star <= Math.floor(Number(rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                  );
                                })}
                              </div>
                              <span className="text-sm font-medium">Based on {product.total_reviews || 0} reviews</span>
                            </div>

                            <button
                              onClick={() => setShowReviewModal(true)}
                              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              Write a Review
                            </button>
                          </div>

                          {/* Dynamic reviews */}
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
                                    <span className="ml-2 text-sm font-medium">{review.customer_name}</span>
                                    <span className="ml-auto text-sm text-gray-500">{review.created_at}</span>
                                  </div>
                                  <h4 className="font-medium mb-2">{review.title}</h4>
                                  <p className="text-gray-600 mb-3">{review.content}</p>
                                  {review.store_response && (
                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3">
                                      <div className="flex items-center mb-1">
                                        <span className="text-sm font-medium text-blue-800">Store Response:</span>
                                      </div>
                                      <p className="text-sm text-blue-700">{review.store_response}</p>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                              </div>
                            )}
                          </div>
                        </div>
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
          <div className="bg-gray-50">
            <ProductSlider
              title="Related Products"
              subtitle="You might also like these products"
              products={relatedProducts}
              viewAllLink={route('store.products', storeSlug)}
              viewAllText="View All Products"
              storeSettings={storeSettings}
              currencies={currencies}
            />
          </div>
        )}
      </StoreLayout>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowReviewModal(false)}></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Write a Review</h3>

                    <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      if (reviewRating === 0) {
                        alert('Please select a rating');
                        return;
                      }

                      if (!isLoggedIn) {
                        window.location.href = `/store/${storeSlug}/login?redirect=${window.location.pathname}`;
                        return;
                      }

                      setIsSubmittingReview(true);
                      try {
                        const response = await fetch(route('api.reviews.store'), {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                          },
                          body: JSON.stringify({
                            product_id: product.id,
                            rating: reviewRating,
                            title: reviewTitle,
                            content: reviewContent
                          })
                        });

                        const data = await response.json();
                        
                        if (data.success) {
                          alert('Thank you for your review!');
                          setReviewRating(0);
                          setReviewTitle('');
                          setReviewContent('');
                          setShowReviewModal(false);
                          window.location.reload(); // Refresh to show new review
                        } else {
                          alert(data.message || 'Failed to submit review');
                        }
                      } catch (error) {
                        console.error('Error submitting review:', error);
                        alert('Failed to submit review. Please try again.');
                      } finally {
                        setIsSubmittingReview(false);
                      }
                    }}>
                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating *</label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="p-1 focus:outline-none"
                              onClick={() => setReviewRating(star)}
                            >
                              <Star
                                className={`h-6 w-6 ${star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-400 hover:fill-yellow-400'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Title */}
                      <div>
                        <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">Review Title *</label>
                        <input
                          type="text"
                          id="review-title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Give your review a title"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          required
                        />
                      </div>

                      {/* Review Content */}
                      <div>
                        <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                        <textarea
                          id="review-content"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Write your review here"
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={() => setShowReviewModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}