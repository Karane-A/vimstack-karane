<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class PayTRPaymentController extends Controller
{
    private function getPayTRCredentials()
    {
        $settings = getPaymentGatewaySettings();
                
        return [
            'merchant_id' => $settings['payment_settings']['paytr_merchant_id'] ?? null,
            'merchant_key' => $settings['payment_settings']['paytr_merchant_key'] ?? null,
            'merchant_salt' => $settings['payment_settings']['paytr_merchant_salt'] ?? null,
            'currency' => $settings['general_settings']['defaultCurrency'] ?? 'TRY'
        ];
    }

    public function createPaymentToken(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'user_name' => 'required|string',
            'user_email' => 'required|email',
            'user_phone' => 'required|string',
            'user_address' => 'nullable|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $credentials = $this->getPayTRCredentials();
            
            if (!$credentials['merchant_id'] || !$credentials['merchant_key'] || !$credentials['merchant_salt']) {
                throw new \Exception(__('PayTR credentials not configured'));
            }
            
            $merchant_oid = 'plan_' . $plan->id . '_' . time() . '_' . uniqid();
            $payment_amount = intval($pricing['final_price'] * 100); // Convert to kuruş
            $user_basket = json_encode([[
                $plan->name . ' - ' . ucfirst($validated['billing_cycle']),
                number_format($pricing['final_price'], 2),
                1
            ]]);
            
            // Create pending order
            createPlanOrder([
                'user_id' => auth()->id(),
                'plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'paytr',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $merchant_oid,
                'status' => 'pending'
            ]);
            
            // Generate hash according to PayTR documentation
            $hashStr = $credentials['merchant_id'] . 
                      $request->ip() .
                      $merchant_oid .
                      $validated['user_email'] .
                      $payment_amount .
                      $user_basket .
                      '1' . // no_installment
                      '0' . // max_installment
                      $credentials['currency'] .
                      '1' . // test_mode
                      $credentials['merchant_salt'];
            
            $paytr_token = base64_encode(hash_hmac('sha256', $hashStr, $credentials['merchant_key'], true));
            
            $post_data = [
                'merchant_id' => $credentials['merchant_id'],
                'user_ip' => $request->ip(),
                'merchant_oid' => $merchant_oid,
                'email' => $validated['user_email'],
                'payment_amount' => $payment_amount,
                'paytr_token' => $paytr_token,
                'user_basket' => $user_basket,
                'no_installment' => 1,
                'max_installment' => 0,
                'user_name' => $validated['user_name'],
                'user_address' => $validated['user_address'] ?? 'Turkey',
                'user_phone' => $validated['user_phone'],
                'merchant_ok_url' => route('paytr.success'),
                'merchant_fail_url' => route('paytr.failure'),
                'timeout_limit' => 30,
                'currency' => $credentials['currency'],
                'test_mode' => 1
            ];
            
            $response = Http::asForm()->timeout(40)->post('https://www.paytr.com/odeme/api/get-token', $post_data);
            
            if ($response->successful()) {
                $result = $response->json();
                if ($result['status'] == 'success') {
                    return response()->json([
                        'success' => true,
                        'token' => $result['token'],
                        'iframe_url' => 'https://www.paytr.com/odeme/guvenli/' . $result['token']
                    ]);
                } else {
                    throw new \Exception($result['reason'] ?? __('Token generation failed'));
                }
            } else {
                throw new \Exception(__('PayTR API connection failed'));
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function success(Request $request)
    {
        return redirect()->route('plans.index')->with('success', __('Payment completed successfully!'));
    }

    public function failure(Request $request)
    {
        return redirect()->route('plans.index')->with('error', __('Payment failed. Please try again.'));
    }

    public function callback(Request $request)
    {
        try {
            $merchant_oid = $request->input('merchant_oid');
            $status = $request->input('status');
            $total_amount = $request->input('total_amount');
            $hash = $request->input('hash');
            
            $credentials = $this->getPayTRCredentials();
            
            // Verify hash for security
            $hashStr = $merchant_oid . $credentials['merchant_salt'] . $status . $total_amount;
            $calculatedHash = base64_encode(hash_hmac('sha256', $hashStr, $credentials['merchant_key'], true));
                        
            if ($hash === $calculatedHash && $status === 'success') {
                $planOrder = \App\Models\PlanOrder::where('payment_id', $merchant_oid)->first();
                
                if ($planOrder && $planOrder->status === 'pending') {
                    processPaymentSuccess([
                        'user_id' => $planOrder->user_id,
                        'plan_id' => $planOrder->plan_id,
                        'billing_cycle' => $planOrder->billing_cycle,
                        'payment_method' => 'paytr',
                        'coupon_code' => $planOrder->coupon_code,
                        'payment_id' => $merchant_oid,
                    ]);
                }
            }
            
            return response('OK', 200);
        } catch (\Exception $e) {
            return response('ERROR', 500);
        }
    }
}