<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;

class TranslationController extends BaseController
{
    public function getTranslations($locale)
    {
        $path = resource_path("lang/{$locale}.json");
        
        if (!File::exists($path)) {
            $path = resource_path("lang/en.json");
        }
        
        // Cache translations for 24 hours
        // $translations = Cache::remember("translations.{$locale}", 60 * 60 * 24, function () use ($path) {
        //     return json_decode(File::get($path), true);
        // });

        $translations = json_decode(File::get($path), true);

        return response()->json($translations)
            // ->header('Cache-Control', 'public, max-age=86400') // 24 hours
            // ->header('ETag', md5(json_encode($translations)))
            ;
    }
} 