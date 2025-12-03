<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tax extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'rate',
        'type',
        'region',
        'priority',
        'compound',
        'is_active',
        'store_id',
    ];
    
    protected $casts = [
        'rate' => 'decimal:2',
        'priority' => 'integer',
        'compound' => 'boolean',
        'is_active' => 'boolean',
    ];
    
    /**
     * Get the store that owns the tax rule.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
