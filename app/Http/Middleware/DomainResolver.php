<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Store;
use Inertia\Inertia;

class DomainResolver
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Skip during installation and admin routes
        if ($request->is('install/*') || $request->is('update/*') || !file_exists(storage_path('installed'))) {
            return $next($request);
        }
        
        // Skip for admin/dashboard routes and regular store routes
        if ($request->is('dashboard*') || $request->is('admin*') || $request->is('login') || $request->is('register') || $request->is('password*') || $request->is('store/*') || $request->is('stores/*')) {
            return $next($request);
        }
        
        $host = $request->getHost();
        $store = null;
        
        // Check for custom domain first
        $store = Store::where('custom_domain', $host)
                    ->where('enable_custom_domain', true)
                    ->where('is_active', true)
                    ->first();
        
        // Check for custom subdomain if no custom domain found
        if (!$store && str_contains($host, '.')) {
            $hostParts = explode('.', $host);
            if (count($hostParts) >= 2 && $hostParts[0] !== 'www') {
                $subdomain = filter_var($hostParts[0], FILTER_SANITIZE_STRING);
                if ($subdomain && preg_match('/^[a-zA-Z0-9-]+$/', $subdomain)) {
                    $store = Store::where('custom_subdomain', $subdomain)
                                ->where('enable_custom_subdomain', true)
                                ->where('is_active', true)
                                ->first();
                }
            }
        }
        
        if ($store) {
            // Set store context for the request
            $request->attributes->set('resolved_store', $store);
            $request->attributes->set('store_theme', $store->theme);
            
            // For API requests, add store_id to request
            if ($request->is('api/*')) {
                $request->merge(['store_id' => $store->id]);
                return $next($request);
            }
            
            // Handle direct domain/subdomain access - show store directly
            if (!$request->is('store/*')) {
                // Check if store is active and not in maintenance
                $config = \App\Models\StoreConfiguration::getConfiguration($store->id);
                
                if (!($config['store_status'] ?? true)) {
                    return Inertia::render('store/StoreDisabled', [
                        'store' => $store->only(['id', 'name', 'slug'])
                    ])->toResponse($request)->setStatusCode(503);
                }
                
                if ($config['maintenance_mode'] ?? false) {
                    return Inertia::render('store/StoreMaintenance', [
                        'store' => $store->only(['id', 'name', 'slug'])
                    ])->toResponse($request)->setStatusCode(503);
                }
                
                // Route the request to appropriate store controller method
                return $this->handleStoreRequest($request, $store);
            }
        }
        
        return $next($request);
    }
    
    /**
     * Handle store request based on path
     */
    private function handleStoreRequest(Request $request, Store $store)
    {
        $path = trim($request->getPathInfo(), '/');
        $segments = explode('/', $path);
        
        // Set the store slug in route parameters
        if ($request->route()) {
            $request->route()->setParameter('storeSlug', $store->slug);
        }
        
        // Handle different store routes
        if (empty($path) || $path === '/') {
            // Home page
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        } elseif ($segments[0] === 'products') {
            if (isset($segments[1]) && is_numeric($segments[1])) {
                // Product detail page
                return app(\App\Http\Controllers\ThemeController::class)->product($store->slug, $segments[1]);
            } else {
                // Products listing
                return app(\App\Http\Controllers\ThemeController::class)->products($store->slug, $request);
            }
        } elseif ($segments[0] === 'category' && isset($segments[1])) {
            // Category page
            return app(\App\Http\Controllers\ThemeController::class)->category($store->slug, $segments[1]);
        } elseif ($segments[0] === 'cart') {
            // Cart page
            return app(\App\Http\Controllers\ThemeController::class)->cart($store->slug);
        } elseif ($segments[0] === 'wishlist') {
            // Wishlist page
            return app(\App\Http\Controllers\ThemeController::class)->wishlist($store->slug);
        } elseif ($segments[0] === 'checkout') {
            // Checkout page
            return app(\App\Http\Controllers\ThemeController::class)->checkout($store->slug);
        } elseif ($segments[0] === 'blog') {
            if (isset($segments[2]) && $segments[1] === 'post') {
                // Blog post detail
                return app(\App\Http\Controllers\ThemeController::class)->blogPost($store->slug, $segments[2]);
            } else {
                // Blog listing
                return app(\App\Http\Controllers\ThemeController::class)->blog($store->slug);
            }
        } elseif ($segments[0] === 'page' && isset($segments[1])) {
            // Custom page
            return app(\App\Http\Controllers\ThemeController::class)->customPage($store->slug, $segments[1]);
        } elseif ($segments[0] === 'login') {
            // Login page
            return app(\App\Http\Controllers\Store\AuthController::class)->login($request, $store->slug);
        } elseif ($segments[0] === 'register') {
            // Register page
            return app(\App\Http\Controllers\Store\AuthController::class)->register($request, $store->slug);
        } elseif ($segments[0] === 'my-orders') {
            // My orders page
            return app(\App\Http\Controllers\ThemeController::class)->myOrders($store->slug);
        } elseif ($segments[0] === 'my-profile') {
            // My profile page
            return app(\App\Http\Controllers\ThemeController::class)->myProfile($store->slug);
        } elseif ($segments[0] === 'order' && isset($segments[1])) {
            // Order detail page
            return app(\App\Http\Controllers\ThemeController::class)->orderDetail($store->slug, $segments[1]);
        } elseif ($segments[0] === 'order-confirmation') {
            // Order confirmation page
            $orderNumber = $segments[1] ?? null;
            return app(\App\Http\Controllers\ThemeController::class)->orderConfirmation($store->slug, $orderNumber);
        } else {
            // Try to find a custom page with this slug
            $pageSlug = filter_var($segments[0], FILTER_SANITIZE_STRING);
            if ($pageSlug && preg_match('/^[a-zA-Z0-9-_]+$/', $pageSlug)) {
                $customPage = \App\Models\CustomPage::where('store_id', $store->id)
                    ->where('slug', $pageSlug)
                    ->where('status', 'published')
                    ->first();
            } else {
                $customPage = null;
            }
                
            if ($customPage) {
                return app(\App\Http\Controllers\ThemeController::class)->customPage($store->slug, $segments[0]);
            }
            
            // Default to home page for unknown routes
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        }
    }
}