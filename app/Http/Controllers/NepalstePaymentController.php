<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class NepalstePaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'payment_id' => 'required|string',
            'status' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['nepalste_public_key']) || !isset($settings['payment_settings']['nepalste_secret_key'])) {
                return back()->withErrors(['error' => __('Nepalste not configured')]);
            }

            if ($validated['status'] === 'completed') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'nepalste',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['payment_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Payment processing failed']);
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['nepalste_public_key']) || !isset($settings['payment_settings']['nepalste_secret_key'])) {
                return response()->json(['error' => 'Nepalste not configured'], 400);
            }

            $user = auth()->user();
            $orderId = 'plan_' . $plan->id . '_' . $user->id . '_' . time();

            // First get access token
            $accessToken = $this->getAccessToken($settings['payment_settings']);
            if (!$accessToken) {
                return response()->json(['error' => 'Failed to get access token'], 500);
            }

            $paymentData = [
                'amount' => $pricing['final_price'],
                'purchase_order_id' => $orderId,
                'purchase_order_name' => $plan->name,
                'return_url' => route('nepalste.success', ['order_id' => $orderId, 'plan_id' => $plan->id, 'billing_cycle' => $validated['billing_cycle']]),
                'website_url' => route('plans.index'),
            ];

            $baseUrl = $settings['payment_settings']['nepalste_mode'] === 'live' 
                ? 'https://nepalste.com.np/pay/api/v1' 
                : 'https://nepalste.com.np/pay/sandbox/api/v1';

            $response = $this->initiateNepalstePayment($baseUrl . '/payment/initiate', $paymentData, $accessToken);

            if ($response && isset($response['payment_url'])) {
                return response()->json([
                    'success' => true,
                    'payment_url' => $response['payment_url'],
                    'order_id' => $orderId
                ]);
            }

            return response()->json(['error' => 'Payment initiation failed'], 500);

        } catch (\Exception $e) {
            \Log::error('Nepalste payment creation error: ' . $e->getMessage());
            return response()->json(['error' => 'Payment creation failed'], 500);
        }
    }

    public function success(Request $request)
    {
        try {
            $orderId = $request->input('order_id');
            $planId = $request->input('plan_id');
            $billingCycle = $request->input('billing_cycle');
            
            if ($orderId && $planId) {
                $plan = Plan::find($planId);
                $user = auth()->user();
                
                if ($plan && $user) {
                    // Assign plan to user
                    $user->plan_id = $plan->id;
                    $user->plan_expire_date = $billingCycle === 'yearly' ? now()->addYear() : now()->addMonth();
                    $user->save();
                    
                    processPaymentSuccess([
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'billing_cycle' => $billingCycle,
                        'payment_method' => 'nepalste',
                        'payment_id' => $orderId,
                    ]);
                    
                    return redirect()->route('plans.index')->with('success', 'Payment successful and plan activated');
                }
            }
            
            return redirect()->route('plans.index')->with('error', 'Payment verification failed');
            
        } catch (\Exception $e) {
            \Log::error('Nepalste success error: ' . $e->getMessage());
            return redirect()->route('plans.index')->with('error', 'Payment processing failed');
        }
    }

    public function callback(Request $request)
    {
        try {
            $orderId = $request->input('purchase_order_id');
            $status = $request->input('status');
            
            if ($orderId && $status === 'completed') {
                $parts = explode('_', $orderId);
                
                if (count($parts) >= 3) {
                    $planId = $parts[1];
                    $userId = $parts[2];
                    
                    $plan = Plan::find($planId);
                    $user = \App\Models\User::find($userId);
                    
                    if ($plan && $user) {
                        $user->plan_id = $plan->id;
                        $user->plan_expire_date = now()->addMonth();
                        $user->save();
                        
                        processPaymentSuccess([
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                            'billing_cycle' => 'monthly',
                            'payment_method' => 'nepalste',
                            'payment_id' => $request->input('payment_id'),
                        ]);
                    }
                }
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            \Log::error('Nepalste callback error: ' . $e->getMessage());
            return response()->json(['error' => 'Callback processing failed'], 500);
        }
    }

    private function getAccessToken($settings)
    {
        try {
            $baseUrl = $settings['nepalste_mode'] === 'live' 
                ? 'https://nepalste.com.np/pay/api/v1' 
                : 'https://nepalste.com.np/pay/sandbox/api/v1';

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $baseUrl . '/access-token');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'consumer_key' => $settings['nepalste_public_key'],
                'consumer_secret' => $settings['nepalste_secret_key']
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            \Log::info('Nepalste Access Token Response', [
                'response' => $response, 
                'http_code' => $httpCode
            ]);

            if ($httpCode === 200) {
                $decoded = json_decode($response, true);
                return $decoded['token'] ?? null;
            }

            return null;

        } catch (\Exception $e) {
            \Log::error('Nepalste access token error: ' . $e->getMessage());
            return null;
        }
    }

    private function initiateNepalstePayment($url, $data, $token)
    {
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $token,
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            \Log::info('Nepalste Payment Response', [
                'response' => $response, 
                'http_code' => $httpCode,
                'url' => $url,
                'data' => $data
            ]);

            if ($httpCode === 200) {
                $decoded = json_decode($response, true);
                if ($decoded && isset($decoded['payment_url'])) {
                    return $decoded;
                }
            }

            return false;

        } catch (\Exception $e) {
            \Log::error('Nepalste payment request error: ' . $e->getMessage());
            return false;
        }
    }
}