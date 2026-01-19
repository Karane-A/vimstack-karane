import { Link, usePage } from '@inertiajs/react';
import { Home, ShoppingCart, Package, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNavigationItems } from '@/hooks/use-navigation-items';
import { NavMain } from '@/components/nav-main';

export function MobileBottomNav() {
    const { t } = useTranslation();
    const { url } = usePage();
    const navigationItems = useNavigationItems();

    const navItems = [
        {
            title: t('Home'),
            href: route('dashboard'),
            icon: Home,
            isActive: url === '/dashboard'
        },
        {
            title: t('Orders'),
            href: route('orders.index'),
            icon: ShoppingCart,
            isActive: url.startsWith('/orders')
        },
        {
            title: t('Products'),
            href: route('products.index'),
            icon: Package,
            isActive: url.startsWith('/products')
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
                            "flex flex-col items-center gap-1 transition-colors",
                            item.isActive ? "text-indigo-600" : "text-slate-400"
                        )}
                    >
                        <Icon size={20} strokeWidth={item.isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{item.title}</span>
                    </Link>
                );
            })}

            <Sheet>
                <SheetTrigger asChild>
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Menu size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{t('More')}</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] p-0 overflow-hidden border-none shadow-2xl">
                    <SheetHeader className="p-8 pb-4 border-b border-slate-50">
                        <SheetTitle className="text-xl font-bold text-slate-900">{t('Menu')}</SheetTitle>
                    </SheetHeader>
                    <div className="p-4 h-full overflow-y-auto pb-24">
                        <NavMain items={navigationItems} position="left" />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
