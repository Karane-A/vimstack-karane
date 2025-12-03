<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanOrder;
use Illuminate\Http\Request;

class PayfastPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string',
            'customer_details' => 'required|array',
            'customer_details.firstName' => 'required|string',
            'customer_details.lastName' => 'required|string',
            'customer_details.email' => 'required|email',
        ]);

        try {
            // For plan subscriptions, always use superadmin settings
            $superAdminId = \App\Models\User::where('type', 'superadmin')->first()?->id;
            if (!$superAdminId) {
                return response()->json(['success' => false, 'error' => __('PayFast not configured')]);
            }
            
            $settings = getPaymentMethodConfig('payfast', $superAdminId);
            $isLive = ($settings['mode'] ?? 'sandbox') === 'live';
            
            if (!$settings['merchant_id'] || !$settings['merchant_key']) {
                return response()->json(['success' => false, 'error' => __('PayFast not configured')]);
            }
            
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            
            if ($pricing['final_price'] < 5.00) {
                return response()->json(['success' => false, 'error' => __('Minimum amount is R5.00')]);
            }
            
            $paymentId = 'pf_' . $plan->id . '_' . time() . '_' . uniqid();
            
            createPlanOrder([
                'user_id' => auth()->id(),
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'payfast',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $paymentId,
                'status' => 'pending'
            ]);
            
            $data = [
                'merchant_id' => $settings['merchant_id'],
                'merchant_key' => $settings['merchant_key'],
                'return_url' => route('payfast.success'),
                'cancel_url' => route('plans.index'),
                'notify_url' => route('payfast.callback'),
                'name_first' => $validated['customer_details']['firstName'],
                'name_last' => $validated['customer_details']['lastName'],
                'email_address' => $validated['customer_details']['email'],
                'm_payment_id' => $paymentId,
                'amount' => number_format($pricing['final_price'], 2, '.', ''),
                'item_name' => $plan->name,
            ];
            
            $passphrase = $settings['passphrase'] ?? '';
            $signature = $this->generateSignature($data, $passphrase);
            $data['signature'] = $signature;
            
            $htmlForm = '';
            foreach ($data as $name => $value) {
                $htmlForm .= '<input name="' . $name . '" type="hidden" value="' . $value . '" />';
            }
            
            $endpoint = $isLive 
                ? 'https://www.payfast.co.za/eng/process' 
                : 'https://sandbox.payfast.co.za/eng/process';
            
            return response()->json([
                'success' => true,
                'inputs' => $htmlForm,
                'action' => $endpoint
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => __('Payment failed')]);
        }
    }
    
    public function generateSignature($data, $passPhrase = null)
    {
        $pfOutput = '';
        foreach ($data as $key => $val) {
            if ($val !== '') {
                $pfOutput .= $key . '=' . urlencode(trim($val)) . '&';
            }
        }
        
        $getString = substr($pfOutput, 0, -1);
        if ($passPhrase !== null) {
            $getString .= '&passphrase=' . urlencode(trim($passPhrase));
        }
        return md5($getString);
    }
        
    public function callback(Request $request)
    {
        try {
            // For plan subscriptions, always use superadmin settings
            $superAdminId = \App\Models\User::where('type', 'superadmin')->first()?->id;
            if (!$superAdminId) {
                return response(__('PayFast not configured'), 400);
            }
            
            $settings = getPaymentMethodConfig('payfast', $superAdminId);
                        
            // Get callback data
            $pfData = $request->all();
            $paymentId = $pfData['m_payment_id'] ?? null;
            $paymentStatus = $pfData['payment_status'] ?? null;
            
            if (!$paymentId) {
                return response(__('Missing payment ID'), 400);
            }
            
            // Find the plan order
            $planOrder = PlanOrder::where('payment_id', $paymentId)->first();
            
            if (!$planOrder) {
                return response(__('Order not found'), 404);
            }
            
            // Verify signature
            if (!$this->verifyPayfastSignature($pfData, $settings['passphrase'] ?? '')) {
                return response(__('Invalid signature'), 400);
            }
            
            // Verify amount
            if (!$this->verifyAmount($pfData, $planOrder)) {
                return response(__('Amount mismatch'), 400);
            }
            
            // Process payment based on status
            if ($paymentStatus === 'COMPLETE') {
                if ($planOrder->status === 'pending') {
                    // Update order status
                    $planOrder->update([
                        'status' => 'approved',
                        'processed_at' => now()
                    ]);
                    
                    // Assign plan to user
                    $user = $planOrder->user;
                    $plan = $planOrder->plan;
                    $expiresAt = $planOrder->billing_cycle === 'yearly' ? now()->addYear() : now()->addMonth();
                    
                    $user->update([
                        'plan_id' => $plan->id,
                        'plan_expires_at' => $expiresAt,
                    ]);
                }
            } else {                
                if (in_array($paymentStatus, ['CANCELLED', 'FAILED'])) {
                    $planOrder->update(['status' => 'rejected']);
                }
            }
            
            return response('OK', 200);
        } catch (\Exception $e) {
            return response('ERROR', 500);
        }
    }
    
    
    private function verifyPayfastSignature($pfData, $passphrase = '')
    {
        $signature = $pfData['signature'] ?? '';
        unset($pfData['signature']);
        
        $expectedSignature = $this->generateSignature($pfData, $passphrase);
        
        return hash_equals($expectedSignature, $signature);
    }
    
    private function verifyAmount($pfData, $planOrder)
    {
        $receivedAmount = floatval($pfData['amount_gross'] ?? 0);
        $expectedAmount = floatval($planOrder->final_price);
        
        // Allow small floating point differences
        return abs($receivedAmount - $expectedAmount) < 0.01;
    }

    public function success(Request $request)
    {
        // Try different parameter names PayFast might use
        $paymentId = $request->get('m_payment_id') ?? $request->get('pf_payment_id') ?? $request->get('payment_id');
        
        if (!$paymentId && auth()->check()) {
            // If no payment ID, find the most recent pending order for this user
            $planOrder = PlanOrder::where('user_id', auth()->id())
                ->where('payment_method', 'payfast')
                ->where('status', 'pending')
                ->orderBy('created_at', 'desc')
                ->first();
        } else {
            $planOrder = PlanOrder::where('payment_id', $paymentId)->first();
        }
        
        if ($planOrder) {
            // Always process the payment on success return
            $planOrder->update([
                'status' => 'approved',
                'processed_at' => now()
            ]);
            
            // Assign plan to user
            $user = $planOrder->user;
            $plan = $planOrder->plan;
            $expiresAt = $planOrder->billing_cycle === 'yearly' ? now()->addYear() : now()->addMonth();
            
            $user->update([
                'plan_id' => $plan->id,
                'plan_expires_at' => $expiresAt,
            ]);
            
            return redirect()->route('plans.index')->with('success', __('Payment completed and plan activated!'));
        }
        
        return redirect()->route('plans.index')->with('error', __('Payment verification failed'));
    }
}