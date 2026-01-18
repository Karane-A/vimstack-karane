import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean>();

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };

        mql.addEventListener('change', onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

        return () => mql.removeEventListener('change', onChange);
    }, []);

    return !!isMobile;
}

/**
 * Enhanced mobile detection hook with device type information
 */
export function useMobile() {
    const [deviceInfo, setDeviceInfo] = useState<{
        isMobile: boolean;
        isTablet: boolean;
        isDesktop: boolean;
        width: number;
        height: number;
    }>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
        height: typeof window !== 'undefined' ? window.innerHeight : 768,
    });

    useEffect(() => {
        const updateDeviceInfo = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isMobile = width < MOBILE_BREAKPOINT;
            const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
            const isDesktop = width >= TABLET_BREAKPOINT;

            setDeviceInfo({
                isMobile,
                isTablet,
                isDesktop,
                width,
                height,
            });
        };

        updateDeviceInfo();

        window.addEventListener('resize', updateDeviceInfo);
        return () => window.removeEventListener('resize', updateDeviceInfo);
    }, []);

    return deviceInfo;
}

/**
 * Hook to detect device orientation
 */
export function useOrientation() {
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
        typeof window !== 'undefined' && window.innerWidth > window.innerHeight
            ? 'landscape'
            : 'portrait'
    );

    useEffect(() => {
        const handleOrientationChange = () => {
            setOrientation(
                window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
            );
        };

        window.addEventListener('resize', handleOrientationChange);
        return () => window.removeEventListener('resize', handleOrientationChange);
    }, []);

    return orientation;
}

/**
 * Hook to detect if device is touch-enabled
 */
export function useTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            // @ts-ignore
            navigator.msMaxTouchPoints > 0
        );
    }, []);

    return isTouch;
}

/**
 * Hook for responsive breakpoint detection
 */
export function useBreakpoint() {
    const { isMobile, isTablet, isDesktop, width } = useMobile();

    return {
        isMobile,
        isTablet,
        isDesktop,
        width,
        breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    };
}
