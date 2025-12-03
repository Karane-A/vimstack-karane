<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (config('app.is_demo')) {
            // Demo mode: Run all seeders for full demo data
            $this->call([
                PermissionSeeder::class,
                RoleSeeder::class,
                PlanSeeder::class, 
                UserSeeder::class,
                LandingPageSeeder::class,
                StoreSeeder::class,
                ExpressCheckoutSeeder::class,
                TaxSeeder::class,
                CategorySeeder::class,
                ProductSeeder::class,
                CustomerSeeder::class,
                ShippingSeeder::class,
                CouponSeeder::class,
                StoreCouponSeeder::class,
                LocationSeeder::class,
                OrderSeeder::class,
                ReviewSeeder::class,
                NewsletterSubscriberSeeder::class,
                CustomPageSeeder::class,
                BlogSeeder::class,
                PlanOrderSeeder::class,
                PlanRequestSeeder::class,
                CurrencySeeder::class,
                POSTransactionSeeder::class,
                AdditionalUserSeeder::class,
                ReferralSettingSeeder::class,
                ReferralSeeder::class,
                PayoutRequestSeeder::class,
                SeoSettingsSeeder::class,
                CompanyStoreSettingsSeeder::class,
                WhatsAppSettingsSeeder::class,
                EmailTemplateSeeder::class,
                LandingPageDataSeeder::class,
            ]);
        } else {
            // Main version: Run only essential seeders with minimal data
            $this->call([
                PermissionSeeder::class,
                RoleSeeder::class,
                PlanSeeder::class,
                UserSeeder::class,
                LandingPageSeeder::class,
                LocationSeeder::class,
                StoreSeeder::class,
                TaxSeeder::class,
                CategorySeeder::class,
                ProductSeeder::class,
                ShippingSeeder::class,
                CustomPageSeeder::class,
                CurrencySeeder::class,
                ReferralSettingSeeder::class,
                CompanyStoreSettingsSeeder::class,
                WhatsAppSettingsSeeder::class,
                EmailTemplateSeeder::class,
            ]);
        }
    }
}