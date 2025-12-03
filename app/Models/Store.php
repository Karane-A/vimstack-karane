<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'theme',
        'user_id',
        'custom_domain',
        'custom_subdomain',
        'enable_custom_domain',
        'enable_custom_subdomain',
        'email',
        'is_active',
        // PWA Settings
        'enable_pwa',
        'pwa_name',
        'pwa_short_name',
        'pwa_description',
        'pwa_theme_color',
        'pwa_background_color',
        'pwa_icon',
        'pwa_display',
        'pwa_orientation',
    ];
    
    protected $casts = [
        'enable_custom_domain' => 'boolean',
        'enable_custom_subdomain' => 'boolean',
        'is_active' => 'boolean',
        'enable_pwa' => 'boolean',
    ];

    /**
     * Get the user that owns the store.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the categories for the store.
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    /**
     * Get the products for the store.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the blogs for the store.
     */
    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }

    /**
     * Generate a unique slug for the store.
     */
    public static function generateUniqueSlug($name)
    {
        $slug = \Illuminate\Support\Str::slug($name);
        
        // Check if base slug exists
        $baseExists = static::where('slug', $slug)->exists();
        
        if (!$baseExists) {
            return $slug;
        }
        
        // Find the highest numbered variant
        $maxNumber = static::where('slug', 'like', $slug . '-%')
            ->get()
            ->map(function ($store) use ($slug) {
                if (preg_match('/^' . preg_quote($slug, '/') . '-(\d+)$/', $store->slug, $matches)) {
                    return (int) $matches[1];
                }
                return 0;
            })
            ->max();
        
        return $slug . '-' . ($maxNumber + 1);
    }

    /**
     * Get PWA data for store
     */
    public static function pwa_store($store)
    {
        if (!$store->enable_pwa) {
            return [];
        }

        try {
            $manifestPath = storage_path('uploads/pwa/store_' . $store->id . '/manifest.json');
            
            if (\File::exists($manifestPath)) {
                $pwa_data = \File::get($manifestPath);
                return json_decode($pwa_data, true);
            }
            
            // Generate manifest if doesn't exist
            return self::generatePWAManifest($store);
        } catch (\Throwable $th) {
            return [];
        }
    }

    /**
     * Generate PWA manifest for store
     */
    public static function generatePWAManifest($store)
    {
        $manifest = [
            'name' => $store->pwa_name ?: $store->name,
            'short_name' => $store->pwa_short_name ?: substr($store->name, 0, 12),
            'description' => $store->pwa_description ?: $store->description,
            'start_url' => route('store.home', $store->slug),
            'display' => $store->pwa_display ?: 'standalone',
            'background_color' => $store->pwa_background_color ?: '#ffffff',
            'theme_color' => $store->pwa_theme_color ?: '#3B82F6',
            'orientation' => $store->pwa_orientation ?: 'portrait',
            'categories' => ['shopping', 'business'],
            'icons' => self::generatePWAIcons($store)
        ];

        // Save manifest
        $manifestDir = storage_path('uploads/pwa/store_' . $store->id);
        if (!\File::exists($manifestDir)) {
            \File::makeDirectory($manifestDir, 0755, true);
        }
        
        \File::put($manifestDir . '/manifest.json', json_encode($manifest, JSON_PRETTY_PRINT));
        
        return $manifest;
    }

    /**
     * Generate PWA icons array
     */
    private static function generatePWAIcons($store)
    {
        $iconUrl = $store->pwa_icon ? asset('storage/' . $store->pwa_icon) : asset('images/default-store-icon.png');
        
        $sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        $icons = [];
        
        foreach ($sizes as $size) {
            $icons[] = [
                'src' => $iconUrl,
                'sizes' => $size . 'x' . $size,
                'type' => 'image/png',
                'purpose' => 'any maskable'
            ];
        }
        
        return $icons;
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();
        
        static::created(function ($store) {
            if ($store->user && $store->user->type === 'company' && !app()->runningInConsole()) {
                copySettingsFromSuperAdmin($store->user_id, $store->id);
            }
        });
        
        static::updated(function ($store) {
            // Regenerate PWA manifest when store is updated
            if ($store->enable_pwa) {
                self::generatePWAManifest($store);
            }
        });
    }
}