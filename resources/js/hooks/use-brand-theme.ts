import { useEffect } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS, useAppearance } from '@/hooks/use-appearance';

export function useBrandTheme() {
  const { themeColor, customColor, themeMode } = useBrand();
  const { updateAppearance, updateThemeColor, updateCustomColor } = useAppearance();

  useEffect(() => {
    // Sync brand settings with appearance hook
    if (themeMode) {
      updateAppearance(themeMode as 'light' | 'dark' | 'system');
    }
  }, [themeMode, updateAppearance]);

  useEffect(() => {
    // Sync theme color with appearance hook
    if (themeColor) {
      updateThemeColor(themeColor as any);
    }
  }, [themeColor, updateThemeColor]);

  useEffect(() => {
    // Sync custom color with appearance hook
    if (customColor && themeColor === 'custom') {
      updateCustomColor(customColor);
    }
  }, [customColor, themeColor, updateCustomColor]);
}