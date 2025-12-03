<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Services\StorageConfigService;

class MediaItem extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = ['name', 'description'];

    public function registerMediaCollections(): void
    {
        $config = StorageConfigService::getStorageConfig();
        $allowedExtensions = array_map('trim', explode(',', strtolower($config['allowed_file_types'])));
        $maxSizeBytes = ($config['max_file_size_kb'] ?? 2048) * 1024; // Convert KB to bytes
        
        $this->addMediaCollection('images')
            ->acceptsFile(function ($file) use ($allowedExtensions, $maxSizeBytes) {
                try {
                    // Get file information safely
                    $fileName = method_exists($file, 'getClientOriginalName') 
                        ? $file->getClientOriginalName() 
                        : ($file->name ?? $file->getFilename());
                    
                    $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                    
                    // Check file extension - CRITICAL: Must be in allowed list
                    if (!in_array($extension, $allowedExtensions)) {
                        throw new \Exception("File type not allowed: {$extension}. Allowed types: " . implode(', ', $allowedExtensions));
                    }
                    
                    // Check file size safely
                    $fileSize = null;
                    if (method_exists($file, 'getSize')) {
                        $fileSize = $file->getSize();
                    } elseif (isset($file->size)) {
                        $fileSize = $file->size;
                    } elseif (method_exists($file, 'getPathname') && file_exists($file->getPathname())) {
                        $fileSize = filesize($file->getPathname());
                    }
                    
                    if ($fileSize && $fileSize > $maxSizeBytes) {
                        throw new \Exception("File too large: {$extension}. Max size: " . ($maxSizeBytes / 1024) . ' KB');
                    }
                    
                    return true;
                } catch (\Exception $e) {
                    \Log::error('MediaItem file validation failed: ' . $e->getMessage());
                    throw $e;
                }
            })
            ->useDisk(StorageConfigService::getActiveDisk());
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10)
            ->quality(85)
            ->performOnCollections('images')
            ->nonQueued()
            ->optimize()
            ->keepOriginalImageFormat();
    }
}