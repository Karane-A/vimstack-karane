<?php

namespace App\Http\Controllers;

use App\Models\Shipping;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShippingController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $shippings = Shipping::where('store_id', $currentStoreId)
            ->orderBy('sort_order')
            ->get();
            
        // Get statistics
        $totalShippings = Shipping::where('store_id', $currentStoreId)->count();
        $activeShippings = Shipping::where('store_id', $currentStoreId)->where('is_active', true)->count();
        $shippingZones = Shipping::where('store_id', $currentStoreId)->distinct('zone_type')->count('zone_type');
        $avgShippingCost = Shipping::where('store_id', $currentStoreId)->where('type', '!=', 'free_shipping')->avg('cost') ?? 0;

        return Inertia::render('shipping/index', [
            'shippings' => $shippings,
            'stats' => [
                'totalShippings' => $totalShippings,
                'activeShippings' => $activeShippings,
                'shippingZones' => $shippingZones,
                'avgShippingCost' => round($avgShippingCost, 2)
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('shipping/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:flat_rate,free_shipping,weight_based,distance_based,percentage_based',
            'description' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'delivery_time' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'zone_type' => 'nullable|string|in:domestic,international,local,regional',
            'countries' => 'nullable|string',
            'postal_codes' => 'nullable|string',
            'max_distance' => 'nullable|numeric|min:0',
            'max_weight' => 'nullable|numeric|min:0',
            'max_dimensions' => 'nullable|string',
            'require_signature' => 'boolean',
            'insurance_required' => 'boolean',
            'tracking_available' => 'boolean',
            'handling_fee' => 'nullable|numeric|min:0'
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $data = $request->all();
        $data['store_id'] = $currentStoreId;
        
        // If free shipping, set cost to 0
        if ($data['type'] === 'free_shipping') {
            $data['cost'] = 0;
        }

        Shipping::create($data);

        return redirect()->route('shipping.index')
            ->with('success', 'Shipping method created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $shipping = Shipping::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        // Increment view count
        $shipping->incrementViews();
        
        // Calculate dynamic shipping statistics from actual orders
        $orders = \App\Models\Order::where('store_id', $currentStoreId)
                                  ->where('shipping_method_id', $shipping->id)
                                  ->get();
        
        $totalOrders = $orders->count();
        $totalRevenue = $orders->sum('shipping_amount');
        $avgShippingCost = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        $recentOrders = $orders->where('created_at', '>=', now()->subDays(30))->count();
        $deliveredOrders = $orders->where('status', 'delivered')->count();
        $deliveryRate = $totalOrders > 0 ? ($deliveredOrders / $totalOrders) * 100 : 0;
        
        // Calculate average delivery time for delivered orders
        $avgDeliveryDays = 0;
        if ($deliveredOrders > 0) {
            $deliveryTimes = $orders->where('status', 'delivered')
                                   ->map(function($order) {
                                       return $order->created_at->diffInDays($order->updated_at);
                                   });
            $avgDeliveryDays = $deliveryTimes->avg();
        }
        
        $stats = [
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'avg_shipping_cost' => $avgShippingCost,
            'recent_orders' => $recentOrders,
            'delivered_orders' => $deliveredOrders,
            'delivery_rate' => $deliveryRate,
            'avg_delivery_days' => round($avgDeliveryDays, 1),
            'views' => $shipping->views ?? 0,
        ];
        
        // Get recent orders using this shipping method
        $recentOrdersList = $orders->take(5)->map(function($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_first_name . ' ' . $order->customer_last_name,
                'shipping_cost' => $order->shipping_amount,
                'status' => $order->status,
                'date' => $order->created_at->format('M j, Y')
            ];
        });
        
        return Inertia::render('shipping/show', [
            'shipping' => $shipping,
            'stats' => $stats,
            'recentOrders' => $recentOrdersList
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $shipping = Shipping::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        return Inertia::render('shipping/edit', [
            'shipping' => $shipping
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:flat_rate,free_shipping,weight_based,distance_based,percentage_based',
            'description' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'delivery_time' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'zone_type' => 'nullable|string|in:domestic,international,local,regional',
            'countries' => 'nullable|string',
            'postal_codes' => 'nullable|string',
            'max_distance' => 'nullable|numeric|min:0',
            'max_weight' => 'nullable|numeric|min:0',
            'max_dimensions' => 'nullable|string',
            'require_signature' => 'boolean',
            'insurance_required' => 'boolean',
            'tracking_available' => 'boolean',
            'handling_fee' => 'nullable|numeric|min:0'
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $shipping = Shipping::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        $data = $request->all();
        
        // If free shipping, set cost to 0
        if ($data['type'] === 'free_shipping') {
            $data['cost'] = 0;
        }

        $shipping->update($data);

        return redirect()->route('shipping.index')
            ->with('success', 'Shipping method updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $shipping = Shipping::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        $shipping->delete();

        return redirect()->route('shipping.index')
            ->with('success', 'Shipping method deleted successfully!');
    }
    
    /**
     * Export shipping methods data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $shippings = Shipping::where('store_id', $currentStoreId)
            ->orderBy('sort_order')
            ->get();
        
        $csvData = [];
        $csvData[] = ['Shipping Method', 'Type', 'Cost', 'Zone Type', 'Min Order Amount', 'Delivery Time', 'Max Weight', 'Tracking Available', 'Status', 'Created Date'];
        
        foreach ($shippings as $shipping) {
            $csvData[] = [
                $shipping->name,
                ucfirst(str_replace('_', ' ', $shipping->type)),
                $shipping->type === 'free_shipping' ? 'Free' : formatStoreCurrency($shipping->cost, $user->id, $currentStoreId),
                $shipping->zone_type ? ucfirst($shipping->zone_type) : 'All zones',
                $shipping->min_order_amount ? formatStoreCurrency($shipping->min_order_amount, $user->id, $currentStoreId) : 'No minimum',
                $shipping->delivery_time ?: 'Not specified',
                $shipping->max_weight ? $shipping->max_weight . ' kg' : 'No limit',
                $shipping->tracking_available ? 'Yes' : 'No',
                $shipping->is_active ? 'Active' : 'Inactive',
                $shipping->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'shipping-methods-export-' . now()->format('Y-m-d') . '.csv';
        
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