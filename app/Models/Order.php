<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'store_id',
        'customer_id',
        'session_id',
        'status',
        'payment_status',
        'customer_email',
        'customer_phone',
        'customer_first_name',
        'customer_last_name',
        'shipping_address',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        'shipping_country',
        'billing_address',
        'billing_city',
        'billing_state',
        'billing_postal_code',
        'billing_country',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'total_amount',
        'payment_method',
        'payment_gateway',
        'payment_transaction_id',
        'payment_details',
        'shipping_method_id',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'confirmed_at',
        'processing_at',
        'cancelled_at',
        'refunded_at',
        'payment_confirmed_at',
        'notes',
        'coupon_code',
        'coupon_discount',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'coupon_discount' => 'decimal:2',
        'payment_details' => 'array',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'processing_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'refunded_at' => 'datetime',
        'payment_confirmed_at' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(Shipping::class, 'shipping_method_id');
    }

    public static function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'ORD-' . strtoupper(uniqid());
        } while (self::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
    
    /**
     * Check if order is awaiting payment
     */
    public function isAwaitingPayment(): bool
    {
        return $this->payment_status === 'awaiting_payment';
    }
    
    /**
     * Check if order payment is completed
     */
    public function isPaymentCompleted(): bool
    {
        return $this->payment_status === 'paid';
    }
    
    /**
     * Check if order can be processed for payment
     */
    public function canProcessPayment(): bool
    {
        return in_array($this->payment_status, ['pending', 'awaiting_payment']);
    }
}