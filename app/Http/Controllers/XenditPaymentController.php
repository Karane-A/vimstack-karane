<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanOrder;
use Illuminate\Http\Request;

class XenditPaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['xendit_api_key'])) {
                return response()->json(['error' => __('Xendit not configured')], 400);
            }

            $user = auth()->user();
            $externalId = 'plan_' . $plan->id . '_' . $user->id . '_' . time();

            $invoiceData = [
                'external_id' => $externalId,
                'amount' => $pricing['final_price'],
                'description' => 'Plan Subscription: ' . $plan->name,
                'invoice_duration' => 86400,
                'currency' => 'PHP',
                'customer' => [
                    'given_names' => $user->name ?? 'Customer',
                    'email' => $user->email
                ],
                'success_redirect_url' => route('xendit.success', [
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'coupon_code' => $validated['coupon_code'] ?? ''
                ]),
                'failure_redirect_url' => route('plans.index')
            ];

            $response = \Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode($settings['payment_settings']['xendit_api_key'] . ':'),
                'Content-Type' => 'application/json'
            ])->post('https://api.xendit.co/v2/invoices', $invoiceData);

            if ($response->successful()) {
                $result = $response->json();
                if (isset($result['invoice_url'])) {
                    return response()->json([
                        'success' => true,
                        'payment_url' => $result['invoice_url'],
                        'external_id' => $externalId
                    ]);
                }
            }

            return response()->json(['error' => $response->body()], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment creation failed')], 500);
        }
    }

    public function success(Request $request)
    {
        try {
            $planId = $request->input('plan_id');
            $userId = $request->input('user_id');
            $billingCycle = $request->input('billing_cycle', 'monthly');
            $couponCode = $request->input('coupon_code');
            
            if ($planId && $userId) {
                $plan = Plan::find($planId);
                $user = \App\Models\User::find($userId);
                
                if ($plan && $user) {
                    processPaymentSuccess([
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'billing_cycle' => $billingCycle,
                        'payment_method' => 'xendit',
                        'coupon_code' => $couponCode,
                        'payment_id' => $request->input('external_id', 'xendit_' . time()),
                    ]);
                    
                    if (!auth()->check()) {
                        auth()->login($user);
                    }
                    
                    return redirect()->route('plans.index')->with('success', __('Payment completed successfully and plan activated'));
                }
            }
            
            return redirect()->route('plans.index')->with('error', __('Payment verification failed'));
            
        } catch (\Exception $e) {
            return redirect()->route('plans.index')->with('error', __('Payment processing failed'));
        }
    }

    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'external_id' => 'required|string',
            'customer_details' => 'required|array',
        ]);

        try {
            // For plan subscriptions, always use superadmin settings
            $superAdminId = \App\Models\User::where('type', 'superadmin')->first()?->id;
            $settings = getPaymentMethodConfig('xendit', $superAdminId);
            
            if (!$settings['api_key']) {
                return back()->withErrors(['error' => __('Xendit not configured')]);
            }
            
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            
            createPlanOrder([
                'user_id' => auth()->id(),
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'xendit',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $validated['external_id'],
                'status' => 'pending'
            ]);
            
            $invoiceData = [
                'external_id' => $validated['external_id'],
                'amount' => $pricing['final_price'],
                'description' => 'Plan Subscription - ' . $plan->name,
                'invoice_duration' => 86400,
                'customer' => [
                    'given_names' => $validated['customer_details']['firstName'],
                    'surname' => $validated['customer_details']['lastName'],
                    'email' => $validated['customer_details']['email']
                ],
                'customer_notification_preference' => [
                    'invoice_created' => ['email'],
                    'invoice_reminder' => ['email'],
                    'invoice_paid' => ['email']
                ],
                'success_redirect_url' => route('plans.index'),
                'failure_redirect_url' => route('plans.index')
            ];
            
            $response = \Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode($settings['secret_key'] . ':'),
                'Content-Type' => 'application/json'
            ])->post('https://api.xendit.co/v2/invoices', $invoiceData);
            
            if ($response->successful()) {
                $result = $response->json();
                if (isset($result['invoice_url'])) {
                    return redirect($result['invoice_url']);
                }
            }
            
            processPaymentSuccess([
                'user_id' => auth()->id(),
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'xendit',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $validated['external_id'],
            ]);
            
            return redirect()->route('plans.index')->with('success', 'Xendit payment completed (Demo)');
        } catch (\Exception $e) {
            return handlePaymentError($e, 'xendit');
        }
    }
    
    public function callback(Request $request)
    {
        $externalId = $request->input('external_id');
        $status = $request->input('status');
        
        if ($status === 'PAID') {
            $planOrder = PlanOrder::where('payment_id', $externalId)->first();
            
            if ($planOrder && $planOrder->status === 'pending') {
                $planOrder->update(['status' => 'approved']);
                $planOrder->activateSubscription();
            }
        }
        
        return response('OK', 200);
    }
}