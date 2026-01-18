<?php

namespace App\Services;

use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Checkout\Session;
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;
use MercadoPago\Payer;

class OrderService
{
    public function createOrder(array $orderData, array $cartItems): Order
    {
        return DB::transaction(function () use ($orderData, $cartItems) {
            // For PayFast, create order with awaiting_payment status to prevent premature completion
            $initialStatus = $orderData['payment_method'] === 'payfast' ? 'awaiting_payment' : 'pending';
            $initialPaymentStatus = $orderData['payment_method'] === 'payfast' ? 'awaiting_payment' : 'pending';
            
            // Get or create customer record
            $customerId = Auth::guard('customer')->id();
            
            if (!$customerId) {
                // Guest checkout - find or create customer
                $customer = Customer::where('store_id', $orderData['store_id'])
                    ->where('email', $orderData['customer_email'])
                    ->first();
                
                if (!$customer) {
                    // Create new customer record for guest
                    $customer = Customer::create([
                        'store_id' => $orderData['store_id'],
                        'first_name' => $orderData['customer_first_name'],
                        'last_name' => $orderData['customer_last_name'],
                        'email' => $orderData['customer_email'],
                        'phone' => $orderData['customer_phone'] ?? null,
                        'is_active' => true,
                        'customer_group' => 'guest',
                        'password' => null, // Guest customers don't have passwords
                    ]);
                }
                
                $customerId = $customer->id;
            }
            
            // Create the order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'store_id' => $orderData['store_id'],
                'customer_id' => $customerId,
                'session_id' => session()->getId(),
                'status' => $initialStatus,
                'payment_status' => $initialPaymentStatus,
                
                // Customer info
                'customer_email' => $orderData['customer_email'],
                'customer_phone' => $orderData['customer_phone'],
                'customer_first_name' => $orderData['customer_first_name'],
                'customer_last_name' => $orderData['customer_last_name'],
                
                // Shipping address
                'shipping_address' => $orderData['shipping_address'],
                'shipping_city' => $orderData['shipping_city'],
                'shipping_state' => $orderData['shipping_state'],
                'shipping_postal_code' => $orderData['shipping_postal_code'],
                'shipping_country' => $orderData['shipping_country'],
                
                // Billing address
                'billing_address' => $orderData['billing_address'],
                'billing_city' => $orderData['billing_city'],
                'billing_state' => $orderData['billing_state'],
                'billing_postal_code' => $orderData['billing_postal_code'],
                'billing_country' => $orderData['billing_country'],
                
                // Pricing
                'subtotal' => $orderData['subtotal'],
                'tax_amount' => $orderData['tax_amount'],
                'shipping_amount' => $orderData['shipping_amount'],
                'discount_amount' => $orderData['discount_amount'],
                'total_amount' => $orderData['total_amount'],
                
                // Payment info
                'payment_method' => $orderData['payment_method'],
                'payment_gateway' => $orderData['payment_gateway'] ?? null,
                
                // Shipping info
                'shipping_method_id' => $orderData['shipping_method_id'] ?? null,
                
                // Additional info
                'notes' => $orderData['notes'] ?? null,
                'coupon_code' => $orderData['coupon_code'] ?? null,
                'coupon_discount' => $orderData['coupon_discount'] ?? 0,
            ]);

            // Create order items and update inventory
            foreach ($cartItems as $cartItem) {
                $unitPrice = $cartItem['sale_price'] ?? $cartItem['price'];
                
                // Check and update product inventory
                $product = Product::find($cartItem['product_id']);
                if ($product) {
                    if ($product->stock < $cartItem['quantity']) {
                        throw new \Exception("Insufficient stock for product: {$cartItem['name']}");
                    }
                    
                    // Reduce product stock
                    $product->decrement('stock', $cartItem['quantity']);
                }
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem['product_id'],
                    'product_name' => $cartItem['name'],
                    'product_sku' => $cartItem['sku'] ?? null,
                    'product_price' => $cartItem['price'],
                    'quantity' => $cartItem['quantity'],
                    'product_variants' => $cartItem['variants'] ?? null,
                    'unit_price' => $unitPrice,
                    'total_price' => $unitPrice * $cartItem['quantity'],
                ]);
            }

            // Clear cart items after order creation
            $this->clearCart($orderData['store_id']);

            // Dispatch order created event for email notifications
            event(new OrderCreated($order));

            return $order;
        });
    }

    public function processPayment(Order $order, string $storeSlug = null): array
    {
        switch ($order->payment_method) {
            case 'cod':
                return $this->processCashOnDelivery($order);
            case 'stripe':
                return $this->processStripePayment($order, $storeSlug);
            case 'paypal':
                return $this->processPayPalPayment($order, $storeSlug);
            case 'payfast':
                return $this->processPayFastPayment($order, $storeSlug);
            case 'mercadopago':
                return $this->processMercadoPagoPayment($order, $storeSlug);
            case 'razorpay':
                return $this->processRazorpayPayment($order, $storeSlug);
            case 'cashfree':
                return $this->processCashfreePayment($order, $storeSlug);
            default:
                return ['success' => false, 'message' => 'Unsupported payment method: ' . $order->payment_method];
        }
    }

    private function processCashOnDelivery(Order $order): array
    {
        $order->update([
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_gateway' => 'cod',
        ]);

        return [
            'success' => true,
            'message' => 'Order placed successfully. Payment will be collected on delivery.',
            'order_id' => $order->id,
            'order_number' => $order->order_number,
        ];
    }


    private function processStripePayment(Order $order, string $storeSlug = null): array
    {
        try {
            // Get store owner's Stripe settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return ['success' => false, 'message' => 'Store configuration error'];
            }
            
            $stripeConfig = getPaymentMethodConfig('stripe', $storeModel->user->id, $order->store_id);
            
            if (!$stripeConfig['enabled'] || !$stripeConfig['secret']) {
                return ['success' => false, 'message' => 'Stripe is not configured for this store'];
            }
            
            Stripe::setApiKey($stripeConfig['secret']);
            
            // Create checkout session
            $checkoutSession = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => "Order #{$order->order_number}",
                        ],
                        'unit_amount' => intval($order->total_amount * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('store.stripe.success', ['storeSlug' => $storeSlug ?: $storeModel->slug, 'orderNumber' => $order->order_number]),
                'cancel_url' => route('store.checkout', ['storeSlug' => $storeSlug ?: $storeModel->slug]),
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'store_id' => $order->store_id,
                ],
            ]);
            
            $order->update([
                'payment_gateway' => 'stripe',
                'payment_transaction_id' => $checkoutSession->id,
                'payment_details' => [
                    'checkout_session_id' => $checkoutSession->id,
                ],
            ]);
            
            return [
                'success' => true,
                'message' => 'Stripe checkout session created',
                'checkout_url' => $checkoutSession->url,
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Stripe payment failed: ' . $e->getMessage()
            ];
        }
    }

    private function processPayPalPayment(Order $order, string $storeSlug = null): array
    {
        try {
            // Get store owner's PayPal settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return ['success' => false, 'message' => 'Store configuration error'];
            }
            
            $paypalConfig = getPaymentMethodConfig('paypal', $storeModel->user->id, $order->store_id);
            
            if (!$paypalConfig['enabled'] || !$paypalConfig['client_id'] || !$paypalConfig['secret']) {
                return ['success' => false, 'message' => 'PayPal is not configured for this store'];
            }
            
            // Use direct PayPal API calls
            $baseUrl = $paypalConfig['mode'] === 'live' ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';
            
            // Get access token
            $tokenResponse = \Http::withBasicAuth($paypalConfig['client_id'], $paypalConfig['secret'])
                ->asForm()
                ->post($baseUrl . '/v1/oauth2/token', [
                    'grant_type' => 'client_credentials'
                ]);
            
            if (!$tokenResponse->successful()) {
                return ['success' => false, 'message' => 'PayPal authentication failed'];
            }
            
            $accessToken = $tokenResponse->json()['access_token'];
            
            // Create PayPal order
            $orderResponse = \Http::withToken($accessToken)
                ->post($baseUrl . '/v2/checkout/orders', [
                    'intent' => 'CAPTURE',
                    'application_context' => [
                        'return_url' => url('/store/' . ($storeSlug ?: $storeModel->slug) . '/paypal/success/' . $order->order_number),
                        'cancel_url' => url('/store/' . ($storeSlug ?: $storeModel->slug) . '/checkout'),
                    ],
                    'purchase_units' => [
                        [
                            'amount' => [
                                'currency_code' => 'USD',
                                'value' => number_format($order->total_amount, 2, '.', ''),
                            ],
                            'description' => "Order #{$order->order_number}",
                        ]
                    ],
                ]);
            
            if (!$orderResponse->successful()) {
                return ['success' => false, 'message' => 'PayPal order creation failed: ' . $orderResponse->body()];
            }
            
            $paypalOrder = $orderResponse->json();
            
            if (isset($paypalOrder['id'])) {
                $order->update([
                    'payment_gateway' => 'paypal',
                    'payment_transaction_id' => $paypalOrder['id'],
                    'payment_details' => [
                        'paypal_order_id' => $paypalOrder['id'],
                    ],
                ]);
                
                // Get approval URL
                $approvalUrl = collect($paypalOrder['links'])->firstWhere('rel', 'approve')['href'] ?? null;
                
                return [
                    'success' => true,
                    'message' => 'PayPal order created successfully',
                    'checkout_url' => $approvalUrl,
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ];
            } else {
                return ['success' => false, 'message' => 'Failed to create PayPal order: ' . json_encode($paypalOrder)];
            }
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'PayPal payment failed: ' . $e->getMessage()
            ];
        }
    }

    private function processPayFastPayment(Order $order, string $storeSlug = null): array
    {
        try {
            // Get store owner's PayFast settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return ['success' => false, 'message' => 'Store configuration error'];
            }
            
            $payfastConfig = getPaymentMethodConfig('payfast', $storeModel->user->id, $order->store_id);
            
            if (!$payfastConfig['enabled'] || !$payfastConfig['merchant_id'] || !$payfastConfig['merchant_key']) {
                return ['success' => false, 'message' => 'PayFast is not configured for this store'];
            }
            
            if ($order->total_amount < 5.00) {
                return ['success' => false, 'message' => 'Minimum amount is R5.00'];
            }
            
            $paymentId = 'store_pf_' . $order->id . '_' . time() . '_' . uniqid();
            
            $data = [
                'merchant_id' => $payfastConfig['merchant_id'],
                'merchant_key' => $payfastConfig['merchant_key'],
                'return_url' => route('store.payfast.success', ['storeSlug' => $storeSlug ?: $storeModel->slug, 'orderNumber' => $order->order_number]),
                'cancel_url' => route('store.checkout', ['storeSlug' => $storeSlug ?: $storeModel->slug]),
                'notify_url' => route('store.payfast.callback'),
                'name_first' => $order->customer_first_name,
                'name_last' => $order->customer_last_name,
                'email_address' => $order->customer_email,
                'm_payment_id' => $paymentId,
                'amount' => number_format($order->total_amount, 2, '.', ''),
                'item_name' => "Order #{$order->order_number}",
            ];
            
            $passphrase = $payfastConfig['passphrase'] ?? '';
            $signature = $this->generatePayFastSignature($data, $passphrase);
            $data['signature'] = $signature;
            
            $order->update([
                'payment_gateway' => 'payfast',
                'payment_transaction_id' => $paymentId,
                'payment_details' => [
                    'payfast_payment_id' => $paymentId,
                ],
            ]);
            
            $htmlForm = '';
            foreach ($data as $name => $value) {
                $htmlForm .= '<input name="' . $name . '" type="hidden" value="' . $value . '" />';
            }
            
            $isLive = ($payfastConfig['mode'] ?? 'sandbox') === 'live';
            $endpoint = $isLive 
                ? 'https://www.payfast.co.za/eng/process' 
                : 'https://sandbox.payfast.co.za/eng/process';
            
            return [
                'success' => true,
                'message' => 'PayFast payment form created',
                'payfast_data' => $data,
                'payfast_endpoint' => $endpoint,
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'PayFast payment failed: ' . $e->getMessage()
            ];
        }
    }
    
    private function generatePayFastSignature($data, $passPhrase = null)
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

    private function processMercadoPagoPayment(Order $order, string $storeSlug = null): array
    {
        try {
            // Get store owner's MercadoPago settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return ['success' => false, 'message' => 'Store configuration error'];
            }
            
            $mercadopagoConfig = getPaymentMethodConfig('mercadopago', $storeModel->user->id, $order->store_id);
            
            if (!$mercadopagoConfig['enabled'] || !$mercadopagoConfig['access_token']) {
                return ['success' => false, 'message' => 'MercadoPago is not configured for this store'];
            }
            
            // Initialize MercadoPago SDK
            SDK::setAccessToken($mercadopagoConfig['access_token']);
            SDK::setIntegratorId("dev_vcardgo");
            
            // Create preference
            $preference = new Preference();
            
            // Create item
            $item = new Item();
            $item->title = "Order #{$order->order_number}";
            $item->quantity = 1;
            $item->unit_price = (float)$order->total_amount;
            $item->currency_id = $mercadopagoConfig['currency'] ?? ($mercadopagoConfig['mode'] === 'live' ? 'BRL' : 'BRL');
            $item->id = "order_" . $order->id;
            
            $preference->items = [$item];
            
            // Set back URLs
            $preference->back_urls = [
                "success" => route('store.mercadopago.success', ['storeSlug' => $storeSlug ?: $storeModel->slug, 'orderNumber' => $order->order_number]),
                "failure" => route('store.checkout', ['storeSlug' => $storeSlug ?: $storeModel->slug]),
                "pending" => route('store.mercadopago.success', ['storeSlug' => $storeSlug ?: $storeModel->slug, 'orderNumber' => $order->order_number])
            ];
            
            // Set external reference
            $preference->external_reference = 'store_order_' . $order->id . '_' . time();
            
            // Set notification URL
            $preference->notification_url = route('store.mercadopago.callback');
            
            // Set binary mode
            $preference->binary_mode = true;
            
            // Set payer information
            $payer = new Payer();
            $payer->name = $order->customer_first_name . ' ' . $order->customer_last_name;
            $payer->email = $order->customer_email;
            $preference->payer = $payer;
            
            // Save preference
            $result = $preference->save();
            
            if (!$result || !$preference->id) {
                return ['success' => false, 'message' => 'Failed to create MercadoPago preference'];
            }
            
            // Update order with payment details
            $order->update([
                'payment_gateway' => 'mercadopago',
                'payment_transaction_id' => $preference->id,
                'payment_details' => [
                    'preference_id' => $preference->id,
                ],
            ]);
            
            // Determine redirect URL based on mode
            $redirectUrl = ($mercadopagoConfig['mode'] ?? 'sandbox') === 'sandbox' 
                ? $preference->sandbox_init_point 
                : $preference->init_point;
            
            return [
                'success' => true,
                'message' => 'MercadoPago preference created successfully',
                'checkout_url' => $redirectUrl,
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'MercadoPago payment failed: ' . $e->getMessage()
            ];
        }
    }

    private function processRazorpayPayment(Order $order, string $storeSlug = null): array
    {
        try {
            // Get store owner's Razorpay settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return ['success' => false, 'message' => 'Store configuration error'];
            }
            
            $razorpayConfig = getPaymentMethodConfig('razorpay', $storeModel->user->id, $order->store_id);
            
            if (!$razorpayConfig['enabled'] || !$razorpayConfig['key'] || !$razorpayConfig['secret']) {
                return ['success' => false, 'message' => 'Razorpay is not configured for this store'];
            }
            
            // Initialize Razorpay API
            $api = new \Razorpay\Api\Api($razorpayConfig['key'], $razorpayConfig['secret']);
            
            // Generate unique order ID for Razorpay
            $razorpayOrderId = 'store_rp_' . $order->id . '_' . time() . '_' . uniqid();
            
            // Create Razorpay order
            $orderData = [
                'receipt' => $razorpayOrderId,
                'amount' => (int)($order->total_amount * 100), // Amount in paise
                'currency' => $razorpayConfig['currency'] ?? 'INR',
                'notes' => [
                    'store_order_id' => (string)$order->id,
                    'order_number' => $order->order_number,
                    'store_id' => (string)$order->store_id
                ]
            ];
            
            $razorpayOrder = $api->order->create($orderData);
            
            // Update order with Razorpay details
            $order->update([
                'payment_gateway' => 'razorpay',
                'payment_transaction_id' => $razorpayOrder->id,
                'payment_details' => [
                    'razorpay_order_id' => $razorpayOrder->id,
                    'receipt' => $razorpayOrderId,
                ],
            ]);
            
            return [
                'success' => true,
                'message' => 'Razorpay order created successfully',
                'razorpay_order_id' => $razorpayOrder->id,
                'amount' => (int)($order->total_amount * 100),
                'currency' => $razorpayConfig['currency'] ?? 'INR',
                'key_id' => $razorpayConfig['key'],
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Razorpay payment failed: ' . $e->getMessage()
            ];
        }
    }

    private function processCashfreePayment(Order $order, string $storeSlug = null): array
    {
        try {
            // Get store owner's Cashfree settings
            $storeModel = \App\Models\Store::find($order->store_id);
            if (!$storeModel || !$storeModel->user) {
                return ['success' => false, 'message' => 'Store configuration error'];
            }
            
            $cashfreeConfig = getPaymentMethodConfig('cashfree', $storeModel->user->id, $order->store_id);
            
            if (!$cashfreeConfig['enabled'] || !$cashfreeConfig['public_key'] || !$cashfreeConfig['secret_key']) {
                return ['success' => false, 'message' => 'Cashfree is not configured for this store'];
            }
            
            // Generate unique order ID for Cashfree
            $cashfreeOrderId = 'store_cf_' . $order->id . '_' . time() . '_' . uniqid();
            
            // Configure Cashfree SDK
            $cashfree = new \Cashfree\Cashfree(
                $cashfreeConfig['mode'] === 'production' ? 1 : 0,
                $cashfreeConfig['public_key'],
                $cashfreeConfig['secret_key'],
                '',
                '',
                '',
                false
            );
            
            // Create customer details
            $customerDetails = new \Cashfree\Model\CustomerDetails();
            $customerId = 'store_customer_' . ($order->customer_id ?: session()->getId());
            $customerDetails->setCustomerId(substr($customerId, 0, 50));
            $customerName = trim($order->customer_first_name . ' ' . $order->customer_last_name);
            $customerDetails->setCustomerName(substr($customerName, 0, 50));
            $customerDetails->setCustomerEmail($order->customer_email);
            $customerPhone = $order->customer_phone ?: '9999999999';
            $customerDetails->setCustomerPhone(strlen($customerPhone) >= 10 ? $customerPhone : '9999999999');
            
            // Create order meta
            $orderMeta = new \Cashfree\Model\OrderMeta();
            $orderMeta->setReturnUrl(route('store.order-confirmation', [
                'storeSlug' => $storeSlug ?: $storeModel->slug,
                'orderNumber' => $order->order_number
            ]));
            $orderMeta->setNotifyUrl(route('store.cashfree.webhook'));
            
            // Create order request
            $orderRequest = new \Cashfree\Model\CreateOrderRequest();
            $orderRequest->setOrderId($cashfreeOrderId);
            $orderRequest->setOrderAmount($order->total_amount);
            $orderRequest->setOrderCurrency($cashfreeConfig['currency'] ?? 'INR');
            $orderRequest->setCustomerDetails($customerDetails);
            $orderRequest->setOrderMeta($orderMeta);
            $orderRequest->setOrderNote('Store Order #' . $order->order_number);
            $orderRequest->setOrderTags([
                'store_order_id' => (string)$order->id,
                'order_number' => $order->order_number,
                'store_id' => (string)$order->store_id
            ]);
            
            $apiResponse = $cashfree->PGCreateOrder($orderRequest);
            
            if (!$apiResponse || !isset($apiResponse[0])) {
                return ['success' => false, 'message' => 'Failed to create Cashfree payment session'];
            }
            
            $paymentSession = $apiResponse[0];
            
            // Update order with Cashfree details
            $order->update([
                'payment_gateway' => 'cashfree',
                'payment_transaction_id' => $cashfreeOrderId,
                'payment_details' => [
                    'cashfree_order_id' => $cashfreeOrderId,
                    'payment_session_id' => $paymentSession->getPaymentSessionId(),
                ],
            ]);
            
            return [
                'success' => true,
                'message' => 'Cashfree payment session created successfully',
                'payment_session_id' => $paymentSession->getPaymentSessionId(),
                'cashfree_order_id' => $cashfreeOrderId,
                'mode' => $cashfreeConfig['mode'],
                'public_key' => $cashfreeConfig['public_key'],
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Cashfree payment failed: ' . $e->getMessage()
            ];
        }
    }

    private function clearCart(int $storeId): void
    {
        $query = CartItem::where('store_id', $storeId);
        
        if (Auth::guard('customer')->check()) {
            $query->where('customer_id', Auth::guard('customer')->id());
        } else {
            $query->where('session_id', session()->getId())
                  ->whereNull('customer_id');
        }
        
        $query->delete();
    }
    
    /**
     * Cancel order and restore inventory for failed payments
     */
    public function cancelOrder(Order $order): void
    {
        DB::transaction(function () use ($order) {
            // Restore product inventory
            foreach ($order->items as $orderItem) {
                $product = Product::find($orderItem->product_id);
                if ($product) {
                    $product->increment('stock', $orderItem->quantity);
                }
            }
            
            // Update order status
            $order->update([
                'status' => 'cancelled',
                'payment_status' => 'failed',
                'payment_details' => array_merge($order->payment_details ?? [], [
                    'cancelled_at' => now(),
                    'cancellation_reason' => 'Payment not completed'
                ])
            ]);
        });
    }
}