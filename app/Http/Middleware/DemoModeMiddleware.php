<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DemoModeMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('app.is_demo', false)) {
            return $next($request);
        }

        // Allow GET requests (viewing data) except for certain restricted patterns
        if ($request->isMethod('GET')) {
            $uri = $request->getPathInfo();
            if (str_contains($uri, '/payment-methods')) {
                $message = 'This action is disabled in demo mode. You can only create new data, not modify existing demo data.';
                return response()->json([
                    'message' => $message,
                    'demo_mode' => true,
                    'success' => false
                ], 403);
            }
            return $next($request);
        }

        // Check if this is an allowed route first (before blocking by method)
        if (!$this->isUpdateOrDeleteRoute($request)) {
            return $next($request);
        }

        // Block PUT, PATCH, DELETE requests for restricted routes
        if (in_array($request->method(), ['PUT', 'PATCH', 'DELETE'])) {
            return $this->demoModeResponse($request);
        }

        // Block specific update/delete POST routes
        if ($this->isUpdateOrDeleteRoute($request)) {
            return $this->demoModeResponse($request);
        }

        return $next($request);
    }

    /**
     * Check if the route is for updating or deleting existing data
     */
    private function isUpdateOrDeleteRoute(Request $request): bool
    {
        $route = $request->route();
        $routeName = $route ? $route->getName() : null;
        $uri = $request->getPathInfo();

        // Allow wishlist and cart operations in demo mode (user-specific data)
        if (str_contains($uri, '/api/wishlist') || str_contains($uri, '/api/cart')) {
            return false;
        }

        // Routes that modify existing data
        $restrictedPatterns = [
            '/toggle-status',
            '/approve',
            '/reject',
            '/reset-password',
            '/upgrade-plan',
            '/reply',
            '/settings',
            '/update',
            '/destroy',
            '/payment-settings',
            '/media/batch',
            '/plans/request',
            '/plans/trial',
            '/password',
           // 'switch-business',
        ];
        
        // For DELETE/PUT/PATCH requests, check if it's a resource route (like /products/1, /users/1, etc.)
        // but exclude wishlist and cart operations
        if (in_array($request->method(), ['DELETE', 'PUT', 'PATCH']) && 
            !str_contains($uri, '/api/wishlist') && 
            !str_contains($uri, '/api/cart')) {
            // Check if URI matches pattern like /resource/id
            if (preg_match('/^\/[a-zA-Z-]+\/\d+$/', $uri) || 
                preg_match('/^\/[a-zA-Z-]+\/[a-zA-Z0-9-]+\/\d+$/', $uri)) {
                return true;
            }
        }

        // Allow language switching in demo mode
        if (str_contains($uri, '/user/language')) {
            return false;
        }

        foreach ($restrictedPatterns as $pattern) {
            if (str_contains($uri, $pattern)) {
                return true;
            }
        }

        // Route names that modify existing data
        $restrictedRoutePatterns = [
            '.update',
            '.destroy',
            '.toggle-status',
            '.approve',
            '.reject',
            '.reset-password',
            '.upgrade-plan',
            '.reply',
            'appointments.reply',
            'contacts.reply',
            'payment.settings',
            'media.batch',
            'media.destroy',
            'plans.request',
            'plans.trial',
            'plans.subscribe',
            //'switch-business',
        ];
        
        // Allow language switching in demo mode
        if ($routeName === 'user.language.update') {
            return false;
        }

        // Allow wishlist and cart operations in demo mode (user-specific data)
        if ($routeName && (str_contains($routeName, 'api.wishlist') || str_contains($routeName, 'api.cart'))) {
            return false;
        }

        if ($routeName) {
            foreach ($restrictedRoutePatterns as $pattern) {
                if (str_contains($routeName, $pattern)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Return demo mode response
     */
    private function demoModeResponse(Request $request): Response
    {
        $message = 'This action is disabled in demo mode. You can only create new data, not modify existing demo data.';

        if ($request->expectsJson() || $request->is('api/*') || $request->wantsJson()) {
            return response()->json([
                'message' => $message,
                'demo_mode' => true,
                'success' => false
            ], 403);
        }

        return redirect()->back()->with('error', $message);
    }
}