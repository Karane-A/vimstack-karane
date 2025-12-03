<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;

class AamarpayPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'pay_status' => 'required|string',
            'mer_txnid' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['aamarpay_store_id'])) {
                return back()->withErrors(['error' => __('Aamarpay not configured')]);
            }

            if ($validated['pay_status'] === 'Successful') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'aamarpay',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['mer_txnid'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'aamarpay');
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['aamarpay_store_id']) || !isset($settings['payment_settings']['aamarpay_signature'])) {
                return response()->json(['error' => __('Aamarpay not configured')], 400);
            }

            $user = auth()->user();
            $orderID = strtoupper(str_replace('.', '', uniqid('', true)));
            $currency = $settings['payment_settings']['currency'] ?? 'BDT';
            $url = 'https://sandbox.aamarpay.com/request.php';

            // Use proper test store_id for sandbox
            $storeId = $settings['payment_settings']['aamarpay_store_id'];
            if ($storeId === 'aamarpaytest') {
                $storeId = 'aamarpaytest'; // This might need to be changed to actual test store ID
            }
            
            $fields = [
                'store_id' => $storeId,
                'amount' => $pricing['final_price'],
                'payment_type' => '',
                'currency' => $currency,
                'tran_id' => $orderID,
                'cus_name' => $user->name ?? 'Customer',
                'cus_email' => $user->email,
                'cus_add1' => '',
                'cus_add2' => '',
                'cus_city' => '',
                'cus_state' => '',
                'cus_postcode' => '',
                'cus_country' => '',
                'cus_phone' => '1234567890',
                'success_url' => route('aamarpay.success', [
                    'response' => 'success',
                    'coupon' => $validated['coupon_code'] ?? '',
                    'plan_id' => $plan->id,
                    'price' => $pricing['final_price'],
                    'order_id' => $orderID,
                    'user_id' => $user->id,
                    'billing_cycle' => $validated['billing_cycle']
                ]),
                'fail_url' => route('aamarpay.success', [
                    'response' => 'failure',
                    'coupon' => $validated['coupon_code'] ?? '',
                    'plan_id' => $plan->id,
                    'price' => $pricing['final_price'],
                    'order_id' => $orderID
                ]),
                'cancel_url' => route('aamarpay.success', ['response' => 'cancel']),
                'signature_key' => $settings['payment_settings']['aamarpay_signature'],
                'desc' => 'Plan: ' . $plan->name,
            ];

            $fields_string = http_build_query($fields);

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_VERBOSE, true);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($ch);
            $url_forward = str_replace('"', '', stripslashes($response));
            curl_close($ch);

            if ($url_forward) {
                return $this->redirectToMerchant($url_forward);
            }

            return response()->json(['error' => __('Payment creation failed')], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }

    private function redirectToMerchant($url)
    {
        $token = csrf_token();
        $redirectUrl = 'https://sandbox.aamarpay.com/' . $url;
        
        return response(view('aamarpay-redirect', compact('redirectUrl', 'token')));
    }

    public function success(Request $request)
    {
        try {
            $response = $request->input('response');
            $planId = $request->input('plan_id');
            $userId = $request->input('user_id');
            $coupon = $request->input('coupon');
            $billingCycle = $request->input('billing_cycle', 'monthly');
            $orderId = $request->input('order_id');
            
            if ($response === 'success' && $planId && $userId) {
                $plan = Plan::find($planId);
                $user = User::find($userId);
                
                if ($plan && $user) {
                    processPaymentSuccess([
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'billing_cycle' => $billingCycle,
                        'payment_method' => 'aamarpay',
                        'coupon_code' => $coupon,
                        'payment_id' => $orderId,
                    ]);
                    
                    // Log the user in if not already authenticated
                    if (!auth()->check()) {
                        auth()->login($user);
                    }
                    
                    return redirect()->route('plans.index')->with('success', __('Payment completed successfully and plan activated'));
                }
            }
            
            return redirect()->route('plans.index')->with('error', __('Payment failed or cancelled'));
            
        } catch (\Exception $e) {
            return redirect()->route('plans.index')->with('error', __('Payment processing failed'));
        }
    }

    public function callback(Request $request)
    {
        try {
            $transactionId = $request->input('mer_txnid');
            $status = $request->input('pay_status');
            
            if ($transactionId && $status === 'Successful') {
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
                            'billing_cycle' => 'monthly',
                            'payment_method' => 'aamarpay',
                            'payment_id' => $request->input('pg_txnid'),
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