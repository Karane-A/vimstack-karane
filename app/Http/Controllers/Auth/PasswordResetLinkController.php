<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
            'settings' => settings(),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Configure mail settings from database before sending reset link
        $this->configureMailSettings();

        Password::sendResetLink(
            $request->only('email')
        );

        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }

    /**
     * Configure mail settings from database
     */
    private function configureMailSettings()
    {
        $user = auth()->user();
        $storeId = $user && $user->type === 'company' ? getCurrentStoreId($user) : null;
        
        // Get superadmin settings for mail configuration
        $superAdmin = \App\Models\User::where('type', 'superadmin')->first();
        $userId = $superAdmin ? $superAdmin->id : null;
        
        if (!$userId) {
            return;
        }
        
        $settings = [
            'driver' => getSetting('email_driver', 'smtp', $userId, null),
            'host' => getSetting('email_host', 'smtp.example.com', $userId, null),
            'port' => getSetting('email_port', '587', $userId, null),
            'username' => getSetting('email_username', 'user@example.com', $userId, null),
            'password' => getSetting('email_password', '', $userId, null),
            'encryption' => getSetting('email_encryption', 'tls', $userId, null),
            'fromAddress' => getSetting('email_from_address', 'noreply@example.com', $userId, null),
            'fromName' => getSetting('email_from_name', 'StoreGo System', $userId, null)
        ];
        
        // Only configure if we have valid settings
        if (!empty($settings['username']) && !empty($settings['password'])) {
            config([
                'mail.default' => $settings['driver'],
                'mail.mailers.smtp.host' => $settings['host'],
                'mail.mailers.smtp.port' => $settings['port'],
                'mail.mailers.smtp.encryption' => $settings['encryption'] === 'none' ? null : $settings['encryption'],
                'mail.mailers.smtp.username' => $settings['username'],
                'mail.mailers.smtp.password' => $settings['password'],
                'mail.from.address' => $settings['fromAddress'],
                'mail.from.name' => $settings['fromName'],
            ]);
        }
    }
}
