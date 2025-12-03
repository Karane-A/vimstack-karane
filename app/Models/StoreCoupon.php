<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreCoupon extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'code_type',
        'type',
        'discount_amount',
        'minimum_spend',
        'maximum_spend',
        'use_limit_per_coupon',
        'use_limit_per_user',
        'used_count',
        'start_date',
        'expiry_date',
        'status',
        'store_id',
        'created_by'
    ];

    protected $casts = [
        'minimum_spend' => 'decimal:2',
        'maximum_spend' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'start_date' => 'date',
        'expiry_date' => 'date',
        'status' => 'boolean'
    ];

    /**
     * Get the store that owns the coupon.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the user who created the coupon.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
