<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Category;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([
                'products' => [],
                'orders' => [],
                'customers' => [],
                'categories' => [],
            ]);
        }

        $user = Auth::user();
        $results = [];

        // Search Products
        $productsQuery = Product::query();
        
        $productsQuery->where(function($q) use ($query) {
            $q->where('name', 'LIKE', "%{$query}%")
              ->orWhere('sku', 'LIKE', "%{$query}%")
              ->orWhere('description', 'LIKE', "%{$query}%");
        });

        // Filter by store for non-superadmin users
        if (!$user->isSuperAdmin()) {
            $productsQuery->where('store_id', $user->current_store);
        }

        $results['products'] = $productsQuery
            ->select('id', 'name', 'sku', 'price', 'cover_image')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => (float)$product->price,
                    'image' => $product->cover_image,
                    'url' => route('products.show', $product->id),
                ];
            });

        // Search Orders
        $ordersQuery = Order::query();
        
        $ordersQuery->where(function($q) use ($query) {
            $q->where('order_number', 'LIKE', "%{$query}%")
              ->orWhereHas('customer', function ($cq) use ($query) {
                  $cq->where('first_name', 'LIKE', "%{$query}%")
                    ->orWhere('last_name', 'LIKE', "%{$query}%")
                    ->orWhere('email', 'LIKE', "%{$query}%");
              });
        });

        if (!$user->isSuperAdmin()) {
            $ordersQuery->where('store_id', $user->current_store);
        }

        $results['orders'] = $ordersQuery
            ->with('customer:id,first_name,last_name,email')
            ->select('id', 'order_number', 'total_amount', 'status', 'customer_id', 'created_at')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer ? "{$order->customer->first_name} {$order->customer->last_name}" : 'Guest',
                    'total' => (float)$order->total_amount,
                    'status' => $order->status,
                    'url' => route('orders.show', $order->id),
                ];
            });

        // Search Customers
        $customersQuery = Customer::query();
        
        $customersQuery->where(function($q) use ($query) {
            $q->where('first_name', 'LIKE', "%{$query}%")
              ->orWhere('last_name', 'LIKE', "%{$query}%")
              ->orWhere('email', 'LIKE', "%{$query}%")
              ->orWhere('phone', 'LIKE', "%{$query}%");
        });

        if (!$user->isSuperAdmin()) {
            $customersQuery->where('store_id', $user->current_store);
        }

        $results['customers'] = $customersQuery
            ->select('id', 'first_name', 'last_name', 'email', 'phone', 'avatar')
            ->limit(5)
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => "{$customer->first_name} {$customer->last_name}",
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'avatar' => $customer->avatar,
                    'url' => route('customers.show', $customer->id),
                ];
            });

        // Search Categories
        $categoriesQuery = Category::query();
        
        $categoriesQuery->where('name', 'LIKE', "%{$query}%");

        if (!$user->isSuperAdmin()) {
            $categoriesQuery->where('store_id', $user->current_store);
        }

        $results['categories'] = $categoriesQuery
            ->select('id', 'name', 'slug', 'image')
            ->limit(5)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image,
                    'url' => route('categories.show', $category->id),
                ];
            });

        // Search Stores (superadmin only)
        if ($user->isSuperAdmin()) {
            $results['companies'] = Store::where('name', 'LIKE', "%{$query}%")
                ->orWhere('email', 'LIKE', "%{$query}%")
                ->select('id', 'name', 'email', 'slug')
                ->limit(5)
                ->get()
                ->map(function ($store) {
                    return [
                        'id' => $store->id,
                        'name' => $store->name,
                        'email' => $store->email,
                        'url' => route('stores.show', $store->id),
                    ];
                });
        }

        return response()->json($results);
    }
}
