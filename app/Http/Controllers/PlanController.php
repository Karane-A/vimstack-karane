<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Company users see only active plans
        if ($user->type !== 'superadmin') {
            return $this->companyPlansView($request);
        }
        
        // Admin view
        $billingCycle = $request->input('billing_cycle', 'monthly');
        
        $dbPlans = Plan::all();
        $hasDefaultPlan = $dbPlans->where('is_default', true)->count() > 0;
        
        $plans = $dbPlans->map(function ($plan) use ($billingCycle) {
            // Determine features based on plan attributes
            $features = [];
            if ($plan->enable_custdomain === 'on') $features[] = 'Custom Domain';
            if ($plan->enable_custsubdomain === 'on') $features[] = 'Subdomain';
            if ($plan->pwa_business === 'on') $features[] = 'PWA';
            if ($plan->enable_chatgpt === 'on') $features[] = 'AI Integration';
            if ($plan->enable_custom_pages === 'on') $features[] = 'Custom Pages';
            if ($plan->enable_blog === 'on') $features[] = 'Blog';
            if ($plan->enable_shipping_method === 'on') $features[] = 'Shipping Method';
            
            // Get price based on billing cycle
            $price = $billingCycle === 'yearly' ? $plan->yearly_price : $plan->price;
            
            // Format price with currency symbol
            $formattedPrice = $this->formatPlanPrice($price);
            
            // Set duration based on billing cycle
            $duration = $billingCycle === 'yearly' ? 'Yearly' : 'Monthly';
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $price,
                'formattedPrice' => $formattedPrice,
                'duration' => $duration,
                'description' => $plan->description,
                'trial_days' => $plan->trial_day,
                'features' => $features,
                'stats' => [
                    'stores' => $plan->max_stores ?? $plan->business ?? 0,
                    'users_per_store' => $plan->max_users_per_store ?? $plan->max_users ?? 0,
                    'products_per_store' => $plan->max_products_per_store ?? 0,
                    'storage' => $plan->storage_limit . ' GB',
                    'templates' => $this->getThemeCount($plan->themes)
                ],
                'status' => $plan->is_plan_enable === 'on',
                'is_default' => $plan->is_default,
                'recommended' => false // Default to false
            ];
        })->toArray();
        
        // Mark the plan with most subscribers as recommended
        $planSubscriberCounts = Plan::withCount('users')->get()->pluck('users_count', 'id');
        $mostSubscribedPlanId = $planSubscriberCounts->keys()->first();
        if ($planSubscriberCounts->isNotEmpty()) {
            $mostSubscribedPlanId = $planSubscriberCounts->keys()->sortByDesc(function($planId) use ($planSubscriberCounts) {
                return $planSubscriberCounts[$planId];
            })->first();
        }
        
        foreach ($plans as &$plan) {
            if ($plan['id'] == $mostSubscribedPlanId) {
                $plan['recommended'] = true;
                break;
            }
        }

        $activePlansCount = Plan::where('is_plan_enable', 'on')->count();
        
        return Inertia::render('plans/index', [
            'plans' => $plans,
            'billingCycle' => $billingCycle,
            'hasDefaultPlan' => $hasDefaultPlan,
            'isAdmin' => true,
            'activePlansCount' => $activePlansCount
        ]);
    }
    
    /**
     * Toggle plan status
     */
    public function toggleStatus(Plan $plan)
    {
        $plan->is_plan_enable = $plan->is_plan_enable === 'on' ? 'off' : 'on';
        $plan->save();
        
        return back()->with('success', __('Plan status updated successfully'));
    }
    
    /**
     * Show the form for creating a new plan
     */
    public function create()
    {
        $hasDefaultPlan = Plan::where('is_default', true)->exists();
        
        return Inertia::render('plans/create', [
            'hasDefaultPlan' => $hasDefaultPlan
        ]);
    }
    
    /**
     * Store a newly created plan
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:plans',
            'price' => 'required|numeric|min:0',
            'yearly_price' => 'nullable|numeric|min:0',
            'duration' => 'required|string',
            'description' => 'nullable|string',
            'max_stores' => 'required|integer|min:0',
            'max_users_per_store' => 'required|integer|min:0',
            'max_products_per_store' => 'required|integer|min:0',
            'storage_limit' => 'required|numeric|min:0',
            'enable_custdomain' => 'nullable|in:on,off',
            'enable_custsubdomain' => 'nullable|in:on,off',
            'pwa_business' => 'nullable|in:on,off',
            'enable_chatgpt' => 'nullable|in:on,off',
            'enable_custom_pages' => 'nullable|in:on,off',
            'enable_blog' => 'nullable|in:on,off',
            'enable_shipping_method' => 'nullable|in:on,off',
            'themes' => 'nullable|array',
            'is_trial' => 'nullable|in:on,off',
            'trial_day' => 'nullable|integer|min:0',
            'is_plan_enable' => 'nullable|in:on,off',
            'is_default' => 'nullable|boolean',
        ]);
        
        // Set default values for nullable fields
        $validated['enable_custdomain'] = $validated['enable_custdomain'] ?? 'off';
        $validated['enable_custsubdomain'] = $validated['enable_custsubdomain'] ?? 'off';
        $validated['pwa_business'] = $validated['pwa_business'] ?? 'off';
        $validated['enable_chatgpt'] = $validated['enable_chatgpt'] ?? 'off';
        $validated['enable_custom_pages'] = $validated['enable_custom_pages'] ?? 'off';
        $validated['enable_blog'] = $validated['enable_blog'] ?? 'off';
        $validated['enable_shipping_method'] = $validated['enable_shipping_method'] ?? 'off';
        $validated['is_trial'] = $validated['is_trial'] ?? null;
        $validated['is_plan_enable'] = $validated['is_plan_enable'] ?? 'on';
        $validated['is_default'] = $validated['is_default'] ?? false;
        
        // If yearly_price is not provided, calculate it as 80% of monthly price * 12
        if (!isset($validated['yearly_price']) || $validated['yearly_price'] === null) {
            $validated['yearly_price'] = $validated['price'] * 12 * 0.8;
        }
        
        // If this plan is set as default, remove default status from other plans
        if ($validated['is_default']) {
            Plan::where('is_default', true)->update(['is_default' => false]);
        }
        
        // Create the plan
        Plan::create($validated);
        
        return redirect()->route('plans.index')->with('success', __('Plan created successfully.'));
    }
    
    /**
     * Show the form for editing a plan
     */
    public function edit(Plan $plan)
    {
        $otherDefaultPlanExists = Plan::where('is_default', true)
            ->where('id', '!=', $plan->id)
            ->exists();
            
        return Inertia::render('plans/edit', [
            'plan' => $plan,
            'otherDefaultPlanExists' => $otherDefaultPlanExists
        ]);
    }
    
    /**
     * Update a plan
     */
    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:plans,name,' . $plan->id,
            'price' => 'required|numeric|min:0',
            'yearly_price' => 'nullable|numeric|min:0',
            'duration' => 'required|string',
            'description' => 'nullable|string',
            'max_stores' => 'required|integer|min:0',
            'max_users_per_store' => 'required|integer|min:0',
            'max_products_per_store' => 'required|integer|min:0',
            'storage_limit' => 'required|numeric|min:0',
            'enable_custdomain' => 'nullable|in:on,off',
            'enable_custsubdomain' => 'nullable|in:on,off',
            'pwa_business' => 'nullable|in:on,off',
            'enable_chatgpt' => 'nullable|in:on,off',
            'enable_custom_pages' => 'nullable|in:on,off',
            'enable_blog' => 'nullable|in:on,off',
            'enable_shipping_method' => 'nullable|in:on,off',
            'themes' => 'nullable|array',
            'is_trial' => 'nullable|in:on,off',
            'trial_day' => 'nullable|integer|min:0',
            'is_plan_enable' => 'nullable|in:on,off',
            'is_default' => 'nullable|boolean',
        ]);
        
        // Set default values for nullable fields
        $validated['enable_custdomain'] = $validated['enable_custdomain'] ?? 'off';
        $validated['enable_custsubdomain'] = $validated['enable_custsubdomain'] ?? 'off';
        $validated['pwa_business'] = $validated['pwa_business'] ?? 'off';
        $validated['enable_chatgpt'] = $validated['enable_chatgpt'] ?? 'off';
        $validated['enable_custom_pages'] = $validated['enable_custom_pages'] ?? 'off';
        $validated['enable_blog'] = $validated['enable_blog'] ?? 'off';
        $validated['enable_shipping_method'] = $validated['enable_shipping_method'] ?? 'off';
        $validated['is_trial'] = $validated['is_trial'] ?? null;
        $validated['is_plan_enable'] = $validated['is_plan_enable'] ?? 'on';
        $validated['is_default'] = $validated['is_default'] ?? false;
        
        // If yearly_price is not provided, calculate it as 80% of monthly price * 12
        if (!isset($validated['yearly_price']) || $validated['yearly_price'] === null) {
            $validated['yearly_price'] = $validated['price'] * 12 * 0.8;
        }
        
        // If this plan is set as default, remove default status from other plans
        if ($validated['is_default'] && !$plan->is_default) {
            Plan::where('is_default', true)->update(['is_default' => false]);
        }
        
        // Update the plan
        $plan->update($validated);
        
        return redirect()->route('plans.index')->with('success', __('Plan updated successfully.'));
    }
    
    /**
     * Delete a plan
     */
    public function destroy(Plan $plan)
    {
        // Don't allow deleting the default plan
        if ($plan->is_default) {
            return back()->with('error', __('Cannot delete the default plan.'));
        }
        
        $plan->delete();
        
        return redirect()->route('plans.index')->with('success', __('Plan deleted successfully.'));
    }
    
    private function companyPlansView(Request $request)
    {
        $user = auth()->user();
        $billingCycle = $request->input('billing_cycle', 'monthly');
        
        $dbPlans = Plan::where('is_plan_enable', 'on')->get();
        
        $plans = $dbPlans->map(function ($plan) use ($billingCycle, $user) {
            $price = $billingCycle === 'yearly' ? $plan->yearly_price : $plan->price;
            
            $features = [];
            if ($plan->enable_custdomain === 'on') $features[] = 'Custom Domain';
            if ($plan->enable_custsubdomain === 'on') $features[] = 'Subdomain';
            if ($plan->pwa_business === 'on') $features[] = 'PWA';
            if ($plan->enable_chatgpt === 'on') $features[] = 'AI Integration';
            if ($plan->enable_custom_pages === 'on') $features[] = 'Custom Pages';
            if ($plan->enable_blog === 'on') $features[] = 'Blog';
            if ($plan->enable_shipping_method === 'on') $features[] = 'Shipping Method';
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $price,
                'formatted_price' => $this->formatPlanPrice($price),
                'duration' => $billingCycle === 'yearly' ? 'Yearly' : 'Monthly',
                'description' => $plan->description,
                'trial_days' => $plan->trial_day,
                'features' => $features,
                'stats' => [
                    'stores' => $plan->max_stores ?? $plan->business ?? 0,
                    'users_per_store' => $plan->max_users_per_store ?? $plan->max_users ?? 0,
                    'products_per_store' => $plan->max_products_per_store ?? 0,
                    'storage' => $plan->storage_limit . ' GB',
                    'templates' => $this->getThemeCount($plan->themes)
                ],
                'is_current' => $user->plan_id == $plan->id,
                'is_trial_available' => $plan->is_trial === 'on' && !$user->is_trial,
                'is_default' => $plan->is_default,
                'recommended' => false // Default to false
            ];
        });
        
        // Mark the plan with most subscribers as recommended
        $planSubscriberCounts = Plan::withCount('users')->get()->pluck('users_count', 'id');
        if ($planSubscriberCounts->isNotEmpty()) {
            $mostSubscribedPlanId = $planSubscriberCounts->keys()->sortByDesc(function($planId) use ($planSubscriberCounts) {
                return $planSubscriberCounts[$planId];
            })->first();
            
            $plans = $plans->map(function($plan) use ($mostSubscribedPlanId) {
                if ($plan['id'] == $mostSubscribedPlanId) {
                    $plan['recommended'] = true;
                }
                return $plan;
            });
        }
        
        $activePlansCount = Plan::where('is_plan_enable', 'on')->count();
        
        return Inertia::render('plans/index', [
            'plans' => $plans,
            'billingCycle' => $billingCycle,
            'currentPlan' => $user->plan,
            'userTrialUsed' => $user->is_trial,
            'activePlansCount' => $activePlansCount
        ]);
    }
    
    public function requestPlan(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->can('request-plans')) {
            abort(403, 'You do not have permission to request plans');
        }
        
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly'
        ]);
        
        $plan = Plan::findOrFail($request->plan_id);
        
        \App\Models\PlanRequest::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'duration' => $request->billing_cycle,
            'status' => 'pending'
        ]);
        
        return back()->with('success', __('Plan request submitted successfully'));
    }
    
    public function startTrial(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->can('trial-plans')) {
            abort(403, 'You do not have permission to start trials');
        }
        
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);
        
        $plan = Plan::findOrFail($request->plan_id);
        if ($user->is_trial || $plan->is_trial !== 'on') {
            return back()->withErrors(['error' => 'Trial not available']);
        }
        
        $user->update([
            'plan_id' => $plan->id,
            'is_trial' => 1,
            'trial_day' => $plan->trial_day,
            'trial_expire_date' => now()->addDays($plan->trial_day)
        ]);
        
        return back()->with('success', __('Trial started successfully'));
    }
    
    public function subscribe(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->can('subscribe-plans')) {
            abort(403, 'You do not have permission to subscribe to plans');
        }
        
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly'
        ]);
        
        $plan = Plan::findOrFail($request->plan_id);
        $price = $request->billing_cycle === 'yearly' ? $plan->yearly_price : $plan->price;
        
        \App\Models\PlanOrder::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'original_price' => $price,
            'final_price' => $price,
            'status' => 'pending'
        ]);
        
        return back()->with('success', __('Subscription request submitted successfully'));
    }
    
    /**
     * Get theme count for display
     */
    private function getThemeCount($themes)
    {
        if (is_array($themes) && count($themes) > 0) {
            return count($themes);
        }
        return 'All (10)'; // All available themes
    }
    
    /**
     * Format plan price using superadmin currency settings
     */
    private function formatPlanPrice($price)
    {
        // Get superadmin user
        $superadmin = \App\Models\User::where('type', 'superadmin')->first();
        if (!$superadmin) {
            return '$' . number_format($price, 2);
        }
        
        // Get superadmin currency settings
        $settings = settings($superadmin->id);
        $currencyCode = $settings['defaultCurrency'] ?? 'USD';
        $position = $settings['currencySymbolPosition'] ?? 'before';
        $decimals = (int)($settings['decimalFormat'] ?? 2);
        $decimalSeparator = $settings['decimalSeparator'] ?? '.';
        $thousandsSeparator = $settings['thousandsSeparator'] ?? ',';
        
        // Get currency symbol
        $currency = \App\Models\Currency::where('code', $currencyCode)->first();
        $symbol = $currency ? $currency->symbol : '$';
        
        // Format the number
        $formattedNumber = number_format($price, $decimals, $decimalSeparator, $thousandsSeparator);
        
        // Return with currency symbol in correct position
        return $position === 'after' 
            ? $formattedNumber . $symbol
            : $symbol . $formattedNumber;
    }
}