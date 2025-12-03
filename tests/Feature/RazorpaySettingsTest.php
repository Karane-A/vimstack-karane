<?php

namespace Tests\Feature;

use App\Models\PaymentSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RazorpaySettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_razorpay_settings_are_saved_correctly()
    {
        // Create a test user
        $user = User::factory()->create([
            'type' => 'superadmin'
        ]);

        // Login as the user
        $this->actingAs($user);

        // Test data
        $data = [
            'is_razorpay_enabled' => true,
            'razorpay_key' => 'rzp_test_123456789',
            'razorpay_secret' => 'test_secret_key',
        ];

        // Submit the form
        $response = $this->post(route('payment.settings'), $data);

        // Assert the response
        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Check if the settings were saved correctly
        $settings = PaymentSetting::where('user_id', $user->id)->get();
        
        $this->assertTrue($settings->where('key', 'is_razorpay_enabled')->first()->value == '1');
        $this->assertEquals('rzp_test_123456789', $settings->where('key', 'razorpay_key')->first()->value);
        $this->assertEquals('test_secret_key', $settings->where('key', 'razorpay_secret')->first()->value);
    }
}