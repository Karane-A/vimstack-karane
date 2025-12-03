<?php

return [
    /*
    |--------------------------------------------------------------------------
    | OpenAI API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for OpenAI API integration
    |
    */

    'api_key' => env('OPENAI_API_KEY'),
    
    'default_model' => env('OPENAI_DEFAULT_MODEL', 'gpt-3.5-turbo'),
    
    'models' => [
        'gpt-3.5-turbo' => [
            'name' => 'GPT-3.5 Turbo',
            'max_tokens' => 4096,
            'cost_per_1k_tokens' => 0.002,
        ],
        'gpt-4' => [
            'name' => 'GPT-4',
            'max_tokens' => 8192,
            'cost_per_1k_tokens' => 0.03,
        ],
        'gpt-4-turbo' => [
            'name' => 'GPT-4 Turbo',
            'max_tokens' => 128000,
            'cost_per_1k_tokens' => 0.01,
        ],
    ],
    
    'timeout' => env('OPENAI_TIMEOUT', 30),
    
    'max_retries' => env('OPENAI_MAX_RETRIES', 3),
    
    'temperature' => [
        'low' => 0.3,
        'medium' => 0.7,
        'high' => 0.9,
    ],
    
    'supported_languages' => [
        'en' => 'English',
        'es' => 'Spanish',
        'fr' => 'French',
        'de' => 'German',
        'it' => 'Italian',
    ],
];