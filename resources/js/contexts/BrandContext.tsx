import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getBrandSettings, type BrandSettings } from '@/pages/settings/components/brand-settings';
import { initializeTheme } from '@/hooks/use-appearance';

interface BrandContextType extends BrandSettings {
  updateBrandSettings: (settings: Partial<BrandSettings>) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children, globalSettings, user }: { children: ReactNode; globalSettings?: any; user?: any }) {
  // Always use superadmin's global settings for branding across all dashboards
  const effectiveSettings = globalSettings;
  
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => {
    const settings = getBrandSettings(effectiveSettings);
    return settings;
  });

  // Force light mode only - remove dark class on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // Listen for changes in settings
  useEffect(() => {
    const updatedSettings = getBrandSettings(effectiveSettings);
    setBrandSettings(updatedSettings);
    // Always ensure light mode
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [globalSettings]);

  const updateBrandSettings = (newSettings: Partial<BrandSettings>) => {
    setBrandSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <BrandContext.Provider value={{ ...brandSettings, updateBrandSettings }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}