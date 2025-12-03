<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use App\Libraries\Coingate\Coingate;
use CoinGate\Client;
use Illuminate\Support\Facades\Log;

class CoinGatePaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string'
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $user = auth()->user();
            
            // Get payment settings exactly like reference project
            $settings = getPaymentGatewaySettings();
                 
            
            if (!$settings['payment_settings']['is_coingate_enabled'] || !$settings['payment_settings']['coingate_api_token']) {
                return redirect()->route('plans.index')->with('error', __('CoinGate payment is not available'));
            }
            
            if (!isset($settings['payment_settings']['coingate_api_token']) || empty($settings['payment_settings']['coingate_api_token'])) {
                return redirect()->route('plans.index')->with('error', __('CoinGate API token not configured'));
            }
            
            // Calculate price
            $price = $validated['billing_cycle'] === 'yearly' ? $plan->yearly_price : $plan->price;
            
            // Create plan order
            $orderId = time();
            $planOrder = PlanOrder::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'coingate',
                'coupon_code' => $validated['coupon_code'],
                'payment_id' => $orderId,
                'original_price' => $price,
                'final_price' => $price,
                'status' => 'pending'
            ]);
            
            // Use official CoinGate package
            $client = new Client(
                $settings['payment_settings']['coingate_api_token'], 
                ($settings['payment_settings']['coingate_mode'] ?? 'sandbox') === 'sandbox'
            );
            
            $orderParams = [
                'order_id' => $orderId,
                'price_amount' => $price,
                'price_currency' => $settings['general_settings']['defaultCurrency'] ?? 'USD',
                'receive_currency' => $settings['general_settings']['defaultCurrency'] ?? 'USD',
                'callback_url' => route('coingate.callback'),
                'cancel_url' => route('plans.index'),
                'success_url' => route('coingate.callback'),
                'title' => 'Plan #' . $orderId,
            ];
            
            $orderResponse = $client->order->create($orderParams);
            
            if ($orderResponse && isset($orderResponse->payment_url)) {
                // Store in session like reference project
                session(['coingate_data' => $orderResponse]);
                
                // Store gateway response
                $planOrder->payment_id = $orderResponse->order_id;
                $planOrder->save();
                
                return redirect($orderResponse->payment_url);
            } else {
                $planOrder->update(['status' => 'cancelled']);
                return redirect()->route('plans.index')->with('error', 'Payment initialization failed');
            }
            
        } catch (\Exception $e) {
            return redirect()->route('plans.index')->with('error', 'Payment failed: ' . $e->getMessage());
        }
    }
    
    public function callback(Request $request)
    {
        try {
            $user = auth()->user();
            $coingateData = session('coingate_data');
            
            if (!$coingateData) {
                Log::error('CoinGate data not found in session');
                return redirect()->route('plans.index')->with('error', 'Payment session expired');
            }
            
            $orderId = is_object($coingateData) ? $coingateData->order_id : $coingateData['order_id'];
            $planOrder = PlanOrder::where('payment_id', $orderId)->first();
            
            if (!$planOrder) {
                Log::error('Plan order not found', ['order_id' => $orderId]);
                return redirect()->route('plans.index')->with('error', 'Order not found');
            }
            
            // Mark as successful and activate subscription
            $planOrder->update([
                'status' => 'approved',
                'processed_at' => now()
            ]);
            
            $planOrder->activateSubscription();
            
            // Clear session
            session()->forget('coingate_data');
            
            Log::info('CoinGate payment successful', [
                'order_id' => $orderId,
                'user_id' => $user->id,
                'plan_id' => $planOrder->plan_id
            ]);
            
            return redirect()->route('plans.index')->with('success', 'Plan activated successfully!');
            
        } catch (\Exception $e) {
            Log::error('CoinGate callback error: ' . $e->getMessage());
            return redirect()->route('plans.index')->with('error', 'Payment processing failed');
        }
    }
}