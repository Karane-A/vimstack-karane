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
        'payments/aamarpay/success',
        'payments/aamarpay/callback',
        'payments/tap/success',
        'payments/tap/callback',
        'payments/benefit/success',
        'payments/benefit/callback',
        'payments/easebuzz/success',
        'payments/easebuzz/callback',
        'payments/paytabs/callback'
    ];
}