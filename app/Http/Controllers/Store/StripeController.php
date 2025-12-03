<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripeController extends Controller
{
    public function success(Request $request, $storeSlug, $orderNumber)
    {
        try {
            $order = Order::where('order_number', $orderNumber)->firstOrFail();
            
            // Get store owner's Stripe settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Store configuration error']);
            }
            
            $stripeConfig = getPaymentMethodConfig('stripe', $storeModel->user->id, $order->store_id);
            
            if (!$stripeConfig['enabled'] || !$stripeConfig['secret']) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Stripe is not configured']);
            }
            
            Stripe::setApiKey($stripeConfig['secret']);
            
            // Retrieve checkout session
            $sessionId = $order->payment_details['checkout_session_id'] ?? null;
            if (!$sessionId) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Invalid payment session']);
            }
            
            $session = \Stripe\Checkout\Session::retrieve($sessionId);
            
            if ($session->payment_status === 'paid') {
                $order->update([
                    'status' => 'confirmed',
                    'payment_status' => 'paid',
                    'payment_details' => array_merge($order->payment_details ?? [], [
                        'payment_intent_id' => $session->payment_intent,
                        'amount_total' => $session->amount_total,
                        'payment_status' => $session->payment_status,
                    ]),
                ]);
                
                return redirect()->route('store.order-confirmation', [
                    'storeSlug' => $storeSlug,
                    'orderNumber' => $order->order_number
                ])->with('success', 'Payment completed successfully!');
            } else {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Payment was not completed']);
            }
            
        } catch (\Exception $e) {
            return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                ->withErrors(['error' => 'Payment verification failed: ' . $e->getMessage()]);
        }
    }
}