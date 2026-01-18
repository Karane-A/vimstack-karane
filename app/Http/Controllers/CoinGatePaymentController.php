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
            
            // SECURITY FIX: Get order ID from request instead of session
            $orderId = $request->input('order_id') ?? $request->input('id');
            
            if (!$orderId) {
                // Fallback to session for backward compatibility
                $coingateData = session('coingate_data');
                if ($coingateData) {
                    $orderId = is_object($coingateData) ? $coingateData->order_id : $coingateData['order_id'];
                }
            }
            
            if (!$orderId) {
                Log::error('CoinGate callback: No order ID provided');
                return redirect()->route('plans.index')->with('error', 'Invalid payment callback');
            }
            
            $planOrder = PlanOrder::where('payment_id', $orderId)->first();
            
            if (!$planOrder) {
                Log::error('Plan order not found', ['order_id' => $orderId]);
                return redirect()->route('plans.index')->with('error', 'Order not found');
            }
            
            // SECURITY FIX: Verify payment status with CoinGate API
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['coingate_api_token'])) {
                Log::error('CoinGate API token not configured');
                return redirect()->route('plans.index')->with('error', 'Payment verification failed');
            }
            
            $client = new Client(
                $settings['payment_settings']['coingate_api_token'], 
                ($settings['payment_settings']['coingate_mode'] ?? 'sandbox') === 'sandbox'
            );
            
            // Verify order status with CoinGate API
            try {
                $coingateOrder = $client->order->get($orderId);
                
                if (!$coingateOrder) {
                    Log::error('CoinGate order not found on API', ['order_id' => $orderId]);
                    return redirect()->route('plans.index')->with('error', 'Payment verification failed');
                }
                
                // Verify order status
                if ($coingateOrder->status === 'paid' || $coingateOrder->status === 'confirmed') {
                    // Verify amount matches
                    $expectedAmount = number_format($planOrder->final_price, 2, '.', '');
                    $paidAmount = number_format($coingateOrder->price_amount, 2, '.', '');
                    
                    if ($expectedAmount !== $paidAmount) {
                        Log::error('CoinGate amount mismatch', [
                            'expected' => $expectedAmount,
                            'paid' => $paidAmount
                        ]);
                        return redirect()->route('plans.index')->with('error', 'Payment amount verification failed');
                    }
                    
                    // All verification passed - activate subscription
                    if ($planOrder->status !== 'approved') {
                        $planOrder->update([
                            'status' => 'approved',
                            'processed_at' => now()
                        ]);
                        
                        $planOrder->activateSubscription();
                        
                        Log::info('CoinGate payment verified and activated', [
                            'order_id' => $orderId,
                            'user_id' => $user->id,
                            'plan_id' => $planOrder->plan_id
                        ]);
                    }
                    
                    // Clear session
                    session()->forget('coingate_data');
                    
                    return redirect()->route('plans.index')->with('success', 'Plan activated successfully!');
                    
                } elseif ($coingateOrder->status === 'canceled' || $coingateOrder->status === 'expired') {
                    $planOrder->update(['status' => 'cancelled']);
                    return redirect()->route('plans.index')->with('error', 'Payment was cancelled or expired');
                } else {
                    // Payment still pending
                    return redirect()->route('plans.index')->with('info', 'Payment is still being processed. Please wait.');
                }
                
            } catch (\Exception $apiError) {
                Log::error('CoinGate API error: ' . $apiError->getMessage());
                return redirect()->route('plans.index')->with('error', 'Payment verification failed');
            }
            
        } catch (\Exception $e) {
            Log::error('CoinGate callback error: ' . $e->getMessage());
            return redirect()->route('plans.index')->with('error', 'Payment processing failed');
        }
    }
}