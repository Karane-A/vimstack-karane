<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::where('type', 'company')->get();
        $plans = \App\Models\Plan::take(3)->get();
        $coupons = \App\Models\Coupon::where('status', true)->take(2)->get();

        if ($users->isEmpty() || $plans->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // Create 2-3 plan orders for each company
            $orderCount = rand(2, 3);
            for ($i = 0; $i < $orderCount; $i++) {
                $plan = $plans->random();
                $coupon = $i % 3 === 0 ? $coupons->random() : null;
                
                $planOrder = new \App\Models\PlanOrder();
                $planOrder->user_id = $user->id;
                $planOrder->plan_id = $plan->id;
                $planOrder->calculatePrices($plan->price, $coupon);
                $planOrder->status = ['approved', 'pending','rejected'][array_rand(['approved','pending', 'rejected'])];
                $planOrder->ordered_at = now()->subDays(rand(1, 90));
                
                if ($planOrder->status !== 'pending') {
                    $planOrder->processed_at = $planOrder->ordered_at->addHours(rand(1, 48));
                    $planOrder->processed_by = \App\Models\User::where('type', 'superadmin')->first()?->id;
                }
                
                $planOrder->save();
            }
        }
    }
}
