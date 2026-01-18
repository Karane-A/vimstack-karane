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
     * Download CSV template for bulk import.
     */
    public function downloadTemplate()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get categories for reference
        $categories = Category::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->pluck('name')
                            ->toArray();
        
        $csvData = [];
        // Header row with instructions
        $csvData[] = ['name', 'sku', 'description', 'price', 'sale_price', 'stock', 'category_name', 'is_active', 'cover_image', 'images'];
        // Example row
        $csvData[] = [
            'Sample Product',
            'SKU-001',
            'This is a sample product description',
            '99.99',
            '79.99',
            '100',
            !empty($categories) ? $categories[0] : 'General',
            '1',
            '',
            ''
        ];
        // Instructions row
        $csvData[] = [
            'INSTRUCTIONS: name (required)',
            'sku (optional)',
            'description (optional)',
            'price (required, numeric)',
            'sale_price (optional, numeric)',
            'stock (required, integer)',
            'category_name (optional - must match existing category)',
            'is_active (1=active, 0=inactive)',
            'cover_image (optional - leave empty, add later)',
            'images (optional - comma-separated URLs, leave empty to add later)'
        ];
        
        $filename = 'products-import-template.csv';
        
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
    
    /**
     * Import products from CSV.
     */
    public function import(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240' // Max 10MB
        ]);
        
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $file = $request->file('csv_file');
        $csvData = array_map('str_getcsv', file($file->getRealPath()));
        
        // Remove header row
        $headers = array_shift($csvData);
        
        // Remove instructions row if present
        if (!empty($csvData) && stripos($csvData[0][0], 'INSTRUCTIONS') !== false) {
            array_shift($csvData);
        }
        
        $imported = 0;
        $skipped = 0;
        $errors = [];
        
        // Get all categories for this store
        $categories = Category::where('store_id', $currentStoreId)
                            ->where('is_active', true)
                            ->get()
                            ->keyBy('name');
        
        foreach ($csvData as $index => $row) {
            $rowNumber = $index + 2; // +2 because we removed header and array is 0-indexed
            
            // Skip empty rows
            if (empty(array_filter($row))) {
                continue;
            }
            
            try {
                // Map CSV columns
                $name = $row[0] ?? null;
                $sku = $row[1] ?? null;
                $description = $row[2] ?? null;
                $price = $row[3] ?? null;
                $sale_price = $row[4] ?? null;
                $stock = $row[5] ?? 0;
                $category_name = $row[6] ?? null;
                $is_active = isset($row[7]) ? (bool)$row[7] : true;
                $cover_image = $row[8] ?? null;
                $images = $row[9] ?? null;
                
                // Validate required fields
                if (empty($name)) {
                    $errors[] = "Row $rowNumber: Product name is required";
                    $skipped++;
                    continue;
                }
                
                if (empty($price) || !is_numeric($price)) {
                    $errors[] = "Row $rowNumber: Valid price is required for '$name'";
                    $skipped++;
                    continue;
                }
                
                // Check product limit
                $productCheck = $user->canAddProductToStore($currentStoreId);
                if (!$productCheck['allowed']) {
                    $errors[] = "Product limit reached. Cannot import more products.";
                    break;
                }
                
                // Find category ID
                $category_id = null;
                if (!empty($category_name) && isset($categories[$category_name])) {
                    $category_id = $categories[$category_name]->id;
                }
                
                // Create product
                Product::create([
                    'name' => $name,
                    'sku' => $sku,
                    'description' => $description,
                    'price' => $price,
                    'sale_price' => $sale_price && is_numeric($sale_price) ? $sale_price : null,
                    'stock' => is_numeric($stock) ? (int)$stock : 0,
                    'category_id' => $category_id,
                    'store_id' => $currentStoreId,
                    'is_active' => $is_active,
                    'cover_image' => $cover_image,
                    'images' => $images,
                ]);
                
                $imported++;
                
            } catch (\Exception $e) {
                $errors[] = "Row $rowNumber: " . $e->getMessage();
                $skipped++;
            }
        }
        
        $message = "Import complete! $imported products imported.";
        if ($skipped > 0) {
            $message .= " $skipped products skipped.";
        }
        if (!empty($errors)) {
            $message .= " Errors: " . implode('; ', array_slice($errors, 0, 5));
            if (count($errors) > 5) {
                $message .= " and " . (count($errors) - 5) . " more errors.";
            }
        }
        
        return redirect()->back()->with($imported > 0 ? 'success' : 'error', $message);
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
        // Header row matching import template
        $csvData[] = ['name', 'sku', 'description', 'price', 'sale_price', 'stock', 'category_name', 'is_active', 'cover_image', 'images'];
        
        foreach ($products as $product) {
            $csvData[] = [
                $product->name,
                $product->sku ?: '',
                $product->description ?: '',
                $product->price,
                $product->sale_price ?: '',
                $product->stock,
                $product->category ? $product->category->name : '',
                $product->is_active ? '1' : '0',
                $product->cover_image ?: '',
                $product->images ?: '',
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
