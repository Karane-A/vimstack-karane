<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $query = BlogCategory::where('store_id', $currentStoreId);

        // Apply search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->latest()->get()->map(function ($category) {
            // Calculate actual post count from relationship
            $category->post_count = $category->posts()->count();
            return $category;
        });

        // Get statistics with actual post counts
        $totalCategories = BlogCategory::where('store_id', $currentStoreId)->count();
        $activeCategories = BlogCategory::where('store_id', $currentStoreId)->where('is_active', true)->count();
        
        // Calculate most popular and average posts dynamically
        $categoriesWithCounts = BlogCategory::where('store_id', $currentStoreId)
            ->withCount('posts')
            ->get();
        
        $mostPopular = $categoriesWithCounts->max('posts_count') ?? 0;
        $avgPosts = $totalCategories > 0 
            ? $categoriesWithCounts->avg('posts_count') 
            : 0;

        return Inertia::render('blog/categories/index', [
            'categories' => $categories,
            'stats' => [
                'total' => $totalCategories,
                'active' => $activeCategories,
                'mostPopular' => $mostPopular,
                'avgPosts' => round($avgPosts)
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_categories,slug',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'parent_id' => 'nullable|exists:blog_categories,id'
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $data = $request->all();
        $data['store_id'] = $currentStoreId;
        $data['created_by'] = Auth::id();
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            
            // Ensure slug is unique
            $count = 1;
            $originalSlug = $data['slug'];
            while (BlogCategory::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $count++;
            }
        }

        $category = BlogCategory::create($data);

        return redirect()->route('blog.categories.index')
            ->with('success', 'Category created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BlogCategory $category)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        if ($category->store_id !== $currentStoreId) {
            abort(403, 'Unauthorized action.');
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'parent_id' => 'nullable|exists:blog_categories,id'
        ]);

        $data = $request->all();
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            
            // Ensure slug is unique
            $count = 1;
            $originalSlug = $data['slug'];
            while (BlogCategory::where('slug', $data['slug'])->where('id', '!=', $category->id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $count++;
            }
        }

        $category->update($data);

        return redirect()->route('blog.categories.index')
            ->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlogCategory $category)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        if ($category->store_id !== $currentStoreId) {
            abort(403, 'Unauthorized action.');
        }
        
        // Check if category has posts
        if ($category->post_count > 0) {
            return redirect()->route('blog.categories.index')
                ->with('error', 'Cannot delete category with associated posts.');
        }
        
        $category->delete();

        return redirect()->route('blog.categories.index')
            ->with('success', 'Category deleted successfully!');
    }
}
