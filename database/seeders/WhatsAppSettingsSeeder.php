<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Store;
use App\Models\PaymentSetting;
use Illuminate\Database\Seeder;

class WhatsAppSettingsSeeder extends Seeder
{
    public function run(): void
    {
        // Check if WhatsApp settings already exist (client already has data)
        $existingSettings = PaymentSetting::where('key', 'is_whatsapp_enabled')->exists();
        
        if ($existingSettings) {
            return; // Skip if settings already exist
        }
        
        $stores = Store::all();
        
        if ($stores->isEmpty()) {
            $this->command->error('No stores found.');
            return;
        }

        $messagingSettings = getDefaultMessagingSettings();

        foreach ($stores as $store) {
            foreach ($messagingSettings as $key => $value) {
                PaymentSetting::updateOrCreate(
                    [
                        'user_id' => $store->user_id,
                        'store_id' => $store->id,
                        'key' => $key
                    ],
                    ['value' => $value]
                );
            }
        }


    }
}