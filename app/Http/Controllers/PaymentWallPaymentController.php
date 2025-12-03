<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PaymentWallPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        try {
            $validated = $request->validate([
                'plan_id' => 'required|exists:plans,id',
                'billing_cycle' => 'required|in:monthly,yearly',
                'coupon_code' => 'nullable|string',
                'brick_token' => 'required|string',
                'brick_fingerprint' => 'required|string',
            ]);

            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['paymentwall_private_key'])) {
                return back()->withErrors(['error' => __('PaymentWall not configured')]);
            }

            $user = auth()->user();
            $currency = $settings['general_settings']['currency'] ?? 'USD';
            $isTestMode = ($settings['payment_settings']['paymentwall_mode'] ?? 'sandbox') === 'sandbox';

            // Prepare charge data for PaymentWall Brick API
            $chargeData = [
                'token' => $validated['brick_token'],
                'fingerprint' => $validated['brick_fingerprint'],
                'amount' => $pricing['final_price'],
                'currency' => $currency,
                'email' => $user->email,
                'history[registration_date]' => $user->created_at->timestamp,
                'description' => 'Plan: ' . $plan->name,
                'uid' => $user->id,
                'test_mode' => $isTestMode ? 1 : 0,
            ];

            // Make API call to PaymentWall to process the charge
            $response = $this->processCharge($chargeData, $settings['payment_settings']['paymentwall_private_key']);

            if ($response && isset($response['type']) && $response['type'] === 'Charge' && $response['captured']) {
                // Payment successful
                processPaymentSuccess([
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'paymentwall',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $response['id'] ?? 'brick_' . time(),
                ]);

                return redirect()->route('plans.index')->with('success', __('Payment successful and plan activated'));
            } else {
                $errorMessage = $response['error'] ?? __('Payment processing failed');
                return back()->withErrors(['error' => $errorMessage]);
            }

        } catch (\Exception $e) {
            return handlePaymentError($e, 'paymentwall');
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['paymentwall_public_key'])) {
                return response()->json(['error' => __('PaymentWall not configured')], 400);
            }

            $user = auth()->user();
            $currency = $settings['general_settings']['currency'] ?? 'USD';

            $isTestMode = ($settings['payment_settings']['paymentwall_mode'] ?? 'sandbox') === 'sandbox';
            
            // Return Brick.js configuration
            return response()->json([
                'success' => true,
                'brick_config' => [
                    'public_key' => $settings['payment_settings']['paymentwall_public_key'],
                    'amount' => $pricing['final_price'],
                    'currency' => $currency,
                    'plan_name' => $plan->name,
                    'success_url' => route('paymentwall.success'),
                    'action_url' => route('paymentwall.process'),
                    'plan_id' => $plan->id,
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'billing_cycle' => $validated['billing_cycle'],
                    'test_mode' => $isTestMode
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }

    public function success(Request $request)
    {
        return redirect()->route('plans.index')->with('success', __('Payment completed successfully'));
    }

    public function callback(Request $request)
    {
        try {
            $settings = getPaymentGatewaySettings();
            $privateKey = $settings['payment_settings']['paymentwall_private_key'] ?? '';
            
            // Validate pingback signature
            if (!$this->validatePingback($request->all(), $privateKey)) {
                return response('Invalid signature', 400);
            }
            
            $userId = $request->input('uid');
            $type = $request->input('type');
            $ref = $request->input('ref');
            $externalId = $request->input('goodsid');
            
            // Type 0 = payment successful, Type 1 = payment pending, Type 2 = payment failed
            if ($userId && $type === '0') {
                $user = \App\Models\User::find($userId);
                
                if ($user && $externalId) {
                    // Extract plan ID from external_id (format: plan_X_timestamp)
                    if (preg_match('/^plan_(\d+)_/', $externalId, $matches)) {
                        $planId = $matches[1];
                        $plan = Plan::find($planId);
                        
                        if ($plan) {
                            // Check if this payment was already processed
                            $existingOrder = \App\Models\PlanOrder::where('payment_id', $ref)
                                ->where('user_id', $user->id)
                                ->first();
                                
                            if (!$existingOrder) {
                                processPaymentSuccess([
                                    'user_id' => $user->id,
                                    'plan_id' => $plan->id,
                                    'billing_cycle' => 'monthly', // Default to monthly
                                    'payment_method' => 'paymentwall',
                                    'payment_id' => $ref,
                                ]);
                            }
                        }
                    }
                }
            }

            return response('OK');

        } catch (\Exception $e) {
            return response(__('Error processing callback'), 500);
        }
    }

    private function generateSignatureV2($params, $secretKey)
    {
        $str = '';
        ksort($params);
        foreach ($params as $key => $value) {
            if ($key !== 'sign') {
                $str .= $key . '=' . $value;
            }
        }
        $str .= $secretKey;
        return md5($str);
    }

    private function getSignatureString($params, $secretKey)
    {
        $str = '';
        ksort($params);
        foreach ($params as $key => $value) {
            if ($key !== 'sign') {
                $str .= $key . '=' . $value;
            }
        }
        $str .= $secretKey;
        return $str;
    }

    private function validatePingback($params, $secretKey)
    {
        $signature = $params['sig'] ?? '';
        unset($params['sig']);
        
        $str = '';
        ksort($params);
        foreach ($params as $key => $value) {
            $str .= $key . '=' . $value;
        }
        $str .= $secretKey;
        
        return md5($str) === $signature;
    }

    private function processCharge($chargeData, $privateKey)
    {
        try {
            $url = 'https://api.paymentwall.com/api/brick/charge';
            
            // Add private key to the data
            $chargeData['key'] = $privateKey;
            
            // Make HTTP request to PaymentWall Brick API
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($chargeData));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode !== 200) {
                return null;
            }
            
            $responseData = json_decode($response, true);
                        
            return $responseData;
            
        } catch (\Exception $e) {
            return null;
        }
    }
}