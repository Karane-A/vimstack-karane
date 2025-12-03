<?php

namespace Database\Seeders;

use App\Models\CustomPage;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CustomPageSeeder extends Seeder
{
    public function run(): void
    {
        if (config('app.is_demo')) {
            $this->createDemoPages();
        } else {
            $this->createMainVersionPages();
        }
    }

    private function createDemoPages()
    {
        $stores = Store::all();

        foreach ($stores as $store) {
            $pages = $this->getCustomPages($store);
            
            foreach ($pages as $index => $pageData) {
                $slug = Str::slug($pageData['title']) . '-' . $store->id;
                
                // Skip if page already exists
                if (CustomPage::where('slug', $slug)->exists()) {
                    continue;
                }
                
                $daysAgo = ($store->id * 5) + $index + rand(5, 25);
                $createdAt = Carbon::now()->subDays($daysAgo);
                
                CustomPage::create([
                    'title' => $pageData['title'],
                    'slug' => $slug,
                    'content' => $pageData['content'],
                    'store_id' => $store->id,
                    'template' => 'default',
                    'status' => 'published',
                    'order' => $pageData['order'],
                    'show_in_navigation' => $pageData['show_in_navigation'],
                    'allow_comments' => false,
                    'views' => rand(10, 500),
                    'meta_title' => $pageData['title'],
                    'meta_description' => $pageData['meta_description'],
                    'index_in_search' => true,
                    'follow_links' => true,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }

    }

    private function createMainVersionPages()
    {
        // Get only the single store for company@example.com
        $store = Store::whereHas('user', function($query) {
            $query->where('email', 'company@example.com');
        })->first();

        if (!$store) {
            $this->command->error('No store found for company@example.com');
            return;
        }

        // Create only 3 essential pages for main version
        $allPages = $this->getCustomPages($store);
        $essentialPages = array_filter($allPages, function($page) {
            return in_array($page['title'], ['About Us', 'Contact Us', 'FAQ']);
        });
        
        foreach ($essentialPages as $index => $pageData) {
            $slug = Str::slug($pageData['title']) . '-' . $store->id;
            
            // Skip if page already exists
            if (CustomPage::where('slug', $slug)->exists()) {
                continue;
            }
            
            CustomPage::create([
                'title' => $pageData['title'],
                'slug' => $slug,
                'content' => $pageData['content'],
                'store_id' => $store->id,
                'template' => 'default',
                'status' => 'published',
                'order' => $pageData['order'],
                'show_in_navigation' => $pageData['show_in_navigation'],
                'allow_comments' => false,
                'views' => rand(10, 50),
                'meta_title' => $pageData['title'],
                'meta_description' => $pageData['meta_description'],
                'index_in_search' => true,
                'follow_links' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Created ' . count($essentialPages) . ' custom pages for main version.');
    }

    private function getCustomPages($store): array
    {
        return [
            [
                'title' => 'About Us',
                'content' => $this->getAboutUsContent($store),
                'order' => 1,
                'show_in_navigation' => true,
                'meta_description' => 'Learn more about our store, our story, values, and commitment to quality products and customer service.',
            ],
            [
                'title' => 'Privacy Policy',
                'content' => '<div class="privacy-policy">
                    <h1>Privacy Policy</h1>
                    <p class="last-updated"><em>Last updated: January 2025</em></p>
                    
                    <h2>Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
                    
                    <h3>Personal Information</h3>
                    <ul>
                        <li>Name and contact information</li>
                        <li>Billing and shipping addresses</li>
                        <li>Payment information</li>
                        <li>Order history and preferences</li>
                    </ul>
                    
                    <h2>How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Provide customer support</li>
                        <li>Send you updates about your orders</li>
                        <li>Improve our products and services</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                    
                    <h2>Information Sharing</h2>
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                    
                    <h2>Data Security</h2>
                    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    
                    <h2>Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at privacy@example.com</p>
                </div>',
                'order' => 2,
                'show_in_navigation' => false,
                'meta_description' => 'Our comprehensive privacy policy explaining how we collect, use, and protect your personal information.',
            ],
            [
                'title' => 'Terms of Service',
                'content' => '<div class="terms-of-service">
                    <h1>Terms of Service</h1>
                    <p class="last-updated"><em>Last updated: January 2025</em></p>
                    
                    <h2>Acceptance of Terms</h2>
                    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    
                    <h2>Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>
                    
                    <h2>Disclaimer</h2>
                    <p>The materials on our website are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    
                    <h2>Limitations</h2>
                    <p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>
                    
                    <h2>Accuracy of Materials</h2>
                    <p>The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current.</p>
                    
                    <h2>Links</h2>
                    <p>We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site.</p>
                    
                    <h2>Modifications</h2>
                    <p>We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
                </div>',
                'order' => 3,
                'show_in_navigation' => false,
                'meta_description' => 'Terms and conditions governing the use of our website and services.',
            ],
            [
                'title' => 'Contact Us',
                'content' => $this->getContactUsContent($store),
                'order' => 4,
                'show_in_navigation' => true,
                'meta_description' => 'Contact information, office location, and ways to reach our support team for assistance.',
            ],
            [
                'title' => 'FAQ',
                'content' => '<div class="faq-page">
                    <h1>Frequently Asked Questions</h1>
                    <p class="intro">Find answers to the most common questions about our products, services, and policies.</p>
                    
                    <div class="faq-section">
                        <h2>Orders & Shipping</h2>
                        
                        <div class="faq-item">
                            <h3>How long does shipping take?</h3>
                            <p>Standard shipping typically takes 3-7 business days. Express shipping options are available for faster delivery (1-3 business days).</p>
                        </div>
                        
                        <div class="faq-item">
                            <h3>Do you ship internationally?</h3>
                            <p>Yes, we ship to most countries worldwide. International shipping times vary by destination (7-21 business days).</p>
                        </div>
                        
                        <div class="faq-item">
                            <h3>Can I track my order?</h3>
                            <p>Absolutely! Once your order ships, you\'ll receive a tracking number via email to monitor your package\'s progress.</p>
                        </div>
                    </div>
                    
                    <div class="faq-section">
                        <h2>Returns & Exchanges</h2>
                        
                        <div class="faq-item">
                            <h3>What is your return policy?</h3>
                            <p>We offer a 30-day return policy for unused items in original packaging. Return shipping is free for defective items.</p>
                        </div>
                        
                        <div class="faq-item">
                            <h3>How do I initiate a return?</h3>
                            <p>Contact our customer service team or use our online return portal. We\'ll provide a prepaid return label and instructions.</p>
                        </div>
                    </div>
                    
                    <div class="faq-section">
                        <h2>Payment & Security</h2>
                        
                        <div class="faq-item">
                            <h3>What payment methods do you accept?</h3>
                            <p>We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers.</p>
                        </div>
                        
                        <div class="faq-item">
                            <h3>Is my payment information secure?</h3>
                            <p>Yes, we use industry-standard SSL encryption and comply with PCI DSS standards to protect your payment information.</p>
                        </div>
                    </div>
                    
                    <div class="faq-section">
                        <h2>Account & Technical</h2>
                        
                        <div class="faq-item">
                            <h3>Do I need an account to place an order?</h3>
                            <p>No, you can checkout as a guest. However, creating an account allows you to track orders and save preferences.</p>
                        </div>
                        
                        <div class="faq-item">
                            <h3>I forgot my password. How can I reset it?</h3>
                            <p>Click the "Forgot Password" link on the login page and follow the instructions sent to your email.</p>
                        </div>
                    </div>
                </div>',
                'order' => 5,
                'show_in_navigation' => true,
                'meta_description' => 'Frequently asked questions about orders, shipping, returns, payments, and account management.',
            ],
            [
                'title' => 'Shipping & Delivery',
                'content' => '<div class="shipping-delivery">
                    <h1>Shipping & Delivery Information</h1>
                    
                    <div class="shipping-options">
                        <h2>Shipping Options</h2>
                        
                        <div class="shipping-method">
                            <h3>Standard Shipping (Free)</h3>
                            <p><strong>Delivery Time:</strong> 5-7 business days</p>
                            <p><strong>Cost:</strong> Free on orders over $50</p>
                            <p>Perfect for non-urgent orders. Tracking included.</p>
                        </div>
                        
                        <div class="shipping-method">
                            <h3>Express Shipping</h3>
                            <p><strong>Delivery Time:</strong> 2-3 business days</p>
                            <p><strong>Cost:</strong> $9.99</p>
                            <p>Faster delivery with priority handling.</p>
                        </div>
                        
                        <div class="shipping-method">
                            <h3>Overnight Shipping</h3>
                            <p><strong>Delivery Time:</strong> Next business day</p>
                            <p><strong>Cost:</strong> $24.99</p>
                            <p>For urgent orders placed before 2 PM EST.</p>
                        </div>
                    </div>
                    
                    <div class="international-shipping">
                        <h2>International Shipping</h2>
                        <p>We ship to over 100 countries worldwide. International shipping costs are calculated at checkout based on destination and package weight.</p>
                        <p><strong>Delivery Time:</strong> 7-21 business days depending on destination</p>
                        <p><strong>Note:</strong> International orders may be subject to customs duties and taxes.</p>
                    </div>
                    
                    <div class="processing-time">
                        <h2>Order Processing</h2>
                        <p>Orders are typically processed within 1-2 business days. You\'ll receive a confirmation email once your order ships with tracking information.</p>
                    </div>
                </div>',
                'order' => 6,
                'show_in_navigation' => true,
                'meta_description' => 'Detailed shipping and delivery information including options, costs, and processing times.',
            ],
            [
                'title' => 'Return & Refund Policy',
                'content' => '<div class="return-policy">
                    <h1>Return & Refund Policy</h1>
                    
                    <div class="policy-overview">
                        <h2>Our Promise</h2>
                        <p>We want you to be completely satisfied with your purchase. If you\'re not happy with your order, we\'re here to help with our hassle-free return policy.</p>
                    </div>
                    
                    <div class="return-timeframe">
                        <h2>Return Timeframe</h2>
                        <p>You have <strong>30 days</strong> from the date of delivery to return items for a full refund or exchange.</p>
                    </div>
                    
                    <div class="return-conditions">
                        <h2>Return Conditions</h2>
                        <ul>
                            <li>Items must be unused and in original condition</li>
                            <li>Original packaging and tags must be included</li>
                            <li>Proof of purchase (order number) required</li>
                            <li>Personalized or custom items cannot be returned</li>
                        </ul>
                    </div>
                    
                    <div class="return-process">
                        <h2>How to Return</h2>
                        <ol>
                            <li>Contact our customer service team or use our online return portal</li>
                            <li>Receive your prepaid return shipping label</li>
                            <li>Package your items securely</li>
                            <li>Drop off at any authorized shipping location</li>
                        </ol>
                    </div>
                    
                    <div class="refund-process">
                        <h2>Refund Processing</h2>
                        <p>Once we receive your return, we\'ll inspect the items and process your refund within 3-5 business days. Refunds are issued to the original payment method.</p>
                    </div>
                    
                    <div class="exchanges">
                        <h2>Exchanges</h2>
                        <p>Need a different size or color? We offer free exchanges for the same item. Contact us to arrange an exchange.</p>
                    </div>
                </div>',
                'order' => 7,
                'show_in_navigation' => false,
                'meta_description' => 'Complete return and refund policy including conditions, process, and timeframes.',
            ],
            [
                'title' => 'Size Guide',
                'content' => '<div class="size-guide">
                    <h1>Size Guide</h1>
                    <p>Find your perfect fit with our comprehensive size guide. Measurements are in inches unless otherwise specified.</p>
                    
                    <div class="clothing-sizes">
                        <h2>Clothing Sizes</h2>
                        
                        <h3>Women\'s Clothing</h3>
                        <table class="size-table">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    <th>Bust</th>
                                    <th>Waist</th>
                                    <th>Hips</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>XS</td><td>32-34</td><td>24-26</td><td>34-36</td></tr>
                                <tr><td>S</td><td>34-36</td><td>26-28</td><td>36-38</td></tr>
                                <tr><td>M</td><td>36-38</td><td>28-30</td><td>38-40</td></tr>
                                <tr><td>L</td><td>38-40</td><td>30-32</td><td>40-42</td></tr>
                                <tr><td>XL</td><td>40-42</td><td>32-34</td><td>42-44</td></tr>
                            </tbody>
                        </table>
                        
                        <h3>Men\'s Clothing</h3>
                        <table class="size-table">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    <th>Chest</th>
                                    <th>Waist</th>
                                    <th>Neck</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>S</td><td>34-36</td><td>28-30</td><td>14-14.5</td></tr>
                                <tr><td>M</td><td>38-40</td><td>32-34</td><td>15-15.5</td></tr>
                                <tr><td>L</td><td>42-44</td><td>36-38</td><td>16-16.5</td></tr>
                                <tr><td>XL</td><td>46-48</td><td>40-42</td><td>17-17.5</td></tr>
                                <tr><td>XXL</td><td>50-52</td><td>44-46</td><td>18-18.5</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="shoe-sizes">
                        <h2>Shoe Sizes</h2>
                        <p>Our shoes run true to size. If you\'re between sizes, we recommend sizing up for comfort.</p>
                    </div>
                    
                    <div class="measuring-tips">
                        <h2>How to Measure</h2>
                        <ul>
                            <li><strong>Bust/Chest:</strong> Measure around the fullest part</li>
                            <li><strong>Waist:</strong> Measure around the narrowest part</li>
                            <li><strong>Hips:</strong> Measure around the fullest part</li>
                            <li><strong>Inseam:</strong> Measure from crotch to ankle</li>
                        </ul>
                    </div>
                </div>',
                'order' => 8,
                'show_in_navigation' => true,
                'meta_description' => 'Comprehensive size guide with measurements for clothing and shoes to help you find the perfect fit.',
            ],
        ];
    }

    private function getAboutUsContent($store): string
    {
        $storeThemes = [
            'fashion' => [
                'industry' => 'fashion and apparel',
                'mission' => 'to bring the latest fashion trends and timeless styles to fashion enthusiasts worldwide',
                'specialty' => 'curating collections from emerging designers and established fashion houses'
            ],
            'electronics' => [
                'industry' => 'technology and electronics',
                'mission' => 'to provide cutting-edge technology products that enhance your digital lifestyle',
                'specialty' => 'sourcing the latest gadgets and electronics from trusted manufacturers'
            ],
            'beauty' => [
                'industry' => 'beauty and cosmetics',
                'mission' => 'to help you discover your natural beauty with premium cosmetic products',
                'specialty' => 'partnering with leading beauty brands and indie cosmetic creators'
            ],
            'default' => [
                'industry' => 'retail and e-commerce',
                'mission' => 'to bring high-quality products directly to customers worldwide',
                'specialty' => 'sourcing products from trusted suppliers and manufacturers'
            ]
        ];

        $theme = $storeThemes[$store->theme ?? 'default'] ?? $storeThemes['default'];
        
        return '<div class="about-us-page">
            <h1>About ' . $store->name . '</h1>
            <div class="hero-section">
                <p class="lead">We are committed to providing quality products and excellent customer service that exceeds expectations in the ' . $theme['industry'] . ' industry.</p>
            </div>
            
            <div class="story-section">
                <h2>Our Story</h2>
                <p>Founded with a passion for excellence, ' . $store->name . ' started with a simple mission: ' . $theme['mission'] . '. What began as a small business has grown into a trusted brand serving thousands of satisfied customers.</p>
                <p>Our team specializes in ' . $theme['specialty'] . ', and we pride ourselves on customer satisfaction, innovation, and sustainable business practices.</p>
            </div>
            
            <div class="values-section">
                <h2>Our Values</h2>
                <ul>
                    <li><strong>Quality First:</strong> We source only the finest products from trusted suppliers</li>
                    <li><strong>Customer Focus:</strong> Your satisfaction is our top priority</li>
                    <li><strong>Innovation:</strong> We continuously improve our services and product offerings</li>
                    <li><strong>Sustainability:</strong> We are committed to environmentally responsible practices</li>
                </ul>
            </div>
            
            <div class="team-section">
                <h2>Meet Our Team</h2>
                <p>Our dedicated team of professionals works tirelessly to ensure you have the best shopping experience possible. From our customer service representatives to our logistics team, everyone is committed to excellence.</p>
            </div>
        </div>';
    }

    private function getContactUsContent($store): string
    {
        return '<div class="contact-us">
            <h1>Contact ' . $store->name . '</h1>
            <p class="intro">We\'d love to hear from you! Get in touch with our team for any questions, support, or feedback.</p>
            
            <div class="contact-methods">
                <div class="contact-method">
                    <h2>Customer Support</h2>
                    <p><strong>Email:</strong> support@' . strtolower(str_replace(' ', '', $store->name)) . '.com</p>
                    <p><strong>Phone:</strong> +1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999) . '</p>
                    <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                </div>
                
                <div class="contact-method">
                    <h2>Business Inquiries</h2>
                    <p><strong>Email:</strong> business@' . strtolower(str_replace(' ', '', $store->name)) . '.com</p>
                    <p><strong>Phone:</strong> +1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999) . '</p>
                </div>
                
                <div class="contact-method">
                    <h2>Press & Media</h2>
                    <p><strong>Email:</strong> press@' . strtolower(str_replace(' ', '', $store->name)) . '.com</p>
                </div>
            </div>
            
            <div class="office-info">
                <h2>Our Office</h2>
                <address>
                    ' . rand(100, 999) . ' Business Street<br>
                    Suite ' . rand(100, 500) . '<br>
                    New York, NY 10001<br>
                    United States
                </address>
            </div>
            
            <div class="response-time">
                <h2>Response Times</h2>
                <ul>
                    <li><strong>General Inquiries:</strong> Within 24 hours</li>
                    <li><strong>Technical Support:</strong> Within 4 hours</li>
                    <li><strong>Order Issues:</strong> Within 2 hours</li>
                </ul>
            </div>
        </div>';
    }
}