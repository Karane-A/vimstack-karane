<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreConfiguration;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PWAController extends Controller
{
    /**
     * Generate PWA manifest for store
     */
    public function manifest($storeSlug)
    {
        $store = Store::where('slug', $storeSlug)->firstOrFail();
        
        if (!$store->enable_pwa || !($store->user->plan && $store->user->plan->pwa_business === 'on')) {
            return response()->json(['error' => 'PWA not available for this store'], 404);
        }

        $storeUrl = route('store.home', $store->slug);
        
        $manifest = [
            'name' => $store->pwa_name ?: $store->name,
            'short_name' => $store->pwa_short_name ?: substr($store->name, 0, 12),
            'description' => $store->pwa_description ?: $store->description,
            'start_url' => $storeUrl,
            'scope' => $storeUrl,
            'display' => $store->pwa_display ?: 'standalone',
            'background_color' => $store->pwa_background_color ?: '#ffffff',
            'theme_color' => $store->pwa_theme_color ?: '#3B82F6',
            'orientation' => $store->pwa_orientation ?: 'portrait',
            'categories' => ['shopping', 'business'],
            'icons' => $this->generatePWAIcons($store)
        ];

        return response()->json($manifest)
            ->header('Content-Type', 'application/manifest+json')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Generate service worker for store
     */
    public function serviceWorker($storeSlug)
    {
        $store = Store::where('slug', $storeSlug)->firstOrFail();
        
        if (!$store->enable_pwa || !($store->user->plan && $store->user->plan->pwa_business === 'on')) {
            return response('// PWA not available', 404, ['Content-Type' => 'application/javascript']);
        }

        $storeUrl = route('store.home', $store->slug);
        $cacheName = 'store-' . $store->slug . '-v1';
        
        $serviceWorker = "
const CACHE_NAME = '{$cacheName}';
const urlsToCache = [
    '{$storeUrl}',
    '{$storeUrl}/products',
    '{$storeUrl}/cart',
    '{$storeUrl}/wishlist'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    // Handle navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('{$storeUrl}');
            })
        );
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
";

        return response($serviceWorker)
            ->header('Content-Type', 'text/javascript')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Service-Worker-Allowed', '/');
    }

    /**
     * Generate PWA icons array
     */
    private function generatePWAIcons($store)
    {
        // Get store configuration for favicon and logo
        $storeConfig = StoreConfiguration::getConfiguration($store->id);
        
        // Priority: PWA icon > Store favicon > Store logo > Default logo
        $iconUrl = $store->pwa_icon 
            ? asset('storage/' . $store->pwa_icon)
            : ($storeConfig['favicon'] 
                ? asset($storeConfig['favicon'])
                : ($storeConfig['logo'] 
                    ? asset($storeConfig['logo'])
                    : asset('logo.svg'))); // Use the main logo.svg as fallback
        
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
}