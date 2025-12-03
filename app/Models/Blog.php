<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'category_id',
        'author_id',
        'store_id',
        'status',
        'published_at',
        'is_featured',
        'allow_comments',
        'views',
        'meta_title',
        'meta_description',
        'focus_keyword',
        'index_in_search'
    ];
    
    protected $casts = [
        'is_featured' => 'boolean',
        'allow_comments' => 'boolean',
        'index_in_search' => 'boolean',
        'published_at' => 'datetime',
    ];
    
    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }
    
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    
    public function tags()
    {
        return $this->belongsToMany(BlogTag::class, 'blog_blog_tag', 'blog_id', 'blog_tag_id');
    }
    
    public function comments()
    {
        return $this->hasMany(BlogComment::class)->whereNull('parent_id');
    }
    
    public function allComments()
    {
        return $this->hasMany(BlogComment::class);
    }
    
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->where('published_at', '<=', now());
    }
    
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
    
    public function incrementViews()
    {
        $this->increment('views');
    }
    
    protected static function boot()
    {
        parent::boot();
        
        // Update category post count when blog is created
        static::created(function ($blog) {
            if ($blog->category_id) {
                $category = BlogCategory::find($blog->category_id);
                if ($category) {
                    $category->increment('post_count');
                }
            }
        });
        
        // Update category post count when blog is deleted
        static::deleted(function ($blog) {
            if ($blog->category_id) {
                $category = BlogCategory::find($blog->category_id);
                if ($category) {
                    $category->decrement('post_count');
                }
            }
        });
        
        // Update category post count when blog category is changed
        static::updated(function ($blog) {
            if ($blog->isDirty('category_id')) {
                $oldCategoryId = $blog->getOriginal('category_id');
                $newCategoryId = $blog->category_id;
                
                // Decrement old category
                if ($oldCategoryId) {
                    $oldCategory = BlogCategory::find($oldCategoryId);
                    if ($oldCategory) {
                        $oldCategory->decrement('post_count');
                    }
                }
                
                // Increment new category
                if ($newCategoryId) {
                    $newCategory = BlogCategory::find($newCategoryId);
                    if ($newCategory) {
                        $newCategory->increment('post_count');
                    }
                }
            }
        });
    }
}