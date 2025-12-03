<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin role
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'superadmin', 'guard_name' => 'web'],
            [
                'label' => 'Super Admin',
                'description' => 'Super Admin has full access to all features',
            ]
        );

        // Create admin role
        $adminRole = Role::firstOrCreate(
            ['name' => 'company', 'guard_name' => 'web'],
            [
                'label' => 'Company',
                'description' => 'Company has access to manage buissness',
            ]
        );

        // Get all permissions
        $permissions = Permission::all();

        // Assign all permissions to super admin
        $superAdminRole->syncPermissions($permissions);

        // Assign specific permissions to company role
        $adminPermissions = Permission::whereIn('name', [
            'manage-dashboard',
            'view-dashboard',
            'export-dashboard',
            'manage-users',
            'create-users',
            'edit-users',
            'delete-users',
            'view-users',
            'reset-password-users',
            'toggle-status-users',
            'manage-roles',
            'create-roles',
            'edit-roles',
            'delete-roles',
            'view-roles',
            // Removed 'view-permissions' - Permission CRUD not needed for company users

            'view-plans',
            'request-plans',
            'trial-plans',
            'subscribe-plans',
            'manage-plan-requests',
            'view-plan-requests',
            'manage-plan-orders',
            'view-plan-orders',
            'manage-system-settings',
            'manage-email-settings',
            'manage-brand-settings',
            'manage-payment-settings',
            'manage-webhook-settings',
            'manage-settings',
            'manage-media',
            'manage-own-media',
            'create-media',
            'edit-media',
            'delete-media',
            'view-media',
            'download-media',

            // Removed business permissions - Business functionality not implemented
            // 'manage-own-businesses',
            // 'manage-businesses',
            // 'view-businesses',
            // 'create-businesses',
            // 'edit-businesses',
            // 'delete-businesses',
            
            'manage-language',
            'edit-language',
            'view-language',
            // Removed 'manage-referral' - Referral is only for company and superadmin level, not for regular users

            // Removed 'view-landing-page' - Landing page management is superadmin only
            
            // Store permissions
            'manage-stores',
            'view-stores',
            'create-stores',
            'edit-stores',
            'delete-stores',
            'export-stores',
            'manage-store-content',
            'view-store-content',
            'edit-store-content',
            'manage-store-settings',
            'switch-stores',
            
            // Product permissions
            'manage-products',
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',
            'export-products',
            
            // Category permissions
            'manage-categories',
            'view-categories',
            'create-categories',
            'edit-categories',
            'delete-categories',
            'export-categories',
            
            // Tax permissions
            'manage-tax',
            'view-tax',
            'create-tax',
            'edit-tax',
            'delete-tax',
            'export-tax',
            
            // Order permissions
            'manage-orders',
            'view-orders',
            'edit-orders',
            'delete-orders',
            'export-orders',
            
            // Customer permissions
            'manage-customers',
            'view-customers',
            'create-customers',
            'edit-customers',
            'delete-customers',
            'export-customers',
            
            // Coupon System permissions
            'manage-coupon-system',
            'view-coupon-system',
            'create-coupon-system',
            'edit-coupon-system',
            'delete-coupon-system',
            'toggle-status-coupon-system',
            'export-coupon-system',
            
            // Shipping permissions
            'manage-shipping',
            'view-shipping',
            'create-shipping',
            'edit-shipping',
            'delete-shipping',
            'export-shipping',
            
            // Blog permissions
            'manage-blog',
            'view-blog',
            'create-blog',
            'edit-blog',
            'delete-blog',
            
            // POS permissions
            'manage-pos',
            'view-pos',
            'process-transactions-pos',
            'view-transactions-pos',
            'manage-settings-pos',
            
            // Reviews permissions
            'manage-reviews',
            'view-reviews',
            'edit-reviews',
            'delete-reviews',
            'approve-reviews',
            
            // Newsletter Subscribers permissions
            'manage-newsletter-subscribers',
            'view-newsletter-subscribers',
            'delete-newsletter-subscribers',
            
            // Custom Pages permissions
            'manage-custom-pages',
            'view-custom-pages',
            'create-custom-pages',
            'edit-custom-pages',
            'delete-custom-pages',
            
            // Express Checkout permissions
            'manage-express-checkout',
            'view-express-checkout',
            'create-express-checkout',
            'edit-express-checkout',
            'delete-express-checkout',
            
            // Analytics & Reporting permissions
            'manage-analytics',
            'view-analytics',
            'export-analytics',
            
            // Referral Program permissions
            'manage-referral',
            'manage-setting-referral',
            'manage-payout-referral',
            'approve-payout-referral',
            'reject-payout-referral',
        ])->get();

        $adminRole->syncPermissions($adminPermissions);
    }
}