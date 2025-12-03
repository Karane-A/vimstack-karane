import '../css/app.css';
import '../css/dark-mode.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import { LayoutProvider } from './contexts/LayoutContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { BrandProvider } from './contexts/BrandContext';
import { ModalStackProvider } from './contexts/ModalStackContext';
import { initializeTheme } from './hooks/use-appearance';
import { CustomToast } from './components/custom-toast';
import { initializeGlobalSettings } from './utils/globalSettings';
import { initPerformanceMonitoring, lazyLoadImages } from './utils/performance';
import { setupFlashMessages } from './utils/flash-messages';
import './i18n'; // Import i18n configuration
import './utils/axios-config'; // Import axios configuration

// Initialize performance monitoring
initPerformanceMonitoring();

// Initialize lazy loading of images when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
});

// Add event listener for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Re-apply theme when system preference changes
    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
        const themeSettings = JSON.parse(savedTheme);
        if (themeSettings.appearance === 'system') {
            initializeTheme();
        }
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'StoreGo';

createInertiaApp({
    title: (title) => {
        // Get dynamic title text from shared props
        const dynamicTitle = (window as any).page?.props?.dynamicTitleText || appName;
        return title ? `${title} - ${dynamicTitle}` : dynamicTitle;
    },    
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        // Make page data globally available for axios interceptor
        try {
            (window as any).page = props.initialPage;
        } catch (e) {
            console.warn('Could not set global page data:', e);
        }
        
        // Set demo mode globally
        try {
            (window as any).isDemo = props.initialPage.props?.is_demo || false;
        } catch (e) {
            // Ignore errors
        }
        
        // Initialize global settings from shared data
        const globalSettings = props.initialPage.props.globalSettings || {};
        if (Object.keys(globalSettings).length > 0) {
            initializeGlobalSettings(globalSettings);
            
            // Set initial document title using dynamic title text
            const dynamicTitle = props.initialPage.props.dynamicTitleText || globalSettings.titleText || appName;
            document.title = dynamicTitle;
        }
        
        // Always initialize theme with available settings
        initializeTheme(globalSettings);
        
        // Initialize flash message handling
        setupFlashMessages();

        // Create a memoized render function to prevent unnecessary re-renders
        const renderApp = (appProps: any) => {
            const currentGlobalSettings = appProps.initialPage.props.globalSettings || {};
            const user = appProps.initialPage.props.auth?.user;
            
            return (
                <ModalStackProvider>
                    <LayoutProvider>
                        <SidebarProvider>
                            <BrandProvider globalSettings={currentGlobalSettings} user={user}>
                                <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
                                    <App {...appProps} />
                                </Suspense>
                                <CustomToast />
                            </BrandProvider>
                        </SidebarProvider>
                    </LayoutProvider>
                </ModalStackProvider>
            );
        };
        
        // Initial render
        root.render(renderApp(props));
        
        // Update global page data on navigation and re-render with new settings
        router.on('navigate', (event) => {
            try {
                (window as any).page = event.detail.page;
                
                // Re-initialize global settings with updated data
                const updatedGlobalSettings = event.detail.page.props.globalSettings || {};
                if (Object.keys(updatedGlobalSettings).length > 0) {
                    initializeGlobalSettings(updatedGlobalSettings);
                    
                    // Update document title using dynamic title text
                    const dynamicTitle = event.detail.page.props.dynamicTitleText || updatedGlobalSettings.titleText || appName;
                    document.title = dynamicTitle;
                }
                
                // Re-render with updated props including globalSettings
                root.render(renderApp({ initialPage: event.detail.page }));
                
                // Force dark mode check on navigation
                const savedTheme = localStorage.getItem('themeSettings');
                if (savedTheme) {
                    const themeSettings = JSON.parse(savedTheme);
                    const isDark = themeSettings.appearance === 'dark' || 
                        (themeSettings.appearance === 'system' && 
                         window.matchMedia('(prefers-color-scheme: dark)').matches);
                    document.documentElement.classList.toggle('dark', isDark);
                    document.body.classList.toggle('dark', isDark);
                }
            } catch (e) {
                console.error('Navigation error:', e);
            }
        });
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Initialize direction from localStorage if available
const initializeDirection = () => {
    const savedDirection = localStorage.getItem('layoutDirection');
    if (savedDirection) {
        document.documentElement.dir = savedDirection;
        document.documentElement.setAttribute('dir', savedDirection);
    }
};

// Initialize direction on page load
initializeDirection();