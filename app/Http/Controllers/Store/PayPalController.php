<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class PayPalController extends Controller
{
    public function success(Request $request, $storeSlug, $orderNumber)
    {
        try {
            $order = Order::where('order_number', $orderNumber)->firstOrFail();
            
            // Get store owner's PayPal settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Store configuration error']);
            }
            
            $paypalConfig = getPaymentMethodConfig('paypal', $storeModel->user->id, $order->store_id);
            
            if (!$paypalConfig['enabled'] || !$paypalConfig['client_id'] || !$paypalConfig['secret']) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'PayPal is not configured']);
            }
            
            // Initialize PayPal provider
            // Use direct PayPal API calls
            $baseUrl = $paypalConfig['mode'] === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';
            
            // Get access token
            $tokenResponse = \Http::withBasicAuth($paypalConfig['client_id'], $paypalConfig['secret'])
                ->asForm()
                ->post($baseUrl . '/v1/oauth2/token', [
                    'grant_type' => 'client_credentials'
                ]);
            
            if (!$tokenResponse->successful()) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'PayPal authentication failed']);
            }
            
            $accessToken = $tokenResponse->json()['access_token'];
            
            // Capture PayPal order
            $paymentDetails = is_array($order->payment_details) ? $order->payment_details : json_decode($order->payment_details, true);
            $paypalOrderId = $paymentDetails['paypal_order_id'] ?? null;
            
            if (!$paypalOrderId) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Invalid PayPal order']);
            }
            
            // SECURITY FIX: Verify payment with PayPal API before confirming
            $captureResponse = \Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
            ])->post($baseUrl . '/v2/checkout/orders/' . $paypalOrderId . '/capture');
            
            if (!$captureResponse->successful()) {
                \Log::error('PayPal capture failed', [
                    'order_id' => $paypalOrderId,
                    'response' => $captureResponse->json()
                ]);
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Payment capture failed. Please try again.']);
            }
            
            $captureData = $captureResponse->json();
            
            // Verify payment was actually completed
            if ($captureData['status'] !== 'COMPLETED') {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Payment was not completed.']);
            }
            
            // Verify amount paid matches order amount
            $paidAmount = floatval($captureData['purchase_units'][0]['payments']['captures'][0]['amount']['value'] ?? 0);
            $expectedAmount = floatval($order->total_amount);
            
            if (abs($paidAmount - $expectedAmount) > 0.01) {
                \Log::error('PayPal amount mismatch', [
                    'expected' => $expectedAmount,
                    'paid' => $paidAmount,
                    'order' => $order->order_number
                ]);
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Payment amount verification failed.']);
            }
            
            // All verification passed - update order status
            $order->update([
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'confirmed_at' => $order->confirmed_at ?? now(),
                'payment_confirmed_at' => $order->payment_confirmed_at ?? now(),
                'payment_details' => array_merge($paymentDetails, [
                    'completed_at' => now(),
                    'payer_id' => $request->get('PayerID'),
                    'capture_id' => $captureData['purchase_units'][0]['payments']['captures'][0]['id'] ?? null,
                    'verified_amount' => $paidAmount,
                ]),
            ]);
            
            return redirect()->route('store.order-confirmation', [
                'storeSlug' => $storeSlug,
                'orderNumber' => $order->order_number
            ])->with('success', 'Payment completed successfully!');
            
        } catch (\Exception $e) {
            return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                ->withErrors(['error' => 'Payment verification failed: ' . $e->getMessage()]);
        }
    }
}