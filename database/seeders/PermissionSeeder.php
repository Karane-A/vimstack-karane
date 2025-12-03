<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Dashboard permissions
            ['name' => 'manage-dashboard', 'module' => 'dashboard', 'label' => 'Manage Dashboard', 'description' => 'Can view dashboard'],
            ['name' => 'export-dashboard', 'module' => 'dashboard', 'label' => 'Export Dashboard', 'description' => 'Can export dashboard data'],

            // User management
            ['name' => 'manage-users', 'module' => 'users', 'label' => 'Manage Users', 'description' => 'Can manage users'],
            ['name' => 'manage-any-users', 'module' => 'users', 'label' => 'Manage All Users', 'description' => 'Manage Any Users'],
            ['name' => 'manage-own-users', 'module' => 'users', 'label' => 'Manage Own Users', 'description' => 'Manage Limited Users that is created by own'],
            ['name' => 'view-users', 'module' => 'users', 'label' => 'Manage Users', 'description' => 'View Users'],
            ['name' => 'create-users', 'module' => 'users', 'label' => 'Create Users', 'description' => 'Can create users'],
            ['name' => 'edit-users', 'module' => 'users', 'label' => 'Edit Users', 'description' => 'Can edit users'],
            ['name' => 'delete-users', 'module' => 'users', 'label' => 'Delete Users', 'description' => 'Can delete users'],
            ['name' => 'reset-password-users', 'module' => 'users', 'label' => 'Reset Password Users', 'description' => 'Can reset password users'],
            ['name' => 'toggle-status-users', 'module' => 'users', 'label' => 'Change Status Users', 'description' => 'Can change status users'],
            
            // Role management
            ['name' => 'manage-roles', 'module' => 'roles', 'label' => 'Manage Roles', 'description' => 'Can manage roles'],
            ['name' => 'manage-any-roles', 'module' => 'roles', 'label' => 'Manage All Roles', 'description' => 'Manage Any Roles'],
            ['name' => 'manage-own-roles', 'module' => 'roles', 'label' => 'Manage Own Roles', 'description' => 'Manage Limited Roles that is created by own'],
            ['name' => 'view-roles', 'module' => 'roles', 'label' => 'View Roles', 'description' => 'View Roles'],
            ['name' => 'create-roles', 'module' => 'roles', 'label' => 'Create Roles', 'description' => 'Can create roles'],
            ['name' => 'edit-roles', 'module' => 'roles', 'label' => 'Edit Roles', 'description' => 'Can edit roles'],
            ['name' => 'delete-roles', 'module' => 'roles', 'label' => 'Delete Roles', 'description' => 'Can delete roles'],
            
            // Permission management
            ['name' => 'manage-permissions', 'module' => 'permissions', 'label' => 'Manage Permissions', 'description' => 'Can manage permissions'],
            ['name' => 'manage-any-permissions', 'module' => 'permissions', 'label' => 'Manage All Permissions', 'description' => 'Manage Any Permissions'],
            ['name' => 'manage-own-permissions', 'module' => 'permissions', 'label' => 'Manage Own Permissions', 'description' => 'Manage Limited Permissions that is created by own'],
            ['name' => 'view-permissions', 'module' => 'permissions', 'label' => 'View Permissions', 'description' => 'View Permissions'],
            ['name' => 'create-permissions', 'module' => 'permissions', 'label' => 'Create Permissions', 'description' => 'Can create permissions'],
            ['name' => 'edit-permissions', 'module' => 'permissions', 'label' => 'Edit Permissions', 'description' => 'Can edit permissions'],
            ['name' => 'delete-permissions', 'module' => 'permissions', 'label' => 'Delete Permissions', 'description' => 'Can delete permissions'],
            
            // Company management
            ['name' => 'manage-companies', 'module' => 'companies', 'label' => 'Manage Companies', 'description' => 'Can manage Companies'],
            ['name' => 'manage-any-companies', 'module' => 'companies', 'label' => 'Manage All Companies', 'description' => 'Manage Any Companies'],
            ['name' => 'manage-own-companies', 'module' => 'companies', 'label' => 'Manage Own Companies', 'description' => 'Manage Limited Companies that is created by own'],
            ['name' => 'view-companies', 'module' => 'companies', 'label' => 'View Companies', 'description' => 'View Companies'],
            ['name' => 'create-companies', 'module' => 'companies', 'label' => 'Create Companies', 'description' => 'Can create Companies'],
            ['name' => 'edit-companies', 'module' => 'companies', 'label' => 'Edit Companies', 'description' => 'Can edit Companies'],
            ['name' => 'delete-companies', 'module' => 'companies', 'label' => 'Delete Companies', 'description' => 'Can delete Companies'],
            ['name' => 'reset-password-companies', 'module' => 'companies', 'label' => 'Reset Password Companies', 'description' => 'Can reset password Companies'],
            ['name' => 'toggle-status-companies', 'module' => 'companies', 'label' => 'Change Status Companies', 'description' => 'Can change status companies'],
            ['name' => 'manage-plans-companies', 'module' => 'companies', 'label' => 'Manage Plan Companies', 'description' => 'Can manage plans companies'],
            ['name' => 'upgrade-plan-companies', 'module' => 'companies', 'label' => 'Upgrade Plan Companies', 'description' => 'Can upgrade plan of companies'],
            
            // Plan management
            ['name' => 'manage-plans', 'module' => 'plans', 'label' => 'Manage Plans', 'description' => 'Can manage subscription plans'],
            ['name' => 'manage-any-plans', 'module' => 'plans', 'label' => 'Manage All Plans', 'description' => 'Manage Any Plans'],
            ['name' => 'manage-own-plans', 'module' => 'plans', 'label' => 'Manage Own Plans', 'description' => 'Manage Limited Plans that is created by own'],
            ['name' => 'view-plans', 'module' => 'plans', 'label' => 'View Plans', 'description' => 'View Plans'],
            ['name' => 'create-plans', 'module' => 'plans', 'label' => 'Create Plans', 'description' => 'Can create subscription plans'],
            ['name' => 'edit-plans', 'module' => 'plans', 'label' => 'Edit Plans', 'description' => 'Can edit subscription plans'],
            ['name' => 'delete-plans', 'module' => 'plans', 'label' => 'Delete Plans', 'description' => 'Can delete subscription plans'],
            ['name' => 'request-plans', 'module' => 'plans', 'label' => 'Request Plans', 'description' => 'Can request subscription plans'],
            ['name' => 'trial-plans', 'module' => 'plans', 'label' => 'Trial Plans', 'description' => 'Can start trial for subscription plans'],
            ['name' => 'subscribe-plans', 'module' => 'plans', 'label' => 'Subscribe Plans', 'description' => 'Can subscribe to subscription plans'],
            


            // Coupon management
            ['name' => 'manage-coupons', 'module' => 'coupons', 'label' => 'Manage Coupons', 'description' => 'Can manage subscription Coupons'],
            ['name' => 'manage-any-coupons', 'module' => 'coupons', 'label' => 'Manage All Coupons', 'description' => 'Manage Any Coupons'],
            ['name' => 'manage-own-coupons', 'module' => 'coupons', 'label' => 'Manage Own Coupons', 'description' => 'Manage Limited Coupons that is created by own'],
            ['name' => 'view-coupons', 'module' => 'coupons', 'label' => 'View Coupons', 'description' => 'View Coupons'],
            ['name' => 'create-coupons', 'module' => 'coupons', 'label' => 'Create Coupons', 'description' => 'Can create subscription Coupons'],
            ['name' => 'edit-coupons', 'module' => 'coupons', 'label' => 'Edit Coupons', 'description' => 'Can edit subscription Coupons'],
            ['name' => 'delete-coupons', 'module' => 'coupons', 'label' => 'Delete Coupons', 'description' => 'Can delete subscription Coupons'],
            ['name' => 'toggle-status-coupons', 'module' => 'coupons', 'label' => 'Change Status Coupons', 'description' => 'Can change status Coupons'],
            
            // Plan Requests management
            ['name' => 'manage-plan-requests', 'module' => 'plan_requests', 'label' => 'Manage Plan Requests', 'description' => 'Can manage plan requests'],
            ['name' => 'view-plan-requests', 'module' => 'plan_requests', 'label' => 'View Plan Requests', 'description' => 'View Plan Requests'],

            ['name' => 'edit-plan-requests', 'module' => 'plan_requests', 'label' => 'Edit Plan Requests', 'description' => 'Can edit plan requests'],
            ['name' => 'delete-plan-requests', 'module' => 'plan_requests', 'label' => 'Delete Plan Requests', 'description' => 'Can delete plan requests'],
            ['name' => 'approve-plan-requests', 'module' => 'plan_requests', 'label' => 'Approve plan requests', 'description' => 'Can approve plan requests'],
            ['name' => 'reject-plan-requests', 'module' => 'plan_requests', 'label' => 'Reject plan requests', 'description' => 'Can reject plplan requests'],

            // Plan Orders management
            ['name' => 'manage-plan-orders', 'module' => 'plan_orders', 'label' => 'Manage Plan Orders', 'description' => 'Can manage plan orders'],
            ['name' => 'view-plan-orders', 'module' => 'plan_orders', 'label' => 'View Plan Orders', 'description' => 'View Plan Orders'],
            ['name' => 'create-plan-orders', 'module' => 'plan_orders', 'label' => 'Create Plan Orders', 'description' => 'Can create plan orders'],
            ['name' => 'edit-plan-orders', 'module' => 'plan_orders', 'label' => 'Edit Plan Orders', 'description' => 'Can edit plan orders'],
            ['name' => 'delete-plan-orders', 'module' => 'plan_orders', 'label' => 'Delete Plan Orders', 'description' => 'Can delete plan orders'],
            ['name' => 'approve-plan-orders', 'module' => 'plan_orders', 'label' => 'Approve Plan Orders', 'description' => 'Can approve plan orders'],
            ['name' => 'reject-plan-orders', 'module' => 'plan_orders', 'label' => 'Reject Plan Orders', 'description' => 'Can reject plan orders'],



            // Settings
            ['name' => 'manage-settings', 'module' => 'settings', 'label' => 'Manage Settings', 'description' => 'Can manage All settings'],
            ['name' => 'manage-system-settings', 'module' => 'settings', 'label' => 'Manage System Settings', 'description' => 'Can manage system settings'],
            ['name' => 'manage-email-settings', 'module' => 'settings', 'label' => 'Manage Email Settings', 'description' => 'Can manage email settings'],
            ['name' => 'manage-brand-settings', 'module' => 'settings', 'label' => 'Manage Brand Settings', 'description' => 'Can manage brand settings'],
            ['name' => 'manage-company-settings', 'module' => 'settings', 'label' => 'Manage Company Settings', 'description' => 'Can manage Company settings'],
            ['name' => 'manage-storage-settings', 'module' => 'settings', 'label' => 'Manage Storage Settings', 'description' => 'Can manage storage settings'],
            ['name' => 'manage-payment-settings', 'module' => 'settings', 'label' => 'Manage Payment Settings', 'description' => 'Can manage payment settings'],
            ['name' => 'manage-currency-settings', 'module' => 'settings', 'label' => 'Manage Currency Settings', 'description' => 'Can manage currency settings'],
            ['name' => 'manage-recaptcha-settings', 'module' => 'settings', 'label' => 'Manage ReCaptch Settings', 'description' => 'Can manage recaptcha settings'],
            ['name' => 'manage-chatgpt-settings', 'module' => 'settings', 'label' => 'Manage ChatGpt Settings', 'description' => 'Can manage chatgpt settings'],
            ['name' => 'manage-cookie-settings', 'module' => 'settings', 'label' => 'Manage Cookie(GDPR) Settings', 'description' => 'Can manage cookie settings'],
            ['name' => 'manage-seo-settings', 'module' => 'settings', 'label' => 'Manage Seo Settings', 'description' => 'Can manage seo settings'],
            ['name' => 'manage-cache-settings', 'module' => 'settings', 'label' => 'Manage Cache Settings', 'description' => 'Can manage cache settings'],
            ['name' => 'manage-account-settings', 'module' => 'settings', 'label' => 'Manage Account Settings', 'description' => 'Can manage account settings'],
            
            // Business management
            ['name' => 'manage-businesses', 'module' => 'businesses', 'label' => 'Manage Businesses', 'description' => 'Can manage businesses'],
            ['name' => 'manage-any-businesses', 'module' => 'businesses', 'label' => 'Manage All businesses', 'description' => 'Manage Any businesses'],
            ['name' => 'manage-own-businesses', 'module' => 'businesses', 'label' => 'Manage Own businesses', 'description' => 'Manage Limited businesses that is created by own'],
            ['name' => 'view-businesses', 'module' => 'businesses', 'label' => 'View Businesses', 'description' => 'View Businesses'],
            ['name' => 'create-businesses', 'module' => 'businesses', 'label' => 'Create Businesses', 'description' => 'Can create businesses'],
            ['name' => 'edit-businesses', 'module' => 'businesses', 'label' => 'Edit Businesses', 'description' => 'Can edit businesses'],
            ['name' => 'delete-businesses', 'module' => 'businesses', 'label' => 'Delete Businesses', 'description' => 'Can delete businesses'],
            

            
            // Currency management
            ['name' => 'manage-currencies', 'module' => 'currencies', 'label' => 'Manage Currencies', 'description' => 'Can manage currencies'],
            ['name' => 'manage-any-currencies', 'module' => 'currencies', 'label' => 'Manage All currencies', 'description' => 'Manage Any currencies'],
            ['name' => 'manage-own-currencies', 'module' => 'currencies', 'label' => 'Manage Own currencies', 'description' => 'Manage Limited currencies that is created by own'],
            ['name' => 'view-currencies', 'module' => 'currencies', 'label' => 'View Currencies', 'description' => 'View Currencies'],
            ['name' => 'create-currencies', 'module' => 'currencies', 'label' => 'Create Currencies', 'description' => 'Can create currencies'],
            ['name' => 'edit-currencies', 'module' => 'currencies', 'label' => 'Edit Currencies', 'description' => 'Can edit currencies'],
            ['name' => 'delete-currencies', 'module' => 'currencies', 'label' => 'Delete Currencies', 'description' => 'Can delete currencies'],
            

            

            
            // Referral management
            ['name' => 'manage-referral', 'module' => 'referral', 'label' => 'Manage Referral', 'description' => 'Can manage referral program'],
            ['name' => 'manage-setting-referral', 'module' => 'referral', 'label' => 'Manage Referral Setting', 'description' => 'Can manage Referral Setting'],
            ['name' => 'manage-payout-referral', 'module' => 'referral', 'label' => 'Manage Referral Payout', 'description' => 'Can manage Referral Payout program'],
            ['name' => 'approve-payout-referral', 'module' => 'referral', 'label' => 'Approve Referral Payout', 'description' => 'Can approve payout request'],
            ['name' => 'reject-payout-referral', 'module' => 'referral', 'label' => 'Reject Referral Payout', 'description' => 'Can reject payout request'],

            // Language management
            ['name' => 'manage-language', 'module' => 'language', 'label' => 'Manage Language', 'description' => 'Can manage language'],
            ['name' => 'edit-language', 'module' => 'language', 'label' => 'Edit Language', 'description' => 'Edit Language'],
            ['name' => 'view-language', 'module' => 'language', 'label' => 'View Language', 'description' => 'View Language'],

            // Media management
            ['name' => 'manage-media', 'module' => 'media', 'label' => 'Manage Media', 'description' => 'Can manage media'],
            ['name' => 'manage-any-media', 'module' => 'media', 'label' => 'Manage All Media', 'description' => 'Manage Any media'],
            ['name' => 'manage-own-media', 'module' => 'media', 'label' => 'Manage Own Media', 'description' => 'Manage Limited media that is created by own'],
            ['name' => 'create-media', 'module' => 'media', 'label' => 'Create media', 'description' => 'Create media'],
            ['name' => 'edit-media', 'module' => 'media', 'label' => 'Edit media', 'description' => 'Edit media'],
            ['name' => 'delete-media', 'module' => 'media', 'label' => 'Delete media', 'description' => 'Delete media'],
            ['name' => 'view-media', 'module' => 'media', 'label' => 'View media', 'description' => 'View media'],
            ['name' => 'download-media', 'module' => 'media', 'label' => 'Download media', 'description' => 'Download media'],
            
            // Webhook management
            ['name' => 'manage-webhook-settings', 'module' => 'settings', 'label' => 'Manage Webhook Settings', 'description' => 'Can manage webhook settings'],
            // Landing Page management
            ['name' => 'manage-landing-page', 'module' => 'landing_page', 'label' => 'Manage Landing Page', 'description' => 'Can manage landing page'],
            ['name' => 'view-landing-page', 'module' => 'landing_page', 'label' => 'View Landing Page', 'description' => 'View landing page'],
            ['name' => 'edit-landing-page', 'module' => 'landing_page', 'label' => 'Edit Landing Page', 'description' => 'Edit landing page'],
            
            // Store management
            ['name' => 'manage-stores', 'module' => 'stores', 'label' => 'Manage Stores', 'description' => 'Can manage stores'],
            ['name' => 'view-stores', 'module' => 'stores', 'label' => 'View Stores', 'description' => 'View stores'],
            ['name' => 'create-stores', 'module' => 'stores', 'label' => 'Create Stores', 'description' => 'Can create stores'],
            ['name' => 'edit-stores', 'module' => 'stores', 'label' => 'Edit Stores', 'description' => 'Can edit stores'],
            ['name' => 'delete-stores', 'module' => 'stores', 'label' => 'Delete Stores', 'description' => 'Can delete stores'],
            ['name' => 'export-stores', 'module' => 'stores', 'label' => 'Export Stores', 'description' => 'Can export stores data'],
            ['name' => 'manage-store-content', 'module' => 'stores', 'label' => 'Manage Store Content', 'description' => 'Can manage store content'],
            ['name' => 'view-store-content', 'module' => 'stores', 'label' => 'View Store Content', 'description' => 'Can view store content'],
            ['name' => 'edit-store-content', 'module' => 'stores', 'label' => 'Edit Store Content', 'description' => 'Can edit store content'],
            ['name' => 'manage-store-settings', 'module' => 'stores', 'label' => 'Manage Store Settings', 'description' => 'Can manage store settings'],
            ['name' => 'switch-stores', 'module' => 'stores', 'label' => 'Switch Stores', 'description' => 'Can switch between stores'],
            
            // Product management
            ['name' => 'manage-products', 'module' => 'products', 'label' => 'Manage Products', 'description' => 'Can manage products'],
            ['name' => 'view-products', 'module' => 'products', 'label' => 'View Products', 'description' => 'View products'],
            ['name' => 'create-products', 'module' => 'products', 'label' => 'Create Products', 'description' => 'Can create products'],
            ['name' => 'edit-products', 'module' => 'products', 'label' => 'Edit Products', 'description' => 'Can edit products'],
            ['name' => 'delete-products', 'module' => 'products', 'label' => 'Delete Products', 'description' => 'Can delete products'],
            ['name' => 'export-products', 'module' => 'products', 'label' => 'Export Products', 'description' => 'Can export products data'],
            
            // Category management
            ['name' => 'manage-categories', 'module' => 'categories', 'label' => 'Manage Categories', 'description' => 'Can manage categories'],
            ['name' => 'view-categories', 'module' => 'categories', 'label' => 'View Categories', 'description' => 'View categories'],
            ['name' => 'create-categories', 'module' => 'categories', 'label' => 'Create Categories', 'description' => 'Can create categories'],
            ['name' => 'edit-categories', 'module' => 'categories', 'label' => 'Edit Categories', 'description' => 'Can edit categories'],
            ['name' => 'delete-categories', 'module' => 'categories', 'label' => 'Delete Categories', 'description' => 'Can delete categories'],
            ['name' => 'export-categories', 'module' => 'categories', 'label' => 'Export Categories', 'description' => 'Can export categories data'],
            
            // Tax management
            ['name' => 'manage-tax', 'module' => 'tax', 'label' => 'Manage Tax', 'description' => 'Can manage tax rules'],
            ['name' => 'view-tax', 'module' => 'tax', 'label' => 'View Tax', 'description' => 'View tax rules'],
            ['name' => 'create-tax', 'module' => 'tax', 'label' => 'Create Tax', 'description' => 'Can create tax rules'],
            ['name' => 'edit-tax', 'module' => 'tax', 'label' => 'Edit Tax', 'description' => 'Can edit tax rules'],
            ['name' => 'delete-tax', 'module' => 'tax', 'label' => 'Delete Tax', 'description' => 'Can delete tax rules'],
            ['name' => 'export-tax', 'module' => 'tax', 'label' => 'Export Tax', 'description' => 'Can export tax rules data'],
            
            // Order management
            ['name' => 'manage-orders', 'module' => 'orders', 'label' => 'Manage Orders', 'description' => 'Can manage orders'],
            ['name' => 'view-orders', 'module' => 'orders', 'label' => 'View Orders', 'description' => 'View orders'],

            ['name' => 'edit-orders', 'module' => 'orders', 'label' => 'Edit Orders', 'description' => 'Can edit orders'],
            ['name' => 'delete-orders', 'module' => 'orders', 'label' => 'Delete Orders', 'description' => 'Can delete orders'],
            ['name' => 'export-orders', 'module' => 'orders', 'label' => 'Export Orders', 'description' => 'Can export orders data'],
            
            // Customer management
            ['name' => 'manage-customers', 'module' => 'customers', 'label' => 'Manage Customers', 'description' => 'Can manage customers'],
            ['name' => 'view-customers', 'module' => 'customers', 'label' => 'View Customers', 'description' => 'View customers'],
            ['name' => 'create-customers', 'module' => 'customers', 'label' => 'Create Customers', 'description' => 'Can create customers'],
            ['name' => 'edit-customers', 'module' => 'customers', 'label' => 'Edit Customers', 'description' => 'Can edit customers'],
            ['name' => 'delete-customers', 'module' => 'customers', 'label' => 'Delete Customers', 'description' => 'Can delete customers'],
            ['name' => 'export-customers', 'module' => 'customers', 'label' => 'Export Customers', 'description' => 'Can export customers data'],
            
            // Coupon System management
            ['name' => 'manage-coupon-system', 'module' => 'coupon_system', 'label' => 'Manage Coupon System', 'description' => 'Can manage store coupons'],
            ['name' => 'view-coupon-system', 'module' => 'coupon_system', 'label' => 'View Coupon System', 'description' => 'View store coupons'],
            ['name' => 'create-coupon-system', 'module' => 'coupon_system', 'label' => 'Create Coupon System', 'description' => 'Can create store coupons'],
            ['name' => 'edit-coupon-system', 'module' => 'coupon_system', 'label' => 'Edit Coupon System', 'description' => 'Can edit store coupons'],
            ['name' => 'delete-coupon-system', 'module' => 'coupon_system', 'label' => 'Delete Coupon System', 'description' => 'Can delete store coupons'],
            ['name' => 'toggle-status-coupon-system', 'module' => 'coupon_system', 'label' => 'Toggle Status Coupon System', 'description' => 'Can toggle store coupon status'],
            ['name' => 'export-coupon-system', 'module' => 'coupon_system', 'label' => 'Export Coupon System', 'description' => 'Can export store coupons data'],
            
            // Shipping management
            ['name' => 'manage-shipping', 'module' => 'shipping', 'label' => 'Manage Shipping', 'description' => 'Can manage shipping methods'],
            ['name' => 'view-shipping', 'module' => 'shipping', 'label' => 'View Shipping', 'description' => 'View shipping methods'],
            ['name' => 'create-shipping', 'module' => 'shipping', 'label' => 'Create Shipping', 'description' => 'Can create shipping methods'],
            ['name' => 'edit-shipping', 'module' => 'shipping', 'label' => 'Edit Shipping', 'description' => 'Can edit shipping methods'],
            ['name' => 'delete-shipping', 'module' => 'shipping', 'label' => 'Delete Shipping', 'description' => 'Can delete shipping methods'],
            ['name' => 'export-shipping', 'module' => 'shipping', 'label' => 'Export Shipping', 'description' => 'Can export shipping methods data'],
            
            // Blog management
            ['name' => 'manage-blog', 'module' => 'blog', 'label' => 'Manage Blog', 'description' => 'Can manage blog posts'],
            ['name' => 'view-blog', 'module' => 'blog', 'label' => 'View Blog', 'description' => 'View blog posts'],
            ['name' => 'create-blog', 'module' => 'blog', 'label' => 'Create Blog', 'description' => 'Can create blog posts'],
            ['name' => 'edit-blog', 'module' => 'blog', 'label' => 'Edit Blog', 'description' => 'Can edit blog posts'],
            ['name' => 'delete-blog', 'module' => 'blog', 'label' => 'Delete Blog', 'description' => 'Can delete blog posts'],
            
            // POS management
            ['name' => 'manage-pos', 'module' => 'pos', 'label' => 'Manage POS', 'description' => 'Can manage POS system'],
            ['name' => 'view-pos', 'module' => 'pos', 'label' => 'View POS', 'description' => 'View POS interface'],
            ['name' => 'process-transactions-pos', 'module' => 'pos', 'label' => 'Process Transactions', 'description' => 'Can process POS transactions'],
            ['name' => 'view-transactions-pos', 'module' => 'pos', 'label' => 'View Transactions', 'description' => 'View POS transactions'],
            ['name' => 'manage-settings-pos', 'module' => 'pos', 'label' => 'Manage POS Settings', 'description' => 'Can manage POS settings'],
            
            // Reviews management
            ['name' => 'manage-reviews', 'module' => 'reviews', 'label' => 'Manage Reviews', 'description' => 'Can manage product reviews'],
            ['name' => 'view-reviews', 'module' => 'reviews', 'label' => 'View Reviews', 'description' => 'View product reviews'],
            ['name' => 'edit-reviews', 'module' => 'reviews', 'label' => 'Edit Reviews', 'description' => 'Can edit product reviews'],
            ['name' => 'delete-reviews', 'module' => 'reviews', 'label' => 'Delete Reviews', 'description' => 'Can delete product reviews'],
            ['name' => 'approve-reviews', 'module' => 'reviews', 'label' => 'Approve Reviews', 'description' => 'Can approve product reviews'],
            
            // Newsletter Subscribers management
            ['name' => 'manage-newsletter-subscribers', 'module' => 'newsletter_subscribers', 'label' => 'Manage Newsletter Subscribers', 'description' => 'Can manage newsletter subscribers'],
            ['name' => 'view-newsletter-subscribers', 'module' => 'newsletter_subscribers', 'label' => 'View Newsletter Subscribers', 'description' => 'View newsletter subscribers'],
            ['name' => 'delete-newsletter-subscribers', 'module' => 'newsletter_subscribers', 'label' => 'Delete Newsletter Subscribers', 'description' => 'Can delete newsletter subscribers'],
            
            // Custom Pages management
            ['name' => 'manage-custom-pages', 'module' => 'custom_pages', 'label' => 'Manage Custom Pages', 'description' => 'Can manage custom pages'],
            ['name' => 'view-custom-pages', 'module' => 'custom_pages', 'label' => 'View Custom Pages', 'description' => 'View custom pages'],
            ['name' => 'create-custom-pages', 'module' => 'custom_pages', 'label' => 'Create Custom Pages', 'description' => 'Can create custom pages'],
            ['name' => 'edit-custom-pages', 'module' => 'custom_pages', 'label' => 'Edit Custom Pages', 'description' => 'Can edit custom pages'],
            ['name' => 'delete-custom-pages', 'module' => 'custom_pages', 'label' => 'Delete Custom Pages', 'description' => 'Can delete custom pages'],
            
            // Express Checkout management
            ['name' => 'manage-express-checkout', 'module' => 'express_checkout', 'label' => 'Manage Express Checkout', 'description' => 'Overall express checkout management access'],
            ['name' => 'view-express-checkout', 'module' => 'express_checkout', 'label' => 'View Express Checkout', 'description' => 'View express checkout list and details'],
            ['name' => 'create-express-checkout', 'module' => 'express_checkout', 'label' => 'Create Express Checkout', 'description' => 'Create new express checkout configurations'],
            ['name' => 'edit-express-checkout', 'module' => 'express_checkout', 'label' => 'Edit Express Checkout', 'description' => 'Edit existing express checkout configurations'],
            ['name' => 'delete-express-checkout', 'module' => 'express_checkout', 'label' => 'Delete Express Checkout', 'description' => 'Delete express checkout configurations'],
            
            // Analytics & Reporting management
            ['name' => 'manage-analytics', 'module' => 'analytics', 'label' => 'Manage Analytics', 'description' => 'Overall analytics and reporting management access'],
            ['name' => 'view-analytics', 'module' => 'analytics', 'label' => 'View Analytics', 'description' => 'View analytics dashboard and reports'],
            ['name' => 'export-analytics', 'module' => 'analytics', 'label' => 'Export Analytics', 'description' => 'Export analytics data and reports']
            

        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name'], 'guard_name' => 'web'],
                [
                    'module' => $permission['module'],
                    'label' => $permission['label'],
                    'description' => $permission['description'],
                ]
            );
        }
    }
}