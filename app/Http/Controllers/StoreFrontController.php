<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\Product;
use App\Models\Category;
use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreFrontController extends Controller
{
    /**
     * Display the store homepage.
     */
    public function index($storeId = null)
    {
        // If no store ID is provided, use the first active store
        if (!$storeId) {
            $store = Store::where('is_active', true)->first();
            if (!$store) {
                return redirect()->route('home')->with('error', 'No active stores found.');
            }
            $storeId = $store->id;
        } else {
            $store = Store::findOrFail($storeId);
            if (!$store->is_active) {
                return redirect()->route('home')->with('error', 'This store is not active.');
            }
        }
        
        // Get featured products
        $featuredProducts = Product::where('store_id', $storeId)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'sale_price' => (float) $product->sale_price,
                    'image' => $product->cover_image,
                    'slug' => $product->slug ?? $product->id,
                ];
            });
            
        // Get categories
        $categories = Category::where('store_id', $storeId)
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->take(4)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image,
                ];
            });
        
        // Get store content
        $storeContent = StoreSetting::getSettings($storeId, $store->theme ?? 'default');
        
        return Inertia::render('store/index', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'logo' => $store->logo,
                'description' => $store->description,
            ],
            'storeContent' => $storeContent,
            'theme' => $store->theme ?? 'default',
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'cartCount' => 0, // This would come from the session
            'wishlistCount' => 0, // This would come from the session
            'isLoggedIn' => auth()->check(),
            'userName' => auth()->check() ? auth()->user()->name : '',
        ]);
    }
}