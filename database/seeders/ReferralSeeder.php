<?php

namespace Database\Seeders;

use App\Models\Referral;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ReferralSeeder extends Seeder
{
    public function run(): void
    {
        $companies = User::where('type', 'company')->whereNotNull('referral_code')->get();
        $plans = Plan::all();
        
        if ($companies->isEmpty() || $plans->isEmpty()) {
            return;
        }

        // Create referrals for top companies
        $referralData = [
            ['company_index' => 0, 'referrals' => 15, 'amounts' => [25.00, 50.00, 75.00, 100.00, 30.00]],
            ['company_index' => 1, 'referrals' => 12, 'amounts' => [40.00, 60.00, 80.00, 45.00]],
            ['company_index' => 2, 'referrals' => 10, 'amounts' => [35.00, 55.00, 70.00]],
            ['company_index' => 3, 'referrals' => 8, 'amounts' => [20.00, 90.00]],
            ['company_index' => 4, 'referrals' => 6, 'amounts' => [65.00]],
        ];

        $referralCounter = 0;
        foreach ($referralData as $data) {
            if (isset($companies[$data['company_index']])) {
                $company = $companies[$data['company_index']];
                
                foreach ($data['amounts'] as $amountIndex => $amount) {
                    // Create varied dates from current date back to 2 months (60 days)
                    $daysAgo = rand(1, 60) + ($referralCounter * 2) + ($amountIndex * 3);
                    $createdAt = Carbon::now()->subDays($daysAgo);
                    $referralCounter++;
                    
                    Referral::create([
                        'user_id' => User::where('type', 'company')->where('id', '!=', $company->id)->inRandomOrder()->first()->id,
                        'company_id' => $company->id,
                        'commission_percentage' => 10.00,
                        'amount' => $amount,
                        'plan_id' => $plans->random()->id,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
                }
            }
        }
    }
}