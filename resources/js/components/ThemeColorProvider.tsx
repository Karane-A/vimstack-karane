import React, { useEffect } from 'react';

interface ThemeColorProviderProps {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  children: React.ReactNode;
}

export default function ThemeColorProvider({ colors, children }: ThemeColorProviderProps) {
  useEffect(() => {
    if (colors) {
      // Apply theme colors as CSS variables
      document.documentElement.style.setProperty('--theme-primary', colors.primary);
      document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
      document.documentElement.style.setProperty('--theme-accent', colors.accent);
      
      // Also update the primary color for consistency with existing CSS
      document.documentElement.style.setProperty('--primary', colors.primary);
      
      // Generate lighter/darker variants for hover states
      const lightenColor = (hex: string, percent: number): string => {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        
        r = Math.min(255, Math.floor(r * (1 + percent / 100)));
        g = Math.min(255, Math.floor(g * (1 + percent / 100)));
        b = Math.min(255, Math.floor(b * (1 + percent / 100)));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };
      
      const darkenColor = (hex: string, percent: number): string => {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        
        r = Math.max(0, Math.floor(r * (1 - percent / 100)));
        g = Math.max(0, Math.floor(g * (1 - percent / 100)));
        b = Math.max(0, Math.floor(b * (1 - percent / 100)));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };
      
      // Set hover variants
      document.documentElement.style.setProperty('--theme-primary-hover', darkenColor(colors.primary, 10));
      document.documentElement.style.setProperty('--theme-secondary-hover', darkenColor(colors.secondary, 10));
      document.documentElement.style.setProperty('--theme-accent-hover', darkenColor(colors.accent, 10));
      
      // Set light variants for backgrounds
      document.documentElement.style.setProperty('--theme-primary-light', lightenColor(colors.primary, 90));
      document.documentElement.style.setProperty('--theme-secondary-light', lightenColor(colors.secondary, 90));
      document.documentElement.style.setProperty('--theme-accent-light', lightenColor(colors.accent, 90));
    }
  }, [colors]);

  return <>{children}</>;
}