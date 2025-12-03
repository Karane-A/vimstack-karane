<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreConfiguration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StoreSettingsController extends Controller
{
    public function show($storeId)
    {
        $user = Auth::user();
        
        // Build query based on user type and permissions
        $query = Store::where('id', $storeId);
        
        if ($user->type === 'company') {
            $query->where('user_id', $user->id);
        } elseif ($user->can('view-stores') && $user->created_by) {
            $query->where('user_id', $user->created_by);
        } else {
            $query->where('user_id', $user->id);
        }
        
        $store = $query->firstOrFail();
        $configuration = StoreConfiguration::getConfiguration($storeId);
        
        return Inertia::render('stores/settings', [
            'store' => $store,
            'settings' => $configuration
        ]);
    }

    public function update(Request $request, $storeId)
    {
        $user = Auth::user();
        
        // Build query based on user type and permissions
        $query = Store::where('id', $storeId);
        
        if ($user->type === 'company') {
            $query->where('user_id', $user->id);
        } elseif ($user->can('edit-stores') && $user->created_by) {
            $query->where('user_id', $user->created_by);
        } else {
            $query->where('user_id', $user->id);
        }
        
        $store = $query->firstOrFail();
        
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        StoreConfiguration::updateConfiguration($storeId, $validated['settings']);

        return redirect()->back()->with('success', 'Store configuration updated successfully.');
    }
}