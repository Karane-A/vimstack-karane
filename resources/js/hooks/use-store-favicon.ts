import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

interface StorePageProps {
  store?: {
    id?: number;
    name?: string;
    logo?: string;
    favicon?: string;
    description?: string;
    theme?: string;
    slug?: string;
  };
}

/**
 * Hook to set store-specific favicon for theme pages
 */
export function useStoreFavicon() {
  const { props } = usePage<StorePageProps>();
  const favicon = props.store?.favicon;

  useEffect(() => {
    if (!favicon || favicon.trim() === '') {
      return;
    }

    // Convert relative path to full URL if needed
    const baseUrl = props.base_url || props.globalSettings?.base_url || window.location.origin;
    let faviconUrl = favicon.startsWith('http') ? favicon : 
                     favicon.startsWith('/storage/') ? `${baseUrl}${favicon}` :
                     favicon.startsWith('/') ? `${baseUrl}${favicon}` : favicon;
    
    // Add cache-busting parameter to ensure favicon is not cached
    const separator = faviconUrl.includes('?') ? '&' : '?';
    faviconUrl += `${separator}t=${Date.now()}`;

    // Use setTimeout to ensure DOM is ready and to override any default favicon
    const timeoutId = setTimeout(() => {
      // Remove all existing favicon links
      const existingLinks = document.querySelectorAll('link[rel*="icon"]');
      existingLinks.forEach(link => link.remove());

      // Create new favicon link with proper attributes
      const link = document.createElement('link');
      link.rel = 'icon';
      
      // Set appropriate type based on file extension
      if (faviconUrl.endsWith('.svg')) {
        link.type = 'image/svg+xml';
      } else if (faviconUrl.endsWith('.ico')) {
        link.type = 'image/x-icon';
      } else if (faviconUrl.endsWith('.png')) {
        link.type = 'image/png';
      } else {
        link.type = 'image/x-icon';
      }
      
      link.href = faviconUrl;
      
      // Add to head
      document.head.appendChild(link);
      
      // Force browser to reload favicon by creating a temporary link
      const tempLink = document.createElement('link');
      tempLink.rel = 'shortcut icon';
      tempLink.href = faviconUrl;
      document.head.appendChild(tempLink);
      
      // Remove temp link after a short delay
      setTimeout(() => {
        if (tempLink.parentNode) {
          tempLink.parentNode.removeChild(tempLink);
        }
      }, 50);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [favicon]);

  return favicon;
}