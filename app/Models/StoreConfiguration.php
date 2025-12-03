<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreConfiguration extends Model
{
    protected $fillable = ['store_id', 'key', 'value'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public static function getConfiguration($storeId)
    {
        $configs = self::where('store_id', $storeId)->pluck('value', 'key')->toArray();
        
        $defaults = [
            'store_status' => true,
            'maintenance_mode' => false,
            'logo' => '/storage/media/logo.png',
            'favicon' => ''
        ];
        
        // Convert string boolean values to actual booleans
        foreach ($configs as $key => $value) {
            if ($value === 'true') {
                $configs[$key] = true;
            } elseif ($value === 'false') {
                $configs[$key] = false;
            }
        }
        
        return array_merge($defaults, $configs);
    }

    public static function updateConfiguration($storeId, $settings)
    {
        foreach ($settings as $key => $value) {
            self::updateOrCreate(
                ['store_id' => $storeId, 'key' => $key],
                ['value' => is_bool($value) ? ($value ? 'true' : 'false') : (string)$value]
            );
        }
    }
}