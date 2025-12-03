<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends BaseController
{
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $reviews = ProductReview::where('store_id', $currentStoreId)
            ->with(['customer:id,first_name,last_name,email', 'product:id,name,cover_image'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'customer_name' => $review->customer->first_name . ' ' . $review->customer->last_name,
                    'customer_email' => $review->customer->email,
                    'product_name' => $review->product->name,
                    'product_image' => $review->product->cover_image,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'content' => $review->content,
                    'status' => $review->is_approved ? 'Approved' : 'Pending',
                    'created_at' => $review->created_at->format('Y-m-d'),
                    'store_response' => $review->store_response,
                ];
            });

        $stats = [
            'total_reviews' => $reviews->count(),
            'average_rating' => $reviews->avg('rating') ?: 0,
            'pending_reviews' => $reviews->where('status', 'Pending')->count(),
            'response_rate' => $reviews->count() > 0 ? round(($reviews->whereNotNull('store_response')->count() / $reviews->count()) * 100) : 0,
        ];

        return Inertia::render('reviews/index', [
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $review = ProductReview::where('store_id', $currentStoreId)
            ->where('id', $id)
            ->with(['customer:id,first_name,last_name,email', 'product:id,name,cover_image,sku,price'])
            ->firstOrFail();

        // Format product price for display
        $formattedPrice = formatStoreCurrency($review->product->price, $user->id, $currentStoreId);
        
        return Inertia::render('reviews/show', [
            'review' => [
                'id' => $review->id,
                'customer_name' => $review->customer->first_name . ' ' . $review->customer->last_name,
                'customer_email' => $review->customer->email,
                'product_name' => $review->product->name,
                'product_image' => $review->product->cover_image,
                'product_sku' => $review->product->sku,
                'product_price' => $review->product->price,
                'formatted_price' => $formattedPrice,
                'rating' => $review->rating,
                'title' => $review->title,
                'content' => $review->content,
                'status' => $review->is_approved ? 'Approved' : 'Pending',
                'created_at' => $review->created_at->format('F j, Y'),
                'store_response' => $review->store_response,
            ]
        ]);
    }

    public function edit($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $review = ProductReview::where('store_id', $currentStoreId)
            ->where('id', $id)
            ->with(['customer:id,first_name,last_name,email', 'product:id,name'])
            ->firstOrFail();

        return Inertia::render('reviews/edit', [
            'review' => [
                'id' => $review->id,
                'customer_name' => $review->customer->first_name . ' ' . $review->customer->last_name,
                'customer_email' => $review->customer->email,
                'product_name' => $review->product->name,
                'rating' => $review->rating,
                'title' => $review->title,
                'content' => $review->content,
                'is_approved' => $review->is_approved,
                'store_response' => $review->store_response,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:1000',
            'is_approved' => 'boolean',
            'store_response' => 'nullable|string|max:1000',
        ]);

        $review = ProductReview::where('store_id', $currentStoreId)
            ->where('id', $id)
            ->firstOrFail();

        $review->update([
            'rating' => $request->rating,
            'title' => $request->title,
            'content' => $request->content,
            'is_approved' => $request->boolean('is_approved'),
            'store_response' => $request->store_response,
        ]);

        return redirect()->route('reviews.index')->with('success', 'Review updated successfully.');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $review = ProductReview::where('store_id', $currentStoreId)
            ->where('id', $id)
            ->firstOrFail();

        $review->delete();

        return redirect()->route('reviews.index')->with('success', 'Review deleted successfully.');
    }
    
    /**
     * Export reviews data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $reviews = ProductReview::where('store_id', $currentStoreId)
            ->with(['customer:id,first_name,last_name,email', 'product:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $csvData = [];
        $csvData[] = ['Customer Name', 'Customer Email', 'Product Name', 'Rating', 'Title', 'Content', 'Status', 'Store Response', 'Review Date'];
        
        foreach ($reviews as $review) {
            $csvData[] = [
                $review->customer->first_name . ' ' . $review->customer->last_name,
                $review->customer->email,
                $review->product->name,
                $review->rating . '/5',
                $review->title,
                $review->content,
                $review->is_approved ? 'Approved' : 'Pending',
                $review->store_response ?: 'No response',
                $review->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'reviews-export-' . now()->format('Y-m-d') . '.csv';
        
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