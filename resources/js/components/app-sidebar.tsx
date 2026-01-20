import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { type NavItem } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { Settings as SettingsIcon, Building2, LayoutGrid, ShoppingCart, Globe2, Package, Zap, Users, TrendingUp, Crown, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationItems } from '@/hooks/use-navigation-items';
import { cn } from '@/lib/utils';

export function AppSidebar() {
    const { position } = useLayout();
    const { t } = useTranslation();
    const filteredNavItems = useNavigationItems();

    // Hardcoded logo paths
    const appLogoPath = '/images/logos/app-logo.png';

    // Get the first available menu item's href for logo link
    const getFirstAvailableHref = () => {
        if (filteredNavItems.length === 0) return route('dashboard');
        const firstItem = filteredNavItems[0];
        return firstItem.href || (firstItem.children && firstItem.children[0]?.href) || route('dashboard');
    };

    return (
        <Sidebar
            side={position}
            collapsible="icon"
            className="border-r border-slate-200 bg-white"
        >
            <div className="flex flex-col h-full">
                {/* Logo Area - Shopify style */}
                <div className="px-4 py-5 border-b border-slate-200">
                    <Link href={getFirstAvailableHref()} className="flex items-center gap-2">
                        <div className="h-8 flex items-center justify-center">
                            <img src={appLogoPath} alt="Vimstack" className="h-full object-contain" />
                        </div>
                    </Link>
                </div>

                {/* Sidebar Navigation - Shopify style with padding */}
                <SidebarContent className="flex-1 bg-transparent px-2 py-4">
                    <NavMain items={filteredNavItems} position={position} />
                </SidebarContent>

                {/* Bottom Footer - Shopify style */}
                <SidebarFooter className="p-2 bg-transparent border-t border-slate-200">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>{t('Log out')}</span>
                    </Link>
                </SidebarFooter>
            </div>
        </Sidebar>
    );
}