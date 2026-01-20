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
    Boxes
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
    ];

    const getCompanyNavItems = (): NavItem[] => {
        const items: NavItem[] = [];

        // --- CORE SECTION ---
        // 1. Home
        if (userRole === 'company' || hasPermission(permissions, 'manage-dashboard')) {
            items.push({ title: t('Home'), href: route('dashboard'), icon: Home });
        }

        // 2. Orders
        if (hasPermission(permissions, 'manage-orders')) {
            items.push({ title: t('Orders'), href: route('orders.index'), icon: ShoppingCart });
        }

        // 3. Products
        if (hasPermission(permissions, 'manage-products')) {
            items.push({
                title: t('Products'),
                icon: Tag,
                href: route('products.index'),
            });
        }

        // 4. Customers
        if (hasPermission(permissions, 'manage-customers')) {
            items.push({ title: t('Customers'), href: route('customers.index'), icon: Users });
        }

        // 5. Analytics
        if (hasPermission(permissions, 'view-analytics') || hasPermission(permissions, 'manage-analytics')) {
            items.push({ title: t('Analytics'), href: route('analytics.index'), icon: BarChart3 });
        }

        // --- TOOLS SECTION ---
        const toolItems: NavItem[] = [];

        // Marketing Dropdown
        const marketingChildren = [];
        if (hasPermission(permissions, 'manage-coupon-system')) {
            marketingChildren.push({ title: t('Coupons'), href: route('coupon-system.index'), icon: Percent });
        }
        if (hasPermission(permissions, 'manage-newsletter-subscribers')) {
            marketingChildren.push({ title: t('Newsletter'), href: route('newsletter-subscribers.index'), icon: Mail });
        }
        if (hasPermission(permissions, 'manage-reviews')) {
            marketingChildren.push({ title: t('Reviews'), href: route('reviews.index'), icon: Star });
        }

        if (marketingChildren.length > 0 || hasPermission(permissions, 'view-referral')) {
            toolItems.push({
                title: t('Marketing'),
                icon: Megaphone,
                children: marketingChildren.length > 0 ? marketingChildren : undefined,
                href: marketingChildren.length === 0 ? route('referral.index') : undefined
            });
        }

        // Flattened Sales Channels
        if (hasPermission(permissions, 'manage-pos')) {
            toolItems.push({ title: t('Point of Sale'), href: route('pos.index'), icon: Smartphone });
        }
        if (userRole === 'company' || hasPermission(permissions, 'manage-stores') || hasPermission(permissions, 'view-stores')) {
            toolItems.push({ title: t('Online Store'), href: route('stores.index'), icon: Globe2 });
        }

        if (toolItems.length > 0) {
            items.push({
                title: t('Tools'),
                isLabel: true,
                children: toolItems
            });
        }

        // --- MANAGE SECTION ---
        const manageItems: NavItem[] = [];

        // Staff Dropdown
        const staffChildren = [];
        if (hasPermission(permissions, 'manage-users')) {
            staffChildren.push({ title: t('Team Members'), href: route('users.index') });
        }
        if (hasPermission(permissions, 'view-roles')) {
            staffChildren.push({ title: t('User Roles'), href: route('roles.index') });
        }
        if (staffChildren.length > 0) {
            manageItems.push({
                title: t('Staff'),
                icon: ShieldCheck,
                children: staffChildren
            });
        }

        // Combined Shipping & Tax
        if (hasPermission(permissions, 'manage-shipping') || hasPermission(permissions, 'manage-tax')) {
            manageItems.push({
                title: t('Shipping & Tax'),
                href: hasPermission(permissions, 'manage-shipping') ? route('shipping.index') : route('tax.index'),
                icon: Truck
            });
        }

        // Flattened Billing
        if (hasPermission(permissions, 'view-plans')) {
            manageItems.push({ title: t('Billing'), href: route('plans.index'), icon: CreditCard });
        }

        if (manageItems.length > 0) {
            items.push({
                title: t('Manage'),
                isLabel: true,
                children: manageItems
            });
        }

        // --- CONTENT SECTION ---
        const contentItems: NavItem[] = [];

        // Store Content
        if (userRole === 'company' || hasPermission(permissions, 'view-store-content')) {
            contentItems.push({ title: t('Store Content'), href: route('stores.content.index'), icon: LayoutGrid });
        }

        // Blog Posts
        if (hasPermission(permissions, 'manage-blog') && hasFeatureAccess('blog')) {
            contentItems.push({ title: t('Blog Posts'), href: route('blog.index'), icon: FileText });
        }

        // Product Categories (Moved here)
        if (hasPermission(permissions, 'view-categories')) {
            contentItems.push({ title: t('Product Categories'), href: route('categories.index'), icon: Tag });
        }

        // Email Templates
        contentItems.push({ title: t('Email Templates'), href: route('email-templates.index'), icon: Mail });

        if (contentItems.length > 0) {
            items.push({
                title: t('Content'),
                isLabel: true,
                children: contentItems
            });
        }

        return items;
    };

    return (isSuperAdmin && viewMode === 'admin') ? getSuperAdminNavItems() : getCompanyNavItems();
}
