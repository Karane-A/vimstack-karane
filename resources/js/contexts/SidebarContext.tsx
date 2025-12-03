import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getSidebarSettings, SidebarSettings } from '@/components/sidebar-style-settings';

type SidebarContextType = {
  variant: SidebarSettings['variant'];
  collapsible: SidebarSettings['collapsible'];
  style: string;
  updateVariant: (variant: SidebarSettings['variant']) => void;
  updateCollapsible: (collapsible: SidebarSettings['collapsible']) => void;
  updateStyle: (style: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Extended sidebar settings with style
interface ExtendedSidebarSettings extends SidebarSettings {
  style: string;
}

// Default sidebar settings with style
const DEFAULT_EXTENDED_SETTINGS: ExtendedSidebarSettings = {
  variant: 'inset',
  collapsible: 'icon',
  style: 'plain'
};

// Get extended sidebar settings from localStorage
const getExtendedSidebarSettings = (): ExtendedSidebarSettings => {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_EXTENDED_SETTINGS;
  }
  
  try {
    const savedSettings = localStorage.getItem('sidebarSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_EXTENDED_SETTINGS;
  } catch (error) {
    return DEFAULT_EXTENDED_SETTINGS;
  }
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ExtendedSidebarSettings>(getExtendedSidebarSettings());

  // Update variant
  const updateVariant = (variant: SidebarSettings['variant']) => {
    setSettings(prev => {
      const newSettings = { ...prev, variant };
      localStorage.setItem('sidebarSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  // Update collapsible
  const updateCollapsible = (collapsible: SidebarSettings['collapsible']) => {
    setSettings(prev => {
      const newSettings = { ...prev, collapsible };
      localStorage.setItem('sidebarSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  // Update style
  const updateStyle = (style: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, style };
      localStorage.setItem('sidebarSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  useEffect(() => {
    // Listen for storage events to update settings when changed from another tab
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'sidebarSettings') {
        try {
          const newSettings = JSON.parse(event.newValue || '');
          setSettings(newSettings);
        } catch (error) {
          console.error('Failed to parse sidebar settings', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SidebarContext.Provider value={{ 
      variant: settings.variant, 
      collapsible: settings.collapsible,
      style: settings.style,
      updateVariant,
      updateCollapsible,
      updateStyle
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarSettings = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebarSettings must be used within SidebarProvider');
  return context;
};