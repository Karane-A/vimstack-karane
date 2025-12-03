<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Plan;
use App\Models\PaymentSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StripePaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_stripe_payment_configuration()
    {
        // Create super admin user
        $superAdmin = User::factory()->create(['type' => 'superadmin']);
        
        // Create payment settings
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'stripe_key',
            'value' => 'pk_test_123456789'
        ]);
        
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'stripe_secret',
            'value' => 'sk_test_123456789'
        ]);
        
        PaymentSetting::create([
            'user_id' => $superAdmin->id,
            'key' => 'is_stripe_enabled',
            'value' => '1'
        ]);

        // Test payment methods API
        $response = $this->get(route('payment.methods'));
        
        $response->assertStatus(200);
        $data = $response->json();
        
        $this->assertEquals('pk_test_123456789', $data['stripe_key']);
        $this->assertEquals('sk_test_123456789', $data['stripe_secret']);
        $this->assertTrue($data['is_stripe_enabled']);
    }

    public function test_stripe_payment_validation()
    {
        // Create user and plan
        $user = User::factory()->create();
        $plan = Plan::factory()->create(['price' => 10.00]);
        
        $this->actingAs($user);

        // Test without payment method ID
        $response = $this->post(route('stripe.payment'), [
            'plan_id' => $plan->id,
            'coupon_code' => '',
            'cardholder_name' => 'Test User',
        ]);

        $response->assertSessionHasErrors(['payment_method_id']);
    }

    public function test_stripe_payment_missing_configuration()
    {
        // Create user and plan
        $user = User::factory()->create();
        $plan = Plan::factory()->create(['price' => 10.00]);
        
        $this->actingAs($user);

        // Test without Stripe configuration
        $response = $this->post(route('stripe.payment'), [
            'payment_method_id' => 'pm_test_123',
            'plan_id' => $plan->id,
            'coupon_code' => '',
            'cardholder_name' => 'Test User',
        ]);

        $response->assertSessionHasErrors(['error']);
    }
}