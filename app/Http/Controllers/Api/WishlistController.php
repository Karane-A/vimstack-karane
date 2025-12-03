<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WishlistItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $request->store_id;
        $query = WishlistItem::where('store_id', $storeId)
            ->with(['product.category']);
            
        if (Auth::guard('customer')->check()) {
            $query->where('customer_id', Auth::guard('customer')->id());
        } else {
            $query->where('session_id', session()->getId())
                  ->whereNull('customer_id');
        }
        
        $wishlistItems = $query->get();
        
        $formattedItems = $wishlistItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'price' => $item->product->price,
                'sale_price' => $item->product->sale_price,
                'cover_image' => $item->product->cover_image,
                'stock' => $item->product->stock,
                'is_active' => $item->product->is_active,
                'variants' => is_string($item->product->variants) ? json_decode($item->product->variants, true) : ($item->product->variants ?? []),
                'category' => [
                    'id' => $item->product->category_id,
                    'name' => $item->product->category->name ?? 'Uncategorized'
                ]
            ];
        });
        
        return response()->json([
            'items' => $formattedItems,
            'count' => $wishlistItems->count()
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'product_id' => 'required|exists:products,id'
        ]);

        $whereConditions = [
            'store_id' => $request->store_id,
            'product_id' => $request->product_id
        ];
        
        if (Auth::guard('customer')->check()) {
            $whereConditions['customer_id'] = Auth::guard('customer')->id();
        } else {
            $whereConditions['session_id'] = session()->getId();
            $whereConditions['customer_id'] = null;
        }
        
        $existingItem = WishlistItem::where($whereConditions)->first();
        
        if ($existingItem) {
            return response()->json(['message' => 'Item already in wishlist'], 409);
        }
        
        $wishlistItem = WishlistItem::create([
            'store_id' => $request->store_id,
            'customer_id' => Auth::guard('customer')->check() ? Auth::guard('customer')->id() : null,
            'session_id' => session()->getId(),
            'product_id' => $request->product_id
        ]);
        
        return response()->json(['message' => 'Added to wishlist', 'item' => $wishlistItem]);
    }

    public function remove($id, Request $request)
    {
        $query = WishlistItem::where('store_id', $request->store_id);
        
        if (Auth::guard('customer')->check()) {
            $query->where('customer_id', Auth::guard('customer')->id());
        } else {
            $query->where('session_id', session()->getId())
                  ->whereNull('customer_id');
        }
        
        $wishlistItem = $query->findOrFail($id);
        $wishlistItem->delete();
        
        return response()->json(['message' => 'Item removed from wishlist']);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'product_id' => 'required|exists:products,id'
        ]);

        $whereConditions = [
            'store_id' => $request->store_id,
            'product_id' => $request->product_id
        ];
        
        if (Auth::guard('customer')->check()) {
            $whereConditions['customer_id'] = Auth::guard('customer')->id();
        } else {
            $whereConditions['session_id'] = session()->getId();
            $whereConditions['customer_id'] = null;
        }
        
        return \DB::transaction(function () use ($whereConditions) {
            $existingItem = WishlistItem::where($whereConditions)->first();
            
            if ($existingItem) {
                $existingItem->delete();
                return response()->json(['message' => 'Removed from wishlist', 'action' => 'removed']);
            } else {
                WishlistItem::create($whereConditions);
                return response()->json(['message' => 'Added to wishlist', 'action' => 'added']);
            }
        });
    }
}