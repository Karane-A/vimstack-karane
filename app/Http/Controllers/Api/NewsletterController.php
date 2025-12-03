<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscription;
use App\Models\Store;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'store_slug' => 'required|string',
            ]);

            $store = Store::where('slug', $request->store_slug)->first();
            
            if (!$store) {
                // For demo stores, use default store ID
                $storeId = 1;
            } else {
                $storeId = $store->id;
            }

            NewsletterSubscription::updateOrCreate(
                [
                    'store_id' => $storeId,
                    'email' => $request->email,
                ],
                [
                    'is_active' => true,
                    'subscribed_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Successfully subscribed to newsletter!',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a valid email address.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Newsletter subscription error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to subscribe. Please try again.',
            ], 500);
        }
    }
}