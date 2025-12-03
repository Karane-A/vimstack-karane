import React, { useEffect, useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import PWAInstallPopup from './PWAInstallPopup';

interface PWAProviderProps {
  children: React.ReactNode;
  store?: {
    favicon?: string;
    pwa?: {
      enabled: boolean;
      name: string;
      short_name: string;
      description: string;
      theme_color: string;
      background_color: string;
      icon?: string;
      manifest_url: string;
      sw_url: string;
    };
  };
}

export default function PWAProvider({ children, store }: PWAProviderProps) {
  const { canInstall, install } = usePWAInstall();
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);



  useEffect(() => {
    if (!store?.pwa?.enabled) {
      return;
    }
    
    // Check if PWA is already installed
    const isPWAInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone === true ||
             document.referrer.includes('android-app://');
    };
    
    // Don't show popup if PWA is already installed
    if (isPWAInstalled()) {
      return;
    }
    

    // Add PWA meta tags
    const addMetaTag = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    const addLinkTag = (rel: string, href: string, type?: string) => {
      const existing = document.querySelector(`link[rel="${rel}"]`);
      if (existing) {
        existing.setAttribute('href', href);
      } else {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (type) link.type = type;
        document.head.appendChild(link);
      }
    };

    // PWA meta tags
    addMetaTag('application-name', store.pwa.name);
    addMetaTag('apple-mobile-web-app-capable', 'yes');
    addMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    addMetaTag('apple-mobile-web-app-title', store.pwa.short_name);
    addMetaTag('description', store.pwa.description);
    addMetaTag('format-detection', 'telephone=no');
    addMetaTag('mobile-web-app-capable', 'yes');
    addMetaTag('msapplication-config', '/browserconfig.xml');
    addMetaTag('msapplication-TileColor', store.pwa.theme_color);
    addMetaTag('msapplication-tap-highlight', 'no');
    addMetaTag('theme-color', store.pwa.theme_color);

    // Manifest link
    addLinkTag('manifest', store.pwa.manifest_url, 'application/manifest+json');

    // Apple touch icons
    if (store.pwa.icon) {
      addLinkTag('apple-touch-icon', store.pwa.icon);
      addLinkTag('icon', store.pwa.icon, 'image/png');
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(store.pwa.sw_url)
        .then(() => navigator.serviceWorker.ready)
        .catch(() => {});
    }

    // Add click listener to trigger install check
    const handleUserInteraction = () => {
      setTimeout(() => {
        if (!hasShownPopup && !localStorage.getItem('pwa-install-dismissed') && canInstall) {
          setShowInstallPopup(true);
          setHasShownPopup(true);
        }
      }, 500);
    };
    
    document.addEventListener('click', handleUserInteraction, { once: true });
    
    // Show popup after delay - only if not installed and installable
    const timer = setTimeout(() => {
      if (!hasShownPopup && !localStorage.getItem('pwa-install-dismissed') && canInstall) {
        setShowInstallPopup(true);
        setHasShownPopup(true);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [store?.pwa, canInstall, hasShownPopup]);

  const handleInstall = async () => {
    const result = await install();
    if (result === 'accepted') {
      setShowInstallPopup(false);
    } else if (result === 'dismissed') {
      setShowInstallPopup(false);
    } else {
      // Force manual install instructions
      const isChrome = /Chrome/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isChrome) {
        alert('To install ' + store?.pwa?.name + ':\n\n1. Click the install icon in address bar\n2. Or go to Menu (⋮) > "Install ' + store?.pwa?.name + '"');
      } else if (isSafari) {
        alert('To install ' + store?.pwa?.name + ':\n\n1. Tap Share button (□↑)\n2. Select "Add to Home Screen"');
      } else {
        alert('To install ' + store?.pwa?.name + ':\n\nLook for install option in your browser menu');
      }
      setShowInstallPopup(false);
    }
  };

  const handleClosePopup = () => {
    setShowInstallPopup(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return (
    <>
      {children}
      {store?.pwa?.enabled && (
        <PWAInstallPopup
          isVisible={showInstallPopup}
          onInstall={handleInstall}
          onClose={handleClosePopup}
          storeName={store.pwa.name}
          storeIcon={store.favicon || store.pwa.icon}
          themeColors={{
            primary: store.pwa.theme_color,
            background: store.pwa.background_color
          }}
        />
      )}
    </>
  );
}