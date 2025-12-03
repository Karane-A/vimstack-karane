<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'store_id',
        'customer_id',
        'session_id',
        'product_id',
        'quantity',
        'variants',
        'price',
    ];

    protected $casts = [
        'variants' => 'array',
        'price' => 'decimal:2',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getTotalAttribute()
    {
        return $this->price * $this->quantity;
    }
}