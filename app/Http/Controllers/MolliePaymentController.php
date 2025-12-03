<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Mollie\Api\MollieApiClient;

class MolliePaymentController extends Controller
{
    private function getMollieCredentials()
    {
        $settings = getPaymentGatewaySettings();
                
        return [
            'api_key' => $settings['payment_settings']['mollie_api_key'] ?? null,
            'currency' => $settings['general_settings']['defaultCurrency'] ?? 'EUR'
        ];
    }

    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string',
            'customer_details' => 'required|array',
            'customer_details.firstName' => 'required|string',
            'customer_details.lastName' => 'required|string', 
            'customer_details.email' => 'required|email'
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $credentials = $this->getMollieCredentials();
            
            if (!$credentials['api_key']) {
                return back()->withErrors(['error' => __('Mollie not configured')]);
            }
            
            $paymentId = 'mollie_' . $plan->id . '_' . time() . '_' . uniqid();
            
            // Create pending order
            createPlanOrder([
                'user_id' => auth()->id(),
                'plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'mollie',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $paymentId,
                'status' => 'pending'
            ]);
            
            // Initialize Mollie SDK
            $mollie = new MollieApiClient();
            $mollie->setApiKey($credentials['api_key']);
            
            $paymentData = [
                'amount' => [
                    'currency' => $credentials['currency'],
                    'value' => number_format($pricing['final_price'], 2, '.', '')
                ],
                'description' => 'Plan Subscription - ' . $plan->name,
                'redirectUrl' => route('mollie.success'),
                'metadata' => [
                    'payment_id' => $paymentId,
                    'plan_id' => $plan->id,
                    'user_id' => auth()->id(),
                    'billing_cycle' => $validated['billing_cycle']
                ]
            ];
            
            // Only add webhook URL if not localhost
            if (!str_contains(config('app.url'), 'localhost')) {
                $paymentData['webhookUrl'] = route('mollie.callback');
            }
            
            $payment = $mollie->payments->create($paymentData);
            
            // Update the plan order with the actual Mollie payment ID
            PlanOrder::where('payment_id', $paymentId)
                ->update(['payment_id' => $payment->id, 'notes' => __('Mollie Payment ID: ') . $payment->id]);
            
            return redirect($payment->getCheckoutUrl());
            
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Payment failed. Please try again.')]);
        }
    }

    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $credentials = $this->getMollieCredentials();
            
            if (!$credentials['api_key']) {
                throw new \Exception(__('Mollie API key not configured'));
            }
            
            $paymentId = 'mollie_' . $plan->id . '_' . time() . '_' . uniqid();
            
            // Create pending order
            createPlanOrder([
                'user_id' => auth()->id(),
                'plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'mollie',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $paymentId,
                'status' => 'pending'
            ]);
            
            // Initialize Mollie SDK
            $mollie = new MollieApiClient();
            $mollie->setApiKey($credentials['api_key']);
            
            $payment = $mollie->payments->create([
                'amount' => [
                    'currency' => $credentials['currency'],
                    'value' => number_format($pricing['final_price'], 2, '.', '')
                ],
                'description' => 'Plan Subscription - ' . $plan->name,
                'redirectUrl' => route('mollie.success'),
                'webhookUrl' => route('mollie.callback'),
                'metadata' => [
                    'payment_id' => $paymentId,
                    'plan_id' => $plan->id,
                    'user_id' => auth()->id(),
                    'billing_cycle' => $validated['billing_cycle']
                ]
            ]);
            
            // Update the plan order with the actual Mollie payment ID
            PlanOrder::where('payment_id', $paymentId)
                ->update(['payment_id' => $payment->id, 'notes' => 'Mollie Payment ID: ' . $payment->id]);
            
            return response()->json([
                'success' => true,
                'payment_id' => $payment->id,
                'checkout_url' => $payment->getCheckoutUrl()
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function checkPaymentStatus(Request $request)
    {
        $validated = $request->validate([
            'payment_id' => 'required|string'
        ]);
        
        try {
            $credentials = $this->getMollieCredentials();
            $mollie = new MollieApiClient();
            $mollie->setApiKey($credentials['api_key']);
            
            $payment = $mollie->payments->get($validated['payment_id']);
            
            return response()->json([
                'status' => $payment->status,
                'is_paid' => $payment->isPaid(),
                'is_failed' => $payment->isFailed(),
                'is_canceled' => $payment->isCanceled()
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function success(Request $request)
    {
        try {
            $credentials = $this->getMollieCredentials();
            
            if (!$credentials['api_key']) {
                return redirect()->route('plans.index')->with('error', 'Payment configuration error.');
            }
            
            // Find the most recent pending order for this user
            $userId = auth()->id();
            if ($userId) {
                $planOrder = PlanOrder::where('user_id', $userId)
                    ->where('status', 'pending')
                    ->where('payment_method', 'mollie')
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                if ($planOrder) {
                    $mollie = new MollieApiClient();
                    $mollie->setApiKey($credentials['api_key']);
                    
                    try {
                        $payment = $mollie->payments->get($planOrder->payment_id);
                        
                        if ($payment->isPaid()) {
                            $planOrder->update(['status' => 'approved']);
                            $planOrder->activateSubscription();
                            
                            return redirect()->route('plans.index')->with('success', __('Payment completed successfully! Your plan has been activated.'));
                        } elseif ($payment->status === 'pending') {
                            return redirect()->route('plans.index')->with('info', __('Payment is being processed. Your plan will be activated shortly.'));
                        } else {
                            return redirect()->route('plans.index')->with('error', __('Payment was not successful. Please try again.'));
                        }
                    } catch (\Exception $e) {
                        return redirect()->route('plans.index')->with('info', __('Payment is being processed. Your plan will be activated shortly.'));
                    }
                }
            }
            
            return redirect()->route('plans.index')->with('info', __('Payment is being processed. Your plan will be activated shortly.'));
            
        } catch (\Exception $e) {
            return redirect()->route('plans.index')->with('error', __('Payment verification failed. Please contact support.'));
        }
    }
    
    public function callback(Request $request)
    {
        try {
            $paymentId = $request->input('id');
            $credentials = $this->getMollieCredentials();
            
            $mollie = new MollieApiClient();
            $mollie->setApiKey($credentials['api_key']);
            
            $payment = $mollie->payments->get($paymentId);
                        
            if ($payment->isPaid()) {
                $planOrder = PlanOrder::where('payment_id', $paymentId)->first();
                
                if ($planOrder && $planOrder->status === 'pending') {
                    $planOrder->update(['status' => 'approved']);
                    $planOrder->activateSubscription();
                }
            }
            
            return response('OK', 200);
        } catch (\Exception $e) {
            return response('ERROR', 500);
        }
    }
}