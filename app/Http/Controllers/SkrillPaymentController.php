<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use App\Models\Setting;
use App\Models\PlanOrder;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SkrillPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'transaction_id' => 'required|string',
            'email' => 'required|email',
        ]);

        try {
            // For plan subscriptions, always use superadmin settings
            $superAdminId = \App\Models\User::where('type', 'superadmin')->first()?->id;
            $settings = getPaymentMethodConfig('skrill', $superAdminId);
            
            if (!$settings['merchant_id'] || !$settings['secret_word']) {
                return back()->withErrors(['error' => __('Skrill not configured')]);
            }
            
            createPlanOrder([
                'user_id' => auth()->id(),
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'skrill',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $validated['transaction_id'],
                'status' => 'pending'
            ]);
            
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            
            $paymentData = [
                'pay_to_email' => $settings['merchant_id'],
                'transaction_id' => $validated['transaction_id'],
                'return_url' => route('plans.index'),
                'cancel_url' => route('plans.index'),
                'status_url' => route('skrill.callback'),
                'language' => 'EN',
                'amount' => $pricing['final_price'],
                'currency' => 'USD',
                'detail1_description' => 'Plan Subscription',
                'detail1_text' => $plan->name,
                'pay_from_email' => $validated['email']
            ];
            
            // Create form and auto-submit to Skrill
            $form = '<form id="skrill-form" method="POST" action="https://www.moneybookers.com/app/payment.pl">';
            foreach ($paymentData as $key => $value) {
                $form .= '<input type="hidden" name="' . $key . '" value="' . $value . '">';
            }
            $form .= '</form><script>document.getElementById("skrill-form").submit();</script>';
            
            return response($form);
        } catch (\Exception $e) {
            return handlePaymentError($e, 'skrill');
        }
    }
    
    public function callback(Request $request)
    {
        $transactionId = $request->input('transaction_id');
        $merchantId = $request->input('pay_to_email');
        $mbAmount = $request->input('mb_amount');
        $mbCurrency = $request->input('mb_currency');
        $status = $request->input('status');
        $md5sig = $request->input('md5sig');
        
        // SECURITY FIX: Verify MD5 signature per Skrill documentation
        $planOrder = PlanOrder::where('payment_id', $transactionId)->first();
        
        if (!$planOrder) {
            \Log::error('Skrill callback: Order not found', ['transaction_id' => $transactionId]);
            return response('Order not found', 404);
        }
        
        // Get Skrill settings for signature verification
        $superAdminId = \App\Models\User::where('type', 'superadmin')->first()?->id;
        $settings = getPaymentMethodConfig('skrill', $superAdminId);
        
        if (!$settings['merchant_id'] || !$settings['secret_word']) {
            \Log::error('Skrill not properly configured');
            return response('Configuration error', 500);
        }
        
        // Verify MD5 signature
        // Formula: MD5(merchant_id + transaction_id + MD5(secret_word) + mb_amount + mb_currency + status)
        $expectedSignature = md5(
            $merchantId . 
            $transactionId . 
            strtoupper(md5($settings['secret_word'])) . 
            $mbAmount . 
            $mbCurrency . 
            $status
        );
        
        if (strtoupper($md5sig) !== strtoupper($expectedSignature)) {
            \Log::error('Skrill callback: Invalid signature', [
                'transaction_id' => $transactionId,
                'received_sig' => $md5sig,
                'expected_sig' => $expectedSignature
            ]);
            return response('Invalid signature', 400);
        }
        
        // Verify amount matches
        $expectedAmount = number_format($planOrder->final_price, 2, '.', '');
        $receivedAmount = number_format($mbAmount, 2, '.', '');
        
        if ($expectedAmount !== $receivedAmount) {
            \Log::error('Skrill callback: Amount mismatch', [
                'expected' => $expectedAmount,
                'received' => $receivedAmount
            ]);
            return response('Amount mismatch', 400);
        }
        
        // All verification passed - process payment
        if ($status == '2') { // Payment processed
            if ($planOrder->status === 'pending') {
                $planOrder->update(['status' => 'approved']);
                $planOrder->activateSubscription();
                \Log::info('Skrill payment confirmed', ['order_id' => $planOrder->id]);
            }
        } elseif ($status == '-2') { // Failed
            $planOrder->update(['status' => 'cancelled']);
            \Log::info('Skrill payment failed', ['order_id' => $planOrder->id]);
        }
        
        return response('OK', 200);
    }
}