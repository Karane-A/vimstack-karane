import React from 'react';
import { Search, Bell, Settings as SettingsIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PageHeaderProps {
    title: string;
    userInitials?: string;
    userAvatar?: string;
    onSearch?: (query: string) => void;
    actions?: React.ReactNode;
}

export function PageHeader({ title, userInitials = 'AD', userAvatar, onSearch, actions }: PageHeaderProps) {
    return (
        <header className="flex items-center justify-between px-8 bg-white border-b h-16 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        onChange={(e) => onSearch?.(e.target.value)}
                    />
                </div>

                {/* Action Items */}
                <div className="flex items-center gap-3">
                    {actions}
                    <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                        <SettingsIcon size={20} />
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

                    <div className="flex items-center gap-3 pl-1 cursor-pointer group">
                        <Avatar className="h-8 w-8 border border-slate-200 group-hover:border-indigo-500 transition-colors">
                            <AvatarImage src={userAvatar} />
                            <AvatarFallback className="bg-slate-100 text-slate-700 font-bold text-xs uppercase">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
}
