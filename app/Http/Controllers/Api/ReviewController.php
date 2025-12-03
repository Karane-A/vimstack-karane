<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $productId = $request->get('product_id');
        
        $reviews = ProductReview::where('product_id', $productId)
            ->where('is_approved', true)
            ->with('customer:id,first_name,last_name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'content' => $review->content,
                    'customer_name' => $review->customer->first_name . ' ' . substr($review->customer->last_name, 0, 1) . '.',
                    'created_at' => $review->created_at->diffForHumans(),
                ];
            });

        return response()->json([
            'success' => true,
            'reviews' => $reviews,
            'average_rating' => $reviews->avg('rating'),
            'total_reviews' => $reviews->count(),
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::guard('customer')->check()) {
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in to write a review.'
            ], 401);
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:1000',
        ]);

        $product = Product::findOrFail($request->product_id);
        $customerId = Auth::guard('customer')->id();

        // Check if customer already reviewed this product
        $existingReview = ProductReview::where('product_id', $request->product_id)
            ->where('customer_id', $customerId)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product.'
            ], 422);
        }

        $review = ProductReview::create([
            'product_id' => $request->product_id,
            'customer_id' => $customerId,
            'store_id' => $product->store_id,
            'rating' => $request->rating,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully!',
            'review' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'title' => $review->title,
                'content' => $review->content,
                'customer_name' => Auth::guard('customer')->user()->first_name . ' ' . substr(Auth::guard('customer')->user()->last_name, 0, 1) . '.',
                'created_at' => $review->created_at->diffForHumans(),
            ]
        ]);
    }
}