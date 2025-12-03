<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Plan;
use App\Models\User;
use App\Models\PlanOrder;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;
use MercadoPago\Payment;

class MercadoPagoController extends Controller
{
    /**
     * Get MercadoPago API credentials
     * 
     * @return array
     */
    private function getMercadoPagoCredentials()
    {
        $settings = getPaymentGatewaySettings();
                
        $accessToken = $settings['payment_settings']['mercadopago_access_token'] ?? null;
        return [
            'access_token' => $accessToken,
            'mode' => $settings['payment_settings']['mercadopago_mode'] ?? 'sandbox',
            'currency' => $settings['general_settings']['defaultCurrency'] ?? 'BRL'
        ];
    }

    /**
     * Create a MercadoPago checkout preference
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function createPreference(Request $request)
    {
        try {
            $request->validate([
                'plan_id' => 'required|exists:plans,id',
                'billing_cycle' => 'nullable|in:monthly,yearly',
                'coupon_code' => 'nullable|string',
            ]);
            
            // Support for both billing_cycle and coupon from form
            $billingCycle = $request->billing_cycle ?? 'monthly';
            $couponCode = $request->coupon_code ?? $request->coupon ?? null;

            $plan = Plan::findOrFail($request->plan_id);
            $amount = $plan->getPriceForCycle($billingCycle);
            
            // Apply coupon if provided
            if ($couponCode) {
                // Get coupon and apply discount
                $coupon = Coupon::where('code', strtoupper($couponCode))
                    ->where('is_active', '1')
                    ->first();
                    
                if ($coupon) {
                    $usedCoupon = $coupon->used_coupon();
                    if ($usedCoupon < $coupon->limit) {
                        if ($coupon->type == 'percentage') {
                            $discount = ($amount / 100) * $coupon->discount;
                        } else {
                            $discount = $coupon->discount;
                        }
                        
                        // Check min/max spend
                        if ($amount >= $coupon->minimum_spend && ($coupon->maximum_spend == 0 || $amount <= $coupon->maximum_spend)) {
                            $amount = $amount - $discount;
                        }
                    }
                }
            }
            
            // Get MercadoPago credentials
            $credentials = $this->getMercadoPagoCredentials();
            if (!$credentials['access_token']) {
                throw new \Exception(__('MercadoPago API credentials not found'));
            }
            
            // Initialize MercadoPago SDK
            try {
                $accessToken = $credentials['access_token'];
                
                // For MercadoPago, access tokens for API v1 should start with APP_USR- or TEST-
                if (empty($accessToken)) {
                    throw new \Exception(__('MercadoPago access token is empty'));
                }
                
                // Set the access token
                SDK::setAccessToken($accessToken);
                
                // Set SDK configurations
                SDK::setIntegratorId("dev_vcardgo");
            } catch (\Exception $e) {
                throw new \Exception(__('Failed to initialize MercadoPago SDK: :message', ['message' => $e->getMessage()]));
            }
            
            // Create preference
            $preference = new Preference();
            
            // Create item with required fields
            $item = new Item();
            $item->title = "Plan: " . $plan->name . " (" . $request->billing_cycle . ")";
            $item->quantity = 1;
            $item->unit_price = (float)$amount;
            $item->currency_id = $credentials['currency'];
            $item->id = "plan_" . $plan->id;
            
            $preference->items = [$item];
            
            // Set back URLs - use absolute URLs with proper route generation
            $preference->back_urls = [
                "success" => route('mercadopago.success'),
                "failure" => route('mercadopago.failure'),
                "pending" => route('mercadopago.pending')
            ];
            
            // Don't set auto_return as it's causing issues
            // $preference->auto_return = "approved";
            
            // Set external reference
            $externalReference = 'plan_' . $plan->id . '_' . auth()->id() . '_' . $billingCycle;
            if ($couponCode) {
                $externalReference .= '_coupon_' . $couponCode;
            }
            $preference->external_reference = $externalReference;
            
            // Set notification URL
            $preference->notification_url = route('mercadopago.webhook');
            
            // Set additional required fields
            $preference->binary_mode = true; // No pending status, only success or failure
            
            // Set payer information if available
            if (auth()->check()) {
                $payer = new \MercadoPago\Payer();
                $payer->name = auth()->user()->name;
                $payer->email = auth()->user()->email;
                $preference->payer = $payer;
            }
            
            // Save preference with better error handling
            try {
                $result = $preference->save();
                
                if (!$result) {
                    throw new \Exception(__('Failed to save MercadoPago preference'));
                }
            } catch (\Exception $e) {
                throw new \Exception(message: __('Failed to save MercadoPago preference:  :message', ['message' => $e->getMessage()]));
            }
            
            // Check if preference was created successfully
            if (!$preference->id) {
                throw new \Exception(__('MercadoPago preference was not created properly'));
            }
            
            // Determine redirect URL based on mode
            $redirectUrl = $credentials['mode'] === 'sandbox' ? $preference->sandbox_init_point : $preference->init_point;
            
            if (!$redirectUrl) {
                throw new \Exception(__('MercadoPago redirect URL is not available'));
            }
            
            // Return response based on request type
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'checkout_url' => $preference->init_point,
                    'sandbox_url' => $preference->sandbox_init_point,
                    'redirect_url' => $redirectUrl,
                    'preference_id' => $preference->id,
                    'mode' => $credentials['mode']
                ]);
            }
            
            // For form submissions, redirect directly
            return redirect($redirectUrl);
        } catch (\Exception $e) { 
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Failed to create payment preference:  :message', ['message' => $e->getMessage()])], 500);
            }            
            return redirect()->back()->with('error', __('Failed to create payment preference: :message', ['message' => $e->getMessage()]));
        }
    }
    
    /**
     * Handle successful payment for plans
     */
    public function success(Request $request, $plan_id = null, $coupon_id = null, $flag = null)
    {
        try {
            $paymentId = $request->payment_id;
            $status = $request->status ?? $flag;
            $externalReference = $request->external_reference;
            $preferenceId = $request->preference_id;
            
            // Handle plan.mercado.callback route
            if ($plan_id && $request->routeIs('plan.mercado.callback')) {
                $planId = $plan_id;
                $couponCode = $request->query('coupon_id');
                $status = $request->query('flag') ?? $flag;
            }
            
            // If we don't have plan_id from the route, try to get it from external reference
            if (!isset($planId) && $externalReference) {
                // Parse external reference
                $parts = explode('_', $externalReference);
                if (count($parts) < 4) {
                    return redirect()->route('plans.index')->with('error', __('Invalid payment reference format'));
                }
                
                $planId = (int)$parts[1];
                $userId = (int)$parts[2];
                $billingCycle = $parts[3];
                
                // Check if coupon was used
                if (count($parts) > 5 && $parts[4] === 'coupon') {
                    $couponCode = $parts[5];
                }
            } else if (!isset($planId)) {
                return redirect()->route('plans.index')->with('error', __('Invalid payment reference'));
            }
            
            // Set default values if not set
            $userId = $userId ?? auth()->id();
            $billingCycle = $billingCycle ?? 'monthly';
            
            // Verify user - skip for plan.mercado.callback route which might have a different user ID
            if ($userId !== auth()->id() && !request()->routeIs('plan.mercado.callback')) {
                return redirect()->route('plans.index')->with('error', __('Unauthorized payment reference'));
            }
            
            // Get plan
            $plan = Plan::find($planId);
            if (!$plan) {
                return redirect()->route('plans.index')->with('error', __('Plan not found'));
            }
            
            // Create plan order
            $planOrder = new PlanOrder();
            $planOrder->plan_id = $planId;
            $planOrder->user_id = $userId;
            $planOrder->payment_method = 'mercadopago';
            $planOrder->payment_id = $paymentId;
            $planOrder->amount = $plan->getPriceForCycle($billingCycle);
            $planOrder->billing_cycle = $billingCycle;
            $planOrder->status = 'completed';
            $planOrder->coupon_code = $couponCode ?? null;
            $planOrder->save();
            
            // Activate subscription
            $planOrder->activateSubscription();
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => __('Payment successful! Your subscription has been activated.')
                ]);
            }
            
            return redirect()->route('plans.index')->with('success', __('Payment successful! Your subscription has been activated.'));
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'error' => __('Failed to process payment: :message',['message' => $e->getMessage()])
                ], 500);
            }
            
            return redirect()->route('plans.index')->with('error', __('Failed to process payment: :message',['message' => $e->getMessage()]));
        }
    }
    
    /**
     * Handle failed payment
     */
    public function failure(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'error' => __('Payment failed. Please try again.')
            ], 400);
        }
        
        return redirect()->route('plans.index')->with('error', __('Payment failed. Please try again.'));
    }
    
    /**
     * Handle pending payment
     */
    public function pending(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'status' => 'pending',
                'message' => __('Your payment is pending. We will notify you once it is confirmed.')
            ]);
        }
        
        return redirect()->route('plans.index')->with('info', __('Your payment is pending. We will notify you once it is confirmed.'));
    }
    
    /**
     * Handle MercadoPago webhook notifications
     */
    public function webhook(Request $request)
    {        
        try {
            $data = $request->all();
            
            // Acknowledge receipt of the webhook
            return response()->json(['status' => 'success']);
            
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Process direct card payment
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'token' => 'required|string',
            'payment_method_id' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            
            // Get MercadoPago credentials
            $credentials = $this->getMercadoPagoCredentials();
            
            if (!$credentials['access_token']) {
                throw new \Exception(__('MercadoPago API credentials not found'));
            }
            
            // Initialize MercadoPago SDK
            try {                $accessToken = $credentials['access_token'];
                                
                SDK::setAccessToken($accessToken);
            } catch (\Exception $e) {
                throw new \Exception(__('Failed to initialize MercadoPago SDK: :message', ['message' => $e->getMessage()]));
            }
            
            $payment = new Payment();
            $payment->transaction_amount = (float)$pricing['final_price'];
            $payment->token = $validated['token'];
            $payment->description = "Plan: " . $plan->name;
            $payment->installments = 1;
            $payment->payment_method_id = $validated['payment_method_id'];
            $payment->payer = array("email" => auth()->user()->email);
            
            $payment->save();
            
            if ($payment->status == 'approved') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'] ?? 'monthly',
                    'payment_method' => 'mercadopago',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $payment->id,
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => __('Payment successful! Your subscription has been activated.')
                ]);
            } else if ($payment->status == 'in_process' || $payment->status == 'pending') {
                return response()->json([
                    'success' => true,
                    'status' => 'pending',
                    'message' => __('Your payment is being processed. We will notify you once it is confirmed.')
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => __('Payment failed: :status', ['status' => $payment->status_detail]) 
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => __('Failed to process payment: :message', ['message' => $e->getMessage()]) 
            ], 500);
        }
    }
}