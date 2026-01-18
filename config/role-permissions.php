<?php

return [
    'superadmin' => [
        'dashboard',
        'users',
        'roles',
        'permissions',
        'companies',
        'plans',
        'plan_requests',
        'plan_orders',
        'currencies',
        'referral',
        'coupons',
        'settings'
    ],
    
    'company' => [
        'dashboard',
        'users',
        'roles',
        // 'permissions' - Removed: Permission CRUD functionality not needed for company users
        'plans',
        'plan_requests',
        'plan_orders',
        // 'referral' - Removed: Referral is only for company and superadmin level, not for regular users
        'settings', // Limited settings for company users
        'webhooks',
        // 'businesses' - Removed: Business functionality not implemented in the project
        'media',
        'language',
        // 'landing_page' - Removed: Landing page management is superadmin only
        'stores',
        'store_settings',
        'store_content',
        'products',
        'categories',
        'tax',
        'orders',
        'customers',
        'coupon_system',
        'shipping',
        'blog',
        'pos',
        'reviews',
        'newsletter_subscribers',
        'custom_pages',
        'express_checkout',
        'analytics',
        'referral'
    ]
];