<?php

namespace Database\Seeders;

use App\Models\NewsletterSubscription;
use App\Models\Store;
use Illuminate\Database\Seeder;

class NewsletterSubscriberSeeder extends Seeder
{
    public function run(): void
    {
        // Check if newsletter subscription data already exists
        if (NewsletterSubscription::exists()) {
            return; // Skip if data exists
        }
        
        $stores = Store::all();

        foreach ($stores as $store) {
            // Create 10-20 newsletter subscribers per store
            $subscriberCount = rand(10, 20);
            
            for ($i = 0; $i < $subscriberCount; $i++) {
                $email = fake()->unique()->safeEmail();
                NewsletterSubscription::firstOrCreate(
                    ['email' => $email, 'store_id' => $store->id],
                    [
                    'store_id' => $store->id,
                    'email' => $email,
                    'is_active' => rand(0, 10) > 1, // 90% active
                    'subscribed_at' => fake()->dateTimeBetween('-6 months', 'now'),
                    ]
                );
            }
        }

    }
}