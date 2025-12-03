<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipping extends Model
{
    protected $fillable = [
        'store_id',
        'name',
        'type',
        'description',
        'cost',
        'min_order_amount',
        'delivery_time',
        'sort_order',
        'is_active',
        'zone_type',
        'countries',
        'postal_codes',
        'max_distance',
        'max_weight',
        'max_dimensions',
        'require_signature',
        'insurance_required',
        'tracking_available',
        'handling_fee',
        'views'
    ];

    protected $casts = [
        'cost' => 'float',
        'min_order_amount' => 'float',
        'max_distance' => 'float',
        'max_weight' => 'float',
        'handling_fee' => 'float',
        'is_active' => 'boolean',
        'require_signature' => 'boolean',
        'insurance_required' => 'boolean',
        'tracking_available' => 'boolean',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function incrementViews()
    {
        $this->increment('views');
    }
}