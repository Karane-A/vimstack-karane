<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Plan;
use App\Models\Setting;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdditionalUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all company users and default plan
        $companies = User::where('type', 'company')->get();
        $defaultPlan = Plan::where('is_default', true)->first();

        if ($companies->isEmpty()) {
            $this->command->error('No company users found. Please run UserSeeder first.');
            return;
        }

        // Create 15 additional users with different roles
        $additionalUsers = [
            ['name' => 'John Smith', 'email' => 'john.smith@example.com', 'role' => 'content_writer'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah.johnson@example.com', 'role' => 'accountant'],
            ['name' => 'Mike Wilson', 'email' => 'mike.wilson@example.com', 'role' => 'manager'],
            ['name' => 'Emma Davis', 'email' => 'emma.davis@example.com', 'role' => 'accountant'],
            ['name' => 'David Brown', 'email' => 'david.brown@example.com', 'role' => 'content_writer'],
            ['name' => 'Lisa Garcia', 'email' => 'lisa.garcia@example.com', 'role' => 'content_writer'],
            ['name' => 'Robert Miller', 'email' => 'robert.miller@example.com', 'role' => 'accountant'],
            ['name' => 'Jennifer Taylor', 'email' => 'jennifer.taylor@example.com', 'role' => 'manager'],
            ['name' => 'James Anderson', 'email' => 'james.anderson@example.com', 'role' => 'accountant'],
            ['name' => 'Maria Martinez', 'email' => 'maria.martinez@example.com', 'role' => 'content_writer'],
            ['name' => 'Christopher Lee', 'email' => 'christopher.lee@example.com', 'role' => 'content_writer'],
            ['name' => 'Amanda White', 'email' => 'amanda.white@example.com', 'role' => 'accountant'],
            ['name' => 'Daniel Harris', 'email' => 'daniel.harris@example.com', 'role' => 'manager'],
            ['name' => 'Jessica Clark', 'email' => 'jessica.clark@example.com', 'role' => 'accountant'],
            ['name' => 'Kevin Rodriguez', 'email' => 'kevin.rodriguez@example.com', 'role' => 'content_writer']
        ];

        foreach ($companies as $companyIndex => $company) {
            $stores = Store::where('user_id', $company->id)->get();
            
            // If company has no stores, create users anyway with current_store as null
            if ($stores->isEmpty()) {
                foreach ($additionalUsers as $userIndex => $userData) {
                    $uniqueEmail = str_replace('@example.com', ".company{$company->id}@example.com", $userData['email']);

                    $daysAgo = ($companyIndex * 15) + $userIndex + 1;
                    $createdAt = Carbon::now()->subDays($daysAgo);
                    
                    $user = User::create([
                        'name' => $userData['name'],
                        'email' => $uniqueEmail,
                        'email_verified_at' => $createdAt,
                        'password' => Hash::make('password'),
                        'type' => $userData['role'],
                        'lang' => 'en',
                        'plan_id' => $defaultPlan ? $defaultPlan->id : null,
                        'referral_code' => rand(100000, 999999),
                        'created_by' => $company->id,
                        'current_store' => null,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);

                    // Assign role with company-specific role name
                    $roleName = $userData['role'] . '_' . $company->id;
                    $user->assignRole($roleName);

                    // Settings are only created for superadmin and company users
                }
            } else {
                // If company has stores, create users for each store
                foreach ($stores as $storeIndex => $store) {
                    foreach ($additionalUsers as $userIndex => $userData) {
                        $uniqueEmail = str_replace('@example.com', ".company{$company->id}.store{$store->id}@example.com", $userData['email']);

                        $daysAgo = ($companyIndex * 100) + ($storeIndex * 15) + $userIndex + 1;
                        $createdAt = Carbon::now()->subDays($daysAgo);
                        
                        $user = User::create([
                            'name' => $userData['name'],
                            'email' => $uniqueEmail,
                            'email_verified_at' => $createdAt,
                            'password' => Hash::make('password'),
                            'type' => $userData['role'],
                            'lang' => 'en',
                            'plan_id' => $defaultPlan ? $defaultPlan->id : null,
                            'referral_code' => rand(100000, 999999),
                            'created_by' => $company->id,
                            'current_store' => $store->id,
                            'created_at' => $createdAt,
                            'updated_at' => $createdAt,
                        ]);

                        // Assign role with company-specific role name
                        $roleName = $userData['role'] . '_' . $company->id;
                        $user->assignRole($roleName);

                        // Settings are only created for superadmin and company users
                    }
                }
            }
        }
    }
}
