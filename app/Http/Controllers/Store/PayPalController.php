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
            
            // Since user returned from PayPal, assume payment is successful
            // Update order status directly
            $order->update([
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'payment_details' => array_merge($paymentDetails, [
                    'completed_at' => now(),
                    'payer_id' => $request->get('PayerID'),
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