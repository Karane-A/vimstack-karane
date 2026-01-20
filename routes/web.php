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

use App\Http\Controllers\LanguageController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\PayPalPaymentController;
use App\Http\Controllers\BankPaymentController;
use App\Http\Controllers\PaystackPaymentController;
use App\Http\Controllers\FlutterwavePaymentController;
use App\Http\Controllers\SkrillPaymentController;
use App\Http\Controllers\CoinGatePaymentController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\StoreContentController;


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home route - redirect to login
Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

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

// PayFast payment routes (public routes)

// CoinGate callback (public route)
Route::match(['GET', 'POST'], 'payments/coingate/callback', [CoinGatePaymentController::class, 'callback'])->name('coingate.callback');





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
    Route::post('payments/skrill', [SkrillPaymentController::class, 'processPayment'])->name('skrill.payment');
    Route::post('payments/coingate', [CoinGatePaymentController::class, 'processPayment'])->name('coingate.payment');
    
    // Payment gateway specific routes
    Route::post('paystack/verify-payment', [PaystackPaymentController::class, 'verifyPayment'])->name('paystack.verify');
    Route::post('flutterwave/verify-payment', [FlutterwavePaymentController::class, 'verifyPayment'])->name('flutterwave.verify');
    
    // Payment success/callback routes
    Route::post('payments/skrill/callback', [SkrillPaymentController::class, 'callback'])->name('skrill.callback');


    
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
            Route::get('products/import-template', [\App\Http\Controllers\ProductController::class, 'downloadTemplate'])->middleware('permission:create-products')->name('products.import-template');
            Route::post('products/import', [\App\Http\Controllers\ProductController::class, 'import'])->middleware('permission:create-products')->name('products.import');
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
    
    // Global Search API
    Route::get('api/search', [\App\Http\Controllers\SearchController::class, 'search'])->name('api.search');
    
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
    
    // Location Management (Countries, States, Cities) - Super Admin only
    Route::middleware('App\Http\Middleware\SuperAdminMiddleware')->group(function () {
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
    
    }); // End plan.access middleware group
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';



// Domain-based store routes (must be at the end to avoid conflicts)
Route::middleware(['domain.resolver'])->group(function () {
    // These routes will be handled by DomainResolver middleware
    // when accessed via custom domain or subdomain
    Route::get('/{path?}', function () {
        // This will be handled by DomainResolver middleware
        return abort(404);
    })->where('path', '.*');
});