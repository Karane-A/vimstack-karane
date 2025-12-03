<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'is_landing_page'
    ];

    protected $casts = [
        'is_landing_page' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function scopeLandingPage($query)
    {
        return $query->where('is_landing_page', true);
    }
}