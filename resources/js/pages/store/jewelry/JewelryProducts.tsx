import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { Search, Filter, Grid, List, Star, Heart, Crown, Gem, Shield } from 'lucide-react';
import JewelryProductCard from '@/components/store/jewelry/JewelryProductCard';
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

interface JewelryProductsProps {
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
      className="bg-white border-2 border-yellow-600 text-yellow-600 p-3 hover:bg-yellow-600 hover:text-white transition-colors duration-300"
    >
      <Heart className={`h-5 w-5 ${isInWishlist(productId) ? 'text-red-500 fill-red-500' : ''}`} />
    </button>
  );
}

export default function JewelryProducts({
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
}: JewelryProductsProps) {
  const { props } = usePage();
  const storeSlug = props.store?.slug || 'jewelry-store';
  
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
      <Head title={`Jewelry Collection - ${store.name || 'Jewelry Store'}`} />
      
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
        <div className="bg-neutral-50 py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', storeSlug)} className="text-neutral-500 hover:text-yellow-600">Home</Link>
              <span className="mx-2 text-neutral-400">/</span>
              <span className="text-neutral-900 font-medium">Collection</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-yellow-50 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600 rounded-full shadow-lg mb-8">
                <Gem className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">
                Fine Jewelry Collection
              </h1>
              <div className="w-24 h-px bg-yellow-500 mx-auto mb-6"></div>
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto leading-relaxed">
                Discover exquisite pieces crafted with precision and passion, each telling a story of timeless elegance
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white shadow-lg p-6 sticky top-24 border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-serif text-neutral-900">Refine Selection</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2 uppercase tracking-wide">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                      placeholder="Search jewelry..."
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 focus:outline-none focus:border-yellow-600"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Collections</label>
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
                          className="mr-2 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-neutral-700">{category.name}</span>
                        {category.products_count && (
                          <span className="ml-auto text-xs text-neutral-500">({category.products_count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-yellow-600"
                    />
                    <span className="text-neutral-500">-</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-yellow-600"
                    />
                  </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Designers</label>
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
                            className="mr-2 text-yellow-600 focus:ring-yellow-500"
                          />
                          <span className="text-sm text-neutral-700">{brand.name}</span>
                          {brand.products_count && (
                            <span className="ml-auto text-xs text-neutral-500">({brand.products_count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                          className="mr-2 text-yellow-600 focus:ring-yellow-500"
                        />
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-300'}`}
                            />
                          ))}

                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'all'}
                        onChange={() => setAvailability('all')}
                        className="mr-2 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-neutral-700">All Items</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'in_stock'}
                        onChange={() => setAvailability('in_stock')}
                        className="mr-2 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-neutral-700">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'out_of_stock'}
                        onChange={() => setAvailability('out_of_stock')}
                        className="mr-2 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-neutral-700">Out of Stock</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full bg-yellow-600 text-white py-3 px-6 font-medium uppercase tracking-wide hover:bg-yellow-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="bg-white shadow-lg p-6 mb-8 border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center px-3 py-2 border border-neutral-300 hover:bg-neutral-50"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-yellow-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-neutral-600">Sort by:</label>
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
                        className="border border-neutral-300 px-3 py-1 text-sm focus:outline-none focus:border-yellow-600"
                      >
                        <option value="popularity">Most Popular</option>
                        <option value="newest">New Arrivals</option>
                        <option value="price_low_high">Price: Low to High</option>
                        <option value="price_high_low">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-neutral-600">Show:</label>
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
                        className="border border-neutral-300 px-3 py-1 text-sm focus:outline-none focus:border-yellow-600"
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-neutral-600">
                  Showing {pagination.from}-{pagination.to} of {pagination.total} pieces
                </div>
              </div>

              {/* Products Grid/List */}
              {products.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-8'
                }>
                  {products.map((product) => (
                    viewMode === 'list' ? (
                      <div key={product.id} className="bg-white shadow-lg border hover:shadow-xl transition-shadow duration-300">
                        <div className="flex">
                          <Link href={route('store.product', { storeSlug, id: product.id })} className="w-64 aspect-square flex-shrink-0 relative overflow-hidden bg-neutral-50">
                            <img 
                              src={getImageUrl(product.cover_image) || `https://placehold.co/400x400/f5f5f5/d4af37?text=${encodeURIComponent(product.name)}`}
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                            {product.sale_price && (
                              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-medium px-3 py-1 uppercase">
                                SALE
                              </div>
                            )}
                          </Link>
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start h-full">
                              <div className="flex-1">
                                <div className="mb-3">
                                  <span className="text-xs font-medium text-yellow-600 uppercase tracking-wider">
                                    {product.category?.name || 'Fine Jewelry'}
                                  </span>
                                </div>
                                <Link href={route('store.product', { storeSlug, id: product.id })}>
                                  <h3 className="text-2xl font-serif text-neutral-900 mb-4 hover:text-yellow-700 transition-colors leading-tight">{product.name}</h3>
                                </Link>
                                {(product.average_rating || product.total_reviews) && (
                                  <div className="flex items-center mb-4">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => {
                                        const rating = product.average_rating || 0;
                                        return (
                                          <Star key={star} className={`h-5 w-5 ${star <= Math.floor(Number(rating)) ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-300'}`} />
                                        );
                                      })}
                                    </div>
                                    <span className="text-sm text-neutral-600 ml-2">({Number(product.average_rating || 0).toFixed(1)})</span>
                                    <span className="text-xs text-neutral-500 ml-2">• {product.total_reviews || 0} reviews</span>
                                  </div>
                                )}
                                <div className="flex items-center mb-6">
                                  {product.sale_price ? (
                                    <>
                                      <span className="text-3xl font-medium text-neutral-900">{formatCurrency(product.sale_price, storeSettings, currencies)}</span>
                                      <span className="text-lg text-neutral-500 line-through ml-3">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                      <span className="ml-3 bg-red-100 text-red-700 text-xs font-medium px-2 py-1 uppercase">
                                        {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-3xl font-medium text-neutral-900">{formatCurrency(product.price, storeSettings, currencies)}</span>
                                  )}
                                </div>
                                <div className="flex items-center mb-6">
                                  {product.stock > 0 ? (
                                    <div className="flex items-center text-green-600 text-sm">
                                      <Shield className="h-4 w-4 mr-2" />
                                      <span>In Stock ({product.stock} available)</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-red-600 text-sm">
                                      <Crown className="h-4 w-4 mr-2" />
                                      <span>Made to Order</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="ml-8 flex flex-col justify-center space-y-4">
                                <div className="flex space-x-3">
                                  <AddToCartButton
                                    product={product}
                                    storeSlug={storeSlug}
                                    className="bg-yellow-600 text-white px-8 py-3 font-medium uppercase tracking-wide hover:bg-yellow-700 transition-colors flex-1"
                                  />
                                  <WishlistButton productId={product.id} />
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <JewelryProductCard
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
                  <div className="text-neutral-500 mb-6">
                    <Gem className="h-16 w-16 mx-auto mb-6 opacity-50" />
                    <h3 className="text-xl font-serif mb-3 text-neutral-700">No jewelry found</h3>
                    <p className="text-neutral-600">Try adjusting your filters to discover more pieces</p>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="bg-yellow-600 text-white px-6 py-3 font-medium uppercase tracking-wide hover:bg-yellow-700 transition-colors"
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
                      className="px-4 py-2 border border-neutral-300 text-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 border text-sm ${
                            page === pagination.current_page
                              ? 'bg-yellow-600 text-white border-yellow-600'
                              : 'border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => goToPage(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-4 py-2 border border-neutral-300 text-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
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