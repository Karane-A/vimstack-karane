<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tax;
use App\Models\Store;

class UgandaTaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all stores
        $stores = Store::all();
        
        if ($stores->isEmpty()) {
            $this->command->warn('No stores found. Please create stores first.');
            return;
        }
        
        foreach ($stores as $store) {
            // Create Uganda VAT (18% - standard rate)
            Tax::firstOrCreate(
                [
                    'name' => 'Uganda VAT',
                    'store_id' => $store->id,
                ],
                [
                    'rate' => 18.0,
                    'type' => 'percentage',
                    'region' => 'Uganda',
                    'priority' => 1,
                    'compound' => false,
                    'is_active' => true,
                ]
            );
            
            // Create Withholding Tax (6% - common rate for services)
            Tax::firstOrCreate(
                [
                    'name' => 'Withholding Tax',
                    'store_id' => $store->id,
                ],
                [
                    'rate' => 6.0,
                    'type' => 'percentage',
                    'region' => 'Uganda',
                    'priority' => 2,
                    'compound' => false,
                    'is_active' => true,
                ]
            );
        }
        
        $this->command->info('Created Uganda tax rates for ' . $stores->count() . ' store(s).');
    }
}
