<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends BaseController
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get products for the current store with category relationship
        $products = Product::with('category')
                        ->where('store_id', $currentStoreId)
                        ->latest()
                        ->get();
        
        // Get statistics
        $totalProducts = $products->count();
        $activeProducts = $products->where('is_active', true)->count();
        // Get low stock threshold from settings (default: 20)
        $lowStockThreshold = \App\Models\Setting::getSetting('low_stock_threshold', $user->id, $currentStoreId, 20);
        $lowStockProducts = $products->where('stock', '<=', $lowStockThreshold)->count();
        $totalValue = $products->sum(function ($product) {
            return $product->price * $product->stock;
        });
        
        return Inertia::render('products/index', [
            'products' => $products,
            'stats' => [
                'total' => $totalProducts,
                'active' => $activeProducts,
                'lowStock' => $lowStockProducts,
                'totalValue' => $totalValue
            ]
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get categories for the current store
        $categories = Category::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        // Get taxes for the current store
        $taxes = \App\Models\Tax::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        return Inertia::render('products/create', [
            'categories' => $categories,
            'taxes' => $taxes
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Check if user can add more products to this store
        $productCheck = $user->canAddProductToStore($currentStoreId);
        if (!$productCheck['allowed']) {
            return redirect()->back()->with('error', $productCheck['message']);
        }
        
        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'details' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'cover_image' => 'nullable|string',
            'images' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'is_active' => 'nullable|boolean',
            'is_downloadable' => 'nullable|boolean',
            'downloadable_file' => 'nullable|string',
            'variants' => 'nullable|array',
            'custom_fields' => 'nullable|array',
        ]);
        
        $product = new Product();
        $product->name = $request->name;
        $product->sku = $request->sku;
        $product->description = $request->description;
        $product->specifications = $request->specifications;
        $product->details = $request->details;
        $product->price = $request->price;
        $product->sale_price = $request->sale_price;
        $product->stock = $request->stock;
        $product->cover_image = $request->cover_image;
        $product->images = $request->images;
        $product->category_id = $request->category_id;
        $product->tax_id = $request->tax_id;
        $product->store_id = $currentStoreId;
        $product->is_active = $request->has('is_active') ? $request->is_active : true;
        $product->is_downloadable = $request->has('is_downloadable') ? $request->is_downloadable : false;
        $product->downloadable_file = $request->downloadable_file;
        $product->variants = $request->variants;
        $product->custom_fields = $request->custom_fields;
        $product->save();
        
        return redirect()->route('products.index')->with('success', __('Product created successfully'));
    }

    /**
     * Display the specified product.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $product = Product::with(['category', 'tax'])
                        ->where('store_id', $currentStoreId)
                        ->findOrFail($id);
        
        // Calculate dynamic stats for the product
        $orderItems = \App\Models\OrderItem::where('product_id', $product->id)->get();
        
        $stats = [
            'revenue' => $orderItems->sum('total_price'),
            'views' => 0, // Views tracking would need to be implemented separately
            'total_sold' => $orderItems->sum('quantity'),
            'total_orders' => $orderItems->count(),
        ];
        
        // Format revenue for display
        $stats['formatted_revenue'] = formatStoreCurrency($stats['revenue'], $user->id, $currentStoreId);
        
        return Inertia::render('products/show', [
            'product' => $product,
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $product = Product::where('store_id', $currentStoreId)->findOrFail($id);
        
        // Get categories for the current store
        $categories = Category::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        // Get taxes for the current store
        $taxes = \App\Models\Tax::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get();
        
        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
            'taxes' => $taxes
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $product = Product::where('store_id', $currentStoreId)->findOrFail($id);
        
        // Validation
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'details' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'cover_image' => 'nullable|string',
            'images' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'is_active' => 'nullable|boolean',
            'is_downloadable' => 'nullable|boolean',
            'downloadable_file' => 'nullable|string',
            'variants' => 'nullable|array',
            'custom_fields' => 'nullable|array',
        ]);
        
        $product->name = $request->name;
        $product->sku = $request->sku;
        $product->description = $request->description ?? $product->description;
        $product->specifications = $request->specifications ?? $product->specifications;
        $product->details = $request->details ?? $product->details;
        $product->price = $request->price;
        $product->sale_price = $request->sale_price;
        $product->stock = $request->stock;
        $product->cover_image = $request->cover_image;
        $product->images = $request->images;
        $product->category_id = $request->category_id;
        $product->tax_id = $request->tax_id;
        $product->is_active = $request->has('is_active') ? $request->is_active : $product->is_active;
        $product->is_downloadable = $request->has('is_downloadable') ? $request->is_downloadable : $product->is_downloadable;
        $product->downloadable_file = $request->downloadable_file;
        $product->variants = $request->variants;
        $product->custom_fields = $request->custom_fields;
        $product->save();
        
        return redirect()->route('products.index')->with('success', __('Product updated successfully'));
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $product = Product::where('store_id', $currentStoreId)->findOrFail($id);
        $product->delete();
        
        return redirect()->route('products.index')->with('success', __('Product deleted successfully'));
    }
    
    /**
     * Export products data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $products = Product::with('category')
                        ->where('store_id', $currentStoreId)
                        ->get();
        
        $csvData = [];
        $csvData[] = ['Product Name', 'SKU', 'Category', 'Price', 'Sale Price', 'Stock', 'Variants', 'Status', 'Created Date'];
        
        foreach ($products as $product) {
            $variantDetails = 'No variants';
            if ($product->variants && is_array($product->variants) && count($product->variants) > 0) {
                $variantList = [];
                foreach ($product->variants as $variant) {
                    if (is_array($variant) && isset($variant['name'])) {
                        $variantList[] = $variant['name'] . (isset($variant['price']) ? ' (' . formatStoreCurrency($variant['price'], $user->id, $currentStoreId) . ')' : '');
                    }
                }
                $variantDetails = implode('; ', $variantList);
            }
            
            $csvData[] = [
                $product->name,
                $product->sku ?: 'Not set',
                $product->category ? $product->category->name : 'Uncategorized',
                formatStoreCurrency($product->price, $user->id, $currentStoreId),
                $product->sale_price ? formatStoreCurrency($product->sale_price, $user->id, $currentStoreId) : 'Not set',
                $product->stock,
                $variantDetails,
                $product->is_active ? 'Active' : 'Inactive',
                $product->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'products-export-' . now()->format('Y-m-d') . '.csv';
        
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
