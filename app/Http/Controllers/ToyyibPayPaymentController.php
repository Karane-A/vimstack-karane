<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ToyyibPayPaymentController extends Controller
{
    private $secretKey;
    private $categoryCode;
    private $callBackUrl;
    private $returnUrl;

    public function __construct()
    {
        // For plan subscriptions, always use superadmin settings
        $superAdminId = \App\Models\User::where('type', 'superadmin')->first()?->id;
        $settings = getPaymentMethodConfig('toyyibpay', $superAdminId);
        $this->secretKey = $settings['secret_key'] ?? '';
        $this->categoryCode = $settings['category_code'] ?? '';
    }

    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'billName' => 'required|string',
            'billAmount' => 'required|numeric|min:0.01',
            'billTo' => 'required|string',
            'billEmail' => 'required|email',
            'billPhone' => 'required|string',
            'billDescription' => 'nullable|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $user = Auth::user();
            
            if (!$this->secretKey || !$this->categoryCode) {
                return back()->withErrors(['error' => __('ToyyibPay payment gateway not configured properly')]);
            }
            
            // Calculate final amount with coupon
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $finalAmount = $pricing['final_price'];
            
            // Set callback and return URLs
            $this->callBackUrl = route('toyyibpay.callback');
            $this->returnUrl = route('toyyibpay.success');
            
            // Generate unique payment reference
            $paymentId = 'toyyib_' . $plan->id . '_' . time() . '_' . uniqid();
            
            // Create plan order before payment
            createPlanOrder([
                'user_id' => $user->id,
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'toyyibpay',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $paymentId,
                'status' => 'pending'
            ]);
            
            // Format phone number for Malaysian format
            $phone = preg_replace('/[^0-9]/', '', $validated['billPhone']);
            if (!str_starts_with($phone, '60')) {
                $phone = '60' . ltrim($phone, '0');
            }
            
            // Prepare bill data
            $billData = [
                'userSecretKey' => $this->secretKey,
                'categoryCode' => $this->categoryCode,
                'billName' => $validated['billName'],
                'billDescription' => $validated['billDescription'] ?? $plan->description ?? $plan->name,
                'billPriceSetting' => 1,
                'billPayorInfo' => 1,
                'billAmount' => intval($finalAmount * 100), // Convert to cents
                'billReturnUrl' => $this->returnUrl,
                'billCallbackUrl' => $this->callBackUrl,
                'billExternalReferenceNo' => $paymentId,
                'billTo' => $validated['billTo'],
                'billEmail' => $validated['billEmail'],
                'billPhone' => $phone,
                'billSplitPayment' => 0,
                'billSplitPaymentArgs' => '',
                'billPaymentChannel' => '0',
                'billContentEmail' => 'Thank you for your subscription!',
                'billChargeToCustomer' => 1,
                'billExpiryDate' => date('d-m-Y', strtotime('+3 days')),
                'billExpiryDays' => 3
            ];
            
            // Make API call to ToyyibPay
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_URL, 'https://toyyibpay.com/index.php/api/createBill');
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $billData);
            curl_setopt($curl, CURLOPT_TIMEOUT, 30);
            
            $result = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $curlError = curl_error($curl);
            curl_close($curl);
            
            if ($curlError) {
                throw new \Exception('cURL Error: ' . $curlError);
            }
            
            if ($httpCode !== 200) {
                throw new \Exception('HTTP Error: ' . $httpCode);
            }
            
            // Handle response
            if (str_contains($result, 'KEY-DID-NOT-EXIST-OR-USER-IS-NOT-ACTIVE')) {
                throw new \Exception(__('Invalid ToyyibPay credentials or inactive account'));
            }
            
            $responseData = json_decode($result, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception(__('Invalid JSON response from ToyyibPay'));
            }
            
            if (isset($responseData[0]['BillCode'])) {
                $redirectUrl = 'https://toyyibpay.com/' . $responseData[0]['BillCode'];
                Log::info('Redirecting to ToyyibPay', ['url' => $redirectUrl]);
                return redirect()->away($redirectUrl);
            } else {
                $errorMsg = $responseData[0]['msg'] ?? __('Failed to create payment bill');
                throw new \Exception($errorMsg);
            }
            
        } catch (\Exception $e) {
            return handlePaymentError($e, 'ToyyibPay');
        }
    }

    public function callback(Request $request)
    {
        try {
            $billcode = $request->input('billcode');
            $status_id = $request->input('status_id');
            $order_id = $request->input('order_id');
            $transaction_id = $request->input('transaction_id');
            
            if ($status_id == '1') { // Payment successful
                $planOrder = \App\Models\PlanOrder::where('payment_id', $order_id)->first();
                
                if ($planOrder && $planOrder->status === 'pending') {
                    processPaymentSuccess([
                        'user_id' => $planOrder->user_id,
                        'plan_id' => $planOrder->plan_id,
                        'billing_cycle' => $planOrder->billing_cycle,
                        'payment_method' => 'toyyibpay',
                        'coupon_code' => $planOrder->coupon_code,
                        'payment_id' => $order_id,
                    ]);
                }
            }            
            return response('OK', 200);
        } catch (\Exception $e) {
            return response('ERROR', 500);
        }
    }

    public function success(Request $request)
    {
        $status_id = $request->input('status_id');
        $order_id = $request->input('order_id');
        
        if ($status_id == '1') {
            return redirect()->route('plans.index')->with('success', __('Payment completed successfully!'));
        } else {
            return redirect()->route('plans.index')->with('error', __('Payment was not completed. Please try again.'));
        }
    }
}