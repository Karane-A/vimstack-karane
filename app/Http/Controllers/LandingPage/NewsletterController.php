<?php

namespace App\Http\Controllers\LandingPage;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    public function index(Request $request)
    {
        $query = Newsletter::query();
        
        // Apply sorting
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('email', 'like', "%{$search}%");
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        $newsletters = $query->paginate($perPage)->withQueryString();

        return Inertia::render('landing-page/subscribers/index', [
            'newsletters' => $newsletters,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }

    public function show(Newsletter $newsletter)
    {
        return Inertia::render('landing-page/subscribers/show', [
            'newsletter' => $newsletter
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email'
        ]);

        Newsletter::create([
            'email' => $request->email,
            'status' => 'active',
            'subscribed_at' => now()
        ]);

        return back()->with('success', __('Newsletter subscription added successfully!'));
    }

    public function update(Request $request, Newsletter $newsletter)
    {
        $request->validate([
            'status' => 'required|in:active,unsubscribed'
        ]);

        $updateData = ['status' => $request->status];
        
        if ($request->status === 'unsubscribed' && $newsletter->status === 'active') {
            $updateData['unsubscribed_at'] = now();
        } elseif ($request->status === 'active' && $newsletter->status === 'unsubscribed') {
            $updateData['subscribed_at'] = now();
            $updateData['unsubscribed_at'] = null;
        }

        $newsletter->update($updateData);

        return back()->with('success', __('Newsletter subscription updated successfully!'));
    }

    public function destroy(Newsletter $newsletter)
    {
        $newsletter->delete();

        return back()->with('success', __('Newsletter subscription deleted successfully!'));
    }

    public function export(Request $request)
    {
        $query = Newsletter::orderBy('created_at', 'desc');

        // Apply same filters as index
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('email', 'like', "%{$search}%");
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $filename = 'newsletter_subscribers_' . date('Y-m-d_H-i-s') . '.csv';
        
        return response()->streamDownload(function () use ($query) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Email', 'Status', 'Subscribed At', 'Unsubscribed At', 'Created At']);
            
            $query->chunk(1000, function ($newsletters) use ($file) {
                foreach ($newsletters as $newsletter) {
                    fputcsv($file, [
                        $newsletter->email,
                        $newsletter->status,
                        $newsletter->subscribed_at ? $newsletter->subscribed_at->format('Y-m-d H:i:s') : '',
                        $newsletter->unsubscribed_at ? $newsletter->unsubscribed_at->format('Y-m-d H:i:s') : '',
                        $newsletter->created_at->format('Y-m-d H:i:s')
                    ]);
                }
            });
            
            fclose($file);
        }, $filename, ['Content-Type' => 'text/csv']);
    }


}