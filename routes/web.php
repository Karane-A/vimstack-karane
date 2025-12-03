<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PlanOrderController;
use App\Http\Controllers\PlanRequestController;
use App\Http\Controllers\RoleController;

use App\Http\Controllers\ReferralController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CompanyController;



use App\Http\Controllers\CouponController;

use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\ImpersonateController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\LandingPageController;

use App\Http\Controllers\LandingPage\CustomPageController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\RazorpayController;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\PayPalPaymentController;
use App\Http\Controllers\BankPaymentController;
use App\Http\Controllers\PaystackPaymentController;
use App\Http\Controllers\FlutterwavePaymentController;
use App\Http\Controllers\PayTabsPaymentController;
use App\Http\Controllers\SkrillPaymentController;
use App\Http\Controllers\CoinGatePaymentController;
use App\Http\Controllers\PayfastPaymentController;
use App\Http\Controllers\TapPaymentController;
use App\Http\Controllers\XenditPaymentController;
use App\Http\Controllers\PayTRPaymentController;
use App\Http\Controllers\MolliePaymentController;
use App\Http\Controllers\ToyyibPayPaymentController;
use App\Http\Controllers\CashfreeController;
use App\Http\Controllers\IyzipayPaymentController;
use App\Http\Controllers\BenefitPaymentController;
use App\Http\Controllers\OzowPaymentController;
use App\Http\Controllers\EasebuzzPaymentController;
use App\Http\Controllers\KhaltiPaymentController;
use App\Http\Controllers\AuthorizeNetPaymentController;
use App\Http\Controllers\FedaPayPaymentController;
use App\Http\Controllers\PayHerePaymentController;
use App\Http\Controllers\CinetPayPaymentController;
use App\Http\Controllers\PaiementPaymentController;
use App\Http\Controllers\NepalstePaymentController;
use App\Http\Controllers\YooKassaPaymentController;
use App\Http\Controllers\AamarpayPaymentController;
use App\Http\Controllers\MidtransPaymentController;
use App\Http\Controllers\PaymentWallPaymentController;
use App\Http\Controllers\SSPayPaymentController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\StoreContentController;


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Main landing page
Route::get('/', [LandingPageController::class, 'show'])->name('home');

// Cart API routes
Route::prefix('api/cart')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\CartController::class, 'index'])->name('api.cart.index');
    Route::post('/add', [\App\Http\Controllers\Api\CartController::class, 'add'])->name('api.cart.add');
    Route::put('/{id}', [\App\Http\Controllers\Api\CartController::class, 'update'])->name('api.cart.update');
    Route::delete('/{id}', [\App\Http\Controllers\Api\CartController::class, 'remove'])->name('api.cart.remove');
    Route::post('/sync', [\App\Http\Controllers\Api\CartController::class, 'sync'])->name('api.cart.sync');
});

// Coupon API routes
Route::prefix('api/coupon')->group(function () {
    Route::post('/validate', [\App\Http\Controllers\Api\CouponController::class, 'validate'])->name('api.coupon.validate');
});

// Wishlist API routes
Route::prefix('api/wishlist')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\WishlistController::class, 'index'])->name('api.wishlist.index');
    Route::post('/add', [\App\Http\Controllers\Api\WishlistController::class, 'add'])->name('api.wishlist.add');
    Route::delete('/{id}', [\App\Http\Controllers\Api\WishlistController::class, 'remove'])->name('api.wishlist.remove');
    Route::post('/toggle', [\App\Http\Controllers\Api\WishlistController::class, 'toggle'])->name('api.wishlist.toggle');
});

// Review API routes
Route::prefix('api/reviews')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\ReviewController::class, 'index'])->name('api.reviews.index');
    Route::post('/', [\App\Http\Controllers\Api\ReviewController::class, 'store'])->name('api.reviews.store');
});

// Newsletter API routes
Route::post('api/newsletter/subscribe', [\App\Http\Controllers\Api\NewsletterController::class, 'subscribe'])->name('api.newsletter.subscribe');

// WhatsApp API routes
Route::post('api/clear-whatsapp-session', function() {
    session()->forget(['whatsapp_redirect_url', 'whatsapp_order_id']);
    return response()->json(['success' => true]);
});

// Location API routes
Route::prefix('api/locations')->group(function () {
    Route::get('countries', [\App\Http\Controllers\Api\LocationController::class, 'getCountries'])->name('api.locations.countries');
    Route::get('states/{countryId}', [\App\Http\Controllers\Api\LocationController::class, 'getStatesByCountry'])->name('api.locations.states');
    Route::get('cities/{stateId}', [\App\Http\Controllers\Api\LocationController::class, 'getCitiesByState'])->name('api.locations.cities');
});

// PWA routes (outside middleware to avoid conflicts)
Route::get('store/{storeSlug}/manifest.json', [\App\Http\Controllers\PWAController::class, 'manifest'])->name('store.pwa.manifest');
Route::get('store/{storeSlug}/service-worker', [\App\Http\Controllers\PWAController::class, 'serviceWorker'])->name('store.pwa.sw');

// Store frontend routes with store prefix
Route::prefix('store/{storeSlug}')->middleware('store.status')->group(function () {
    // Main store routes
    Route::get('/', [ThemeController::class, 'home'])->name('store.home');
    Route::get('/products', [ThemeController::class, 'products'])->name('store.products');
    Route::get('/product/{id}', [ThemeController::class, 'product'])->name('store.product');
    Route::get('/category/{slug}', [ThemeController::class, 'category'])->name('store.category');
    Route::get('/wishlist', [ThemeController::class, 'wishlist'])->name('store.wishlist');
    Route::get('/cart', [ThemeController::class, 'cart'])->name('store.cart');
    Route::get('/page/{slug}', [ThemeController::class, 'customPage'])->name('store.page');
    
    // Auth routes
    Route::match(['GET', 'POST'], '/login', [\App\Http\Controllers\Store\AuthController::class, 'login'])->name('store.login');
    Route::match(['GET', 'POST'], '/register', [\App\Http\Controllers\Store\AuthController::class, 'register'])->name('store.register');
    Route::post('/logout', [\App\Http\Controllers\Store\AuthController::class, 'logout'])->name('store.logout');
    
    // Profile routes
    Route::post('/profile/update', [\App\Http\Controllers\Store\ProfileController::class, 'updateProfile'])->name('store.profile.update');
    Route::post('/profile/password', [\App\Http\Controllers\Store\ProfileController::class, 'updatePassword'])->name('store.profile.password');
    
    // Order routes
    Route::post('/order/place', [\App\Http\Controllers\Store\OrderController::class, 'placeOrder'])->name('store.order.place');
    Route::get('/order/success/{orderNumber}', [ThemeController::class, 'orderConfirmation'])->name('order.success');
    Route::get('/stripe/success/{orderNumber}', [\App\Http\Controllers\Store\StripeController::class, 'success'])->name('store.stripe.success');
    Route::get('/paypal/success/{orderNumber}', [\App\Http\Controllers\Store\PayPalController::class, 'success'])->name('store.paypal.success');
    Route::get('/payfast/success/{orderNumber}', [\App\Http\Controllers\Store\PayFastController::class, 'success'])->name('store.payfast.success');
    Route::get('/mercadopago/success/{orderNumber}', [\App\Http\Controllers\Store\MercadoPagoController::class, 'success'])->name('store.mercadopago.success');
    Route::post('/cashfree/verify-payment', [\App\Http\Controllers\Store\CashfreeController::class, 'verifyPayment'])->name('store.cashfree.verify-payment');
    Route::get('/forgot-password', [ThemeController::class, 'forgotPassword'])->name('store.forgot-password');
    Route::get('/reset-password/{token}', [ThemeController::class, 'resetPassword'])->name('store.reset-password');
    
    // Account routes
    Route::get('/my-orders', [ThemeController::class, 'myOrders'])->name('store.my-orders');
    Route::get('/order/{orderNumber}', [ThemeController::class, 'orderDetail'])->name('store.order-detail');
    Route::get('/my-profile', [ThemeController::class, 'myProfile'])->name('store.my-profile');
    
    // Checkout routes
    Route::get('/checkout', [ThemeController::class, 'checkout'])->name('store.checkout');
    Route::get('/order-confirmation/{orderNumber?}', [ThemeController::class, 'orderConfirmation'])->name('store.order-confirmation');
    
    // Blog routes
    Route::get('/blog', [ThemeController::class, 'blog'])->name('store.blog');
    Route::get('/blog/post/{slug}', [ThemeController::class, 'blogPost'])->name('store.blog.show')->where('slug', '[a-z0-9\-]+');
});

// Legacy route for backward compatibility
Route::get('/home-accessories', function() {
    return redirect()->route('store.home', ['storeSlug' => 'home-accessories']);
})->name('store.demo');



// Public form submission routes


// Cashfree webhook (public route)
Route::post('cashfree/webhook', [CashfreeController::class, 'webhook'])->name('cashfree.webhook');

// Benefit webhook (public route)
Route::post('benefit/webhook', [BenefitPaymentController::class, 'webhook'])->name('benefit.webhook');
Route::get('payments/benefit/success', [BenefitPaymentController::class, 'success'])->name('benefit.success');
Route::post('payments/benefit/callback', [BenefitPaymentController::class, 'callback'])->name('benefit.callback');

// FedaPay callback (public route)
Route::match(['GET', 'POST'], 'payments/fedapay/callback', [FedaPayPaymentController::class, 'callback'])->name('fedapay.callback');

// YooKassa success/callback (public routes)
Route::get('payments/yookassa/success', [YooKassaPaymentController::class, 'success'])->name('yookassa.success');
Route::post('payments/yookassa/callback', [YooKassaPaymentController::class, 'callback'])->name('yookassa.callback');

// Nepalste success/callback (public routes)
Route::get('payments/nepalste/success', [NepalstePaymentController::class, 'success'])->name('nepalste.success');
Route::post('payments/nepalste/callback', [NepalstePaymentController::class, 'callback'])->name('nepalste.callback');



// PayTR callback (public route)
Route::post('payments/paytr/callback', [PayTRPaymentController::class, 'callback'])->name('paytr.callback');

// PayTabs callback (public route)
Route::match(['GET', 'POST'], 'payments/paytabs/callback', [PayTabsPaymentController::class, 'callback'])->name('paytabs.callback');
Route::get('payments/paytabs/success', [PayTabsPaymentController::class, 'success'])->name('paytabs.success');

// Tap payment routes (public routes)
Route::get('payments/tap/success', [TapPaymentController::class, 'success'])->name('tap.success');
Route::post('payments/tap/callback', [TapPaymentController::class, 'callback'])->name('tap.callback');

// Aamarpay payment routes (public routes)
Route::match(['GET', 'POST'], 'payments/aamarpay/success', [AamarpayPaymentController::class, 'success'])->name('aamarpay.success');
Route::post('payments/aamarpay/callback', [AamarpayPaymentController::class, 'callback'])->name('aamarpay.callback');

// PaymentWall callback (public route)
Route::match(['GET', 'POST'], 'payments/paymentwall/callback', [PaymentWallPaymentController::class, 'callback'])->name('paymentwall.callback');
Route::get('payments/paymentwall/success', [PaymentWallPaymentController::class, 'success'])->name('paymentwall.success');

// PayFast payment routes (public routes)
Route::get('payments/payfast/success', [PayfastPaymentController::class, 'success'])->name('payfast.success');
Route::post('payments/payfast/callback', [PayfastPaymentController::class, 'callback'])->name('payfast.callback');

// PayFast store checkout callback (public route)
Route::post('store/payfast/callback', [\App\Http\Controllers\Store\PayFastController::class, 'callback'])->name('store.payfast.callback');

// MercadoPago store checkout callback (public route)
Route::post('store/mercadopago/callback', [\App\Http\Controllers\Store\MercadoPagoController::class, 'callback'])->name('store.mercadopago.callback');

// Cashfree store checkout callback (public route)
Route::post('store/cashfree/webhook', [\App\Http\Controllers\Store\CashfreeController::class, 'webhook'])->name('store.cashfree.webhook');

// Razorpay store checkout routes (public routes)
Route::post('store/{storeSlug}/razorpay/verify-payment', [\App\Http\Controllers\Store\RazorpayController::class, 'verifyPayment'])->name('store.razorpay.verify');
Route::post('store/razorpay/webhook', [\App\Http\Controllers\Store\RazorpayController::class, 'webhook'])->name('store.razorpay.webhook');

// CoinGate callback (public route)
Route::match(['GET', 'POST'], 'payments/coingate/callback', [CoinGatePaymentController::class, 'callback'])->name('coingate.callback');

// Xendit payment routes (public routes)
Route::get('payments/xendit/success', [XenditPaymentController::class, 'success'])->name('xendit.success');
Route::post('payments/xendit/callback', [XenditPaymentController::class, 'callback'])->name('xendit.callback');





Route::get('/landing-page', [LandingPageController::class, 'settings'])->name('landing-page');
Route::post('/landing-page/contact', [LandingPageController::class, 'submitContact'])->name('landing-page.contact');
Route::post('/landing-page/contacts', [\App\Http\Controllers\LandingPage\ContactController::class, 'store'])->name('landing-page.contacts.store');
Route::post('/landing-page/subscribe', [LandingPageController::class, 'subscribe'])->name('landing-page.subscribe');
Route::get('/page/{slug}', [CustomPageController::class, 'show'])->name('custom-page.show');

Route::get('/translations/{locale}', [TranslationController::class, 'getTranslations'])->name('translations');





// Trial route with permission middleware
Route::middleware(['auth', 'permission:trial-plans'])->group(function () {
    Route::post('plans/trial', [PlanController::class, 'startTrial'])->name('plans.trial');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Plans routes - accessible without plan check but require view-plans permission
    Route::get('plans', [PlanController::class, 'index'])->middleware('permission:view-plans')->name('plans.index');
    Route::post('plans/request', [PlanController::class, 'requestPlan'])->middleware('permission:request-plans')->name('plans.request');
    Route::post('plans/subscribe', [PlanController::class, 'subscribe'])->middleware('permission:subscribe-plans')->name('plans.subscribe');
    Route::post('plans/coupons/validate', [CouponController::class, 'validate'])->name('coupons.validate');
    
    // Payment routes - accessible without plan check
    Route::post('payments/stripe', [StripePaymentController::class, 'processPayment'])->name('stripe.payment');
    Route::post('payments/paypal', [PayPalPaymentController::class, 'processPayment'])->name('paypal.payment.web');
    Route::post('payments/bank', [BankPaymentController::class, 'processPayment'])->name('bank.payment.web');


    Route::post('payments/paystack', [PaystackPaymentController::class, 'processPayment'])->name('paystack.payment');
    Route::post('payments/flutterwave', [FlutterwavePaymentController::class, 'processPayment'])->name('flutterwave.payment');
    Route::post('payments/paytabs', [PayTabsPaymentController::class, 'processPayment'])->name('paytabs.payment');
    Route::post('payments/skrill', [SkrillPaymentController::class, 'processPayment'])->name('skrill.payment');
    Route::post('payments/coingate', [CoinGatePaymentController::class, 'processPayment'])->name('coingate.payment');
    Route::post('payments/payfast', [PayfastPaymentController::class, 'processPayment'])->name('payfast.payment');
    Route::post('payments/mollie', [MolliePaymentController::class, 'processPayment'])->name('mollie.payment');
    Route::post('payments/toyyibpay', [ToyyibPayPaymentController::class, 'processPayment'])->name('toyyibpay.payment');
    Route::post('payments/iyzipay', [IyzipayPaymentController::class, 'processPayment'])->name('iyzipay.payment');
    Route::post('payments/benefit', [BenefitPaymentController::class, 'processPayment'])->name('benefit.payment');
    Route::post('payments/ozow', [OzowPaymentController::class, 'processPayment'])->name('ozow.payment');
    Route::post('payments/easebuzz', [EasebuzzPaymentController::class, 'processPayment'])->name('easebuzz.payment');
    Route::post('payments/khalti', [KhaltiPaymentController::class, 'processPayment'])->name('khalti.payment');
    Route::post('payments/authorizenet', [AuthorizeNetPaymentController::class, 'processPayment'])->name('authorizenet.payment');
    Route::post('payments/fedapay', [FedaPayPaymentController::class, 'processPayment'])->name('fedapay.payment');
    Route::post('payments/payhere', [PayHerePaymentController::class, 'processPayment'])->name('payhere.payment');
    Route::post('payments/cinetpay', [CinetPayPaymentController::class, 'processPayment'])->name('cinetpay.payment');
    Route::post('payments/paiement', [PaiementPaymentController::class, 'processPayment'])->name('paiement.payment');
    Route::post('payments/nepalste', [NepalstePaymentController::class, 'processPayment'])->name('nepalste.payment');
    Route::post('payments/yookassa', [YooKassaPaymentController::class, 'processPayment'])->name('yookassa.payment');
    Route::post('payments/aamarpay', [AamarpayPaymentController::class, 'processPayment'])->name('aamarpay.payment');
    Route::post('payments/midtrans', [MidtransPaymentController::class, 'processPayment'])->name('midtrans.payment');
    Route::post('payments/paymentwall', [PaymentWallPaymentController::class, 'processPayment'])->name('paymentwall.payment');
    Route::post('payments/sspay', [SSPayPaymentController::class, 'processPayment'])->name('sspay.payment');
    
    // Payment gateway specific routes
    Route::post('razorpay/create-order', [RazorpayController::class, 'createOrder'])->name('razorpay.create-order');
    Route::post('razorpay/verify-payment', [RazorpayController::class, 'verifyPayment'])->name('razorpay.verify-payment');
    Route::post('cashfree/create-session', [CashfreeController::class, 'createPaymentSession'])->name('cashfree.create-session');
    Route::post('cashfree/verify-payment', [CashfreeController::class, 'verifyPayment'])->name('cashfree.verify-payment');
    Route::post('mercadopago/create-preference', [MercadoPagoController::class, 'createPreference'])->name('mercadopago.create-preference');
    Route::post('mercadopago/process-payment', [MercadoPagoController::class, 'processPayment'])->name('mercadopago.process-payment');
    
    // Other payment creation routes
    Route::post('tap/create-payment', [TapPaymentController::class, 'createPayment'])->name('tap.create-payment');
    Route::post('xendit/create-payment', [XenditPaymentController::class, 'createPayment'])->name('xendit.create-payment');
    Route::post('payments/paytr/create-token', [PayTRPaymentController::class, 'createPaymentToken'])->name('paytr.create-token');
    Route::post('iyzipay/create-form', [IyzipayPaymentController::class, 'createPaymentForm'])->name('iyzipay.create-form');
    Route::post('benefit/create-session', [BenefitPaymentController::class, 'createPaymentSession'])->name('benefit.create-session');
    Route::post('ozow/create-payment', [OzowPaymentController::class, 'createPayment'])->name('ozow.create-payment');
    Route::post('easebuzz/create-payment', [EasebuzzPaymentController::class, 'createPayment'])->name('easebuzz.create-payment');
    Route::post('khalti/create-payment', [KhaltiPaymentController::class, 'createPayment'])->name('khalti.create-payment');
    Route::post('authorizenet/create-form', [AuthorizeNetPaymentController::class, 'createPaymentForm'])->name('authorizenet.create-form');
    Route::post('fedapay/create-payment', [FedaPayPaymentController::class, 'createPayment'])->name('fedapay.create-payment');
    Route::post('payhere/create-payment', [PayHerePaymentController::class, 'createPayment'])->name('payhere.create-payment');
    Route::post('cinetpay/create-payment', [CinetPayPaymentController::class, 'createPayment'])->name('cinetpay.create-payment');
    Route::post('paiement/create-payment', [PaiementPaymentController::class, 'createPayment'])->name('paiement.create-payment');
    Route::post('nepalste/create-payment', [NepalstePaymentController::class, 'createPayment'])->name('nepalste.create-payment');
    Route::post('yookassa/create-payment', [YooKassaPaymentController::class, 'createPayment'])->name('yookassa.create-payment');
    Route::post('aamarpay/create-payment', [AamarpayPaymentController::class, 'createPayment'])->name('aamarpay.create-payment');
    Route::post('midtrans/create-payment', [MidtransPaymentController::class, 'createPayment'])->name('midtrans.create-payment');
    Route::post('paymentwall/create-payment', [PaymentWallPaymentController::class, 'createPayment'])->name('paymentwall.create-payment');
    Route::post('sspay/create-payment', [SSPayPaymentController::class, 'createPayment'])->name('sspay.create-payment');
    
    // Payment success/callback routes
    Route::post('payments/skrill/callback', [SkrillPaymentController::class, 'callback'])->name('skrill.callback');
    Route::get('payments/paytr/success', [PayTRPaymentController::class, 'success'])->name('paytr.success');
    Route::get('payments/paytr/failure', [PayTRPaymentController::class, 'failure'])->name('paytr.failure');
    Route::get('payments/mollie/success', [MolliePaymentController::class, 'success'])->name('mollie.success');
    Route::post('payments/mollie/callback', [MolliePaymentController::class, 'callback'])->name('mollie.callback');
    Route::match(['GET', 'POST'], 'payments/toyyibpay/success', [ToyyibPayPaymentController::class, 'success'])->name('toyyibpay.success');
    Route::post('payments/toyyibpay/callback', [ToyyibPayPaymentController::class, 'callback'])->name('toyyibpay.callback');
    Route::post('payments/iyzipay/callback', [IyzipayPaymentController::class, 'callback'])->name('iyzipay.callback');
    Route::get('payments/ozow/success', [OzowPaymentController::class, 'success'])->name('ozow.success');
    Route::post('payments/ozow/callback', [OzowPaymentController::class, 'callback'])->name('ozow.callback');
    Route::get('payments/payhere/success', [PayHerePaymentController::class, 'success'])->name('payhere.success');
    Route::post('payments/payhere/callback', [PayHerePaymentController::class, 'callback'])->name('payhere.callback');
    Route::get('payments/cinetpay/success', [CinetPayPaymentController::class, 'success'])->name('cinetpay.success');
    Route::post('payments/cinetpay/callback', [CinetPayPaymentController::class, 'callback'])->name('cinetpay.callback');
    Route::get('payments/paiement/success', [PaiementPaymentController::class, 'success'])->name('paiement.success');
    Route::post('payments/paiement/callback', [PaiementPaymentController::class, 'callback'])->name('paiement.callback');
    Route::post('payments/midtrans/callback', [MidtransPaymentController::class, 'callback'])->name('midtrans.callback');
    Route::post('paymentwall/process', [PaymentWallPaymentController::class, 'processPayment'])->name('paymentwall.process');
    Route::get('payments/sspay/success', [SSPayPaymentController::class, 'success'])->name('sspay.success');
    Route::post('payments/sspay/callback', [SSPayPaymentController::class, 'callback'])->name('sspay.callback');
    Route::get('mercadopago/success', [MercadoPagoController::class, 'success'])->name('mercadopago.success');
    Route::get('mercadopago/failure', [MercadoPagoController::class, 'failure'])->name('mercadopago.failure');
    Route::get('mercadopago/pending', [MercadoPagoController::class, 'pending'])->name('mercadopago.pending');
    Route::post('mercadopago/webhook', [MercadoPagoController::class, 'webhook'])->name('mercadopago.webhook');
    Route::post('authorizenet/test-connection', [AuthorizeNetPaymentController::class, 'testConnection'])->name('authorizenet.test-connection');


    
    // Plan Requests and Orders - accessible without plan check since users need these to manage plans
    Route::get('plan-requests', [PlanRequestController::class, 'index'])->middleware('role_or_permission:superadmin|manage-plan-requests|view-plan-requests')->name('plan-requests.index');
    Route::get('plan-orders', [PlanOrderController::class, 'index'])->middleware('role_or_permission:superadmin|manage-plan-orders|view-plan-orders')->name('plan-orders.index');
    
    // All other routes require plan access check
    Route::middleware('plan.access')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('dashboard/redirect', [DashboardController::class, 'redirectToFirstAvailablePage'])->name('dashboard.redirect');
        Route::get('dashboard/export', [DashboardController::class, 'export'])->middleware('permission:export-dashboard')->name('dashboard.export');
        
        // Store Content Management routes with permissions (MUST come before stores/{id})
        Route::middleware('permission:manage-store-content')->group(function () {
            Route::get('stores/content', [StoreContentController::class, 'index'])->middleware('permission:view-store-content')->name('stores.content.index');
            Route::get('stores/content/{storeId}', [StoreContentController::class, 'show'])->middleware('permission:view-store-content')->name('stores.content.show');
            Route::put('stores/content/{storeId}', [StoreContentController::class, 'update'])->middleware('permission:edit-store-content')->name('stores.content.update');
        });
        
        // Store Management routes with permissions
        Route::middleware('permission:manage-stores')->group(function () {
            Route::get('stores', [\App\Http\Controllers\StoreController::class, 'index'])->middleware('permission:view-stores')->name('stores.index');
            Route::get('stores/export', [\App\Http\Controllers\StoreController::class, 'export'])->middleware('permission:export-stores')->name('stores.export');
            Route::get('stores/create', [\App\Http\Controllers\StoreController::class, 'create'])->middleware('permission:create-stores')->name('stores.create');
            Route::post('stores', [\App\Http\Controllers\StoreController::class, 'store'])->middleware('permission:create-stores')->name('stores.store');
            Route::get('stores/{id}/edit', [\App\Http\Controllers\StoreController::class, 'edit'])->middleware('permission:edit-stores')->name('stores.edit');
            Route::put('stores/{id}', [\App\Http\Controllers\StoreController::class, 'update'])->middleware('permission:edit-stores')->name('stores.update');
            Route::delete('stores/{id}', [\App\Http\Controllers\StoreController::class, 'destroy'])->middleware('permission:delete-stores')->name('stores.destroy');
            Route::get('stores/{id}', [\App\Http\Controllers\StoreController::class, 'show'])->middleware('permission:view-stores')->name('stores.show');

        });
        
        Route::get('stores/{id}/settings', [\App\Http\Controllers\StoreSettingsController::class, 'show'])->name('stores.settings');
        Route::put('stores/{id}/settings', [\App\Http\Controllers\StoreSettingsController::class, 'update'])->name('stores.settings.update');
        
        // Product Management routes with permissions
        Route::middleware('permission:manage-products')->group(function () {
            Route::get('products', [\App\Http\Controllers\ProductController::class, 'index'])->middleware('permission:view-products')->name('products.index');
            Route::get('products/export', [\App\Http\Controllers\ProductController::class, 'export'])->middleware('permission:export-products')->name('products.export');
            Route::get('products/create', [\App\Http\Controllers\ProductController::class, 'create'])->middleware('permission:create-products')->name('products.create');
            Route::post('products', [\App\Http\Controllers\ProductController::class, 'store'])->middleware('permission:create-products')->name('products.store');
            Route::get('products/{id}/edit', [\App\Http\Controllers\ProductController::class, 'edit'])->middleware('permission:edit-products')->name('products.edit');
            Route::put('products/{id}', [\App\Http\Controllers\ProductController::class, 'update'])->middleware('permission:edit-products')->name('products.update');
            Route::delete('products/{id}', [\App\Http\Controllers\ProductController::class, 'destroy'])->middleware('permission:delete-products')->name('products.destroy');
            Route::get('products/{id}', [\App\Http\Controllers\ProductController::class, 'show'])->middleware('permission:view-products')->name('products.show');

        });
        
        // Categories Management routes with permissions
        Route::middleware('permission:manage-categories')->group(function () {
            Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'index'])->middleware('permission:view-categories')->name('categories.index');
            Route::get('categories/export', [\App\Http\Controllers\CategoryController::class, 'export'])->middleware('permission:export-categories')->name('categories.export');
            Route::get('categories/create', [\App\Http\Controllers\CategoryController::class, 'create'])->middleware('permission:create-categories')->name('categories.create');
            Route::post('categories', [\App\Http\Controllers\CategoryController::class, 'store'])->middleware('permission:create-categories')->name('categories.store');
            Route::get('categories/{id}/edit', [\App\Http\Controllers\CategoryController::class, 'edit'])->middleware('permission:edit-categories')->name('categories.edit');
            Route::put('categories/{id}', [\App\Http\Controllers\CategoryController::class, 'update'])->middleware('permission:edit-categories')->name('categories.update');
            Route::delete('categories/{id}', [\App\Http\Controllers\CategoryController::class, 'destroy'])->middleware('permission:delete-categories')->name('categories.destroy');
            Route::get('categories/{id}', [\App\Http\Controllers\CategoryController::class, 'show'])->middleware('permission:view-categories')->name('categories.show');
        });
        
        // Tax Management routes with permissions
        Route::middleware('permission:manage-tax')->group(function () {
            Route::get('tax', [\App\Http\Controllers\TaxController::class, 'index'])->middleware('permission:view-tax')->name('tax.index');
            Route::get('tax/export', [\App\Http\Controllers\TaxController::class, 'export'])->middleware('permission:export-tax')->name('tax.export');
            Route::get('tax/create', [\App\Http\Controllers\TaxController::class, 'create'])->middleware('permission:create-tax')->name('tax.create');
            Route::post('tax', [\App\Http\Controllers\TaxController::class, 'store'])->middleware('permission:create-tax')->name('tax.store');
            Route::get('tax/{id}/edit', [\App\Http\Controllers\TaxController::class, 'edit'])->middleware('permission:edit-tax')->name('tax.edit');
            Route::put('tax/{id}', [\App\Http\Controllers\TaxController::class, 'update'])->middleware('permission:edit-tax')->name('tax.update');
            Route::delete('tax/{id}', [\App\Http\Controllers\TaxController::class, 'destroy'])->middleware('permission:delete-tax')->name('tax.destroy');
            Route::get('tax/{id}', [\App\Http\Controllers\TaxController::class, 'show'])->middleware('permission:view-tax')->name('tax.show');
        });
        
        // Coupon System routes with permissions
        Route::middleware('permission:manage-coupon-system')->group(function () {
            Route::get('coupon-system', [\App\Http\Controllers\StoreCouponController::class, 'index'])->middleware('permission:view-coupon-system')->name('coupon-system.index');
            Route::get('coupon-system/export', [\App\Http\Controllers\StoreCouponController::class, 'export'])->middleware('permission:export-coupon-system')->name('coupon-system.export');
            Route::get('coupon-system/create', function () {
                return Inertia::render('coupon-system/create');
            })->middleware('permission:create-coupon-system')->name('coupon-system.create');
            Route::get('coupon-system/{id}/edit', function ($id) {
                $user = Auth::user();
                $currentStoreId = getCurrentStoreId($user);
                $coupon = \App\Models\StoreCoupon::where('store_id', $currentStoreId)->findOrFail($id);
                return Inertia::render('coupon-system/edit', [
                    'coupon' => $coupon
                ]);
            })->middleware('permission:edit-coupon-system')->name('coupon-system.edit');
            Route::get('coupon-system/{id}', function ($id) {
                $user = Auth::user();
                $currentStoreId = getCurrentStoreId($user);
                $coupon = \App\Models\StoreCoupon::where('store_id', $currentStoreId)->findOrFail($id);
                return Inertia::render('coupon-system/show', [
                    'coupon' => $coupon
                ]);
            })->middleware('permission:view-coupon-system')->name('coupon-system.show');
            Route::post('store-coupons', [\App\Http\Controllers\StoreCouponController::class, 'store'])->middleware('permission:create-coupon-system')->name('store-coupons.store');
            Route::get('store-coupons/{storeCoupon}', [\App\Http\Controllers\StoreCouponController::class, 'show'])->middleware('permission:view-coupon-system')->name('store-coupons.show');
            Route::put('store-coupons/{storeCoupon}', [\App\Http\Controllers\StoreCouponController::class, 'update'])->middleware('permission:edit-coupon-system')->name('store-coupons.update');
            Route::delete('store-coupons/{storeCoupon}', [\App\Http\Controllers\StoreCouponController::class, 'destroy'])->middleware('permission:delete-coupon-system')->name('store-coupons.destroy');
            Route::post('store-coupons/{storeCoupon}/toggle-status', [\App\Http\Controllers\StoreCouponController::class, 'toggleStatus'])->middleware('permission:toggle-status-coupon-system')->name('store-coupons.toggle-status');
            Route::post('store-coupons/validate', [\App\Http\Controllers\StoreCouponController::class, 'validate'])->name('store-coupons.validate');
        });
        
        // Shipping Management routes with permissions
        Route::middleware('permission:manage-shipping')->group(function () {
            Route::get('shipping', [\App\Http\Controllers\ShippingController::class, 'index'])->middleware('permission:view-shipping')->name('shipping.index');
            Route::get('shipping/export', [\App\Http\Controllers\ShippingController::class, 'export'])->middleware('permission:export-shipping')->name('shipping.export');
            Route::get('shipping/create', [\App\Http\Controllers\ShippingController::class, 'create'])->middleware('permission:create-shipping')->name('shipping.create');
            Route::post('shipping', [\App\Http\Controllers\ShippingController::class, 'store'])->middleware('permission:create-shipping')->name('shipping.store');
            Route::get('shipping/{id}/edit', [\App\Http\Controllers\ShippingController::class, 'edit'])->middleware('permission:edit-shipping')->name('shipping.edit');
            Route::put('shipping/{id}', [\App\Http\Controllers\ShippingController::class, 'update'])->middleware('permission:edit-shipping')->name('shipping.update');
            Route::delete('shipping/{id}', [\App\Http\Controllers\ShippingController::class, 'destroy'])->middleware('permission:delete-shipping')->name('shipping.destroy');
            Route::get('shipping/{id}', [\App\Http\Controllers\ShippingController::class, 'show'])->middleware('permission:view-shipping')->name('shipping.show');
        });
        
        // Customer Management routes with permissions
        Route::middleware('permission:manage-customers')->group(function () {
            Route::get('customers', [\App\Http\Controllers\CustomerController::class, 'index'])->middleware('permission:view-customers')->name('customers.index');
            Route::get('customers/export', [\App\Http\Controllers\CustomerController::class, 'export'])->middleware('permission:export-customers')->name('customers.export');
            Route::get('customers/create', [\App\Http\Controllers\CustomerController::class, 'create'])->middleware('permission:create-customers')->name('customers.create');
            Route::post('customers', [\App\Http\Controllers\CustomerController::class, 'store'])->middleware('permission:create-customers')->name('customers.store');
            Route::get('customers/{id}/edit', [\App\Http\Controllers\CustomerController::class, 'edit'])->middleware('permission:edit-customers')->name('customers.edit');
            Route::put('customers/{id}', [\App\Http\Controllers\CustomerController::class, 'update'])->middleware('permission:edit-customers')->name('customers.update');
            Route::delete('customers/{id}', [\App\Http\Controllers\CustomerController::class, 'destroy'])->middleware('permission:delete-customers')->name('customers.destroy');
            Route::get('customers/{id}', [\App\Http\Controllers\CustomerController::class, 'show'])->middleware('permission:view-customers')->name('customers.show');
        });
        
        // Order Management routes with permissions
        Route::middleware('permission:manage-orders')->group(function () {
            Route::get('orders', [\App\Http\Controllers\OrderController::class, 'index'])->middleware('permission:view-orders')->name('orders.index');
            Route::get('orders/export', [\App\Http\Controllers\OrderController::class, 'export'])->middleware('permission:export-orders')->name('orders.export');

            Route::get('orders/{id}/edit', [\App\Http\Controllers\OrderController::class, 'edit'])->middleware('permission:edit-orders')->name('orders.edit');
            Route::put('orders/{id}', [\App\Http\Controllers\OrderController::class, 'update'])->middleware('permission:edit-orders')->name('orders.update');
            Route::delete('orders/{id}', [\App\Http\Controllers\OrderController::class, 'destroy'])->middleware('permission:delete-orders')->name('orders.destroy');
            Route::get('orders/{id}', [\App\Http\Controllers\OrderController::class, 'show'])->middleware('permission:view-orders')->name('orders.show');
        });
        
        // Blog Categories routes (must come before wildcard routes)
        Route::get('blog/categories', [\App\Http\Controllers\BlogCategoryController::class, 'index'])->name('blog.categories.index');
        Route::post('blog/categories', [\App\Http\Controllers\BlogCategoryController::class, 'store'])->name('blog.categories.store');
        Route::put('blog/categories/{category}', [\App\Http\Controllers\BlogCategoryController::class, 'update'])->name('blog.categories.update');
        Route::delete('blog/categories/{category}', [\App\Http\Controllers\BlogCategoryController::class, 'destroy'])->name('blog.categories.destroy');
        
        // Blog System routes with permissions
        Route::middleware('permission:manage-blog')->group(function () {
            Route::get('blog', [\App\Http\Controllers\BlogController::class, 'index'])->middleware('permission:view-blog')->name('blog.index');
            Route::get('blog/export', [\App\Http\Controllers\BlogController::class, 'export'])->middleware('permission:view-blog')->name('blog.export');
            Route::get('blog/create', [\App\Http\Controllers\BlogController::class, 'create'])->middleware('permission:create-blog')->name('blog.create');
            Route::post('blog', [\App\Http\Controllers\BlogController::class, 'store'])->middleware('permission:create-blog')->name('blog.store');
            Route::get('blog/{blog}/edit', [\App\Http\Controllers\BlogController::class, 'edit'])->middleware('permission:edit-blog')->name('blog.edit');
            Route::put('blog/{blog}', [\App\Http\Controllers\BlogController::class, 'update'])->middleware('permission:edit-blog')->name('blog.update');
            Route::delete('blog/{blog}', [\App\Http\Controllers\BlogController::class, 'destroy'])->middleware('permission:delete-blog')->name('blog.destroy');
            Route::get('blog/{blog}', [\App\Http\Controllers\BlogController::class, 'show'])->middleware('permission:view-blog')->name('blog.show');
        });
        
        // Rating & Reviews routes with permissions
        Route::middleware('permission:manage-reviews')->group(function () {
            Route::get('reviews', [\App\Http\Controllers\ReviewController::class, 'index'])->middleware('permission:view-reviews')->name('reviews.index');
            Route::get('reviews/export', [\App\Http\Controllers\ReviewController::class, 'export'])->middleware('permission:view-reviews')->name('reviews.export');
            Route::get('reviews/{id}', [\App\Http\Controllers\ReviewController::class, 'show'])->middleware('permission:view-reviews')->name('reviews.show');
            Route::get('reviews/{id}/edit', [\App\Http\Controllers\ReviewController::class, 'edit'])->middleware('permission:edit-reviews')->name('reviews.edit');
            Route::put('reviews/{id}', [\App\Http\Controllers\ReviewController::class, 'update'])->middleware('permission:edit-reviews')->name('reviews.update');
            Route::delete('reviews/{id}', [\App\Http\Controllers\ReviewController::class, 'destroy'])->middleware('permission:delete-reviews')->name('reviews.destroy');
            Route::post('reviews/{id}/approve', [\App\Http\Controllers\ReviewActionController::class, 'approve'])->middleware('permission:approve-reviews')->name('reviews.approve');
            Route::post('reviews/{id}/reject', [\App\Http\Controllers\ReviewActionController::class, 'reject'])->middleware('permission:approve-reviews')->name('reviews.reject');
            Route::post('reviews/{id}/response', [\App\Http\Controllers\ReviewActionController::class, 'addResponse'])->middleware('permission:edit-reviews')->name('reviews.add-response');
        });
        
        // Newsletter Subscribers routes with permissions
        Route::middleware('permission:manage-newsletter-subscribers')->group(function () {
            Route::get('newsletter-subscribers', [\App\Http\Controllers\NewsletterSubscriberController::class, 'index'])->middleware('permission:view-newsletter-subscribers')->name('newsletter-subscribers.index');
            Route::get('newsletter-subscribers/export', [\App\Http\Controllers\NewsletterSubscriberController::class, 'export'])->middleware('permission:view-newsletter-subscribers')->name('newsletter-subscribers.export');
            Route::delete('newsletter-subscribers/{id}', [\App\Http\Controllers\NewsletterSubscriberController::class, 'destroy'])->middleware('permission:delete-newsletter-subscribers')->name('newsletter-subscribers.destroy');
        });
        
        // Express Checkout routes
        Route::get('express-checkout', [\App\Http\Controllers\ExpressCheckoutController::class, 'index'])->middleware('permission:view-express-checkout')->name('express-checkout.index');
        Route::get('express-checkout/create', [\App\Http\Controllers\ExpressCheckoutController::class, 'create'])->middleware('permission:create-express-checkout')->name('express-checkout.create');
        Route::post('express-checkout', [\App\Http\Controllers\ExpressCheckoutController::class, 'store'])->middleware('permission:create-express-checkout')->name('express-checkout.store');
        Route::get('express-checkout/{id}/edit', [\App\Http\Controllers\ExpressCheckoutController::class, 'edit'])->middleware('permission:edit-express-checkout')->name('express-checkout.edit');
        Route::put('express-checkout/{id}', [\App\Http\Controllers\ExpressCheckoutController::class, 'update'])->middleware('permission:edit-express-checkout')->name('express-checkout.update');
        Route::delete('express-checkout/{id}', [\App\Http\Controllers\ExpressCheckoutController::class, 'destroy'])->middleware('permission:delete-express-checkout')->name('express-checkout.destroy');
        Route::get('express-checkout/{id}', [\App\Http\Controllers\ExpressCheckoutController::class, 'show'])->middleware('permission:view-express-checkout')->name('express-checkout.show');
        
        // Analytics & Reporting routes
        Route::get('analytics', [\App\Http\Controllers\AnalyticsController::class, 'index'])->middleware('permission:view-analytics')->name('analytics.index');
        Route::get('analytics/export', [\App\Http\Controllers\AnalyticsController::class, 'export'])->middleware('permission:export-analytics')->name('analytics.export');
        
        // Payment Gateway routes
        Route::get('payment-gateways', function () {
            return Inertia::render('payment-gateways/index');
        })->name('payment-gateways.index');
        
        // POS System routes with permissions
        Route::middleware('permission:manage-pos')->group(function () {
            Route::get('pos', [\App\Http\Controllers\POSController::class, 'index'])->middleware('permission:view-pos')->name('pos.index');
            Route::get('pos/checkout', [\App\Http\Controllers\POSController::class, 'checkout'])->middleware('permission:view-pos')->name('pos.checkout');
            Route::post('pos/process-transaction', [\App\Http\Controllers\POSController::class, 'processTransaction'])->middleware('permission:process-transactions-pos')->name('pos.process-transaction');
            Route::get('pos/receipt/{id}', [\App\Http\Controllers\POSController::class, 'receipt'])->middleware('permission:view-transactions-pos')->name('pos.receipt');
            Route::get('pos/transactions', [\App\Http\Controllers\POSController::class, 'transactions'])->middleware('permission:view-transactions-pos')->name('pos.transactions');
            Route::get('pos/settings', [\App\Http\Controllers\POSController::class, 'settings'])->middleware('permission:manage-settings-pos')->name('pos.settings');
            Route::post('pos/settings', [\App\Http\Controllers\POSController::class, 'updateSettings'])->middleware('permission:manage-settings-pos')->name('pos.update-settings');
        });
        
        // AI Templates routes
        Route::get('ai-templates', function () {
            return Inertia::render('ai-templates/index');
        })->name('ai-templates.index');
        
        // Webhook System routes
        Route::get('webhooks', function () {
            return Inertia::render('webhooks/index');
        })->name('webhooks.index');
        
        // Email Templates routes
        Route::get('email-templates', [\App\Http\Controllers\EmailTemplateController::class, 'index'])->name('email-templates.index');
        Route::get('email-templates/{emailTemplate}', [\App\Http\Controllers\EmailTemplateController::class, 'show'])->name('email-templates.show');
        Route::put('email-templates/{emailTemplate}/settings', [\App\Http\Controllers\EmailTemplateController::class, 'updateSettings'])->name('email-templates.update-settings');
        Route::put('email-templates/{emailTemplate}/content', [\App\Http\Controllers\EmailTemplateController::class, 'updateContent'])->name('email-templates.update-content');
        
        // Custom Pages routes with permissions
        Route::get('custom-pages', [\App\Http\Controllers\CustomPageController::class, 'index'])->middleware('permission:view-custom-pages')->name('custom-pages.index');
        Route::get('custom-pages/create', [\App\Http\Controllers\CustomPageController::class, 'create'])->middleware('permission:create-custom-pages')->name('custom-pages.create');
        Route::post('custom-pages', [\App\Http\Controllers\CustomPageController::class, 'store'])->middleware('permission:create-custom-pages')->name('custom-pages.store');
        Route::get('custom-pages/{id}/edit', [\App\Http\Controllers\CustomPageController::class, 'edit'])->middleware('permission:edit-custom-pages')->name('custom-pages.edit');
        Route::put('custom-pages/{id}', [\App\Http\Controllers\CustomPageController::class, 'update'])->middleware('permission:edit-custom-pages')->name('custom-pages.update');
        Route::delete('custom-pages/{id}', [\App\Http\Controllers\CustomPageController::class, 'destroy'])->middleware('permission:delete-custom-pages')->name('custom-pages.destroy');
        Route::get('custom-pages/{id}', [\App\Http\Controllers\CustomPageController::class, 'show'])->middleware('permission:view-custom-pages')->name('custom-pages.show');
        
        // AI Templates routes
        Route::get('ai-templates', function () {
            return Inertia::render('ai-templates/index');
        })->name('ai-templates.index');
        
        // Webhook System routes
        Route::get('webhooks', function () {
            return Inertia::render('webhooks/index');
        })->name('webhooks.index');
        
        Route::get('media-library', function () {
            return Inertia::render('media-library-demo');
        })->middleware('permission:manage-media')->name('media-library');
        
        Route::get('examples/chatgpt-demo', function () {
            return Inertia::render('examples/chatgpt-demo');
        })->name('examples.chatgpt-demo');

    // Media Library API routes - permissions handled in controller
    Route::get('api/media', [MediaController::class, 'index'])->name('api.media.index');
    Route::post('api/media/batch', [MediaController::class, 'batchStore'])->name('api.media.batch');
    Route::get('api/media/{id}/download', [MediaController::class, 'download'])->name('api.media.download');
    Route::delete('api/media/{id}', [MediaController::class, 'destroy'])->name('api.media.destroy');

    // Permissions routes with granular permissions
    Route::middleware('permission:manage-permissions')->group(function () {
        Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:manage-permissions')->name('permissions.index');
        Route::get('permissions/create', [PermissionController::class, 'create'])->middleware('permission:create-permissions')->name('permissions.create');
        Route::post('permissions', [PermissionController::class, 'store'])->middleware('permission:create-permissions')->name('permissions.store');
        Route::get('permissions/{permission}', [PermissionController::class, 'show'])->middleware('permission:view-permissions')->name('permissions.show');
        Route::get('permissions/{permission}/edit', [PermissionController::class, 'edit'])->middleware('permission:edit-permissions')->name('permissions.edit');
        Route::put('permissions/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit-permissions')->name('permissions.update');
        Route::patch('permissions/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit-permissions');
        Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:delete-permissions')->name('permissions.destroy');
    });

    // Roles routes with granular permissions
    Route::get('roles', [RoleController::class, 'index'])->middleware('permission:view-roles')->name('roles.index');
    Route::get('roles/create', [RoleController::class, 'create'])->middleware('permission:create-roles')->name('roles.create');
    Route::post('roles', [RoleController::class, 'store'])->middleware('permission:create-roles')->name('roles.store');
    Route::get('roles/{role}', [RoleController::class, 'show'])->middleware('permission:view-roles')->name('roles.show');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->middleware('permission:edit-roles')->name('roles.edit');
    Route::put('roles/{role}', [RoleController::class, 'update'])->middleware('permission:edit-roles')->name('roles.update');
    Route::patch('roles/{role}', [RoleController::class, 'update'])->middleware('permission:edit-roles');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:delete-roles')->name('roles.destroy');

    // Users routes with granular permissions
    Route::get('users', [UserController::class, 'index'])->middleware('permission:view-users')->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->middleware('permission:create-users')->name('users.create');
    Route::post('users', [UserController::class, 'store'])->middleware('permission:create-users')->name('users.store');
    Route::get('users/{user}', [UserController::class, 'show'])->middleware('permission:view-users')->name('users.show');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->middleware('permission:edit-users')->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->middleware('permission:edit-users')->name('users.update');
    Route::patch('users/{user}', [UserController::class, 'update'])->middleware('permission:edit-users');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('permission:delete-users')->name('users.destroy');

    // Additional user routes
    Route::put('users/{user}/reset-password', [UserController::class, 'resetPassword'])->middleware('permission:reset-password-users')->name('users.reset-password');
    Route::put('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->middleware('permission:toggle-status-users')->name('users.toggle-status');

    // Plans management routes (admin only)
    Route::middleware('permission:manage-plans')->group(function () {
        Route::get('plans/create', [PlanController::class, 'create'])->middleware('permission:create-plans')->name('plans.create');
        Route::post('plans', [PlanController::class, 'store'])->middleware('permission:create-plans')->name('plans.store');
        Route::get('plans/{plan}/edit', [PlanController::class, 'edit'])->middleware('permission:edit-plans')->name('plans.edit');
        Route::put('plans/{plan}', [PlanController::class, 'update'])->middleware('permission:edit-plans')->name('plans.update');
        Route::delete('plans/{plan}', [PlanController::class, 'destroy'])->middleware('permission:delete-plans')->name('plans.destroy');
        Route::post('plans/{plan}/toggle-status', [PlanController::class, 'toggleStatus'])->name('plans.toggle-status');
    });

    // Plan Orders management routes (admin only)
    Route::middleware('permission:manage-plan-orders')->group(function () {
        Route::post('plan-orders/{planOrder}/approve', [PlanOrderController::class, 'approve'])->middleware('permission:approve-plan-orders')->name('plan-orders.approve');
        Route::post('plan-orders/{planOrder}/reject', [PlanOrderController::class, 'reject'])->middleware('permission:reject-plan-orders')->name('plan-orders.reject');
    });



    // Companies routes
    Route::middleware('permission:manage-companies')->group(function () {
        Route::get('companies', [CompanyController::class, 'index'])->middleware('permission:manage-companies')->name('companies.index');
        Route::post('companies', [CompanyController::class, 'store'])->middleware('permission:create-companies')->name('companies.store');
        Route::put('companies/{company}', [CompanyController::class, 'update'])->middleware('permission:edit-companies')->name('companies.update');
        Route::delete('companies/{company}', [CompanyController::class, 'destroy'])->middleware('permission:delete-companies')->name('companies.destroy');
        Route::put('companies/{company}/reset-password', [CompanyController::class, 'resetPassword'])->middleware('permission:reset-password-companies')->name('companies.reset-password');
        Route::put('companies/{company}/toggle-status', [CompanyController::class, 'toggleStatus'])->middleware('permission:toggle-status-companies')->name('companies.toggle-status');
        Route::get('companies/{company}/plans', [CompanyController::class, 'getPlans'])->middleware('permission:manage-plans-companies')->name('companies.plans');
        Route::put('companies/{company}/upgrade-plan', [CompanyController::class, 'upgradePlan'])->middleware('permission:upgrade-plan-companies')->name('companies.upgrade-plan');
    });







    // Coupons routes
    Route::middleware('permission:manage-coupons')->group(function () {
        Route::get('coupons', [CouponController::class, 'index'])->middleware('permission:manage-coupons')->name('coupons.index');
        Route::post('coupons', [CouponController::class, 'store'])->middleware('permission:create-coupons')->name('coupons.store');
        Route::put('coupons/{coupon}', [CouponController::class, 'update'])->middleware('permission:edit-coupons')->name('coupons.update');
        Route::put('coupons/{coupon}/toggle-status', [CouponController::class, 'toggleStatus'])->middleware('permission:toggle-status-coupons')->name('coupons.toggle-status');
        Route::delete('coupons/{coupon}', [CouponController::class, 'destroy'])->middleware('permission:delete-coupons')->name('coupons.destroy');
    });

    // Plan Requests management routes (admin only)
    Route::middleware('permission:manage-plan-requests')->group(function () {
        Route::post('plan-requests/{planRequest}/approve', [PlanRequestController::class, 'approve'])->middleware('permission:approve-plan-requests')->name('plan-requests.approve');
        Route::post('plan-requests/{planRequest}/reject', [PlanRequestController::class, 'reject'])->middleware('permission:reject-plan-requests')->name('plan-requests.reject');
    });



    // Referral routes
    Route::middleware('permission:manage-referral')->group(function () {
        Route::get('referral', [ReferralController::class, 'index'])->middleware('permission:manage-referral')->name('referral.index');
        Route::post('referral/settings', [ReferralController::class, 'updateSettings'])->middleware('permission:manage-setting-referral')->name('referral.settings.update');
        Route::post('referral/payout-request', [ReferralController::class, 'createPayoutRequest'])->middleware('permission:manage-payout-referral')->name('referral.payout-request.create');
        Route::post('referral/payout-request/{payoutRequest}/approve', [ReferralController::class, 'approvePayoutRequest'])->middleware('permission:approve-payout-referral')->name('referral.payout-request.approve');
        Route::post('referral/payout-request/{payoutRequest}/reject', [ReferralController::class, 'rejectPayoutRequest'])->middleware('permission:reject-payout-referral')->name('referral.payout-request.reject');
    });



    // Currencies routes
    Route::middleware('permission:manage-currencies')->group(function () {
        Route::get('currencies', [CurrencyController::class, 'index'])->middleware('permission:manage-currencies')->name('currencies.index');
        Route::post('currencies', [CurrencyController::class, 'store'])->middleware('permission:create-currencies')->name('currencies.store');
        Route::put('currencies/{currency}', [CurrencyController::class, 'update'])->middleware('permission:edit-currencies')->name('currencies.update');
        Route::delete('currencies/{currency}', [CurrencyController::class, 'destroy'])->middleware('permission:delete-currencies')->name('currencies.destroy');
    });

    // ChatGPT routes
    Route::post('api/chatgpt/generate', [\App\Http\Controllers\ChatGptController::class, 'generate'])->name('chatgpt.generate');
    
    // Blog categories API
    Route::get('api/blog-categories', function (Request $request) {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        $categories = \App\Models\BlogCategory::where('store_id', $currentStoreId)
            ->where('is_active', true)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
        return response()->json(['categories' => $categories]);
    })->name('api.blog-categories');
    
    // Language management
    Route::get('manage-language/{lang?}', [LanguageController::class, 'managePage'])->middleware('permission:manage-language')->name('manage-language');
    Route::get('language/load', [LanguageController::class, 'load'])->name('language.load');
    Route::match(['POST', 'PATCH'], 'language/save', [LanguageController::class, 'save'])->middleware('permission:edit-language')->name('language.save');

    // Landing Page content management (Super Admin only)
    Route::middleware('App\Http\Middleware\SuperAdminMiddleware')->group(function () {
        Route::get('landing-page/settings', [LandingPageController::class, 'settings'])->name('landing-page.settings');
        Route::post('landing-page/settings', [LandingPageController::class, 'updateSettings'])->name('landing-page.settings.update');
        


        Route::resource('landing-page/custom-pages', CustomPageController::class)->names([
            'index' => 'landing-page.custom-pages.index',
            'create' => 'landing-page.custom-pages.create',
            'store' => 'landing-page.custom-pages.store',
            'show' => 'landing-page.custom-pages.show',
            'edit' => 'landing-page.custom-pages.edit',
            'update' => 'landing-page.custom-pages.update',
            'destroy' => 'landing-page.custom-pages.destroy'
        ]);
        
        // Newsletter Subscribers routes
        Route::get('landing-page/subscribers', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'index'])->name('landing-page.subscribers.index');
        Route::get('landing-page/subscribers/export', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'export'])->name('landing-page.subscribers.export');
        Route::delete('landing-page/subscribers/{newsletter}', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'destroy'])->name('landing-page.subscribers.destroy');
        Route::put('landing-page/subscribers/{newsletter}', [\App\Http\Controllers\LandingPage\NewsletterController::class, 'update'])->name('landing-page.subscribers.update');
        
        // Contact Management routes
        Route::get('landing-page/contacts', [\App\Http\Controllers\LandingPage\ContactController::class, 'index'])->name('landing-page.contacts.index');
        Route::get('landing-page/contacts/export', [\App\Http\Controllers\LandingPage\ContactController::class, 'export'])->name('landing-page.contacts.export');
        Route::delete('landing-page/contacts/{contact}', [\App\Http\Controllers\LandingPage\ContactController::class, 'destroy'])->name('landing-page.contacts.destroy');

        
        // API routes for slug validation
        Route::post('api/landing-page/custom-pages/check-slug', [CustomPageController::class, 'checkSlug'])->name('api.custom-pages.check-slug');
        Route::post('api/landing-page/custom-pages/generate-slug', [CustomPageController::class, 'generateSlug'])->name('api.custom-pages.generate-slug');
        
        // Location Management (Countries, States, Cities)
        Route::resource('countries', \App\Http\Controllers\CountryController::class);
        Route::resource('states', \App\Http\Controllers\StateController::class);
        Route::get('states/by-country/{countryId}', [\App\Http\Controllers\StateController::class, 'getByCountry'])->name('states.by-country');
        Route::resource('cities', \App\Http\Controllers\CityController::class);
    });
    
    // Impersonation routes
    Route::middleware('App\Http\Middleware\SuperAdminMiddleware')->group(function () {
        Route::get('impersonate/{userId}', [ImpersonateController::class, 'start'])->name('impersonate.start');
    });

    Route::post('impersonate/leave', [ImpersonateController::class, 'leave'])->name('impersonate.leave');


    

    
    // Store switching route
    Route::post('switch-store', [\App\Http\Controllers\StoreSwitcherController::class, 'switchStore'])->name('switch-store');
    
    // User language update route
    Route::post('user/language', [\App\Http\Controllers\UserLanguageController::class, 'update'])->name('user.language.update');
    
    }); // End plan.access middleware group
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::match(['GET', 'POST'], 'payments/easebuzz/success', [EasebuzzPaymentController::class, 'success'])->name('easebuzz.success');
Route::post('payments/easebuzz/callback', [EasebuzzPaymentController::class, 'callback'])->name('easebuzz.callback');



// Domain-based store routes (must be at the end to avoid conflicts)
Route::middleware(['domain.resolver'])->group(function () {
    // These routes will be handled by DomainResolver middleware
    // when accessed via custom domain or subdomain
    Route::get('/{path?}', function () {
        // This will be handled by DomainResolver middleware
        return abort(404);
    })->where('path', '.*');
});