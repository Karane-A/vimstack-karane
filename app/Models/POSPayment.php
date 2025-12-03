<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class POSPayment extends Model
{
    protected $table = 'pos_payments';
    
    protected $fillable = [
        'transaction_id',
        'payment_method',
        'amount',
        'change_amount',
        'reference_number',
        'status'
    ];
    
    protected $casts = [
        'amount' => 'float',
        'change_amount' => 'float',
    ];
    
    public function transaction()
    {
        return $this->belongsTo(POSTransaction::class, 'transaction_id');
    }
}