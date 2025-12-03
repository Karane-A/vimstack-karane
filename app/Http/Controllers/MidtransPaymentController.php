<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class MidtransPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'transaction_status' => 'required|string',
            'order_id' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['midtrans_secret_key'])) {
                return back()->withErrors(['error' => __('Midtrans not configured')]);
            }

            if (in_array($validated['transaction_status'], ['capture', 'settlement'])) {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'midtrans',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['order_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'midtrans');
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['midtrans_secret_key'])) {
                return response()->json(['error' => __('Midtrans not configured')], 400);
            }

            $user = auth()->user();
            $orderId = 'plan_' . $plan->id . '_' . $user->id . '_' . time();

            // Convert to IDR (whole numbers only, no cents)
            $amount = intval($pricing['final_price']);
            
            $paymentData = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => $amount
                ],
                'credit_card' => [
                    'secure' => true
                ],
                'customer_details' => [
                    'first_name' => $user->name ?? 'Customer',
                    'email' => $user->email,
                ],
                'item_details' => [
                    [
                        'id' => $plan->id,
                        'price' => $amount,
                        'quantity' => 1,
                        'name' => $plan->name
                    ]
                ]
            ];

            $snapToken = $this->createSnapToken($paymentData, $settings['payment_settings']);

            if ($snapToken) {
                $baseUrl = $settings['payment_settings']['midtrans_mode'] === 'live' 
                    ? 'https://app.midtrans.com' 
                    : 'https://app.sandbox.midtrans.com';

                return response()->json([
                    'success' => true,
                    'snap_token' => $snapToken,
                    'payment_url' => $baseUrl . '/snap/v1/transactions/' . $snapToken,
                    'order_id' => $orderId
                ]);
            }

            throw new \Exception(__('Failed to create Midtrans snap token'));

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }

    public function callback(Request $request)
    {
        try {
            $orderId = $request->input('order_id');
            $transactionStatus = $request->input('transaction_status');
            
            if ($orderId && in_array($transactionStatus, ['capture', 'settlement'])) {
                $parts = explode('_', $orderId);
                
                if (count($parts) >= 3) {
                    $planId = $parts[1];
                    $userId = $parts[2];
                    
                    $plan = Plan::find($planId);
                    $user = \App\Models\User::find($userId);
                    
                    if ($plan && $user) {
                        processPaymentSuccess([
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                            'billing_cycle' => 'monthly',
                            'payment_method' => 'midtrans',
                            'payment_id' => $request->input('transaction_id'),
                        ]);
                    }
                }
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Callback processing failed')], 500);
        }
    }

    private function createSnapToken($paymentData, $settings)
    {
        try {
            $baseUrl = $settings['midtrans_mode'] === 'live' 
                ? 'https://app.midtrans.com' 
                : 'https://app.sandbox.midtrans.com';

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $baseUrl . '/snap/v1/transactions');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentData));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Basic ' . base64_encode($settings['midtrans_secret_key'] . ':'),
                'Content-Type: application/json',
                'Accept: application/json'
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($curlError) {
                throw new \Exception(__('cURL Error: ') . $curlError);
            }

            if ($httpCode !== 201) {
                throw new \Exception(__('HTTP Error: ') . $httpCode . ' - ' . $response);
            }

            $result = json_decode($response, true);
            
            if (!isset($result['token'])) {
                throw new \Exception(__('No token in response: ') . $response);
            }
            
            return $result['token'];

        } catch (\Exception $e) {
            return false;
        }
    }
}