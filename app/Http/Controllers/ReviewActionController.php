<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewActionController extends BaseController
{
    public function approve($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $review = ProductReview::where('store_id', $currentStoreId)
            ->where('id', $id)
            ->firstOrFail();

        $review->update(['is_approved' => true]);

        return back()->with('success', 'Review approved successfully.');
    }

    public function reject($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $review = ProductReview::where('store_id', $currentStoreId)
            ->where('id', $id)
            ->firstOrFail();

        $review->update(['is_approved' => false]);

        return back()->with('success', 'Review rejected successfully.');
    }

    public function addResponse(Request $request, $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $request->validate([
            'store_response' => 'required|string|max:1000',
        ]);

        $review = ProductReview::where('store_id', $currentStoreId)
            ->where('id', $id)
            ->firstOrFail();

        $review->update(['store_response' => $request->store_response]);

        return back()->with('success', 'Response added successfully.');
    }
}