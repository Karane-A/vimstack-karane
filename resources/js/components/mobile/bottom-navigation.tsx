import { TabBar } from 'antd-mobile';
import {
    AppOutline,
    AppstoreOutline,
    MoreOutline,
    ShopbagOutline,
    UnorderedListOutline,
} from 'antd-mobile-icons';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

    const handleTabChange = (key: string) => {
        setActiveKey(key);

        switch (key) {
            case 'home':
                router.visit('/dashboard');
                break;
            case 'products':
                router.visit('/products');
                break;
            case 'orders':
                router.visit('/orders');
                break;
            case 'customers':
                router.visit('/customers');
                break;
            case 'more':
                // More will open a drawer or modal with additional options
                // For now, navigate to settings
                router.visit('/settings');
                break;
        }
    };

    return (
        <div className={className}>
            <TabBar
                activeKey={activeKey}
                onChange={handleTabChange}
                safeArea
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: 'var(--adm-color-background)',
                    borderTop: '1px solid var(--adm-color-border)',
                }}
            >
                <TabBar.Item
                    key="home"
                    icon={<AppOutline />}
                    title="Dashboard"
                />
                <TabBar.Item
                    key="products"
                    icon={<AppstoreOutline />}
                    title="Products"
                />
                <TabBar.Item
                    key="orders"
                    icon={<ShopbagOutline />}
                    title="Orders"
                />
                <TabBar.Item
                    key="customers"
                    icon={<UnorderedListOutline />}
                    title="Customers"
                />
                <TabBar.Item
                    key="more"
                    icon={<MoreOutline />}
                    title="More"
                />
            </TabBar>
        </div>
    );
}

export default BottomNavigation;
