import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Search, Filter, Grid, List, ChevronDown, X, Star, Heart } from 'lucide-react';
import FashionProductCard from '@/components/store/fashion/FashionProductCard';
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

interface FashionProductsProps {
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
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  return (
    <button 
      onClick={() => toggleWishlist(productId)}
      className="w-14 h-14 border border-gray-300 hover:border-black flex items-center justify-center transition-colors duration-300"
    >
      <Heart className={`h-5 w-5 ${isInWishlist(productId) ? 'text-black fill-black' : 'text-gray-400'}`} />
    </button>
  );
}

export default function FashionProducts({
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
}: FashionProductsProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'fashion-store';
  
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
    if (selectedCategories.length) params.categories = selectedCategories.join(',');
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
      <Head title={`Products - ${store.name || 'Fashion Store'}`} />
      
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
              <Link href={route('store.home', storeSlug)} className="text-gray-500 hover:text-pink-600">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-800 font-medium">Products</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-black text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-thin tracking-wide mb-6">Fashion Collection</h1>
              <p className="text-white/70 font-light text-lg">
                Discover the latest trends and timeless classics in our curated fashion collection
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-light tracking-wide uppercase">Filter</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-black font-light uppercase tracking-wide underline hover:no-underline transition-all"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-xs font-light mb-3 uppercase tracking-widest text-gray-500">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                      placeholder="Search..."
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent font-light"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <label className="block text-xs font-thin mb-4 uppercase tracking-widest text-gray-300">Collections</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
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
                          className="mr-2 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm">{category.name}</span>
                        {category.products_count && (
                          <span className="ml-auto text-xs text-gray-500">({category.products_count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div className="mb-8">
                    <label className="block text-xs font-thin mb-4 uppercase tracking-widest text-gray-300">Designers</label>
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
                            className="mr-2 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
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
                <div className="mb-6">
                  <label className="block text-xs font-light mb-3 uppercase tracking-widest text-gray-500">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                          className="mr-3 bg-transparent border border-gray-300 text-black focus:ring-black focus:ring-1 rounded-none"
                        />
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
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
                        className="mr-2 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm">All Products</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'in_stock'}
                        onChange={() => setAvailability('in_stock')}
                        className="mr-2 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'out_of_stock'}
                        onChange={() => setAvailability('out_of_stock')}
                        className="mr-2 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm">Out of Stock</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full border border-black text-black py-3 px-6 font-light uppercase tracking-wide hover:bg-black hover:text-white transition-all duration-300"
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
                        className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
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
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                      <div key={product.id} className="bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden group">
                        <div className="flex h-56">
                          <Link href={route('store.product', { storeSlug, id: product.id })} className="w-56 flex-shrink-0 relative overflow-hidden bg-gray-50">
                            <img 
                              src={getImageUrl(product.cover_image) || `https://placehold.co/300x300?text=${encodeURIComponent(product.name)}`}
                              alt={product.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />
                            {product.sale_price && (
                              <div className="absolute top-4 left-4 bg-black text-white text-xs font-thin px-3 py-1 uppercase tracking-widest">
                                Sale
                              </div>
                            )}
                          </Link>
                          <div className="flex-1 p-8">
                            <div className="flex justify-between items-start h-full">
                              <div className="flex-1">
                                <div className="mb-3">
                                  <span className="text-xs font-thin text-gray-500 uppercase tracking-widest">
                                    {product.category?.name || 'Ready-to-Wear'}
                                  </span>
                                </div>
                                <Link href={route('store.product', { storeSlug, id: product.id })}>
                                  <h3 className="text-2xl font-thin tracking-wide mb-4 hover:text-gray-600 transition-colors leading-tight">{product.name}</h3>
                                </Link>
                                {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                                  <div className="flex items-center mb-4">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => {
                                        const rating = product.average_rating || product.rating || 0;
                                        return (
                                          <Star key={star} className={`h-4 w-4 ${star <= Math.floor(Number(rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        );
                                      })}
                                    </div>
                                    <span className="text-sm text-gray-500 ml-3 font-thin">({Number(product.average_rating || product.rating || 0).toFixed(1)})</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {product.sale_price ? (
                                      <>
                                        <span className="text-3xl font-thin tracking-wide">{formatCurrency(product.sale_price, storeSettings, currencies)}</span>
                                        <span className="text-gray-400 line-through ml-4 text-xl font-thin">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                      </>
                                    ) : (
                                      <span className="text-3xl font-thin tracking-wide">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                    )}
                                  </div>
                                  <div className="text-xs font-thin text-gray-500 uppercase tracking-widest">
                                    {product.stock > 0 ? 'Available' : 'Sold Out'}
                                  </div>
                                </div>
                              </div>
                              <div className="ml-8 flex flex-col items-end space-y-4">
                                <div className="relative">
                                  <AddToCartButton
                                    product={product}
                                    storeSlug={storeSlug}
                                    className="w-14 h-14 border border-black hover:bg-black hover:text-white text-black flex items-center justify-center p-0 text-[0px] [&>svg]:mr-0 transition-all duration-300"
                                  />
                                </div>
                                <WishlistButton productId={product.id} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <FashionProductCard
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
                    className="text-black hover:underline"
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
                              ? 'bg-black text-white border-black'
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