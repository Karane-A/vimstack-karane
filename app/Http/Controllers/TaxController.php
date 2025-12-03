<?php

namespace App\Http\Controllers;

use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TaxController extends BaseController
{
    /**
     * Display a listing of the tax rules.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get tax rules for the current store
        $taxes = Tax::where('store_id', $currentStoreId)->get();
        
        // Calculate statistics
        $totalTaxes = $taxes->count();
        $activeTaxes = $taxes->where('is_active', true)->count();
        $averageRate = $taxes->count() > 0 ? $taxes->avg('rate') : 0;
        
        // Calculate tax collected dynamically from orders this month
        $taxCollected = 0;
        if ($taxes->count() > 0) {
            $taxIds = $taxes->pluck('id');
            $productsWithTax = \App\Models\Product::whereIn('tax_id', $taxIds)
                                                 ->where('store_id', $currentStoreId)
                                                 ->pluck('id');
            
            $thisMonthOrderItems = \App\Models\OrderItem::whereIn('product_id', $productsWithTax)
                                                        ->whereMonth('created_at', now()->month)
                                                        ->whereYear('created_at', now()->year)
                                                        ->get();
            
            foreach ($thisMonthOrderItems as $item) {
                $product = \App\Models\Product::find($item->product_id);
                if ($product && $product->tax) {
                    $taxAmount = ($item->total_price * $product->tax->rate) / 100;
                    $taxCollected += $taxAmount;
                }
            }
        }
        
        return Inertia::render('tax/index', [
            'taxes' => $taxes,
            'stats' => [
                'total' => $totalTaxes,
                'active' => $activeTaxes,
                'averageRate' => round($averageRate, 2),
                'collected' => round($taxCollected, 2)
            ]
        ]);
    }

    /**
     * Show the form for creating a new tax rule.
     */
    public function create()
    {
        return Inertia::render('tax/create');
    }

    /**
     * Store a newly created tax rule in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:percentage,fixed',
            'region' => 'nullable|string|max:255',
            'priority' => 'nullable|integer|min:1',
            'compound' => 'nullable|boolean',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $tax = new Tax();
        $tax->name = $request->name;
        $tax->rate = $request->rate;
        $tax->type = $request->type;
        $tax->region = $request->region;
        $tax->priority = $request->priority ?? 1;
        $tax->compound = $request->has('compound') ? $request->compound : false;
        $tax->is_active = $request->has('is_active') ? $request->is_active : true;
        $tax->store_id = $currentStoreId;
        $tax->save();

        return redirect()->route('tax.index')->with('success', __('Tax rule created successfully'));
    }

    /**
     * Display the specified tax rule.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $tax = Tax::where('store_id', $currentStoreId)->findOrFail($id);
        
        // Calculate dynamic tax statistics
        $productsWithTax = \App\Models\Product::where('tax_id', $tax->id)
                                             ->where('store_id', $currentStoreId)
                                             ->pluck('id');
        
        $orderItems = \App\Models\OrderItem::whereIn('product_id', $productsWithTax)->get();
        
        // Calculate tax collected based on tax rate and order totals
        $totalTaxCollected = 0;
        $thisMonthTaxCollected = 0;
        $ordersCount = $orderItems->count();
        
        foreach ($orderItems as $item) {
            $taxAmount = ($item->total_price * $tax->rate) / 100;
            $totalTaxCollected += $taxAmount;
            
            // Check if order is from this month
            if ($item->created_at && $item->created_at->isCurrentMonth()) {
                $thisMonthTaxCollected += $taxAmount;
            }
        }
        
        $stats = [
            'collected' => round($thisMonthTaxCollected, 2),
            'orders' => $ordersCount,
            'total' => round($totalTaxCollected, 2),
            'products_count' => $productsWithTax->count(),
        ];
        
        // Format currency values for display
        $stats['formatted_collected'] = formatStoreCurrency($stats['collected'], $user->id, $currentStoreId);
        $stats['formatted_total'] = formatStoreCurrency($stats['total'], $user->id, $currentStoreId);
        
        // Get products using this tax
        $products = \App\Models\Product::where('tax_id', $tax->id)
                                      ->where('store_id', $currentStoreId)
                                      ->select('id', 'name', 'price', 'is_active')
                                      ->get();
        
        // Format product prices
        foreach ($products as $product) {
            $product->formatted_price = formatStoreCurrency($product->price, $user->id, $currentStoreId);
        }
        
        return Inertia::render('tax/show', [
            'tax' => $tax,
            'stats' => $stats,
            'products' => $products
        ]);
    }

    /**
     * Show the form for editing the specified tax rule.
     */
    public function edit(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $tax = Tax::where('store_id', $currentStoreId)->findOrFail($id);
        
        return Inertia::render('tax/edit', [
            'tax' => $tax
        ]);
    }

    /**
     * Update the specified tax rule in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $tax = Tax::where('store_id', $currentStoreId)->findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:percentage,fixed',
            'region' => 'nullable|string|max:255',
            'priority' => 'nullable|integer|min:1',
            'compound' => 'nullable|boolean',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $tax->name = $request->name;
        $tax->rate = $request->rate;
        $tax->type = $request->type;
        $tax->region = $request->region;
        $tax->priority = $request->priority ?? $tax->priority;
        $tax->compound = $request->has('compound') ? $request->compound : $tax->compound;
        $tax->is_active = $request->has('is_active') ? $request->is_active : $tax->is_active;
        $tax->save();

        return redirect()->route('tax.index')->with('success', __('Tax rule updated successfully'));
    }

    /**
     * Remove the specified tax rule from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $tax = Tax::where('store_id', $currentStoreId)->findOrFail($id);
        $tax->delete();

        return redirect()->route('tax.index')->with('success', __('Tax rule deleted successfully'));
    }
    
    /**
     * Export tax rules data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $taxes = Tax::where('store_id', $currentStoreId)->get();
        
        $csvData = [];
        $csvData[] = ['Tax Name', 'Rate', 'Type', 'Region', 'Priority', 'Compound', 'Status', 'Created Date'];
        
        foreach ($taxes as $tax) {
            $csvData[] = [
                $tax->name,
                $tax->rate . ($tax->type === 'percentage' ? '%' : ''),
                ucfirst($tax->type),
                $tax->region ?: 'All regions',
                $tax->priority,
                $tax->compound ? 'Yes' : 'No',
                $tax->is_active ? 'Active' : 'Inactive',
                $tax->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'tax-rules-export-' . now()->format('Y-m-d') . '.csv';
        
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
