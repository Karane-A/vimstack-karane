<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $blogs = Blog::where('store_id', $currentStoreId)
            ->with(['category', 'author'])
            ->latest()
            ->get();
            
        // Get statistics
        $totalPosts = Blog::where('store_id', $currentStoreId)->count();
        $publishedPosts = Blog::where('store_id', $currentStoreId)->where('status', 'published')->count();
        $totalViews = Blog::where('store_id', $currentStoreId)->sum('views');
        $avgViews = $totalPosts > 0 ? round($totalViews / $totalPosts) : 0;

        return Inertia::render('blog/index', [
            'blogs' => $blogs,
            'stats' => [
                'totalPosts' => $totalPosts,
                'publishedPosts' => $publishedPosts,
                'totalViews' => $totalViews,
                'avgViews' => $avgViews
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('blog/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'category_id' => 'nullable|exists:blog_categories,id',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'is_featured' => 'boolean',
            'allow_comments' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'focus_keyword' => 'nullable|string|max:255',
            'index_in_search' => 'boolean',
            'tags' => 'nullable|string'
        ]);

        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);

        $data = $request->all();
        $data['store_id'] = $currentStoreId;
        $data['author_id'] = Auth::id();
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
            
            // Ensure slug is unique
            $count = 1;
            $originalSlug = $data['slug'];
            while (Blog::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $count++;
            }
        }
        
        // Set published_at if status is published and no date is provided
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $blog = Blog::create($data);
        
        // Process tags
        if (!empty($data['tags'])) {
            $tagNames = array_map('trim', explode(',', $data['tags']));
            $tagIds = [];
            
            foreach ($tagNames as $tagName) {
                if (empty($tagName)) continue;
                
                $slug = Str::slug($tagName);
                
                // Check if tag already exists for this store
                $existingTag = BlogTag::where('name', $tagName)
                    ->where('store_id', $currentStoreId)
                    ->first();
                
                if ($existingTag) {
                    $tag = $existingTag;
                } else {
                    $tag = BlogTag::create([
                        'name' => $tagName,
                        'slug' => $slug,
                        'store_id' => $currentStoreId
                    ]);
                }
                
                $tagIds[] = $tag->id;
            }
            
            $blog->tags()->sync($tagIds);
        }
        
        // Update category post count
        if ($blog->category_id) {
            $category = BlogCategory::find($blog->category_id);
            if ($category) {
                $category->increment('post_count');
            }
        }

        return redirect()->route('blog.index')
            ->with('success', 'Blog post created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        if ($blog->store_id !== $currentStoreId) {
            abort(403, 'Unauthorized action.');
        }
        
        $blog->load(['category', 'author', 'tags', 'comments' => function($query) {
            $query->with('user')->where('is_approved', true)->latest();
        }]);
        
        // Increment view count
        $blog->incrementViews();
        
        // Calculate dynamic blog statistics
        $totalComments = $blog->comments()->count();
        $approvedComments = $blog->comments()->where('is_approved', true)->count();
        $pendingComments = $blog->comments()->where('is_approved', false)->count();
        $recentViews = \App\Models\Blog::where('store_id', $currentStoreId)
                                      ->where('created_at', '>=', now()->subDays(30))
                                      ->sum('views');
        
        // Calculate reading time (average 200 words per minute)
        $wordCount = str_word_count(strip_tags($blog->content));
        $readingTime = max(1, ceil($wordCount / 200));
        
        // Get related posts
        $relatedPosts = Blog::where('store_id', $currentStoreId)
                           ->where('id', '!=', $blog->id)
                           ->where('status', 'published')
                           ->where(function($query) use ($blog) {
                               if ($blog->category_id) {
                                   $query->where('category_id', $blog->category_id);
                               }
                           })
                           ->limit(3)
                           ->get(['id', 'title', 'slug', 'excerpt', 'featured_image', 'published_at']);
        
        $stats = [
            'total_comments' => $totalComments,
            'approved_comments' => $approvedComments,
            'pending_comments' => $pendingComments,
            'word_count' => $wordCount,
            'reading_time' => $readingTime,
            'views_this_month' => $recentViews,
            'engagement_rate' => $blog->views > 0 ? round(($totalComments / $blog->views) * 100, 2) : 0,
        ];
        
        return Inertia::render('blog/show', [
            'blog' => $blog,
            'stats' => $stats,
            'relatedPosts' => $relatedPosts
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        if ($blog->store_id !== $currentStoreId) {
            abort(403, 'Unauthorized action.');
        }
        
        $blog->load(['category', 'tags']);
        
        // Format tags as comma-separated string
        $tagString = $blog->tags->pluck('name')->implode(', ');
        $blog->tags_string = $tagString;
        
        return Inertia::render('blog/edit', [
            'blog' => $blog
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        if ($blog->store_id !== $currentStoreId) {
            abort(403, 'Unauthorized action.');
        }
        
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug,' . $blog->id,
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'category_id' => 'nullable|exists:blog_categories,id',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'is_featured' => 'boolean',
            'allow_comments' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'focus_keyword' => 'nullable|string|max:255',
            'index_in_search' => 'boolean',
            'tags' => 'nullable|string'
        ]);

        $data = $request->all();
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
            
            // Ensure slug is unique
            $count = 1;
            $originalSlug = $data['slug'];
            while (Blog::where('slug', $data['slug'])->where('id', '!=', $blog->id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $count++;
            }
        }
        
        // Set published_at if status is published and no date is provided
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }
        
        // Update category post count if category changed
        $oldCategoryId = $blog->category_id;
        $newCategoryId = $data['category_id'];
        
        if ($oldCategoryId !== $newCategoryId) {
            if ($oldCategoryId) {
                $oldCategory = BlogCategory::find($oldCategoryId);
                if ($oldCategory) {
                    $oldCategory->decrement('post_count');
                }
            }
            
            if ($newCategoryId) {
                $newCategory = BlogCategory::find($newCategoryId);
                if ($newCategory) {
                    $newCategory->increment('post_count');
                }
            }
        }

        $blog->update($data);
        
        // Process tags
        if (isset($data['tags'])) {
            $tagNames = array_map('trim', explode(',', $data['tags']));
            $tagIds = [];
            
            foreach ($tagNames as $tagName) {
                if (empty($tagName)) continue;
                
                $slug = Str::slug($tagName);
                
                // Check if tag already exists for this store
                $existingTag = BlogTag::where('name', $tagName)
                    ->where('store_id', $currentStoreId)
                    ->first();
                
                if ($existingTag) {
                    $tag = $existingTag;
                } else {
                    $tag = BlogTag::create([
                        'name' => $tagName,
                        'slug' => $slug,
                        'store_id' => $currentStoreId
                    ]);
                }
                
                $tagIds[] = $tag->id;
            }
            
            $blog->tags()->sync($tagIds);
        }

        return redirect()->route('blog.index')
            ->with('success', 'Blog post updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        if ($blog->store_id !== $currentStoreId) {
            abort(403, 'Unauthorized action.');
        }
        
        // Update category post count
        if ($blog->category_id) {
            $category = BlogCategory::find($blog->category_id);
            if ($category) {
                $category->decrement('post_count');
            }
        }
        
        $blog->delete();

        return redirect()->route('blog.index')
            ->with('success', 'Blog post deleted successfully!');
    }
    
    /**
     * Export blog posts data as CSV.
     */
    public function export()
    {
        $user = Auth::user();
        $currentStoreId = getCurrentStoreId($user);
        
        $blogs = Blog::where('store_id', $currentStoreId)
            ->with(['category', 'author', 'tags'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $csvData = [];
        $csvData[] = ['Title', 'Slug', 'Author', 'Category', 'Tags', 'Status', 'Views', 'Featured', 'Published Date', 'Created Date'];
        
        foreach ($blogs as $blog) {
            $csvData[] = [
                $blog->title,
                $blog->slug,
                $blog->author ? $blog->author->name : 'Unknown',
                $blog->category ? $blog->category->name : 'Uncategorized',
                $blog->tags->pluck('name')->implode(', ') ?: 'No tags',
                ucfirst($blog->status),
                $blog->views ?: 0,
                $blog->is_featured ? 'Yes' : 'No',
                $blog->published_at ? $blog->published_at->format('Y-m-d H:i:s') : 'Not published',
                $blog->created_at->format('Y-m-d H:i:s')
            ];
        }
        
        $filename = 'blog-posts-export-' . now()->format('Y-m-d') . '.csv';
        
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