<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Legacy payment callbacks (removed gateways)
        'payments/aamarpay/success',
        'payments/aamarpay/callback',
        'payments/tap/success',
        'payments/tap/callback',
        'payments/benefit/success',
        'payments/benefit/callback',
        'payments/easebuzz/success',
        'payments/easebuzz/callback',
        'payments/paytabs/callback',
        
        // SECURITY FIX: Active payment gateway webhooks/callbacks
        'payments/skrill/callback',
        'payments/coingate/callback',
        'store/payfast/callback',
        'store/razorpay/webhook',
        'store/*/payfast/success',  // Wildcard for store slug
        'store/*/paypal/success',   // Wildcard for store slug
        'store/*/stripe/success',   // Wildcard for store slug
    ];
}