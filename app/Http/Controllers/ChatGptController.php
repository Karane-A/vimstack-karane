<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Setting;
use OpenAI;

class ChatGptController extends Controller
{
    public function generate(Request $request): JsonResponse
    {
        // Check if demo mode is enabled
        if (config('app.is_demo', false)) {
            return response()->json([
                'message' => 'This action is disabled in demo mode. You can only create new data, not modify existing demo data.',
                'demo_mode' => true,
                'success' => false
            ], 403);
        }

        $request->validate([
            'prompt' => 'required|string|max:1000',
            'language' => 'string|in:en,es,ar,da,de,fr,he,it,ja,nl,pl,pt,pt-BR,ru,tr,zh',
            'creativity' => 'string|in:low,medium,high',
            'num_results' => 'integer|min:1|max:5',
            'max_length' => 'integer|min:1|max:500'
        ]);

        try {
            $apiKey = Setting::where('key', 'chatgptKey')->value('value');
            $model = Setting::where('key', 'chatgptModel')->value('value') ?? 'gpt-3.5-turbo';
            
            if (!$apiKey) {
                return response()->json([
                    'success' => false,
                    'message' => __('Please set proper configuration for Api Key')
                ]);
            }

            $temperature = (float) $request->input('creativity', 0.7);
            if (is_string($request->input('creativity'))) {
                $temperature = match($request->input('creativity')) {
                    'low' => 0.3,
                    'high' => 0.9,
                    default => 0.7
                };
            }
            
            $language = $request->input('language', 'en');
            $langText = $language !== 'en' ? "Provide response in " . match($language) {
                'es' => 'Spanish',
                'ar' => 'Arabic',
                'da' => 'Danish',
                'de' => 'German',
                'fr' => 'French',
                'he' => 'Hebrew',
                'it' => 'Italian',
                'ja' => 'Japanese',
                'nl' => 'Dutch',
                'pl' => 'Polish',
                'pt' => 'Portuguese',
                'pt-BR' => 'Brazilian Portuguese',
                'ru' => 'Russian',
                'tr' => 'Turkish',
                'zh' => 'Chinese',
                default => 'English'
            } . " language.\n\n " : "";

            $maxTokens = (int) $request->input('max_length', 150);
            $maxResults = (int) $request->input('num_results', 1);

            $client = OpenAI::client($apiKey);
            
            $response = $client->chat()->create([
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $request->prompt . ' ' . $langText
                    ]
                ],
                'max_tokens' => $maxTokens,
                'temperature' => $temperature,
                'n' => $maxResults
            ]);

            if (isset($response->choices)) {
                $text = '';
                $counter = 1;
                
                if (count($response->choices) > 1) {
                    foreach ($response->choices as $choice) {
                        $text .= $counter . '. ' . trim($choice->message->content) . "\r\n\r\n\r\n";
                        $counter++;
                    }
                } else {
                    $text = $response->choices[0]->message->content;
                }

                return response()->json([
                    'success' => true,
                    'content' => trim($text)
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => __('Text was not generated, please try again')
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }
}