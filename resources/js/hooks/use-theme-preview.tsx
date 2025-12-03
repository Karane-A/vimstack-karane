import { useEffect, useState } from 'react';
import { useAppearance, type Appearance, type ThemeColor } from '@/hooks/use-appearance';
import { useLayout, type LayoutPosition } from '@/contexts/LayoutContext';
import { useSidebarSettings } from '@/contexts/SidebarContext';
import { SidebarVariant, SidebarCollapsible } from '@/components/sidebar-style-settings';

// Create a debounced version of the theme settings to prevent too many re-renders
export function useThemePreview() {
  const { appearance, themeColor } = useAppearance();
  const { position } = useLayout();
  const { variant, collapsible, style } = useSidebarSettings();
  
  const [debouncedSettings, setDebouncedSettings] = useState({
    appearance,
    themeColor,
    position,
    variant,
    collapsible,
    style
  });
  
  useEffect(() => {
    // Debounce settings changes to prevent too many re-renders
    const timer = setTimeout(() => {
      setDebouncedSettings({
        appearance,
        themeColor,
        position,
        variant,
        collapsible,
        style
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [appearance, themeColor, position, variant, collapsible, style]);
  
  return debouncedSettings;
}