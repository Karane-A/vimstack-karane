import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { hasPermission } from '@/utils/authorization';
import { type NavItem } from '@/types';
import { useLayout } from '@/contexts/LayoutContext';
import {
    LayoutGrid, Building2, ShoppingCart,
    Globe2, Users, BarChart3,
    Monitor, Percent,
    PlusCircle, Home, Tag, Smartphone,
    Settings as SettingsIcon,
    Megaphone, FileText, Image,
    Truck, Landmark, Mail, Star,
    ShieldCheck, UserPlus, CreditCard,
    Boxes, Shield, Receipt, Activity, LifeBuoy
} from 'lucide-react';

export function useNavigationItems() {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const { adminViewMode: viewMode } = useLayout();

    const userRole = auth.user?.type || auth.user?.role;
    const permissions = auth?.permissions || [];
    const isSuperAdmin = userRole === 'superadmin' || userRole === 'super admin';

    const hasFeatureAccess = (feature: string) => {
        if (userRole === 'superadmin') return true;
        const plan = auth.user?.plan;
        if (!plan) return true;
        const featureMap: { [key: string]: string } = {
            'blog': 'enable_blog',
            'custom_pages': 'enable_custom_pages',
            'shipping_method': 'enable_shipping_method'
        };
        const planFeature = featureMap[feature];
        return planFeature ? plan[planFeature] === 'on' : true;
    };

    const getSuperAdminNavItems = (): NavItem[] => [
        { title: t('Dashboard'), href: route('dashboard'), icon: LayoutGrid },
        { title: t('Metrics'), href: route('superadmin.metrics'), icon: Activity },
        { title: t('Companies'), href: route('companies.index'), icon: Building2 },
        {
            title: t('E-commerce'),
            icon: ShoppingCart,
            children: [
                { title: t('Coupons'), href: route('coupons.index') },
                { title: t('Plans'), href: route('plans.index') },
                { title: t('Plan Requests'), href: route('plan-requests.index') },
                { title: t('Plan Orders'), href: route('plan-orders.index') },
            ]
        },
        {
            title: t('Regional Settings'),
            icon: Globe2,
            children: [
                { title: t('Currencies'), href: route('currencies.index') },
                { title: t('Countries'), href: route('countries.index') },
                { title: t('States'), href: route('states.index') },
                { title: t('Cities'), href: route('cities.index') },
            ]
        },
        {
            title: t('System Resources'),
            icon: SettingsIcon,
            children: [
                { title: t('Media Library'), href: route('media-library') },
                { title: t('Email Templates'), href: route('email-templates.index') },
                { title: t('Referral Program'), href: route('referral.index') },
            ]
        },
        { title: t('Support'), href: route('support.index'), icon: LifeBuoy },
    ];

    const getCompanyNavItems = (): NavItem[] => {
        const items: NavItem[] = [];

        // Home - Always visible at top
        if (userRole === 'company' || hasPermission(permissions, 'manage-dashboard')) {
            items.push({ title: t('Home'), href: route('dashboard'), icon: Home });
        }

        // Sales Group
        const salesChildren = [];
        if (hasPermission(permissions, 'manage-orders')) {
            salesChildren.push({ title: t('Orders'), href: route('orders.index'), icon: ShoppingCart });
        }
        if (hasPermission(permissions, 'manage-products')) {
            salesChildren.push({ title: t('Products'), href: route('products.index'), icon: Tag });
        }
        if (hasPermission(permissions, 'view-categories')) {
            salesChildren.push({ title: t('Categories'), href: route('categories.index'), icon: Boxes });
        }
        if (hasPermission(permissions, 'manage-customers')) {
            salesChildren.push({ title: t('Customers'), href: route('customers.index'), icon: Users });
        }

        if (salesChildren.length > 0) {
            items.push({
                title: t('Sales'),
                icon: ShoppingCart,
                children: salesChildren
            });
        }

        // Marketing Group
        const marketingChildren = [];
        if (hasPermission(permissions, 'manage-coupon-system')) {
            marketingChildren.push({ title: t('Discounts'), href: route('coupon-system.index'), icon: Percent });
        }
        if (hasPermission(permissions, 'manage-reviews')) {
            marketingChildren.push({ title: t('Reviews'), href: route('reviews.index'), icon: Star });
        }
        if (hasPermission(permissions, 'manage-newsletter-subscribers')) {
            marketingChildren.push({ title: t('Newsletter'), href: route('newsletter-subscribers.index'), icon: Mail });
        }

        if (marketingChildren.length > 0) {
            items.push({
                title: t('Marketing'),
                icon: Megaphone,
                children: marketingChildren
            });
        }

        // Analytics - Standalone
        if (hasPermission(permissions, 'view-analytics') || hasPermission(permissions, 'manage-analytics')) {
            items.push({ title: t('Analytics'), href: route('analytics.index'), icon: BarChart3 });
        }

        // Sales Channels Group
        const channelsChildren = [];
        if (userRole === 'company' || hasPermission(permissions, 'manage-stores') || hasPermission(permissions, 'view-stores')) {
            channelsChildren.push({ title: t('Online Store'), href: route('stores.index'), icon: Globe2 });
        }
        if (hasPermission(permissions, 'manage-pos')) {
            channelsChildren.push({ title: t('Point of Sale'), href: route('pos.index'), icon: Smartphone });
        }

        if (channelsChildren.length > 0) {
            items.push({
                title: t('Sales Channels'),
                icon: LayoutGrid,
                children: channelsChildren
            });
        }

        // Content Group
        const contentChildren = [];
        if (userRole === 'company' || hasPermission(permissions, 'view-store-content')) {
            contentChildren.push({ title: t('Store Content'), href: route('stores.content.index'), icon: FileText });
        }
        if (hasPermission(permissions, 'manage-blog') && hasFeatureAccess('blog')) {
            contentChildren.push({ title: t('Blog'), href: route('blog.index'), icon: FileText });
        }
        if (userRole === 'company' || hasPermission(permissions, 'view-custom-pages')) {
            contentChildren.push({ title: t('Custom Pages'), href: route('custom-pages.index'), icon: FileText });
        }

        if (contentChildren.length > 0) {
            items.push({
                title: t('Content'),
                icon: FileText,
                children: contentChildren
            });
        }

        // Settings Group
        const settingsChildren = [];
        // General - Account Settings (always visible for company users)
        if (userRole === 'company' && auth.user?.company_id) {
            settingsChildren.push({ title: t('General'), href: route('stores.settings', auth.user.company_id), icon: SettingsIcon });
        }
        if (hasPermission(permissions, 'manage-users')) {
            settingsChildren.push({ title: t('Staff'), href: route('users.index'), icon: UserPlus });
        }
        if (hasPermission(permissions, 'manage-roles') || hasPermission(permissions, 'view-roles')) {
            settingsChildren.push({ title: t('User Roles'), href: route('roles.index'), icon: Shield });
        }
        if (hasPermission(permissions, 'manage-shipping')) {
            settingsChildren.push({ title: t('Shipping'), href: route('shipping.index'), icon: Truck });
        }
        if (hasPermission(permissions, 'manage-tax')) {
            settingsChildren.push({ title: t('Tax'), href: route('tax.index'), icon: Receipt });
        }
        if (hasPermission(permissions, 'view-plans')) {
            settingsChildren.push({ title: t('Billing'), href: route('plans.index'), icon: CreditCard });
        }
        if (hasPermission(permissions, 'manage-referral')) {
            settingsChildren.push({ title: t('Referral Program'), href: route('referral.index'), icon: Star });
        }

        if (settingsChildren.length > 0) {
            items.push({
                title: t('Settings'),
                icon: SettingsIcon,
                children: settingsChildren
            });
        }

        // Support - Always at the bottom
        items.push({ title: t('Support'), href: route('support.index'), icon: LifeBuoy });

        return items;
    };

    return (isSuperAdmin && viewMode === 'admin') ? getSuperAdminNavItems() : getCompanyNavItems();
}
