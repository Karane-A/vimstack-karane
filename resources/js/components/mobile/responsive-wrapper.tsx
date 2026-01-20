import { createContext, ReactNode, useContext } from 'react';
import { useMobile } from '@/hooks/use-mobile';

interface ResponsiveContextValue {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    width: number;
    height: number;
}

const ResponsiveContext = createContext<ResponsiveContextValue | null>(null);

export function useResponsive() {
    const context = useContext(ResponsiveContext);
    if (!context) {
        throw new Error('useResponsive must be used within ResponsiveWrapper');
    }
    return context;
}

interface ResponsiveWrapperProps {
    children?: ReactNode;
    mobileComponent?: ReactNode;
    desktopComponent?: ReactNode;
    /**
     * If true, renders both components and uses CSS to show/hide
     * If false, only renders the appropriate component
     */
    renderBoth?: boolean;
}

/**
 * ResponsiveWrapper component that conditionally renders mobile or desktop versions
 * of components based on screen size.
 *
 * Usage:
 * 1. With children (provides context only):
 *    <ResponsiveWrapper>
 *      <YourComponent />
 *    </ResponsiveWrapper>
 *
 * 2. With separate mobile/desktop components:
 *    <ResponsiveWrapper
 *      mobileComponent={<MobileVersion />}
 *      desktopComponent={<DesktopVersion />}
 *    />
 *
 * 3. With renderBoth for CSS-based hiding:
 *    <ResponsiveWrapper
 *      mobileComponent={<MobileVersion />}
 *      desktopComponent={<DesktopVersion />}
 *      renderBoth
 *    />
 */
export function ResponsiveWrapper({
    children,
    mobileComponent,
    desktopComponent,
    renderBoth = false,
}: ResponsiveWrapperProps) {
    const deviceInfo = useMobile();

    const contextValue: ResponsiveContextValue = {
        isMobile: deviceInfo.isMobile,
        isTablet: deviceInfo.isTablet,
        isDesktop: deviceInfo.isDesktop,
        width: deviceInfo.width,
        height: deviceInfo.height,
    };

    // If no mobile/desktop components provided, just provide context
    if (!mobileComponent && !desktopComponent) {
        return (
            <ResponsiveContext.Provider value={contextValue}>
                {children}
            </ResponsiveContext.Provider>
        );
    }

    // Render both components with CSS hiding
    if (renderBoth && mobileComponent && desktopComponent) {
        return (
            <ResponsiveContext.Provider value={contextValue}>
                <div className="block md:hidden">{mobileComponent}</div>
                <div className="hidden md:block">{desktopComponent}</div>
                {children}
            </ResponsiveContext.Provider>
        );
    }

    // Conditionally render based on device type
    return (
        <ResponsiveContext.Provider value={contextValue}>
            {deviceInfo.isMobile && mobileComponent
                ? mobileComponent
                : desktopComponent || children}
        </ResponsiveContext.Provider>
    );
}

/**
 * Utility component to show content only on mobile
 */
export function MobileOnly({ children }: { children: ReactNode }) {
    const { isMobile } = useResponsive();
    return isMobile ? <>{children}</> : null;
}

/**
 * Utility component to show content only on desktop/tablet
 */
export function DesktopOnly({ children }: { children: ReactNode }) {
    const { isDesktop, isTablet } = useResponsive();
    return isDesktop || isTablet ? <>{children}</> : null;
}

/**
 * Utility component to show content only on tablet
 */
export function TabletOnly({ children }: { children: ReactNode }) {
    const { isTablet } = useResponsive();
    return isTablet ? <>{children}</> : null;
}

export default ResponsiveWrapper;
