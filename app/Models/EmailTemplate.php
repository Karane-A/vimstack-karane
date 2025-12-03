<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'from',
        'user_id',
    ];

    public function emailTemplateLangs(): HasMany
    {
        return $this->hasMany(EmailTemplateLang::class, 'parent_id');
    }

    public function userEmailTemplates(): HasMany
    {
        return $this->hasMany(UserEmailTemplate::class, 'template_id');
    }
}
