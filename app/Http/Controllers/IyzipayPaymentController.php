<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use App\Models\Setting;
use App\Models\PlanOrder;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Iyzipay\Options;
use Iyzipay\Model\CheckoutForm;
use Iyzipay\Model\CheckoutFormInitialize;
use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
use Iyzipay\Model\Locale;
use Iyzipay\Model\Currency;
use Iyzipay\Model\PaymentGroup;
use Iyzipay\Model\BasketItemType;
use Iyzipay\Model\BasketItem;
use Iyzipay\Model\Buyer;
use Iyzipay\Model\Address;
use Iyzipay\Request\RetrieveCheckoutFormRequest;

class IyzipayPaymentController extends Controller
{
    private function getIyzipayOptions($settings)
    {
        $options = new Options();
        $options->setApiKey($settings['iyzipay_public_key']);
        $options->setSecretKey($settings['iyzipay_secret_key']);
        $options->setBaseUrl($settings['iyzipay_mode'] === 'live' 
            ? 'https://api.iyzipay.com' 
            : 'https://sandbox-api.iyzipay.com');
        
        return $options;
    }

    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'token' => 'required|string',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['iyzipay_secret_key']) || !isset($settings['payment_settings']['iyzipay_public_key'])) {
                return back()->withErrors(['error' => __('Iyzipay not configured')]);
            }

            // Retrieve payment result from Iyzipay
            $paymentResult = $this->retrieveIyzipayPayment($validated['token'], $settings['payment_settings']);

            if ($paymentResult && $paymentResult->getPaymentStatus() === 'SUCCESS') {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'iyzipay',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $paymentResult->getPaymentId(),
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }

            return back()->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return handlePaymentError($e, 'iyzipay');
        }
    }

    public function createPaymentForm(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['iyzipay_secret_key']) || !isset($settings['payment_settings']['iyzipay_public_key'])) {
                return response()->json(['error' => __('Iyzipay not configured')], 400);
            }

            $user = auth()->user();
            $conversationId = 'plan_' . $plan->id . '_' . $user->id . '_' . time();
            $options = $this->getIyzipayOptions($settings['payment_settings']);

            // Create checkout form initialize request
            $checkoutRequest = new CreateCheckoutFormInitializeRequest();
            $checkoutRequest->setLocale(Locale::EN);
            $checkoutRequest->setConversationId($conversationId);
            $checkoutRequest->setPrice(number_format($pricing['final_price'], 2, '.', ''));
            $checkoutRequest->setPaidPrice(number_format($pricing['final_price'], 2, '.', ''));
            $checkoutRequest->setCurrency(Currency::USD);
            $checkoutRequest->setBasketId('plan_' . $plan->id);
            $checkoutRequest->setPaymentGroup(PaymentGroup::SUBSCRIPTION);
            $checkoutRequest->setCallbackUrl(route('iyzipay.callback'));
            $checkoutRequest->setEnabledInstallments([1]);

            // Set buyer information
            $buyer = new Buyer();
            $buyer->setId($user->id);
            $buyer->setName($user->name ?? 'Customer');
            $buyer->setSurname('User');
            $buyer->setGsmNumber('+1234567890');
            $buyer->setEmail($user->email);
            $buyer->setIdentityNumber('11111111111');
            $buyer->setLastLoginDate(now()->format('Y-m-d H:i:s'));
            $buyer->setRegistrationDate($user->created_at->format('Y-m-d H:i:s'));
            $buyer->setRegistrationAddress('123 Main Street');
            $buyer->setIp($request->ip());
            $buyer->setCity('New York');
            $buyer->setCountry('United States');
            $buyer->setZipCode('10001');
            $checkoutRequest->setBuyer($buyer);

            // Set shipping address
            $shippingAddress = new Address();
            $shippingAddress->setContactName($user->name ?? 'Customer User');
            $shippingAddress->setCity('New York');
            $shippingAddress->setCountry('United States');
            $shippingAddress->setAddress('123 Main Street');
            $shippingAddress->setZipCode('10001');
            $checkoutRequest->setShippingAddress($shippingAddress);

            // Set billing address
            $billingAddress = new Address();
            $billingAddress->setContactName($user->name ?? 'Customer User');
            $billingAddress->setCity('New York');
            $billingAddress->setCountry('United States');
            $billingAddress->setAddress('123 Main Street');
            $billingAddress->setZipCode('10001');
            $checkoutRequest->setBillingAddress($billingAddress);

            // Set basket items
            $basketItem = new BasketItem();
            $basketItem->setId($plan->id);
            $basketItem->setName($plan->name);
            $basketItem->setCategory1('Subscription');
            $basketItem->setItemType(BasketItemType::VIRTUAL);
            $basketItem->setPrice(number_format($pricing['final_price'], 2, '.', ''));
            $basketItems = [$basketItem];
            $checkoutRequest->setBasketItems($basketItems);

            // Initialize checkout form
            $checkoutFormInitialize = CheckoutFormInitialize::create($checkoutRequest, $options);

            if ($checkoutFormInitialize->getStatus() === 'success') {
                return response()->json([
                    'success' => true,
                    'redirect_url' => $checkoutFormInitialize->getPaymentPageUrl(),
                    'token' => $checkoutFormInitialize->getToken()
                ]);
            } else {
                return response()->json(['error' => $checkoutFormInitialize->getErrorMessage()], 400);
            }

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment form creation failed')], 500);
        }
    }

    public function callback(Request $request)
    {
        try {
            $token = $request->input('token');
            $settings = getPaymentGatewaySettings();
            
            if (!$token) {
                return redirect()->route('plans.index')->withErrors(['error' => __('Invalid payment response')]);
            }

            // Retrieve payment result from Iyzipay
            $paymentResult = $this->retrieveIyzipayPayment($token, $settings['payment_settings']);
            
            if ($paymentResult && $paymentResult->getPaymentStatus() === 'SUCCESS') {
                // Extract conversation ID to find the plan and user
                $conversationId = $paymentResult->getConversationId();
                $parts = explode('_', $conversationId);
                
                if (count($parts) >= 3) {
                    $planId = $parts[1];
                    $userId = $parts[2];
                    
                    $plan = Plan::find($planId);
                    $user = User::find($userId);
                    
                    if ($plan && $user) {
                        processPaymentSuccess([
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                            'billing_cycle' => 'monthly', // Default, should be stored in session or passed
                            'payment_method' => 'iyzipay',
                            'payment_id' => $paymentResult->getPaymentId(),
                        ]);
                        
                        return redirect()->route('plans.index')->with('success', __('Payment successful! Your plan has been activated.'));
                    }
                }
            }

            return redirect()->route('plans.index')->withErrors(['error' => __('Payment failed or cancelled')]);

        } catch (\Exception $e) {
            return redirect()->route('plans.index')->withErrors(['error' => __('Payment processing failed')]);
        }
    }

    private function retrieveIyzipayPayment($token, $settings)
    {
        try {
            $options = $this->getIyzipayOptions($settings);
            
            $request = new RetrieveCheckoutFormRequest();
            $request->setToken($token);
            
            $checkoutForm = CheckoutForm::retrieve($request, $options);
            
            return $checkoutForm;
        } catch (\Exception $e) {
            return null;
        }
    }
}