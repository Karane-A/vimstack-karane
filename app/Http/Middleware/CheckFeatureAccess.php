<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckFeatureAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $feature)
    {
        $user = auth()->user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        // Super admin has full access
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Only company users need feature checks
        if ($user->type !== 'company') {
            return redirect()->route('dashboard')->with('error', __('Access denied.'));
        }

        // Check feature access
        $featureCheck = $user->hasFeatureAccess($feature);
        if (!$featureCheck['allowed']) {
            return redirect()->route('dashboard')->with('error', $featureCheck['message']);
        }

        return $next($request);
    }
}