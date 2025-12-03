<?php

namespace App\Http\Controllers;

use App\Models\CustomPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CustomPageController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $pages = CustomPage::where('store_id', $currentStoreId)
            ->orderBy('order')
            ->get();
            
        // Get statistics
        $totalPages = CustomPage::where('store_id', $currentStoreId)->count();
        $publishedPages = CustomPage::where('store_id', $currentStoreId)->where('status', 'published')->count();
        $draftPages = CustomPage::where('store_id', $currentStoreId)->where('status', 'draft')->count();
        $totalViews = CustomPage::where('store_id', $currentStoreId)->sum('views');

        return Inertia::render('custom-pages/index', [
            'pages' => $pages,
            'stats' => [
                'totalPages' => $totalPages,
                'publishedPages' => $publishedPages,
                'draftPages' => $draftPages,
                'totalViews' => $totalViews
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        // Get parent pages for dropdown
        $parentPages = CustomPage::where('store_id', $currentStoreId)
            ->where('status', 'published')
            ->select('id', 'title')
            ->get();
            
        return Inertia::render('custom-pages/create', [
            'parentPages' => $parentPages
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:custom_pages,slug',
            'content' => 'nullable|string|max:16777215',
            'template' => 'required|string|max:50',
            'status' => 'required|in:draft,published,private',
            'parent_id' => 'nullable',
            'order' => 'nullable|integer',
            'show_in_navigation' => 'boolean',
            'allow_comments' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string|max:255',
            'canonical_url' => 'nullable|string|max:255',
            'index_in_search' => 'boolean',
            'follow_links' => 'boolean'
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $data = $request->all();
        $data['store_id'] = $currentStoreId;
        
        // Handle null parent_id
        if ($data['parent_id'] === 'null') {
            $data['parent_id'] = null;
        }
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
            
            // Ensure slug is unique
            $count = 1;
            $originalSlug = $data['slug'];
            while (CustomPage::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $count++;
            }
        }

        CustomPage::create($data);

        return redirect()->route('custom-pages.index')
            ->with('success', 'Page created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $page = CustomPage::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        // Increment view count
        $page->incrementViews();
        
        return Inertia::render('custom-pages/show', [
            'page' => $page
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $page = CustomPage::where('store_id', $currentStoreId)
            ->findOrFail($id);
            
        // Get parent pages for dropdown (excluding the current page and its children)
        $parentPages = CustomPage::where('store_id', $currentStoreId)
            ->where('id', '!=', $id)
            ->where('parent_id', '!=', $id)
            ->where('status', 'published')
            ->select('id', 'title')
            ->get();
        
        return Inertia::render('custom-pages/edit', [
            'page' => $page,
            'parentPages' => $parentPages
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $page = CustomPage::where('store_id', $currentStoreId)
            ->findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:custom_pages,slug,' . $id,
            'content' => 'nullable|string|max:16777215',
            'template' => 'required|string|max:50',
            'status' => 'required|in:draft,published,private',
            'parent_id' => 'nullable',
            'order' => 'nullable|integer',
            'show_in_navigation' => 'boolean',
            'allow_comments' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string|max:255',
            'canonical_url' => 'nullable|string|max:255',
            'index_in_search' => 'boolean',
            'follow_links' => 'boolean'
        ]);

        $data = $request->all();
        
        // Handle null parent_id
        if ($data['parent_id'] === 'null') {
            $data['parent_id'] = null;
        }
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
            
            // Ensure slug is unique
            $count = 1;
            $originalSlug = $data['slug'];
            while (CustomPage::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $count++;
            }
        }
        
        // Prevent circular parent-child relationship
        if ($data['parent_id'] == $id) {
            $data['parent_id'] = null;
        }

        $page->update($data);

        return redirect()->route('custom-pages.index')
            ->with('success', 'Page updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $page = CustomPage::where('store_id', $currentStoreId)
            ->findOrFail($id);
            
        // Update children to have no parent
        CustomPage::where('parent_id', $id)->update(['parent_id' => null]);
        
        $page->delete();

        return redirect()->route('custom-pages.index')
            ->with('success', 'Page deleted successfully!');
    }
}