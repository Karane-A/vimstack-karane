<?php

namespace Database\Seeders;

use App\Models\ReferralSetting;
use Illuminate\Database\Seeder;

class ReferralSettingSeeder extends Seeder
{
    public function run(): void
    {
        ReferralSetting::firstOrCreate(
            ['id' => 1],
            [
                'is_enabled' => true,
                'commission_percentage' => 10.00,
                'threshold_amount' => 50.00,
                'guidelines' => 'Welcome to our referral program! Earn commission when users sign up using your referral link and purchase a plan. Commission is calculated based on the plan price and will be available for payout once you reach the minimum threshold.',
            ]
        );
    }
}