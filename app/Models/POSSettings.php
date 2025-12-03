<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class POSSettings extends Model
{
    protected $table = 'pos_settings';
    
    protected $fillable = [
        'store_id',
        'currency',
        'tax_rate',
        'default_discount',
        'enable_guest_checkout',
        'low_stock_alerts',
        'auto_sync_online_orders',
        'receipt_header',
        'receipt_footer',
        'show_logo_on_receipt',
        'show_tax_details',
        'show_cashier_name',
        'email_receipt',
        'receipt_printer',
        'barcode_scanner',
        'cash_drawer',
        'card_reader',
        'auto_open_cash_drawer',
        'auto_print_receipt'
    ];
    
    protected $casts = [
        'tax_rate' => 'float',
        'default_discount' => 'float',
        'enable_guest_checkout' => 'boolean',
        'low_stock_alerts' => 'boolean',
        'auto_sync_online_orders' => 'boolean',
        'show_logo_on_receipt' => 'boolean',
        'show_tax_details' => 'boolean',
        'show_cashier_name' => 'boolean',
        'email_receipt' => 'boolean',
        'auto_open_cash_drawer' => 'boolean',
        'auto_print_receipt' => 'boolean',
    ];
    
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    
    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency', 'code');
    }
    
    public static function getSettings($storeId)
    {
        if (!$storeId) {
            throw new \Exception('Store ID is required to get POS settings');
        }
        
        $settings = self::where('store_id', $storeId)->first();
        
        if (!$settings) {
            // Create default settings if not exists
            $settings = self::create([
                'store_id' => $storeId,
                'currency' => 'USD',
                'tax_rate' => 10.00,
                'default_discount' => 0,
                'enable_guest_checkout' => true,
                'low_stock_alerts' => true,
                'auto_sync_online_orders' => false,
                'receipt_header' => 'Thank you for shopping with us!',
                'receipt_footer' => 'All sales are final. Returns accepted within 30 days with receipt.',
                'show_logo_on_receipt' => true,
                'show_tax_details' => true,
                'show_cashier_name' => true,
                'email_receipt' => true,
                'receipt_printer' => 'thermal',
                'barcode_scanner' => 'usb',
                'cash_drawer' => 'manual',
                'card_reader' => 'integrated',
                'auto_open_cash_drawer' => true,
                'auto_print_receipt' => true
            ]);
        }
        
        return $settings;
    }
}