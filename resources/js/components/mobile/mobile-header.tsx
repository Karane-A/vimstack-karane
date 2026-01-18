import { NavBar } from 'antd-mobile';
import { router } from '@inertiajs/react';
import { ReactNode } from 'react';

interface MobileHeaderProps {
    /**
     * Title to display in the header
     */
    title?: string;
    /**
     * Whether to show the back button
     * @default true
     */
    showBack?: boolean;
    /**
     * Custom back handler
     */
    onBack?: () => void;
    /**
     * Right side content (actions, menu, etc.)
     */
    right?: ReactNode;
    /**
     * Additional class name
     */
    className?: string;
    /**
     * Whether the header should be sticky
     * @default true
     */
    sticky?: boolean;
}

/**
 * Mobile header component with back navigation
 *
 * Features:
 * - Back button navigation
 * - Title display
 * - Right side actions
 * - Sticky positioning
 *
 * Usage:
 * <MobileHeader
 *   title="Products"
 *   right={<Button>Add</Button>}
 * />
 */
export function MobileHeader({
    title = '',
    showBack = true,
    onBack,
    right,
    className = '',
    sticky = true,
}: MobileHeaderProps) {
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            // Default back behavior using Inertia router
            router.visit(window.history.state?.previousUrl || '/dashboard');
        }
    };

    return (
        <div
            className={className}
            style={{
                position: sticky ? 'sticky' : 'relative',
                top: 0,
                zIndex: 100,
                backgroundColor: 'var(--adm-color-background)',
            }}
        >
            <NavBar
                onBack={showBack ? handleBack : undefined}
                right={right}
                style={{
                    borderBottom: '1px solid var(--adm-color-border)',
                }}
            >
                {title}
            </NavBar>
        </div>
    );
}

export default MobileHeader;
