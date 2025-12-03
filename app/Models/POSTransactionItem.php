<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class POSTransactionItem extends Model
{
    protected $table = 'pos_transaction_items';
    
    protected $fillable = [
        'transaction_id',
        'product_id',
        'product_name',
        'variant_name',
        'quantity',
        'price',
        'tax',
        'discount',
        'total'
    ];
    
    protected $casts = [
        'quantity' => 'integer',
        'price' => 'float',
        'tax' => 'float',
        'discount' => 'float',
        'total' => 'float',
    ];
    
    public function transaction()
    {
        return $this->belongsTo(POSTransaction::class, 'transaction_id');
    }
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}