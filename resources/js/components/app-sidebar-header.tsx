import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ProfileMenu } from '@/components/profile-menu';
import { LanguageSwitcher } from '@/components/language-switcher';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { StoreSwitcher } from '@/components/store-switcher';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { t } = useTranslation();
    const { position } = useLayout();

    return (
        <>
            <header className="border-sidebar-border/50 flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-3">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    {position === 'left' && <SidebarTrigger className="-ml-1" />}
                    <div className="text-sm font-medium">
                        <Breadcrumbs items={breadcrumbs.map(b => ({ label: b.title, href: b.href }))} />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Store Switcher - Hide for superadmin */}
                    {(usePage().props as any).auth?.user?.type !== 'superadmin' && (usePage().props as any).auth?.user?.type !== 'super admin' && (
                        <StoreSwitcher 
                            items={(usePage().props as any).stores || []} 
                            currentStore={((usePage().props as any).stores || []).find(store => String(store.id) === String((usePage().props as any).auth?.user?.current_store)) || ((usePage().props as any).stores?.length > 0 ? (usePage().props as any).stores[0] : null)} 
                        />
                    )}
                    
                    {(usePage().props as any).isImpersonating && (
                        <button 
                            onClick={() => router.post(route('impersonate.leave'))}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                            {t("Return Back")}
                        </button>
                    )}
                    <LanguageSwitcher />
                    <ProfileMenu />
                    {position === 'right' && <SidebarTrigger className="-mr-1" />}
                </div>
            </div>
        </header>
        </>
    );
}