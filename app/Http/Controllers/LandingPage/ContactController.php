<?php

namespace App\Http\Controllers\LandingPage;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $query = Contact::landingPage();
        
        // Apply sorting
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 10);
        $contacts = $query->paginate($perPage)->withQueryString();

        return Inertia::render('landing-page/contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string'
        ]);

        Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_landing_page' => true
        ]);

        return back()->with('success', __('Contact created successfully!'));
    }



    public function destroy(Contact $contact)
    {
        // Ensure this is a landing page contact
        if (!$contact->is_landing_page) {
            abort(404);
        }

        $contact->delete();

        return back()->with('success', __('Contact deleted successfully!'));
    }

    public function export(Request $request)
    {
        $query = Contact::landingPage()->orderBy('created_at', 'desc');

        // Apply same filters as index
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $filename = 'contacts_' . date('Y-m-d_H-i-s') . '.csv';
        
        return response()->streamDownload(function () use ($query) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Name', 'Email', 'Subject', 'Message', 'Created At']);
            
            $query->chunk(1000, function ($contacts) use ($file) {
                foreach ($contacts as $contact) {
                    fputcsv($file, [
                        $contact->name,
                        $contact->email,
                        $contact->subject,
                        $contact->message,
                        $contact->created_at->format('Y-m-d H:i:s')
                    ]);
                }
            });
            
            fclose($file);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}