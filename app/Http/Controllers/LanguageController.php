<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LanguageController extends Controller
{
    // Show the manage language Inertia page
    public function managePage(Request $request, $lang = null)
    {
        $langListPath = resource_path('lang/language.json');
        $languages = [];
        if (\Illuminate\Support\Facades\File::exists($langListPath)) {
            $languages = json_decode(\Illuminate\Support\Facades\File::get($langListPath), true);
        }
        $defaultLang = 'en';
        $selectedLang = $defaultLang;
        if ($lang && collect($languages)->pluck('code')->contains($lang)) {
            $selectedLang = $lang;
        }
        $defaultData = [];
        if (\Illuminate\Support\Facades\File::exists(resource_path("lang/{$selectedLang}.json"))) {
            $defaultData = json_decode(\Illuminate\Support\Facades\File::get(resource_path("lang/{$selectedLang}.json")), true);
        }
        return Inertia::render('manage-language', [
            'languages' => $languages,
            'defaultLang' => $selectedLang,
            'defaultData' => $defaultData,
        ]);
    }

    // Load a language file
    public function load(Request $request)
    {
        $langListPath = resource_path('lang/language.json');
        $languages = collect();
        if (\Illuminate\Support\Facades\File::exists($langListPath)) {
            $languages = collect(json_decode(\Illuminate\Support\Facades\File::get($langListPath), true));
        }
        $lang = $request->get('lang', 'en');
        if (!$languages->pluck('code')->contains($lang)) {
            return response()->json(['error' => __('Language not found')], 404);
        }
        $langPath = resource_path("lang/{$lang}.json");
        if (!\Illuminate\Support\Facades\File::exists($langPath)) {
            return response()->json(['error' => __('Language file not found')], 404);
        }
        $data = json_decode(\Illuminate\Support\Facades\File::get($langPath), true);
        return response()->json(['data' => $data]);
    }

    // Save a language file
    public function save(Request $request)
    {
        try {
            $langListPath = resource_path('lang/language.json');
            $languages = collect();
            if (\Illuminate\Support\Facades\File::exists($langListPath)) {
                $languages = collect(json_decode(\Illuminate\Support\Facades\File::get($langListPath), true));
            }
            $lang = $request->get('lang');
            $data = $request->get('data');
            if (!$lang || !is_array($data) || !$languages->pluck('code')->contains($lang)) {
                if ($request->expectsJson()) {
                    return response()->json(['error' => __('Invalid request')], 400);
                }
                return redirect()->back()->with('error', __('Invalid request'));
            }
            $langPath = resource_path("lang/{$lang}.json");
            if (!\Illuminate\Support\Facades\File::exists($langPath)) {
                if ($request->expectsJson()) {
                    return response()->json(['error' => __('Language file not found')], 404);
                }
                return redirect()->back()->with('error', __('Language file not found'));
            }
            \Illuminate\Support\Facades\File::put($langPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            
            if ($request->expectsJson()) {
                return response()->json(['success' => __('Language updated successfully')]);
            }
            return redirect()->back()->with('success', __('Language updated successfully'));
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Failed to update language file: ') . $e->getMessage()], 500);
            }
            return redirect()->back()->with('error', __('Failed to update language file: ') . $e->getMessage());
        }
    }
} 