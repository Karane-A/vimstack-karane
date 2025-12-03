<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if coupon data already exists
        if (\App\Models\Coupon::exists()) {
            return; // Skip if data exists
        }
        
        $stores = \App\Models\Store::with('user')->get();
        
        if ($stores->isEmpty()) {
            $this->command->warn('No stores found. Please run StoreSeeder first.');
            return;
        }

        $coupons = [
            [
                'name' => 'Summer Sale',
                'type' => 'percentage',
                'minimum_spend' => 50.00,
                'maximum_spend' => 500.00,
                'discount_amount' => 20.00,
                'use_limit_per_coupon' => 100,
                'use_limit_per_user' => 1,
                'expiry_date' => now()->addMonths(3),
                'code' => 'SUMMER20',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'New Customer Discount',
                'type' => 'flat',
                'minimum_spend' => 25.00,
                'maximum_spend' => null,
                'discount_amount' => 10.00,
                'use_limit_per_coupon' => null,
                'use_limit_per_user' => 1,
                'expiry_date' => now()->addMonths(6),
                'code' => 'WELCOME10',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'Flash Sale',
                'type' => 'percentage',
                'minimum_spend' => 100.00,
                'maximum_spend' => 1000.00,
                'discount_amount' => 15.00,
                'use_limit_per_coupon' => 50,
                'use_limit_per_user' => 2,
                'expiry_date' => now()->addWeeks(2),
                'code' => 'FLASH15',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'Auto Generated Coupon',
                'type' => 'flat',
                'minimum_spend' => null,
                'maximum_spend' => null,
                'discount_amount' => 5.00,
                'use_limit_per_coupon' => 200,
                'use_limit_per_user' => 3,
                'expiry_date' => now()->addMonths(1),
                'code' => 'AUTO5OFF',
                'code_type' => 'auto',
                'status' => false,
            ]
        ];

        // Add more coupons for pagination testing
        $additionalCoupons = [
            [
                'name' => 'Black Friday Deal',
                'type' => 'percentage',
                'minimum_spend' => 200.00,
                'maximum_spend' => 2000.00,
                'discount_amount' => 30.00,
                'use_limit_per_coupon' => 500,
                'use_limit_per_user' => 1,
                'expiry_date' => now()->addMonths(2),
                'code' => 'BLACKFRI30',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'Holiday Special',
                'type' => 'flat',
                'minimum_spend' => 75.00,
                'maximum_spend' => null,
                'discount_amount' => 25.00,
                'use_limit_per_coupon' => 300,
                'use_limit_per_user' => 2,
                'expiry_date' => now()->addMonths(4),
                'code' => 'HOLIDAY25',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'Student Discount',
                'type' => 'percentage',
                'minimum_spend' => 30.00,
                'maximum_spend' => 300.00,
                'discount_amount' => 10.00,
                'use_limit_per_coupon' => null,
                'use_limit_per_user' => 5,
                'expiry_date' => now()->addMonths(12),
                'code' => 'STUDENT10',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'VIP Member Bonus',
                'type' => 'flat',
                'minimum_spend' => 150.00,
                'maximum_spend' => 1500.00,
                'discount_amount' => 50.00,
                'use_limit_per_coupon' => 100,
                'use_limit_per_user' => 1,
                'expiry_date' => now()->addMonths(6),
                'code' => 'VIP50BONUS',
                'code_type' => 'manual',
                'status' => false,
            ],
            [
                'name' => 'Weekend Sale',
                'type' => 'percentage',
                'minimum_spend' => 40.00,
                'maximum_spend' => 400.00,
                'discount_amount' => 12.00,
                'use_limit_per_coupon' => 200,
                'use_limit_per_user' => 3,
                'expiry_date' => now()->addWeeks(8),
                'code' => 'WEEKEND12',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'Spring Clearance',
                'type' => 'flat',
                'minimum_spend' => 80.00,
                'maximum_spend' => null,
                'discount_amount' => 15.00,
                'use_limit_per_coupon' => 150,
                'use_limit_per_user' => 2,
                'expiry_date' => now()->addMonths(2),
                'code' => 'SPRING15',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'Loyalty Reward',
                'type' => 'percentage',
                'minimum_spend' => 120.00,
                'maximum_spend' => 800.00,
                'discount_amount' => 18.00,
                'use_limit_per_coupon' => 75,
                'use_limit_per_user' => 1,
                'expiry_date' => now()->addMonths(5),
                'code' => 'LOYAL18',
                'code_type' => 'manual',
                'status' => true,
            ],
            [
                'name' => 'First Order Bonus',
                'type' => 'flat',
                'minimum_spend' => 35.00,
                'maximum_spend' => 350.00,
                'discount_amount' => 20.00,
                'use_limit_per_coupon' => 500,
                'use_limit_per_user' => 1,
                'expiry_date' => now()->addMonths(3),
                'code' => 'FIRST20',
                'code_type' => 'auto',
                'status' => true,
            ],
            [
                'name' => 'Mega Sale Event',
                'type' => 'percentage',
                'minimum_spend' => 300.00,
                'maximum_spend' => 3000.00,
                'discount_amount' => 25.00,
                'use_limit_per_coupon' => 50,
                'use_limit_per_user' => 1,
                'expiry_date' => now()->addWeeks(6),
                'code' => 'MEGA25',
                'code_type' => 'manual',
                'status' => false,
            ],
            [
                'name' => 'Quick Discount',
                'type' => 'flat',
                'minimum_spend' => null,
                'maximum_spend' => 100.00,
                'discount_amount' => 8.00,
                'use_limit_per_coupon' => 1000,
                'use_limit_per_user' => 5,
                'expiry_date' => now()->addMonths(1),
                'code' => 'QUICK8',
                'code_type' => 'auto',
                'status' => true,
            ]
        ];

        $allCoupons = array_merge($coupons, $additionalCoupons);

        foreach ($stores as $storeIndex => $store) {
            foreach ($allCoupons as $index => $couponData) {
                $uniqueCode = $store->user_id === 2 ? $couponData['code'] : $couponData['code'] . 'C' . $store->user_id;
                
                $daysAgo = ($storeIndex * 5) + $index + rand(1, 30);
                $createdAt = Carbon::now()->subDays($daysAgo);
                
                $couponData['code'] = $uniqueCode;
                $couponData['created_by'] = $store->user->id;
                $couponData['created_at'] = $createdAt;
                $couponData['updated_at'] = $createdAt;
                
                \App\Models\Coupon::firstOrCreate(
                    ['code' => $uniqueCode],
                    $couponData
                );
            }
        }

    }
}
