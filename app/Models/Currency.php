<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $fillable = [
        'name',
        'code',
        'symbol',
        'description',
        'is_default'
    ];
    
    protected $casts = [
        'is_default' => 'boolean'
    ];
}
