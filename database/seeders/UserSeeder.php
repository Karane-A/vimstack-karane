<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Plan;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'type' => 'superadmin',
                'lang' => 'en'
            ]
        );

        // Assign super admin role
        $superAdmin->assignRole('superadmin');

        // Create default settings for superadmin if not exists
        if (!Setting::where('user_id', $superAdmin->id)->exists()) {
            createDefaultSettings($superAdmin->id);
        }

        // Get default plan
        $defaultPlan = Plan::where('is_default', true)->first();

        // Create Company User (without default store)
        User::$skipStoreCreation = true;

        $company = User::firstOrCreate(
            ['email' => 'company@example.com'],
            [
                'name' => 'Company',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'type' => 'company',
                'lang' => 'en',
                'mode' => 'light',
                'plan_id' => $defaultPlan ? $defaultPlan->id : null,
                'referral_code' => rand(100000, 999999),
                'created_by' => $superAdmin->id,
            ]
        );



        // Assign company role
        $company->assignRole('company');

        // In main version, don't create additional roles (0 roles requirement)
        if (config('app.is_demo')) {
            // Create manager role
            $managerRole = Role::firstOrCreate(
                ['name' => 'manager_' . $company->id, 'guard_name' => 'web'],
                [
                    'label' => 'Manager',
                    'description' => 'Manager has access to manage store operations',
                    'created_by' => $company->id,
                    'created_at' => Carbon::now()->subDays(5),
                    'updated_at' => Carbon::now()->subDays(5)
                ]
            );

            // Create accountant role
            $accountantRole = Role::firstOrCreate(
                ['name' => 'accountant_' . $company->id, 'guard_name' => 'web'],
                [
                    'label' => 'Accountant',
                    'description' => 'Accountant has access to financial data and reports',
                    'created_by' => $company->id,
                    'created_at' => Carbon::now()->subDays(3),
                    'updated_at' => Carbon::now()->subDays(3)
                ]
            );

            // Create content writer role
            $contentWriterRole = Role::firstOrCreate(
                ['name' => 'content_writer_' . $company->id, 'guard_name' => 'web'],
                [
                    'label' => 'Content Writer',
                    'description' => 'Content Writer has access to manage content and blogs',
                    'created_by' => $company->id,
                    'created_at' => Carbon::now()->subDays(1),
                    'updated_at' => Carbon::now()->subDays(1)
                ]
            );

            // Assign permissions to manager role
            $managerPermissions = \Spatie\Permission\Models\Permission::whereIn('name', [
                'view-dashboard',
                'manage-stores',
                'view-stores',
                'edit-stores',
                'manage-products',
                'view-products',
                'create-products',
                'edit-products',
                'delete-products',
                'manage-categories',
                'view-categories',
                'create-categories',
                'edit-categories',
                'manage-orders',
                'view-orders',
                'edit-orders',
                'manage-customers',
                'view-customers',
                'edit-customers',
                'manage-reviews',
                'view-reviews',
                'edit-reviews',
                'approve-reviews',
            ])->get();
            $managerRole->syncPermissions($managerPermissions);

            // Assign permissions to accountant role
            $accountantPermissions = \Spatie\Permission\Models\Permission::whereIn('name', [
                'view-dashboard',
                'view-orders',
                'manage-orders',
                'view-customers',
                'manage-tax',
                'view-tax',
                'create-tax',
                'edit-tax',
                'manage-shipping',
                'view-shipping',
                'view-pos',
                'view-transactions-pos',
            ])->get();
            $accountantRole->syncPermissions($accountantPermissions);

            // Assign permissions to content writer role
            $contentWriterPermissions = \Spatie\Permission\Models\Permission::whereIn('name', [
                'view-dashboard',
                'manage-blog',
                'view-blog',
                'create-blog',
                'edit-blog',
                'delete-blog',
                'manage-custom-pages',
                'view-custom-pages',
                'create-custom-pages',
                'edit-custom-pages',
                'delete-custom-pages',
                'manage-media',
                'create-media',
                'edit-media',
                'view-media',
            ])->get();
            $contentWriterRole->syncPermissions($contentWriterPermissions);
        }




        // Company settings will be created by CompanyStoreSettingsSeeder (store-specific only)

        // Create additional company users only in demo mode
        if (config('app.is_demo')) {
            $this->createAdditionalCompanies($defaultPlan, $superAdmin);
        }

        User::$skipStoreCreation = false;

        // Assign default plan to all company users with null plan_id
        if ($defaultPlan) {
            User::where('type', 'company')
                ->whereNull('plan_id')
                ->update(['plan_id' => $defaultPlan->id]);
        }

        // Refresh permissions for all existing company users to ensure they have the latest permissions
        $companyRole = Role::where('name', 'company')->first();
        if ($companyRole) {
            $companyUsers = User::where('type', 'company')->get();
            foreach ($companyUsers as $user) {
                // Re-assign the company role to refresh permissions
                $user->syncRoles(['company']);
            }
        }
    }

    private function createAdditionalCompanies($defaultPlan, $superAdmin)
    {
        $companies = [
            ['name' => 'Johnson & Associates LLC', 'email' => 'admin@johnsonassoc.com'],
            ['name' => 'Miller Business Solutions', 'email' => 'contact@millerbiz.com'],
            ['name' => 'Anderson Trading Co', 'email' => 'info@andersontrading.com'],
            ['name' => 'Williams Enterprise Group', 'email' => 'hello@williamsenterprise.com'],
            ['name' => 'Davis Commercial Services', 'email' => 'sales@daviscommercial.com'],
            ['name' => 'Thompson Holdings Ltd', 'email' => 'support@thompsonholdings.com'],
            ['name' => 'Wilson Global Partners', 'email' => 'orders@wilsonglobal.com'],
            ['name' => 'Brown Industries Inc', 'email' => 'service@brownindustries.com'],
            ['name' => 'Taylor Business Group', 'email' => 'care@taylorbusiness.com'],
            ['name' => 'Moore Strategic Solutions', 'email' => 'team@moorestrategic.com'],
            ['name' => 'Clark Ventures LLC', 'email' => 'info@clarkventures.com'],
            ['name' => 'Lewis Commercial Corp', 'email' => 'contact@lewiscommercial.com'],
            ['name' => 'Walker Business Partners', 'email' => 'admin@walkerbusiness.com']
        ];

        foreach ($companies as $index => $companyData) {
            $daysAgo = $index + 10;
            $createdAt = Carbon::now()->subDays($daysAgo);

            $user = User::firstOrCreate(
                ['email' => $companyData['email']],
                [
                    'name' => $companyData['name'],
                    'email_verified_at' => $createdAt,
                    'password' => Hash::make('password'),
                    'lang' => 'en',
                    'current_store' => rand(1, 8),
                    'avatar' => null,
                    'type' => 'company',
                    'plan_id' => rand(1, 3),
                    'plan_expire_date' => null,
                    'requested_plan' => 0,
                    'created_by' => $superAdmin->id,
                    'mode' => 'light',
                    'plan_is_active' => 1,
                    'storage_limit' => 0,
                    'is_enable_login' => 1,
                    'google2fa_secret' => 0,
                    'status' => 'active',
                    'is_trial' => null,
                    'trial_day' => 0,
                    'trial_expire_date' => null,
                    'active_module' => null,
                    'referral_code' => rand(100000, 999999),
                    'used_referral_code' => 0,
                    'commission_amount' => 0,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt
                ]
            );

            // Assign company role
            $user->assignRole('company');

            // Create roles for this company (only in demo mode)
            $companyManagerRole = Role::firstOrCreate(
                ['name' => 'manager_' . $user->id, 'guard_name' => 'web'],
                [
                    'label' => 'Manager',
                    'description' => 'Manager has access to manage store operations',
                    'created_by' => $user->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt
                ]
            );

            $companyAccountantRole = Role::firstOrCreate(
                ['name' => 'accountant_' . $user->id, 'guard_name' => 'web'],
                [
                    'label' => 'Accountant',
                    'description' => 'Accountant has access to financial data and reports',
                    'created_by' => $user->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt
                ]
            );

            $companyContentWriterRole = Role::firstOrCreate(
                ['name' => 'content_writer_' . $user->id, 'guard_name' => 'web'],
                [
                    'label' => 'Content Writer',
                    'description' => 'Content Writer has access to manage content and blogs',
                    'created_by' => $user->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt
                ]
            );

            // Assign permissions to company roles
            $managerPermissions = \Spatie\Permission\Models\Permission::whereIn('name', [
                'view-dashboard',
                'manage-stores',
                'view-stores',
                'edit-stores',
                'manage-products',
                'view-products',
                'create-products',
                'edit-products',
                'delete-products',
                'manage-categories',
                'view-categories',
                'create-categories',
                'edit-categories',
                'manage-orders',
                'view-orders',
                'edit-orders',
                'manage-customers',
                'view-customers',
                'edit-customers',
                'manage-reviews',
                'view-reviews',
                'edit-reviews',
                'approve-reviews'
            ])->get();
            $companyManagerRole->syncPermissions($managerPermissions);

            $accountantPermissions = \Spatie\Permission\Models\Permission::whereIn('name', [
                'view-dashboard',
                'view-orders',
                'manage-orders',
                'view-customers',
                'manage-tax',
                'view-tax',
                'create-tax',
                'edit-tax',
                'manage-shipping',
                'view-shipping',
                'view-pos',
                'view-transactions-pos'
            ])->get();
            $companyAccountantRole->syncPermissions($accountantPermissions);

            $contentWriterPermissions = \Spatie\Permission\Models\Permission::whereIn('name', [
                'view-dashboard',
                'manage-blog',
                'view-blog',
                'create-blog',
                'edit-blog',
                'delete-blog',
                'manage-custom-pages',
                'view-custom-pages',
                'create-custom-pages',
                'edit-custom-pages',
                'delete-custom-pages',
                'manage-media',
                'create-media',
                'edit-media',
                'view-media'
            ])->get();
            $companyContentWriterRole->syncPermissions($contentWriterPermissions);

            // Settings will be created by CompanyStoreSettingsSeeder
        }
    }
}
