import { Link, usePage } from '@inertiajs/react';
import { Home, ShoppingCart, Package, Menu, Building2, LayoutPanelLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNavigationItems } from '@/hooks/use-navigation-items';
import { NavMain } from '@/components/nav-main';
import { useLayout } from '@/contexts/LayoutContext';

export function MobileBottomNav() {
    const { t } = useTranslation();
    const { url } = usePage();
    const { adminViewMode } = useLayout();
    const { auth, isImpersonating } = usePage().props as any;
    const navigationItems = useNavigationItems();

    // Show company/vendor view if:
    // 1. User is actually a company/vendor
    // 2. Superadmin is in company view mode
    // 3. Superadmin is impersonating
    const isCompanyView = auth?.user?.type === 'company' || adminViewMode === 'company' || isImpersonating;

    const isActive = (href: string) => {
        const path = href.startsWith('http') ? new URL(href).pathname : href;
        const currentPath = url.split('?')[0];
        if (currentPath === path) return true;
        return path !== '/' && currentPath.startsWith(path);
    };

    const navItems = isCompanyView ? [
        {
            title: t('Home'),
            href: route('dashboard'),
            icon: Home,
            active: isActive(route('dashboard'))
        },
        {
            title: t('Products'),
            href: route('products.index'),
            icon: Package,
            active: isActive(route('products.index'))
        },
        {
            title: t('Orders'),
            href: route('orders.index'),
            icon: ShoppingCart,
            active: isActive(route('orders.index'))
        },
    ] : [
        {
            title: t('Home'),
            href: route('dashboard'),
            icon: Home,
            active: isActive(route('dashboard'))
        },
        {
            title: t('Companies'),
            href: route('companies.index'),
            icon: Building2,
            active: isActive(route('companies.index'))
        },
        {
            title: t('Plans'),
            href: route('plans.index'),
            icon: LayoutPanelLeft,
            active: isActive(route('plans.index'))
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 z-50 flex items-center justify-between safe-area-pb shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all duration-300",
                            item.active ? "text-primary" : "text-[#475569]"
                        )}
                    >
                        <Icon size={20} strokeWidth={item.active ? 2.5 : 2} className={cn("transition-transform", item.active && "scale-110")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-tight", item.active ? "opacity-100" : "opacity-70")}>{item.title}</span>
                    </Link>
                );
            })}

            <Sheet>
                <SheetTrigger asChild>
                    <button className="flex flex-col items-center gap-1 text-[#475569] transition-colors">
                        <Menu size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight opacity-70">{t('More')}</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-[40px] p-0 overflow-hidden border-none shadow-2xl bg-slate-50">
                    <SheetHeader className="p-8 pb-6 bg-white border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight">{t('Menu')}</SheetTitle>
                            <p className="text-slate-400 text-xs font-medium mt-1">{t('Manage your store operations')}</p>
                        </div>
                    </SheetHeader>

                    <div className="p-4 h-full overflow-y-auto pb-32">
                        <div className="space-y-6">
                            {/* We can directly use NavMain but with improved styles for mobile */}
                            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100/50">
                                <NavMain items={navigationItems} position="left" />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
