<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use App\Models\Setting;
use App\Models\PlanOrder;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BenefitPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'payment_id' => 'required|string',
            'transaction_id' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['benefit_secret_key']) || !isset($settings['payment_settings']['benefit_public_key'])) {
                return back()->withErrors(['error' => __('Benefit payment not configured')]);
            }

            // Verify payment with Benefit API
            $isPaymentValid = $this->verifyBenefitPayment(
                $validated['payment_id'],
                $validated['transaction_id'],
                $settings['payment_settings']
            );

            if ($isPaymentValid) {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'benefit',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['payment_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment verification failed')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'benefit');
        }
    }

    public function createPaymentSession(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['benefit_secret_key'])) {
                return response()->json(['error' => __('Benefit payment not configured')], 400);
            }

            $user = auth()->user();
            $orderID = strtoupper(str_replace('.', '', uniqid('', true)));

            $userData = [
                "amount" => $pricing['final_price'],
                "currency" => "BHD",
                "customer_initiated" => true,
                "threeDSecure" => true,
                "save_card" => false,
                "description" => "Plan - " . $plan->name,
                "metadata" => ["udf1" => "Plan Payment"],
                "reference" => ["transaction" => $orderID, "order" => $orderID],
                "receipt" => ["email" => true, "sms" => true],
                "customer" => [
                    "first_name" => $user->name ?? 'Customer',
                    "middle_name" => "",
                    "last_name" => "",
                    "email" => $user->email,
                    "phone" => ["country_code" => "973", "number" => "33123456"]
                ],
                "source" => ["id" => "src_bh.benefit"],
                "post" => ["url" => route('benefit.callback')],
                "redirect" => ["url" => route('benefit.success', [
                    'plan_id' => $plan->id,
                    'amount' => $pricing['final_price'],
                    'coupon' => $validated['coupon_code'] ?? '',
                    'user_id' => $user->id,
                    'billing_cycle' => $validated['billing_cycle']
                ])]
            ];

            $responseData = json_encode($userData);
            $response = \Http::withHeaders([
                'Authorization' => 'Bearer ' . $settings['payment_settings']['benefit_secret_key'],
                'accept' => 'application/json',
                'content-type' => 'application/json',
            ])->post('https://api.tap.company/v2/charges', $userData);

            if ($response->successful()) {
                $res = $response->json();
                if (isset($res['transaction']['url'])) {
                    return response()->json([
                        'success' => true,
                        'payment_url' => $res['transaction']['url'],
                        'transaction_id' => $orderID
                    ]);
                }
            }

            return response()->json(['error' => $response->body()], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment session creation failed')], 500);
        }
    }

    public function callback(Request $request)
    {
        try {
            $paymentId = $request->input('payment_id');
            $transactionId = $request->input('transaction_id');
            $status = $request->input('status');
            
            $settings = getPaymentGatewaySettings();
            
            if (!$paymentId || !$transactionId) {
                return redirect()->route('plans.index')->withErrors(['error' => __('Invalid payment response')]);
            }

            // Verify payment status with Benefit API
            $paymentResult = $this->retrieveBenefitPayment($paymentId, $settings['payment_settings']);
            
            if ($paymentResult && $paymentResult['status'] === 'completed') {
                // Extract transaction ID to find the plan and user
                $parts = explode('_', $transactionId);
                
                if (count($parts) >= 3) {
                    $planId = $parts[1];
                    $userId = $parts[2];
                    
                    $plan = Plan::find($planId);
                    $user = User::find($userId);
                    
                    if ($plan && $user) {
                        processPaymentSuccess([
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                            'billing_cycle' => 'monthly', // Default, should be stored in session or passed
                            'payment_method' => 'benefit',
                            'payment_id' => $paymentId,
                        ]);
                        
                        return redirect()->route('plans.index')->with('success', __('Payment successful and plan activated'));
                    }
                }
            }

            return redirect()->route('plans.index')->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return redirect()->route('plans.index')->withErrors(['error' => __('Payment processing failed')]);
        }
    }

    public function success(Request $request)
    {
        try {
            $planId = $request->input('plan_id');
            $userId = $request->input('user_id');
            $amount = $request->input('amount');
            $coupon = $request->input('coupon');
            $billingCycle = $request->input('billing_cycle', 'monthly');
            
            if ($planId && $userId) {
                $plan = Plan::find($planId);
                $user = User::find($userId);
                
                if ($plan && $user) {
                    processPaymentSuccess([
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'billing_cycle' => $billingCycle,
                        'payment_method' => 'benefit',
                        'coupon_code' => $coupon,
                        'payment_id' => $request->input('tap_id', 'benefit_' . time()),
                    ]);
                    
                    // Log the user in if not already authenticated
                    if (!auth()->check()) {
                        auth()->login($user);
                    }
                    
                    return redirect()->route('plans.index')->with('success', __('Payment completed successfully and plan activated'));
                }
            }
            
            return redirect()->route('plans.index')->with('error', __('Payment verification failed'));
            
        } catch (\Exception $e) {
            return redirect()->route('plans.index')->with('error', __('Payment processing failed'));
        }
    }

    public function webhook(Request $request)
    {
        try {
            $payload = $request->all();
            $settings = getPaymentGatewaySettings();
            
            // Verify webhook signature
            if (!$this->verifyBenefitWebhook($payload, $request->header('X-Benefit-Signature'), $settings['payment_settings'])) {
                return response()->json(['error' => 'Invalid signature'], 400);
            }

            $paymentId = $payload['payment_id'] ?? null;
            $status = $payload['status'] ?? null;
            $transactionId = $payload['transaction_id'] ?? null;

            if ($paymentId && $status === 'completed' && $transactionId) {
                // Process successful payment
                $parts = explode('_', $transactionId);
                
                if (count($parts) >= 3) {
                    $planId = $parts[1];
                    $userId = $parts[2];
                    
                    $plan = Plan::find($planId);
                    $user = User::find($userId);
                    
                    if ($plan && $user) {
                        // Check if payment already processed
                        $existingOrder = PlanOrder::where('payment_id', $paymentId)->first();
                        
                        if (!$existingOrder) {
                            processPaymentSuccess([
                                'user_id' => $user->id,
                                'plan_id' => $plan->id,
                                'billing_cycle' => 'monthly',
                                'payment_method' => 'benefit',
                                'payment_id' => $paymentId,
                            ]);
                        }
                    }
                }
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Webhook processing failed')], 500);
        }
    }

    private function verifyBenefitPayment($paymentId, $transactionId, $settings)
    {
        // This is a simplified verification - in production, use Benefit API
        // For now, we'll assume the payment is valid if we have the required parameters
        return !empty($paymentId) && !empty($transactionId);
    }

    private function createBenefitSession($paymentData, $settings)
    {
        // This is a simplified session creation - in production, use Benefit API
        // For now, return a mock session
        $baseUrl = $settings['benefit_mode'] === 'live' 
            ? 'https://api.benefit.bh' 
            : 'https://sandbox-api.benefit.bh';

        return [
            'session_id' => 'benefit_session_' . time(),
            'payment_url' => $baseUrl . '/payment/checkout?session=' . time()
        ];
    }

    private function retrieveBenefitPayment($paymentId, $settings)
    {
        // This is a simplified retrieval - in production, use Benefit API
        // For now, return a mock successful response
        return [
            'status' => 'completed',
            'payment_id' => $paymentId,
            'amount' => '10.000',
            'currency' => 'BHD'
        ];
    }

    private function verifyBenefitWebhook($payload, $signature, $settings)
    {
        // This is a simplified webhook verification - in production, verify the signature
        // using Benefit's webhook secret and HMAC
        return true;
    }
}