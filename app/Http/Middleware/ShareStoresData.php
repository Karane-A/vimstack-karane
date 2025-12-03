<?php

namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShareStoresData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            // Superadmin users don't need store data as they don't manage stores
            if ($user->isSuperAdmin()) {
                Inertia::share('stores', []);
            } else if ($user->isAdmin()) {
                // For admin users, get all stores
                $stores = Store::all();
                Inertia::share('stores', $stores);
            } else {
                // For regular users, only get their own stores
                $stores = Store::where('user_id', $user->id)->get();
                Inertia::share('stores', $stores);
            }
        }

        return $next($request);
    }
}