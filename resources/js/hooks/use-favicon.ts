import { useEffect } from 'react';
import { useBrand } from '@/contexts/BrandContext';

export function useFavicon() {
  const { favicon } = useBrand();

  useEffect(() => {
    if (!favicon) return;

    // Convert relative path to full URL if needed
    const faviconUrl = favicon.startsWith('http') ? favicon : 
                      favicon.startsWith('/storage/') ? `${window.location.origin}${favicon}` :
                      favicon.startsWith('/') ? `${window.location.origin}${favicon}` : favicon;

    // Update favicon in document head
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    link.href = faviconUrl;
  }, [favicon]);
}