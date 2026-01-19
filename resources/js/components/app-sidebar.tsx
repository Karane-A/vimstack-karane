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
            className="ds-sidebar border-r border-slate-200 bg-[#F9FAFB]"
        >
            <div className="flex flex-col h-full">
                {/* Logo Area */}
                <div className="px-6 py-8">
                    <Link href={getFirstAvailableHref()} className="flex items-center gap-2">
                        <div className="h-8 flex items-center justify-center">
                            <img src={appLogoPath} alt="Vimstack" className="h-full object-contain" />
                        </div>
                    </Link>
                </div>

                {/* Sidebar Navigation */}
                <SidebarContent className="flex-1 bg-transparent px-2">
                    <NavMain items={filteredNavItems} position={position} />
                </SidebarContent>

                {/* Bottom Footer - Logout */}
                <SidebarFooter className="p-4 bg-transparent border-t border-slate-100 flex flex-col gap-2">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="ds-nav-item w-full flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>{t('Log out')}</span>
                    </Link>
                </SidebarFooter>
            </div>
        </Sidebar>
    );
}