import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { useSidebarSettings } from '@/contexts/SidebarContext';
import { useBrand } from '@/contexts/BrandContext';
import { type NavItem } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { BookOpen, Contact, Folder, LayoutGrid, ShoppingBag, Users, Tag, FileIcon, Settings, BarChart, Barcode, FileText, Briefcase, CheckSquare, Calendar, CreditCard, Nfc, Ticket, Gift, DollarSign, MessageSquare, CalendarDays, Palette, Image, Mail, Mail as Store, ChevronDown, Building2, Globe, Package, ShoppingCart, UserCheck, Truck, Star, Zap, Bot, Webhook, FileType, Languages, Percent, Headphones, Smartphone, Globe2, Megaphone } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AppLogo from './app-logo';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { hasPermission } from '@/utils/authorization';



export function AppSidebar() {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const userRole = auth.user?.type || auth.user?.role;
    const permissions = auth?.permissions || [];
    const stores = auth.user?.stores || [];
    const currentStore = stores.find((s: any) => s.id === auth.user?.current_store) || stores[0];
    
    const handleBusinessSwitch = (businessId: number) => {
        // Prevent superadmin from switching stores/businesses
        if (userRole === 'superadmin' || userRole === 'super admin') {
            return;
        }
        
        // Check if user has permission to switch stores (company users always have this ability)
        if (userRole !== 'company' && !hasPermission(permissions, 'switch-stores')) {
            return;
        }
        
        router.post(route('switch-store'), { store_id: businessId });
    };

    const getSuperAdminNavItems = (): NavItem[] => [
        {
            title: t('Dashboard'),
            href: route('dashboard'),
            icon: LayoutGrid,
        },

        {
            title: t('Companies'),
            href: route('companies.index'),
            icon: Briefcase,
        },
        {
            title: t('Media Library'),
            href: route('media-library'),
            icon: Image,
        },
        {
            title: t('Coupons'),
            href: route('coupons.index'),
            icon: Settings,
        },
        {
            title: t('Currencies'),
            href: route('currencies.index'),
            icon: DollarSign,
        },
        {
            title: t('Location Management'),
            icon: Globe2,
            children: [
                {
                    title: t('Countries'),
                    href: route('countries.index')
                },
                {
                    title: t('States'),
                    href: route('states.index')
                },
                {
                    title: t('Cities'),
                    href: route('cities.index')
                }
            ]
        },
        {
            title: t('Email Templates'),
            href: route('email-templates.index'),
            icon: Mail,
        },
        {
            title: t('Plans'),
            icon: CreditCard,
            children: [
                {
                    title: t('All Plans'),
                    href: route('plans.index')
                },
                {
                    title: t('Plan Requests'),
                    href: route('plan-requests.index')
                },
                {
                    title: t('Plan Orders'),
                    href: route('plan-orders.index')
                }
            ]
        },
        {
            title: t('Referral Program'),
            href: route('referral.index'),
            icon: Gift,
        },
        {
            title: t('Settings'),
            href: route('settings'),
            icon: Settings,
        }
    ];

    const getCompanyNavItems = (): NavItem[] => {
        const items: NavItem[] = [];
        const user = auth.user;
        const plan = user?.plan;
        
        // Helper function to check feature access
        const hasFeatureAccess = (feature: string) => {
            // Always allow for superadmin
            if (userRole === 'superadmin') return true;
            
            // If no plan, allow by default (for backward compatibility)
            if (!plan) return true;
            
            const featureMap: { [key: string]: string } = {
                'blog': 'enable_blog',
                'custom_pages': 'enable_custom_pages', 
                'shipping_method': 'enable_shipping_method'
            };
            const planFeature = featureMap[feature];
            return planFeature ? plan[planFeature] === 'on' : true;
        };
        
        // Dashboard
        if (userRole === 'company' || hasPermission(permissions, 'manage-dashboard')) {
            items.push({
                title: t('Dashboard'),
                href: route('dashboard'),
                icon: LayoutGrid,
            });
        }

        // Store Management
        if (userRole === 'company' || hasPermission(permissions, 'manage-stores') || hasPermission(permissions, 'view-stores') || hasPermission(permissions, 'view-store-content')) {
            const storeChildren = [];
            
            if (userRole === 'company' || hasPermission(permissions, 'manage-stores') || hasPermission(permissions, 'view-stores')) {
                storeChildren.push({
                    title: t('Stores'),
                    href: route('stores.index')
                });
            }
            
            if (userRole === 'company' || hasPermission(permissions, 'view-store-content')) {
                storeChildren.push({
                    title: t('Store Content'),
                    href: route('stores.content.index')
                });
            }
            
            if (storeChildren.length > 0) {
                items.push({
                    title: t('Store Management'),
                    icon: Building2,
                    children: storeChildren
                });
            }
        }

        // Product Management
        if (hasPermission(permissions, 'manage-products') || hasPermission(permissions, 'manage-categories') || hasPermission(permissions, 'manage-tax')) {
            const productChildren = [];
            
            if (hasPermission(permissions, 'manage-products')) {
                productChildren.push({
                    title: t('Products'),
                    href: route('products.index')
                });
            }
            
            if (hasPermission(permissions, 'manage-categories')) {
                productChildren.push({
                    title: t('Categories'),
                    href: route('categories.index')
                });
            }
            
            if (hasPermission(permissions, 'manage-tax')) {
                productChildren.push({
                    title: t('Tax'),
                    href: route('tax.index')
                });
            }
            
            if (productChildren.length > 0) {
                items.push({
                    title: t('Product Management'),
                    icon: Package,
                    children: productChildren
                });
            }
        }

        // Order Management
        if (hasPermission(permissions, 'manage-orders')) {
            items.push({
                title: t('Order Management'),
                href: route('orders.index'),
                icon: ShoppingCart,
            });
        }

        // Customer Management
        if (hasPermission(permissions, 'manage-customers')) {
            items.push({
                title: t('Customer Management'),
                href: route('customers.index'),
                icon: UserCheck,
            });
        }



        // Coupon System
        if (hasPermission(permissions, 'manage-coupon-system')) {
            items.push({
                title: t('Coupon System'),
                href: route('coupon-system.index'),
                icon: Percent,
            });
        }

        // Shipping Management - Check plan feature access
        if (hasPermission(permissions, 'manage-shipping') && hasFeatureAccess('shipping_method')) {
            items.push({
                title: t('Shipping Management'),
                href: route('shipping.index'),
                icon: Truck,
            });
        }

        // Analytics & Reporting
        if (hasPermission(permissions, 'view-analytics') || hasPermission(permissions, 'manage-analytics')) {
            items.push({
                title: t('Analytics & Reporting'),
                href: route('analytics.index'),
                icon: BarChart,
            });
        }

        // Blog System - Check plan feature access
        if (hasPermission(permissions, 'manage-blog') && hasFeatureAccess('blog')) {
            items.push({
                title: t('Blog System'),
                href: route('blog.index'),
                icon: BookOpen,
            });
        }

        // POS System
        if (hasPermission(permissions, 'manage-pos')) {
            items.push({
                title: t('POS System'),
                href: route('pos.index'),
                icon: Smartphone,
            });
        }

        // Rating & Reviews
        if (hasPermission(permissions, 'manage-reviews')) {
            items.push({
                title: t('Rating & Reviews'),
                href: route('reviews.index'),
                icon: Star,
            });
        }

        // Newsletter Subscribers
        if (hasPermission(permissions, 'manage-newsletter-subscribers')) {
            items.push({
                title: t('Newsletter Subscribers'),
                href: route('newsletter-subscribers.index'),
                icon: Megaphone,
            });
        }

        // Express Checkout
        if (hasPermission(permissions, 'view-express-checkout') || hasPermission(permissions, 'manage-express-checkout')) {
            items.push({
                title: t('Express Checkout'),
                href: route('express-checkout.index'),
                icon: Zap,
            });
        }

        // Custom Pages - Check plan feature access
        if (hasPermission(permissions, 'manage-custom-pages') && hasFeatureAccess('custom_pages')) {
            items.push({
                title: t('Custom Pages'),
                href: route('custom-pages.index'),
                icon: FileType,
            });
        }

        // Staff Management
        if (hasPermission(permissions, 'manage-users') || hasPermission(permissions, 'manage-roles')) {
            const staffChildren = [];
            if (hasPermission(permissions, 'manage-users')) {
                staffChildren.push({
                    title: t('Users'),
                    href: route('users.index')
                });
            }
            if (hasPermission(permissions, 'manage-roles')) {
                staffChildren.push({
                    title: t('Roles'),
                    href: route('roles.index')
                });
            }
            if (staffChildren.length > 0) {
                items.push({
                    title: t('Staff Management'),
                    icon: Users,
                    children: staffChildren
                });
            }
        }

        // Media Library
        if (hasPermission(permissions, 'manage-media') || hasPermission(permissions, 'view-media')) {
            items.push({
                title: t('Media Library'),
                href: route('media-library'),
                icon: Image,
            });
        }

        // Settings
        if (hasPermission(permissions, 'manage-settings') || 
            hasPermission(permissions, 'manage-system-settings') ||
            hasPermission(permissions, 'manage-email-settings') ||
            hasPermission(permissions, 'manage-brand-settings') ||
            hasPermission(permissions, 'manage-company-settings') ||
            hasPermission(permissions, 'manage-storage-settings') ||
            hasPermission(permissions, 'manage-payment-settings') ||
            hasPermission(permissions, 'manage-currency-settings') ||
            hasPermission(permissions, 'manage-recaptcha-settings') ||
            hasPermission(permissions, 'manage-cookie-settings') ||
            hasPermission(permissions, 'manage-seo-settings') ||
            hasPermission(permissions, 'manage-cache-settings') ||
            hasPermission(permissions, 'manage-account-settings') ||
            hasPermission(permissions, 'manage-webhook-settings')) {
            items.push({
                title: t('Settings'),
                href: route('settings'),
                icon: Settings,
            });
        }

        // Plans (separate menu item)
        if (hasPermission(permissions, 'view-plans') || hasPermission(permissions, 'manage-plans')) {
            items.push({
                title: t('Plans'),
                href: route('plans.index'),
                icon: CreditCard,
            });
        }

        // Referral Program (separate menu item)
        if (hasPermission(permissions, 'manage-referral')) {
            items.push({
                title: t('Referral Program'),
                href: route('referral.index'),
                icon: Gift,
            });
        }

        return items;
    };

    const mainNavItems = userRole === 'superadmin' ? getSuperAdminNavItems() : getCompanyNavItems();

    const { position } = useLayout();
    const { variant, collapsible, style } = useSidebarSettings();
    const [sidebarStyle, setSidebarStyle] = useState({});
    
    // Hardcoded logo paths
    const logoPath = '/storage/media/15/vimstack-logo.jpg';
    const faviconPath = '/images/logos/vimstack-favicon.png';
    const appTitle = 'Vimstack';

    useEffect(() => {

        // Apply styles based on sidebar style
        if (style === 'colored') {
            setSidebarStyle({ backgroundColor: 'var(--primary)', color: 'white' });
        } else if (style === 'gradient') {
            setSidebarStyle({
                background: 'linear-gradient(to bottom, var(--primary), color-mix(in srgb, var(--primary), transparent 20%))',
                color: 'white'
            });
        } else {
            setSidebarStyle({});
        }
    }, [style]);

    const filteredNavItems = mainNavItems;
    
    // Get the first available menu item's href for logo link
    const getFirstAvailableHref = () => {
        if (filteredNavItems.length === 0) return route('dashboard');
        
        const firstItem = filteredNavItems[0];
        if (firstItem.href) {
            return firstItem.href;
        } else if (firstItem.children && firstItem.children.length > 0) {
            return firstItem.children[0].href || route('dashboard');
        }
        return route('dashboard');
    };

    return (
        <Sidebar
            side={position}
            collapsible={collapsible}
            variant={variant}
            className={style !== 'plain' ? 'sidebar-custom-style' : ''}
        >
            <SidebarHeader className={style !== 'plain' ? 'sidebar-styled' : ''} style={sidebarStyle}>
                <div className="flex justify-center items-center p-2">
                    <Link href={getFirstAvailableHref()} prefetch className="flex items-center justify-center">
                        {/* Logo for expanded sidebar */}
                        <div className="h-8 group-data-[collapsible=icon]:hidden flex items-center">
                            <img
                                src={logoPath}
                                alt={appTitle}
                                className="h-8 w-auto max-w-[150px] transition-all duration-200 object-contain"
                                onError={(e) => {
                                    console.error('Logo failed to load:', logoPath);
                                }}
                            />
                        </div>

                        {/* Icon for collapsed sidebar */}
                        <div className="h-8 w-8 hidden group-data-[collapsible=icon]:block">
                            <img
                                src={faviconPath}
                                alt={appTitle}
                                className="h-8 w-8 transition-all duration-200 object-contain rounded"
                                onError={(e) => {
                                    // Fallback to first letter if favicon fails
                                    const container = e.currentTarget.parentElement;
                                    if (container) {
                                        container.innerHTML = `<div class="h-8 w-8 bg-primary text-white rounded flex items-center justify-center font-bold shadow-sm">${appTitle.charAt(0)}</div>`;
                                    }
                                }}
                            />
                        </div>
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <div style={sidebarStyle} className={`h-full ${style !== 'plain' ? 'sidebar-styled' : ''}`}>
                    <NavMain items={filteredNavItems} position={position} />
                </div>
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" position={position} /> */}
                {/* Profile menu moved to header */}
            </SidebarFooter>
        </Sidebar>
    );
}