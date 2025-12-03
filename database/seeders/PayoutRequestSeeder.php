<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PayoutRequest;
use App\Models\Referral;
use App\Models\User;

class PayoutRequestSeeder extends Seeder
{
    public function run(): void
    {
        $companies = User::where('type', 'company')->get();

        if ($companies->isEmpty()) {
            $this->command->info('No companies found. Please run UserSeeder first.');
            return;
        }

        $statuses = ['pending', 'approved', 'rejected'];
        $notes = [
            'Monthly payout request for store earnings',
            'Quarterly commission payout',
            'Weekly sales commission request',
            'Product sales payout for last month',
            'Affiliate commission withdrawal',
            'Store revenue payout request',
            'Subscription earnings withdrawal',
            'Marketplace commission payout',
            'Digital product sales earnings',
            'Service fee payout request'
        ];

        foreach ($companies as $company) {
            // Get total referral earnings for this company
            $totalEarned = Referral::where('company_id', $company->id)->sum('amount');
            
            // Only create payout requests if there are referral earnings
            if ($totalEarned > 0) {
                // Create 2-3 payout requests per company
                $requestCount = rand(2, 3);
                $totalRequested = 0;
                
                for ($i = 0; $i < $requestCount; $i++) {
                    // Calculate remaining available amount
                    $remainingAmount = $totalEarned - $totalRequested;
                    
                    if ($remainingAmount <= 10) {
                        break; // Stop if remaining amount is too small
                    }
                    
                    // Request between 20% to 60% of remaining amount, but max $200
                    $maxRequest = min($remainingAmount * 0.6, 200);
                    $minRequest = min($remainingAmount * 0.2, 25);
                    
                    if ($maxRequest <= $minRequest) {
                        break;
                    }
                    
                    $amount = round(rand($minRequest * 100, $maxRequest * 100) / 100, 2);
                    $totalRequested += $amount;
                    
                    // Create varied dates from current date back to 2 months (60 days)
                    $daysAgo = rand(1, 60) + ($i * 5) + ($company->id % 10);
                    $createdAt = \Carbon\Carbon::now()->subDays($daysAgo);
                    
                    PayoutRequest::create([
                        'company_id' => $company->id,
                        'amount' => $amount,
                        'status' => $statuses[array_rand($statuses)],
                        'notes' => $notes[array_rand($notes)],
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
                }
            }
        }
    }
}