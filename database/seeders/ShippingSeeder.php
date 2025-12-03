<?php

namespace Database\Seeders;

use App\Models\Shipping;
use App\Models\Store;
use Illuminate\Database\Seeder;
class ShippingSeeder extends Seeder
{
    public function run(): void
    {
        // Check if shipping data already exists, if yes then skip
        if (Shipping::count() > 0) {
            $this->command->info('Shipping data already exists. Skipping seeder to preserve existing data.');
            return;
        }

        if (config('app.is_demo')) {
            $this->createDemoShipping();
        } else {
            $this->createMainVersionShipping();
        }
    }

    private function createDemoShipping()
    {
        $stores = Store::all();

        foreach ($stores as $store) {
            // Check if shipping methods already exist for this store (client has added their own data)
            $existingShipping = Shipping::where('store_id', $store->id)->count();
            
            if ($existingShipping > 0) {
                $this->command->info('Shipping methods already exist for store: ' . $store->name . '. Skipping to preserve client data.');
                continue;
            }
            
            $shippingMethods = $this->getShippingMethods();
            
            foreach ($shippingMethods as $method) {
                Shipping::create([
                    'store_id' => $store->id,
                    'name' => $method['name'],
                    'type' => $method['type'],
                    'description' => $method['description'],
                    'cost' => $method['cost'],
                    'min_order_amount' => $method['min_order_amount'],
                    'delivery_time' => $method['delivery_time'],
                    'sort_order' => $method['sort_order'],
                    'is_active' => true,
                    'zone_type' => 'global',
                    'tracking_available' => $method['tracking_available'],
                    'require_signature' => $method['require_signature'] ?? false,
                    'insurance_required' => $method['insurance_required'] ?? false,
                ]);
            }
        }

    }

    private function createMainVersionShipping()
    {
        // Get only the single store for company@example.com
        $store = Store::whereHas('user', function($query) {
            $query->where('email', 'company@example.com');
        })->first();

        if (!$store) {
            $this->command->error('No store found for company@example.com');
            return;
        }

        // Check if shipping methods already exist for this store (client has added their own data)
        $existingShipping = Shipping::where('store_id', $store->id)->count();
        
        if ($existingShipping > 0) {
            $this->command->info('Shipping methods already exist for store: ' . $store->name . '. Skipping to preserve client data.');
            return;
        }

        // Create only Free Shipping method for main version
        $method = [
            'name' => 'Free Shipping',
            'type' => 'free',
            'description' => 'Free standard shipping on orders over $50',
            'cost' => 0.00,
            'min_order_amount' => 50.00,
            'delivery_time' => '5-7 business days',
            'sort_order' => 1,
            'tracking_available' => true,
        ];
        
        Shipping::create([
            'store_id' => $store->id,
            'name' => $method['name'],
            'type' => $method['type'],
            'description' => $method['description'],
            'cost' => $method['cost'],
            'min_order_amount' => $method['min_order_amount'],
            'delivery_time' => $method['delivery_time'],
            'sort_order' => $method['sort_order'],
            'is_active' => true,
            'zone_type' => 'global',
            'tracking_available' => $method['tracking_available'],
            'require_signature' => false,
            'insurance_required' => false,
        ]);

        $this->command->info('Created 1 shipping method for main version.');
    }

    private function getShippingMethods(): array
    {
        return [
            [
                'name' => 'Free Shipping',
                'type' => 'free',
                'description' => 'Free standard shipping on orders over $50',
                'cost' => 0.00,
                'min_order_amount' => 50.00,
                'delivery_time' => '5-7 business days',
                'sort_order' => 1,
                'tracking_available' => true,
            ],
            [
                'name' => 'Standard Shipping',
                'type' => 'flat_rate',
                'description' => 'Standard delivery with tracking',
                'cost' => 9.99,
                'min_order_amount' => 0.00,
                'delivery_time' => '3-5 business days',
                'sort_order' => 2,
                'tracking_available' => true,
            ],
            [
                'name' => 'Express Shipping',
                'type' => 'flat_rate',
                'description' => 'Fast delivery with priority handling',
                'cost' => 19.99,
                'min_order_amount' => 0.00,
                'delivery_time' => '1-2 business days',
                'sort_order' => 3,
                'tracking_available' => true,
                'require_signature' => true,
            ],
            [
                'name' => 'Overnight Shipping',
                'type' => 'flat_rate',
                'description' => 'Next business day delivery',
                'cost' => 29.99,
                'min_order_amount' => 0.00,
                'delivery_time' => '1 business day',
                'sort_order' => 4,
                'tracking_available' => true,
                'require_signature' => true,
                'insurance_required' => true,
            ],
            [
                'name' => 'Local Pickup',
                'type' => 'pickup',
                'description' => 'Pick up your order at our store location',
                'cost' => 0.00,
                'min_order_amount' => 0.00,
                'delivery_time' => 'Same day',
                'sort_order' => 5,
                'tracking_available' => false,
            ],
        ];
    }
}