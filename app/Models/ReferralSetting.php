<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralSetting extends Model
{
    protected $fillable = [
        'is_enabled',
        'commission_percentage',
        'threshold_amount',
        'guidelines',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'commission_percentage' => 'decimal:2',
        'threshold_amount' => 'decimal:2',
    ];

    public static function current()
    {
        return static::first() ?? static::create([
            'is_enabled' => true,
            'commission_percentage' => 10.00,
            'threshold_amount' => 50.00,
            'guidelines' => 'Welcome to our referral program! Earn commission when users sign up using your referral link and purchase a plan. Commission is calculated based on the plan price and will be available for payout once you reach the minimum threshold.',
        ]);
    }

    public static function isEnabled()
    {
        return static::current()->is_enabled;
    }
}