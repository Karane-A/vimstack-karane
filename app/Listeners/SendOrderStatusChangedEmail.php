<?php

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Services\EmailTemplateService;
use Illuminate\Support\Facades\Cache;
use Exception;

class SendOrderStatusChangedEmail
{
    public function __construct(private EmailTemplateService $emailService)
    {
    }

    public function handle(OrderStatusChanged $event): void
    {
        $order = $event->order;
        
        // Prevent duplicate processing using cache
        $cacheKey = 'order_status_email_' . $order->id . '_' . $order->status;
        if (\Cache::has($cacheKey)) {
            return;
        }
        \Cache::put($cacheKey, true, 60); // Cache for 1 minute
        
        $store = $order->store;
        
        if (!$store) {
            return;
        }

        // Get customer language from store settings or default to 'en'
        $customerLanguage = getSetting('defaultLanguage', $store->user_id, $store->id, 'en');
        
        // Ensure language is a valid string, not a number
        if (is_numeric($customerLanguage) || !is_string($customerLanguage)) {
            $customerLanguage = 'en';
        }
        
        // Prepare email variables
        $variables = [
            '{app_name}' => $store->name,
            '{order_name}' => $order->customer_first_name . ' ' . $order->customer_last_name,
            '{order_id}' => $order->order_number,
            '{order_date}' => $order->created_at->format('Y-m-d H:i:s'),
            '{order_status}' => ucfirst($order->status),
            '{app_url}' => config('app.url'),
            '{store_url}' => route('store.home', ['storeSlug' => $store->slug]),
            '{order_url}' => route('store.order-detail', ['storeSlug' => $store->slug, 'orderNumber' => $order->order_number]),
        ];

        try {
            // Send status change email to customer
            $this->emailService->sendTemplateEmailWithLanguage(
                templateName: 'Status Change',
                variables: $variables,
                toEmail: $order->customer_email,
                toName: $order->customer_first_name . ' ' . $order->customer_last_name,
                language: $customerLanguage
            );

        } catch (Exception $e) {
            \Log::error('Failed to send order status changed email: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'old_status' => $event->oldStatus,
                'new_status' => $order->status
            ]);
        }
    }
}