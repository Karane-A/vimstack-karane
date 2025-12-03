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
        $status = $request->input('status');
        
        if ($status == '2') { // Payment processed
            $planOrder = PlanOrder::where('payment_id', $transactionId)->first();
            
            if ($planOrder && $planOrder->status === 'pending') {
                $planOrder->update(['status' => 'approved']);
                $planOrder->activateSubscription();
            }
        }
        
        return response('OK', 200);
    }
}