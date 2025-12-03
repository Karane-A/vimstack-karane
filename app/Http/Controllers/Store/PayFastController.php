<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class PayFastController extends Controller
{
    public function success(Request $request, $storeSlug, $orderNumber)
    {
        try {
            $order = Order::where('order_number', $orderNumber)->firstOrFail();
            
            // Get store owner's PayFast settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Store configuration error']);
            }
            
            $payfastConfig = getPaymentMethodConfig('payfast', $storeModel->user->id, $order->store_id);
            
            if (!$payfastConfig['enabled'] || !$payfastConfig['merchant_id'] || !$payfastConfig['merchant_key']) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'PayFast is not configured']);
            }
            
            // Get PayFast parameters
            $paymentId = $request->get('m_payment_id') ?? $request->get('pf_payment_id') ?? $request->get('payment_id');
            $paymentStatus = $request->get('payment_status');
            
            // Verify this is actually a successful payment
            if (!$paymentId) {
                // No payment ID means user returned without completing payment
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Payment was not completed. Please try again.']);
            }
            
            // Find order by payment transaction ID
            $order = Order::where('payment_transaction_id', $paymentId)->first();
            
            if (!$order) {
                return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                    ->withErrors(['error' => 'Order not found']);
            }
            
            // Only update if payment is actually successful and order is still pending
            if ($order->payment_status === 'pending') {
                // Verify payment status if provided
                if ($paymentStatus && $paymentStatus !== 'COMPLETE') {
                    return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                        ->withErrors(['error' => 'Payment was not successful. Status: ' . $paymentStatus]);
                }
                
                // Update order as paid (callback will handle final verification)
                $order->update([
                    'status' => 'confirmed',
                    'payment_status' => 'paid',
                    'payment_details' => array_merge($order->payment_details ?? [], [
                        'completed_at' => now(),
                        'payment_id' => $paymentId,
                        'return_status' => $paymentStatus,
                    ]),
                ]);
            }
            
            return redirect()->route('store.order-confirmation', [
                'storeSlug' => $storeSlug,
                'orderNumber' => $order->order_number
            ])->with('success', 'Payment completed successfully!');
                
        } catch (\Exception $e) {
            return redirect()->route('store.checkout', ['storeSlug' => $storeSlug])
                ->withErrors(['error' => 'Payment verification failed: ' . $e->getMessage()]);
        }
    }
    
    public function callback(Request $request)
    {
        try {
            // Get callback data
            $pfData = $request->all();
            $paymentId = $pfData['m_payment_id'] ?? null;
            $paymentStatus = $pfData['payment_status'] ?? null;
            
            if (!$paymentId) {
                return response(__('Missing payment ID'), 400);
            }
            
            // Find the order
            $order = Order::where('payment_transaction_id', $paymentId)->first();
            
            if (!$order) {
                return response(__('Order not found'), 404);
            }
            
            // Get store owner's PayFast settings for verification
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return response(__('Store configuration error'), 400);
            }
            
            $payfastConfig = getPaymentMethodConfig('payfast', $storeModel->user->id, $order->store_id);
            
            // Verify signature
            if (!$this->verifyPayfastSignature($pfData, $payfastConfig['passphrase'] ?? '')) {
                return response(__('Invalid signature'), 400);
            }
            
            // Verify amount
            if (!$this->verifyAmount($pfData, $order)) {
                return response(__('Amount mismatch'), 400);
            }
            
            // Process payment based on status
            if ($paymentStatus === 'COMPLETE') {
                if (in_array($order->payment_status, ['pending', 'awaiting_payment'])) {
                    // Update order status to confirmed
                    $order->update([
                        'status' => 'confirmed',
                        'payment_status' => 'paid',
                        'payment_details' => array_merge($order->payment_details ?? [], [
                            'completed_at' => now(),
                            'callback_data' => $pfData,
                            'verified_by_callback' => true,
                        ]),
                    ]);
                }
            } else {                
                if (in_array($paymentStatus, ['CANCELLED', 'FAILED'])) {
                    // Cancel order and restore inventory
                    $orderService = app(\App\Services\OrderService::class);
                    $orderService->cancelOrder($order);
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
    
    private function generateSignature($data, $passPhrase = null)
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
    
    private function verifyAmount($pfData, $order)
    {
        $receivedAmount = floatval($pfData['amount_gross'] ?? 0);
        $expectedAmount = floatval($order->total_amount);
        
        // Allow small floating point differences
        return abs($receivedAmount - $expectedAmount) < 0.01;
    }
}