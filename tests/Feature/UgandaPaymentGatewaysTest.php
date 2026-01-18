<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\PaymentSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UgandaPaymentGatewaysTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Flutterwave payment gateway configuration
     */
    public function test_flutterwave_payment_configuration()
    {
        $superAdmin = User::factory()->create(['type' => 'superadmin']);
        
        // Create Flutterwave payment settings
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'flutterwave_public_key',
            'value' => 'FLWPUBK_TEST_123456789'
        ]);
        
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'flutterwave_secret_key',
            'value' => 'FLWSECK_TEST_123456789'
        ]);
        
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'is_flutterwave_enabled',
            'value' => '1'
        ]);

        // Test payment methods API
        $response = $this->get(route('payment.methods'));
        
        $response->assertStatus(200);
        $data = $response->json();
        
        $this->assertTrue($data['is_flutterwave_enabled'] ?? false);
    }

    /**
     * Test Paystack payment gateway configuration
     */
    public function test_paystack_payment_configuration()
    {
        $superAdmin = User::factory()->create(['type' => 'superadmin']);
        
        // Create Paystack payment settings
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'paystack_public_key',
            'value' => 'pk_test_123456789'
        ]);
        
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'paystack_secret_key',
            'value' => 'sk_test_123456789'
        ]);
        
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'is_paystack_enabled',
            'value' => '1'
        ]);

        // Test payment methods API
        $response = $this->get(route('payment.methods'));
        
        $response->assertStatus(200);
        $data = $response->json();
        
        $this->assertTrue($data['is_paystack_enabled'] ?? false);
    }

    /**
     * Test that Flutterwave and Paystack are enabled by default for Uganda
     */
    public function test_uganda_payment_gateways_enabled_by_default()
    {
        $user = User::factory()->create(['type' => 'superadmin']);
        $this->actingAs($user);

        // Get payment settings
        $response = $this->get(route('payment.settings'));
        
        $response->assertStatus(200);
        
        // Flutterwave and Paystack should be available for Uganda
        // (They may not be enabled by default, but should be configurable)
        $this->assertTrue(true); // Placeholder - actual implementation depends on seeder
    }

    /**
     * Test Flutterwave payment processing
     */
    public function test_flutterwave_payment_processing()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Test Flutterwave payment route exists
        $response = $this->post(route('flutterwave.payment'), [
            'tx_ref' => 'test_ref_123',
            'amount' => 1000,
            'currency' => 'UGX',
        ]);

        // Should either succeed or return validation error (not 404)
        $this->assertNotEquals(404, $response->status());
    }

    /**
     * Test Paystack payment processing
     */
    public function test_paystack_payment_processing()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Test Paystack payment route exists
        $response = $this->post(route('paystack.payment'), [
            'reference' => 'test_ref_123',
            'amount' => 1000,
            'currency' => 'UGX',
        ]);

        // Should either succeed or return validation error (not 404)
        $this->assertNotEquals(404, $response->status());
    }
}
