<?php

namespace Database\Seeders;

use App\Models\ProductReview;
use App\Models\Store;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Check if review data already exists
        if (ProductReview::exists()) {
            return; // Skip if data exists
        }
        
        $stores = Store::all();


        foreach ($stores as $store) {
            $products = Product::where('store_id', $store->id)->get();
            $customers = Customer::where('store_id', $store->id)->get();

            if ($products->isEmpty() || $customers->isEmpty()) {
                continue;
            }

            $this->command->info("Processing store: {$store->name} (ID: {$store->id})");

            // Create 3-8 reviews per product for better coverage
            $reviewCounter = 0;
            foreach ($products as $product) {
                $reviewCount = min(rand(3, 8), $customers->count());
                $selectedCustomers = $customers->shuffle()->take($reviewCount);
                
                foreach ($selectedCustomers as $customer) {
                    $rating = $this->getWeightedRating();
                    $daysAgo = ($store->id * 5) + $reviewCounter + rand(1, 30);
                    $createdAt = Carbon::now()->subDays($daysAgo);
                    $reviewCounter++;
                    
                    ProductReview::firstOrCreate(
                        ['product_id' => $product->id, 'customer_id' => $customer->id],
                        [
                        'product_id' => $product->id,
                        'customer_id' => $customer->id,
                        'store_id' => $store->id,
                        'rating' => $rating,
                        'title' => $this->getReviewTitle($rating, $product->name),
                        'content' => $this->getReviewContent($rating, $product->name, $customer->first_name),
                        'is_approved' => rand(0, 10) > 1, // 90% approved
                        'store_response' => rand(0, 10) > 6 ? $this->getStoreResponse($customer->first_name) : null,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                        ]
                    );
                }
            }
        }

        $reviewCount = ProductReview::count();
    }

    private function getWeightedRating(): int
    {
        // Weight towards higher ratings (more realistic for e-commerce)
        $weights = [1 => 3, 2 => 7, 3 => 15, 4 => 35, 5 => 40];
        $rand = rand(1, 100);
        $cumulative = 0;
        
        foreach ($weights as $rating => $weight) {
            $cumulative += $weight;
            if ($rand <= $cumulative) { 
                return $rating;
            }
        }
        
        return 5;
    }

    private function getReviewTitle($rating, $productName = ''): string
    {
        $titles = [
            1 => [
                'Very disappointed with this purchase',
                'Poor quality, not worth the money',
                'Expected much better',
                'Waste of money',
                'Terrible experience'
            ],
            2 => [
                'Below my expectations',
                'Could definitely be better',
                'Not impressed at all',
                'Mediocre quality',
                'Needs improvement'
            ],
            3 => [
                'Average product, nothing special',
                'Okay for the price',
                'Mixed feelings about this',
                'It\'s alright, I guess',
                'Decent but not great'
            ],
            4 => [
                'Good quality product',
                'Happy with my purchase',
                'Would recommend to others',
                'Great value for money',
                'Satisfied with the quality'
            ],
            5 => [
                'Absolutely excellent!',
                'Love it! Exceeded expectations',
                'Perfect product, highly recommend',
                'Outstanding quality and service',
                'Amazing! Will buy again'
            ]
        ];

        return $titles[$rating][array_rand($titles[$rating])];
    }

    private function getReviewContent($rating, $productName = '', $customerName = ''): string
    {
        $content = [
            1 => [
                'I am really disappointed with this purchase. The quality is much lower than expected and it doesn\'t work as advertised. The material feels cheap and flimsy. I would not recommend this to anyone.',
                'This product is a complete waste of money. Poor build quality, doesn\'t match the description, and customer service was unhelpful when I tried to return it.',
                'Very poor experience. The product arrived damaged and when I contacted support, they were not responsive. The quality is terrible for the price paid.',
                'I regret buying this. The product feels cheap, doesn\'t work properly, and is nothing like what was shown in the pictures. Very disappointed.',
                'Terrible quality control. The product had multiple defects and doesn\'t function as expected. I expected much better for this price range.'
            ],
            2 => [
                'The product is okay but has several issues. Build quality could be better and it doesn\'t quite meet the expectations set by the description. Might work for some people but not for me.',
                'There are some problems with this product. It works but not as smoothly as I hoped. The design could be improved and the materials feel a bit cheap.',
                'Mixed experience. Some features work well but others are disappointing. For the price, I expected better quality and performance.',
                'It\'s an average product with room for improvement. Works as intended but the quality could be better. Not sure if I would buy again.',
                'The product does what it\'s supposed to do but with some limitations. Build quality is mediocre and I\'ve had a few minor issues with it.'
            ],
            3 => [
                'This is an okay product. Nothing spectacular but it gets the job done. The quality is average for the price range. It\'s neither great nor terrible.',
                'Average purchase. The product works as described but doesn\'t exceed expectations. It\'s fine for basic use but nothing more.',
                'Decent product overall. Does what it promises but doesn\'t wow me. The quality is acceptable and it serves its purpose adequately.',
                'It\'s an alright product. Works fine for everyday use. The build quality is decent but not exceptional. Good enough for the price.',
                'Fair product that meets basic expectations. Nothing to complain about but nothing to rave about either. It\'s just okay.'
            ],
            4 => [
                'Really happy with this purchase! The quality is good and it works exactly as described. Great value for money and I would definitely recommend it to others.',
                'Excellent product with good build quality. It arrived quickly and works perfectly. Very satisfied with the performance and would buy again.',
                'Great quality and exactly what I was looking for. The product is well-made and functions perfectly. Good customer service too.',
                'Very pleased with this purchase. The product exceeded my expectations in terms of quality and performance. Highly recommended!',
                'Fantastic product! Works great, good quality materials, and excellent value. The delivery was fast and packaging was secure.'
            ],
            5 => [
                'Absolutely amazing product! The quality is outstanding and it works perfectly. Exceeded all my expectations. Fast delivery and excellent packaging. Will definitely buy from this store again!',
                'Perfect in every way! The build quality is exceptional, works flawlessly, and looks exactly like the pictures. Outstanding customer service and super fast shipping. Highly recommend!',
                'This is exactly what I was looking for and more! Incredible quality, perfect functionality, and amazing value for money. The store\'s service is top-notch. 5 stars!',
                'Outstanding product and service! The quality is superb, delivery was lightning fast, and it works better than expected. This store has earned a loyal customer!',
                'Wow! This product is incredible. Premium quality, perfect performance, and excellent customer service. I\'m so impressed that I\'ll be ordering more items from this store.'
            ]
        ];

        return $content[$rating][array_rand($content[$rating])];
    }

    private function getStoreResponse($customerName = ''): string
    {
        $name = $customerName ? $customerName : 'valued customer';
        
        $responses = [
            "Thank you {$name} for taking the time to review our product! We truly appreciate your feedback and are glad you had a positive experience.",
            "Hi {$name}, we're thrilled to hear you're happy with your purchase! Thank you for choosing our store and for sharing your experience.",
            "Dear {$name}, thank you for your honest feedback. We're always working to improve our products and services based on customer input like yours.",
            "Hello {$name}, we appreciate your detailed review! Your feedback helps us maintain our quality standards and serve our customers better.",
            "Thank you {$name} for your review! We're committed to providing excellent products and service, and reviews like yours motivate us to keep improving.",
            "Hi {$name}, we're so grateful for your feedback! It's customers like you who help us grow and improve our offerings.",
            "Dear {$name}, thank you for sharing your experience! We value every customer's opinion and use it to enhance our products and services.",
            "Hello {$name}, your review means a lot to us! We're dedicated to customer satisfaction and appreciate you taking the time to share your thoughts."
        ];

        return $responses[array_rand($responses)];
    }
}