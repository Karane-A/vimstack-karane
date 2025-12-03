<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

class DynamicStorageService
{
    /**
     * Configure dynamic storage disks based on database settings
     */
    public static function configureDynamicDisks(): void
    {
        $config = StorageConfigService::getStorageConfig();
        
        // Configure S3 disk if credentials exist
        if (!empty($config['s3']['key']) && !empty($config['s3']['secret'])) {
            Config::set('filesystems.disks.s3', [
                'driver' => 's3',
                'key' => $config['s3']['key'],
                'secret' => $config['s3']['secret'],
                'region' => $config['s3']['region'],
                'bucket' => $config['s3']['bucket'],
                'url' => null,
                'endpoint' => null,
                'use_path_style_endpoint' => false,
                'visibility' => 'public',
            ]);
        }
        
        // Configure Wasabi disk if credentials exist
        if (!empty($config['wasabi']['key']) && !empty($config['wasabi']['secret'])) {
            Config::set('filesystems.disks.wasabi', [
                'driver' => 's3',
                'key' => $config['wasabi']['key'],
                'secret' => $config['wasabi']['secret'],
                'region' => $config['wasabi']['region'],
                'bucket' => $config['wasabi']['bucket'],
                'endpoint' => 'https://s3.' . $config['wasabi']['region'] . '.wasabisys.com',
                'use_path_style_endpoint' => false,
                'visibility' => 'public',
            ]);
        }
    }

    /**
     * Get the active storage disk instance
     */
    public static function getActiveDiskInstance()
    {
        $diskName = StorageConfigService::getActiveDisk();
        
        // Ensure disk is configured
        self::configureDynamicDisks();
        
        try {
            return Storage::disk($diskName);
        } catch (\Exception $e) {
            // Fallback to public disk
            return Storage::disk('public');
        }
    }

    /**
     * Test storage connection
     */
    public static function testConnection(string $diskName): bool
    {
        try {
            self::configureDynamicDisks();
            $disk = Storage::disk($diskName);
            
            // Try to write and read a test file
            $testContent = 'test-' . time();
            $testPath = 'test-connection.txt';
            
            $disk->put($testPath, $testContent);
            $retrieved = $disk->get($testPath);
            $disk->delete($testPath);
            
            return $retrieved === $testContent;
        } catch (\Exception $e) {
            return false;
        }
    }
}