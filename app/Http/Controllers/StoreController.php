<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class StoreController extends BaseController
{
    /**
     * Display a listing of the stores.
     */
    public function index()
    {
        $user = Auth::user();
        
        // If user is company type, show their own stores
        if ($user->type === 'company') {
            $stores = Store::where('user_id', $user->id)->get();
        }
        // If user has store permissions, show creator's stores
        elseif ($user->can('view-stores') && $user->created_by) {
            $stores = Store::where('user_id', $user->created_by)->get();
        }
        // Otherwise, show user's own stores (if any)
        else {
            $stores = Store::where('user_id', $user->id)->get();
        }
        
        // Calculate aggregated statistics
        $storeIds = $stores->pluck('id');
        $totalCustomers = \App\Models\Customer::whereIn('store_id', $storeIds)->count();
        $totalRevenue = \App\Models\Order::whereIn('store_id', $storeIds)->where('payment_status', 'paid')->sum('total_amount');
        
        // Add individual store statistics and URLs
        $stores = $stores->map(function ($store) {
            $store->total_orders = \App\Models\Order::where('store_id', $store->id)->count();
            $store->total_customers = \App\Models\Customer::where('store_id', $store->id)->count();
            $store->total_revenue = \App\Models\Order::where('store_id', $store->id)->where('payment_status', 'paid')->sum('total_amount');
            // Remove backend formatting, let frontend handle it
            
            // Add store URLs
            $store->store_url = getStoreUrl($store);
            $store->qr_code_url = getStoreQrCodeUrl($store);
            $store->copy_link_url = getStoreCopyLinkUrl($store);
            $store->visit_store_url = getStoreVisitUrl($store);
            
            return $store;
        });
        
        // Get currency settings for company stores page
        $storeId = getCurrentStoreId($user);
        $settings = settings($user->id, $storeId);
        $defaultCurrency = $settings['defaultCurrency'] ?? 'USD';
        $storeCurrency = \App\Models\Currency::where('code', $defaultCurrency)->first();
        
        return Inertia::render('stores/index', [
            'stores' => $stores,
            'aggregatedStats' => [
                'totalCustomers' => $totalCustomers,
                'totalRevenue' => $totalRevenue
            ],
            'settings' => $settings,
            'storeCurrency' => $storeCurrency ? [
                'code' => $storeCurrency->code,
                'symbol' => $storeCurrency->symbol,
                'name' => $storeCurrency->name
            ] : [
                'code' => 'USD',
                'symbol' => '$',
                'name' => 'US Dollar'
            ]
        ]);
    }

    /**
     * Show the form for creating a new store.
     */
    public function create()
    {
        $user = Auth::user();
        
        // Get available themes based on user's plan
        $availableThemes = $user->getAvailableThemes();
        
        // Get plan permissions for domain features
        $plan = $user->getCurrentPlan();
        $planPermissions = [
            'enable_custdomain' => $plan->enable_custdomain === 'on',
            'enable_custsubdomain' => $plan->enable_custsubdomain === 'on',
            'pwa_business' => $plan->pwa_business === 'on',
        ];
        
        return Inertia::render('stores/create', [
            'availableThemes' => $availableThemes,
            'planPermissions' => $planPermissions
        ]);
    }

    /**
     * Store a newly created store in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Check if user can create more stores
        $storeCheck = $user->canCreateStore();
        if (!$storeCheck['allowed']) {
            return redirect()->back()->with('error', $storeCheck['message']);
        }
        
        // Validate theme against user's plan
        $availableThemes = $user->getAvailableThemes();
        $themeValidation = 'required|string';
        if ($availableThemes !== null) {
            $themeValidation .= '|in:' . implode(',', $availableThemes);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/|unique:stores,slug',
            'description' => 'nullable|string',
            'theme' => $themeValidation,
            'enable_custom_domain' => 'boolean',
            'enable_custom_subdomain' => 'boolean',
            'custom_domain' => 'nullable|string|max:255',
            'custom_subdomain' => 'nullable|string|max:255',
            // PWA validation
            'enable_pwa' => 'boolean',
            'pwa_name' => 'nullable|string|max:255',
            'pwa_short_name' => 'nullable|string|max:12',
            'pwa_description' => 'nullable|string',
            'pwa_theme_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'pwa_background_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'pwa_icon' => 'nullable|string',
            'pwa_display' => 'nullable|in:standalone,fullscreen,minimal-ui,browser',
            'pwa_orientation' => 'nullable|in:portrait,landscape,any',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Validate plan permissions for domain features
        $plan = $user->getCurrentPlan();
        if ($request->enable_custom_domain && $plan->enable_custdomain !== 'on') {
            return redirect()->back()->with('error', 'Custom domain feature is not available in your current plan.');
        }
        if ($request->enable_custom_subdomain && $plan->enable_custsubdomain !== 'on') {
            return redirect()->back()->with('error', 'Custom subdomain feature is not available in your current plan.');
        }
        if ($request->enable_pwa && $plan->pwa_business !== 'on') {
            return redirect()->back()->with('error', 'PWA feature is not available in your current plan.');
        }
        
        // Ensure only one domain type is enabled
        if ($request->enable_custom_domain && $request->enable_custom_subdomain) {
            return redirect()->back()->with('error', 'You can enable either Custom Domain or Custom Subdomain, not both.');
        }

        $store = new Store();
        $store->name = $request->name;
        $store->slug = $request->slug ? $request->slug : Store::generateUniqueSlug($request->name);
        $store->description = $request->description;
        $store->theme = $request->theme;
        $store->user_id = Auth::id();
        $store->email = $request->email ?? null;
        $store->enable_custom_domain = $request->enable_custom_domain ?? false;
        $store->enable_custom_subdomain = $request->enable_custom_subdomain ?? false;
        $store->custom_domain = $request->enable_custom_domain ? $request->custom_domain : null;
        $store->custom_subdomain = $request->enable_custom_subdomain ? $request->custom_subdomain : null;
        
        // PWA Settings
        $store->enable_pwa = $request->enable_pwa ?? false;
        $store->pwa_name = $request->pwa_name;
        $store->pwa_short_name = $request->pwa_short_name;
        $store->pwa_description = $request->pwa_description;
        $store->pwa_theme_color = $request->pwa_theme_color ?? '#3B82F6';
        $store->pwa_background_color = $request->pwa_background_color ?? '#ffffff';
        $store->pwa_icon = $request->pwa_icon;
        $store->pwa_display = $request->pwa_display ?? 'standalone';
        $store->pwa_orientation = $request->pwa_orientation ?? 'portrait';
        
        $store->save();
        
        // Set this as the current store for the user if they don't have one set
        if (!getCurrentStoreId($user)) {
            $user->current_store = $store->id;
            $user->save();
        }

        // Fire store created event to send email
        // Note: Password can be passed as second parameter if available
        event(new \App\Events\StoreCreated($store));

        return redirect()->route('stores.index')->with('success', __('Store created successfully'));
    }

    /**
     * Display the specified store.
     */
    public function show($id)
    {
        $user = Auth::user();
        
        // Build query based on user type and permissions
        $query = Store::where('id', $id);
        
        if ($user->type === 'company') {
            $query->where('user_id', $user->id);
        } elseif ($user->can('view-stores') && $user->created_by) {
            $query->where('user_id', $user->created_by);
        } else {
            $query->where('user_id', $user->id);
        }
        
        $store = $query->firstOrFail();
        
        // Get dynamic statistics
        $stats = [
            'total_products' => \App\Models\Product::where('store_id', $store->id)->count(),
            'total_orders' => \App\Models\Order::where('store_id', $store->id)->count(),
            'total_customers' => \App\Models\Customer::where('store_id', $store->id)->count(),
            'total_revenue' => \App\Models\Order::where('store_id', $store->id)->where('payment_status', 'paid')->sum('total_amount')
        ];
        
        // Add store URLs
        $store->store_url = getStoreUrl($store);
        $store->qr_code_url = getStoreQrCodeUrl($store);
        $store->copy_link_url = getStoreCopyLinkUrl($store);
        $store->visit_store_url = getStoreVisitUrl($store);
        
        // Get currency settings for store view page
        $settings = settings($user->id, $store->id);
        $defaultCurrency = $settings['defaultCurrency'] ?? 'USD';
        $storeCurrency = \App\Models\Currency::where('code', $defaultCurrency)->first();
        
        return Inertia::render('stores/view', [
            'store' => $store,
            'stats' => $stats,
            'settings' => $settings,
            'storeCurrency' => $storeCurrency ? [
                'code' => $storeCurrency->code,
                'symbol' => $storeCurrency->symbol,
                'name' => $storeCurrency->name
            ] : [
                'code' => 'USD',
                'symbol' => '$',
                'name' => 'US Dollar'
            ]
        ]);
    }

    /**
     * Show the form for editing the specified store.
     */
    public function edit($id)
    {
        $user = Auth::user();
        
        // Build query based on user type and permissions
        $query = Store::where('id', $id);
        
        if ($user->type === 'company') {
            $query->where('user_id', $user->id);
        } elseif ($user->can('edit-stores') && $user->created_by) {
            $query->where('user_id', $user->created_by);
        } else {
            $query->where('user_id', $user->id);
        }
        
        $store = $query->firstOrFail();
        
        // Get available themes based on user's plan (use creator's plan if user is not company)
        $planUser = $user->type === 'company' ? $user : ($user->creator ?? $user);
        $availableThemes = $planUser->getAvailableThemes();
        
        // Get plan permissions for domain features
        $plan = $planUser->getCurrentPlan();
        $planPermissions = [
            'enable_custdomain' => $plan->enable_custdomain === 'on',
            'enable_custsubdomain' => $plan->enable_custsubdomain === 'on',
            'pwa_business' => $plan->pwa_business === 'on',
        ];
        
        return Inertia::render('stores/edit', [
            'store' => $store,
            'availableThemes' => $availableThemes,
            'planPermissions' => $planPermissions
        ]);
    }

    /**
     * Update the specified store in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        // Build query based on user type and permissions
        $query = Store::where('id', $id);
        
        if ($user->type === 'company') {
            $query->where('user_id', $user->id);
        } elseif ($user->can('edit-stores') && $user->created_by) {
            $query->where('user_id', $user->created_by);
        } else {
            $query->where('user_id', $user->id);
        }
        
        $store = $query->firstOrFail();
        
        // Validate theme against user's plan
        $availableThemes = $user->getAvailableThemes();
        $themeValidation = 'required|string';
        if ($availableThemes !== null) {
            $themeValidation .= '|in:' . implode(',', $availableThemes);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|regex:/^[a-z0-9-]+$/|unique:stores,slug,' . $store->id,
            'description' => 'nullable|string',
            'theme' => $themeValidation,
            'enable_custom_domain' => 'boolean',
            'enable_custom_subdomain' => 'boolean',
            'custom_domain' => 'nullable|string|max:255',
            'custom_subdomain' => 'nullable|string|max:255',
            // PWA validation
            'enable_pwa' => 'boolean',
            'pwa_name' => 'nullable|string|max:255',
            'pwa_short_name' => 'nullable|string|max:12',
            'pwa_description' => 'nullable|string',
            'pwa_theme_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'pwa_background_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'pwa_icon' => 'nullable|string',
            'pwa_display' => 'nullable|in:standalone,fullscreen,minimal-ui,browser',
            'pwa_orientation' => 'nullable|in:portrait,landscape,any',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        
        // Validate plan permissions for domain features
        $plan = $user->getCurrentPlan();
        if ($request->enable_custom_domain && $plan->enable_custdomain !== 'on') {
            return redirect()->back()->with('error', 'Custom domain feature is not available in your current plan.');
        }
        if ($request->enable_custom_subdomain && $plan->enable_custsubdomain !== 'on') {
            return redirect()->back()->with('error', 'Custom subdomain feature is not available in your current plan.');
        }
        if ($request->enable_pwa && $plan->pwa_business !== 'on') {
            return redirect()->back()->with('error', 'PWA feature is not available in your current plan.');
        }
        
        // Ensure only one domain type is enabled
        if ($request->enable_custom_domain && $request->enable_custom_subdomain) {
            return redirect()->back()->with('error', 'You can enable either Custom Domain or Custom Subdomain, not both.');
        }

        $store->name = $request->name;
        $store->slug = $request->slug;
        $store->description = $request->description;
        $store->theme = $request->theme;
        $store->email = $request->email ?? $store->email;
        $store->enable_custom_domain = $request->enable_custom_domain ?? false;
        $store->enable_custom_subdomain = $request->enable_custom_subdomain ?? false;
        $store->custom_domain = $request->enable_custom_domain ? $request->custom_domain : null;
        $store->custom_subdomain = $request->enable_custom_subdomain ? $request->custom_subdomain : null;
        
        // PWA Settings
        $store->enable_pwa = $request->enable_pwa ?? false;
        $store->pwa_name = $request->pwa_name;
        $store->pwa_short_name = $request->pwa_short_name;
        $store->pwa_description = $request->pwa_description;
        $store->pwa_theme_color = $request->pwa_theme_color ?? '#3B82F6';
        $store->pwa_background_color = $request->pwa_background_color ?? '#ffffff';
        $store->pwa_icon = $request->pwa_icon;
        $store->pwa_display = $request->pwa_display ?? 'standalone';
        $store->pwa_orientation = $request->pwa_orientation ?? 'portrait';
        
        $store->save();

        return redirect()->route('stores.index')->with('success', __('Store updated successfully'));
    }

    /**
     * Remove the specified store from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        // Build query based on user type and permissions
        $query = Store::where('id', $id);
        
        if ($user->type === 'company') {
            $query->where('user_id', $user->id);
        } elseif ($user->can('delete-stores') && $user->created_by) {
            $query->where('user_id', $user->created_by);
        } else {
            $query->where('user_id', $user->id);
        }
        
        $store = $query->firstOrFail();
        $store->delete();

        return redirect()->route('stores.index')->with('success', __('Store deleted successfully'));
    }
    
    /**
     * Export stores data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        
        // Get stores based on user type and permissions
        if ($user->type === 'company') {
            $stores = Store::where('user_id', $user->id)->get();
        } elseif ($user->can('export-stores') && $user->created_by) {
            $stores = Store::where('user_id', $user->created_by)->get();
        } else {
            $stores = Store::where('user_id', $user->id)->get();
        }
        
        $csvData = [];
        $csvData[] = ['Store Name', 'Slug', 'Domain', 'Email', 'Theme', 'Status', 'Created Date'];
        
        foreach ($stores as $store) {
            $csvData[] = [
                $store->name,
                $store->slug,
                $store->domain ?: 'Not set',
                $store->email ?: 'Not set',
                $store->theme,
                $store->is_active ? 'Active' : 'Inactive',
                $store->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'stores-export-' . now()->format('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        
        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}