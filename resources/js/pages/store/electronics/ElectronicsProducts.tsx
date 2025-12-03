import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Search, Filter, Grid, List, ChevronDown, X, Star, Heart } from 'lucide-react';
import ElectronicsProductCard from '@/components/store/electronics/ElectronicsProductCard';
import AddToCartButton from '@/components/store/AddToCartButton';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatCurrency } from '@/utils/currency-formatter';
import { getImageUrl } from '@/utils/image-helper';

interface Product {
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
}

interface Category {
  id: number;
  name: string;
  products_count?: number;
}

interface Brand {
  id: number;
  name: string;
  products_count?: number;
}

interface ElectronicsProductsProps {
  products: Product[];
  categories: Category[];
  brands?: Brand[];
  store: any;
  storeContent?: any;
  storeSettings?: any;
  currencies?: any[];
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: any[];
  filters?: {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    brands?: string[];
    rating?: number;
    availability?: string;
    sort?: string;
    per_page?: number;
    page?: number;
  };
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

// Wishlist Button Component
function WishlistButton({ productId }: { productId: number }) {
  const { toggleWishlist, isInWishlist, loading } = useWishlist();
  
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productId);
  };
  
  return (
    <button 
      onClick={handleToggleWishlist}
      disabled={loading}
      className="border-2 border-blue-200 p-3 rounded-xl hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center transition-all duration-300 disabled:opacity-50"
      aria-label={isInWishlist(productId) ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`h-5 w-5 ${isInWishlist(productId) ? 'text-red-500 fill-red-500' : 'text-blue-600'}`} />
    </button>
  );
}

export default function ElectronicsProducts({
  products = [],
  categories = [],
  brands = [],
  store = {},
  storeContent = {},
  storeSettings = {},
  currencies = [],
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
  filters = {},
  pagination = { current_page: 1, last_page: 1, per_page: 12, total: 0, from: 0, to: 0 }
}: ElectronicsProductsProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'electronics-store';
  
  // State management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.category ? [filters.category] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(filters.brands || []);
  const [priceRange, setPriceRange] = useState({ min: filters.min_price || 0, max: filters.max_price || 1000 });
  const [selectedRating, setSelectedRating] = useState(Number(filters.rating) || 0);
  const [availability, setAvailability] = useState(filters.availability || 'all');
  const [sortBy, setSortBy] = useState(filters.sort || 'popularity');
  const [perPage, setPerPage] = useState(filters.per_page || 12);

  // Apply filters function
  const applyFilters = () => {
    const params: Record<string, any> = {};
    
    if (searchQuery) params.search = searchQuery;
    if (selectedCategories.length) params.category = selectedCategories[0];
    if (selectedBrands.length) params.brands = selectedBrands.join(',');
    if (priceRange.min > 0) params.min_price = priceRange.min;
    if (priceRange.max < 1000) params.max_price = priceRange.max;
    if (selectedRating > 0) params.rating = selectedRating;
    if (availability !== 'all') params.availability = availability;
    if (sortBy !== 'popularity') params.sort = sortBy;
    if (perPage !== 12) params.per_page = perPage;
    
    router.visit(route('store.products', storeSlug), {
      data: params,
      preserveState: true,
      preserveScroll: true
    });
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating(0);
    setAvailability('all');
    setSortBy('popularity');
    setPerPage(12);
    
    router.visit(route('store.products', storeSlug), {
      preserveState: true,
      preserveScroll: true
    });
  };

  // Pagination
  const goToPage = (page: number) => {
    const currentParams = new URLSearchParams(window.location.search);
    const params: Record<string, any> = {};
    
    // Preserve existing filters
    currentParams.forEach((value, key) => {
      params[key] = value;
    });
    
    params.page = page;
    
    router.visit(route('store.products', storeSlug), {
      data: params,
      preserveState: true,
      preserveScroll: true
    });
  };

  return (
    <>
      <Head title={`Products - ${store.name || 'Electronics Store'}`} />
      
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
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', storeSlug)} className="text-gray-500 hover:text-blue-600">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-800 font-medium">Products</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-slate-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Electronics Collection</h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Discover cutting-edge technology and innovative electronics for your modern lifestyle
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-slate-50 rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-blue-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-blue-600" />
                    Smart Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Search */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                      placeholder="Find electronics..."
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Categories</label>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id.toString())}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category.id.toString()]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(id => id !== category.id.toString()));
                            }
                          }}
                          className="mr-3 w-4 h-4 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-slate-700 flex-1">{category.name}</span>
                        {category.products_count && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">{category.products_count}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Price Range</label>
                  <div className="bg-white p-4 rounded-xl border-2 border-blue-100">
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        placeholder="Min"
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-blue-600 font-bold">—</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        placeholder="Max"
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Brands</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand.id.toString())}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBrands([...selectedBrands, brand.id.toString()]);
                              } else {
                                setSelectedBrands(selectedBrands.filter(id => id !== brand.id.toString()));
                              }
                            }}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{brand.name}</span>
                          {brand.products_count && (
                            <span className="ml-auto text-xs text-gray-500">({brand.products_count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Customer Rating</label>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center p-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-200">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                          className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}

                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'all'}
                        onChange={() => setAvailability('all')}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">All Products</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'in_stock'}
                        onChange={() => setAvailability('in_stock')}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'out_of_stock'}
                        onChange={() => setAvailability('out_of_stock')}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Out of Stock</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold uppercase tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          // Auto-apply when sort changes
                          const params: Record<string, any> = {};
                          if (searchQuery) params.search = searchQuery;
                          if (selectedCategories.length) params.category = selectedCategories[0];
                          if (selectedBrands.length) params.brands = selectedBrands.join(',');
                          if (priceRange.min > 0) params.min_price = priceRange.min;
                          if (priceRange.max < 1000) params.max_price = priceRange.max;
                          if (selectedRating > 0) params.rating = selectedRating;
                          if (availability !== 'all') params.availability = availability;
                          params.sort = e.target.value;
                          if (perPage !== 12) params.per_page = perPage;
                          
                          router.visit(route('store.products', storeSlug), {
                            data: params,
                            preserveState: true,
                            preserveScroll: true
                          });
                        }}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="popularity">Popularity</option>
                        <option value="newest">Newest</option>
                        <option value="price_low_high">Price: Low to High</option>
                        <option value="price_high_low">Price: High to Low</option>
                        <option value="rating">Rating</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Show:</label>
                      <select
                        value={perPage}
                        onChange={(e) => {
                          const newPerPage = Number(e.target.value);
                          setPerPage(newPerPage);
                          // Auto-apply when per page changes
                          const params: Record<string, any> = {};
                          if (searchQuery) params.search = searchQuery;
                          if (selectedCategories.length) params.category = selectedCategories[0];
                          if (selectedBrands.length) params.brands = selectedBrands.join(',');
                          if (priceRange.min > 0) params.min_price = priceRange.min;
                          if (priceRange.max < 1000) params.max_price = priceRange.max;
                          if (selectedRating > 0) params.rating = selectedRating;
                          if (availability !== 'all') params.availability = availability;
                          if (sortBy !== 'popularity') params.sort = sortBy;
                          params.per_page = newPerPage;
                          
                          router.visit(route('store.products', storeSlug), {
                            data: params,
                            preserveState: true,
                            preserveScroll: true
                          });
                        }}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-gray-600">
                  Showing {pagination.from}-{pagination.to} of {pagination.total} products
                </div>
              </div>

              {/* Products Grid/List */}
              {products.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {products.map((product) => (
                    viewMode === 'list' ? (
                      <div key={product.id} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex h-56">
                          <Link href={route('store.product', { storeSlug, id: product.id })} className="w-56 flex-shrink-0 relative overflow-hidden">
                            <img 
                              src={getImageUrl(product.cover_image) || `https://placehold.co/300x300?text=${encodeURIComponent(product.name)}`}
                              alt={product.name}
                              className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500"
                            />
                            {product.sale_price && (
                              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                SALE
                              </div>
                            )}
                          </Link>
                          <div className="flex-1 p-8">
                            <div className="flex justify-between items-start h-full">
                              <div className="flex-1">
                                <div className="mb-2">
                                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-100 px-2 py-1 rounded-full">
                                    {product.category?.name || 'Electronics'}
                                  </span>
                                </div>
                                <Link href={route('store.product', { storeSlug, id: product.id })}>
                                  <h3 className="text-xl font-bold mb-3 text-slate-800 hover:text-blue-600 transition-colors leading-tight">{product.name}</h3>
                                </Link>
                                {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                                  <div className="flex items-center mb-4">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => {
                                        const rating = product.average_rating || product.rating || 0;
                                        return (
                                          <Star key={star} className={`h-5 w-5 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        );
                                      })}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-600 ml-2">({Number(product.average_rating || product.rating || 0).toFixed(1)})</span>
                                    <span className="text-xs text-blue-600 ml-2 font-medium">• {product.total_reviews || product.reviews_count || 0} reviews</span>
                                  </div>
                                )}
                                <div className="flex items-center mb-4">
                                  {product.sale_price ? (
                                    <>
                                      <span className="text-2xl font-bold text-blue-600">{formatCurrency(product.sale_price, storeSettings, currencies)}</span>
                                      <span className="text-lg text-gray-500 line-through ml-3">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                      <span className="ml-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                        {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-2xl font-bold text-slate-800">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  {product.stock > 0 ? (
                                    <div className="flex items-center text-green-600 text-sm font-semibold">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                      <span>In Stock ({product.stock} available)</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-red-600 text-sm font-semibold">
                                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                      <span>Out of Stock</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="ml-8 flex flex-col justify-center space-y-3">
                                <AddToCartButton
                                  product={product}
                                  storeSlug={storeSlug}
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                />
                                <WishlistButton productId={product.id} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ElectronicsProductCard
                        key={product.id}
                        product={product}
                        storeSettings={storeSettings}
                        currencies={currencies}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => goToPage(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 border rounded-md text-sm ${
                            page === pagination.current_page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => goToPage(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}