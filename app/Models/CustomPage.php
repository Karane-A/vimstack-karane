<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomPage extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'store_id',
        'template',
        'status',
        'parent_id',
        'order',
        'show_in_navigation',
        'allow_comments',
        'views',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'index_in_search',
        'follow_links'
    ];
    
    protected $casts = [
        'show_in_navigation' => 'boolean',
        'allow_comments' => 'boolean',
        'index_in_search' => 'boolean',
        'follow_links' => 'boolean',
    ];
    
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    
    public function parent()
    {
        return $this->belongsTo(CustomPage::class, 'parent_id');
    }
    
    public function children()
    {
        return $this->hasMany(CustomPage::class, 'parent_id');
    }
    
    public function incrementViews()
    {
        $this->increment('views');
    }
    
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
    
    public function scopeNavigation($query)
    {
        return $query->where('show_in_navigation', true);
    }
}
