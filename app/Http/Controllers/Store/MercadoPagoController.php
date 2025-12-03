<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use MercadoPago\SDK;
use MercadoPago\Payment;

class MercadoPagoController extends Controller
{
    /**
     * Handle successful MercadoPago payment for store orders
     */
    public function success(Request $request, $storeSlug, $orderNumber)
    {
        try {
            // Find the store
            $store = Store::where('slug', $storeSlug)->firstOrFail();
            
            // Find the order
            $order = Order::where('order_number', $orderNumber)
                         ->where('store_id', $store->id)
                         ->firstOrFail();
            
            $paymentId = $request->payment_id;
            $status = $request->status;
            $externalReference = $request->external_reference;
            $preferenceId = $request->preference_id;
            
            // Verify the payment if we have payment_id
            if ($paymentId && $status === 'approved') {
                // Get store owner's MercadoPago settings
                $mercadopagoConfig = getPaymentMethodConfig('mercadopago', $store->user->id, $store->id);
                
                if ($mercadopagoConfig['enabled'] && $mercadopagoConfig['access_token']) {
                    try {
                        // Initialize MercadoPago SDK
                        SDK::setAccessToken($mercadopagoConfig['access_token']);
                        
                        // Get payment details
                        $payment = Payment::find_by_id($paymentId);
                        
                        if ($payment && $payment->status === 'approved') {
                            // Update order status
                            $order->update([
                                'status' => 'confirmed',
                                'payment_status' => 'paid',
                                'payment_transaction_id' => $paymentId,
                                'payment_details' => array_merge($order->payment_details ?? [], [
                                    'payment_id' => $paymentId,
                                    'preference_id' => $preferenceId,
                                    'external_reference' => $externalReference,
                                    'payment_method' => $payment->payment_method_id ?? 'mercadopago',
                                    'transaction_amount' => $payment->transaction_amount ?? $order->total_amount,
                                ]),
                            ]);
                            
                            return redirect()->route('store.order-confirmation', [
                                'storeSlug' => $storeSlug,
                                'orderNumber' => $orderNumber
                            ])->with('success', 'Payment successful! Your order has been confirmed.');
                        }
                    } catch (\Exception $e) {
                        Log::error('MercadoPago payment verification failed: ' . $e->getMessage());
                    }
                }
            }
            
            // If payment verification failed or status is not approved, still redirect to confirmation
            // but don't update order status (it will remain pending)
            return redirect()->route('store.order-confirmation', [
                'storeSlug' => $storeSlug,
                'orderNumber' => $orderNumber
            ])->with('info', 'Your payment is being processed. We will update your order status once confirmed.');
            
        } catch (\Exception $e) {
            Log::error('MercadoPago success handler error: ' . $e->getMessage());
            
            return redirect()->route('store.home', ['storeSlug' => $storeSlug])
                           ->with('error', 'There was an issue processing your payment. Please contact support.');
        }
    }
    
    /**
     * Handle MercadoPago webhook notifications for store orders
     */
    public function callback(Request $request)
    {
        try {
            $data = $request->all();
            Log::info('MercadoPago store webhook received', $data);
            
            // Handle different notification types
            if (isset($data['type']) && $data['type'] === 'payment') {
                $paymentId = $data['data']['id'] ?? null;
                
                if ($paymentId) {
                    // Find order by payment_id or external_reference
                    $order = Order::where('payment_transaction_id', $paymentId)
                                 ->orWhere(function($query) use ($data) {
                                     if (isset($data['external_reference'])) {
                                         $query->whereJsonContains('payment_details->external_reference', $data['external_reference']);
                                     }
                                 })
                                 ->first();
                    
                    if ($order && $order->store) {
                        // Get store owner's MercadoPago settings
                        $mercadopagoConfig = getPaymentMethodConfig('mercadopago', $order->store->user->id, $order->store_id);
                        
                        if ($mercadopagoConfig['enabled'] && $mercadopagoConfig['access_token']) {
                            // Initialize MercadoPago SDK
                            SDK::setAccessToken($mercadopagoConfig['access_token']);
                            
                            // Get payment details
                            $payment = Payment::find_by_id($paymentId);
                            
                            if ($payment) {
                                // Update order based on payment status
                                switch ($payment->status) {
                                    case 'approved':
                                        $order->update([
                                            'status' => 'confirmed',
                                            'payment_status' => 'paid',
                                            'payment_transaction_id' => $paymentId,
                                            'payment_details' => array_merge($order->payment_details ?? [], [
                                                'payment_id' => $paymentId,
                                                'payment_method' => $payment->payment_method_id,
                                                'transaction_amount' => $payment->transaction_amount,
                                                'status' => $payment->status,
                                            ]),
                                        ]);
                                        break;
                                        
                                    case 'rejected':
                                    case 'cancelled':
                                        $order->update([
                                            'status' => 'cancelled',
                                            'payment_status' => 'failed',
                                            'payment_details' => array_merge($order->payment_details ?? [], [
                                                'payment_id' => $paymentId,
                                                'status' => $payment->status,
                                                'status_detail' => $payment->status_detail,
                                            ]),
                                        ]);
                                        break;
                                        
                                    case 'pending':
                                    case 'in_process':
                                        $order->update([
                                            'payment_status' => 'pending',
                                            'payment_details' => array_merge($order->payment_details ?? [], [
                                                'payment_id' => $paymentId,
                                                'status' => $payment->status,
                                            ]),
                                        ]);
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            
            return response()->json(['status' => 'success']);
            
        } catch (\Exception $e) {
            Log::error('MercadoPago store webhook error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}