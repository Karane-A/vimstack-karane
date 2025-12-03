<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class StoreSwitcherController extends Controller
{
    /**
     * Switch the current store for the authenticated user.
     */
    public function switchStore(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id'
        ]);

        // Convert to integer for proper comparison
        $storeId = (int)$request->store_id;
        
        // Get the authenticated user
        $user = Auth::user();
        
        // Prevent superadmin from switching stores
        if ($user->isSuperAdmin()) {
            return redirect()->back()->with('error', __('Superadmin users cannot switch stores'));
        }
        
        // Check if user has permission to switch stores (company users always have this ability)
        if ($user->type !== 'company' && !$user->can('switch-stores')) {
            return redirect()->back()->with('error', __('You do not have permission to switch stores'));
        }
        
        // Check if the user has access to this store
        if ($user->isAdmin()) {
            // Admin can access any store
            $store = Store::findOrFail($storeId);
        } elseif ($user->type === 'company') {
            // Company users can only access their own stores
            $store = Store::where('id', $storeId)
                ->where('user_id', $user->id)
                ->firstOrFail();
        } elseif ($user->type === 'user' && $user->created_by) {
            // Regular users can access their creator's stores
            $store = Store::where('id', $storeId)
                ->where('user_id', $user->created_by)
                ->firstOrFail();
        } else {
            // Fallback: user can only access their own stores
            $store = Store::where('id', $storeId)
                ->where('user_id', $user->id)
                ->firstOrFail();
        }

        // Clear any existing flash messages to prevent duplicates
        session()->forget('success');
        
        // Check if demo mode is enabled
        if (config('app.is_demo', false)) {
            // In demo mode, store the current store in a cookie instead of database
            $cookie = Cookie::make('demo_store_id', $store->id, 60 * 24 * 30); // 30 days
            return redirect()->back()->with('success', __('Store switched successfully'))->cookie($cookie);
        } else {
            // In production mode, update the database
            $user->current_store = $store->id;
            $user->save();
            return redirect()->back()->with('success', __('Store switched successfully'));
        }
    }
}