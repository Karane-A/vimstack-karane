<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    protected $fillable = [
        'name',
        'code',
        'status'
    ];

    protected $casts = [
        'status' => 'boolean'
    ];

    public function states(): HasMany
    {
        return $this->hasMany(State::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}