<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->user() || !auth()->user()->isSuperAdmin()) {
            return redirect()->back()->with('error', 'Unauthorized access');
        }

        return $next($request);
    }
}