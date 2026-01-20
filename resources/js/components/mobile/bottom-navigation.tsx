import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Home, Package, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
    className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
    const { url } = usePage();
    const [activeKey, setActiveKey] = useState('home');

    // Determine active tab based on current URL
    useEffect(() => {
        const path = url.split('?')[0]; // Remove query params

        if (path === '/' || path === '/dashboard') {
            setActiveKey('home');
        } else if (path.startsWith('/products')) {
            setActiveKey('products');
        } else if (path.startsWith('/orders')) {
            setActiveKey('orders');
        } else if (path.startsWith('/customers')) {
            setActiveKey('customers');
        } else {
            setActiveKey('more');
        }
    }, [url]);

    const tabs = [
        { key: 'home', label: 'Home', icon: Home, path: '/dashboard' },
        { key: 'products', label: 'Products', icon: Package, path: '/products' },
        { key: 'orders', label: 'Orders', icon: ShoppingBag, path: '/orders' },
        { key: 'more', label: 'More', icon: MoreHorizontal, path: '/settings' },
    ];

    const handleTabChange = (path: string, key: string) => {
        setActiveKey(key);
        router.visit(path);
    };

    return (
        <nav
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-100 flex items-center justify-around h-16 pb-safe px-2",
                className
            )}
        >
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeKey === tab.key;

                return (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.path, tab.key)}
                        className="flex flex-col items-center justify-center flex-1 min-w-0 h-full space-y-1 transition-colors active:opacity-70"
                    >
                        <div className={cn(
                            "p-1 rounded-xl transition-all",
                            isActive ? "text-teal-600" : "text-gray-400"
                        )}>
                            <Icon className={cn(
                                "h-6 w-6 transition-transform",
                                isActive && "scale-110"
                            )} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-tight transition-colors",
                            isActive ? "text-teal-600" : "text-gray-400"
                        )}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}

export default BottomNavigation;
