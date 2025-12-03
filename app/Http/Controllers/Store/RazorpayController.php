<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class RazorpayController extends Controller
{
    /**
     * Verify Razorpay payment for store orders
     */
    public function verifyPayment(Request $request, $storeSlug)
    {
        try {
            $request->validate([
                'razorpay_payment_id' => 'required|string',
                'razorpay_order_id' => 'required|string',
                'razorpay_signature' => 'required|string',
                'order_id' => 'required|integer',
            ]);

            $store = Store::where('slug', $storeSlug)->firstOrFail();
            $order = Order::where('id', $request->order_id)
                          ->where('store_id', $store->id)
                          ->firstOrFail();

            // Get Razorpay configuration
            $razorpayConfig = getPaymentMethodConfig('razorpay', $store->user->id, $store->id);
            
            if (!$razorpayConfig['enabled'] || !$razorpayConfig['key'] || !$razorpayConfig['secret']) {
                return response()->json(['error' => 'Razorpay is not configured for this store'], 400);
            }

            // Initialize Razorpay API
            $api = new Api($razorpayConfig['key'], $razorpayConfig['secret']);

            // Verify payment signature
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ]);

            // Update order status
            $order->update([
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'payment_details' => array_merge($order->payment_details ?? [], [
                    'razorpay_payment_id' => $request->razorpay_payment_id,
                    'razorpay_signature' => $request->razorpay_signature,
                    'verified_at' => now(),
                ])
            ]);

            Log::info('Store order payment verified', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'payment_id' => $request->razorpay_payment_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully',
                'order_number' => $order->order_number
            ]);

        } catch (\Razorpay\Api\Errors\SignatureVerificationError $e) {
            Log::error('Razorpay signature verification failed', [
                'error' => $e->getMessage(),
                'order_id' => $request->order_id ?? null
            ]);
            return response()->json(['error' => 'Payment verification failed'], 400);
        } catch (\Exception $e) {
            Log::error('Razorpay payment verification error', [
                'error' => $e->getMessage(),
                'order_id' => $request->order_id ?? null
            ]);
            return response()->json(['error' => 'Payment verification failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Handle Razorpay webhook for store orders
     */
    public function webhook(Request $request)
    {
        try {
            $payload = $request->getContent();
            $signature = $request->header('X-Razorpay-Signature');
            
            // Note: Webhook verification would need store-specific secret
            // For now, we'll just log the webhook
            Log::info('Razorpay webhook received', [
                'payload' => $payload,
                'signature' => $signature
            ]);

            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            Log::error('Razorpay webhook error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }
}