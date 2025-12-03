import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Search, Filter, Grid, List, Star, Heart, Sparkles, Award, Users } from 'lucide-react';
import PerfumeProductCard from '@/components/store/perfume-fragrances/PerfumeProductCard';
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
  rating?: number;
  total_reviews?: number;
  reviews_count?: number;
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

interface PerfumeProductsProps {
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

function WishlistButton({ productId }: { productId: number }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  return (
    <button 
      onClick={() => toggleWishlist(productId)}
      className={`w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-300 ${
        isInWishlist(productId) ? 'text-red-500' : 'text-gray-600'
      }`}
    >
      <Heart className={`w-5 h-5 ${isInWishlist(productId) ? 'fill-current' : ''}`} />
    </button>
  );
}

export default function PerfumeProducts({
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
}: PerfumeProductsProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'perfume-store';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.category ? [filters.category] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(filters.brands || []);
  const [priceRange, setPriceRange] = useState({ min: filters.min_price || 0, max: filters.max_price || 500 });
  const [selectedRating, setSelectedRating] = useState(Number(filters.rating) || 0);
  const [availability, setAvailability] = useState(filters.availability || 'all');
  const [sortBy, setSortBy] = useState(filters.sort || 'popularity');
  const [perPage, setPerPage] = useState(filters.per_page || 12);

  const applyFilters = () => {
    const params: Record<string, any> = {};
    
    if (searchQuery) params.search = searchQuery;
    if (selectedCategories.length) params.category = selectedCategories[0];
    if (selectedBrands.length) params.brands = selectedBrands.join(',');
    if (priceRange.min > 0) params.min_price = priceRange.min;
    if (priceRange.max < 500) params.max_price = priceRange.max;
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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 500 });
    setSelectedRating(0);
    setAvailability('all');
    setSortBy('popularity');
    setPerPage(12);
    
    router.visit(route('store.products', storeSlug), {
      preserveState: true,
      preserveScroll: true
    });
  };

  const goToPage = (page: number) => {
    const currentParams = new URLSearchParams(window.location.search);
    const params: Record<string, any> = {};
    
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
      <Head title={`Fragrance Collection - ${store.name || 'Perfume Store'}`} />
      
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
        <div className="bg-purple-50 py-4 border-b border-purple-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', storeSlug)} className="text-purple-600 hover:text-purple-700">Home</Link>
              <span className="mx-2 text-purple-400">/</span>
              <span className="text-gray-900 font-medium">Fragrances</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-light text-purple-800 mb-6">
                Fragrance Collection
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Discover luxury fragrances that tell your unique story of elegance and sophistication
              </p>
            </div>
          </div>
        </section>

        <div className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-purple-800">Refine Search</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Fragrances</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Search perfumes..."
                        className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-full focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Fragrance Families</label>
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
                            className="mr-2 text-purple-600 focus:ring-purple-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                          {category.products_count && (
                            <span className="ml-auto text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded-full">({category.products_count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-purple-200 rounded-full text-sm focus:outline-none focus:border-purple-400"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-purple-200 rounded-full text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {/* Brands */}
                  {brands.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Perfume Houses</label>
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
                              className="mr-2 text-purple-600 focus:ring-purple-500 rounded"
                            />
                            <span className="text-sm text-gray-700">{brand.name}</span>
                            {brand.products_count && (
                              <span className="ml-auto text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded-full">({brand.products_count})</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="radio"
                            name="rating"
                            checked={selectedRating === rating}
                            onChange={() => setSelectedRating(rating)}
                            className="mr-2 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
  
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === 'all'}
                          onChange={() => setAvailability('all')}
                          className="mr-2 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">All Fragrances</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === 'in_stock'}
                          onChange={() => setAvailability('in_stock')}
                          className="mr-2 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">In Stock</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === 'out_of_stock'}
                          onChange={() => setAvailability('out_of_stock')}
                          className="mr-2 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">Out of Stock</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={applyFilters}
                    className="w-full bg-purple-800 text-white py-3 px-6 rounded-full font-medium hover:bg-purple-900 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:w-3/4">
                {/* Toolbar */}
                <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden flex items-center px-3 py-2 border border-purple-200 rounded-full hover:bg-purple-50"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-600'}`}
                        >
                          <Grid className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-600'}`}
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
                            const params: Record<string, any> = {};
                            if (searchQuery) params.search = searchQuery;
                            if (selectedCategories.length) params.category = selectedCategories[0];
                            if (selectedBrands.length) params.brands = selectedBrands.join(',');
                            if (priceRange.min > 0) params.min_price = priceRange.min;
                            if (priceRange.max < 500) params.max_price = priceRange.max;
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
                          className="border border-purple-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-purple-400"
                        >
                          <option value="popularity">Most Popular</option>
                          <option value="newest">New Arrivals</option>
                          <option value="price_low_high">Price: Low to High</option>
                          <option value="price_high_low">Price: High to Low</option>
                          <option value="rating">Highest Rated</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Show:</label>
                        <select
                          value={perPage}
                          onChange={(e) => {
                            const newPerPage = Number(e.target.value);
                            setPerPage(newPerPage);
                            const params: Record<string, any> = {};
                            if (searchQuery) params.search = searchQuery;
                            if (selectedCategories.length) params.category = selectedCategories[0];
                            if (selectedBrands.length) params.brands = selectedBrands.join(',');
                            if (priceRange.min > 0) params.min_price = priceRange.min;
                            if (priceRange.max < 500) params.max_price = priceRange.max;
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
                          className="border border-purple-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-purple-400"
                        >
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                          <option value={48}>48</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    Showing {pagination.from}-{pagination.to} of {pagination.total} fragrances
                  </div>
                </div>

                {/* Products Grid/List */}
                {products.length > 0 ? (
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-6'
                  }>
                    {products.map((product) => (
                      viewMode === 'list' ? (
                        <div key={product.id} className="bg-white rounded-2xl shadow-md border border-purple-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                          <div className="flex h-40">
                            <Link href={route('store.product', { storeSlug, id: product.id })} className="w-32 flex-shrink-0 relative overflow-hidden rounded-l-2xl bg-purple-50">
                              <img 
                                src={getImageUrl(product.cover_image) || `https://placehold.co/300x400/fafaf9/7c3aed?text=${encodeURIComponent(product.name)}`}
                                alt={product.name}
                                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                              />
                              {product.sale_price && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                                  SALE
                                </div>
                              )}
                            </Link>
                            <div className="flex-1 p-4">
                              <div className="flex justify-between items-start h-full">
                                <div className="flex-1">
                                  <div className="mb-1">
                                    <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                                      {product.category?.name || 'Fragrance'}
                                    </span>
                                  </div>
                                  <Link href={route('store.product', { storeSlug, id: product.id })}>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-purple-800 transition-colors line-clamp-1">{product.name}</h3>
                                  </Link>
                                  {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                                    <div className="flex items-center mb-2">
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                          const rating = product.average_rating || product.rating || 0;
                                          return (
                                            <Star key={star} className={`h-3 w-3 ${star <= Math.floor(Number(rating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                          );
                                        })}
                                      </div>
                                      <span className="text-xs text-gray-500 ml-2">({product.total_reviews || product.reviews_count || 0})</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {product.sale_price ? (
                                        <>
                                          <span className="text-xl font-semibold text-purple-800">{formatCurrency(product.sale_price, storeSettings, currencies)}</span>
                                          <span className="text-gray-500 line-through text-sm">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                        </>
                                      ) : (
                                        <span className="text-xl font-semibold text-purple-800">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <div className={`w-2 h-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                      <span className="text-xs text-gray-600">
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-4 flex items-center space-x-2">
                                  <div className="relative">
                                    <AddToCartButton
                                      product={product}
                                      storeSlug={storeSlug}
                                      className="w-10 h-10 bg-purple-800 hover:bg-purple-900 text-white rounded-full flex items-center justify-center p-0 text-[0px] [&>svg]:mr-0 shadow-md"
                                    />
                                  </div>
                                  <WishlistButton productId={product.id} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <PerfumeProductCard
                          key={product.id}
                          product={product}
                          storeSettings={storeSettings}
                          currencies={currencies}
                        />
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-500 mb-6">
                      <Sparkles className="h-16 w-16 mx-auto mb-6 opacity-50 text-purple-400" />
                      <h3 className="text-xl font-medium mb-3 text-gray-700">No fragrances found</h3>
                      <p className="text-gray-600">Try adjusting your filters to discover more scents</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="bg-purple-800 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-900 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="mt-12 flex items-center justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => goToPage(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-4 py-2 border border-purple-200 rounded-full text-sm hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-4 py-2 border rounded-full text-sm ${
                              page === pagination.current_page
                                ? 'bg-purple-800 text-white border-purple-800'
                                : 'border-purple-200 hover:bg-purple-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => goToPage(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="px-4 py-2 border border-purple-200 rounded-full text-sm hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}