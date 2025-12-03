<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Services\EmailTemplateService;
use Illuminate\Support\Facades\Cache;
use Exception;

class SendOrderCreatedEmail
{
    public function __construct(private EmailTemplateService $emailService)
    {
    }

    public function handle(OrderCreated $event): void
    {
        $order = $event->order;
        
        // Prevent duplicate processing using cache
        $cacheKey = 'order_created_email_' . $order->id;
        if (\Cache::has($cacheKey)) {
            return;
        }
        \Cache::put($cacheKey, true, 300); // Cache for 5 minutes
        
        $store = $order->store;
        
        if (!$store) {
            return;
        }

        // Get customer language from store settings or default to 'en'
        $customerLanguage = getSetting('defaultLanguage', $store->user_id, $store->id, 'en');
        
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
            // Send email to customer
            $this->emailService->sendTemplateEmailWithLanguage(
                templateName: 'Order Created',
                variables: $variables,
                toEmail: $order->customer_email,
                toName: $order->customer_first_name . ' ' . $order->customer_last_name,
                language: $customerLanguage
            );

            // Send email to store owner
            $owner = $store->user;
            if ($owner && $owner->email) {
                $ownerVariables = array_merge($variables, [
                    '{owner_name}' => $owner->name,
                    '{owner_email}' => $owner->email,
                ]);

                $this->emailService->sendTemplateEmailWithLanguage(
                    templateName: 'Order Created For Owner',
                    variables: $ownerVariables,
                    toEmail: $owner->email,
                    toName: $owner->name,
                    language: $customerLanguage
                );
            }

        } catch (Exception $e) {
            \Log::error('Failed to send order created email: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'order_number' => $order->order_number
            ]);
        }
    }
}