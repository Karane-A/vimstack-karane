import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import MobileLayout from '@/layouts/mobile-layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { useFavicon } from '@/hooks/use-favicon';
import { useDynamicTitle } from '@/hooks/use-dynamic-title';
import { useBrandTheme } from '@/hooks/use-brand-theme';
import CookieConsent from '@/components/cookie-consent';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    // Apply all brand settings dynamically
    useFavicon();
    useDynamicTitle();
    useBrandTheme();
    const isMobile = useIsMobile();
    const isDemoMode = (window as any).isDemo === true;
    
    return (
        <>
            {isMobile ? (
                <MobileLayout {...props}>
                    {children}
                </MobileLayout>
            ) : (
                <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </AppLayoutTemplate>
            )}
            {!isDemoMode && (
                <CookieConsent />
            )}
        </>
    );
};
