import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Search, Filter, Grid, List, Star, Heart, Car, Zap, Settings, Award } from 'lucide-react';
import CarsProductCard from '@/components/store/cars-automotive/CarsProductCard';
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

interface CarsProductsProps {
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
      className={`w-10 h-10 ${isInWishlist(productId) ? 'bg-red-600' : 'bg-gray-600'} hover:bg-black text-white flex items-center justify-center transition-colors`}
    >
      <Heart className={`h-4 w-4 ${isInWishlist(productId) ? 'fill-white' : ''}`} />
    </button>
  );
}

export default function CarsProducts({
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
}: CarsProductsProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'cars-store';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.category ? [filters.category] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(filters.brands || []);
  const [priceRange, setPriceRange] = useState({ min: filters.min_price || 0, max: filters.max_price || 5000 });
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
    if (priceRange.max < 5000) params.max_price = priceRange.max;
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
    setPriceRange({ min: 0, max: 5000 });
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
      <Head title={`Auto Parts - ${store.name || 'Auto Store'}`} />
      
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
        <div className="bg-gray-100 py-4 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', storeSlug)} className="text-gray-600 hover:text-red-600">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900 font-bold">Auto Parts</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-gray-900 text-white py-8 border-b-4 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center transform rotate-45">
                  <div className="w-6 h-6 bg-white transform -rotate-45"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-wider">AUTO PARTS</h1>
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase">Performance Collection</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="w-3 h-3 bg-red-600"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white border border-gray-200 p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-gray-900 tracking-wider uppercase">Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-bold tracking-wider uppercase"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wider uppercase">Search Parts</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Search auto parts..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3 tracking-wider uppercase">Categories</label>
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
                            className="mr-2 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">{category.name}</span>
                          {category.products_count && (
                            <span className="ml-auto text-xs text-gray-500 font-bold">({category.products_count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3 tracking-wider uppercase">Price Range</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-red-600"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* Brands */}
                  {brands.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-3 tracking-wider uppercase">Brands</label>
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
                              className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700 font-medium">{brand.name}</span>
                            {brand.products_count && (
                              <span className="ml-auto text-xs text-gray-500 font-bold">({brand.products_count})</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3 tracking-wider uppercase">Rating</label>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="radio"
                            name="rating"
                            checked={selectedRating === rating}
                            onChange={() => setSelectedRating(rating)}
                            className="mr-2 text-red-600 focus:ring-red-500"
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
                    <label className="block text-sm font-bold text-gray-700 mb-3 tracking-wider uppercase">Availability</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === 'all'}
                          onChange={() => setAvailability('all')}
                          className="mr-2 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">All Parts</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === 'in_stock'}
                          onChange={() => setAvailability('in_stock')}
                          className="mr-2 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">In Stock</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === 'out_of_stock'}
                          onChange={() => setAvailability('out_of_stock')}
                          className="mr-2 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">Out of Stock</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={applyFilters}
                    className="w-full bg-red-600 text-white py-3 px-6 font-bold tracking-wider uppercase hover:bg-red-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:w-3/4">
                {/* Toolbar */}
                <div className="bg-white border border-gray-200 p-6 mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden flex items-center px-3 py-2 border border-gray-300 hover:bg-gray-50"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          <Grid className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium">Sort by:</label>
                        <select
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            const params: Record<string, any> = {};
                            if (searchQuery) params.search = searchQuery;
                            if (selectedCategories.length) params.category = selectedCategories[0];
                            if (selectedBrands.length) params.brands = selectedBrands.join(',');
                            if (priceRange.min > 0) params.min_price = priceRange.min;
                            if (priceRange.max < 5000) params.max_price = priceRange.max;
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
                          className="border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-red-600"
                        >
                          <option value="popularity">Most Popular</option>
                          <option value="newest">New Arrivals</option>
                          <option value="price_low_high">Price: Low to High</option>
                          <option value="price_high_low">Price: High to Low</option>
                          <option value="rating">Highest Rated</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium">Show:</label>
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
                            if (priceRange.max < 5000) params.max_price = priceRange.max;
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
                          className="border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-red-600"
                        >
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                          <option value={48}>48</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600 font-medium">
                    Showing {pagination.from}-{pagination.to} of {pagination.total} auto parts
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
                        <div key={product.id} className="bg-white border border-gray-200 hover:border-red-600 transition-colors duration-300">
                          <div className="flex h-32">
                            <Link href={route('store.product', { storeSlug, id: product.id })} className="w-32 flex-shrink-0 relative overflow-hidden bg-gray-100">
                              <img 
                                src={getImageUrl(product.cover_image) || `https://placehold.co/400x400/f5f5f5/666666?text=${encodeURIComponent(product.name)}`}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                              {product.sale_price && (
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 tracking-wider uppercase">
                                  SALE
                                </div>
                              )}
                            </Link>
                            <div className="flex-1 p-4 border-l-4 border-red-600">
                              <div className="flex justify-between items-start h-full">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold tracking-widest uppercase text-red-600">
                                      {product.category?.name || 'Auto Parts'}
                                    </span>
                                    {(product.average_rating || product.rating || product.total_reviews || product.reviews_count) && (
                                      <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                          const rating = product.average_rating || product.rating || 0;
                                          return (
                                            <Star key={star} className={`h-3 w-3 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                          );
                                        })}
                                        <span className="text-xs text-gray-500 ml-1">({Number(product.average_rating || product.rating || 0).toFixed(1)})</span>
                                      </div>
                                    )}
                                  </div>
                                  <Link href={route('store.product', { storeSlug, id: product.id })}>
                                    <h3 className="text-lg font-bold text-black mb-2 hover:text-red-600 transition-colors line-clamp-1">{product.name}</h3>
                                  </Link>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {product.sale_price ? (
                                        <>
                                          <span className="text-xl font-bold text-red-600">{formatCurrency(product.sale_price, storeSettings, currencies)}</span>
                                          <span className="text-sm text-gray-500 line-through">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                        </>
                                      ) : (
                                        <span className="text-xl font-bold text-black">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <div className={`w-2 h-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <span className="text-xs font-bold tracking-wider uppercase text-gray-600">
                                        {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-4 flex items-center space-x-2">
                                  <div className="relative">
                                    <AddToCartButton
                                      product={product}
                                      storeSlug={storeSlug}
                                      className="w-10 h-10 bg-red-600 hover:bg-black text-white transition-colors flex items-center justify-center p-0 text-[0px] [&>svg]:mr-0"
                                    />
                                  </div>
                                  <WishlistButton productId={product.id} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <CarsProductCard
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
                      <Car className="h-16 w-16 mx-auto mb-6 opacity-50" />
                      <h3 className="text-xl font-bold mb-3 text-gray-700">No auto parts found</h3>
                      <p className="text-gray-600">Try adjusting your filters to discover more parts</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="bg-red-600 text-white px-6 py-3 font-bold tracking-wider uppercase hover:bg-red-700 transition-colors"
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
                        className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-4 py-2 border text-sm font-medium ${
                              page === pagination.current_page
                                ? 'bg-red-600 text-white border-red-600'
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
                        className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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