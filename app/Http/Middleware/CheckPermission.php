<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Super admin has all permissions
        if ($user->type === 'superadmin' || $user->type === 'super admin') {
            return $next($request);
        }

        // Check if user has the required permission
        if (!$user->hasPermissionTo($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Permission Denied'], 403);
            }
            
            // Redirect back with error message
            return redirect()->back()->with('error', 'Permission Denied');
        }

        return $next($request);
    }
}