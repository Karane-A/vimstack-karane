<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class TelegramService
{
    public function sendOrderConfirmation(Order $order, string $botToken, string $chatId): bool
    {
        $store = $order->store;
        if (!$store) return false;

        if (!$botToken || !$chatId) return false;

        $message = $this->buildMessage($order);
        
        try {
            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML'
            ]);

            if ($response->successful()) {
                Log::info('Telegram message sent successfully', [
                    'order_id' => $order->id,
                    'chat_id' => $chatId
                ]);
                return true;
            } else {
                Log::error('Failed to send Telegram message', [
                    'order_id' => $order->id,
                    'response' => $response->body()
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('Telegram API error', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    private function buildMessage(Order $order): string
    {
        $store = $order->store;
        $template = $this->getTemplate($store->user_id, $store->id);
        $itemTemplate = $this->getItemTemplate($store->user_id, $store->id);
        
        $items = '';
        foreach ($order->items as $item) {
            // Handle variants - could be array, JSON, or string
            $variants = $item->product_variants;
            if (is_array($variants) && !empty($variants)) {
                $variant = implode(', ', $variants);
            } elseif (is_string($variants) && $variants && $variants !== '[]' && $variants !== 'null') {
                $variant = $variants;
            } else {
                $variant = 'No Variants';
            }
            
            // Calculate item tax proportionally
            $itemTax = $order->tax_amount > 0 ? ($item->total_price / $order->subtotal) * $order->tax_amount : 0;
            
            $items .= str_replace(
                ['{product_name}', '{variant_name}', '{quantity}', '{item_total}', '{item_tax}', '{sku}'],
                [$item->product_name, $variant, $item->quantity, number_format($item->total_price, 2), number_format($itemTax, 2), $item->product_sku ?? 'N/A'],
                $itemTemplate
            ) . "\n";
        }

        // Get individual address components
        $shippingCity = $order->shipping_city ? (\App\Models\City::find($order->shipping_city)->name ?? $order->shipping_city) : '';
        $shippingCountry = $order->shipping_country ? (\App\Models\Country::find($order->shipping_country)->name ?? $order->shipping_country) : '';
        $shippingPostal = $order->shipping_postal_code ?? '';
        
        $variables = [
            '{store_name}' => $store->name,
            '{order_no}' => $order->order_number,
            '{customer_name}' => trim($order->customer_first_name . ' ' . $order->customer_last_name),
            '{shipping_address}' => $this->formatAddress($order, 'shipping'),
            '{shipping_city}' => $shippingCity,
            '{shipping_country}' => $shippingCountry,
            '{shipping_postalcode}' => $shippingPostal,
            '{item_variable}' => trim($items),
            '{qty_total}' => $order->items->sum('quantity'),
            '{sub_total}' => number_format($order->subtotal, 2),
            '{discount_amount}' => number_format($order->discount_amount, 2),
            '{shipping_amount}' => number_format($order->shipping_amount, 2),
            '{total_tax}' => number_format($order->tax_amount, 2),
            '{final_total}' => number_format($order->total_amount, 2),
            '{order_date}' => $order->created_at->format('d/m/Y H:i'),
            '{payment_method}' => ucfirst($order->payment_method),
        ];

        return str_replace(array_keys($variables), array_values($variables), $template);
    }

    private function formatAddress(Order $order, string $type): string
    {
        $address = $order->{$type . '_address'};
            
        // Get city name
        $cityId = $order->{$type . '_city'};
        $city = $cityId ? (\App\Models\City::find($cityId)->name ?? $cityId) : '';
        
        // Get state name  
        $stateId = $order->{$type . '_state'};
        $state = $stateId ? (\App\Models\State::find($stateId)->name ?? $stateId) : '';
        
        // Get country name
        $countryId = $order->{$type . '_country'};
        $country = $countryId ? (\App\Models\Country::find($countryId)->name ?? $countryId) : '';
        
        $postal = $order->{$type . '_postal_code'};
        
        $parts = array_filter([$address, $city, $state, $postal, $country]);
        return implode(', ', $parts);
    }

    private function getTemplate(int $userId, int $storeId): string
    {
        return getSetting('messaging_message_template', 
            "🛍️ <b>Order Confirmation</b>\n\nHi {customer_name}!\n\nYour order from <b>{store_name}</b> has been confirmed!\n\n📦 <b>Order Details:</b>\nOrder No: #{order_no}\nDate: {order_date}\n\n🛒 <b>Items ({qty_total} items):</b>\n{item_variable}\n\n💰 <b>Order Summary:</b>\nSubtotal: {sub_total}\nDiscount: {discount_amount}\nShipping: {shipping_amount}\nTax: {total_tax}\n<b>Total: {final_total}</b>\n\n🚚 <b>Shipping Address:</b>\n{shipping_address}\n{shipping_city}, {shipping_country} - {shipping_postalcode}\n\nThank you for shopping with us! 🙏",
            $userId, $storeId
        );
    }

    private function getItemTemplate(int $userId, int $storeId): string
    {
        return getSetting('messaging_item_template', 
            "• <b>{product_name}</b> ({variant_name})\n  Qty: {quantity} x Price: {item_total} (Tax: {item_tax})\n  SKU: {sku}",
            $userId, $storeId
        );
    }

    public function testConnection(string $botToken, string $chatId): array
    {
        try {
            $botResponse = Http::get("https://api.telegram.org/bot{$botToken}/getMe");
            
            if (!$botResponse->successful()) {
                return ['success' => false, 'message' => 'Invalid bot token'];
            }

            $testMessage = "🤖 Test message from your store!\n\nTelegram bot configuration is working correctly.";
            
            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $testMessage,
                'parse_mode' => 'HTML'
            ]);

            if ($response->successful()) {
                return ['success' => true, 'message' => 'Test message sent successfully!'];
            } else {
                $error = $response->json();
                return ['success' => false, 'message' => $error['description'] ?? 'Failed to send test message'];
            }
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Connection error: ' . $e->getMessage()];
        }
    }
}