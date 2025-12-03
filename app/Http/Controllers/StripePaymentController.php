<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use App\Models\Setting;
use App\Models\PlanOrder;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripePaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'payment_method_id' => 'required|string',
            'cardholder_name' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['stripe_secret']) || !isset($settings['payment_settings']['stripe_key'])) {
                return back()->withErrors(['error' => __('Stripe not configured')]);
            }

            $stripeSecret = $settings['payment_settings']['stripe_secret'];
            if (!str_starts_with($stripeSecret, 'sk_')) {
                return back()->withErrors(['error' => __('Invalid Stripe secret key format')]);
            }

            Stripe::setApiKey($stripeSecret);

            $user = auth()->user();
            
            $paymentIntent = PaymentIntent::create([
                'amount' => $pricing['final_price'] * 100,
                'currency' => $settings['general_settings']['defaultCurrency'] ?? 'usd',
                'payment_method' => $validated['payment_method_id'],
                'confirmation_method' => 'manual',
                'confirm' => true,
                'return_url' => route('plans.index'),
                'description' => 'Subscription to ' . $plan->name . ' plan',
                'shipping' => [
                    'name' => $validated['cardholder_name'],
                    'address' => [
                        'line1' => 'Address Line 1',
                        'city' => 'City',
                        'country' => 'IN',
                        'postal_code' => '000000',
                    ],
                ],
            ]);

            if ($paymentIntent->status === 'succeeded') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'stripe',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $paymentIntent->id,
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'stripe');
        }
    }
}