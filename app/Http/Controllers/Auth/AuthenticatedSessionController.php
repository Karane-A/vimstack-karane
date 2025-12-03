<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Store;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        $demoStores = [];
    
        if (config('app.is_demo')) {
            // Get the company user
            $companyUser = User::where('email', 'company@example.com')->first();
            
            if ($companyUser) {
                // Get all stores for this user
                $demoStores = Store::where('user_id', $companyUser->id)
                    ->select('id', 'name', 'slug', 'theme')
                    ->get();
            }
        }
        
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'settings' => settings(),
            'demoStores' => $demoStores,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Check if email verification is enabled and user is not verified
        $emailVerificationEnabled = getSetting('emailVerification', false);
        if ($emailVerificationEnabled && !$request->user()->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        // Only regenerate token, don't invalidate entire session
        // This prevents affecting customer authentication
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
