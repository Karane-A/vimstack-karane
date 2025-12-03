<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Coupon extends Model
{
    protected $fillable = [
        'name',
        'type',
        'minimum_spend',
        'maximum_spend',
        'discount_amount',
        'use_limit_per_coupon',
        'use_limit_per_user',
        'expiry_date',
        'code',
        'code_type',
        'status',
        'created_by'
    ];

    protected $casts = [
        'minimum_spend' => 'decimal:2',
        'maximum_spend' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'expiry_date' => 'date',
        'status' => 'boolean'
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
