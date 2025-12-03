<?php

namespace App\Http\Controllers;

use App\Models\ExpressCheckout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpressCheckoutController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $checkouts = ExpressCheckout::where('store_id', $currentStoreId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Get statistics
        $totalCheckouts = ExpressCheckout::where('store_id', $currentStoreId)->count();
        $activeCheckouts = ExpressCheckout::where('store_id', $currentStoreId)->where('is_active', true)->count();
        $totalConversions = ExpressCheckout::where('store_id', $currentStoreId)->sum('conversions');
        $totalRevenue = ExpressCheckout::where('store_id', $currentStoreId)->sum('revenue');
        
        // Calculate conversion rate
        $conversionRate = 0;
        if ($totalConversions > 0) {
            // This is a placeholder - in a real implementation, this would be calculated
            // based on actual data like visits vs. conversions
            $conversionRate = 23.5;
        }

        return Inertia::render('express-checkout/index', [
            'checkouts' => $checkouts,
            'stats' => [
                'total' => $totalCheckouts,
                'active' => $activeCheckouts,
                'conversionRate' => $conversionRate,
                'totalRevenue' => $totalRevenue
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('express-checkout/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'payment_methods' => 'nullable|array',
            'default_payment_method' => 'nullable|string|max:50',
            'skip_cart' => 'boolean',
            'auto_fill_customer_data' => 'boolean',
            'guest_checkout_allowed' => 'boolean',
            'mobile_optimized' => 'boolean',
            'save_payment_methods' => 'boolean',
            'success_redirect_url' => 'nullable|string|max:255',
            'cancel_redirect_url' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $checkout = ExpressCheckout::create([
            'store_id' => $currentStoreId,
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'button_text' => $request->button_text ?? 'Buy Now',
            'button_color' => $request->button_color ?? '#000000',
            'is_active' => $request->is_active ?? true,
            'payment_methods' => $request->payment_methods,
            'default_payment_method' => $request->default_payment_method,
            'skip_cart' => $request->skip_cart ?? true,
            'auto_fill_customer_data' => $request->auto_fill_customer_data ?? true,
            'guest_checkout_allowed' => $request->guest_checkout_allowed ?? false,
            'mobile_optimized' => $request->mobile_optimized ?? true,
            'save_payment_methods' => $request->save_payment_methods ?? false,
            'success_redirect_url' => $request->success_redirect_url,
            'cancel_redirect_url' => $request->cancel_redirect_url,
        ]);

        return redirect()->route('express-checkout.index')
            ->with('success', 'Express checkout created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $checkout = ExpressCheckout::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        // Calculate performance statistics
        $totalViews = rand(500, 2000); // Simulated views data
        $conversions = $checkout->conversions ?? 0;
        $revenue = $checkout->revenue ?? 0;
        $conversionRate = $totalViews > 0 ? round(($conversions / $totalViews) * 100, 2) : 0;
        $averageOrderValue = $conversions > 0 ? round($revenue / $conversions, 2) : 0;
        
        // Recent performance (last 30 days)
        $recentConversions = round($conversions * 0.3); // 30% of total conversions in recent period
        $recentRevenue = round($revenue * 0.3, 2);
        $recentViews = round($totalViews * 0.25);
        $recentConversionRate = $recentViews > 0 ? round(($recentConversions / $recentViews) * 100, 2) : 0;
        
        $performanceStats = [
            'total_views' => $totalViews,
            'conversions' => $conversions,
            'conversion_rate' => $conversionRate,
            'revenue' => $revenue,
            'average_order_value' => $averageOrderValue,
            'recent_conversions' => $recentConversions,
            'recent_revenue' => $recentRevenue,
            'recent_conversion_rate' => $recentConversionRate,
            'bounce_rate' => rand(25, 65), // Simulated bounce rate
            'mobile_conversion_rate' => round($conversionRate * rand(80, 120) / 100, 2)
        ];
        
        // Get recent transactions (placeholder)
        $recentTransactions = [
            [
                'id' => '#TXN-001',
                'customer' => 'John Doe',
                'amount' => 89.99,
                'method' => 'Credit Card',
                'date' => '2024-01-15'
            ],
            [
                'id' => '#TXN-002',
                'customer' => 'Jane Smith',
                'amount' => 156.50,
                'method' => 'PayPal',
                'date' => '2024-01-14'
            ],
            [
                'id' => '#TXN-003',
                'customer' => 'Mike Johnson',
                'amount' => 234.00,
                'method' => 'Credit Card',
                'date' => '2024-01-13'
            ]
        ];
        
        // Format transaction amounts for display
        foreach ($recentTransactions as &$transaction) {
            $transaction['formatted_amount'] = formatStoreCurrency($transaction['amount'], $user->id, $currentStoreId);
        }
        
        return Inertia::render('express-checkout/show', [
            'checkout' => $checkout,
            'performanceStats' => $performanceStats,
            'recentTransactions' => $recentTransactions
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $checkout = ExpressCheckout::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        return Inertia::render('express-checkout/edit', [
            'checkout' => $checkout
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'payment_methods' => 'nullable|array',
            'default_payment_method' => 'nullable|string|max:50',
            'skip_cart' => 'boolean',
            'auto_fill_customer_data' => 'boolean',
            'guest_checkout_allowed' => 'boolean',
            'mobile_optimized' => 'boolean',
            'save_payment_methods' => 'boolean',
            'success_redirect_url' => 'nullable|string|max:255',
            'cancel_redirect_url' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $checkout = ExpressCheckout::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        $checkout->update([
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'button_text' => $request->button_text,
            'button_color' => $request->button_color,
            'is_active' => $request->is_active,
            'payment_methods' => $request->payment_methods,
            'default_payment_method' => $request->default_payment_method,
            'skip_cart' => $request->skip_cart,
            'auto_fill_customer_data' => $request->auto_fill_customer_data,
            'guest_checkout_allowed' => $request->guest_checkout_allowed,
            'mobile_optimized' => $request->mobile_optimized,
            'save_payment_methods' => $request->save_payment_methods,
            'success_redirect_url' => $request->success_redirect_url,
            'cancel_redirect_url' => $request->cancel_redirect_url,
        ]);

        return redirect()->route('express-checkout.index')
            ->with('success', 'Express checkout updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $checkout = ExpressCheckout::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        $checkout->delete();

        return redirect()->route('express-checkout.index')
            ->with('success', 'Express checkout deleted successfully!');
    }
}