<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Cashfree\Cashfree;
use Cashfree\Model\CreateOrderRequest;
use Cashfree\Model\CustomerDetails;
use Cashfree\Model\OrderMeta;
use Cashfree\Api\OrdersApi;

class CashfreeController extends Controller
{
    /**
     * Get Cashfree API credentials and configuration
     * 
     * @return array
     */
    private function getCashfreeCredentials()
    {
        $settings = getPaymentGatewaySettings();
        
        $mode = $settings['payment_settings']['cashfree_mode'] ?? 'sandbox';
        $baseUrl = $mode === 'production' 
            ? 'https://api.cashfree.com/pg' 
            : 'https://sandbox.cashfree.com/pg';
        
        return [
            'app_id' => $settings['payment_settings']['cashfree_public_key'] ?? null,
            'secret_key' => $settings['payment_settings']['cashfree_secret_key'] ?? null,
            'mode' => $mode,
            'base_url' => $baseUrl,
            'currency' => $settings['general_settings']['defaultCurrency'] ?? 'INR'
        ];
    }

    /**
     * Create a Cashfree payment session
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPaymentSession(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            
            // Get Cashfree credentials
            $credentials = $this->getCashfreeCredentials();
            
            if (!$credentials['app_id'] || !$credentials['secret_key']) {
                throw new \Exception(__('Cashfree API credentials not found'));
            }
            $orderId = 'plan_' . $plan->id . '_' . time() . '_' . uniqid();
            
            // Configure Cashfree SDK
            $cashfree = new Cashfree(
                $credentials['mode'] === 'production' ? 1 : 0,
                $credentials['app_id'],
                $credentials['secret_key'],
                '',
                '',
                '',
                false
            );
            
            // Create customer details
            $customerDetails = new CustomerDetails();
            $customerDetails->setCustomerId('user_' . auth()->id());
            $customerDetails->setCustomerName(auth()->user()->name ?? 'Customer');
            $customerDetails->setCustomerEmail(auth()->user()->email ?? 'customer@example.com');
            $customerDetails->setCustomerPhone(auth()->user()->phone ?? '9999999999');
            
            // Create order meta
            $orderMeta = new OrderMeta();
            $orderMeta->setReturnUrl(route('dashboard'));
            $orderMeta->setNotifyUrl(route('cashfree.webhook'));
            
            // Create order request
            $orderRequest = new CreateOrderRequest();
            $orderRequest->setOrderId($orderId);
            $orderRequest->setOrderAmount($pricing['final_price']);
            $orderRequest->setOrderCurrency($credentials['currency']);
            $orderRequest->setCustomerDetails($customerDetails);
            $orderRequest->setOrderMeta($orderMeta);
            $orderRequest->setOrderNote('Plan Subscription - ' . $plan->name);
            $orderRequest->setOrderTags([
                'plan_id' => (string)$plan->id,
                'billing_cycle' => $request->billing_cycle,
                'user_id' => (string)auth()->id()
            ]);
            
            $apiResponse = $cashfree->PGCreateOrder($orderRequest);
            
            return response()->json([
                'payment_session_id' => $apiResponse[0]->getPaymentSessionId(),
                'order_id' => $orderId,
                'amount' => $pricing['final_price'],
                'currency' => $credentials['currency'],
                'mode' => $credentials['mode']
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => __('Failed to create payment session: ') . $e->getMessage()], 500);
        }
    }
    
    /**
     * Verify Cashfree payment
     *
     * @param  \Illuminate\\Http\\Request  $request
     * @return \Illuminate\\Http\\JsonResponse
     */
    public function verifyPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'order_id' => 'required|string',
            'cf_payment_id' => 'nullable|string'
        ]);

        try {
            $credentials = $this->getCashfreeCredentials();
            
            if (!$credentials['app_id'] || !$credentials['secret_key']) {
                throw new \Exception('Cashfree API credentials not found');
            }
            
            // Configure Cashfree SDK
            $cashfree = new Cashfree(
                $credentials['mode'] === 'production' ? 1 : 0,
                $credentials['app_id'],
                $credentials['secret_key'],
                '',
                '',
                '',
                false
            );
            $orderResponse = $cashfree->PGFetchOrder($validated['order_id']);
            
            if ($orderResponse[0]->getOrderStatus() !== 'PAID') {
                throw new \Exception(__('Payment not completed successfully'));
            }
            
            // Get payment details - response is array with payment objects
            $paymentsResponse = $cashfree->PGOrderFetchPayments($validated['order_id']);
            // Response structure: [payments_array, status_code, headers]
            if (is_array($paymentsResponse) && isset($paymentsResponse[0]) && is_array($paymentsResponse[0])) {
                $payments = $paymentsResponse[0]; // Direct array of payment objects
            } else {
                throw new \Exception(__('Invalid payment response structure'));
            }
            
            $successfulPayment = null;
            foreach ($payments as $payment) {
                // Payment is already an object from the SDK
                if ($payment->getPaymentStatus() === 'SUCCESS') {
                    $successfulPayment = $payment;
                    break;
                }
            }
            
            if (!$successfulPayment) {
                throw new \Exception(__('No successful payment found for this order'));
            }
            
            $paymentData = [
                'user_id' => auth()->id(),
                'plan_id' => $validated['plan_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'cashfree',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'payment_id' => $successfulPayment->getCfPaymentId(),
            ];
            
            $planOrder = processPaymentSuccess($paymentData);
            
            return response()->json(['success' => true]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment verification failed: ') . $e->getMessage()], 500);
        }
    }
    
    /**
     * Handle Cashfree webhook
     *
     * @param  \Illuminate\\Http\\Request  $request
     * @return \Illuminate\\Http\\JsonResponse
     */
    public function webhook(Request $request)
    {
        try {
            $credentials = $this->getCashfreeCredentials();
            
            // Verify webhook signature
            $signature = $request->header('x-webhook-signature');
            $timestamp = $request->header('x-webhook-timestamp');
            $rawBody = $request->getContent();
            
            $expectedSignature = base64_encode(hash_hmac('sha256', $timestamp . $rawBody, $credentials['secret_key'], true));
            
            if (!hash_equals($expectedSignature, $signature)) {
                return response()->json(['error' => 'Invalid signature'], 400);
            }
            
            $data = $request->json()->all();
            
            if ($data['type'] === 'PAYMENT_SUCCESS_WEBHOOK') {
                $paymentData = $data['data'];
                
                // Extract plan and user info from order tags
                $orderTags = $paymentData['order']['order_tags'] ?? [];
                
                if (isset($orderTags['plan_id']) && isset($orderTags['user_id'])) {
                    processPaymentSuccess([
                        'user_id' => $orderTags['user_id'],
                        'plan_id' => $orderTags['plan_id'],
                        'billing_cycle' => $orderTags['billing_cycle'] ?? 'monthly',
                        'payment_method' => 'cashfree',
                        'payment_id' => $paymentData['cf_payment_id'],
                    ]);
                }
            }
            
            return response()->json(['status' => 'success']);
            
        } catch (\Exception $e) {
            return response()->json(['error' => __('Webhook processing failed')], 500);
        }
    }
}