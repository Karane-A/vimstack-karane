import React, { createContext, useContext, useState, useEffect } from 'react';
import storeTheme from '@/config/store-theme';

interface StoreContentContextType {
  storeContent: any;
  isLoading: boolean;
}

const StoreContentContext = createContext<StoreContentContextType>({
  storeContent: storeTheme,
  isLoading: false
});

export const useStoreContent = () => useContext(StoreContentContext);

interface StoreContentProviderProps {
  children: React.ReactNode;
  initialContent?: any;
  storeId?: number;
}

export function StoreContentProvider({ 
  children, 
  initialContent, 
  storeId 
}: StoreContentProviderProps) {
  const [storeContent, setStoreContent] = useState(initialContent || storeTheme);
  const [isLoading, setIsLoading] = useState(!initialContent);

  useEffect(() => {
    if (initialContent && Object.keys(initialContent).length > 0) {
      setStoreContent(initialContent);
      setIsLoading(false);
    }
  }, [initialContent]);

  return (
    <StoreContentContext.Provider value={{ storeContent, isLoading }}>
      {children}
    </StoreContentContext.Provider>
  );
}