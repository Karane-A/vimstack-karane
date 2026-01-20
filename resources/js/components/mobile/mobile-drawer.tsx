import { router, usePage } from '@inertiajs/react';
import {
    Settings,
    User,
    LogOut,
    Globe,
    CreditCard,
    FileText,
    Star,
    Gift,
    MapPin,
    BarChart3,
    ChevronRight,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileDrawerProps {
    visible: boolean;
    onClose: () => void;
}

interface PageProps extends Record<string, any> {
    auth?: {
        user?: {
            name: string;
            email: string;
            avatar?: string;
        };
    };
}

export function MobileDrawer({ visible, onClose }: MobileDrawerProps) {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;

    const handleNavigate = (path: string) => {
        router.visit(path);
        onClose();
    };

    const handleLogout = () => {
        router.post('/logout');
        onClose();
    };

    const menuGroups = [
        {
            items: [
                { label: 'My Profile', icon: User, path: '/profile' },
                { label: 'Analytics', icon: BarChart3, path: '/analytics' },
                { label: 'Reviews', icon: Star, path: '/reviews' },
                { label: 'Coupons', icon: Gift, path: '/coupons' },
                { label: 'Shipping', icon: MapPin, path: '/shipping' },
                { label: 'Blog', icon: FileText, path: '/blog' },
            ]
        },
        {
            items: [
                { label: 'Billing & Plans', icon: CreditCard, path: '/billing' },
                { label: 'Switch Store', icon: Globe, path: '/store-switcher' },
                { label: 'Settings', icon: Settings, path: '/settings' },
            ]
        }
    ];

    return (
        <Sheet open={visible} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0 border-r-0">
                <ScrollArea className="h-full">
                    <div className="flex flex-col h-full bg-white">
                        {/* User Profile Header */}
                        {user && (
                            <div className="p-6 bg-teal-600">
                                <Avatar className="h-16 w-16 border-2 border-white/20 mb-4">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className="bg-teal-500 text-white text-xl font-bold">
                                        {user.name?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <div className="font-bold text-lg text-white truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-sm text-teal-100 truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="px-3 py-4">
                            {menuGroups.map((group, groupIndex) => (
                                <div key={groupIndex}>
                                    <div className="space-y-1">
                                        {group.items.map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() => handleNavigate(item.path)}
                                                className="w-full flex items-center justify-between p-3 rounded-xl active:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-gray-50 rounded-lg">
                                                        <item.icon className="h-5 w-5 text-gray-600" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-300" />
                                            </button>
                                        ))}
                                    </div>
                                    {groupIndex < menuGroups.length - 1 && (
                                        <Separator className="my-4 mx-3 opacity-50" />
                                    )}
                                </div>
                            ))}

                            <Separator className="my-4 mx-3 opacity-50" />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 p-3 rounded-xl active:bg-red-50 text-red-600 transition-colors"
                            >
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold">Logout</span>
                            </button>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

export default MobileDrawer;
