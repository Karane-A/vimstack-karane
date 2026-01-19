import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { hasPermission } from '@/utils/authorization';
import { type NavItem } from '@/types';
import { useLayout } from '@/contexts/LayoutContext';
import {
    LayoutGrid, Building2, ShoppingCart, CreditCard, FileType,
    DollarSign, Globe2, Image, Mail, Gift, Briefcase, Package,
    Zap, Users, BarChart3, BookOpen, Smartphone, Star, Megaphone,
    TrendingUp, Tag, Settings as SettingsIcon
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

        if (userRole === 'company' || hasPermission(permissions, 'manage-dashboard')) {
            items.push({ title: t('Dashboard'), href: route('dashboard'), icon: LayoutGrid });
        }

        const storeAndProductChildren: NavItem[] = [];
        if (userRole === 'company' || hasPermission(permissions, 'manage-stores') || hasPermission(permissions, 'view-stores')) {
            storeAndProductChildren.push({ title: t('Stores'), href: route('stores.index') });
        }
        if (userRole === 'company' || hasPermission(permissions, 'view-store-content')) {
            storeAndProductChildren.push({ title: t('Store Content'), href: route('stores.content.index') });
        }
        if (hasPermission(permissions, 'manage-products')) {
            storeAndProductChildren.push({ title: t('Products'), href: route('products.index') });
        }
        if (hasPermission(permissions, 'manage-categories')) {
            storeAndProductChildren.push({ title: t('Categories'), href: route('categories.index') });
        }
        if (hasPermission(permissions, 'manage-tax')) {
            storeAndProductChildren.push({ title: t('Tax'), href: route('tax.index') });
        }
        if (hasPermission(permissions, 'manage-blog') && hasFeatureAccess('blog')) {
            storeAndProductChildren.push({ title: t('Blog'), href: route('blog.index') });
        }
        if (hasPermission(permissions, 'manage-newsletter-subscribers')) {
            storeAndProductChildren.push({ title: t('Newsletter'), href: route('newsletter-subscribers.index') });
        }
        if (hasPermission(permissions, 'manage-custom-pages') && hasFeatureAccess('custom_pages')) {
            storeAndProductChildren.push({ title: t('Custom Pages'), href: route('custom-pages.index') });
        }

        if (storeAndProductChildren.length > 0) {
            items.push({ title: t('Catalog'), icon: Package, children: storeAndProductChildren });
        }

        const opChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-orders')) opChildren.push({ title: t('Orders'), href: route('orders.index') });
        if (hasPermission(permissions, 'manage-customers')) opChildren.push({ title: t('Customers'), href: route('customers.index') });
        if (hasPermission(permissions, 'manage-pos')) opChildren.push({ title: t('POS'), href: route('pos.index') });
        if (hasPermission(permissions, 'view-express-checkout') || hasPermission(permissions, 'manage-express-checkout')) opChildren.push({ title: t('Checkout'), href: route('express-checkout.index') });
        if (hasPermission(permissions, 'manage-coupon-system')) opChildren.push({ title: t('Coupons'), href: route('coupon-system.index') });
        if (hasPermission(permissions, 'manage-shipping') && hasFeatureAccess('shipping_method')) opChildren.push({ title: t('Shipping'), href: route('shipping.index') });
        if (opChildren.length > 0) {
            items.push({ title: t('Operations'), icon: Zap, children: opChildren });
        }

        const staffChildren: NavItem[] = [];
        if (hasPermission(permissions, 'manage-users')) staffChildren.push({ title: t('Users'), href: route('users.index') });
        if (hasPermission(permissions, 'manage-roles')) staffChildren.push({ title: t('Roles'), href: route('roles.index') });
        if (staffChildren.length > 0) {
            items.push({ title: t('Staff'), icon: Users, children: staffChildren });
        }

        const growthChildren: NavItem[] = [];
        if (hasPermission(permissions, 'view-analytics') || hasPermission(permissions, 'manage-analytics')) growthChildren.push({ title: t('Analytics'), href: route('analytics.index') });
        if (hasPermission(permissions, 'manage-reviews')) growthChildren.push({ title: t('Reviews'), href: route('reviews.index') });
        if (hasPermission(permissions, 'view-plans') || hasPermission(permissions, 'manage-plans')) growthChildren.push({ title: t('Subscription Plans'), href: route('plans.index') });
        if (hasPermission(permissions, 'manage-referral')) growthChildren.push({ title: t('Referral Program'), href: route('referral.index') });
        if (growthChildren.length > 0) {
            items.push({ title: t('Growth'), icon: TrendingUp, children: growthChildren });
        }

        return items;
    };

    return (isSuperAdmin && viewMode === 'admin') ? getSuperAdminNavItems() : getCompanyNavItems();
}
