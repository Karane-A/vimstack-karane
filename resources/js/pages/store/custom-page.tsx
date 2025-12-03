import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/layouts/StoreLayout';
import { ChevronRight } from 'lucide-react';


interface CustomPageProps {
  page: {
    id: number;
    title: string;
    content: string;
    slug: string;
    meta_title?: string;
    meta_description?: string;
    created_at: string;
    updated_at: string;
  };
  store?: any;
  storeContent?: any;
  theme?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
}

export default function CustomPage({
  page,
  store = {},
  storeContent,
  theme = 'default',
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  userName = '',
  customPages = [],
}: CustomPageProps) {
  // Get theme-specific components
  const actualTheme = store?.theme || theme;
  
  // Use dynamic imports for theme-specific custom pages to avoid circular dependencies
  const [ThemeCustomPage, setThemeCustomPage] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadThemeCustomPage = async () => {
      if (actualTheme === 'default' || actualTheme === 'home-accessories') {
        setThemeCustomPage(null);
        setIsLoading(false);
        return;
      }
      
      try {
        let customPageModule;
        switch (actualTheme) {
          case 'beauty-cosmetics':
            customPageModule = await import('@/pages/store/beauty-cosmetics/BeautyCustomPage');
            break;
          case 'fashion':
            customPageModule = await import('@/pages/store/fashion/FashionCustomPage');
            break;
          case 'electronics':
            customPageModule = await import('@/pages/store/electronics/ElectronicsCustomPage');
            break;
          case 'jewelry':
            customPageModule = await import('@/pages/store/jewelry/JewelryCustomPage');
            break;
          case 'watches':
            customPageModule = await import('@/pages/store/watches/WatchesCustomPage');
            break;
          case 'furniture-interior':
            customPageModule = await import('@/pages/store/furniture-interior/FurnitureCustomPage');
            break;
          case 'cars-automotive':
            customPageModule = await import('@/pages/store/cars-automotive/CarsCustomPage');
            break;
          case 'baby-kids':
            customPageModule = await import('@/pages/store/baby-kids/BabyKidsCustomPage');
            break;
          case 'perfume-fragrances':
            customPageModule = await import('@/pages/store/perfume-fragrances/PerfumeCustomPage');
            break;
          default:
            setThemeCustomPage(null);
            setIsLoading(false);
            return;
        }
        setThemeCustomPage(() => customPageModule.default);
      } catch (error) {
        console.error('Failed to load theme custom page:', error);
        setThemeCustomPage(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeCustomPage();
  }, [actualTheme]);
  
  // Show loading or wait for theme to load
  if (isLoading) {
    return null;
  }
  
  // If theme has a specific custom page, use it
  if (ThemeCustomPage) {
    return (
      <ThemeCustomPage
        page={page}
        store={store}
        storeContent={storeContent}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        customPages={customPages}
      />
    );
  }
  
  return (
    <>
      <Head title={`${page.title} - ${store.name}`} />
      
      <StoreLayout
        storeName={store.name}
        logo={store.logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
        storeContent={storeContent}
        storeId={store.id}
        theme={store.theme}
      >
        {/* Hero Section */}
        <div className="bg-primary text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{page.title}</h1>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm">
              <a href={`/store/${store.slug || actualTheme}`} className="text-gray-500 hover:text-primary">Home</a>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-800 font-medium">{page.title}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}