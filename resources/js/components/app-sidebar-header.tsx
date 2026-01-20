import { usePage, router, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Search, Settings as SettingsIcon, LogOut, User, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StoreSwitcher } from '@/components/store-switcher';
import { GlobalSearch } from '@/components/global-search';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
            <div className="flex items-center w-full">
                {/* Brand / Logo - Only visible on mobile/tablet as sidebar shows it on desktop */}
                <div className="flex items-center gap-4 lg:hidden">
                    <Link href={route('dashboard')} className="flex items-center gap-2">
                        <img src="/images/logos/app-logo.png" alt="Vimstack" className="h-4 w-auto object-contain" />
                    </Link>
                </div>

                {/* Vertical Separator - Only visible on mobile/tablet */}
                <div className="h-6 w-[1px] bg-slate-200 mx-4 lg:hidden" />

                {/* Header Utility Group - Pushed to the right */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Store Switcher - Icon Only mode for header */}
                    {user?.type !== 'superadmin' && user?.type !== 'super admin' && !isImpersonating && (
                        <StoreSwitcher
                            items={stores || []}
                            currentStore={currentStore}
                            isIconOnly={true}
                        />
                    )}

                    {/* Global Search - Handles its own responsiveness */}
                    <GlobalSearch />

                    {/* Impersonation Exit Button */}
                    {isImpersonating && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => {
                                            router.post(route('impersonate.leave'));
                                        }}
                                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 ring-2 ring-primary/20 transition-all"
                                    >
                                        <Crown size={18} strokeWidth={2.5} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Back to Admin')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {/* User Avatar Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="nav-icon cursor-pointer group p-0 relative">
                                <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary transition-all shadow-sm">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="bg-primary text-white font-bold text-xs uppercase">
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