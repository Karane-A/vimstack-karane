<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class EnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next)
    {
        $emailVerificationEnabled = getSetting('emailVerification', false);
        
        if ($emailVerificationEnabled && 
            $request->user() &&
            $request->user() instanceof MustVerifyEmail &&
            !$request->user()->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        return $next($request);
    }
}