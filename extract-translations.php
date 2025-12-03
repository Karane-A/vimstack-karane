<?php

// Define the directories to scan
$directories = [
    __DIR__ . '/resources/js/pages',
    __DIR__ . '/resources/js/components',
    __DIR__ . '/resources/js/layouts',
    __DIR__ . '/resources/views',
    __DIR__ . '/app'
];
$outputFile = __DIR__ . '/resources/lang/en.json';

// Initialize an array to store translations
$translations = [];

// Load existing translations if the file exists
if (file_exists($outputFile)) {
    $existingContent = file_get_contents($outputFile);
    $translations = json_decode($existingContent, true) ?: [];
}

// Function to recursively scan directories
function scanDirectory($dir, &$translations) {
    if (!is_dir($dir)) {
        return;
    }
    
    $files = scandir($dir);
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }
        
        $path = $dir . '/' . $file;
        
        if (is_dir($path)) {
            scanDirectory($path, $translations);
        } else {
            $extension = pathinfo($path, PATHINFO_EXTENSION);
            if (in_array($extension, ['tsx', 'jsx', 'php', 'blade.php'])) {
                extractTranslations($path, $translations);
            }
        }
    }
}

// Function to extract translations from a file
function extractTranslations($file, &$translations) {
    $content = file_get_contents($file);
    
    // Match t("...") pattern - ensure it's the t function, not part of another word
    preg_match_all('/(?<![a-zA-Z0-9_])t\("([^"]*)"\)/', $content, $doubleQuoteMatches);
    
    // Match t('...') pattern - ensure it's the t function, not part of another word
    preg_match_all("/(?<![a-zA-Z0-9_])t\('([^']*)'\)/", $content, $singleQuoteMatches);
    
    // Match __("...") pattern
    preg_match_all('/__\("([^"]*)"\)/', $content, $doubleQuoteMatchesUnderscore);
    
    // Match __('...') pattern
    preg_match_all("/__\('([^']*)'\)/", $content, $singleQuoteMatchesUnderscore);
    
    // Add matches to translations array
    foreach ($doubleQuoteMatches[1] as $match) {
        $translations[$match] = $match;
    }
    
    foreach ($singleQuoteMatches[1] as $match) {
        $translations[$match] = $match;
    }
    
    foreach ($doubleQuoteMatchesUnderscore[1] as $match) {
        $translations[$match] = $match;
    }
    
    foreach ($singleQuoteMatchesUnderscore[1] as $match) {
        $translations[$match] = $match;
    }
}

// Start scanning all directories
foreach ($directories as $directory) {
    scanDirectory($directory, $translations);
}

// Sort translations alphabetically
ksort($translations);

// Create directory if it doesn't exist
$outputDir = dirname($outputFile);
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}

// Write to file
file_put_contents($outputFile, json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "Translation extraction complete. Found " . count($translations) . " strings.\n";
