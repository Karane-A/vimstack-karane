<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailTemplateLang extends Model
{
    protected $fillable = [
        'parent_id',
        'lang',
        'subject',
        'content',
    ];

    public function emailTemplate(): BelongsTo
    {
        return $this->belongsTo(EmailTemplate::class, 'parent_id');
    }
}
