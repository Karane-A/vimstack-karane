<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\EmailSettingController;
use App\Http\Controllers\Settings\SettingsController;
use App\Http\Controllers\Settings\SystemSettingsController;
use App\Http\Controllers\Settings\CurrencySettingController;
use App\Http\Controllers\PlanOrderController;
use App\Http\Controllers\Settings\PaymentSettingController;
use App\Http\Controllers\Settings\WebhookController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\PayPalPaymentController;
use App\Http\Controllers\BankPaymentController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Settings Routes
|--------------------------------------------------------------------------
|
| Here are the routes for settings management
|
*/

// Payment routes accessible without plan check
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/payment-methods', [PaymentSettingController::class, 'getPaymentMethods'])->name('payment.methods');
    Route::get('/enabled-payment-methods', [PaymentSettingController::class, 'getEnabledMethods'])->name('payment.enabled-methods');
    Route::post('/plan-orders', [PlanOrderController::class, 'create'])->name('plan-orders.create');
    Route::post('/stripe-payment', [StripePaymentController::class, 'processPayment'])->name('settings.stripe.payment');
    Route::post('/paypal-payment', [PayPalPaymentController::class, 'processPayment'])->name('paypal.payment');
    Route::post('/bank-payment', [BankPaymentController::class, 'processPayment'])->name('bank.payment');
});

Route::middleware(['auth', 'verified', 'plan.access'])->group(function () {
    // Payment Settings (admin and company users)
    Route::post('/payment-settings', [PaymentSettingController::class, 'store'])->name('payment.settings');
    Route::post('/test-telegram', [PaymentSettingController::class, 'testTelegram'])->name('payment.test-telegram');
    
    // Profile settings page with profile and password sections
    Route::get('profile', function () {
        return Inertia::render('settings/profile-settings');
    })->name('profile');

    // Routes for form submissions
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('profile', [ProfileController::class, 'update']); // For file uploads with method spoofing
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::put('profile/password', [PasswordController::class, 'update'])->name('password.update');

    // Email settings page
    Route::get('settings/email', function () {
        return Inertia::render('settings/components/email-settings');
    })->name('settings.email');
    
    // Email settings routes
    Route::get('settings/email/get', [EmailSettingController::class, 'getEmailSettings'])->name('settings.email.get');
    Route::post('settings/email/update', [EmailSettingController::class, 'updateEmailSettings'])->name('settings.email.update');
    Route::post('settings/email/test', [EmailSettingController::class, 'sendTestEmail'])->name('settings.email.test');
  
    // General settings page with system and company settings - require any settings permissions
    Route::get('settings', [SettingsController::class, 'index'])
        ->middleware('role_or_permission:superadmin|manage-settings|manage-system-settings|manage-email-settings|manage-brand-settings|manage-company-settings|manage-storage-settings|manage-payment-settings|manage-currency-settings|manage-recaptcha-settings|manage-chatgpt-settings|manage-seo-settings|manage-cache-settings|manage-account-settings|manage-webhook-settings')
        ->name('settings');
    
    // System Settings routes
    Route::post('settings/system', [SystemSettingsController::class, 'update'])->name('settings.system.update');
    Route::post('settings/brand', [SystemSettingsController::class, 'updateBrand'])->name('settings.brand.update');
    Route::post('settings/storage', [SystemSettingsController::class, 'updateStorage'])->name('settings.storage.update');
    Route::post('settings/recaptcha', [SystemSettingsController::class, 'updateRecaptcha'])->name('settings.recaptcha.update');
    Route::post('settings/chatgpt', [SystemSettingsController::class, 'updateChatgpt'])->name('settings.chatgpt.update');
    Route::post('settings/cookie', [SystemSettingsController::class, 'updateCookie'])
        ->middleware('role_or_permission:superadmin|manage-cookie-settings')
        ->name('settings.cookie.update');
    Route::post('settings/seo', [SystemSettingsController::class, 'updateSeo'])->name('settings.seo.update');
    Route::post('settings/cache/clear', [SystemSettingsController::class, 'clearCache'])->name('settings.cache.clear');
    
    // Currency Settings routes
    Route::post('settings/currency', [CurrencySettingController::class, 'update'])->name('settings.currency.update');
    
    // Email Notification Settings routes
    Route::post('email-notification-settings-save', [SystemSettingsController::class, 'mailNotificationStore'])->name('email.notification.setting.store');
    
    // Webhook Settings routes
    // Route::get('settings/webhooks', [WebhookController::class, 'index'])->name('settings.webhooks.index');
    // Route::post('settings/webhooks', [WebhookController::class, 'store'])->name('settings.webhooks.store');
    // Route::put('settings/webhooks/{webhook}', [WebhookController::class, 'update'])->name('settings.webhooks.update');
    // Route::delete('settings/webhooks/{webhook}', [WebhookController::class, 'destroy'])->name('settings.webhooks.destroy');
    

});