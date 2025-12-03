<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;

class CinetPayPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'cpm_trans_id' => 'required|string',
            'cpm_result' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['cinetpay_site_id'])) {
                return back()->withErrors(['error' => __('CinetPay not configured')]);
            }

            if ($validated['cpm_result'] === '00') { // Success status
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'cinetpay',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['cpm_trans_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'cinetpay');
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['cinetpay_site_id'])) {
                return response()->json(['error' => __('CinetPay not configured')], 400);
            }

            $user = auth()->user();
            $transactionId = 'plan_' . $plan->id . '_' . $user->id . '_' . time();

            $paymentData = [
                'cpm_site_id' => $settings['payment_settings']['cinetpay_site_id'],
                'cpm_trans_id' => $transactionId,
                'cpm_amount' => $pricing['final_price'],
                'cpm_currency' => 'XOF', // West African CFA franc
                'cpm_designation' => $plan->name,
                'cpm_custom' => json_encode([
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                    'billing_cycle' => $validated['billing_cycle'],
                ]),
                'cpm_page_action' => 'PAYMENT',
                'cpm_version' => 'V2',
                'cpm_language' => 'fr',
                'cpm_return_url' => route('cinetpay.success'),
                'cpm_notify_url' => route('cinetpay.callback'),
                'cpm_error_url' => route('plans.index'),
            ];

            $baseUrl = 'https://www.cinetpay.com/payment/';

            return response()->json([
                'success' => true,
                'payment_url' => $baseUrl,
                'payment_data' => $paymentData,
                'transaction_id' => $transactionId
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
            $transactionId = $request->input('cpm_trans_id');
            $result = $request->input('cpm_result');
            
            if ($transactionId && $result === '00') {
                $parts = explode('_', $transactionId);
                
                if (count($parts) >= 3) {
                    $planId = $parts[1];
                    $userId = $parts[2];
                    
                    $plan = Plan::find($planId);
                    $user = User::find($userId);
                    
                    if ($plan && $user) {
                        $customData = json_decode($request->input('cpm_custom'), true);
                        
                        processPaymentSuccess([
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                            'billing_cycle' => $customData['billing_cycle'] ?? 'monthly',
                            'payment_method' => 'cinetpay',
                            'payment_id' => $transactionId,
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