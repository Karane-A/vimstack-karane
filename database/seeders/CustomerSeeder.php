<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        // Check if customer data already exists
        if (Customer::exists()) {
            return; // Skip if data exists
        }
        
        // Get all stores from all companies
        $stores = Store::all();

        foreach ($stores as $store) {
            $customers = $this->getCustomersData();
            
            foreach ($customers as $index => $customerData) {
                $daysAgo = ($store->id * 8) + $index + rand(1, 45);
                $createdAt = Carbon::now()->subDays($daysAgo);
                
                // Generate unique email for each store
                $emailParts = explode('@', $customerData['email']);
                $uniqueEmail = $store->id === 1 ? $customerData['email'] : $emailParts[0] . '.c' . $store->user_id . '@' . $emailParts[1];
                
                Customer::firstOrCreate(
                    ['email' => $uniqueEmail, 'store_id' => $store->id],
                    [
                    'store_id' => $store->id,
                    'first_name' => $customerData['first_name'],
                    'last_name' => $customerData['last_name'],
                    'email' => $uniqueEmail,
                    'password' => Hash::make('password'),
                    'phone' => $customerData['phone'],
                    'date_of_birth' => $customerData['date_of_birth'],
                    'gender' => $customerData['gender'],
                    'is_active' => true,
                    'email_marketing' => rand(0, 1),
                    'sms_notifications' => rand(0, 1),
                    'order_updates' => true,
                    'total_orders' => rand(0, 15),
                    'total_spent' => rand(50, 2000),
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                    ]
                );
            }
        }

    }

    private function getCustomersData(): array
    {
        return [
            [
                'first_name' => 'John',
                'last_name' => 'Smith',
                'email' => 'john.smith@example.com',
                'phone' => '+1-555-0101',
                'date_of_birth' => '1985-03-15',
                'gender' => 'male',
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Johnson',
                'email' => 'sarah.johnson@example.com',
                'phone' => '+1-555-0102',
                'date_of_birth' => '1990-07-22',
                'gender' => 'female',
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Brown',
                'email' => 'michael.brown@example.com',
                'phone' => '+1-555-0103',
                'date_of_birth' => '1988-11-08',
                'gender' => 'male',
            ],
            [
                'first_name' => 'Emily',
                'last_name' => 'Davis',
                'email' => 'emily.davis@example.com',
                'phone' => '+1-555-0104',
                'date_of_birth' => '1992-05-14',
                'gender' => 'female',
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Wilson',
                'email' => 'david.wilson@example.com',
                'phone' => '+1-555-0105',
                'date_of_birth' => '1987-09-30',
                'gender' => 'male',
            ],
            [
                'first_name' => 'Lisa',
                'last_name' => 'Anderson',
                'email' => 'lisa.anderson@example.com',
                'phone' => '+1-555-0106',
                'date_of_birth' => '1991-12-03',
                'gender' => 'female',
            ],
            [
                'first_name' => 'James',
                'last_name' => 'Taylor',
                'email' => 'james.taylor@example.com',
                'phone' => '+1-555-0107',
                'date_of_birth' => '1986-04-18',
                'gender' => 'male',
            ],
            [
                'first_name' => 'Jessica',
                'last_name' => 'Martinez',
                'email' => 'jessica.martinez@example.com',
                'phone' => '+1-555-0108',
                'date_of_birth' => '1993-08-25',
                'gender' => 'female',
            ],
        ];
    }
}