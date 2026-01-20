import { router } from '@inertiajs/react';
import { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    right?: ReactNode;
    className?: string;
    sticky?: boolean;
}

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
            router.visit(window.history.state?.previousUrl || '/dashboard');
        }
    };

    return (
        <header
            className={cn(
                "w-full h-14 flex items-center px-4 bg-white border-b border-gray-100",
                sticky && "sticky top-0 z-50",
                className
            )}
        >
            <div className="flex-1 flex items-center">
                {showBack && (
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"
                        aria-label="Back"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                )}
            </div>

            <div className="flex-auto text-center overflow-hidden">
                <h1 className="text-sm font-bold text-gray-900 truncate px-2">
                    {title}
                </h1>
            </div>

            <div className="flex-1 flex items-center justify-end">
                {right}
            </div>
        </header>
    );
}

export default MobileHeader;
