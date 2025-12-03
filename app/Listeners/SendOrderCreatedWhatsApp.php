<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Cache;
use Exception;

class SendOrderCreatedWhatsApp
{
    public function __construct(private WhatsAppService $whatsappService)
    {
    }

    public function handle(OrderCreated $event): void
    {
        $order = $event->order;
        
        // Prevent duplicate processing
        $cacheKey = 'order_notifications_' . $order->id;
        if (Cache::has($cacheKey)) return;
        Cache::put($cacheKey, true, 300);
        
        $store = $order->store;
        if (!$store) return;
        
        $userId = $store->user_id;
        $storeId = $store->id;
        
        // Only send notification based on selected payment method
        if ($order->payment_method === 'whatsapp') {
            // Send WhatsApp notification if WhatsApp payment was selected
            if (getSetting('is_whatsapp_enabled', '0', $userId, $storeId) === '1' && $order->whatsapp_number) {
                try {
                    $this->whatsappService->sendOrderConfirmation($order, $order->whatsapp_number);
                } catch (Exception $e) {
                    \Log::error('WhatsApp notification failed: ' . $e->getMessage());
                }
            }
        } elseif ($order->payment_method === 'telegram') {
            // Send Telegram notification if Telegram payment was selected
            $isTelegramEnabled = getSetting('is_telegram_enabled', false, $userId, $storeId);
            if ($isTelegramEnabled) {
                $botToken = getSetting('telegram_bot_token', null, $userId, $storeId);
                $chatId = getSetting('telegram_chat_id', null, $userId, $storeId);
                
                if ($botToken && $chatId) {
                    try {
                        $telegramService = new \App\Services\TelegramService();
                        $telegramService->sendOrderConfirmation($order, $botToken, $chatId);
                    } catch (Exception $e) {
                        \Log::error('Telegram notification failed: ' . $e->getMessage());
                    }
                }
            }
        }
    }
}