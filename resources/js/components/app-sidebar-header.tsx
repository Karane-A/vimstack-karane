import { usePage, router, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Search, Bell, Settings as SettingsIcon, LogOut, User, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StoreSwitcher } from '@/components/store-switcher';
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppSidebarHeader() {
    const { t } = useTranslation();
    const { auth, stores, isImpersonating } = usePage().props as any;
    const { adminViewMode, toggleAdminViewMode } = useLayout();

    const user = auth?.user;
    const userInitials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'AD';

    const currentStore = (stores || []).find((store: any) => String(store.id) === String(user?.current_store)) ||
        (stores?.length > 0 ? stores[0] : null);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-8 transition-all sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 md:hidden" />

                {/* Store Switcher for non-superadmins */}
                {user?.type !== 'superadmin' && user?.type !== 'super admin' && !isImpersonating && (
                    <StoreSwitcher
                        items={stores || []}
                        currentStore={currentStore}
                    />
                )}
            </div>

            <div className="flex items-center gap-6">
                {/* Global Search */}
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder={t('Search everything...')}
                        className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm w-72 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Toggle for Superadmins (and Impersonating Admins) */}
                    {(user?.type === 'superadmin' || user?.type === 'super admin' || isImpersonating) && (
                        <button
                            onClick={() => {
                                if (isImpersonating) {
                                    router.post(route('impersonate.leave'));
                                } else {
                                    toggleAdminViewMode();
                                    // Redirect to dashboard if switching back to admin to ensure they land on the right page
                                    if (adminViewMode === 'company') {
                                        router.visit(route('dashboard'));
                                    }
                                }
                            }}
                            className={cn(
                                "h-9 flex items-center gap-2 px-4 rounded-xl transition-all font-bold text-[11px] uppercase tracking-wider",
                                (adminViewMode === 'admin' && !isImpersonating)
                                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 ring-2 ring-indigo-500/20"
                            )}
                        >
                            <Crown size={16} strokeWidth={2.5} />
                            <span>
                                {isImpersonating
                                    ? t('Back to Admin')
                                    : (adminViewMode === 'admin' ? t('Admin View') : t('Back to Admin'))
                                }
                            </span>
                        </button>
                    )}

                    <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors" onClick={() => router.visit(route('settings'))}>
                        <SettingsIcon size={20} strokeWidth={1.5} />
                    </button>

                    <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-3 pl-1 cursor-pointer group">
                                <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-indigo-500 transition-all shadow-sm">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl border-slate-100">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold leading-none text-slate-900">{user?.name}</p>
                                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.visit(route('profile'))} className="cursor-pointer gap-2 py-2.5">
                                <User size={16} /> {t('My Profile')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.visit(route('settings'))} className="cursor-pointer gap-2 py-2.5">
                                <SettingsIcon size={16} /> {t('Account Settings')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.post(route('logout'))} className="cursor-pointer text-red-600 focus:text-red-600 gap-2 py-2.5">
                                <LogOut size={16} /> {t('Log out')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}