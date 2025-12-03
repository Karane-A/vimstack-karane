<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use App\Models\PayoutRequest;
use App\Models\ReferralSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReferralController extends BaseController
{
    public function index()
    {
        $user = Auth::user();
        $settings = ReferralSetting::current();
        
        if ($user->isSuperAdmin()) {
            return $this->superAdminView($settings);
        } elseif ($user->type === 'company') {
            return $this->companyView($user, $settings);
        } else {
            // For regular users, show their company's referral data
            $company = User::find($user->created_by);
            if ($company) {
                return $this->companyView($company, $settings, $user);
            } else {
                // If no company found, show empty data
                return $this->emptyView($settings);
            }
        }
    }

    private function superAdminView($settings)
    {
        // Count actual referral records (not users with referral codes)
        $totalReferralUsers = Referral::count();
        $pendingPayouts = PayoutRequest::where('status', 'pending')->count();
        $totalCommissionPaid = PayoutRequest::where('status', 'approved')->sum('amount');
        
        // Count referral records by month
        $monthlyReferrals = Referral::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $monthlyPayouts = PayoutRequest::where('status', 'approved')
            ->selectRaw('MONTH(created_at) as month, SUM(amount) as total')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();
        
        // Calculate total monthly payouts for display
        $totalMonthlyPayouts = array_sum($monthlyPayouts);

        $topCompanies = User::select('users.id', 'users.name', 'users.email', 'users.referral_code')
            ->selectRaw('COUNT(referrals.id) as referral_count, COALESCE(SUM(referrals.amount), 0) as total_earned')
            ->leftJoin('referrals', 'users.id', '=', 'referrals.company_id')
            ->where('users.type', 'company')
            ->whereNotNull('users.referral_code')
            ->groupBy('users.id', 'users.name', 'users.email', 'users.referral_code')
            ->orderByDesc('referral_count')
            ->orderByDesc('total_earned')
            ->limit(5)
            ->get();

        // Format the amounts properly
        $topCompanies = $topCompanies->map(function ($company) {
            $company->total_earned = number_format($company->total_earned, 2);
            return $company;
        });

        $payoutRequests = PayoutRequest::with('company')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('referral/index', [
            'userType' => 'superadmin',
            'settings' => $settings,
            'stats' => [
                'totalReferralUsers' => $totalReferralUsers,
                'pendingPayouts' => $pendingPayouts,
                'totalCommissionPaid' => number_format($totalCommissionPaid, 2),
                'monthlyReferrals' => $monthlyReferrals,
                'monthlyPayouts' => $monthlyPayouts,
                'totalMonthlyPayouts' => number_format($totalMonthlyPayouts, 2),
                'topCompanies' => $topCompanies,
            ],
            'payoutRequests' => $payoutRequests,
        ]);
    }

    private function companyView($company, $settings, $viewingUser = null)
    {
        $totalReferrals = Referral::where('company_id', $company->id)->count();
        $totalEarned = Referral::where('company_id', $company->id)->sum('amount');
        $totalPayoutRequests = PayoutRequest::where('company_id', $company->id)->count();
        $pendingAmount = PayoutRequest::where('company_id', $company->id)
            ->where('status', 'pending')
            ->sum('amount');
        $totalRequested = PayoutRequest::where('company_id', $company->id)
            ->whereIn('status', ['pending', 'approved'])
            ->sum('amount');
        $availableBalance = max(0, round($totalEarned - $totalRequested, 2));

        $payoutRequests = PayoutRequest::where('company_id', $company->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Generate referral code if not exists
        if (!$company->referral_code || $company->referral_code == 0) {
            do {
                $code = rand(100000, 999999);
            } while (User::where('referral_code', $code)->exists());
            $company->referral_code = $code;
            $company->save();
        }
        
        $referralLink = url('/register?ref=' . $company->referral_code);
        
        // Determine user type for the view
        $userType = $viewingUser ? $viewingUser->type : $company->type;

        return Inertia::render('referral/index', [
            'userType' => $userType,
            'settings' => $settings,
            'stats' => [
                'totalReferrals' => $totalReferrals,
                'totalEarned' => number_format($totalEarned, 2),
                'totalPayoutRequests' => $totalPayoutRequests,
                'availableBalance' => number_format($availableBalance, 2),
            ],
            'payoutRequests' => $payoutRequests,
            'referralLink' => $referralLink,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'commission_percentage' => 'required|numeric|min:0|max:100',
            'threshold_amount' => 'required|numeric|min:0',
            'guidelines' => 'nullable|string',
            'is_enabled' => 'boolean',
        ]);

        $settings = ReferralSetting::current();
        $settings->update($request->all());

        return back()->with('success', __('Referral settings updated successfully'));
    }

    public function createPayoutRequest(Request $request)
    {
        $user = Auth::user();
        $settings = ReferralSetting::current();
        
        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);
        
        // Get the company ID - either the user themselves or their creator
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;
        
        if (!$companyId) {
            return back()->withErrors(['amount' => __('No company associated with this account')]);
        }

        $totalEarned = Referral::where('company_id', $companyId)->sum('amount');
        $totalRequested = PayoutRequest::where('company_id', $companyId)
            ->whereIn('status', ['pending', 'approved'])
            ->sum('amount');
        $availableBalance = $totalEarned - $totalRequested;

        if ($request->amount > $availableBalance) {
            return back()->withErrors(['amount' => __('Insufficient balance')]);
        }

        if ($request->amount < $settings->threshold_amount) {
            return back()->withErrors(['amount' => __('Amount must be at least $ :amount', ['amount' => $settings->threshold_amount])]);
        }

        PayoutRequest::create([
            'company_id' => $companyId,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);

        return back()->with('success', __('Payout request submitted successfully'));
    }

    public function approvePayoutRequest(PayoutRequest $payoutRequest)
    {
        $payoutRequest->update(['status' => 'approved']);
        return back()->with('success', __('Payout request approved'));
    }

    public function rejectPayoutRequest(PayoutRequest $payoutRequest, Request $request)
    {
        $payoutRequest->update([
            'status' => 'rejected',
            'notes' => $request->notes,
        ]);
        return back()->with('success', __('Payout request rejected'));
    }
    
    private function emptyView($settings)
    {
        return Inertia::render('referral/index', [
            'userType' => 'user',
            'settings' => $settings,
            'stats' => [
                'totalReferrals' => 0,
                'totalEarned' => '0.00',
                'totalPayoutRequests' => 0,
                'availableBalance' => '0.00',
            ],
            'payoutRequests' => collect(),
            'referralLink' => '',
        ]);
    }


}