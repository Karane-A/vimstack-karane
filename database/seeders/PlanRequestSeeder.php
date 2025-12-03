<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PlanRequest;
use App\Models\User;
use App\Models\Plan;

class PlanRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('type', '!=', 'superadmin')->take(5)->get();
        $plans = Plan::take(3)->get();

        if ($users->count() > 0 && $plans->count() > 0) {
            $messages = [
                'I would like to upgrade my plan to access more features.',
                'Need higher limits for my growing business.',
                'Current plan is not sufficient for our needs.',
                'Looking to expand with premium features.',
                'Require additional storage and bandwidth.',
                'Want to unlock advanced analytics tools.',
                'Need multi-store capabilities.',
                'Seeking better customer support options.'
            ];

            foreach ($users as $user) {
                // Create 5-8 plan requests for each company
                $requestCount = rand(5, 8);
                for ($i = 0; $i < $requestCount; $i++) {
                    PlanRequest::create([
                        'user_id' => $user->id,
                        'plan_id' => $plans->random()->id,
                        'status' => collect(['pending', 'approved', 'rejected'])->random(),
                        'message' => $messages[array_rand($messages)],
                        'created_at' => now()->subDays(rand(1, 60)),
                        'updated_at' => now()->subDays(rand(0, 30)),
                    ]);
                }
            }
        }
    }
}
