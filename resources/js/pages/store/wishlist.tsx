import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight, ShoppingCart, X, Heart } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/utils/image-helper';

import { formatCurrency } from '@/utils/currency-formatter';

interface Product {
  id: number;
  product_id?: number;
  name: string;
  price: number;
  sale_price?: number;
  cover_image: string;
  stock: number;
  is_active: boolean;
  variants?: Array<{
    name: string;
    values: string[];
  }>;
  category: {
    id: number;
    name: string;
  };
}

interface WishlistProps {
  wishlistItems: Product[];
  relatedProducts?: Product[];
  store: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

function WishlistContent({ relatedProducts = [] }: { relatedProducts?: Product[] }) {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { props } = usePage();
  const storeSlug = props.store?.slug || props.theme || 'home-accessories';
  const storeSettings = props.storeSettings || {};
  const currencies = props.currencies || [];
  
  const handleAddToCart = async (item: any) => {
    // Check if product has variants - if so, redirect to product page
    if (item.variants && Array.isArray(item.variants) && item.variants.length > 0) {
      window.location.href = route('store.product', { storeSlug, id: item.product_id || item.id });
      return;
    }
    
    const product = {
      id: item.product_id || item.id,
      name: item.name,
      price: item.price,
      sale_price: item.sale_price,
      cover_image: item.cover_image
    };
    await addToCart(product, {});
  };

  const handleQuickView = (product: any) => {
    console.log('Quick view', product);
  };

  const handleRemoveFromWishlist = async (product: any) => {
    await removeFromWishlist(product.product_id || product.id);
  };



  return (
    <>
      {/* Hero Section */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">My Wishlist</h1>
              <p className="text-white/80">
                Items you've saved for later
              </p>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <Link href={route('store.home', { storeSlug })} className="text-gray-500 hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">Wishlist</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            {items.length > 0 ? (
              <>
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Price</th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Stock Status</th>
                        <th className="py-4 px-6 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        <th className="py-4 px-6 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={getImageUrl(item.cover_image)}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://placehold.co/600x600?text=${encodeURIComponent(item.name)}`;
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <Link 
                                  href={route('store.product', { storeSlug, id: item.product_id })}
                                  className="font-medium text-gray-900 hover:text-primary"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-sm text-gray-500">{item.category.name}</p>
                                {/* Show price on mobile */}
                                <div className="md:hidden mt-1">
                                  {item.sale_price ? (
                                    <div>
                                      <span className="text-primary font-medium">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                                      <span className="text-gray-400 line-through ml-2">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                    </div>
                                  ) : (
                                    <span className="font-medium">{formatCurrency(item.price, storeSettings, currencies)}</span>
                                  )}
                                </div>
                                {/* Show stock status on mobile */}
                                <div className="md:hidden mt-1">
                                  {item.stock > 0 ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      In Stock
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 hidden md:table-cell">
                            {item.sale_price ? (
                              <div>
                                <span className="text-primary font-medium">{formatCurrency(item.sale_price, storeSettings, currencies)}</span>
                                <span className="text-gray-400 line-through ml-2">{formatCurrency(item.price, storeSettings, currencies)}</span>
                              </div>
                            ) : (
                              <span className="font-medium">{formatCurrency(item.price, storeSettings, currencies)}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 hidden md:table-cell">
                            {item.stock > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button 
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              disabled={item.stock <= 0}
                              onClick={() => handleAddToCart(item)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveFromWishlist(item)}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Link 
                    href={route('store.products', { storeSlug })}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                  <Heart className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-6">Items added to your wishlist will appear here</p>
                <Link 
                  href={route('store.products', { storeSlug })}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products Section */}
        {items.length > 0 && relatedProducts.length > 0 && (
          <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    sale_price={product.sale_price}
                    cover_image={product.cover_image}
                    category={product.category}
                    stock={product.stock}
                    is_active={product.is_active}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onAddToWishlist={handleRemoveFromWishlist}
                    storeSettings={storeSettings}
                    currencies={currencies}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
}

export default function Wishlist({
  wishlistItems = [],
  relatedProducts = [],
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customPages = [],
}: WishlistProps) {
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific wishlist pages to avoid circular dependencies
  const [ThemeWishlistPage, setThemeWishlistPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeWishlistPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeWishlistPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let wishlistPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            wishlistPageModule = await import('@/pages/store/beauty-cosmetics/BeautyWishlist');
            break;
          case 'fashion':
            wishlistPageModule = await import('@/pages/store/fashion/FashionWishlist');
            break;
          case 'electronics':
            wishlistPageModule = await import('@/pages/store/electronics/ElectronicsWishlist');
            break;
          case 'jewelry':
            wishlistPageModule = await import('@/pages/store/jewelry/JewelryWishlist');
            break;
          case 'watches':
            wishlistPageModule = await import('@/pages/store/watches/WatchesWishlist');
            break;
          case 'furniture-interior':
            wishlistPageModule = await import('@/pages/store/furniture-interior/FurnitureWishlist');
            break;
          case 'cars-automotive':
            wishlistPageModule = await import('@/pages/store/cars-automotive/CarsWishlist');
            break;
          case 'baby-kids':
            wishlistPageModule = await import('@/pages/store/baby-kids/BabyKidsWishlist');
            break;
          case 'perfume-fragrances':
            wishlistPageModule = await import('@/pages/store/perfume-fragrances/PerfumeWishlist');
            break;
          default:
            setThemeWishlistPage(null);
            setIsLoading(false);
            return;
        }
        setThemeWishlistPage(() => wishlistPageModule.default);
      } catch (error) {
        console.error('Failed to load theme wishlist page:', error);
        setThemeWishlistPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeWishlistPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific wishlist page, use it
  if (ThemeWishlistPage) {
    return (
      <ThemeWishlistPage
        store={store}
        storeContent={storeContent}
        wishlistItems={wishlistItems}
        relatedProducts={relatedProducts}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
      />
    );
  }
  
  return (
    <>
      <Head title={`Wishlist - ${store.name}`} />
      
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
        <WishlistContent relatedProducts={relatedProducts} />
      </StoreLayout>
    </>
  );
}