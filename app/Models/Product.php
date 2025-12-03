<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'sku',
        'description',
        'specifications',
        'details',
        'price',
        'sale_price',
        'stock',
        'cover_image',
        'images',
        'variants',
        'custom_fields',
        'category_id',
        'tax_id',
        'store_id',
        'is_active',
        'is_downloadable',
        'downloadable_file',
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'is_downloadable' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'stock' => 'integer',
        'variants' => 'array',
        'custom_fields' => 'array',
    ];
    
    /**
     * Get the variants as an array
     */
    public function getVariantsAttribute($value)
    {
        if (empty($value)) return [];
        return json_decode($value, true);
    }
    
    /**
     * Set the variants as JSON
     */
    public function setVariantsAttribute($value)
    {
        $this->attributes['variants'] = is_array($value) ? json_encode($value) : $value;
    }
    
    /**
     * Get the custom fields as an array
     */
    public function getCustomFieldsAttribute($value)
    {
        if (empty($value)) return [];
        return json_decode($value, true);
    }
    
    /**
     * Set the custom fields as JSON
     */
    public function setCustomFieldsAttribute($value)
    {
        $this->attributes['custom_fields'] = is_array($value) ? json_encode($value) : $value;
    }
    
    /**
     * Get the images as an array
     */
    public function getImagesArrayAttribute()
    {
        if (empty($this->images)) return [];
        return explode(',', $this->images);
    }
    
    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    
    /**
     * Get the store that owns the product.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
    
    /**
     * Get the tax that applies to the product.
     */
    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class);
    }
    
    /**
     * Get the reviews for the product.
     */
    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}
