<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use App\Models\Referral;
use App\Models\ReferralSetting;
use App\Services\UserService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(Request $request): Response
    {
        $referralCode = $request->get('ref');
        $encryptedPlanId = $request->get('plan');
        $planId = null;
        $referrer = null;
        
        // Decrypt and validate plan ID
        if ($encryptedPlanId) {
            $planId = $this->decryptPlanId($encryptedPlanId);
            if ($planId && !Plan::find($planId)) {
                $planId = null; // Invalid plan ID
            }
        }
        
        if ($referralCode) {
            $referrer = User::where('referral_code', $referralCode)
                ->where('type', 'company')
                ->first();
        }
        
        return Inertia::render('auth/register', [
            'referralCode' => $referralCode,
            'planId' => $planId,
            'referrer' => $referrer ? $referrer->name : null,
            'settings' => settings(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'type' => 'company',
            'is_active' => 1,
            'is_enable_login' => 1,
            'created_by' => 0,
            'plan_is_active' => 0,
        ];
        
        // Handle referral code
        if ($request->referral_code) {
            $referrer = User::where('referral_code', $request->referral_code)
                ->where('type', 'company')
                ->first();
            
            if ($referrer) {
                $userData['used_referral_code'] = $request->referral_code;
            }
        }
        
        $user = User::create($userData);

        // Assign role and settings to the user
        defaultRoleAndSetting($user);
        
        // Create referral record when user purchases a plan
        if ($user->used_referral_code && $user->plan_id) {
            $this->createReferralRecord($user);
        }

        Auth::login($user);
        
        // Check if email verification is enabled
        $emailVerificationEnabled = getSetting('emailVerification', false);
        if ($emailVerificationEnabled) {
            // Configure mail settings before sending verification email
            $this->configureMailSettings();
            // Send verification email manually to avoid duplicate emails
            $user->sendEmailVerificationNotification();
            return redirect()->route('verification.notice');
        }

        // Redirect to plans page with selected plan
        $planId = $request->plan_id;
        if ($planId) {
            return redirect()->route('plans.index', ['selected' => $planId]);
        }
        return to_route('dashboard');
    }
    
    /**
     * Decrypt plan ID from encrypted string
     */
    private function decryptPlanId($encryptedPlanId)
    {
        try {
            $key = 'StoreGo2024';
            $encrypted = base64_decode($encryptedPlanId);
            $decrypted = '';
            
            for ($i = 0; $i < strlen($encrypted); $i++) {
                $decrypted .= chr(ord($encrypted[$i]) ^ ord($key[$i % strlen($key)]));
            }
            
            return is_numeric($decrypted) ? (int)$decrypted : null;
        } catch (\Exception $e) {
            return null;
        }
    }
    
    /**
     * Configure mail settings from database
     */
    private function configureMailSettings()
    {
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
    
    /**
     * Create referral record when user purchases a plan
     */
    private function createReferralRecord(User $user)
    {
        $settings = ReferralSetting::current();
        
        if (!$settings->is_enabled) {
            return;
        }
        
        $referrer = User::where('referral_code', $user->used_referral_code)->first();
        if (!$referrer || !$user->plan) {
            return;
        }
        
        // Calculate commission based on plan price
        $planPrice = $user->plan->price ?? 0;
        $commissionAmount = ($planPrice * $settings->commission_percentage) / 100;
        
        if ($commissionAmount > 0) {
            Referral::create([
                'user_id' => $user->id,
                'company_id' => $referrer->id,
                'commission_percentage' => $settings->commission_percentage,
                'amount' => $commissionAmount,
                'plan_id' => $user->plan_id,
            ]);
        }
    }
}
