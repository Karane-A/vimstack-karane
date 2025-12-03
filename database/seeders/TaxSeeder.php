<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tax;
use App\Models\Store;
use Carbon\Carbon;
class TaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if tax data already exists, if yes then skip
        if (Tax::count() > 0) {
            $this->command->info('Tax data already exists. Skipping seeder to preserve existing data.');
            return;
        }

        if (config('app.is_demo')) {
            $this->createDemoTaxes();
        } else {
            $this->createMainVersionTaxes();
        }
    }

    private function createDemoTaxes()
    {
        // Get all stores
        $stores = Store::all();
        
        foreach ($stores as $storeIndex => $store) {
            $taxes = [
                ['name' => 'Standard VAT', 'rate' => 20.0, 'priority' => 1],
                ['name' => 'Reduced Rate', 'rate' => 5.0, 'priority' => 2],
                ['name' => 'Zero Rate', 'rate' => 0.0, 'priority' => 3],
                ['name' => 'Luxury Tax', 'rate' => 25.0, 'priority' => 4],
                ['name' => 'Service Tax', 'rate' => 15.0, 'priority' => 5],
            ];
            
            foreach ($taxes as $taxIndex => $taxData) {
                // Create varied dates: created_at 1-2 months ago, updated_at after created_at
                $createdDaysAgo = rand(30, 60) + ($storeIndex * 2) + $taxIndex;
                $createdAt = Carbon::now()->subDays($createdDaysAgo);
                $updatedDaysAgo = rand(1, $createdDaysAgo - 1);
                $updatedAt = Carbon::now()->subDays($updatedDaysAgo);
                
                Tax::firstOrCreate(
                    [
                        'name' => $taxData['name'],
                        'store_id' => $store->id,
                        'rate' => $taxData['rate'],
                        'type' => 'percentage',
                        'region' => 'Global',
                        'priority' => $taxData['priority'],
                        'compound' => false,
                        'is_active' => true,
                        'created_at' => $createdAt,
                        'updated_at' => $updatedAt,
                    ]
                );
            }
        }
    }

    private function createMainVersionTaxes()
    {
        // Get only the single store for company@example.com
        $store = Store::whereHas('user', function($query) {
            $query->where('email', 'company@example.com');
        })->first();

        if (!$store) {
            $this->command->error('No store found for company@example.com');
            return;
        }

        // Create only 4 tax records for main version
        $taxes = [
            ['name' => 'Standard VAT', 'rate' => 20.0, 'priority' => 1],
            ['name' => 'Reduced Rate', 'rate' => 5.0, 'priority' => 2],
            ['name' => 'Zero Rate', 'rate' => 0.0, 'priority' => 3],
            ['name' => 'Luxury Tax', 'rate' => 25.0, 'priority' => 4],
        ];
        
        foreach ($taxes as $taxIndex => $taxData) {
            Tax::firstOrCreate(
                [
                    'name' => $taxData['name'],
                    'store_id' => $store->id
                ],
                [
                    'rate' => $taxData['rate'],
                    'type' => 'percentage',
                    'region' => 'Global',
                    'priority' => $taxData['priority'],
                    'compound' => false,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('Created ' . count($taxes) . ' tax records for main version.');
    }
}
