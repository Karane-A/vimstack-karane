<?php

namespace Database\Seeders;

use App\Models\StoreCoupon;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class StoreCouponSeeder extends Seeder
{
    public function run(): void
    {
        // Check if store coupon data already exists
        if (StoreCoupon::exists()) {
            return; // Skip if data exists
        }
        
        $stores = Store::with('user')->get();

        if ($stores->isEmpty()) {
            $this->command->error('No stores found. Please run StoreSeeder first.');
            return;
        }

        foreach ($stores as $storeIndex => $store) {
            $coupons = $this->getCouponsForStore($store->name, $store->id, $store->user->id);
            
            foreach ($coupons as $couponIndex => $couponData) {
                // Create varied dates: created_at 1-2 months ago, updated_at after created_at
                $createdDaysAgo = rand(30, 60) + ($storeIndex * 3) + $couponIndex;
                $createdAt = Carbon::now()->subDays($createdDaysAgo);
                $updatedDaysAgo = rand(1, $createdDaysAgo - 1);
                $updatedAt = Carbon::now()->subDays($updatedDaysAgo);
                
                StoreCoupon::firstOrCreate(
                    ['code' => $couponData['code'], 'store_id' => $store->id],
                    [
                    'name' => $couponData['name'],
                    'code' => $couponData['code'],
                    'description' => $couponData['description'],
                    'code_type' => 'manual',
                    'type' => $couponData['type'],
                    'discount_amount' => $couponData['discount_amount'],
                    'minimum_spend' => $couponData['minimum_spend'],
                    'maximum_spend' => $couponData['maximum_spend'] ?? null,
                    'use_limit_per_coupon' => $couponData['use_limit_per_coupon'],
                    'use_limit_per_user' => $couponData['use_limit_per_user'],
                    'used_count' => 0,
                    'start_date' => $createdAt,
                    'expiry_date' => $createdAt->copy()->addMonths(3),
                    'status' => true,
                    'store_id' => $store->id,
                    'created_by' => $store->user->id,
                    'created_at' => $createdAt,
                    'updated_at' => $updatedAt,
                    ]
                );
            }
        }

    }

    private function getCouponsForStore($storeName, $storeId, $userId): array
    {
        $baseCodes = ['WELCOME', 'LOYAL20', 'SHIP', 'FLASH30', 'BULK50', 'WKND15'];
        $suffix = 'S' . $storeId;
        
        return [
            [
                'name' => 'Store Welcome Offer',
                'code' => $baseCodes[0] . $suffix,
                'description' => 'Welcome discount for new customers',
                'type' => 'flat',
                'discount_amount' => 15.00,
                'minimum_spend' => 50.00,
                'use_limit_per_coupon' => 100,
                'use_limit_per_user' => 1,
            ],
            [
                'name' => 'Store Loyalty Discount',
                'code' => $baseCodes[1] . $suffix,
                'description' => '20% off for loyal customers',
                'type' => 'percentage',
                'discount_amount' => 20.00,
                'minimum_spend' => 75.00,
                'maximum_spend' => 500.00,
                'use_limit_per_coupon' => 50,
                'use_limit_per_user' => 2,
            ],
            [
                'name' => 'Free Shipping Coupon',
                'code' => $baseCodes[2] . $suffix,
                'description' => 'Free shipping on any order',
                'type' => 'flat',
                'discount_amount' => 9.99,
                'minimum_spend' => 25.00,
                'use_limit_per_coupon' => 200,
                'use_limit_per_user' => 3,
            ],
            [
                'name' => 'Flash Sale Discount',
                'code' => $baseCodes[3] . $suffix,
                'description' => '30% off flash sale discount',
                'type' => 'percentage',
                'discount_amount' => 30.00,
                'minimum_spend' => 100.00,
                'maximum_spend' => 300.00,
                'use_limit_per_coupon' => 25,
                'use_limit_per_user' => 1,
            ],
            [
                'name' => 'Bulk Order Discount',
                'code' => $baseCodes[4] . $suffix,
                'description' => '$50 off on bulk orders',
                'type' => 'flat',
                'discount_amount' => 50.00,
                'minimum_spend' => 200.00,
                'use_limit_per_coupon' => 30,
                'use_limit_per_user' => 2,
            ],
            [
                'name' => 'Weekend Special',
                'code' => $baseCodes[5] . $suffix,
                'description' => '15% weekend special offer',
                'type' => 'percentage',
                'discount_amount' => 15.00,
                'minimum_spend' => 60.00,
                'maximum_spend' => 400.00,
                'use_limit_per_coupon' => 75,
                'use_limit_per_user' => 3,
            ],
        ];
    }
}