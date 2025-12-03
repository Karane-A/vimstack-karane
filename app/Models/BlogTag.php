<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogTag extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'store_id'
    ];
    
    public function blogs()
    {
        return $this->belongsToMany(Blog::class, 'blog_blog_tag', 'blog_tag_id', 'blog_id');
    }
    
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
