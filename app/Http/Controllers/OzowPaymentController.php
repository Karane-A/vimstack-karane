<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;

class OzowPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'transaction_id' => 'required|string',
            'status' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['ozow_site_key'])) {
                return back()->withErrors(['error' => __('Ozow not configured')]);
            }

            if ($validated['status'] === 'Complete') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'ozow',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $validated['transaction_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'ozow');
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['ozow_site_key']) || !isset($settings['payment_settings']['ozow_private_key']) || !isset($settings['payment_settings']['ozow_api_key'])) {
                return response()->json(['error' => __('Ozow not configured')], 400);
            }

            $siteCode = $settings['payment_settings']['ozow_site_key'];
            $privateKey = $settings['payment_settings']['ozow_private_key'];
            $apiKey = $settings['payment_settings']['ozow_api_key'];
            $isTest = $settings['payment_settings']['ozow_mode'] == 'sandbox' ? 'true' : 'false';
            $amount = $pricing['final_price'];
            $cancelUrl = route('plans.index');
            $successUrl = route('ozow.success');
            $bankReference = time() . 'FKU';
            $transactionReference = time();
            $countryCode = 'ZA';
            $currency = 'ZAR';
            
            $inputString = $siteCode . $countryCode . $currency . $amount . $transactionReference . $bankReference . $cancelUrl . $successUrl . $successUrl . $successUrl . $isTest . $privateKey;
            $hashCheck = hash('sha512', strtolower($inputString));

            $data = [
                'countryCode' => $countryCode,
                'amount' => $amount,
                'transactionReference' => $transactionReference,
                'bankReference' => $bankReference,
                'cancelUrl' => $cancelUrl,
                'currencyCode' => $currency,
                'errorUrl' => $successUrl,
                'isTest' => $isTest,
                'notifyUrl' => $successUrl,
                'siteCode' => $siteCode,
                'successUrl' => $successUrl,
                'hashCheck' => $hashCheck,
            ];

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://api.ozow.com/postpaymentrequest',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => [
                    'Accept: application/json',
                    'ApiKey: ' . $apiKey,
                    'Content-Type: application/json'
                ],
            ]);

            $response = curl_exec($curl);
            curl_close($curl);
            $json_attendance = json_decode($response);

            if (isset($json_attendance->url) && $json_attendance->url != null) {
                return response()->json([
                    'success' => true,
                    'payment_url' => $json_attendance->url,
                    'transaction_id' => $transactionReference
                ]);
            } else {
                return response()->json(['error' => __('Payment creation failed')], 500);
            }

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
            $transactionId = $request->input('TransactionReference');
            $status = $request->input('Status');
            
            if ($transactionId && $status === 'Complete') {
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
                            'payment_method' => 'ozow',
                            'payment_id' => $transactionId,
                        ]);
                    }
                }
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
           return response()->json(['error' => 'Callback processing failed'], 500);
        }
    }
}