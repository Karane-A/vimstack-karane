<?php

use App\Models\Setting;
use App\Models\User;
use App\Models\Currency;
use App\Models\Coupon;
use Carbon\Carbon;
use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\Role;
use App\Models\PaymentSetting;

if (!function_exists('getCacheSize')) {
    /**
     * Get the total cache size in MB
     *
     * @return string
     */
    function getCacheSize()
    {
        try {
            $file_size = 0;
            $framework_path = storage_path('framework');
            
            if (is_dir($framework_path)) {
                // Use iterator with error handling to skip inaccessible directories
                $iterator = new \RecursiveIteratorIterator(
                    new \RecursiveDirectoryIterator(
                        $framework_path,
                        \RecursiveDirectoryIterator::SKIP_DOTS | \FilesystemIterator::CURRENT_AS_FILEINFO
                    ),
                    \RecursiveIteratorIterator::SELF_FIRST
                );
                
                foreach ($iterator as $file) {
                    try {
                        if ($file->isFile()) {
                            $file_size += $file->getSize();
                        }
                    } catch (\Exception $e) {
                        // Skip files we can't access
                        continue;
                    }
                }
            }
            
            return number_format($file_size / 1000000, 2);
        } catch (\Exception $e) {
            // If cache directory access fails, return 0
            \Log::warning('Cache size calculation failed: ' . $e->getMessage());
            return '0.00';
        }
    }
}

if (! function_exists('settings')) {
    function settings($user_id = null, $store_id = null)
    {
        // Skip database queries during installation
        if (request()->is('install/*') || request()->is('update/*') || !file_exists(storage_path('installed'))) {
            return [];
        }

        if (is_null($user_id)) {
            if (auth()->user()) {
                if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
                    $user_id = auth()->user()->created_by;
                } else {
                    $user_id = auth()->id();
                    // For company users, get current store if not specified
                    if (is_null($store_id) && auth()->user()->type === 'company') {
                        $store_id = getCurrentStoreId(auth()->user());
                    }
                }
            } else {
                $user = User::where('type', 'superadmin')->first();
                $user_id = $user ? $user->id : null;
            }
        }

        if (!$user_id) {
            return [];
        }

        $settings = Setting::where('user_id', $user_id)
                     ->where('store_id', $store_id)
                     ->pluck('value', 'key')
                     ->toArray();

        // Override with superadmin brand settings for company users
        $currentUser = $user_id ? User::find($user_id) : null;
        if ($currentUser && $currentUser->type === 'company') {
            $superAdmin = User::where('type', 'superadmin')->first();
            if ($superAdmin) {
                $brandKeys = ['logoLight', 'favicon', 'titleText', 'footerText', 
                              'themeColor', 'customColor', 'sidebarVariant', 'sidebarStyle', 
                              'layoutDirection', 'themeMode'];
                $brandSettings = Setting::where('user_id', $superAdmin->id)
                                       ->whereNull('store_id')
                                       ->whereIn('key', $brandKeys)
                                       ->pluck('value', 'key')
                                       ->toArray();
                $settings = array_merge($settings, $brandSettings);
            }
        }

        return $settings;
    }
}

if (! function_exists('formatDateTime')) {
    function formatDateTime($date, $includeTime = true)
    {
        if (!$date) {
            return null;
        }

        $settings = settings();

        $dateFormat = $settings['dateFormat'] ?? 'Y-m-d';
        $timeFormat = $settings['timeFormat'] ?? 'H:i';
        $timezone = $settings['defaultTimezone'] ?? config('app.timezone', 'UTC');

        $format = $includeTime ? "$dateFormat $timeFormat" : $dateFormat;

        return Carbon::parse($date)->timezone($timezone)->format($format);
    }
}

if (! function_exists('getPaymentSetting')) {
    function getPaymentSetting($key, $default = null, $user_id = null, $store_id = null)
    {
        // Skip database queries during installation
        if (request()->is('install/*') || request()->is('update/*') || !file_exists(storage_path('installed'))) {
            return $default;
        }

        // Determine user_id if not provided
        if (is_null($user_id)) {
            if (auth()->user()) {
                if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
                    $user_id = auth()->user()->created_by;
                } else {
                    $user_id = auth()->id();
                }
            } else {
                $user = User::where('type', 'superadmin')->first();
                $user_id = $user ? $user->id : null;
            }
        }

        if (!$user_id) {
            return $default;
        }

        // Get payment setting
        $setting = PaymentSetting::where('user_id', $user_id)
                                ->where('store_id', $store_id)
                                ->where('key', $key)
                                ->first();
        
        return $setting ? $setting->value : $default;
    }
}

if (! function_exists('getSetting')) {
    function getSetting($key, $default = null, $user_id = null, $store_id = null)
    {
        // Check if this is a payment/messaging setting that should be retrieved from payment_settings table
        $paymentSettingKeys = [];
        
        if (in_array($key, $paymentSettingKeys)) {
            return getPaymentSetting($key, $default, $user_id, $store_id);
        }
        
        // Skip database queries during installation
        if (request()->is('install/*') || request()->is('update/*') || !file_exists(storage_path('installed'))) {
            $defaultSettings = defaultSettings();
            return $defaultSettings[$key] ?? $default;
        }

        // Determine user_id if not provided
        if (is_null($user_id)) {
            if (auth()->user()) {
                if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
                    $user_id = auth()->user()->created_by;
                } else {
                    $user_id = auth()->id();
                }
            } else {
                $user = User::where('type', 'superadmin')->first();
                $user_id = $user ? $user->id : null;
            }
        }

        if (!$user_id) {
            $defaultSettings = defaultSettings();
            return $defaultSettings[$key] ?? $default;
        }

        // For store-specific settings, use new method
        if ($store_id !== null) {
            return \App\Models\Setting::getSetting($key, $user_id, $store_id, $default);
        }
        
        $user = User::find($user_id);
        $settings = [];
        
        // For company users, check current store settings first
        if ($user && $user->type === 'company' && $user->current_store) {
            $settings = Setting::where('user_id', $user_id)
                              ->where('store_id', $user->current_store)
                              ->pluck('value', 'key')
                              ->toArray();
        }
        
        // If not found, check global settings for this user
        if (!isset($settings[$key])) {
            $globalSettings = Setting::where('user_id', $user_id)
                                    ->whereNull('store_id')
                                    ->pluck('value', 'key')
                                    ->toArray();
            if (isset($globalSettings[$key])) {
                return $globalSettings[$key];
            }
        }
        
        // If still not found and user is company, try superadmin settings
        if (!isset($settings[$key]) && $user && $user->type === 'company') {
            $superAdmin = User::where('type', 'superadmin')->first();
            if ($superAdmin) {
                $superAdminSettings = Setting::where('user_id', $superAdmin->id)
                                            ->whereNull('store_id')
                                            ->pluck('value', 'key')
                                            ->toArray();
                if (isset($superAdminSettings[$key])) {
                    return $superAdminSettings[$key];
                }
            }
        }
        
        // If no value found and no default provided, try to get from defaultSettings
        if (!isset($settings[$key]) && $default === null) {
            $defaultSettings = defaultSettings();
            $default = $defaultSettings[$key] ?? null;
        }
        
        return $settings[$key] ?? $default;
    }
}

if (! function_exists('updateSetting')) {
    function updateSetting($key, $value, $user_id = null, $store_id = null)
    {
        // For store-specific settings, use new method
        if ($store_id !== null) {
            return \App\Models\Setting::setSetting($key, $value, $user_id ?: auth()->id(), $store_id);
        }
        
        // Legacy behavior for global settings
        if (is_null($user_id)) {
            if (auth()->user()) {
                if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
                    $user_id = auth()->user()->created_by;
                } else {
                    $user_id = auth()->id();
                }
            } else {
                $user = User::where('type', 'superadmin')->first();
                $user_id = $user ? $user->id : null;
            }
        }

        if (!$user_id) {
            return false;
        }

        return Setting::updateOrCreate(
            ['user_id' => $user_id, 'store_id' => null, 'key' => $key],
            ['value' => $value]
        );
    }
}

if (! function_exists('defaultRoleAndSetting')) {
    function defaultRoleAndSetting($user)
    {
        $companyRole = Role::where('name', 'company')->first();
            
        if ($companyRole) {
            $user->assignRole($companyRole);
        }
        
        // Create default settings for the user
        if ($user->type === 'superadmin') {
            createDefaultSettings($user->id);
        }
        // Company settings will be created by CompanyStoreSettingsSeeder (store-specific only)

        return true;
    }
}

if (! function_exists('getPaymentSettings')) {
    /**
     * Get payment settings for a user
     *
     * @param int|null $userId
     * @return array
     */
    function getPaymentSettings($userId = null, $storeId = null)
    {
        if (is_null($userId)) {
            if (auth()->check()) {
                $userId = auth()->id();
                // For company users, get current store ID
                if (auth()->user()->type === 'company' && is_null($storeId)) {
                    $storeId = getCurrentStoreId(auth()->user());
                }
            } else {
                $user = User::where('type', 'superadmin')->first();
                $userId = $user ? $user->id : null;
            }
        }

        $paymentSettings = PaymentSetting::getUserSettings($userId, $storeId);
        
        // WhatsApp and Telegram settings are now stored in payment_settings table
        
        return $paymentSettings;
    }
}

if (! function_exists('updatePaymentSetting')) {
    /**
     * Update or create a payment setting
     *
     * @param string $key
     * @param mixed $value
     * @param int|null $userId
     * @return \App\Models\PaymentSetting
     */
    function updatePaymentSetting($key, $value, $userId = null, $storeId = null)
    {
        if (is_null($userId)) {
            $userId = auth()->id();
            // For company users, get current store ID
            if (auth()->user()->type === 'company' && is_null($storeId)) {
                $storeId = getCurrentStoreId(auth()->user());
            }
        }

        return PaymentSetting::updateOrCreateSetting($userId, $key, $value, $storeId);
    }
}

if (! function_exists('isPaymentMethodEnabled')) {
    /**
     * Check if a payment method is enabled
     *
     * @param string $method (stripe, paypal, razorpay, mercadopago, bank)
     * @param int|null $userId
     * @return bool
     */
    function isPaymentMethodEnabled($method, $userId = null, $storeId = null)
    {
        $settings = getPaymentSettings($userId, $storeId);
        $key = "is_{$method}_enabled";
        
        return isset($settings[$key]) && ($settings[$key] === true || $settings[$key] === '1');
    }
}

if (! function_exists('getPaymentMethodConfig')) {
    /**
     * Get configuration for a specific payment method
     *
     * @param string $method (stripe, paypal, razorpay, mercadopago)
     * @param int|null $userId
     * @return array
     */
    function getPaymentMethodConfig($method, $userId = null, $storeId = null)
    {
        $settings = getPaymentSettings($userId, $storeId);
        
        switch ($method) {
            case 'stripe':
                return [
                    'enabled' => isPaymentMethodEnabled('stripe', $userId, $storeId),
                    'key' => $settings['stripe_key'] ?? null,
                    'secret' => $settings['stripe_secret'] ?? null,
                ];
                
            case 'paypal':
                return [
                    'enabled' => isPaymentMethodEnabled('paypal', $userId, $storeId),
                    'mode' => $settings['paypal_mode'] ?? 'sandbox',
                    'client_id' => $settings['paypal_client_id'] ?? null,
                    'secret' => $settings['paypal_secret_key'] ?? null,
                ];
                
            case 'razorpay':
                return [
                    'enabled' => isPaymentMethodEnabled('razorpay', $userId, $storeId),
                    'key' => $settings['razorpay_key'] ?? null,
                    'secret' => $settings['razorpay_secret'] ?? null,
                ];
                
            case 'mercadopago':
                return [
                    'enabled' => isPaymentMethodEnabled('mercadopago', $userId, $storeId),
                    'mode' => $settings['mercadopago_mode'] ?? 'sandbox',
                    'access_token' => $settings['mercadopago_access_token'] ?? null,
                    'currency' => $settings['defaultCurrency'] ?? 'BRL',
                ];
                
            case 'paystack':
                return [
                    'enabled' => isPaymentMethodEnabled('paystack', $userId, $storeId),
                    'public_key' => $settings['paystack_public_key'] ?? null,
                    'secret_key' => $settings['paystack_secret_key'] ?? null,
                ];
                
            case 'flutterwave':
                return [
                    'enabled' => isPaymentMethodEnabled('flutterwave', $userId, $storeId),
                    'public_key' => $settings['flutterwave_public_key'] ?? null,
                    'secret_key' => $settings['flutterwave_secret_key'] ?? null,
                ];
                
            case 'bank':
                return [
                    'enabled' => isPaymentMethodEnabled('bank', $userId, $storeId),
                    'details' => $settings['bank_detail'] ?? null,
                ];
                
            case 'paytabs':
                return [
                    'enabled' => isPaymentMethodEnabled('paytabs', $userId, $storeId),
                    'mode' => $settings['paytabs_mode'] ?? 'sandbox',
                    'profile_id' => $settings['paytabs_profile_id'] ?? null,
                    'server_key' => $settings['paytabs_server_key'] ?? null,
                    'region' => $settings['paytabs_region'] ?? 'ARE',
                ];
                
            case 'skrill':
                return [
                    'enabled' => isPaymentMethodEnabled('skrill', $userId, $storeId),
                    'merchant_id' => $settings['skrill_merchant_id'] ?? null,
                    'secret_word' => $settings['skrill_secret_word'] ?? null,
                ];
                
            case 'coingate':
                return [
                    'enabled' => isPaymentMethodEnabled('coingate', $userId, $storeId),
                    'mode' => $settings['coingate_mode'] ?? 'sandbox',
                    'api_token' => $settings['coingate_api_token'] ?? null,
                ];
                
            case 'payfast':
                return [
                    'enabled' => isPaymentMethodEnabled('payfast', $userId, $storeId),
                    'mode' => $settings['payfast_mode'] ?? 'sandbox',
                    'merchant_id' => $settings['payfast_merchant_id'] ?? null,
                    'merchant_key' => $settings['payfast_merchant_key'] ?? null,
                    'passphrase' => $settings['payfast_passphrase'] ?? null,
                ];
                
            case 'tap':
                return [
                    'enabled' => isPaymentMethodEnabled('tap', $userId, $storeId),
                    'secret_key' => $settings['tap_secret_key'] ?? null,
                ];
                
            case 'xendit':
                return [
                    'enabled' => isPaymentMethodEnabled('xendit', $userId, $storeId),
                    'api_key' => $settings['xendit_api_key'] ?? null,
                ];
                
            case 'paytr':
                return [
                    'enabled' => isPaymentMethodEnabled('paytr', $userId, $storeId),
                    'merchant_id' => $settings['paytr_merchant_id'] ?? null,
                    'merchant_key' => $settings['paytr_merchant_key'] ?? null,
                    'merchant_salt' => $settings['paytr_merchant_salt'] ?? null,
                ];
                
            case 'mollie':
                return [
                    'enabled' => isPaymentMethodEnabled('mollie', $userId, $storeId),
                    'api_key' => $settings['mollie_api_key'] ?? null,
                ];
                
            case 'toyyibpay':
                return [
                    'enabled' => isPaymentMethodEnabled('toyyibpay', $userId, $storeId),
                    'category_code' => $settings['toyyibpay_category_code'] ?? null,
                    'secret_key' => $settings['toyyibpay_secret_key'] ?? null,
                    'mode' => $settings['toyyibpay_mode'] ?? 'sandbox',
                ];
                
            case 'cashfree':
                return [
                    'enabled' => isPaymentMethodEnabled('cashfree', $userId, $storeId),
                    'mode' => $settings['cashfree_mode'] ?? 'sandbox',
                    'public_key' => $settings['cashfree_public_key'] ?? null,
                    'secret_key' => $settings['cashfree_secret_key'] ?? null,
                ];
                
            case 'iyzipay':
                return [
                    'enabled' => isPaymentMethodEnabled('iyzipay', $userId, $storeId),
                    'mode' => $settings['iyzipay_mode'] ?? 'sandbox',
                    'public_key' => $settings['iyzipay_public_key'] ?? null,
                    'secret_key' => $settings['iyzipay_secret_key'] ?? null,
                ];
                
            case 'benefit':
                return [
                    'enabled' => isPaymentMethodEnabled('benefit', $userId, $storeId),
                    'mode' => $settings['benefit_mode'] ?? 'sandbox',
                    'public_key' => $settings['benefit_public_key'] ?? null,
                    'secret_key' => $settings['benefit_secret_key'] ?? null,
                ];
                
            case 'ozow':
                return [
                    'enabled' => isPaymentMethodEnabled('ozow', $userId, $storeId),
                    'mode' => $settings['ozow_mode'] ?? 'sandbox',
                    'site_key' => $settings['ozow_site_key'] ?? null,
                    'private_key' => $settings['ozow_private_key'] ?? null,
                    'api_key' => $settings['ozow_api_key'] ?? null,
                ];
                
            case 'easebuzz':
                return [
                    'enabled' => isPaymentMethodEnabled('easebuzz', $userId, $storeId),
                    'merchant_key' => $settings['easebuzz_merchant_key'] ?? null,
                    'salt_key' => $settings['easebuzz_salt_key'] ?? null,
                    'environment' => $settings['easebuzz_environment'] ?? 'test',
                ];
                
            case 'khalti':
                return [
                    'enabled' => isPaymentMethodEnabled('khalti', $userId, $storeId),
                    'public_key' => $settings['khalti_public_key'] ?? null,
                    'secret_key' => $settings['khalti_secret_key'] ?? null,
                ];
                
            case 'authorizenet':
                return [
                    'enabled' => isPaymentMethodEnabled('authorizenet', $userId, $storeId),
                    'mode' => $settings['authorizenet_mode'] ?? 'sandbox',
                    'merchant_id' => $settings['authorizenet_merchant_id'] ?? null,
                    'transaction_key' => $settings['authorizenet_transaction_key'] ?? null,
                    'supported_countries' => ['US', 'CA', 'GB', 'AU'],
                    'supported_currencies' => ['USD', 'CAD', 'CHF', 'DKK', 'EUR', 'GBP', 'NOK', 'PLN', 'SEK', 'AUD', 'NZD'],
                ];
                
            case 'fedapay':
                return [
                    'enabled' => isPaymentMethodEnabled('fedapay', $userId, $storeId),
                    'mode' => $settings['fedapay_mode'] ?? 'sandbox',
                    'public_key' => $settings['fedapay_public_key'] ?? null,
                    'secret_key' => $settings['fedapay_secret_key'] ?? null,
                ];
                
            case 'payhere':
                return [
                    'enabled' => isPaymentMethodEnabled('payhere', $userId, $storeId),
                    'mode' => $settings['payhere_mode'] ?? 'sandbox',
                    'merchant_id' => $settings['payhere_merchant_id'] ?? null,
                    'merchant_secret' => $settings['payhere_merchant_secret'] ?? null,
                    'app_id' => $settings['payhere_app_id'] ?? null,
                    'app_secret' => $settings['payhere_app_secret'] ?? null,
                ];
                
            case 'cinetpay':
                return [
                    'enabled' => isPaymentMethodEnabled('cinetpay', $userId, $storeId),
                    'site_id' => $settings['cinetpay_site_id'] ?? null,
                    'api_key' => $settings['cinetpay_api_key'] ?? null,
                    'secret_key' => $settings['cinetpay_secret_key'] ?? null,
                ];
                
            case 'paymentwall':
                return [
                    'enabled' => isPaymentMethodEnabled('paymentwall', $userId, $storeId),
                    'mode' => $settings['paymentwall_mode'] ?? 'sandbox',
                    'public_key' => $settings['paymentwall_public_key'] ?? null,
                    'private_key' => $settings['paymentwall_private_key'] ?? null,
                ];
                
            default:
                return [];
        }
    }
}

if (! function_exists('getEnabledPaymentMethods')) {
    /**
     * Get all enabled payment methods
     *
     * @param int|null $userId
     * @return array
     */
    function getEnabledPaymentMethods($userId = null, $storeId = null)
    {
        $methods = ['stripe', 'paypal', 'razorpay', 'mercadopago', 'paystack', 'flutterwave', 'bank', 'paytabs', 'skrill', 'coingate', 'payfast', 'tap', 'xendit', 'paytr', 'mollie', 'toyyibpay', 'cashfree', 'iyzipay', 'benefit', 'ozow', 'easebuzz', 'khalti', 'authorizenet', 'fedapay', 'payhere', 'cinetpay', 'paymentwall', 'whatsapp', 'telegram'];
        $enabled = [];
        
        foreach ($methods as $method) {
            if (isPaymentMethodEnabled($method, $userId, $storeId)) {
                $enabled[$method] = getPaymentMethodConfig($method, $userId, $storeId);
            }
        }
        
        return $enabled;
    }
}

if (! function_exists('validatePaymentMethodConfig')) {
    /**
     * Validate payment method configuration
     *
     * @param string $method
     * @param array $config
     * @return array [valid => bool, errors => array]
     */
    function validatePaymentMethodConfig($method, $config)
    {
        $errors = [];
        
        switch ($method) {
            case 'stripe':
                if (empty($config['key'])) {
                    $errors[] = 'Stripe publishable key is required';
                }
                if (empty($config['secret'])) {
                    $errors[] = 'Stripe secret key is required';
                }
                break;
                
            case 'paypal':
                if (empty($config['client_id'])) {
                    $errors[] = 'PayPal client ID is required';
                }
                if (empty($config['secret'])) {
                    $errors[] = 'PayPal secret key is required';
                }
                break;
                
            case 'razorpay':
                if (empty($config['key'])) {
                    $errors[] = 'Razorpay key ID is required';
                }
                if (empty($config['secret'])) {
                    $errors[] = 'Razorpay secret key is required';
                }
                break;
                
            case 'mercadopago':
                if (empty($config['access_token'])) {
                    $errors[] = 'MercadoPago access token is required';
                }
                break;
                
            case 'bank':
                if (empty($config['details'])) {
                    $errors[] = 'Bank details are required';
                }
                break;
                
            case 'paytabs':
                if (empty($config['server_key'])) {
                    $errors[] = 'PayTabs server key is required';
                }
                if (empty($config['profile_id'])) {
                    $errors[] = 'PayTabs profile id is required';
                }
                if (empty($config['region'])) {
                    $errors[] = 'PayTabs region is required';
                }
                break;
                
            case 'skrill':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'Skrill merchant ID is required';
                }
                if (empty($config['secret_word'])) {
                    $errors[] = 'Skrill secret word is required';
                }
                break;
                
            case 'coingate':
                if (empty($config['api_token'])) {
                    $errors[] = 'CoinGate API token is required';
                }
                break;
                
            case 'payfast':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'Payfast merchant ID is required';
                }
                if (empty($config['merchant_key'])) {
                    $errors[] = 'Payfast merchant key is required';
                }
                break;
                
            case 'tap':
                if (empty($config['secret_key'])) {
                    $errors[] = 'Tap secret key is required';
                }
                break;
                
            case 'xendit':
                if (empty($config['api_key'])) {
                    $errors[] = 'Xendit api key is required';
                }
                break;
                
            case 'paytr':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'PayTR merchant ID is required';
                }
                if (empty($config['merchant_key'])) {
                    $errors[] = 'PayTR merchant key is required';
                }
                if (empty($config['merchant_salt'])) {
                    $errors[] = 'PayTR merchant salt is required';
                }
                break;
                
            case 'mollie':
                if (empty($config['api_key'])) {
                    $errors[] = 'Mollie API key is required';
                }
                break;
                
            case 'toyyibpay':
                if (empty($config['category_code'])) {
                    $errors[] = 'toyyibPay category code is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'toyyibPay secret key is required';
                }
                break;
                
            case 'cashfree':
                if (empty($config['public_key'])) {
                    $errors[] = 'Cashfree App ID is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Cashfree Secret Key is required';
                }
                break;
                
            case 'iyzipay':
                if (empty($config['public_key'])) {
                    $errors[] = 'Iyzipay API key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Iyzipay secret key is required';
                }
                break;
                
            case 'benefit':
                if (empty($config['public_key'])) {
                    $errors[] = 'Benefit API key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Benefit secret key is required';
                }
                break;
                
            case 'ozow':
                if (empty($config['site_key'])) {
                    $errors[] = 'Ozow site key is required';
                }
                if (empty($config['private_key'])) {
                    $errors[] = 'Ozow private key is required';
                }
                break;
                
            case 'easebuzz':
                if (empty($config['merchant_key'])) {
                    $errors[] = 'Easebuzz merchant key is required';
                }
                if (empty($config['salt_key'])) {
                    $errors[] = 'Easebuzz salt key is required';
                }
                break;
                
            case 'khalti':
                if (empty($config['public_key'])) {
                    $errors[] = 'Khalti public key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Khalti secret key is required';
                }
                break;
                
            case 'authorizenet':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'AuthorizeNet merchant ID is required';
                }
                if (empty($config['transaction_key'])) {
                    $errors[] = 'AuthorizeNet transaction key is required';
                }
                break;
                
            case 'fedapay':
                if (empty($config['public_key'])) {
                    $errors[] = 'FedaPay public key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'FedaPay secret key is required';
                }
                break;
                
            case 'payhere':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'PayHere merchant ID is required';
                }
                if (empty($config['merchant_secret'])) {
                    $errors[] = 'PayHere merchant secret is required';
                }
                break;
                
            case 'cinetpay':
                if (empty($config['site_id'])) {
                    $errors[] = 'CinetPay site ID is required';
                }
                if (empty($config['api_key'])) {
                    $errors[] = 'CinetPay API key is required';
                }
                break;
                
            case 'paiement':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'Paiement Pro merchant ID is required';
                }
                break;
                
            case 'nepalste':
                if (empty($config['public_key'])) {
                    $errors[] = 'Nepalste public key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Nepalste secret key is required';
                }
                break;
                
            case 'yookassa':
                if (empty($config['shop_id'])) {
                    $errors[] = 'YooKassa shop ID is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'YooKassa secret key is required';
                }
                break;
                
            case 'midtrans':
                if (empty($config['secret_key'])) {
                    $errors[] = 'Midtrans secret key is required';
                }
                break;
                
            case 'aamarpay':
                if (empty($config['store_id'])) {
                    $errors[] = 'Aamarpay store ID is required';
                }
                if (empty($config['signature'])) {
                    $errors[] = 'Aamarpay signature is required';
                }
                break;
                            
            case 'paymentwall':
                if (empty($config['public_key'])) {
                    $errors[] = 'PaymentWall public key is required';
                }
                if (empty($config['private_key'])) {
                    $errors[] = 'PaymentWall private key is required';
                }
                break;
                
            case 'sspay':
                if (empty($config['secret_key'])) {
                    $errors[] = 'SSPay secret key is required';
                }
                break;
                
            case 'whatsapp':
                if (empty($config['phone_number'])) {
                    $errors[] = 'WhatsApp phone number is required';
                }
                break;
                
            case 'telegram':
                if (empty($config['bot_token'])) {
                    $errors[] = 'Telegram bot token is required';
                }
                if (empty($config['chat_id'])) {
                    $errors[] = 'Telegram chat ID is required';
                }
                break;
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}

if (! function_exists('calculatePlanPricing')) {
    function calculatePlanPricing($plan, $couponCode = null)
    {
        $originalPrice = $plan->price;
        $discountAmount = 0;
        $finalPrice = $originalPrice;
        $couponId = null;
        
        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)
                ->where('status', 1)
                ->first();
            
            if ($coupon) {
                if ($coupon->type === 'percentage') {
                    $discountAmount = ($originalPrice * $coupon->discount_amount) / 100;
                } else {
                    $discountAmount = min($coupon->discount_amount, $originalPrice);
                }
                $finalPrice = max(0, $originalPrice - $discountAmount);
                $couponId = $coupon->id;
            }
        }
        
        return [
            'original_price' => $originalPrice,
            'discount_amount' => $discountAmount,
            'final_price' => $finalPrice,
            'coupon_id' => $couponId
        ];
    }
}

if (! function_exists('createPlanOrder')) {
    function createPlanOrder($data)
    {
        $plan = Plan::findOrFail($data['plan_id']);
        $pricing = calculatePlanPricing($plan, $data['coupon_code'] ?? null);
        
        return PlanOrder::create([
            'user_id' => $data['user_id'],
            'plan_id' => $plan->id,
            'coupon_id' => $pricing['coupon_id'],
            'billing_cycle' => $data['billing_cycle'],
            'payment_method' => $data['payment_method'],
            'coupon_code' => $data['coupon_code'] ?? null,
            'original_price' => $pricing['original_price'],
            'discount_amount' => $pricing['discount_amount'],
            'final_price' => $pricing['final_price'],
            'payment_id' => $data['payment_id'],
            'status' => $data['status'] ?? 'pending',
            'ordered_at' => now(),
        ]);
    }
}

if (! function_exists('assignPlanToUser')) {
    function assignPlanToUser($user, $plan, $billingCycle)
    {
        $expiresAt = $billingCycle === 'yearly' ? now()->addYear() : now()->addMonth();
        
        \Log::info('Assigning plan ' . $plan->id . ' to user ' . $user->id . ' with billing cycle ' . $billingCycle);
        
        $updated = $user->update([
            'plan_id' => $plan->id,
            'plan_expire_date' => $expiresAt,
            'plan_is_active' => 1,
        ]);
        
        \Log::info('Plan assignment result: ' . ($updated ? 'success' : 'failed'));
    }
}

if (! function_exists('processPaymentSuccess')) {
    function processPaymentSuccess($data)
    {
        $plan = Plan::findOrFail($data['plan_id']);
        $user = User::findOrFail($data['user_id']);
        
        $planOrder = createPlanOrder(array_merge($data, ['status' => 'approved']));
        assignPlanToUser($user, $plan, $data['billing_cycle']);
        
        // Verify the plan was assigned
        $user->refresh();
        return $planOrder;
    }
}

if (! function_exists('getPaymentGatewaySettings')) {
    function getPaymentGatewaySettings()
    {
        $superAdminId = User::where('type', 'superadmin')->first()?->id;
        
        return [
            'payment_settings' => PaymentSetting::getUserSettings($superAdminId),
            'general_settings' => Setting::getUserSettings($superAdminId),
            'super_admin_id' => $superAdminId
        ];
    }
}

if (! function_exists('validatePaymentRequest')) {
    function validatePaymentRequest($request, $additionalRules = [])
    {
        $baseRules = [
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string',
        ];
        
        return $request->validate(array_merge($baseRules, $additionalRules));
    }
}

if (! function_exists('handlePaymentError')) {
    function handlePaymentError($e, $method = 'payment')
    {
        return back()->withErrors(['error' => __('Payment processing failed: :message', ['message' => $e->getMessage()])]);
    }
}

if (! function_exists('defaultSettings')) {
    /**
     * Get default settings for System, Brand, Storage, and Currency configurations
     *
     * @return array
     */
    function defaultSettings()
    {
        return [
            // System Settings
            'base_url' => config('app.url', request()->getSchemeAndHttpHost()),
            'defaultLanguage' => 'en',
            'dateFormat' => 'Y-m-d',
            'timeFormat' => 'H:i',
            'calendarStartDay' => 'sunday',
            'defaultTimezone' => 'Africa/Kampala',
            'emailVerification' => false,
            
            // Brand Settings
            'logoLight' => '/images/logos/logo-light.png',
            'favicon' => '/images/logos/vimstack-favicon.png',
            'titleText' => 'Vimstack',
            'footerText' => '© 2025 Vimstack. All rights reserved.',
            'themeColor' => 'green',
            'customColor' => '#10b981',
            'sidebarVariant' => 'inset',
            'sidebarStyle' => 'plain',
            'layoutDirection' => 'left',
            'themeMode' => 'light', // Force light mode only
            
            // Storage Settings
            'storage_type' => 'local',
            'storage_file_types' => 'jpg,png,webp,gif,pdf,doc,docx,txt,csv',
            'storage_max_upload_size' => '2048',
            'aws_access_key_id' => '',
            'aws_secret_access_key' => '',
            'aws_default_region' => 'us-east-1',
            'aws_bucket' => '',
            'aws_url' => '',
            'aws_endpoint' => '',
            'wasabi_access_key' => '',
            'wasabi_secret_key' => '',
            'wasabi_region' => 'us-east-1',
            'wasabi_bucket' => '',
            'wasabi_url' => '',
            'wasabi_root' => '',
            
            // Currency Settings
            'decimalFormat' => '0', // UGX typically uses 0 decimals
            'defaultCurrency' => 'ugx',
            'decimalSeparator' => '.',
            'thousandsSeparator' => ',',
            'floatNumber' => true,
            'currencySymbolSpace' => false,
            'currencySymbolPosition' => 'before',
            
            // SEO Settings
            'metaKeywords' => 'ecommerce, online store, shopping, multi-store, saas platform, vimstack',
            'metaDescription' => 'Vimstack - A powerful SaaS platform for creating and managing multiple online stores with professional themes and complete e-commerce features.',
            'metaImage' => '/images/logos/logo-dark.svg',
            
            // Cookie Settings
            'enableLogging' => false,
            'strictlyNecessaryCookies' => true,
            'cookieTitle' => 'Cookie Consent',
            'strictlyCookieTitle' => 'Strictly Necessary Cookies',
            'cookieDescription' => 'We use cookies to enhance your browsing experience and provide personalized content.',
            'strictlyCookieDescription' => 'These cookies are essential for the website to function properly.',
            'contactUsDescription' => 'If you have any questions about our cookie policy, please contact us.',
            'contactUsUrl' => 'https://example.com/contact',
        ];
    }
}

if (! function_exists('createDefaultSettings')) {
    /**
     * Create default settings for a user
     *
     * @param int $userId
     * @return void
     */
    function createDefaultSettings($userId)
    {
        $defaults = defaultSettings();
        $settingsData = [];
        
        foreach ($defaults as $key => $value) {
            $settingsData[] = [
                'user_id' => $userId,
                'key' => $key,
                'value' => is_bool($value) ? ($value ? '1' : '0') : (string)$value,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        Setting::insert($settingsData);
    }
}


if (! function_exists('copySettingsFromSuperAdmin')) {
    /**
     * Copy system, brand and currency settings from superadmin to company user
     *
     * @param int $companyUserId
     * @param int|null $storeId
     * @return void
     */
    function copySettingsFromSuperAdmin($companyUserId, $storeId = null)
    {
        $superAdmin = User::where('type', 'superadmin')->first();
        if (!$superAdmin) {
            createDefaultSettings($companyUserId);
            return;
        }
        
        // Settings to copy from superadmin (system, brand and currency settings)
        $settingsToCopy = [
            // System Settings
            'base_url', 'defaultLanguage', 'dateFormat', 'timeFormat', 'calendarStartDay', 
            'defaultTimezone', 'emailVerification',
            // Brand Settings
            'logoLight', 'favicon', 'titleText', 'footerText',
            'themeColor', 'customColor', 'sidebarVariant', 'sidebarStyle',
            'layoutDirection', 'themeMode', 'metaKeywords', 'metaDescription', 'metaImage',
            // Currency Settings
            'decimalFormat', 'defaultCurrency', 'decimalSeparator', 'thousandsSeparator',
            'floatNumber', 'currencySymbolSpace', 'currencySymbolPosition'
        ];
        
        $superAdminSettings = Setting::where('user_id', $superAdmin->id)
            ->whereNull('store_id')
            ->whereIn('key', $settingsToCopy)
            ->get();
        
        // Copy settings from superadmin
        foreach ($superAdminSettings as $setting) {
            Setting::updateOrCreate(
                [
                    'user_id' => $companyUserId,
                    'store_id' => $storeId,
                    'key' => $setting->key
                ],
                ['value' => $setting->value]
            );
        }
        
    }
}

if (! function_exists('getCurrentStoreId')) {
    /**
     * Get the current store ID, handling both demo and production modes
     *
     * @param \App\Models\User|null $user
     * @return int|null
     */
    function getCurrentStoreId($user = null)
    {
        if (!$user) {
            $user = auth()->user();
        }
        
        if (!$user) {
            return null;
        }
        
        // In demo mode, check for cookie first
        if (config('app.is_demo', false) && request()->cookie('demo_store_id')) {
            $storeId = (int) request()->cookie('demo_store_id');
            
            // Verify the store belongs to the user or their creator
            $storeExists = false;
            if ($user->type === 'company') {
                $storeExists = $user->stores->contains('id', $storeId);
            } elseif ($user->type === 'user' && $user->created_by) {
                $creator = \App\Models\User::find($user->created_by);
                if ($creator) {
                    $storeExists = $creator->stores->contains('id', $storeId);
                }
            }
            
            if ($storeExists) {
                return $storeId;
            }
        }
        
        // Fall back to database current_store
        return $user->current_store;
    }
}

if (! function_exists('getSuperadminSettings')) {
    /**
     * Get superadmin settings
     *
     * @param string|null $key Specific setting key to retrieve
     * @return mixed
     */
    function getSuperadminSettings($key = null)
    {
        static $superadminSettings = null;
        
        if ($superadminSettings === null) {
            $superAdmin = User::where('type', 'superadmin')->first();
            if ($superAdmin) {
                $superadminSettings = Setting::where('user_id', $superAdmin->id)
                    ->whereNull('store_id')
                    ->pluck('value', 'key')
                    ->toArray();
                    
                // Add currencySymbol from Currency model if not already set
                if (!isset($superadminSettings['currencySymbol'])) {
                    $currencyCode = $superadminSettings['defaultCurrency'] ?? 'USD';
                    $currency = Currency::where('code', $currencyCode)->first();
                    if ($currency) {
                        $superadminSettings['currencySymbol'] = $currency->symbol;
                    }
                }
            } else {
                $superadminSettings = [];
            }
        }
        
        if ($key) {
            return $superadminSettings[$key] ?? null;
        }
        
        return $superadminSettings;
    }
}

if (! function_exists('formatStoreCurrency')) {
    /**
     * Format currency using store-specific settings
     *
     * @param float|string $amount
     * @param int|null $userId
     * @param int|null $storeId
     * @return string
     */
    function formatStoreCurrency($amount, $userId = null, $storeId = null)
    {
        // Get user and store ID if not provided
        if (is_null($userId) && auth()->check()) {
            $userId = auth()->id();
            if (is_null($storeId)) {
                $storeId = getCurrentStoreId(auth()->user());
            }
        }
        
        // Convert amount to float
        $numAmount = is_string($amount) ? (float)$amount : $amount;
        
        try {
            // Get store-specific currency settings
            $storeSettings = $storeId ? Setting::getUserSettings($userId, $storeId) : [];
            
            // Get currency code from store settings or fall back to global settings
            $currencyCode = $storeSettings['defaultCurrency'] ?? settings($userId)['defaultCurrency'] ?? 'USD';
            
            // Get currency details
            $currency = \App\Models\Currency::where('code', $currencyCode)->first();
            
            // Currency formatting settings
            $symbol = $currency ? $currency->symbol : '$';
            $position = $storeSettings['currencySymbolPosition'] ?? 'before';
            $decimals = (int)($storeSettings['decimalFormat'] ?? 2);
            $decimalSeparator = $storeSettings['decimalSeparator'] ?? '.';
            $thousandsSeparator = $storeSettings['thousandsSeparator'] ?? ',';
            
            // Format the number
            $formattedNumber = number_format($numAmount, $decimals, $decimalSeparator, $thousandsSeparator);
            
            // Return with currency symbol in correct position
            return $position === 'after' 
                ? $formattedNumber . ' ' . $symbol
                : $symbol . ' ' . $formattedNumber;
                
        } catch (\Exception $e) {
            // Fallback to simple formatting
            return '$' . number_format($numAmount, 2);
        }
    }
}

if (! function_exists('getStoreUrl')) {
    /**
     * Generate store URL based on domain settings
     *
     * @param \App\Models\Store|int $store
     * @param string $path
     * @return string
     */
    function getStoreUrl($store, $path = '')
    {
        try {
            if (is_numeric($store)) {
                $store = \App\Models\Store::find($store);
            }
            
            if (!$store) {
                return config('app.url');
            }
        } catch (\Exception $e) {
            return config('app.url');
        }
        
        $path = ltrim($path, '/');
        
        // Check for custom domain first
        if ($store->enable_custom_domain && $store->custom_domain) {
            $protocol = request()->isSecure() ? 'https://' : 'http://';
            $baseUrl = $protocol . $store->custom_domain;
            return $path ? $baseUrl . '/' . $path : $baseUrl;
        }
        
        // Check for custom subdomain
        if ($store->enable_custom_subdomain && $store->custom_subdomain) {
            $protocol = request()->isSecure() ? 'https://' : 'http://';
            $mainDomain = parse_url(config('app.url'), PHP_URL_HOST);
            $baseUrl = $protocol . $store->custom_subdomain . '.' . $mainDomain;
            return $path ? $baseUrl . '/' . $path : $baseUrl;
        }
        
        // Default to regular store route
        $baseUrl = rtrim(config('app.url'), '/') . '/store/' . $store->slug;
        return $path ? $baseUrl . '/' . $path : $baseUrl;
    }
}

if (! function_exists('getStoreQrCodeUrl')) {
    /**
     * Get store URL for QR code generation
     *
     * @param \App\Models\Store|int $store
     * @return string
     */
    function getStoreQrCodeUrl($store)
    {
        return getStoreUrl($store);
    }
}

if (! function_exists('getStoreCopyLinkUrl')) {
    /**
     * Get store URL for copy link functionality
     *
     * @param \App\Models\Store|int $store
     * @return string
     */
    function getStoreCopyLinkUrl($store)
    {
        return getStoreUrl($store);
    }
}

if (! function_exists('getStoreVisitUrl')) {
    /**
     * Get store URL for Visit Store button
     *
     * @param \App\Models\Store|int $store
     * @return string
     */
    function getStoreVisitUrl($store)
    {
        return getStoreUrl($store);
    }
}

if (! function_exists('generateStoreRoutes')) {
    /**
     * Generate store-specific route URLs
     *
     * @param \App\Models\Store|int $store
     * @param string $routeName
     * @param array $parameters
     * @return string
     */
    function generateStoreRoutes($store, $routeName, $parameters = [])
    {
        if (is_numeric($store)) {
            $store = \App\Models\Store::find($store);
        }
        
        if (!$store) {
            return config('app.url');
        }
        
        // Map route names to paths
        $routePaths = [
            'store.home' => '',
            'store.products' => 'products',
            'store.product' => 'products/' . ($parameters['id'] ?? ''),
            'store.category' => 'category/' . ($parameters['slug'] ?? ''),
            'store.cart' => 'cart',
            'store.wishlist' => 'wishlist',
            'store.checkout' => 'checkout',
            'store.blog' => 'blog',
            'store.blog.show' => 'blog/post/' . ($parameters['slug'] ?? ''),
            'store.page' => 'page/' . ($parameters['slug'] ?? ''),
            'store.login' => 'login',
            'store.register' => 'register',
            'store.my-orders' => 'my-orders',
            'store.my-profile' => 'my-profile',
            'store.order-detail' => 'order/' . ($parameters['orderNumber'] ?? ''),
            'store.order-confirmation' => 'order-confirmation/' . ($parameters['orderNumber'] ?? ''),
        ];
        
        $path = $routePaths[$routeName] ?? '';
        return getStoreUrl($store, $path);
    }
}