<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable
{
    use Notifiable;
    protected $appends = ['full_name', 'avatar_url', 'initials'];
    protected $fillable = [
        'store_id',
        'first_name',
        'last_name',
        'email',
        'email_verified_at',
        'password',
        'phone',
        'date_of_birth',
        'gender',
        'notes',
        'avatar',
        'is_active',
        'preferred_language',
        'customer_group',
        'email_marketing',
        'sms_notifications',
        'order_updates',
        'total_orders',
        'total_spent'
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
        'email_marketing' => 'boolean',
        'sms_notifications' => 'boolean',
        'order_updates' => 'boolean',
        'total_orders' => 'integer',
        'total_spent' => 'float',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function billingAddress()
    {
        return $this->hasOne(CustomerAddress::class)->where('type', 'billing')->where('is_default', true);
    }

    public function shippingAddress()
    {
        return $this->hasOne(CustomerAddress::class)->where('type', 'shipping')->where('is_default', true);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAvatarUrlAttribute()
    {
        return $this->avatar;
    }

    public function getInitialsAttribute()
    {
        return strtoupper(substr($this->first_name, 0, 1) . substr($this->last_name, 0, 1));
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}