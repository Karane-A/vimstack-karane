<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreContentController extends BaseController
{
    public function index()
    {
        $user = auth()->user();
        
        // If user is company type, show their own stores
        if ($user->type === 'company') {
            $stores = Store::where('user_id', $user->id)->get();
        }
        // If user has store content permissions, show creator's stores
        elseif ($user->can('view-store-content') && $user->created_by) {
            $stores = Store::where('user_id', $user->created_by)->get();
        }
        // Otherwise, show user's own stores (if any)
        else {
            $stores = Store::where('user_id', $user->id)->get();
        }
        
        return Inertia::render('stores/content/index', [
            'stores' => $stores
        ]);
    }

    public function show(Request $request, $storeId)
    {
        $user = auth()->user();
        
        // Build query based on user type and permissions
        $query = Store::where('id', $storeId);
        
        if ($user->type === 'company') {
            $query->where('user_id', $user->id);
        } elseif ($user->can('view-store-content') && $user->created_by) {
            $query->where('user_id', $user->created_by);
        } else {
            $query->where('user_id', $user->id);
        }
        
        $store = $query->firstOrFail();
            
        $theme = $request->get('theme', $store->theme ?? 'default');
        $settings = StoreSetting::getSettings($storeId, $theme);
        
        return Inertia::render('stores/content/edit', [
            'store' => $store,
            'settings' => $settings,
            'theme' => $theme
        ]);
    }

    public function update(Request $request, $storeId)
    {
        $user = auth()->user();
        
        // Build query based on user type and permissions
        $query = Store::where('id', $storeId);
        
        if ($user->type === 'company') {
            $query->where('user_id', $user->id);
        } elseif ($user->can('edit-store-content') && $user->created_by) {
            $query->where('user_id', $user->created_by);
        } else {
            $query->where('user_id', $user->id);
        }
        
        $store = $query->firstOrFail();

        $validated = $request->validate([
            'content' => 'required|array',
            'theme' => 'string|nullable'
        ]);

        $theme = $validated['theme'] ?? $request->get('theme', $store->theme ?? 'default');
        StoreSetting::updateSettings($storeId, $theme, $validated['content']);

        return redirect()->back()->with('success', 'Store content updated successfully!');
    }
}