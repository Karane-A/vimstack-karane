import React from 'react';
import Header from '@/components/store/Header';
import storeTheme from '@/config/store-theme';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { StoreContentProvider, useStoreContent } from '@/contexts/StoreContentContext';
import { getThemeComponents } from '@/config/theme-registry';
import { useStoreFavicon } from '@/hooks/use-store-favicon';
import PWAProvider from '@/components/pwa/PWAProvider';

interface StoreLayoutProps {
  children: React.ReactNode;
  storeName?: string;
  logo?: string;
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  customPages?: Array<{
    id: number;
    name: string;
    href: string;
  }>;
  storeId?: number;
  storeContent?: any;
  customFooter?: React.ReactNode;
  theme?: string;
  store?: any;
}

function StoreLayoutContent({
  children,
  storeName,
  logo,
  cartCount,
  wishlistCount,
  isLoggedIn,
  userName,
  customPages,
  customFooter,
  theme
}: Omit<StoreLayoutProps, 'storeId' | 'storeContent'>) {
  // Set store-specific favicon
  useStoreFavicon();
  
  const { storeContent } = useStoreContent();
  const content = Object.keys(storeContent).length > 0 ? storeContent : storeTheme;
  
  // Get theme-specific footer component
  const components = getThemeComponents(theme || 'default');
  const ThemeFooter = components.Footer;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        storeName={storeName}
        logo={logo}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
        customPages={customPages}
        content={content.header}
        theme={theme}
      />
      
      <main className="flex-grow">
        {children}
      </main>
      
      {customFooter || (
        <ThemeFooter 
          storeName={storeName}
          logo={logo}
          content={content.footer}
        />
      )}
    </div>
  );
}

export default function StoreLayout({
  children,
  storeName = storeTheme.store.name,
  logo = storeTheme.store.logo,
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  userName = "",
  customPages = [],
  storeId = 1,
  storeContent = {},
  customFooter,
  theme = 'default',
  store
}: StoreLayoutProps) {
  return (
    <PWAProvider store={store}>
      <CartProvider storeId={storeId} isLoggedIn={isLoggedIn}>
        <WishlistProvider>
          <StoreContentProvider 
            initialContent={storeContent}
            storeId={storeId}
          >
            <StoreLayoutContent
              storeName={storeName}
              logo={logo}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              isLoggedIn={isLoggedIn}
              userName={userName}
              customPages={customPages}
              customFooter={customFooter}
              theme={theme}
            >
              {children}
            </StoreLayoutContent>
          </StoreContentProvider>
        </WishlistProvider>
      </CartProvider>
    </PWAProvider>
  );
}