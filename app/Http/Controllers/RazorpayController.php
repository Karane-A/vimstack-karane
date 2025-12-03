<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class RazorpayController extends Controller
{
    /**
     * Get Razorpay API credentials
     * 
     * @return array
     */
    private function getRazorpayCredentials()
    {
        $settings = getPaymentGatewaySettings();
                        
        return [
            'key' => $settings['payment_settings']['razorpay_key'] ?? null,
            'secret' => $settings['payment_settings']['razorpay_secret'] ?? null,
            'currency' => $settings['general_settings']['defaultCurrency'] ?? 'INR'
        ];
    }

    /**
     * Create a Razorpay order
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createOrder(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            
            $amountInSmallestUnit = $pricing['final_price'] * 100;
            
            // Get Razorpay credentials
            $credentials = $this->getRazorpayCredentials();
            
            if (!$credentials['key'] || !$credentials['secret']) {
                throw new \Exception(__('Razorpay API credentials not found'));
            }
            
            $api = new Api($credentials['key'], $credentials['secret']);
            
            $orderData = [
                'receipt' => 'plan_' . $plan->id . '_' . time(),
                'amount' => (int)$amountInSmallestUnit,
                'currency' => $credentials['currency'],
                'notes' => [
                    'plan_id' => $plan->id,
                    'billing_cycle' => $request->billing_cycle,
                ]
            ];
            
            $razorpayOrder = $api->order->create($orderData);
            
            return response()->json([
                'order_id' => $razorpayOrder->id,
                'amount' => (int)$amountInSmallestUnit,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => __('Failed to create payment order: ') . $e->getMessage()], 500);
        }
    }
    
    /**
     * Verify Razorpay payment
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        try {
            $credentials = $this->getRazorpayCredentials();
            
            if (!$credentials['key'] || !$credentials['secret']) {
                throw new \Exception(__('Razorpay API credentials not found'));
            }
            
            $api = new Api($credentials['key'], $credentials['secret']);
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature' => $validated['razorpay_signature']
            ]);
            
            processPaymentSuccess([
                'user_id' => auth()->id(),
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'razorpay',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $validated['razorpay_payment_id'],
            ]);
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment verification failed: ') . $e->getMessage()], 500);
        }
    }
}