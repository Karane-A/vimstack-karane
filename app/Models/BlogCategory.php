<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
        'parent_id',
        'store_id',
        'created_by',
        'post_count'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
    ];
    
    public function parent()
    {
        return $this->belongsTo(BlogCategory::class, 'parent_id');
    }
    
    public function children()
    {
        return $this->hasMany(BlogCategory::class, 'parent_id');
    }
    
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    public function posts()
    {
        return $this->hasMany(Blog::class, 'category_id');
    }
}
