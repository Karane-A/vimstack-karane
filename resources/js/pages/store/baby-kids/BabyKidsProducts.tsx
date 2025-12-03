import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Search, Filter, Grid, List, Star, Heart, Baby, Gift, Users, Award } from 'lucide-react';
import BabyKidsProductCard from '@/components/store/baby-kids/BabyKidsProductCard';
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

interface BabyKidsProductsProps {
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
      className={`p-3 rounded-full transition-all duration-300 shadow-lg transform hover:scale-110 ${
        isInWishlist(productId) 
          ? 'bg-pink-500 text-white' 
          : 'bg-white text-pink-500 hover:bg-pink-500 hover:text-white border-2 border-pink-300'
      }`}
    >
      <Heart className="w-4 h-4" fill="currentColor" />
    </button>
  );
}

export default function BabyKidsProducts({
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
}: BabyKidsProductsProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'baby-kids-store';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.category ? [filters.category] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(filters.brands || []);
  const [priceRange, setPriceRange] = useState({ min: filters.min_price || 0, max: filters.max_price || 200 });
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
    if (priceRange.max < 200) params.max_price = priceRange.max;
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
    setPriceRange({ min: 0, max: 200 });
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
      <Head title={`Baby & Kids Collection - ${store.name || 'Baby Store'}`} />
      
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
        <div className="bg-pink-50 py-4 border-b border-pink-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', storeSlug)} className="text-pink-600 hover:text-pink-700">Home</Link>
              <span className="mx-2 text-pink-400">/</span>
              <span className="text-gray-900 font-medium">Baby & Kids</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-pink-50 py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">Baby & Kids Collection</h1>
              <div className="w-24 h-1 bg-pink-400 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Adorable, comfortable, and safe clothing for your precious little ones
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="relative">
                  <div className="absolute top-3 left-3 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                  <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-800">Filter Options</h3>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pink-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                          placeholder="Search baby items..."
                          className="w-full pl-10 pr-4 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Age Groups</label>
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
                              className="mr-2 text-pink-500 focus:ring-pink-400 rounded"
                            />
                            <span className="text-sm text-gray-700">{category.name}</span>
                            {category.products_count && (
                              <span className="ml-auto text-xs text-gray-500 bg-pink-100 px-2 py-1 rounded-full">({category.products_count})</span>
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
                          className="w-full px-3 py-2 border-2 border-pink-200 rounded-xl text-sm focus:outline-none focus:border-pink-400"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                          placeholder="Max"
                          className="w-full px-3 py-2 border-2 border-pink-200 rounded-xl text-sm focus:outline-none focus:border-pink-400"
                        />
                      </div>
                    </div>

                    {/* Brands */}
                    {brands.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Brands</label>
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
                                className="mr-2 text-pink-500 focus:ring-pink-400 rounded"
                              />
                              <span className="text-sm text-gray-700">{brand.name}</span>
                              {brand.products_count && (
                                <span className="ml-auto text-xs text-gray-500 bg-pink-100 px-2 py-1 rounded-full">({brand.products_count})</span>
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
                              className="mr-2 text-pink-500 focus:ring-pink-400"
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
                      <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="availability"
                            checked={availability === 'all'}
                            onChange={() => setAvailability('all')}
                            className="mr-2 text-pink-500 focus:ring-pink-400"
                          />
                          <span className="text-sm text-gray-700">All Items</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="availability"
                            checked={availability === 'in_stock'}
                            onChange={() => setAvailability('in_stock')}
                            className="mr-2 text-pink-500 focus:ring-pink-400"
                          />
                          <span className="text-sm text-gray-700">In Stock</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="availability"
                            checked={availability === 'out_of_stock'}
                            onChange={() => setAvailability('out_of_stock')}
                            className="mr-2 text-pink-500 focus:ring-pink-400"
                          />
                          <span className="text-sm text-gray-700">Out of Stock</span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={applyFilters}
                      className="w-full bg-pink-500 text-white py-3 px-6 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:w-3/4">
                {/* Toolbar */}
                <div className="relative mb-8">
                  <div className="absolute top-3 left-3 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                  <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className="lg:hidden flex items-center px-3 py-2 border-2 border-pink-300 rounded-xl hover:bg-pink-50"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600'}`}
                          >
                            <Grid className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600'}`}
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
                              if (priceRange.max < 200) params.max_price = priceRange.max;
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
                            className="border-2 border-pink-200 rounded-xl px-3 py-1 text-sm focus:outline-none focus:border-pink-400"
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
                              if (priceRange.max < 200) params.max_price = priceRange.max;
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
                            className="border-2 border-pink-200 rounded-xl px-3 py-1 text-sm focus:outline-none focus:border-pink-400"
                          >
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      Showing {pagination.from}-{pagination.to} of {pagination.total} adorable items
                    </div>
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
                        <div key={product.id} className="relative">
                          <div className="absolute top-3 left-3 w-full h-full bg-pink-200 rounded-3xl opacity-30"></div>
                          <div className="relative bg-white rounded-3xl shadow-lg border-2 border-pink-300 overflow-hidden">
                            <div className="flex p-4">
                              <Link href={route('store.product', { storeSlug, id: product.id })} className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-2xl bg-pink-50">
                                <img 
                                  src={getImageUrl(product.cover_image) || `https://placehold.co/400x400/fef7f7/ec4899?text=${encodeURIComponent(product.name)}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                {product.sale_price && (
                                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    SALE
                                  </div>
                                )}
                              </Link>
                              <div className="flex-1 ml-4">
                                <div className="flex justify-between items-start h-full">
                                  <div className="flex-1">
                                    <div className="mb-1">
                                      <span className="text-xs font-medium text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                                        {product.category?.name || 'Baby & Kids'}
                                      </span>
                                    </div>
                                    <Link href={route('store.product', { storeSlug, id: product.id })}>
                                      <h3 className="text-sm font-bold text-gray-800 mb-2 hover:text-pink-600 transition-colors line-clamp-1">{product.name}</h3>
                                    </Link>
                                    {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                                      <div className="flex items-center mb-2">
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((star) => {
                                            const rating = product.average_rating || product.rating || 0;
                                            return (
                                              <Star key={star} className={`h-3 w-3 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                            );
                                          })}
                                        </div>
                                        <span className="text-xs text-gray-500 ml-1">({product.total_reviews || product.reviews_count || 0})</span>
                                      </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        {product.sale_price ? (
                                          <>
                                            <span className="text-lg font-bold text-red-500">{formatCurrency(product.sale_price, storeSettings, currencies)}</span>
                                            <span className="text-sm text-gray-500 line-through">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                          </>
                                        ) : (
                                          <span className="text-lg font-bold text-gray-800">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                        )}
                                      </div>
                                      <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-1 ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        <span className="text-xs text-gray-600">
                                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="ml-3 flex flex-col items-center space-y-2">
                                    <div className="relative">
                                      <AddToCartButton
                                        product={product}
                                        storeSlug={storeSlug}
                                        className="w-10 h-10 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center p-0 text-[0px] [&>svg]:mr-0 shadow-lg"
                                      />
                                    </div>
                                    <WishlistButton productId={product.id} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <BabyKidsProductCard
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
                      <Baby className="h-16 w-16 mx-auto mb-6 opacity-50 text-pink-400" />
                      <h3 className="text-xl font-bold mb-3 text-gray-700">No baby items found</h3>
                      <p className="text-gray-600">Try adjusting your filters to discover more adorable items</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="bg-pink-500 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg"
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
                        className="px-4 py-2 border-2 border-pink-200 rounded-xl text-sm hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-4 py-2 border-2 rounded-xl text-sm ${
                              page === pagination.current_page
                                ? 'bg-pink-500 text-white border-pink-500'
                                : 'border-pink-200 hover:bg-pink-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => goToPage(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="px-4 py-2 border-2 border-pink-200 rounded-xl text-sm hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
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