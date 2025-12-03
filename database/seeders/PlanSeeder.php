<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default plans if they don't exist
        $plans = [
            [
                'name' => 'Free',
                'price' => 0,
                'yearly_price' => 0,
                'duration' => 'monthly',
                'description' => 'Basic plan for small businesses just getting started.',
                'max_stores' => 5,
                'max_users_per_store' => 25,
                'max_products_per_store' => 100,
                'themes' => ['home-accessories', 'beauty-cosmetics', 'furniture-interior', 'perfume-fragrances', 'fashion', 'jewelry', 'cars-automotive', 'electronics', 'watches', 'baby-kids'],
                'enable_custdomain' => 'on',
                'enable_custsubdomain' => 'on',
                'enable_branding' => 'on',
                'pwa_business' => 'on',
                'enable_chatgpt' => 'on',
                'enable_custom_pages' => 'on',
                'enable_blog' => 'on',
                'enable_shipping_method' => 'on',
                'storage_limit' => 5,
                'is_trial' => null,
                'trial_day' => 0,
                'is_plan_enable' => 'on',
                'is_default' => true,
                'module' => null
            ],
            [
                'name' => 'Pro',
                'price' => 49.99,
                'yearly_price' => 479.90, // 20% discount for yearly
                'duration' => 'monthly',
                'description' => 'Ideal for growing businesses with multiple stores and advanced needs.',
                'max_stores' => 50,
                'max_users_per_store' => 100,
                'max_products_per_store' => 5000,
                'themes' => ['home-accessories', 'beauty-cosmetics', 'furniture-interior', 'fashion', 'jewelry', 'electronics', 'watches'],
                'enable_custdomain' => 'off',
                'enable_custsubdomain' => 'on',
                'enable_branding' => 'off',
                'pwa_business' => 'on',
                'enable_chatgpt' => 'off',
                'enable_custom_pages' => 'on',
                'enable_blog' => 'on',
                'enable_shipping_method' => 'on',
                'storage_limit' => 100,
                'is_trial' => 'on',
                'trial_day' => 14,
                'is_plan_enable' => 'on',
                'is_default' => false,
                'module' => null
            ],
            [
                'name' => 'Enterprise',
                'price' => 99.99,
                'yearly_price' => 959.90, // 20% discount for yearly
                'duration' => 'monthly',
                'description' => 'Complete solution for large businesses with unlimited resources and premium support.',
                'max_stores' => 200,
                'max_users_per_store' => 500,
                'max_products_per_store' => 10000,
                'themes' => ['home-accessories', 'beauty-cosmetics', 'furniture-interior', 'perfume-fragrances', 'fashion', 'jewelry', 'cars-automotive', 'electronics', 'watches', 'baby-kids'],
                'enable_custdomain' => 'on',
                'enable_custsubdomain' => 'on',
                'enable_branding' => 'on',
                'pwa_business' => 'on',
                'enable_chatgpt' => 'on',
                'enable_custom_pages' => 'on',
                'enable_blog' => 'on',
                'enable_shipping_method' => 'on',
                'storage_limit' => 1000,
                'is_trial' => 'on',
                'trial_day' => 30,
                'is_plan_enable' => 'on',
                'is_default' => false,
                'module' => null
            ]
        ];
        
        foreach ($plans as $planData) {
            Plan::firstOrCreate(
                ['name' => $planData['name']],
                $planData
            );
        }
    }
}