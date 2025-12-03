<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NewsletterSubscriberController extends BaseController
{
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $subscribers = NewsletterSubscription::where('store_id', $currentStoreId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($subscriber) {
                return [
                    'id' => $subscriber->id,
                    'email' => $subscriber->email,
                    'status' => $subscriber->is_active ? 'Active' : 'Inactive',
                    'subscribed_at' => $subscriber->subscribed_at->format('M j, Y'),
                ];
            });

        $stats = [
            'total_subscribers' => $subscribers->count(),
            'active_subscribers' => $subscribers->where('status', 'Active')->count(),
            'inactive_subscribers' => $subscribers->where('status', 'Inactive')->count(),
        ];

        return Inertia::render('newsletter-subscribers/index', [
            'subscribers' => $subscribers,
            'stats' => $stats,
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $subscriber = NewsletterSubscription::where('store_id', $currentStoreId)
            ->where('id', $id)
            ->firstOrFail();

        $subscriber->delete();

        return redirect()->route('newsletter-subscribers.index')->with('success', 'Subscriber deleted successfully.');
    }
    
    /**
     * Export newsletter subscribers data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $subscribers = NewsletterSubscription::where('store_id', $currentStoreId)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $csvData = [];
        $csvData[] = ['Email', 'Status', 'Subscription Date', 'Source', 'IP Address'];
        
        foreach ($subscribers as $subscriber) {
            $csvData[] = [
                $subscriber->email,
                $subscriber->is_active ? 'Active' : 'Inactive',
                $subscriber->subscribed_at ? $subscriber->subscribed_at->format('Y-m-d H:i:s') : $subscriber->created_at->format('Y-m-d H:i:s'),
                $subscriber->source ?: 'Website',
                $subscriber->ip_address ?: 'Not recorded'
            ];
        }
        
        $filename = 'newsletter-subscribers-export-' . now()->format('Y-m-d') . '.csv';
        
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