<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PaystackPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'payment_id' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['paystack_secret_key'])) {
                return back()->withErrors(['error' => __('Paystack not configured')]);
            }

            // Verify payment with Paystack API
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://api.paystack.co/transaction/verify/" . $validated['payment_id'],
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    "Authorization: Bearer " . $settings['payment_settings']['paystack_secret_key'],
                    "Cache-Control: no-cache",
                ],
            ));

            $response = curl_exec($curl);
            curl_close($curl);

            $result = json_decode($response, true);

            if ($result['status'] && $result['data']['status'] === 'success') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'paystack',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['payment_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment verification failed')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'paystack');
        }
    }
}