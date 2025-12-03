<?php

namespace App\Models;


class Permission extends BaseSpatiePermission
{
    protected $fillable = [
        'module',
        'name',
        'label',
        'description',
        'is_active',
        'guard_name'
    ];
}