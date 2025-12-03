<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class SSPayPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'status_id' => 'required|string',
            'order_id' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['sspay_secret_key'])) {
                return back()->withErrors(['error' => __('SSPay not configured')]);
            }

            if ($validated['status_id'] === '1') { // Success status
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'sspay',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['order_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'sspay');
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['sspay_secret_key'])) {
                return response()->json(['error' => __('SSPay not configured')], 400);
            }

            $user = auth()->user();
            $orderId = 'plan_' . $plan->id . '_' . $user->id . '_' . time();

            $paymentData = [
                'userSecretKey' => $settings['payment_settings']['sspay_secret_key'],
                'categoryCode' => $settings['payment_settings']['sspay_category_code'],
                'billName' => $plan->name,
                'billDescription' => 'Plan: ' . $plan->name,
                'billPriceSetting' => 1,
                'billPayorInfo' => 1,
                'billAmount' => $pricing['final_price'] * 100, // Convert to cents
                'billReturnUrl' => route('sspay.success'),
                'billCallbackUrl' => route('sspay.callback'),
                'billExternalReferenceNo' => $orderId,
                'billTo' => $user->email,
                'billEmail' => $user->email,
                'billPhone' => '60123456789',
                'billAddrLine1' => 'Address Line 1',
                'billAddrLine2' => 'Address Line 2',
                'billPostcode' => '12345',
                'billCity' => 'Kuala Lumpur',
                'billState' => 'Selangor',
                'billCountry' => 'MY',
            ];

            return response()->json([
                'success' => true,
                'payment_url' => 'https://sspay.my/index.php/api/createBill',
                'payment_data' => $paymentData,
                'order_id' => $orderId
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
            $orderId = $request->input('billExternalReferenceNo');
            $statusId = $request->input('status_id');
            
            if ($orderId && $statusId === '1') {
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
                            'payment_method' => 'sspay',
                            'payment_id' => $request->input('billcode'),
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