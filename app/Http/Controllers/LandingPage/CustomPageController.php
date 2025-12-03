<?php

namespace App\Http\Controllers\LandingPage;

use App\Http\Controllers\Controller;
use App\Models\LandingPageCustomPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomPageController extends Controller
{
    public function index(Request $request)
    {
        $query = LandingPageCustomPage::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort_field', 'sort_order');
        $sortDirection = $request->get('sort_direction', 'asc');
        
        if (in_array($sortField, ['title', 'created_at', 'sort_order'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->ordered();
        }

        $pages = $query->paginate($request->get('per_page', 10))
                      ->withQueryString();

        return Inertia::render('landing-page/custom-pages/index', [
            'pages' => $pages,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer'
        ]);

        // Generate unique slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = LandingPageCustomPage::generateUniqueSlug($validated['title']);
        } else {
            // Ensure provided slug is unique
            $validated['slug'] = LandingPageCustomPage::generateUniqueSlug($validated['slug']);
        }

        LandingPageCustomPage::create($validated);

        return back()->with('success', __('Custom page created successfully!'));
    }

    public function update(Request $request, LandingPageCustomPage $customPage)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer'
        ]);

        // Generate unique slug if slug is provided and different
        if (!empty($validated['slug']) && $validated['slug'] !== $customPage->slug) {
            $validated['slug'] = LandingPageCustomPage::generateUniqueSlug($validated['slug'], $customPage->id);
        } elseif (empty($validated['slug']) && $request->has('title') && $validated['title'] !== $customPage->title) {
            // Regenerate slug if title changed but no slug provided
            $validated['slug'] = LandingPageCustomPage::generateUniqueSlug($validated['title'], $customPage->id);
        }

        $customPage->update($validated);

        return back()->with('success', __('Custom page updated successfully!'));
    }

    public function destroy(LandingPageCustomPage $customPage)
    {
        $customPage->delete();
        return back()->with('success', __('Custom page deleted successfully!'));
    }

    public function show($slug)
    {
        $page = LandingPageCustomPage::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $landingSettings = \App\Models\LandingPageSetting::getSettings();
        
        // Page visit tracking removed for Storego
        
        return Inertia::render('landing-page/custom-page', [
            'page' => $page,
            'customPages' => LandingPageCustomPage::active()->ordered()->get(),
            'settings' => $landingSettings
        ]);
    }

    public function checkSlug(Request $request)
    {
        $request->validate([
            'slug' => 'required|string|max:255',
            'exclude_id' => 'nullable|integer'
        ]);

        $exists = LandingPageCustomPage::slugExists($request->slug, $request->exclude_id);
        
        return response()->json([
            'available' => !$exists,
            'exists' => $exists
        ]);
    }

    public function generateSlug(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'exclude_id' => 'nullable|integer'
        ]);

        $slug = LandingPageCustomPage::generateUniqueSlug($request->title, $request->exclude_id);
        
        return response()->json([
            'slug' => $slug
        ]);
    }
}