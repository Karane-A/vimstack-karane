<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class POSTransaction extends Model
{
    protected $table = 'pos_transactions';
    
    protected $fillable = [
        'store_id',
        'transaction_number',
        'customer_id',
        'cashier_id',
        'subtotal',
        'tax',
        'discount',
        'total',
        'status',
        'notes'
    ];
    
    protected $casts = [
        'subtotal' => 'float',
        'tax' => 'float',
        'discount' => 'float',
        'total' => 'float',
    ];
    
    public function items()
    {
        return $this->hasMany(POSTransactionItem::class, 'transaction_id');
    }
    
    public function payments()
    {
        return $this->hasMany(POSPayment::class, 'transaction_id');
    }
    
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    
    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }
    
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    
    public static function generateTransactionNumber($storeId)
    {
        return DB::transaction(function () use ($storeId) {
            $prefix = 'POS-' . date('Y') . '-';
            
            $lastTransaction = self::where('store_id', $storeId)
                ->where('transaction_number', 'like', $prefix . '%')
                ->lockForUpdate()
                ->orderBy('transaction_number', 'desc')
                ->first();
                
            if ($lastTransaction) {
                $lastNumber = intval(substr($lastTransaction->transaction_number, strlen($prefix)));
                $newNumber = $lastNumber + 1;
            } else {
                $newNumber = 1;
            }
            
            return $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);
        });
    }
}