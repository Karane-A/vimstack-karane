<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use App\Models\PlanOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Paytabscom\Laravel_paytabs\Facades\paypage;

class PayTabsPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'payment_id' => 'required|string',
            'transaction_id' => 'required|string',
        ]);

        try {
            $superAdmin = User::where('type', 'superadmin')->first();
            $settings = getPaymentMethodConfig('paytabs', $superAdmin->id);
            
            if (empty($settings['profile_id']) || empty($settings['server_key'])) {
                return response()->json([
                    'success' => false,
                    'message' => __('PayTabs configuration incomplete.')
                ], 400);
            }
            
            $plan = Plan::findOrFail($validated['plan_id']);
            $user = auth()->user();
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $cartId = 'PT_' . time() . '_' . $user->id;
            
            createPlanOrder([
                'user_id' => $user->id,
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'paytabs',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $cartId,
                'status' => 'pending'
            ]);
            
            // Force PayTabs configuration
            config([
                'paytabs.profile_id' => $settings['profile_id'],
                'paytabs.server_key' => $settings['server_key'],
                'paytabs.region' => $settings['region'],
                'paytabs.currency' => 'INR'
            ]);
            
            $pay = paypage::sendPaymentCode('all')
                ->sendTransaction('sale', 'ecom')
                ->sendCart($cartId, $pricing['final_price'], "Plan Subscription - {$plan->name}")
                ->sendCustomerDetails(
                    $user->name,
                    $user->email,
                    $user->phone ?? '1234567890',
                    'Address',
                    'City',
                    'State',
                    'SA',
                    '12345',
                    request()->ip()
                )
                ->sendURLs(
                    route('paytabs.success') . '?cart_id=' . $cartId,
                    route('paytabs.callback')
                )
                ->sendLanguage('en')
                ->sendFramed(false)
                ->create_pay_page();
            
            if ($pay) {
                // Extract redirect URL from PayTabs response
                $redirectUrl = method_exists($pay, 'getTargetUrl') ? $pay->getTargetUrl() : (string)$pay;
                
                return response()->json([
                    'success' => true,
                    'redirect_url' => $redirectUrl
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => __('Payment initialization failed.')
            ], 400);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => __('Payment processing failed.')
            ], 500);
        }
    }
    
    public function callback(Request $request)
    {
        try {
            $cartId = $request->input('cartId') ?? $request->input('cart_id');
            $respStatus = $request->input('respStatus') ?? $request->input('resp_status');
            $tranRef = $request->input('tranRef') ?? $request->input('tran_ref');
            
            if (!$cartId) {
                return response(__('Missing cart ID'), 400);
            }
            
            $planOrder = PlanOrder::where('payment_id', $cartId)->first();
            
            if (!$planOrder) {
                return response(__('Order not found'), 404);
            }
            
            if ($respStatus === 'A') {
                if ($planOrder->status === 'pending') {
                    $updateData = ['status' => 'approved'];
                    if ($tranRef) {
                        $updateData['payment_id'] = $tranRef;
                    }
                    
                    $planOrder->update($updateData);
                    
                    $user = User::find($planOrder->user_id);
                    $plan = Plan::find($planOrder->plan_id);
                    
                    if ($user && $plan) {
                        assignPlanToUser($user, $plan, $planOrder->billing_cycle);
                    }
                }
            } else {
                $planOrder->update(['status' => 'failed']);
            }
            
            return response('OK', 200);
            
        } catch (\Exception $e) {
            return response(__('Callback processing failed'), 500);
        }
    }
    
    public function success(Request $request)
    { 
        // Try different parameter names PayTabs might use
        $cartId = $request->input('cart_id') 
               ?? $request->input('cartId') 
               ?? $request->input('merchant_reference')
               ?? $request->input('reference')
               ?? $request->input('order_id');      
        if ($cartId) {
            $planOrder = PlanOrder::where('payment_id', $cartId)->first();
            
            if ($planOrder) {
                // Verify payment status with PayTabs before assigning plan
                if ($planOrder->status === 'pending') {
                    try {
                        $superAdmin = User::where('type', 'superadmin')->first();
                        $settings = getPaymentMethodConfig('paytabs', $superAdmin->id);
                        
                        config([
                            'paytabs.profile_id' => $settings['profile_id'],
                            'paytabs.server_key' => $settings['server_key'],
                            'paytabs.region' => $settings['region'],
                            'paytabs.currency' => 'INR'
                        ]);
                        
                        // PayTabs only redirects to success URL on successful payment
                        $planOrder->update(['status' => 'approved']);
                        
                        $user = User::find($planOrder->user_id);
                        $plan = Plan::find($planOrder->plan_id);
                        
                        if ($user && $plan) {
                            assignPlanToUser($user, $plan, $planOrder->billing_cycle);
                        }
                        
                        return redirect()->route('plans.index')->with('success', __('Payment completed successfully!'));
                    } catch (\Exception $e) {
                        return redirect()->route('plans.index')->with('error', __('Payment verification failed.'));
                    }
                }
                
                return redirect()->route('plans.index')->with('success', __('Payment completed successfully!'));
            }
        }
        
        // No fallback - only assign plan with proper payment verification
        return redirect()->route('plans.index')->with('error', __('Payment verification failed.'));
    }
}