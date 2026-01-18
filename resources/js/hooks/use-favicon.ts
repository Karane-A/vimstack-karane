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
    // Remove existing favicon links first
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());
    
    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    
    // Set appropriate type based on file extension
    if (faviconUrl.endsWith('.svg')) {
      link.type = 'image/svg+xml';
    } else if (faviconUrl.endsWith('.ico')) {
      link.type = 'image/x-icon';
    } else if (faviconUrl.endsWith('.png')) {
      link.type = 'image/png';
    }
    
    link.href = faviconUrl;
    document.head.appendChild(link);
  }, [favicon]);
}