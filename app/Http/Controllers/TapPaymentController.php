<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;

class TapPaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['tap_secret_key'])) {
                return response()->json(['error' => __('Tap not configured')], 400);
            }

            $user = auth()->user();
            $transactionId = 'plan_' . $plan->id . '_' . $user->id . '_' . time();

            // Initialize Tap Payment library
            require_once app_path('Libraries/Tap/Tap.php');
            require_once app_path('Libraries/Tap/Reference.php');
            require_once app_path('Libraries/Tap/Payment.php');
            $tap = new \App\Package\Payment([
                'company_tap_secret_key' => $settings['payment_settings']['tap_secret_key']
            ]);

            $chargeData = [
                'amount' => $pricing['final_price'],
                'currency' => 'USD',
                'threeDSecure' => 'true',
                'description' => 'Plan: ' . $plan->name,
                'statement_descriptor' => 'Plan Subscription',
                'customer' => [
                    'first_name' => $user->name ?? 'Customer',
                    'email' => $user->email,
                ],
                'source' => ['id' => 'src_card'],
                'post' => ['url' => route('tap.callback')],
                'redirect' => ['url' => route('tap.success', [
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'coupon_code' => $validated['coupon_code'] ?? ''
                ])]
            ];

            return $tap->charge($chargeData, true);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }
    
    public function success(Request $request)
    {
        try {
            $chargeId = $request->input('tap_id');
            $planId = $request->input('plan_id');
            $userId = $request->input('user_id');
            $billingCycle = $request->input('billing_cycle', 'monthly');
            $couponCode = $request->input('coupon_code');
            
            if ($chargeId && $planId && $userId) {
                $plan = Plan::find($planId);
                $user = User::find($userId);
                
                if ($plan && $user) {
                    // Verify payment status with Tap API
                    $settings = getPaymentGatewaySettings();
                    
                    if (!isset($settings['payment_settings']['tap_secret_key'])) {
                        return redirect()->route('plans.index')->with('error', __('Tap not configured'));
                    }
                    
                    // Initialize Tap Payment library
                    require_once app_path('Libraries/Tap/Tap.php');
                    require_once app_path('Libraries/Tap/Reference.php');
                    require_once app_path('Libraries/Tap/Payment.php');
                    $tap = new \App\Package\Payment([
                        'company_tap_secret_key' => $settings['payment_settings']['tap_secret_key']
                    ]);
                    
                    // Get charge details from Tap API
                    $chargeDetails = $tap->getCharge($chargeId);
                    
                    if ($chargeDetails && isset($chargeDetails->status) && $chargeDetails->status === 'CAPTURED') {
                        processPaymentSuccess([
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                            'billing_cycle' => $billingCycle,
                            'payment_method' => 'tap',
                            'coupon_code' => $couponCode,
                            'payment_id' => $chargeId,
                        ]);
                        
                        // Log the user in if not already authenticated
                        if (!auth()->check()) {
                            auth()->login($user);
                        }
                        
                        return redirect()->route('plans.index')->with('success', __('Payment completed successfully and plan activated'));
                    } else {
                        return redirect()->route('plans.index')->with('error', __('Payment not captured or failed'));
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
            $chargeId = $request->input('tap_id');
            $status = $request->input('status');
            return response('OK', 200);

        } catch (\Exception $e) {
            return response('Error', 500);
        }
    }
}