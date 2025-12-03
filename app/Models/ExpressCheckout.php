<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpressCheckout extends Model
{
    protected $fillable = [
        'store_id',
        'name',
        'type',
        'description',
        'button_text',
        'button_color',
        'is_active',
        'payment_methods',
        'default_payment_method',
        'skip_cart',
        'auto_fill_customer_data',
        'guest_checkout_allowed',
        'mobile_optimized',
        'save_payment_methods',
        'success_redirect_url',
        'cancel_redirect_url',
        'conversions',
        'revenue'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'payment_methods' => 'array',
        'skip_cart' => 'boolean',
        'auto_fill_customer_data' => 'boolean',
        'guest_checkout_allowed' => 'boolean',
        'mobile_optimized' => 'boolean',
        'save_payment_methods' => 'boolean',
        'conversions' => 'integer',
        'revenue' => 'float',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }



    public function getTypeDisplayAttribute()
    {
        $types = [
            'buy_now' => 'Buy Now',
            'express_cart' => 'Express Cart',
            'guest_checkout' => 'Guest Checkout',
            'mobile_optimized' => 'Mobile Optimized'
        ];

        return $types[$this->type] ?? $this->type;
    }

    public function getPaymentMethodsDisplayAttribute()
    {
        if (!$this->payment_methods) {
            return [];
        }

        $methods = [];
        $allMethods = [
            'credit_card' => 'Credit Card',
            'paypal' => 'PayPal',
            'apple_pay' => 'Apple Pay',
            'google_pay' => 'Google Pay',
            'samsung_pay' => 'Samsung Pay'
        ];

        foreach ($this->payment_methods as $method) {
            if (isset($allMethods[$method])) {
                $methods[] = $allMethods[$method];
            }
        }

        return $methods;
    }
}