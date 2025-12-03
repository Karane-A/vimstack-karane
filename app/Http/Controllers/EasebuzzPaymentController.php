<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;

class EasebuzzPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'easepayid' => 'required|string',
            'status' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['easebuzz_merchant_key'])) {
                return back()->withErrors(['error' => __('Easebuzz not configured')]);
            }

            if ($validated['status'] === 'success') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'easebuzz',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['easepayid'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'easebuzz');
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['easebuzz_merchant_key']) || !isset($settings['payment_settings']['easebuzz_salt_key'])) {
                return response()->json(['error' => __('Easebuzz not configured')], 400);
            }

            // Include Easebuzz library
            require_once app_path('Libraries/Easebuzz/easebuzz_payment_gateway.php');
            
            $user = auth()->user();
            $txnid = 'plan_' . $plan->id . '_' . $user->id . '_' . time();
            $environment = $settings['payment_settings']['easebuzz_environment'] === 'prod' ? 'prod' : 'test';

            // Initialize Easebuzz
            $easebuzz = new \Easebuzz(
                $settings['payment_settings']['easebuzz_merchant_key'],
                $settings['payment_settings']['easebuzz_salt_key'],
                $environment
            );

            $postData = [
                'txnid' => $txnid,
                'amount' => number_format($pricing['final_price'], 2, '.', ''),
                'productinfo' => $plan->name,
                'firstname' => $user->name ?? 'Customer',
                'email' => $user->email,
                'phone' => '9999999999',
                'surl' => route('easebuzz.success'),
                'furl' => route('plans.index'),
                'udf1' => $validated['billing_cycle'],
                'udf2' => $validated['coupon_code'] ?? '',
            ];

            // Use Easebuzz library to initiate payment
            $result = $easebuzz->initiatePaymentAPI($postData, false);
            
            $resultArray = json_decode($result, true);
            
            if ($resultArray && isset($resultArray['status']) && $resultArray['status'] == 1) {
                $accessKey = $resultArray['access_key'] ?? null;
                if ($accessKey) {
                    $baseUrl = $settings['payment_settings']['easebuzz_environment'] === 'prod' 
                        ? 'https://pay.easebuzz.in' 
                        : 'https://testpay.easebuzz.in';
                    
                    return response()->json([
                        'success' => true,
                        'payment_url' => $baseUrl . '/pay/' . $accessKey,
                        'transaction_id' => $txnid
                    ]);
                }
            }
            
            return response()->json(['error' => 'Payment initialization failed'], 400);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }

    public function success(Request $request)
    {
        try {
            // Include Easebuzz library
            require_once app_path('Libraries/Easebuzz/easebuzz_payment_gateway.php');
            
            $settings = getPaymentGatewaySettings();
            $environment = $settings['payment_settings']['easebuzz_environment'] === 'prod' ? 'prod' : 'test';
            
            $easebuzz = new \Easebuzz(
                $settings['payment_settings']['easebuzz_merchant_key'],
                $settings['payment_settings']['easebuzz_salt_key'],
                $environment
            );
            
            // Verify payment response
            $result = $easebuzz->easebuzzResponse($request->all());
            $resultArray = json_decode($result, true);
            
            if ($resultArray && $resultArray['status'] == 1 && $request->input('status') === 'success') {
                $txnid = $request->input('txnid');
                $parts = explode('_', $txnid);
                
                if (count($parts) >= 3) {
                    $planId = $parts[1];
                    $userId = $parts[2];
                    
                    $plan = Plan::find($planId);
                    $user = User::find($userId);
                    
                    if ($plan && $user) {
                        processPaymentSuccess([
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                            'billing_cycle' => $request->input('udf1', 'monthly'),
                            'payment_method' => 'easebuzz',
                            'payment_id' => $request->input('easepayid'),
                        ]);
                        
                        // Log the user in if not already authenticated
                        if (!auth()->check()) {
                            auth()->login($user);
                        }
                        
                        return redirect()->route('plans.index')->with('success', __('Payment completed successfully and plan activated'));
                    }
                }
            }
            
            return redirect()->route('plans.index')->with('error', __('Payment verification failed'));
            
        } catch (\Exception $e) {
            return redirect()->route('plans.index')->with('error', __('Payment processing failed'));
        }
    }

    public function callback(Request $request)
    {
        try {
            $txnid = $request->input('txnid');
            $status = $request->input('status');
            
            if ($txnid && $status === 'success') {
                $parts = explode('_', $txnid);
                
                if (count($parts) >= 3) {
                    $planId = $parts[1];
                    $userId = $parts[2];
                    
                    $plan = Plan::find($planId);
                    $user = \App\Models\User::find($userId);
                    
                    if ($plan && $user) {
                        processPaymentSuccess([
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                            'billing_cycle' => $request->input('udf1', 'monthly'),
                            'payment_method' => 'easebuzz',
                            'payment_id' => $request->input('easepayid'),
                        ]);
                    }
                }
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Callback processing failed')], 500);
        }
    }
}