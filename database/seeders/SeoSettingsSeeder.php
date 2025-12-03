<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class SeoSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $seoDefaults = [
            'metaKeywords' => 'ecommerce, online store, shopping, multi-store, saas platform, storego',
            'metaDescription' => 'StoreGo - A powerful SaaS platform for creating and managing multiple online stores with professional themes and complete e-commerce features.',
            'metaImage' => '/images/logos/logo-dark.png',
            'themeMode' => 'light',
            'titleText' => 'StoreGo',
            'timeFormat' => 'H:i',
            'dateFormat' => 'Y-m-d',
            'defaultTimezone' => 'UTC',
        ];

        // Add SEO settings to superadmin
        $superAdmin = User::where('type', 'superadmin')->first();
        if ($superAdmin) {
            foreach ($seoDefaults as $key => $value) {
                Setting::updateOrCreate(
                    ['user_id' => $superAdmin->id, 'key' => $key],
                    ['value' => $value]
                );
            }
        }

        // Company SEO settings will be created by CompanyStoreSettingsSeeder (store-specific only)
        $companyUsers = User::where('type', 'company')->get();
        foreach ($companyUsers as $user) {
            // Update user mode field to 'light'
            $user->update(['mode' => 'light']);
        }
    }
}