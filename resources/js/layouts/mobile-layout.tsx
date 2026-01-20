import { ReactNode } from 'react';
import { BottomNavigation } from '@/components/mobile/bottom-navigation';
import { MobileFAB } from '@/components/mobile/mobile-fab';
import { MobileHeader } from '@/components/mobile/mobile-header';
import { useFavicon } from '@/hooks/use-favicon';
import { useDynamicTitle } from '@/hooks/use-dynamic-title';
import { useBrandTheme } from '@/hooks/use-brand-theme';
import { type BreadcrumbItem } from '@/types';

interface MobileLayoutProps {
    children: ReactNode;
    /**
     * Breadcrumbs for navigation
     */
    breadcrumbs?: BreadcrumbItem[];
    /**
     * Whether to show the bottom navigation
     * @default true
     */
    showBottomNav?: boolean;
    /**
     * Whether to show the floating action button
     * @default true
     */
    showFAB?: boolean;
    /**
     * Whether to show the header
     * @default true
     */
    showHeader?: boolean;
    /**
     * Additional class name for the container
     */
    className?: string;
}

/**
 * Mobile-specific layout component with bottom navigation and FAB
 */
export function MobileLayout({
    children,
    breadcrumbs = [],
    showBottomNav = true,
    showFAB = true,
    showHeader = true,
    className = '',
}: MobileLayoutProps) {
    // Apply all brand settings dynamically
    useFavicon();
    useDynamicTitle();
    useBrandTheme();

    // Get the title from breadcrumbs (usually the last item)
    const title = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : '';

    return (
        <div
            className={`mobile-app-container min-h-screen bg-background pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+${showBottomNav ? '60px' : '0px'})] ${className}`}
        >
            {/* Mobile Header */}
            {showHeader && (
                <MobileHeader
                    title={title}
                    showBack={breadcrumbs.length > 1}
                />
            )}

            <div className="mobile-content">{children}</div>

            {/* Bottom Navigation */}
            {showBottomNav && <BottomNavigation />}

            {/* Floating Action Button */}
            {showFAB && <MobileFAB />}
        </div>
    );
}

/**
 * Simple mobile layout without bottom navigation and FAB
 * Useful for auth pages, checkout, etc.
 */
export function SimpleMobileLayout({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    useFavicon();
    useDynamicTitle();
    useBrandTheme();

    return (
        <div className={`mobile-simple-container min-h-screen bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ${className}`}>
            {children}
        </div>
    );
}

export default MobileLayout;
