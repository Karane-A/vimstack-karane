<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentSettingController extends Controller
{
    public function index()
    {
        $paymentSettings = getPaymentSettings();
        
        // Get WhatsApp and Telegram variables from database for current user and store
        $user = auth()->user();
        $storeId = $user->type === 'company' ? $user->current_store : null;
        
        $messagingOrderVariables = PaymentSetting::where('user_id', $user->id)
            ->where('store_id', $storeId)
            ->where('key', 'messaging_order_variables')
            ->first();
            
        $messagingItemVariables = PaymentSetting::where('user_id', $user->id)
            ->where('store_id', $storeId)
            ->where('key', 'messaging_item_variables')
            ->first();
        
        $messagingVariables = [
            'orderVariables' => $messagingOrderVariables ? json_decode($messagingOrderVariables->value, true) : [],
            'itemVariables' => $messagingItemVariables ? json_decode($messagingItemVariables->value, true) : []
        ];
        
        // Both WhatsApp and Telegram use same variables
        $whatsappVariables = $messagingVariables;
        $telegramVariables = $messagingVariables;
        
        
        
        return Inertia::render('settings/index', [
            'paymentSettings' => $paymentSettings,
            'whatsappVariables' => $whatsappVariables,
            'telegramVariables' => $telegramVariables,
        ]);
    }

    public function getPaymentMethods()
    {
        // Always use superadmin settings for plan subscriptions
        $superAdminId = \App\Models\User::where('type', 'superadmin')->first()?->id;
        if (!$superAdminId) {
            return response()->json([]);
        }
        
        $paymentSettings = getPaymentSettings($superAdminId);
        
        // Add default currency to payment settings
        $settings = settings($superAdminId);
        
        // SECURITY FIX: Only return PUBLIC keys and enabled flags to frontend
        // NEVER expose secret keys, API tokens, or other sensitive credentials
        $publicSettings = [
            'defaultCurrency' => $settings['defaultCurrency'] ?? 'usd',
            
            // Stripe - public key only
            'is_stripe_enabled' => $paymentSettings['is_stripe_enabled'] ?? false,
            'stripe_key' => $paymentSettings['stripe_key'] ?? null,
            
            // PayPal - client ID only
            'is_paypal_enabled' => $paymentSettings['is_paypal_enabled'] ?? false,
            'paypal_client_id' => $paymentSettings['paypal_client_id'] ?? null,
            'paypal_mode' => $paymentSettings['paypal_mode'] ?? 'sandbox',
            
            // Paystack - public key only
            'is_paystack_enabled' => $paymentSettings['is_paystack_enabled'] ?? false,
            'paystack_public_key' => $paymentSettings['paystack_public_key'] ?? null,
            
            // Flutterwave - public key only
            'is_flutterwave_enabled' => $paymentSettings['is_flutterwave_enabled'] ?? false,
            'flutterwave_public_key' => $paymentSettings['flutterwave_public_key'] ?? null,
            
            // Bank Transfer - no sensitive data
            'is_bank_enabled' => $paymentSettings['is_bank_enabled'] ?? false,
            'bank_detail' => $paymentSettings['bank_detail'] ?? null,
            
            // Skrill - merchant ID only (not secret word)
            'is_skrill_enabled' => $paymentSettings['is_skrill_enabled'] ?? false,
            'skrill_merchant_id' => $paymentSettings['skrill_merchant_id'] ?? null,
            
            // CoinGate - mode only
            'is_coingate_enabled' => $paymentSettings['is_coingate_enabled'] ?? false,
            'coingate_mode' => $paymentSettings['coingate_mode'] ?? 'sandbox',
        ];
        
        return response()->json($publicSettings);
    }
    public function store(Request $request)
    {
        $user = auth()->user();
        
        // Only allow superadmin and company users to update payment settings
        if (!in_array($user->type, ['superadmin', 'company'])) {
            return back()->withErrors(['error' => 'Unauthorized to update payment settings.']);
        }
        
        // WhatsApp and Telegram settings only for company users
        if ($user->type !== 'company') {
            unset($request['is_whatsapp_enabled'], $request['messaging_message_template'], $request['messaging_item_template']);
            unset($request['is_telegram_enabled'], $request['telegram_bot_token'], $request['telegram_chat_id']);
        }
        

        
        try {
            $validatedData = $request->validate([
                'stripe_key' => 'nullable|string',
                'stripe_secret' => 'nullable|string',
                'paypal_client_id' => 'nullable|string',
                'paypal_secret_key' => 'nullable|string',
                'paypal_mode' => 'in:sandbox,live',
                'bank_detail' => 'nullable|string',
                'razorpay_key' => 'nullable|string',
                'razorpay_secret' => 'nullable|string',
                'mercadopago_mode' => 'in:sandbox,live',
                'mercadopago_access_token' => 'nullable|string',
                'paystack_public_key' => 'nullable|string',
                'paystack_secret_key' => 'nullable|string',
                'flutterwave_public_key' => 'nullable|string',
                'flutterwave_secret_key' => 'nullable|string',
                'paytabs_profile_id' => 'nullable|string',
                'paytabs_server_key' => 'nullable|string',
                'paytabs_region' => 'nullable|string',
                'paytabs_mode' => 'in:sandbox,live',
                'skrill_merchant_id' => 'nullable|string',
                'skrill_secret_word' => 'nullable|string',
                'coingate_api_token' => 'nullable|string',
                'coingate_mode' => 'in:sandbox,live',
                'payfast_merchant_id' => 'nullable|string',
                'payfast_merchant_key' => 'nullable|string',
                'payfast_passphrase' => 'nullable|string',
                'payfast_mode' => 'in:sandbox,live',
                'tap_secret_key' => 'nullable|string',
                'xendit_api_key' => 'nullable|string',
                'paytr_merchant_id' => 'nullable|string',
                'paytr_merchant_key' => 'nullable|string',
                'paytr_merchant_salt' => 'nullable|string',
                'mollie_api_key' => 'nullable|string',
                'toyyibpay_category_code' => 'nullable|string',
                'toyyibpay_secret_key' => 'nullable|string',
                'paymentwall_public_key' => 'nullable|string',
                'paymentwall_private_key' => 'nullable|string',
                'sspay_secret_key' => 'nullable|string',
                'sspay_category_code' => 'nullable|string',
                'benefit_mode' => 'in:sandbox,live',
                'benefit_secret_key' => 'nullable|string',
                'benefit_public_key' => 'nullable|string',
                'iyzipay_mode' => 'in:sandbox,live',
                'iyzipay_secret_key' => 'nullable|string',
                'iyzipay_public_key' => 'nullable|string',
                'aamarpay_store_id' => 'nullable|string',
                'aamarpay_signature' => 'nullable|string',
                'midtrans_mode' => 'in:sandbox,live',
                'midtrans_secret_key' => 'nullable|string',
                'yookassa_shop_id' => 'nullable|string',
                'yookassa_secret_key' => 'nullable|string',
                'nepalste_mode' => 'in:sandbox,live',
                'nepalste_secret_key' => 'nullable|string',
                'nepalste_public_key' => 'nullable|string',
                'paiement_merchant_id' => 'nullable|string',
                'cinetpay_site_id' => 'nullable|string',
                'cinetpay_api_key' => 'nullable|string',
                'cinetpay_secret_key' => 'nullable|string',
                'payhere_mode' => 'in:sandbox,live',
                'payhere_merchant_id' => 'nullable|string',
                'payhere_merchant_secret' => 'nullable|string',
                'payhere_app_id' => 'nullable|string',
                'payhere_app_secret' => 'nullable|string',
                'fedapay_mode' => 'in:sandbox,live',
                'fedapay_secret_key' => 'nullable|string',
                'fedapay_public_key' => 'nullable|string',
                'authorizenet_mode' => 'in:sandbox,live',
                'authorizenet_merchant_id' => 'nullable|string',
                'authorizenet_transaction_key' => 'nullable|string',
                'khalti_secret_key' => 'nullable|string',
                'khalti_public_key' => 'nullable|string',
                'easebuzz_merchant_key' => 'nullable|string',
                'easebuzz_salt_key' => 'nullable|string',
                'easebuzz_environment' => 'nullable|string',
                'ozow_mode' => 'in:sandbox,live',
                'ozow_site_key' => 'nullable|string',
                'ozow_private_key' => 'nullable|string',
                'ozow_api_key' => 'nullable|string',
                'cashfree_mode' => 'in:sandbox,live',
                'cashfree_secret_key' => 'nullable|string',
                'cashfree_public_key' => 'nullable|string',
                'whatsapp_phone_number' => 'nullable|regex:/^[0-9+\-\s()]*$/',
                'telegram_bot_token' => 'nullable|string',
                'telegram_chat_id' => 'nullable|string',
                'messaging_message_template' => 'nullable|string',
                'messaging_item_template' => 'nullable|string',
            ]);

            $settings = $this->preparePaymentSettings($request, $validatedData);
            $this->validateEnabledPaymentMethods($request, $validatedData);
            $this->savePaymentSettings($settings);

            return back()->with('success', 'Payment settings saved successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            \Log::error('Payment settings save error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to save payment settings: ' . $e->getMessage()]);
        }
    }

    private function preparePaymentSettings(Request $request, array $validatedData): array
    {
        // Handle masked values in demo mode
        if (config('app.is_demo', false)) {
            $validatedData = $this->handleMaskedValues($validatedData);
        }
        
        $settings = [
            'is_manually_enabled' => $request->boolean('is_manually_enabled'),
            'is_bank_enabled' => $request->boolean('is_bank_enabled'),
            'is_stripe_enabled' => $request->boolean('is_stripe_enabled'),
            'is_paypal_enabled' => $request->boolean('is_paypal_enabled'),
            'is_razorpay_enabled' => $request->boolean('is_razorpay_enabled'),
            'is_mercadopago_enabled' => $request->boolean('is_mercadopago_enabled'),
            'is_paystack_enabled' => $request->boolean('is_paystack_enabled'),
            'is_flutterwave_enabled' => $request->boolean('is_flutterwave_enabled'),
            'is_paytabs_enabled' => $request->boolean('is_paytabs_enabled'),
            'is_skrill_enabled' => $request->boolean('is_skrill_enabled'),
            'is_coingate_enabled' => $request->boolean('is_coingate_enabled'),
            'is_payfast_enabled' => $request->boolean('is_payfast_enabled'),
            'is_tap_enabled' => $request->boolean('is_tap_enabled'),
            'is_xendit_enabled' => $request->boolean('is_xendit_enabled'),
            'is_paytr_enabled' => $request->boolean('is_paytr_enabled'),
            'is_mollie_enabled' => $request->boolean('is_mollie_enabled'),
            'is_toyyibpay_enabled' => $request->boolean('is_toyyibpay_enabled'),
            'is_paymentwall_enabled' => $request->boolean('is_paymentwall_enabled'),
            'is_sspay_enabled' => $request->boolean('is_sspay_enabled'),
            'is_benefit_enabled' => $request->boolean('is_benefit_enabled'),
            'is_iyzipay_enabled' => $request->boolean('is_iyzipay_enabled'),
            'is_aamarpay_enabled' => $request->boolean('is_aamarpay_enabled'),
            'is_midtrans_enabled' => $request->boolean('is_midtrans_enabled'),
            'is_yookassa_enabled' => $request->boolean('is_yookassa_enabled'),
            'is_nepalste_enabled' => $request->boolean('is_nepalste_enabled'),
            'is_paiement_enabled' => $request->boolean('is_paiement_enabled'),
            'is_cinetpay_enabled' => $request->boolean('is_cinetpay_enabled'),
            'is_payhere_enabled' => $request->boolean('is_payhere_enabled'),
            'is_fedapay_enabled' => $request->boolean('is_fedapay_enabled'),
            'is_authorizenet_enabled' => $request->boolean('is_authorizenet_enabled'),
            'is_khalti_enabled' => $request->boolean('is_khalti_enabled'),
            'is_easebuzz_enabled' => $request->boolean('is_easebuzz_enabled'),
            'is_ozow_enabled' => $request->boolean('is_ozow_enabled'),
            'is_cashfree_enabled' => $request->boolean('is_cashfree_enabled'),
            'paypal_mode' => $validatedData['paypal_mode'] ?? 'sandbox',
            'mercadopago_mode' => $validatedData['mercadopago_mode'] ?? 'sandbox',
            'bank_detail' => $validatedData['bank_detail'],
            'stripe_key' => $validatedData['stripe_key'],
            'stripe_secret' => $validatedData['stripe_secret'],
            'paypal_client_id' => $validatedData['paypal_client_id'],
            'paypal_secret_key' => $validatedData['paypal_secret_key'],
            'razorpay_key' => $validatedData['razorpay_key'],
            'razorpay_secret' => $validatedData['razorpay_secret'],
            'mercadopago_access_token' => $validatedData['mercadopago_access_token'],
            'paystack_public_key' => $validatedData['paystack_public_key'],
            'paystack_secret_key' => $validatedData['paystack_secret_key'],
            'flutterwave_public_key' => $validatedData['flutterwave_public_key'],
            'flutterwave_secret_key' => $validatedData['flutterwave_secret_key'],
            'paytabs_profile_id' => $validatedData['paytabs_profile_id'],
            'paytabs_server_key' => $validatedData['paytabs_server_key'],
            'paytabs_region' => $validatedData['paytabs_region'],
            'paytabs_mode' => $validatedData['paytabs_mode'] ?? 'sandbox',
            'skrill_merchant_id' => $validatedData['skrill_merchant_id'],
            'skrill_secret_word' => $validatedData['skrill_secret_word'],
            'coingate_api_token' => $validatedData['coingate_api_token'],
            'coingate_mode' => $validatedData['coingate_mode'] ?? 'sandbox',
            'payfast_merchant_id' => $validatedData['payfast_merchant_id'],
            'payfast_merchant_key' => $validatedData['payfast_merchant_key'],
            'payfast_passphrase' => $validatedData['payfast_passphrase'],
            'payfast_mode' => $validatedData['payfast_mode'] ?? 'sandbox',
            'tap_secret_key' => $validatedData['tap_secret_key'],
            'xendit_api_key' => $validatedData['xendit_api_key'],
            'paytr_merchant_id' => $validatedData['paytr_merchant_id'],
            'paytr_merchant_key' => $validatedData['paytr_merchant_key'],
            'paytr_merchant_salt' => $validatedData['paytr_merchant_salt'],
            'mollie_api_key' => $validatedData['mollie_api_key'],
            'toyyibpay_category_code' => $validatedData['toyyibpay_category_code'],
            'toyyibpay_secret_key' => $validatedData['toyyibpay_secret_key'],
            'paymentwall_public_key' => $validatedData['paymentwall_public_key'],
            'paymentwall_private_key' => $validatedData['paymentwall_private_key'],
            'sspay_secret_key' => $validatedData['sspay_secret_key'],
            'sspay_category_code' => $validatedData['sspay_category_code'],
            'benefit_mode' => $validatedData['benefit_mode'] ?? 'sandbox',
            'benefit_secret_key' => $validatedData['benefit_secret_key'],
            'benefit_public_key' => $validatedData['benefit_public_key'],
            'iyzipay_mode' => $validatedData['iyzipay_mode'] ?? 'sandbox',
            'iyzipay_secret_key' => $validatedData['iyzipay_secret_key'],
            'iyzipay_public_key' => $validatedData['iyzipay_public_key'],
            'aamarpay_store_id' => $validatedData['aamarpay_store_id'],
            'aamarpay_signature' => $validatedData['aamarpay_signature'],
            'midtrans_mode' => $validatedData['midtrans_mode'] ?? 'sandbox',
            'midtrans_secret_key' => $validatedData['midtrans_secret_key'],
            'yookassa_shop_id' => $validatedData['yookassa_shop_id'],
            'yookassa_secret_key' => $validatedData['yookassa_secret_key'],
            'nepalste_mode' => $validatedData['nepalste_mode'] ?? 'sandbox',
            'nepalste_secret_key' => $validatedData['nepalste_secret_key'],
            'nepalste_public_key' => $validatedData['nepalste_public_key'],
            'paiement_merchant_id' => $validatedData['paiement_merchant_id'],
            'cinetpay_site_id' => $validatedData['cinetpay_site_id'],
            'cinetpay_api_key' => $validatedData['cinetpay_api_key'],
            'cinetpay_secret_key' => $validatedData['cinetpay_secret_key'],
            'payhere_mode' => $validatedData['payhere_mode'] ?? 'sandbox',
            'payhere_merchant_id' => $validatedData['payhere_merchant_id'],
            'payhere_merchant_secret' => $validatedData['payhere_merchant_secret'],
            'payhere_app_id' => $validatedData['payhere_app_id'],
            'payhere_app_secret' => $validatedData['payhere_app_secret'],
            'fedapay_mode' => $validatedData['fedapay_mode'] ?? 'sandbox',
            'fedapay_secret_key' => $validatedData['fedapay_secret_key'],
            'fedapay_public_key' => $validatedData['fedapay_public_key'],
            'authorizenet_mode' => $validatedData['authorizenet_mode'] ?? 'sandbox',
            'authorizenet_merchant_id' => $validatedData['authorizenet_merchant_id'],
            'authorizenet_transaction_key' => $validatedData['authorizenet_transaction_key'],
            'khalti_secret_key' => $validatedData['khalti_secret_key'],
            'khalti_public_key' => $validatedData['khalti_public_key'],
            'easebuzz_merchant_key' => $validatedData['easebuzz_merchant_key'],
            'easebuzz_salt_key' => $validatedData['easebuzz_salt_key'],
            'easebuzz_environment' => $validatedData['easebuzz_environment'],
            'ozow_mode' => $validatedData['ozow_mode'] ?? 'sandbox',
            'ozow_site_key' => $validatedData['ozow_site_key'],
            'ozow_private_key' => $validatedData['ozow_private_key'],
            'ozow_api_key' => $validatedData['ozow_api_key'],
            'cashfree_mode' => $validatedData['cashfree_mode'] ?? 'sandbox',
            'cashfree_secret_key' => $validatedData['cashfree_secret_key'],
            'cashfree_public_key' => $validatedData['cashfree_public_key'],
        ];
        
        return $settings;
    }

    private function validateEnabledPaymentMethods(Request $request, array $validatedData): void
    {
        $errors = [];

        if ($request->boolean('is_stripe_enabled')) {
            $config = ['key' => $validatedData['stripe_key'], 'secret' => $validatedData['stripe_secret']];
            $validation = validatePaymentMethodConfig('stripe', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_paypal_enabled')) {
            $config = ['client_id' => $validatedData['paypal_client_id'], 'secret' => $validatedData['paypal_secret_key']];
            $validation = validatePaymentMethodConfig('paypal', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_razorpay_enabled')) {
            $config = ['key' => $validatedData['razorpay_key'], 'secret' => $validatedData['razorpay_secret']];
            $validation = validatePaymentMethodConfig('razorpay', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_mercadopago_enabled')) {
            $config = ['access_token' => $validatedData['mercadopago_access_token']];
            $validation = validatePaymentMethodConfig('mercadopago', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_paystack_enabled')) {
            $config = ['public_key' => $validatedData['paystack_public_key'], 'secret_key' => $validatedData['paystack_secret_key']];
            $validation = validatePaymentMethodConfig('paystack', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_flutterwave_enabled')) {
            $config = ['public_key' => $validatedData['flutterwave_public_key'], 'secret_key' => $validatedData['flutterwave_secret_key']];
            $validation = validatePaymentMethodConfig('flutterwave', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_bank_enabled')) {
            $config = ['details' => $validatedData['bank_detail']];
            $validation = validatePaymentMethodConfig('bank', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_paytabs_enabled')) {
            $config = ['server_key' => $validatedData['paytabs_server_key'], 'profile_id' => $validatedData['paytabs_profile_id'], 'region' => $validatedData['paytabs_region']];
            $validation = validatePaymentMethodConfig('paytabs', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_skrill_enabled')) {
            $config = ['merchant_id' => $validatedData['skrill_merchant_id'], 'secret_word' => $validatedData['skrill_secret_word']];
            $validation = validatePaymentMethodConfig('skrill', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_coingate_enabled')) {
            $config = ['api_token' => $validatedData['coingate_api_token']];
            $validation = validatePaymentMethodConfig('coingate', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_payfast_enabled')) {
            $config = ['merchant_id' => $validatedData['payfast_merchant_id'], 'merchant_key' => $validatedData['payfast_merchant_key']];
            $validation = validatePaymentMethodConfig('payfast', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_tap_enabled')) {
            $config = ['secret_key' => $validatedData['tap_secret_key']];
            $validation = validatePaymentMethodConfig('tap', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_xendit_enabled')) {
            $config = ['api_key' => $validatedData['xendit_api_key']];
            $validation = validatePaymentMethodConfig('xendit', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_paytr_enabled')) {
            $config = ['merchant_id' => $validatedData['paytr_merchant_id'], 'merchant_key' => $validatedData['paytr_merchant_key'], 'merchant_salt' => $validatedData['paytr_merchant_salt']];
            $validation = validatePaymentMethodConfig('paytr', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_mollie_enabled')) {
            $config = ['api_key' => $validatedData['mollie_api_key']];
            $validation = validatePaymentMethodConfig('mollie', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_toyyibpay_enabled')) {
            $config = ['category_code' => $validatedData['toyyibpay_category_code'], 'secret_key' => $validatedData['toyyibpay_secret_key']];
            $validation = validatePaymentMethodConfig('toyyibpay', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_cashfree_enabled')) {
            $config = ['public_key' => $validatedData['cashfree_public_key'], 'secret_key' => $validatedData['cashfree_secret_key']];
            $validation = validatePaymentMethodConfig('cashfree', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_ozow_enabled')) {
            $config = ['site_key' => $validatedData['ozow_site_key'], 'private_key' => $validatedData['ozow_private_key']];
            $validation = validatePaymentMethodConfig('ozow', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_easebuzz_enabled')) {
            $config = ['merchant_key' => $validatedData['easebuzz_merchant_key'], 'salt_key' => $validatedData['easebuzz_salt_key']];
            $validation = validatePaymentMethodConfig('easebuzz', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_khalti_enabled')) {
            $config = ['public_key' => $validatedData['khalti_public_key'], 'secret_key' => $validatedData['khalti_secret_key']];
            $validation = validatePaymentMethodConfig('khalti', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_authorizenet_enabled')) {
            $config = ['merchant_id' => $validatedData['authorizenet_merchant_id'], 'transaction_key' => $validatedData['authorizenet_transaction_key']];
            $validation = validatePaymentMethodConfig('authorizenet', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_fedapay_enabled')) {
            $config = ['public_key' => $validatedData['fedapay_public_key'], 'secret_key' => $validatedData['fedapay_secret_key']];
            $validation = validatePaymentMethodConfig('fedapay', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_payhere_enabled')) {
            $config = ['merchant_id' => $validatedData['payhere_merchant_id'], 'merchant_secret' => $validatedData['payhere_merchant_secret']];
            $validation = validatePaymentMethodConfig('payhere', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_cinetpay_enabled')) {
            $config = ['site_id' => $validatedData['cinetpay_site_id'], 'api_key' => $validatedData['cinetpay_api_key']];
            $validation = validatePaymentMethodConfig('cinetpay', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_paiement_enabled')) {
            $config = ['merchant_id' => $validatedData['paiement_merchant_id']];
            $validation = validatePaymentMethodConfig('paiement', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_nepalste_enabled')) {
            $config = ['public_key' => $validatedData['nepalste_public_key'], 'secret_key' => $validatedData['nepalste_secret_key']];
            $validation = validatePaymentMethodConfig('nepalste', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_yookassa_enabled')) {
            $config = ['shop_id' => $validatedData['yookassa_shop_id'], 'secret_key' => $validatedData['yookassa_secret_key']];
            $validation = validatePaymentMethodConfig('yookassa', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_midtrans_enabled')) {
            $config = ['secret_key' => $validatedData['midtrans_secret_key']];
            $validation = validatePaymentMethodConfig('midtrans', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_aamarpay_enabled')) {
            $config = ['store_id' => $validatedData['aamarpay_store_id'], 'signature' => $validatedData['aamarpay_signature']];
            $validation = validatePaymentMethodConfig('aamarpay', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_iyzipay_enabled')) {
            $config = ['public_key' => $validatedData['iyzipay_public_key'], 'secret_key' => $validatedData['iyzipay_secret_key']];
            $validation = validatePaymentMethodConfig('iyzipay', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_paymentwall_enabled')) {
            $config = ['public_key' => $validatedData['paymentwall_public_key'], 'private_key' => $validatedData['paymentwall_private_key']];
            $validation = validatePaymentMethodConfig('paymentwall', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_sspay_enabled')) {
            $config = ['secret_key' => $validatedData['sspay_secret_key']];
            $validation = validatePaymentMethodConfig('sspay', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_benefit_enabled')) {
            $config = ['public_key' => $validatedData['benefit_public_key'], 'secret_key' => $validatedData['benefit_secret_key']];
            $validation = validatePaymentMethodConfig('benefit', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_whatsapp_enabled')) {
            $config = ['phone_number' => $validatedData['whatsapp_phone_number']];
            $validation = validatePaymentMethodConfig('whatsapp', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if ($request->boolean('is_telegram_enabled')) {
            $config = ['bot_token' => $validatedData['telegram_bot_token'], 'chat_id' => $validatedData['telegram_chat_id']];
            $validation = validatePaymentMethodConfig('telegram', $config);
            if (!$validation['valid']) {
                $errors = array_merge($errors, $validation['errors']);
            }
        }

        if (!empty($errors)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'payment_methods' => $errors
            ]);
        }
    }

    private function handleMaskedValues(array $validatedData): array
    {
        $user = auth()->user();
        $userId = $user->id;
        $storeId = $user->type === 'company' ? getCurrentStoreId($user) : null;
        
        // Get current payment settings from database
        $currentSettings = getPaymentSettings($userId, $storeId);
        
        // List of all payment credential fields that might be masked
        $credentialFields = [
            'stripe_key', 'stripe_secret', 'paypal_client_id', 'paypal_secret_key',
            'razorpay_key', 'razorpay_secret', 'mercadopago_access_token',
            'paystack_public_key', 'paystack_secret_key', 'flutterwave_public_key', 'flutterwave_secret_key',
            'paytabs_profile_id', 'paytabs_server_key', 'skrill_merchant_id', 'skrill_secret_word',
            'coingate_api_token', 'payfast_merchant_id', 'payfast_merchant_key', 'payfast_passphrase',
            'tap_secret_key', 'xendit_api_key', 'paytr_merchant_id', 'paytr_merchant_key', 'paytr_merchant_salt',
            'mollie_api_key', 'toyyibpay_category_code', 'toyyibpay_secret_key',
            'paymentwall_public_key', 'paymentwall_private_key', 'sspay_secret_key', 'sspay_category_code',
            'benefit_secret_key', 'benefit_public_key', 'iyzipay_secret_key', 'iyzipay_public_key',
            'aamarpay_store_id', 'aamarpay_signature', 'midtrans_secret_key',
            'yookassa_shop_id', 'yookassa_secret_key', 'nepalste_secret_key', 'nepalste_public_key',
            'paiement_merchant_id', 'cinetpay_site_id', 'cinetpay_api_key', 'cinetpay_secret_key',
            'payhere_merchant_id', 'payhere_merchant_secret', 'payhere_app_id', 'payhere_app_secret',
            'fedapay_secret_key', 'fedapay_public_key', 'authorizenet_merchant_id', 'authorizenet_transaction_key',
            'khalti_secret_key', 'khalti_public_key', 'easebuzz_merchant_key', 'easebuzz_salt_key',
            'ozow_site_key', 'ozow_private_key', 'ozow_api_key',
            'cashfree_secret_key', 'cashfree_public_key'
        ];
        
        foreach ($credentialFields as $field) {
            if (isset($validatedData[$field])) {
                $submittedValue = $validatedData[$field];
                
                // If the submitted value is asterisks (masked), preserve the original DB value
                if ($submittedValue === '************') {
                    $validatedData[$field] = $currentSettings[$field] ?? null;
                }
                // If the submitted value is empty/null, keep it as is (will be saved as empty)
                // If the submitted value is a new string, keep it as is (will overwrite DB value)
            }
        }
        
        return $validatedData;
    }

    private function savePaymentSettings(array $settings): void
    {
        $user = auth()->user();
        $userId = $user->id;
        $storeId = $user->type === 'company' ? getCurrentStoreId($user) : null;
        
        // Add WhatsApp and Telegram settings to payment settings for company users
        if ($user->type === 'company') {
            $settings['is_whatsapp_enabled'] = request()->boolean('is_whatsapp_enabled');
            $settings['whatsapp_phone_number'] = request()->input('whatsapp_phone_number', '');
            $settings['is_telegram_enabled'] = request()->boolean('is_telegram_enabled');
            $settings['telegram_bot_token'] = request()->input('telegram_bot_token', '');
            $settings['telegram_chat_id'] = request()->input('telegram_chat_id', '');
            $settings['messaging_message_template'] = request()->input('messaging_message_template', '');
            $settings['messaging_item_template'] = request()->input('messaging_item_template', '');
        }
        
        // Save payment settings
        foreach ($settings as $key => $value) {
            updatePaymentSetting($key, $value, $userId, $storeId);
        }
    }

    public function getEnabledMethods()
    {
        $user = auth()->user();
        
        // For company users, get their store-specific enabled methods; for others, use superadmin settings
        if ($user->type === 'company') {
            $storeId = getCurrentStoreId($user);
            $enabledMethods = getEnabledPaymentMethods($user->id, $storeId);
        } else {
            $enabledMethods = getEnabledPaymentMethods();
        }
        
        return response()->json($enabledMethods);
    }

    public function testTelegram(Request $request)
    {
        $request->validate([
            'telegram_bot_token' => 'required|string',
            'telegram_chat_id' => 'required|string',
        ]);

        $telegramService = new \App\Services\TelegramService();
        $result = $telegramService->testConnection(
            $request->telegram_bot_token,
            $request->telegram_chat_id
        );

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message']
        ], $result['success'] ? 200 : 400);
    }
}