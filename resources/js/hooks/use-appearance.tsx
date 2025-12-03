import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';
export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'custom';

export interface ThemeSettings {
    appearance: Appearance;
    themeColor: ThemeColor;
    customColor: string;
}

const DEFAULT_THEME: ThemeSettings = {
    appearance: 'light',
    themeColor: 'green',
    customColor: '#10b981',
};

// Preset theme colors
export const THEME_COLORS = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    orange: '#f97316',
    red: '#ef4444',
};

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
        console.log('Error checking prefers-color-scheme:', error);
        return false;
    }
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (settings: ThemeSettings) => {
    if (typeof document === 'undefined') {
        return;
    }
    
    const { appearance, themeColor, customColor } = settings;
    const isDark = appearance === 'dark';

    // Apply dark mode class
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    
    // Apply theme color
    const color = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor];
    document.documentElement.style.setProperty('--theme-color', color);
    
    // Also update CSS variables that depend on theme color
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--chart-1', color);
    
    // Generate a lighter/darker variant for hover states
    const adjustedColor = isDark ? lightenColor(color, 10) : darkenColor(color, 10);
    document.documentElement.style.setProperty('--theme-color-hover', adjustedColor);
    
    // Force a small repaint to ensure colors are applied
    const tempClass = 'theme-color-updating';
    document.documentElement.classList.add(tempClass);
    setTimeout(() => {
        document.documentElement.classList.remove(tempClass);
    }, 10);
};

// Helper function to lighten a color
const lightenColor = (hex: string, percent: number): string => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // Lighten
    r = Math.min(255, Math.floor(r * (1 + percent / 100)));
    g = Math.min(255, Math.floor(g * (1 + percent / 100)));
    b = Math.min(255, Math.floor(b * (1 + percent / 100)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Helper function to darken a color
const darkenColor = (hex: string, percent: number): string => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // Darken
    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const themeSettings = getThemeSettings();
    applyTheme(themeSettings);
};

const getThemeSettings = (brandSettings?: any): ThemeSettings => {
    if (typeof localStorage === 'undefined') {
        return brandSettings ? {
            appearance: brandSettings.themeMode === 'system' ? 'light' : (brandSettings.themeMode || 'light'),
            themeColor: brandSettings.themeColor || DEFAULT_THEME.themeColor,
            customColor: brandSettings.customColor || DEFAULT_THEME.customColor,
        } : DEFAULT_THEME;
    }
    
    try {
        const savedTheme = localStorage.getItem('themeSettings');
        if (savedTheme) {
            const parsed = JSON.parse(savedTheme);
            return {
                ...parsed,
                appearance: parsed.appearance === 'system' ? 'light' : (parsed.appearance || 'light')
            };
        }
        
        if (brandSettings) {
            return {
                appearance: brandSettings.themeMode === 'system' ? 'light' : (brandSettings.themeMode || 'light'),
                themeColor: brandSettings.themeColor || DEFAULT_THEME.themeColor,
                customColor: brandSettings.customColor || DEFAULT_THEME.customColor,
            };
        }
        
        return DEFAULT_THEME;
    } catch (error) {
        return DEFAULT_THEME;
    }
};

export function initializeTheme(brandSettings?: any) {
    const themeSettings = getThemeSettings(brandSettings);
    applyTheme(themeSettings);

    // Add the event listener for system theme changes...
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [themeSettings, setThemeSettings] = useState<ThemeSettings>(DEFAULT_THEME);

    const updateAppearance = useCallback((mode: Appearance) => {
        setThemeSettings(prev => {
            const newSettings = { ...prev, appearance: mode };
            
            // Store in localStorage for client-side persistence...
            localStorage.setItem('themeSettings', JSON.stringify(newSettings));
            
            // Store in cookie for SSR...
            setCookie('appearance', mode);
            
            applyTheme(newSettings);
            return newSettings;
        });
    }, []);
    
    const updateThemeColor = useCallback((color: ThemeColor) => {
        setThemeSettings(prev => {
            const newSettings = { ...prev, themeColor: color };
            
            // Store in localStorage
            localStorage.setItem('themeSettings', JSON.stringify(newSettings));
            
            applyTheme(newSettings);
            return newSettings;
        });
    }, []);
    
    const updateCustomColor = useCallback((hexColor: string, setAsActive = false) => {
        setThemeSettings(prev => {
            const newSettings = { 
                ...prev, 
                customColor: hexColor,
                ...(setAsActive && { themeColor: 'custom' })
            };
            
            // Store in localStorage
            localStorage.setItem('themeSettings', JSON.stringify(newSettings));
            
            applyTheme(newSettings);
            return newSettings;
        });
    }, []);

    useEffect(() => {
        const savedSettings = getThemeSettings();
        setThemeSettings(savedSettings);
        applyTheme(savedSettings);

        return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
    }, []);
    
    // Method to initialize theme with brand settings
    const initializeWithBrandSettings = (brandSettings: any) => {
        const themeSettings = getThemeSettings(brandSettings);
        setThemeSettings(themeSettings);
        applyTheme(themeSettings);
    };

    return { 
        appearance: themeSettings.appearance, 
        themeColor: themeSettings.themeColor,
        customColor: themeSettings.customColor,
        updateAppearance,
        updateThemeColor,
        updateCustomColor,
        initializeWithBrandSettings
    } as const;
}
