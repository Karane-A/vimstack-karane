<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShareGlobalSettings
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Skip during installation
        if (!$request->is('install/*') && !$request->is('update/*') && file_exists(storage_path('installed'))) {
            // Share settings with all Inertia responses
            Inertia::share([
                'globalSettings' => function () {
                    $settings = settings(); // Use our helper function
                    // Ensure base_url is always available
                    if (!isset($settings['base_url'])) {
                        $settings['base_url'] = config('app.url');
                    }
                    return $settings;
                }
            ]);
        }

        return $next($request);
    }
}