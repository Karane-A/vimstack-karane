<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Store;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\User;
use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\PlanRequest;
use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MetricsController extends Controller
{
    public function index()
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403);
        }

        return Inertia::render('superadmin/metrics/index', [
            'ceoMetrics' => $this->getCEOMetrics(),
            'opsMetrics' => $this->getOpsMetrics(),
            'growthMetrics' => $this->getGrowthMetrics(),
        ]);
    }

    private function getCEOMetrics()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $lastMonth = $now->copy()->subMonth()->startOfMonth();
        $thirtyDaysAgo = $now->copy()->subDays(30);

        // 1. Active paying merchants (Paid + ≥ 1 order in 30 days)
        $activePayingMerchants = User::where('type', 'company')
            ->where('plan_is_active', 1)
            ->whereHas('plan', function($q) {
                $q->where('price', '>', 0);
            })
            ->whereHas('stores', function($q) use ($thirtyDaysAgo) {
                $q->whereHas('products', function($pq) use ($thirtyDaysAgo) {
                    // This is a proxy for processed orders if Order model doesn't link directly to User easily
                    // But we can join with orders through store_id
                });
            })
            // Better: Merchants who have at least one order in their stores in the last 30 days
            ->whereIn('id', function($query) use ($thirtyDaysAgo) {
                $query->select('user_id')
                    ->from('stores')
                    ->whereIn('id', function($q) use ($thirtyDaysAgo) {
                        $q->select('store_id')
                            ->from('orders')
                            ->where('created_at', '>=', $thirtyDaysAgo);
                    });
            })
            ->count();

        // 2. Monthly Recurring Revenue (MRR)
        $mrr = User::where('type', 'company')
            ->where('plan_is_active', 1)
            ->join('plans', 'users.plan_id', '=', 'plans.id')
            ->selectRaw('SUM(CASE WHEN users.plan_expire_date > DATE_ADD(users.created_at, INTERVAL 1 MONTH) THEN plans.yearly_price / 12 ELSE plans.price END) as total_mrr')
            ->first()->total_mrr ?? 0;

        // 3. Net Merchant Growth (New - Churned)
        $newMerchants = User::where('type', 'company')
            ->where('created_at', '>=', $startOfMonth)
            ->count();
            
        $churnedMerchants = User::where('type', 'company')
            ->where(function($q) use ($startOfMonth) {
                $q->where('plan_expire_date', '<', $startOfMonth)
                  ->orWhere('plan_is_active', 0);
            })
            ->where('updated_at', '>=', $startOfMonth)
            ->count();
            
        $netGrowth = $newMerchants - $churnedMerchants;

        // 4. Churn Rate (Monthly)
        $merchantsAtStart = User::where('type', 'company')
            ->where('created_at', '<', $startOfMonth)
            ->where('plan_is_active', 1)
            ->count();
        $churnRate = $merchantsAtStart > 0 ? ($churnedMerchants / $merchantsAtStart) * 100 : 0;

        // 5. Accounts in Grace Period (Pending payment past 7 days)
        $gracePeriodAccounts = User::where('type', 'company')
            ->where('plan_expire_date', '<', $now)
            ->where('plan_expire_date', '>=', $now->copy()->subDays(7))
            ->count();

        // 6. Failed Subscription Payments (Count + Value)
        $failedPayments = PlanOrder::where('status', 'rejected')
            ->where('created_at', '>=', $startOfMonth)
            ->selectRaw('COUNT(*) as count, SUM(final_price) as value')
            ->first();

        // 7. Plan Mix
        $planMix = User::where('type', 'company')
            ->where('plan_is_active', 1)
            ->join('plans', 'users.plan_id', '=', 'plans.id')
            ->select('plans.name', DB::raw('count(*) as count'), DB::raw('SUM(plans.price) as value'))
            ->groupBy('plans.name')
            ->get();

        return [
            'active_paying_merchants' => $activePayingMerchants,
            'mrr' => $mrr,
            'net_growth' => $netGrowth,
            'churn_rate' => round($churnRate, 2),
            'grace_period' => $gracePeriodAccounts,
            'failed_payments' => [
                'count' => $failedPayments->count ?? 0,
                'value' => $failedPayments->value ?? 0
            ],
            'plan_mix' => $planMix
        ];
    }

    private function getOpsMetrics()
    {
        $now = Carbon::now();
        $startOfWeek = $now->copy()->startOfWeek();

        // 1. Time to first order
        $timeToFirstOrder = DB::table('users as u')
            ->join('stores as s', 'u.id', '=', 's.user_id')
            ->join('orders as o', 's.id', '=', 'o.store_id')
            ->where('u.type', 'company')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(HOUR, u.created_at, o.created_at)) as avg_hours'))
            ->first()->avg_hours ?? 0;

        // 2. Orders per merchant
        $activeMerchantsCount = User::where('type', 'company')->where('plan_is_active', 1)->count();
        $weeklyOrdersCount = Order::where('created_at', '>=', $startOfWeek)->count();
        $ordersPerMerchant = $activeMerchantsCount > 0 ? $weeklyOrdersCount / $activeMerchantsCount : 0;

        // 3. Payment Success Rate
        $successPayments = PlanOrder::where('status', 'approved')->where('created_at', '>=', $startOfWeek)->count();
        $totalAttempts = PlanOrder::whereIn('status', ['approved', 'rejected'])->where('created_at', '>=', $startOfWeek)->count();
        $paymentSuccessRate = $totalAttempts > 0 ? ($successPayments / $totalAttempts) * 100 : 0;

        return [
            'time_to_first_order_hours' => round($timeToFirstOrder, 1),
            'orders_per_merchant' => round($ordersPerMerchant, 2),
            'payment_success_rate' => round($paymentSuccessRate, 2),
        ];
    }

    private function getGrowthMetrics()
    {
        $startOfMonth = Carbon::now()->startOfMonth();

        // 1. Merchants by source
        $merchantsBySource = User::where('type', 'company')
            ->select('used_referral_code', DB::raw('count(*) as count'))
            ->groupBy('used_referral_code')
            ->get();

        // 2. Partner conversion (Referred users who are on paid plans)
        $partnerConversion = User::where('type', 'company')
            ->whereNotNull('used_referral_code')
            ->where('plan_is_active', 1)
            ->whereHas('plan', function($q) {
                $q->where('price', '>', 0);
            })
            ->count();

        // 3. Commission cost
        $commissionCost = User::sum('commission_amount');

        return [
            'merchants_by_source' => $merchantsBySource,
            'partner_conversion' => $partnerConversion,
            'commission_cost' => $commissionCost,
        ];
    }
}
