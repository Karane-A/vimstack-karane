<?php

namespace Database\Seeders;

use App\Models\ExpressCheckout;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ExpressCheckoutSeeder extends Seeder
{
    public function run(): void
    {
        // Check if express checkout data already exists
        if (ExpressCheckout::exists()) {
            return; // Skip if data exists
        }
        
        $stores = Store::all();
        
        if ($stores->isEmpty()) {
            $this->command->error('No stores found. Please run StoreSeeder first.');
            return;
        }

        foreach ($stores as $store) {
            $this->createExpressCheckoutsForStore($store);
        }

    }

    private function createExpressCheckoutsForStore(Store $store): void
    {
        $checkouts = $this->getCheckoutConfigsForTheme($store->theme, $store->id);
        
        foreach ($checkouts as $index => $checkout) {
            // Add varied timestamps
            $createdDaysAgo = rand(30, 90) + ($index * 2);
            $createdAt = Carbon::now()->subDays($createdDaysAgo);
            $updatedDaysAgo = rand(1, $createdDaysAgo - 1);
            $updatedAt = Carbon::now()->subDays($updatedDaysAgo);
            
            $checkout['created_at'] = $createdAt;
            $checkout['updated_at'] = $updatedAt;
            
            ExpressCheckout::firstOrCreate(
                ['name' => $checkout['name'], 'store_id' => $checkout['store_id']],
                $checkout
            );
        }
    }

    private function getCheckoutConfigsForTheme(string $theme, int $storeId): array
    {
        $baseConfigs = [
            'home-accessories' => [
                [
                    'name' => 'Quick Buy Home Decor',
                    'type' => 'buy_now',
                    'description' => 'Skip the cart and buy home decor items instantly',
                    'button_text' => 'Buy Now',
                    'button_color' => '#8B4513',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 156,
                    'revenue' => 12450.75
                ],
                [
                    'name' => 'Express Cart Furniture',
                    'type' => 'express_cart',
                    'description' => 'Fast checkout for furniture purchases',
                    'button_text' => 'Express Checkout',
                    'button_color' => '#D2691E',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 89,
                    'revenue' => 8920.50
                ],
                [
                    'name' => 'Guest Home Shopping',
                    'type' => 'guest_checkout',
                    'description' => 'No registration needed for home accessories',
                    'button_text' => 'Shop as Guest',
                    'button_color' => '#CD853F',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 134,
                    'revenue' => 9870.25
                ],
                [
                    'name' => 'Mobile Home Decor',
                    'type' => 'mobile_optimized',
                    'description' => 'Mobile-first checkout for home items',
                    'button_text' => 'Mobile Buy',
                    'button_color' => '#DEB887',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 198,
                    'revenue' => 11250.80
                ],
                [
                    'name' => 'One-Click Accessories',
                    'type' => 'buy_now',
                    'description' => 'Single click purchase for accessories',
                    'button_text' => 'One Click Buy',
                    'button_color' => '#F4A460',
                    'payment_methods' => ['credit_card', 'apple_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 167,
                    'revenue' => 7890.45
                ],
                [
                    'name' => 'Bulk Home Items',
                    'type' => 'express_cart',
                    'description' => 'Express checkout for multiple home items',
                    'button_text' => 'Bulk Purchase',
                    'button_color' => '#D2B48C',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 112,
                    'revenue' => 15670.90
                ],
                [
                    'name' => 'Premium Home Express',
                    'type' => 'buy_now',
                    'description' => 'VIP checkout for premium home products',
                    'button_text' => 'VIP Purchase',
                    'button_color' => '#BC8F8F',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 78,
                    'revenue' => 18920.65
                ]
            ],
            'fashion' => [
                [
                    'name' => 'Fashion Flash Buy',
                    'type' => 'buy_now',
                    'description' => 'Instant purchase for trending fashion items',
                    'button_text' => 'Shop Now',
                    'button_color' => '#FF1493',
                    'payment_methods' => ['credit_card', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 234,
                    'revenue' => 15680.25
                ],
                [
                    'name' => 'Mobile Fashion Checkout',
                    'type' => 'mobile_optimized',
                    'description' => 'Optimized checkout for mobile fashion shopping',
                    'button_text' => 'Buy Instantly',
                    'button_color' => '#FF69B4',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'google_pay',
                    'conversions' => 178,
                    'revenue' => 9890.75
                ],
                [
                    'name' => 'Style Express Cart',
                    'type' => 'express_cart',
                    'description' => 'Quick cart for fashion collections',
                    'button_text' => 'Add to Style',
                    'button_color' => '#C71585',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 189,
                    'revenue' => 12340.80
                ],
                [
                    'name' => 'Guest Fashion Buy',
                    'type' => 'guest_checkout',
                    'description' => 'No account needed for fashion purchases',
                    'button_text' => 'Guest Style',
                    'button_color' => '#DB7093',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 156,
                    'revenue' => 8750.45
                ],
                [
                    'name' => 'Trendy Quick Buy',
                    'type' => 'buy_now',
                    'description' => 'Fast purchase for trending items',
                    'button_text' => 'Get Trendy',
                    'button_color' => '#FF20B2',
                    'payment_methods' => ['apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 267,
                    'revenue' => 11890.60
                ],
                [
                    'name' => 'Designer Express',
                    'type' => 'buy_now',
                    'description' => 'Premium checkout for designer fashion',
                    'button_text' => 'Designer Buy',
                    'button_color' => '#E6007E',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 98,
                    'revenue' => 22450.90
                ],
                [
                    'name' => 'Fashion Bundle Cart',
                    'type' => 'express_cart',
                    'description' => 'Bundle checkout for complete outfits',
                    'button_text' => 'Bundle Buy',
                    'button_color' => '#FF1493',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 134,
                    'revenue' => 16780.25
                ]
            ],
            'electronics' => [
                [
                    'name' => 'Tech Express Buy',
                    'type' => 'buy_now',
                    'description' => 'Quick purchase for electronics and gadgets',
                    'button_text' => 'Buy Now',
                    'button_color' => '#0066CC',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 312,
                    'revenue' => 45670.80
                ],
                [
                    'name' => 'Guest Tech Checkout',
                    'type' => 'guest_checkout',
                    'description' => 'No account needed for tech purchases',
                    'button_text' => 'Quick Order',
                    'button_color' => '#4169E1',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 145,
                    'revenue' => 18750.60
                ],
                [
                    'name' => 'Mobile Tech Cart',
                    'type' => 'mobile_optimized',
                    'description' => 'Mobile-first tech shopping experience',
                    'button_text' => 'Mobile Tech',
                    'button_color' => '#1E90FF',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'google_pay',
                    'conversions' => 289,
                    'revenue' => 32450.75
                ],
                [
                    'name' => 'Gadget Express Cart',
                    'type' => 'express_cart',
                    'description' => 'Fast cart for multiple gadgets',
                    'button_text' => 'Add Gadgets',
                    'button_color' => '#00BFFF',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 198,
                    'revenue' => 28920.40
                ],
                [
                    'name' => 'Gaming Quick Buy',
                    'type' => 'buy_now',
                    'description' => 'Instant purchase for gaming equipment',
                    'button_text' => 'Game On',
                    'button_color' => '#0080FF',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 234,
                    'revenue' => 38750.90
                ],
                [
                    'name' => 'Smart Device Express',
                    'type' => 'buy_now',
                    'description' => 'Quick checkout for smart devices',
                    'button_text' => 'Get Smart',
                    'button_color' => '#4682B4',
                    'payment_methods' => ['credit_card', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 167,
                    'revenue' => 25680.65
                ],
                [
                    'name' => 'Tech Bundle Cart',
                    'type' => 'express_cart',
                    'description' => 'Bundle deals for tech accessories',
                    'button_text' => 'Tech Bundle',
                    'button_color' => '#5F9EA0',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 123,
                    'revenue' => 19870.30
                ]
            ],
            'beauty-cosmetics' => [
                [
                    'name' => 'Beauty Express',
                    'type' => 'buy_now',
                    'description' => 'Instant checkout for beauty products',
                    'button_text' => 'Get Beautiful',
                    'button_color' => '#FF6B9D',
                    'payment_methods' => ['credit_card', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 198,
                    'revenue' => 11250.45
                ],
                [
                    'name' => 'Cosmetics Quick Buy',
                    'type' => 'express_cart',
                    'description' => 'Fast checkout for cosmetics collection',
                    'button_text' => 'Add & Buy',
                    'button_color' => '#E91E63',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 167,
                    'revenue' => 8940.30
                ],
                [
                    'name' => 'Skincare Mobile Buy',
                    'type' => 'mobile_optimized',
                    'description' => 'Mobile skincare shopping experience',
                    'button_text' => 'Skincare Now',
                    'button_color' => '#FF1493',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 234,
                    'revenue' => 13450.80
                ],
                [
                    'name' => 'Makeup Guest Checkout',
                    'type' => 'guest_checkout',
                    'description' => 'No registration for makeup purchases',
                    'button_text' => 'Guest Makeup',
                    'button_color' => '#DC143C',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 189,
                    'revenue' => 9870.25
                ],
                [
                    'name' => 'Premium Beauty Express',
                    'type' => 'buy_now',
                    'description' => 'Luxury beauty products quick buy',
                    'button_text' => 'Luxury Buy',
                    'button_color' => '#B22222',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 112,
                    'revenue' => 18920.65
                ],
                [
                    'name' => 'Beauty Bundle Cart',
                    'type' => 'express_cart',
                    'description' => 'Complete beauty routine bundles',
                    'button_text' => 'Beauty Bundle',
                    'button_color' => '#FF69B4',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 145,
                    'revenue' => 12340.90
                ],
                [
                    'name' => 'Organic Beauty Express',
                    'type' => 'buy_now',
                    'description' => 'Natural and organic beauty products',
                    'button_text' => 'Go Natural',
                    'button_color' => '#FF6347',
                    'payment_methods' => ['credit_card', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'google_pay',
                    'conversions' => 178,
                    'revenue' => 10750.45
                ]
            ],
            'jewelry' => [
                [
                    'name' => 'Luxury Jewelry Express',
                    'type' => 'buy_now',
                    'description' => 'Premium checkout for jewelry purchases',
                    'button_text' => 'Purchase Now',
                    'button_color' => '#FFD700',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 87,
                    'revenue' => 25670.90
                ],
                [
                    'name' => 'Elegant Express Cart',
                    'type' => 'express_cart',
                    'description' => 'Sophisticated checkout experience',
                    'button_text' => 'Secure Purchase',
                    'button_color' => '#DAA520',
                    'payment_methods' => ['credit_card', 'apple_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 56,
                    'revenue' => 18920.75
                ],
                [
                    'name' => 'Diamond Quick Buy',
                    'type' => 'buy_now',
                    'description' => 'Instant purchase for diamond jewelry',
                    'button_text' => 'Buy Diamond',
                    'button_color' => '#B8860B',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 45,
                    'revenue' => 34560.80
                ],
                [
                    'name' => 'Gold Express Checkout',
                    'type' => 'guest_checkout',
                    'description' => 'Guest checkout for gold jewelry',
                    'button_text' => 'Gold Purchase',
                    'button_color' => '#CD853F',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 67,
                    'revenue' => 28920.45
                ],
                [
                    'name' => 'Wedding Ring Express',
                    'type' => 'buy_now',
                    'description' => 'Special checkout for wedding jewelry',
                    'button_text' => 'Wedding Buy',
                    'button_color' => '#F0E68C',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 34,
                    'revenue' => 42750.90
                ],
                [
                    'name' => 'Custom Jewelry Cart',
                    'type' => 'express_cart',
                    'description' => 'Custom jewelry design checkout',
                    'button_text' => 'Custom Order',
                    'button_color' => '#BDB76B',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 23,
                    'revenue' => 38920.65
                ],
                [
                    'name' => 'Vintage Jewelry Express',
                    'type' => 'buy_now',
                    'description' => 'Antique and vintage jewelry purchases',
                    'button_text' => 'Vintage Buy',
                    'button_color' => '#D4AF37',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 78,
                    'revenue' => 22450.30
                ]
            ],
            'watches' => [
                [
                    'name' => 'Timepiece Express',
                    'type' => 'buy_now',
                    'description' => 'Quick purchase for luxury watches',
                    'button_text' => 'Buy Watch',
                    'button_color' => '#2F4F4F',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 73,
                    'revenue' => 34560.25
                ],
                [
                    'name' => 'Premium Watch Checkout',
                    'type' => 'guest_checkout',
                    'description' => 'Exclusive checkout for watch collectors',
                    'button_text' => 'Order Now',
                    'button_color' => '#708090',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 45,
                    'revenue' => 22890.50
                ],
                [
                    'name' => 'Swiss Watch Express',
                    'type' => 'buy_now',
                    'description' => 'Premium Swiss timepieces checkout',
                    'button_text' => 'Swiss Buy',
                    'button_color' => '#4682B4',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 56,
                    'revenue' => 45670.80
                ],
                [
                    'name' => 'Smart Watch Cart',
                    'type' => 'mobile_optimized',
                    'description' => 'Mobile checkout for smart watches',
                    'button_text' => 'Smart Buy',
                    'button_color' => '#5F9EA0',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 189,
                    'revenue' => 18920.45
                ],
                [
                    'name' => 'Vintage Watch Express',
                    'type' => 'express_cart',
                    'description' => 'Collector vintage watches checkout',
                    'button_text' => 'Vintage Order',
                    'button_color' => '#778899',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 34,
                    'revenue' => 38750.90
                ],
                [
                    'name' => 'Sports Watch Quick Buy',
                    'type' => 'buy_now',
                    'description' => 'Athletic and sports watches',
                    'button_text' => 'Sports Buy',
                    'button_color' => '#696969',
                    'payment_methods' => ['credit_card', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'google_pay',
                    'conversions' => 167,
                    'revenue' => 12340.65
                ],
                [
                    'name' => 'Luxury Collection Cart',
                    'type' => 'express_cart',
                    'description' => 'High-end luxury watch collections',
                    'button_text' => 'Luxury Cart',
                    'button_color' => '#2F4F4F',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 23,
                    'revenue' => 56780.25
                ]
            ],
            'furniture-interior' => [
                [
                    'name' => 'Furniture Fast Buy',
                    'type' => 'buy_now',
                    'description' => 'Quick checkout for furniture items',
                    'button_text' => 'Buy Furniture',
                    'button_color' => '#8B4513',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 124,
                    'revenue' => 28750.80
                ],
                [
                    'name' => 'Interior Express Cart',
                    'type' => 'express_cart',
                    'description' => 'Streamlined checkout for interior design',
                    'button_text' => 'Quick Purchase',
                    'button_color' => '#A0522D',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 98,
                    'revenue' => 15670.45
                ],
                [
                    'name' => 'Modern Furniture Express',
                    'type' => 'buy_now',
                    'description' => 'Contemporary furniture quick purchase',
                    'button_text' => 'Modern Buy',
                    'button_color' => '#D2691E',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 156,
                    'revenue' => 32450.90
                ],
                [
                    'name' => 'Guest Furniture Checkout',
                    'type' => 'guest_checkout',
                    'description' => 'No account needed for furniture',
                    'button_text' => 'Guest Buy',
                    'button_color' => '#CD853F',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 89,
                    'revenue' => 22340.65
                ],
                [
                    'name' => 'Office Furniture Cart',
                    'type' => 'express_cart',
                    'description' => 'Business furniture bulk orders',
                    'button_text' => 'Office Cart',
                    'button_color' => '#DEB887',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 67,
                    'revenue' => 38920.75
                ],
                [
                    'name' => 'Custom Furniture Express',
                    'type' => 'buy_now',
                    'description' => 'Made-to-order furniture checkout',
                    'button_text' => 'Custom Order',
                    'button_color' => '#F4A460',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 45,
                    'revenue' => 45670.30
                ],
                [
                    'name' => 'Luxury Interior Cart',
                    'type' => 'express_cart',
                    'description' => 'Premium interior design packages',
                    'button_text' => 'Luxury Design',
                    'button_color' => '#BC8F8F',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 34,
                    'revenue' => 52890.80
                ]
            ],
            'cars-automotive' => [
                [
                    'name' => 'Auto Parts Express',
                    'type' => 'buy_now',
                    'description' => 'Fast checkout for automotive parts',
                    'button_text' => 'Order Parts',
                    'button_color' => '#FF4500',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 189,
                    'revenue' => 22340.60
                ],
                [
                    'name' => 'Car Service Booking',
                    'type' => 'guest_checkout',
                    'description' => 'Quick booking for car services',
                    'button_text' => 'Book Service',
                    'button_color' => '#DC143C',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 156,
                    'revenue' => 18920.30
                ],
                [
                    'name' => 'Car Accessories Cart',
                    'type' => 'express_cart',
                    'description' => 'Multiple car accessories checkout',
                    'button_text' => 'Add Accessories',
                    'button_color' => '#FF6347',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 234,
                    'revenue' => 15670.80
                ],
                [
                    'name' => 'Mobile Auto Buy',
                    'type' => 'mobile_optimized',
                    'description' => 'Mobile-first automotive shopping',
                    'button_text' => 'Mobile Auto',
                    'button_color' => '#FF7F50',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'google_pay',
                    'conversions' => 198,
                    'revenue' => 12450.45
                ],
                [
                    'name' => 'Performance Parts Express',
                    'type' => 'buy_now',
                    'description' => 'High-performance auto parts',
                    'button_text' => 'Performance Buy',
                    'button_color' => '#B22222',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 123,
                    'revenue' => 28920.90
                ],
                [
                    'name' => 'Car Maintenance Express',
                    'type' => 'guest_checkout',
                    'description' => 'Quick maintenance service booking',
                    'button_text' => 'Book Maintenance',
                    'button_color' => '#CD5C5C',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 167,
                    'revenue' => 16780.65
                ],
                [
                    'name' => 'Luxury Car Parts',
                    'type' => 'buy_now',
                    'description' => 'Premium luxury vehicle parts',
                    'button_text' => 'Luxury Parts',
                    'button_color' => '#8B0000',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 78,
                    'revenue' => 38750.25
                ]
            ],
            'baby-kids' => [
                [
                    'name' => 'Kids Toy Express',
                    'type' => 'buy_now',
                    'description' => 'Quick purchase for children toys',
                    'button_text' => 'Buy Toy',
                    'button_color' => '#FF69B4',
                    'payment_methods' => ['credit_card', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 267,
                    'revenue' => 13450.75
                ],
                [
                    'name' => 'Baby Products Fast Buy',
                    'type' => 'mobile_optimized',
                    'description' => 'Mobile-friendly checkout for baby items',
                    'button_text' => 'Quick Buy',
                    'button_color' => '#FFB6C1',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'google_pay',
                    'conversions' => 203,
                    'revenue' => 9870.25
                ],
                [
                    'name' => 'Educational Toys Cart',
                    'type' => 'express_cart',
                    'description' => 'Learning toys and games bundle',
                    'button_text' => 'Learn & Play',
                    'button_color' => '#DA70D6',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 189,
                    'revenue' => 11250.80
                ],
                [
                    'name' => 'Baby Care Express',
                    'type' => 'guest_checkout',
                    'description' => 'Essential baby care products',
                    'button_text' => 'Baby Care',
                    'button_color' => '#F0E68C',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 234,
                    'revenue' => 8920.45
                ],
                [
                    'name' => 'Kids Clothing Express',
                    'type' => 'buy_now',
                    'description' => 'Children fashion and clothing',
                    'button_text' => 'Kids Fashion',
                    'button_color' => '#FFB6C1',
                    'payment_methods' => ['credit_card', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 156,
                    'revenue' => 7890.60
                ],
                [
                    'name' => 'Newborn Essentials Cart',
                    'type' => 'express_cart',
                    'description' => 'Complete newborn starter kit',
                    'button_text' => 'Newborn Kit',
                    'button_color' => '#DDA0DD',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 98,
                    'revenue' => 15670.90
                ],
                [
                    'name' => 'Teen Products Express',
                    'type' => 'mobile_optimized',
                    'description' => 'Teenager-focused mobile shopping',
                    'button_text' => 'Teen Shop',
                    'button_color' => '#FF1493',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'google_pay',
                    'conversions' => 178,
                    'revenue' => 12340.25
                ]
            ],
            'perfume-fragrances' => [
                [
                    'name' => 'Fragrance Express',
                    'type' => 'buy_now',
                    'description' => 'Instant purchase for luxury fragrances',
                    'button_text' => 'Buy Fragrance',
                    'button_color' => '#9370DB',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 145,
                    'revenue' => 16780.90
                ],
                [
                    'name' => 'Perfume Quick Cart',
                    'type' => 'express_cart',
                    'description' => 'Elegant checkout for perfume collection',
                    'button_text' => 'Add to Cart',
                    'button_color' => '#BA55D3',
                    'payment_methods' => ['credit_card', 'apple_pay', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 112,
                    'revenue' => 12340.65
                ],
                [
                    'name' => 'Designer Fragrance Express',
                    'type' => 'buy_now',
                    'description' => 'Premium designer perfumes checkout',
                    'button_text' => 'Designer Buy',
                    'button_color' => '#8A2BE2',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 89,
                    'revenue' => 22450.80
                ],
                [
                    'name' => 'Unisex Fragrance Cart',
                    'type' => 'guest_checkout',
                    'description' => 'Gender-neutral fragrance shopping',
                    'button_text' => 'Unisex Buy',
                    'button_color' => '#9932CC',
                    'payment_methods' => ['credit_card', 'paypal'],
                    'default_payment_method' => 'paypal',
                    'conversions' => 167,
                    'revenue' => 13450.45
                ],
                [
                    'name' => 'Luxury Perfume Express',
                    'type' => 'buy_now',
                    'description' => 'High-end luxury perfume collection',
                    'button_text' => 'Luxury Scent',
                    'button_color' => '#6A5ACD',
                    'payment_methods' => ['credit_card', 'apple_pay', 'paypal', 'google_pay'],
                    'default_payment_method' => 'apple_pay',
                    'conversions' => 56,
                    'revenue' => 28920.90
                ],
                [
                    'name' => 'Fragrance Gift Cart',
                    'type' => 'express_cart',
                    'description' => 'Gift sets and fragrance bundles',
                    'button_text' => 'Gift Bundle',
                    'button_color' => '#DA70D6',
                    'payment_methods' => ['credit_card', 'paypal', 'apple_pay'],
                    'default_payment_method' => 'credit_card',
                    'conversions' => 134,
                    'revenue' => 18750.65
                ],
                [
                    'name' => 'Mobile Fragrance Buy',
                    'type' => 'mobile_optimized',
                    'description' => 'Mobile-optimized perfume shopping',
                    'button_text' => 'Mobile Scent',
                    'button_color' => '#DDA0DD',
                    'payment_methods' => ['apple_pay', 'google_pay', 'samsung_pay'],
                    'default_payment_method' => 'google_pay',
                    'conversions' => 198,
                    'revenue' => 14670.25
                ]
            ]
        ];

        $configs = $baseConfigs[$theme] ?? $baseConfigs['home-accessories'];
        
        return array_map(function ($config) use ($storeId) {
            return array_merge($config, [
                'store_id' => $storeId,
                'is_active' => true,
                'skip_cart' => $config['type'] === 'buy_now',
                'auto_fill_customer_data' => true,
                'guest_checkout_allowed' => $config['type'] === 'guest_checkout',
                'mobile_optimized' => $config['type'] === 'mobile_optimized',
                'save_payment_methods' => true,
                'success_redirect_url' => '/thank-you',
                'cancel_redirect_url' => '/cart'
            ]);
        }, $configs);
    }
}