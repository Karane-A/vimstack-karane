import { useEffect } from 'react';
import { useBrand } from '@/contexts/BrandContext';

export function useDynamicTitle() {
  const { titleText } = useBrand();

  useEffect(() => {
    // Update the document title with the custom title text
    const currentTitle = document.title;
    const parts = currentTitle.split(' - ');
    
    if (parts.length > 1) {
      // Keep the page-specific part, update the app name part
      document.title = `${parts[0]} - ${titleText}`;
    } else {
      // If no page-specific title, just use the app name
      document.title = titleText;
    }
  }, [titleText]);
}