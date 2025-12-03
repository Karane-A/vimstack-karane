<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionDeniedHandler
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        // Check if the response is a 403 (Forbidden) status
        if ($response->getStatusCode() === 403) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Permission Denied',
                    'error' => 'You do not have permission to access this resource.'
                ], 403);
            }
            
            // For web requests, redirect back with error message
            return redirect()->back()->with('error', 'Permission Denied');
        }
        
        return $response;
    }
}