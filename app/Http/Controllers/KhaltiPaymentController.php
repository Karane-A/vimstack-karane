<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class KhaltiPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'token' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['khalti_secret_key'])) {
                return back()->withErrors(['error' => __('Khalti not configured')]);
            }

            // Verify payment with Khalti API
            $isValid = $this->verifyKhaltiPayment($validated['token'], $validated['amount'], $settings['payment_settings']);

            if ($isValid) {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'khalti',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['token'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment verification failed')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'khalti');
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['khalti_public_key'])) {
                return response()->json(['error' => __('Khalti not configured')], 400);
            }

            return response()->json([
                'success' => true,
                'public_key' => $settings['payment_settings']['khalti_public_key'],
                'amount' => $pricing['final_price'] * 100, // Khalti uses paisa
                'product_identity' => 'plan_' . $plan->id,
                'product_name' => $plan->name,
                'product_url' => route('plans.index'),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }

    private function verifyKhaltiPayment($token, $amount, $settings)
    {
        try {
            $url = 'https://khalti.com/api/v2/payment/verify/';
            
            $data = [
                'token' => $token,
                'amount' => $amount * 100, // Convert to paisa
            ];

            $headers = [
                'Authorization: Key ' . $settings['khalti_secret_key'],
                'Content-Type: application/json',
            ];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $response = curl_exec($ch);
            curl_close($ch);

            $result = json_decode($response, true);
            
            return isset($result['state']['name']) && $result['state']['name'] === 'Completed';

        } catch (\Exception $e) {
            return false;
        }
    }
}