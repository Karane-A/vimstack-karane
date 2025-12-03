<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckLandingPageEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If accessing home and landing page is disabled, redirect to login
        if (!isLandingPageEnabled() && $request->route()->getName() === 'home') {
            return redirect()->route('login');
        }

        return $next($request);
    }
}