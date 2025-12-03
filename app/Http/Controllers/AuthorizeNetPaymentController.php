<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use net\authorize\api\contract\v1 as AnetAPI;
use net\authorize\api\controller as AnetController;

class AuthorizeNetPaymentController extends Controller
{
    // Supported countries and currencies for AuthorizeNet
    private const SUPPORTED_COUNTRIES = ['US', 'CA', 'GB', 'AU'];
    private const SUPPORTED_CURRENCIES = [
        'USD', 'CAD', 'CHF', 'DKK', 'EUR', 'GBP', 'NOK', 'PLN', 'SEK', 'AUD', 'NZD'
    ];

    public function createPaymentForm(Request $request)
    {
        $validated = validatePaymentRequest($request);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['authorizenet_merchant_id']) || 
                !isset($settings['payment_settings']['authorizenet_transaction_key'])) {
                return response()->json(['error' => 'AuthorizeNet not properly configured'], 400);
            }

            // Get currency from settings or default to USD
            $currency = $settings['general_settings']['currency'] ?? 'USD';
            
            // Validate currency support
            if (!in_array($currency, self::SUPPORTED_CURRENCIES)) {
                $currency = 'USD';
            }

            return response()->json([
                'success' => true,
                'merchant_id' => $settings['payment_settings']['authorizenet_merchant_id'],
                'amount' => number_format($pricing['final_price'], 2, '.', ''),
                'currency' => $currency,
                'is_sandbox' => $settings['payment_settings']['authorizenet_mode'] === 'sandbox',
                'supported_countries' => self::SUPPORTED_COUNTRIES,
                'supported_currencies' => self::SUPPORTED_CURRENCIES,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => __('Payment form creation failed')], 500);
        }
    }

    public function processPayment(Request $request)
    {
        $validated = validatePaymentRequest($request, [
            'card_number' => 'required|string',
            'expiry_month' => 'required|string|size:2',
            'expiry_year' => 'required|string|size:2',
            'cvv' => 'required|string|min:3|max:4',
            'cardholder_name' => 'required|string|min:2|max:50',
        ]);

        try {
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null);
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['authorizenet_merchant_id']) || 
                !isset($settings['payment_settings']['authorizenet_transaction_key'])) {
                return back()->withErrors(['error' => __('AuthorizeNet not properly configured')]);
            }

            // Validate minimum amount (AuthorizeNet requires minimum $0.50)
            if ($pricing['final_price'] < 0.50) {
                return back()->withErrors(['error' => __('Minimum payment amount is $0.50')]);
            }

            $result = $this->createAuthorizeNetTransaction($validated, $pricing, $settings);

            if ($result['success']) {
                processPaymentSuccess([
                    'user_id' => auth()->id(),
                    'plan_id' => $plan->id,
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'authorizenet',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'payment_id' => $result['transaction_id'],
                ]);

                return back()->with('success', __('Payment successful and plan activated'));
            }
            
            return back()->withErrors(['error' => $result['error']]);

        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Payment processing failed. Please try again.')]);
        }
    }

    private function createAuthorizeNetTransaction($paymentData, $pricing, $settings)
    {
        try {
            // Set up merchant authentication
            $merchantAuthentication = new AnetAPI\MerchantAuthenticationType();
            $merchantAuthentication->setName($settings['payment_settings']['authorizenet_merchant_id']);
            $merchantAuthentication->setTransactionKey($settings['payment_settings']['authorizenet_transaction_key']);

            // Set up credit card information
            $creditCard = new AnetAPI\CreditCardType();
            $creditCard->setCardNumber(preg_replace('/\s+/', '', $paymentData['card_number']));
            
            // Fix expiration date format - AuthorizeNet expects YYYY-MM format
            $expiryYear = 2000 + intval($paymentData['expiry_year']);
            $expiryMonth = str_pad($paymentData['expiry_month'], 2, '0', STR_PAD_LEFT);
            $creditCard->setExpirationDate($expiryYear . '-' . $expiryMonth);
            $creditCard->setCardCode($paymentData['cvv']);

            // Set up payment method
            $paymentOne = new AnetAPI\PaymentType();
            $paymentOne->setCreditCard($creditCard);

            // Set up order information
            $order = new AnetAPI\OrderType();
            $order->setInvoiceNumber('INV-' . time());
            $order->setDescription('Plan Subscription Payment');

            // Set up customer information
            $customer = new AnetAPI\CustomerDataType();
            $customer->setType('individual');
            $customer->setId(auth()->id());
            $customer->setEmail(auth()->user()->email);

            // Set up billing information
            $billTo = new AnetAPI\CustomerAddressType();
            $billTo->setFirstName(explode(' ', $paymentData['cardholder_name'])[0]);
            $billTo->setLastName(implode(' ', array_slice(explode(' ', $paymentData['cardholder_name']), 1)) ?: 'Customer');
            $billTo->setCompany(auth()->user()->name ?? '');
            $billTo->setAddress('N/A');
            $billTo->setCity('N/A');
            $billTo->setState('N/A');
            $billTo->setZip('00000');
            $billTo->setCountry('US');

            // Create transaction request
            $transactionRequestType = new AnetAPI\TransactionRequestType();
            $transactionRequestType->setTransactionType('authCaptureTransaction');
            $transactionRequestType->setAmount(number_format($pricing['final_price'], 2, '.', ''));
            $transactionRequestType->setPayment($paymentOne);
            $transactionRequestType->setOrder($order);
            $transactionRequestType->setBillTo($billTo);
            $transactionRequestType->setCustomer($customer);

            // Add merchant defined fields for tracking
            $merchantDefinedField1 = new AnetAPI\UserFieldType();
            $merchantDefinedField1->setName('plan_id');
            $merchantDefinedField1->setValue($paymentData['plan_id']);
            
            $merchantDefinedField2 = new AnetAPI\UserFieldType();
            $merchantDefinedField2->setName('user_id');
            $merchantDefinedField2->setValue(auth()->id());
            
            $transactionRequestType->setUserFields([$merchantDefinedField1, $merchantDefinedField2]);

            // Create the API request
            $request = new AnetAPI\CreateTransactionRequest();
            $request->setMerchantAuthentication($merchantAuthentication);
            $request->setTransactionRequest($transactionRequestType);

            // Execute the request
            $controller = new AnetController\CreateTransactionController($request);
            
            $environment = ($settings['payment_settings']['authorizenet_mode'] === 'sandbox') 
                ? \net\authorize\api\constants\ANetEnvironment::SANDBOX 
                : \net\authorize\api\constants\ANetEnvironment::PRODUCTION;
                
            $response = $controller->executeWithApiResponse($environment);

            return $this->handleAuthorizeNetResponse($response);
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => __('Transaction processing failed. Please check your card details and try again.'),
                'transaction_id' => null
            ];
        }
    }

    private function handleAuthorizeNetResponse($response)
    {
        if ($response === null) {
            return [
                'success' => false,
                'error' => __('No response received from payment gateway'),
                'transaction_id' => null
            ];
        }

        $messages = $response->getMessages();
        
        if ($messages->getResultCode() !== 'Ok') {
            $errorMessage = __('Payment gateway error');
            if ($messages->getMessage() && count($messages->getMessage()) > 0) {
                $errorMessage = $messages->getMessage()[0]->getText();
            }
            
            return [
                'success' => false,
                'error' => $this->getFriendlyErrorMessage($errorMessage),
                'transaction_id' => null
            ];
        }

        $tresponse = $response->getTransactionResponse();
        
        if ($tresponse === null) {
            return [
                'success' => false,
                'error' => __('Invalid transaction response'),
                'transaction_id' => null
            ];
        }

        $responseCode = $tresponse->getResponseCode();
        
        // Response codes: 1 = Approved, 2 = Declined, 3 = Error, 4 = Held for Review
        switch ($responseCode) {
            case '1': // Approved
                return [
                    'success' => true,
                    'error' => null,
                    'transaction_id' => $tresponse->getTransId()
                ];
                
            case '2': // Declined
                $errorMessage = 'Transaction declined';
                if ($tresponse->getErrors() && count($tresponse->getErrors()) > 0) {
                    $errorMessage = $tresponse->getErrors()[0]->getErrorText();
                }
                                
                return [
                    'success' => false,
                    'error' => $this->getFriendlyErrorMessage($errorMessage),
                    'transaction_id' => null
                ];
                
            case '3': // Error
                $errorMessage = 'Transaction error';
                if ($tresponse->getErrors() && count($tresponse->getErrors()) > 0) {
                    $errorMessage = $tresponse->getErrors()[0]->getErrorText();
                }
                                
                return [
                    'success' => false,
                    'error' => $this->getFriendlyErrorMessage($errorMessage),
                    'transaction_id' => null
                ];
                
            case '4': // Held for Review
                return [
                    'success' => false,
                    'error' => __('Transaction is being reviewed. Please contact support.'),
                    'transaction_id' => $tresponse->getTransId()
                ];
                
            default:
                return [
                    'success' => false,
                    'error' => __('Unknown transaction response'),
                    'transaction_id' => null
                ];
        }
    }

    private function getFriendlyErrorMessage($errorMessage)
    {
        $friendlyMessages = [
            __('The credit card number is invalid') => __('Please check your card number and try again.'),
            __('The credit card has expired') => __('Your card has expired. Please use a different card.'),
            __('The credit card expiration date is invalid') => __('Please check the expiration date and try again.'),
            __('The transaction cannot be found') => __('Transaction not found. Please try again.'),
            __('A duplicate transaction has been submitted') => __('This transaction was already processed.'),
            __('The amount is invalid') => __('Invalid payment amount.'),
            __('This transaction has been declined') => __('Your card was declined. Please try a different payment method.'),
            __('Insufficient funds') => __('Insufficient funds. Please try a different card.'),
            __('The merchant does not accept this type of credit card') => __('This card type is not accepted.'),
            __('The transaction has been declined because of an AVS mismatch') => __('Address verification failed. Please check your billing address.'),
            __('The transaction has been declined because the CVV2 value is invalid') => __('Invalid security code. Please check your CVV.'),
        ];
        
        foreach ($friendlyMessages as $original => $friendly) {
            if (stripos($errorMessage, $original) !== false) {
                return $friendly;
            }
        }
        
        return __('Payment processing failed. Please check your card details and try again.');
    }

    /**
     * Test AuthorizeNet connection and credentials
     */
    public function testConnection(Request $request)
    {
        try {
            $settings = getPaymentGatewaySettings();
            
            if (!isset($settings['payment_settings']['authorizenet_merchant_id']) || 
                !isset($settings['payment_settings']['authorizenet_transaction_key'])) {
                return response()->json([
                    'success' => false,
                    'message' => __('AuthorizeNet credentials not configured')
                ]);
            }

            // Test with AuthenticateTest API call
            $merchantAuthentication = new AnetAPI\MerchantAuthenticationType();
            $merchantAuthentication->setName($settings['payment_settings']['authorizenet_merchant_id']);
            $merchantAuthentication->setTransactionKey($settings['payment_settings']['authorizenet_transaction_key']);

            $request = new AnetAPI\AuthenticateTestRequest();
            $request->setMerchantAuthentication($merchantAuthentication);

            $controller = new AnetController\AuthenticateTestController($request);
            
            $environment = ($settings['payment_settings']['authorizenet_mode'] === 'sandbox') 
                ? \net\authorize\api\constants\ANetEnvironment::SANDBOX 
                : \net\authorize\api\constants\ANetEnvironment::PRODUCTION;
                
            $response = $controller->executeWithApiResponse($environment);

            if ($response && $response->getMessages()->getResultCode() === 'Ok') {
                return response()->json([
                    'success' => true,
                    'message' => __('AuthorizeNet connection successful'),
                    'mode' => $settings['payment_settings']['authorizenet_mode']
                ]);
            } else {
                $errorMessage = __('Connection failed');
                if ($response && $response->getMessages()->getMessage()) {
                    $errorMessage = $response->getMessages()->getMessage()[0]->getText();
                }
                
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage
                ]);
            }
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => __('Connection test failed: ') . $e->getMessage()
            ]);
        }
    }
}