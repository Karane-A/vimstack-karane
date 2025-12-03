<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogComment extends Model
{
    protected $fillable = [
        'blog_id',
        'user_id',
        'author_name',
        'author_email',
        'content',
        'is_approved',
        'parent_id'
    ];
    
    protected $casts = [
        'is_approved' => 'boolean',
    ];
    
    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function parent()
    {
        return $this->belongsTo(BlogComment::class, 'parent_id');
    }
    
    public function replies()
    {
        return $this->hasMany(BlogComment::class, 'parent_id');
    }
}
