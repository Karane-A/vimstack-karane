<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use YooKassa\Client;

class YooKassaPaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['yookassa_shop_id'])) {
                return response()->json(['error' => 'YooKassa not configured'], 400);
            }

            $client = new Client();
            $client->setAuth((int)$settings['payment_settings']['yookassa_shop_id'], $settings['payment_settings']['yookassa_secret_key']);
            
            $orderID = strtoupper(str_replace('.', '', uniqid('', true)));
            $user = auth()->user();
            
            $payment = $client->createPayment([
                'amount' => [
                    'value' => number_format($pricing['final_price'], 2, '.', ''),
                    'currency' => 'RUB',
                ],
                'confirmation' => [
                    'type' => 'redirect',
                    'return_url' => route('yookassa.success', [
                        'plan_id' => $plan->id, 
                        'order_id' => $orderID, 
                        'billing_cycle' => $validated['billing_cycle'],
                        'coupon_code' => $validated['coupon_code'] ?? null
                    ]),
                ],
                'capture' => true,
                'description' => 'Plan: ' . $plan->name,
                'metadata' => [
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'order_id' => $orderID
                ]
            ], uniqid('', true));

            if ($payment['confirmation']['confirmation_url'] != null) {
                return response()->json([
                    'success' => true,
                    'payment_url' => $payment['confirmation']['confirmation_url'],
                    'payment_id' => $payment['id']
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
        try {
            $planId = $request->input('plan_id');
            $billingCycle = $request->input('billing_cycle');
            $couponCode = $request->input('coupon_code');
            $orderId = $request->input('order_id');
            
            if ($planId && $orderId) {
                $plan = Plan::find($planId);
                
                // Find user by session or create temporary assignment
                $user = null;
                if (auth()->check()) {
                    $user = auth()->user();
                } else {
                    // Try to find user from recent plan orders
                    $recentOrder = \App\Models\PlanOrder::where('payment_id', 'like', '%' . substr($orderId, -8))
                        ->where('created_at', '>=', now()->subHours(1))
                        ->first();
                    if ($recentOrder) {
                        $user = \App\Models\User::find($recentOrder->user_id);
                    }
                }
                
                if ($plan && $user) {
                    // Assign plan to user immediately
                    $user->plan_id = $plan->id;
                    $user->plan_expire_date = $billingCycle === 'yearly' ? now()->addYear() : now()->addMonth();
                    $user->save();
                    
                    // Create plan order record
                    processPaymentSuccess([
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'billing_cycle' => $billingCycle,
                        'payment_method' => 'yookassa',
                        'coupon_code' => $couponCode,
                        'payment_id' => $orderId,
                    ]);
                    
                    return redirect()->route('plans.index')->with('success', 'Payment successful and plan activated');
                }
            }
            return redirect()->route('plans.index')->with('error', __('Payment verification failed'));
        } catch (\Exception $e) {
            return redirect()->route('plans.index')->with('error', __('Payment processing failed'));
        }
    }

    public function callback(Request $request)
    {
        try {
            $paymentId = $request->input('object.id');
            $status = $request->input('object.status');
            $metadata = $request->input('object.metadata');
            
            if ($paymentId && $status === 'succeeded' && $metadata) {
                $planId = $metadata['plan_id'];
                $userId = $metadata['user_id'];
                
                $plan = Plan::find($planId);
                $user = \App\Models\User::find($userId);
                
                if ($plan && $user) {
                    // Assign plan to user
                    $user->plan_id = $plan->id;
                    $user->plan_expire_date = $metadata['billing_cycle'] === 'yearly' ? now()->addYear() : now()->addMonth();
                    $user->save();
                    
                    processPaymentSuccess([
                        'user_id' => $user->id,
                        'plan_id' => $plan->id,
                        'billing_cycle' => $metadata['billing_cycle'] ?? 'monthly',
                        'payment_method' => 'yookassa',
                        'coupon_code' => $metadata['coupon_code'] ?? null,
                        'payment_id' => $paymentId,
                    ]);
                }
            }
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => __('Callback processing failed')], 500);
        }
    }
}