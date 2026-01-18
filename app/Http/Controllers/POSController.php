<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\POSSettings;
use App\Models\POSTransaction;
use App\Models\POSTransactionItem;
use App\Models\POSPayment;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class POSController extends BaseController
{
    /**
     * Display the POS interface.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // If no current store is set, get the first store for this user
        if (!$currentStoreId) {
            if ($user->type === 'company') {
                $store = \App\Models\Store::where('user_id', $user->id)->first();
            } elseif ($user->created_by) {
                $store = \App\Models\Store::where('user_id', $user->created_by)->first();
            } else {
                $store = \App\Models\Store::where('user_id', $user->id)->first();
            }
            
            if (!$store) {
                return redirect()->route('stores.create')->with('error', 'You need to create a store first.');
            }
            $currentStoreId = $store->id;
            // Update user's current store
            $user->current_store = $currentStoreId;
            $user->save();
        }
        
        // Get products for the current store
        $products = Product::where('store_id', $currentStoreId)
            ->where('is_active', true)
            ->get()
            ->map(function ($product) {
                // Add hasVariants flag based on variants field
                $variants = [];
                if (!empty($product->variants)) {
                    $variants = is_string($product->variants) ? json_decode($product->variants, true) : $product->variants;
                }
                $variants = $variants ?? [];
                $hasVariants = !empty($variants);
                
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'category' => $product->category ? $product->category->name : 'uncategorized',
                    'image' => $product->cover_image,
                    'hasVariants' => $hasVariants,
                    'variants' => $variants,
                    'stock' => $product->stock, // Include stock information
                ];
            });
        
        // Get customers for the current store
        $customers = Customer::where('store_id', $currentStoreId)
            ->select('id', 'first_name', 'last_name', 'email', 'phone')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->first_name . ' ' . $customer->last_name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                ];
            });
        
        // Add walk-in customer
        $customers->prepend([
            'id' => 'walk-in',
            'name' => 'Walk-in Customer',
            'email' => '',
            'phone' => '',
        ]);
        
        // Get categories
        $categories = [
            ['id' => 'all', 'name' => 'All Products'],
        ];
        
        // Add product categories
        $productCategories = Product::where('store_id', $currentStoreId)
            ->whereNotNull('category_id')
            ->with('category')
            ->get()
            ->pluck('category')
            ->unique('id')
            ->map(function ($category) {
                return [
                    'id' => $category->name,
                    'name' => $category->name,
                ];
            });
        
        $categories = array_merge($categories, $productCategories->toArray());
        
        // Get POS settings
        $posSettings = POSSettings::getSettings($currentStoreId);
        
        // Get store currency settings
        $storeSettings = settings($user->id, $currentStoreId);
        $currencyCode = $storeSettings['defaultCurrency'] ?? 'USD';
        $currency = Currency::where('code', $currencyCode)->first();
        
        // Merge POS settings with currency settings
        $settings = array_merge($posSettings->toArray(), [
            'currencySymbol' => $currency ? $currency->symbol : '$',
            'decimalFormat' => $storeSettings['decimalFormat'] ?? '2',
            'decimalSeparator' => $storeSettings['decimalSeparator'] ?? '.',
            'thousandsSeparator' => $storeSettings['thousandsSeparator'] ?? ',',
            'currencySymbolSpace' => $storeSettings['currencySymbolSpace'] ?? false,
            'currencySymbolPosition' => $storeSettings['currencySymbolPosition'] ?? 'before',
        ]);
        
        return Inertia::render('pos/index', [
            'products' => $products,
            'customers' => $customers,
            'categories' => $categories,
            'settings' => $settings,
        ]);
    }
    
    /**
     * Display the checkout page.
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get POS settings
        $posSettings = POSSettings::getSettings($currentStoreId);
        
        // Get store currency settings
        $storeSettings = settings($user->id, $currentStoreId);
        $currencyCode = $storeSettings['defaultCurrency'] ?? 'USD';
        $currency = Currency::where('code', $currencyCode)->first();
        
        // Merge POS settings with currency settings
        $settings = array_merge($posSettings->toArray(), [
            'currencySymbol' => $currency ? $currency->symbol : '$',
            'decimalFormat' => $storeSettings['decimalFormat'] ?? '2',
            'decimalSeparator' => $storeSettings['decimalSeparator'] ?? '.',
            'thousandsSeparator' => $storeSettings['thousandsSeparator'] ?? ',',
            'currencySymbolSpace' => $storeSettings['currencySymbolSpace'] ?? false,
            'currencySymbolPosition' => $storeSettings['currencySymbolPosition'] ?? 'before',
        ]);
        
        return Inertia::render('pos/checkout', [
            'settings' => $settings,
        ]);
    }
    
    /**
     * Process a POS transaction.
     */
    public function processTransaction(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required',
            'items.*.productId' => 'required',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_id' => 'nullable',
            'subtotal' => 'required|numeric',
            'tax' => 'required|numeric',
            'total' => 'required|numeric',
            'amount_received' => 'nullable|numeric',
        ]);
        
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Check inventory before processing
        $inventoryCheck = $this->checkInventory($request->items, $currentStoreId);
        if (!$inventoryCheck['success']) {
            return response()->json([
                'success' => false,
                'message' => $inventoryCheck['message'],
                'outOfStockItems' => $inventoryCheck['outOfStockItems']
            ], 422);
        }
        
        // Create transaction
        $transaction = POSTransaction::create([
            'store_id' => $currentStoreId,
            'transaction_number' => POSTransaction::generateTransactionNumber($currentStoreId),
            'customer_id' => $request->customer_id !== 'walk-in' ? $request->customer_id : null,
            'cashier_id' => $user->id,
            'subtotal' => $request->subtotal,
            'tax' => $request->tax,
            'discount' => $request->discount ?? 0,
            'total' => $request->total,
            'status' => 'completed',
            'notes' => $request->notes,
        ]);
        
        // Create transaction items and update inventory
        foreach ($request->items as $item) {
            POSTransactionItem::create([
                'transaction_id' => $transaction->id,
                'product_id' => $item['productId'],
                'product_name' => $item['name'],
                'variant_name' => $item['variant']['name'] ?? null,
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'tax' => ($item['price'] * $item['quantity']) * 0.1, // 10% tax
                'total' => $item['price'] * $item['quantity'],
            ]);
            
            // Update product inventory
            $product = Product::find($item['productId']);
            if ($product) {
                $product->stock = max(0, $product->stock - $item['quantity']);
                $product->save();
            }
        }
        
        // Create payment record
        $payment = POSPayment::create([
            'transaction_id' => $transaction->id,
            'payment_method' => 'pos',
            'amount' => $request->total,
            'change_amount' => 0,
            'reference_number' => $request->reference_number ?? 'POS-' . time(),
            'status' => 'completed',
        ]);
        
        return response()->json([
            'success' => true,
            'transaction' => $transaction,
            'transaction_id' => $transaction->id,
        ]);
    }
    
    /**
     * Display the receipt page.
     */
    public function receipt($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $transaction = POSTransaction::with(['items', 'payments', 'customer', 'cashier'])
            ->where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        // Get POS settings
        $posSettings = POSSettings::getSettings($currentStoreId);
        
        // Get store currency settings
        $storeSettings = settings($user->id, $currentStoreId);
        $currencyCode = $storeSettings['defaultCurrency'] ?? 'USD';
        $currency = Currency::where('code', $currencyCode)->first();
        
        // Merge POS settings with currency settings
        $settings = array_merge($posSettings->toArray(), [
            'currencySymbol' => $currency ? $currency->symbol : '$',
            'decimalFormat' => $storeSettings['decimalFormat'] ?? '2',
            'decimalSeparator' => $storeSettings['decimalSeparator'] ?? '.',
            'thousandsSeparator' => $storeSettings['thousandsSeparator'] ?? ',',
            'currencySymbolSpace' => $storeSettings['currencySymbolSpace'] ?? false,
            'currencySymbolPosition' => $storeSettings['currencySymbolPosition'] ?? 'before',
        ]);
        
        return Inertia::render('pos/receipt', [
            'transaction' => $transaction,
            'settings' => $settings,
        ]);
    }
    
    /**
     * Display the transactions page.
     */
    public function transactions()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $transactions = POSTransaction::with(['customer', 'cashier', 'payments', 'items'])
            ->where('store_id', $currentStoreId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'transaction_number' => $transaction->transaction_number,
                    'date' => $transaction->created_at->format('Y-m-d'),
                    'time' => $transaction->created_at->format('h:i A'),
                    'customer' => $transaction->customer ? 
                        $transaction->customer->first_name . ' ' . $transaction->customer->last_name : 
                        'Walk-in Customer',
                    'items' => $transaction->items->sum('quantity'),
                    'total' => (float) $transaction->total,
                    'status' => ucfirst($transaction->status),
                ];
            });
        
        // Calculate statistics
        $today = now()->startOfDay();
        $weekStart = now()->startOfWeek();
        
        $todayTransactions = POSTransaction::where('store_id', $currentStoreId)
            ->where('created_at', '>=', $today)
            ->get();
            
        $weekTransactions = POSTransaction::where('store_id', $currentStoreId)
            ->where('created_at', '>=', $weekStart)
            ->get();
            
        $refundedTransactions = POSTransaction::where('store_id', $currentStoreId)
            ->whereIn('status', ['refunded', 'partial_refund'])
            ->get();
            
        $stats = [
            'todaySales' => $todayTransactions->sum('total'),
            'todayCount' => $todayTransactions->count(),
            'weekSales' => $weekTransactions->sum('total'),
            'weekCount' => $weekTransactions->count(),
            'averageSale' => $transactions->count() > 0 ? $transactions->sum('total') / $transactions->count() : 0,
            'refundAmount' => $refundedTransactions->sum('total'),
            'refundCount' => $refundedTransactions->count(),
        ];
        
        // Format currency values for display
        $stats['formatted_todaySales'] = formatStoreCurrency($stats['todaySales'], $user->id, $currentStoreId);
        $stats['formatted_weekSales'] = formatStoreCurrency($stats['weekSales'], $user->id, $currentStoreId);
        $stats['formatted_averageSale'] = formatStoreCurrency($stats['averageSale'], $user->id, $currentStoreId);
        $stats['formatted_refundAmount'] = formatStoreCurrency($stats['refundAmount'], $user->id, $currentStoreId);
        
        return Inertia::render('pos/transactions', [
            'transactions' => $transactions,
            'stats' => $stats,
        ]);
    }
    
    /**
     * Display the settings page.
     */
    public function settings()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        if (!$currentStoreId) {
            if ($user->type === 'company') {
                $store = \App\Models\Store::where('user_id', $user->id)->first();
            } elseif ($user->created_by) {
                $store = \App\Models\Store::where('user_id', $user->created_by)->first();
            } else {
                $store = \App\Models\Store::where('user_id', $user->id)->first();
            }
            
            if (!$store) {
                return redirect()->route('stores.create')->with('error', 'You need to create a store first.');
            }
            $currentStoreId = $store->id;
            $user->current_store = $currentStoreId;
            $user->save();
        }
        
        // Get POS settings
        $posSettings = POSSettings::getSettings($currentStoreId);
        
        // Get store currency settings
        $storeSettings = settings($user->id, $currentStoreId);
        $currencyCode = $storeSettings['defaultCurrency'] ?? 'USD';
        $currency = Currency::where('code', $currencyCode)->first();
        
        // Merge POS settings with currency settings
        $settings = array_merge($posSettings->toArray(), [
            'currencySymbol' => $currency ? $currency->symbol : '$',
            'decimalFormat' => $storeSettings['decimalFormat'] ?? '2',
            'decimalSeparator' => $storeSettings['decimalSeparator'] ?? '.',
            'thousandsSeparator' => $storeSettings['thousandsSeparator'] ?? ',',
            'currencySymbolSpace' => $storeSettings['currencySymbolSpace'] ?? false,
            'currencySymbolPosition' => $storeSettings['currencySymbolPosition'] ?? 'before',
        ]);
        
        // Get all available currencies
        $currencies = Currency::select('code', 'name', 'symbol')
            ->orderBy('name')
            ->get()
            ->map(function ($currency) {
                return [
                    'value' => $currency->code,
                    'label' => $currency->name . ' (' . $currency->symbol . ')',
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                ];
            });
        
        return Inertia::render('pos/settings', [
            'settings' => $settings,
            'currencies' => $currencies,
        ]);
    }
    
    /**
     * Update the POS settings.
     */
    public function updateSettings(Request $request)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        if (!$currentStoreId) {
            if ($user->type === 'company') {
                $store = \App\Models\Store::where('user_id', $user->id)->first();
            } elseif ($user->created_by) {
                $store = \App\Models\Store::where('user_id', $user->created_by)->first();
            } else {
                $store = \App\Models\Store::where('user_id', $user->id)->first();
            }
            
            if (!$store) {
                return redirect()->back()->with('error', 'No store found.');
            }
            $currentStoreId = $store->id;
            $user->current_store = $currentStoreId;
            $user->save();
        }
        
        $request->validate([
            'tax_rate' => 'required|numeric|min:0|max:100',
            'default_discount' => 'required|numeric|min:0|max:100',
            'enable_guest_checkout' => 'nullable|boolean',
            'low_stock_alerts' => 'nullable|boolean',
            'auto_sync_online_orders' => 'nullable|boolean',
        ]);
        
        $settings = POSSettings::where('store_id', $currentStoreId)->first();
        
        if (!$settings) {
            $settings = new POSSettings();
            $settings->store_id = $currentStoreId;
        }
        
        // Update all settings from request
        $settings->fill($request->all());
        $settings->save();
        
        return redirect()->back()->with('success', 'POS settings updated successfully.');
    }
    
    /**
     * Check if there's enough inventory for the requested items
     */
    private function checkInventory($items, $storeId)
    {
        $outOfStockItems = [];
        
        foreach ($items as $item) {
            $product = Product::where('id', $item['productId'])
                ->where('store_id', $storeId)
                ->first();
                
            if (!$product) {
                $outOfStockItems[] = [
                    'name' => $item['name'],
                    'requested' => $item['quantity'],
                    'available' => 0,
                    'message' => 'Product not found'
                ];
                continue;
            }
            
            if ($product->stock < $item['quantity']) {
                $outOfStockItems[] = [
                    'name' => $product->name,
                    'requested' => $item['quantity'],
                    'available' => $product->stock,
                    'message' => 'Insufficient stock'
                ];
            }
        }
        
        if (count($outOfStockItems) > 0) {
            return [
                'success' => false,
                'message' => 'Some items are out of stock',
                'outOfStockItems' => $outOfStockItems
            ];
        }
        
        return ['success' => true];
    }
}