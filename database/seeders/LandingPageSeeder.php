<?php

namespace Database\Seeders;

use App\Models\LandingPageSetting;
use App\Models\LandingPageCustomPage;
use Illuminate\Database\Seeder;

class LandingPageSeeder extends Seeder
{
    public function run(): void
    {
        // Check if landing page settings already exist (client already has data)
        $existingSettings = LandingPageSetting::exists();
        
        if ($existingSettings) {
            return; // Skip if settings already exist
        }

        // Update or create landing page settings
        LandingPageSetting::updateOrCreate(
            ['id' => 1],
            [
            'company_name' => 'StoreGo',
            'contact_email' => 'support@storego.com',
            'contact_phone' => '+1 (555) 123-4567',
            'contact_address' => 'San Francisco, CA',
            'config_sections' => [
                'sections' => [
                    [
                        'key' => 'header',
                        'transparent' => false,
                        'background_color' => '#ffffff',
                        'logo_position' => 'left',
                        'menu_style' => 'horizontal',
                        'show_cta' => true,
                        'cta_text' => 'Start Free Trial',
                        'cta_link' => '/register',
                        'sticky' => true,
                        'shadow' => true
                    ],
                    [
                        'key' => 'hero',
                        'title' => 'Build & Manage Multiple Online Stores',
                        'subtitle' => 'Complete SaaS platform for creating unlimited e-commerce stores with multiple themes, payment gateways, and advanced management tools.',
                        'description' => 'Join thousands of entrepreneurs who use our multi-store SaaS platform to build successful online businesses. Start your free trial today.',
                        'announcement_text' => '🚀 New: Advanced Multi-Store Analytics Dashboard Now Available',
                        'cta_text' => 'Start Free Trial',
                        'cta_link' => '/register',
                        'primary_button_text' => 'Start Free Trial',
                        'secondary_cta_text' => 'View Live Demo',
                        'secondary_cta_link' => '/store/demo-store',
                        'secondary_button_text' => 'View Live Demo',
                        'background_color' => '#f8fafc',
                        'background_image' => '/storage/placeholder/hero-ecommerce.svg',
                        'overlay' => true,
                        'overlay_opacity' => 0.7,
                        'animation' => 'fade-in',
                        'video_url' => null,
                        'show_stats' => true,
                        'stats' => [
                            ['label' => 'Active Stores', 'value' => '25,000+'],
                            ['label' => 'Happy Merchants', 'value' => '8,500+'],
                            ['label' => 'Store Themes', 'value' => '10+'],
                        ],
                        'hero_cards' => [
                            [
                                'title' => 'Quick Setup',
                                'description' => 'Launch your store in under 5 minutes',
                                'icon' => 'rocket',
                                'color' => '#3b82f6'
                            ],
                            [
                                'title' => 'Secure Payments',
                                'description' => '30+ payment gateways integrated',
                                'icon' => 'shield',
                                'color' => '#10b981'
                            ],
                            [
                                'title' => 'Multi-Store',
                                'description' => 'Manage unlimited stores from one dashboard',
                                'icon' => 'store',
                                'color' => '#8b5cf6'
                            ]
                        ],
                        'card' => [
                            'name' => 'Sarah Mitchell',
                            'title' => 'E-commerce Director',
                            'company' => 'Digital Commerce Solutions',
                            'initials' => 'SM'
                        ],
                        'image' => '/storage/placeholder/dashboard-preview.svg',
                        'image_position' => 'right'
                    ],
                    [
                        'key' => 'features',
                        'title' => 'Complete Multi-Store SaaS Platform',
                        'subtitle' => 'Everything you need to build and manage unlimited online stores',
                        'description' => 'From store creation to theme customization, our SaaS platform provides all the tools you need to run a successful multi-store business.',
                        'background_color' => '#ffffff',
                        'layout' => 'grid',
                        'columns' => 3,
                        'show_icons' => true,
                        'icon_style' => 'modern',
                        'features' => [
                            [
                                'icon' => 'store',
                                'title' => 'Unlimited Store Creation',
                                'description' => 'Create and manage unlimited online stores from a single SaaS dashboard',
                                'color' => '#3b82f6',
                                'link' => '/features/multi-store'
                            ],
                            [
                                'icon' => 'palette',
                                'title' => 'Multiple Store Themes',
                                'description' => 'Choose from 10+ professional themes: Fashion, Electronics, Beauty, Jewelry, and more',
                                'color' => '#10b981',
                                'link' => '/features/themes'
                            ],
                            [
                                'icon' => 'payment',
                                'title' => '30+ Payment Gateways',
                                'description' => 'Stripe, PayPal, Razorpay, Flutterwave, and 26+ more payment gateways integrated',
                                'color' => '#f59e0b',
                                'link' => '/features/payments'
                            ],
                            [
                                'icon' => 'inventory',
                                'title' => 'Product & Inventory Management',
                                'description' => 'Manage products, categories, and inventory across all your stores',
                                'color' => '#8b5cf6',
                                'link' => '/features/inventory'
                            ],
                            [
                                'icon' => 'users',
                                'title' => 'Customer Management',
                                'description' => 'Manage customers, orders, and reviews across all stores from one place',
                                'color' => '#ef4444',
                                'link' => '/features/customers'
                            ],
                            [
                                'icon' => 'blog',
                                'title' => 'Built-in Blog System',
                                'description' => 'Each store comes with a complete blog system for content marketing',
                                'color' => '#06b6d4',
                                'link' => '/features/blog'
                            ]
                        ]
                    ],
                    [
                        'key' => 'screenshots',
                        'title' => 'See Our SaaS Platform in Action',
                        'subtitle' => 'Explore the multi-store dashboard and theme management features',
                        'description' => 'Get a glimpse of how easy it is to create and manage multiple online stores with our SaaS platform.',
                        'background_color' => '#f8fafc',
                        'layout' => 'carousel',
                        'autoplay' => true,
                        'autoplay_speed' => 5000,
                        'show_thumbnails' => true,
                        'screenshots_list' => [
                            [
                                'title' => 'Multi-Store Dashboard',
                                'description' => 'Manage all your stores from one central SaaS dashboard',
                                'src' => '/storage/placeholder/landing-page/multi-store-dashboard.png',
                                'alt' => 'Multi-store SaaS dashboard overview'
                            ],
                            [
                                'title' => 'Product Management',
                                'description' => 'Add products, manage categories, and track inventory for each store',
                                'src' => '/storage/placeholder/landing-page/product-management.png',
                                'alt' => 'Product management interface'
                            ],
                            [
                                'title' => 'Theme Selection',
                                'description' => 'Choose from 10+ professional themes for each store',
                                'src' => '/storage/placeholder/landing-page/theme-selection.png',
                                'alt' => 'Store theme selection interface'
                            ],
                            [
                                'title' => 'Order Management',
                                'description' => 'Process orders and manage customer transactions',
                                'src' => '/storage/placeholder/landing-page/order-management.png',
                                'alt' => 'Order management system'
                            ],
                            [
                                'title' => 'Blog Management',
                                'description' => 'Built-in blog system for each store with content management',
                                'src' => '/storage/placeholder/landing-page/blog-management.png',
                                'alt' => 'Blog management interface'
                            ],
                            [
                                'title' => 'Payment Integration',
                                'description' => '30+ payment gateways ready to integrate with your stores',
                                'src' => '/storage/placeholder/landing-page/payment-integration.png',
                                'alt' => 'Payment gateway integration'
                            ]
                        ]
                    ],
                    [
                        'key' => 'why_choose_us',
                        'title' => 'Why Choose Our SaaS Platform?',
                        'subtitle' => 'The complete multi-store e-commerce SaaS solution',
                        'description' => 'Unlike single-store platforms, our SaaS solution is built specifically for managing unlimited stores with different themes and configurations.',
                        'background_color' => '#ffffff',
                        'layout' => 'split',
                        'image' => '/storage/placeholder/multi-store-dashboard.svg',
                        'image_position' => 'left',
                        'reasons' => [
                            [
                                'title' => 'Complete E-commerce Features',
                                'description' => 'Product management, order processing, customer management, and blog system built-in',
                                'icon' => 'features'
                            ],
                            [
                                'title' => 'Ready-to-Use Themes',
                                'description' => '10+ professional themes ready to use - no customization needed, just select and go live',
                                'icon' => 'themes'
                            ]
                        ],
                        'stats' => [
                            [
                                'value' => '25,000+',
                                'label' => 'Active Stores',
                                'color' => '#3b82f6'
                            ],
                            [
                                'value' => '98.5%',
                                'label' => 'Uptime',
                                'color' => '#10b981'
                            ],
                            [
                                'value' => '$2.5M+',
                                'label' => 'Revenue Generated',
                                'color' => '#f59e0b'
                            ],
                            [
                                'value' => '120+',
                                'label' => 'Countries Served',
                                'color' => '#8b5cf6'
                            ]
                        ],
                        'stats_title' => 'Trusted by Entrepreneurs Worldwide',
                        'stats_subtitle' => 'Join thousands of successful merchants who chose StoreGo',
                        'cta_title' => 'Ready to Launch Your Store?',
                        'cta_subtitle' => 'Start your 14-day free trial today - no credit card required'
                    ],

                    [
                        'key' => 'about',
                        'title' => 'About Our Platform',
                        'subtitle' => 'Empowering entrepreneurs with multi-store SaaS technology',
                        'description' => 'Founded by SaaS and e-commerce experts, our platform is built to solve the real challenges of managing multiple online stores.',
                        'background_color' => '#f8fafc',
                        'layout' => 'image-right',
                        'image' => '/storage/placeholder/about-storego.svg',
                        'image_position' => 'right',
                        'parallax' => false,
                        'story_title' => 'Revolutionizing Multi-Store E-commerce Since 2019',
                        'story_content' => 'StoreGo emerged from the vision of experienced e-commerce professionals who recognized the growing need for unified multi-store management. What started as a solution for managing multiple online stores has evolved into a comprehensive platform serving over 25,000 entrepreneurs across 120+ countries. Our mission is to democratize e-commerce by providing powerful, intuitive tools that enable anyone to build, manage, and scale successful online businesses without technical barriers.',
                        'stats' => [
                            ['label' => 'Store Themes', 'value' => '10+', 'color' => '#3b82f6'],
                            ['label' => 'Payment Gateways', 'value' => '30+', 'color' => '#10b981'],
                            ['label' => 'Active Features', 'value' => '50+', 'color' => '#8b5cf6'],
                            ['label' => 'Customer Rating', 'value' => '4.9/5', 'color' => '#f59e0b'],
                            ['label' => 'Support Response', 'value' => '<4hrs', 'color' => '#ef4444'],
                            ['label' => 'Success Rate', 'value' => '94%', 'color' => '#06b6d4']
                        ],
                        'values' => [
                            [
                                'title' => 'Our Mission',
                                'description' => 'To democratize e-commerce by providing powerful, easy-to-use tools that enable anyone to build and manage successful online stores.',
                                'icon' => 'target'
                            ],
                            [
                                'title' => 'Innovation First',
                                'description' => 'We continuously innovate to stay ahead of e-commerce trends and provide cutting-edge solutions for modern businesses.',
                                'icon' => 'lightbulb'
                            ],
                            [
                                'title' => 'Customer Success',
                                'description' => 'Your success is our success. We provide exceptional support and resources to help you grow your online business.',
                                'icon' => 'heart'
                            ],
                            [
                                'title' => 'Reliability',
                                'description' => 'Built on enterprise-grade infrastructure with 99.9% uptime guarantee and world-class security standards.',
                                'icon' => 'shield'
                            ]
                        ],
                        'image_title' => 'Innovation Driven',
                        'image_subtitle' => 'Building the future of e-commerce',
                        'image_icon' => '🚀'
                    ],

                    [
                        'key' => 'team',
                        'title' => 'Meet Our Team',
                        'subtitle' => 'Meet the passionate team behind StoreGo\'s success',
                        'description' => 'Our diverse team of e-commerce experts, engineers, and designers is dedicated to helping entrepreneurs build successful online businesses.',
                        'background_color' => '#f8fafc',
                        'layout' => 'grid',
                        'columns' => 3,
                        'members' => [
                            [
                                'name' => 'Alex Rodriguez',
                                'role' => 'CEO & Co-Founder',
                                'bio' => 'Former Shopify executive with 10+ years in e-commerce. Passionate about empowering entrepreneurs worldwide.',
                                'image' => '/storage/placeholder/team/alex.svg',
                                'linkedin' => 'https://linkedin.com/in/',
                                'twitter' => 'https://twitter.com/',
                                'email' => 'alex@storego.com'
                            ],
                            [
                                'name' => 'Sarah Kim',
                                'role' => 'CTO & Co-Founder',
                                'bio' => 'Tech leader specializing in scalable e-commerce platforms. Expert in cloud architecture and SaaS development.',
                                'image' => '/storage/placeholder/team/sarah.svg',
                                'linkedin' => 'https://linkedin.com/in/',
                                'twitter' => 'https://twitter.com/',
                                'email' => 'sarah@storego.com'
                            ],
                            [
                                'name' => 'David Wilson',
                                'role' => 'Head of Customer Success',
                                'bio' => 'Helping merchants grow their businesses since day one. 8+ years in customer success and e-commerce consulting.',
                                'image' => '/storage/placeholder/team/david.svg',
                                'linkedin' => 'https://linkedin.com/in/',
                                'email' => 'david@storego.com'
                            ],
                            [
                                'name' => 'Maria Garcia',
                                'role' => 'VP of Engineering',
                                'bio' => 'Full-stack engineer with expertise in React, Laravel, and microservices. Leading our product development team.',
                                'image' => '/storage/placeholder/team/maria.svg',
                                'linkedin' => 'https://linkedin.com/in/',
                                'twitter' => 'https://twitter.com/',
                                'email' => 'maria@storego.com'
                            ]
                        ],
                        'cta_title' => 'Join Our Growing Team',
                        'cta_description' => 'We\'re always looking for talented individuals who are passionate about e-commerce, technology, and helping entrepreneurs succeed. Join us in building the future of multi-store SaaS platforms.',
                        'cta_button_text' => 'View Open Positions'
                    ],
                    [
                        'key' => 'plans',
                        'title' => 'Choose Your Plan',
                        'subtitle' => 'Transparent pricing that grows with your business',
                        'description' => 'Start free and upgrade as you grow. No hidden fees, no transaction charges.',
                        'background_color' => '#f8fafc',
                        'billing_toggle' => true,
                        'highlight_popular' => true,
                        'show_features' => true,
                        'money_back_guarantee' => '30-day money back guarantee',
                        'guarantee_text' => 'Try risk-free with our 30-day money back guarantee',
                        'annual_discount' => 'Save 20% with annual billing',
                        'contact_sales_text' => 'Need a custom enterprise plan?',
                        'contact_sales_link' => '/contact-sales'
                    ],
                    [
                        'key' => 'testimonials',
                        'title' => 'What Our Merchants Say',
                        'subtitle' => 'Join thousands of successful store owners',
                        'description' => 'Don\'t just take our word for it. See what our successful merchants have to say about StoreGo.',
                        'background_color' => '#ffffff',
                        'layout' => 'carousel',
                        'autoplay' => true,
                        'autoplay_speed' => 6000,
                        'show_ratings' => true,
                        'show_navigation' => true,
                        'show_trust_indicators' => true,
                        'trust_indicators' => [
                            ['metric' => 'Customer Satisfaction', 'value' => '98.5%', 'description' => 'of merchants recommend StoreGo to others'],
                            ['metric' => 'Average Rating', 'value' => '4.9/5', 'description' => 'based on 8,500+ verified reviews'],
                            ['metric' => 'Success Rate', 'value' => '94%', 'description' => 'of stores see growth in first 90 days'],
                            ['metric' => 'Revenue Growth', 'value' => '340%', 'description' => 'average increase in first year'],
                            ['metric' => 'Platform Uptime', 'value' => '99.9%', 'description' => 'guaranteed service availability']
                        ],
                        'trust_title' => 'Trusted by Entrepreneurs Worldwide',
                        'trust_stats' => [
                            ['value' => '98.5%', 'label' => 'Customer Satisfaction', 'color' => '#10b981'],
                            ['value' => '4.9/5', 'label' => 'Average Rating', 'color' => '#f59e0b'],
                            ['value' => '94%', 'label' => 'Success Rate', 'color' => '#3b82f6'],
                            ['value' => '99.9%', 'label' => 'Platform Uptime', 'color' => '#8b5cf6'],
                            ['value' => '<2hrs', 'label' => 'Support Response', 'color' => '#ef4444']
                        ],
                        'testimonials' => [
                            [
                                'name' => 'Emma Thompson',
                                'role' => 'Store Owner',
                                'company' => 'Boutique Fashion Co.',
                                'content' => 'StoreGo made it incredibly easy to launch my fashion store. The multi-store feature lets me manage different brands from one dashboard. Sales increased 400% in the first 6 months!',
                                'rating' => 5,
                                'avatar' => '/storage/placeholder/testimonials/emma.svg',
                                'location' => 'London, UK'
                            ],
                            [
                                'name' => 'Carlos Martinez',
                                'role' => 'E-commerce Manager',
                                'company' => 'Electronics Plus',
                                'content' => 'The inventory management and POS integration are game-changers. We can track everything in real-time across our online and physical stores.',
                                'rating' => 5,
                                'avatar' => '/storage/placeholder/testimonials/carlos.svg',
                                'location' => 'Madrid, Spain'
                            ],
                            [
                                'name' => 'Priya Patel',
                                'role' => 'Entrepreneur',
                                'company' => 'Handmade Crafts',
                                'content' => 'The payment gateway integrations are fantastic. I can accept payments from customers worldwide with no hassle. Customer support is always there when I need help.',
                                'rating' => 5,
                                'avatar' => '/storage/placeholder/testimonials/priya.svg',
                                'location' => 'Mumbai, India'
                            ]
                        ]
                    ],
                    [
                        'key' => 'faq',
                        'title' => 'Frequently Asked Questions',
                        'subtitle' => 'Everything you need to know about StoreGo',
                        'description' => 'Got questions? We\'ve got answers. Browse our most frequently asked questions below.',
                        'background_color' => '#f8fafc',
                        'layout' => 'accordion',
                        'show_search' => true,
                        'show_categories' => true,
                        'contact_support_text' => 'Still have questions? Our support team is here to help.',
                        'contact_support_link' => '/contact',
                        'cta_text' => 'Ready to Start Your E-commerce Journey?',
                        'button_text' => 'Start Free Trial Now',
                        'faqs' => [
                            [
                                'question' => 'How quickly can I set up my first store?',
                                'answer' => 'You can create a store in minutes by selecting a theme, adding your products, and configuring basic settings. The platform is designed for quick setup.',
                                'category' => 'Getting Started'
                            ],
                            [
                                'question' => 'Can I manage multiple stores from one account?',
                                'answer' => 'Yes! This is a multi-store SaaS platform. You can create and manage unlimited stores from a single dashboard.',
                                'category' => 'Multi-Store'
                            ],
                            [
                                'question' => 'What payment gateways are supported?',
                                'answer' => 'We support 30+ payment gateways including Stripe, PayPal, Razorpay, Flutterwave, and many other regional and international providers.',
                                'category' => 'Payments'
                            ],
                            [
                                'question' => 'What themes are available?',
                                'answer' => 'We offer 10+ professional themes including Fashion, Electronics, Beauty & Cosmetics, Jewelry, Watches, Furniture, Cars, Baby & Kids, Perfume, and Home & Accessories.',
                                'category' => 'Themes'
                            ],
                            [
                                'question' => 'Does each store have a blog system?',
                                'answer' => 'Yes! Every store comes with a built-in blog system for content marketing, with categories, tags, and full content management.',
                                'category' => 'Features'
                            ],
                            [
                                'question' => 'Can customers create accounts and track orders?',
                                'answer' => 'Yes! The platform includes complete customer management with registration, login, order tracking, and customer profiles.',
                                'category' => 'Customer Management'
                            ]
                        ]
                    ],
                    [
                        'key' => 'newsletter',
                        'title' => 'Stay Updated',
                        'subtitle' => 'Get the latest e-commerce tips and StoreGo updates',
                        'description' => 'Join our newsletter and get exclusive insights, tips, and updates delivered to your inbox.',
                        'background_color' => '#3b82f6',
                        'text_color' => '#ffffff',
                        'placeholder' => 'Enter your email address',
                        'button_text' => 'Subscribe Now',
                        'privacy_text' => 'We respect your privacy. Unsubscribe at any time.',
                        'benefits' => [
                            [
                                'icon' => '📈',
                                'title' => 'Growth Strategies',
                                'description' => 'Weekly e-commerce growth tips and best practices'
                            ],
                            [
                                'icon' => '🚀',
                                'title' => 'Early Access',
                                'description' => 'Be first to try new StoreGo features and updates'
                            ],
                            [
                                'icon' => '💡',
                                'title' => 'Success Stories',
                                'description' => 'Learn from successful merchant case studies'
                            ]
                        ],
                        'subscriber_count' => '95,000+',
                        'frequency' => 'Weekly',
                        'success_message' => 'Thank you for subscribing! Check your email for confirmation.'
                    ],
                    [
                        'key' => 'contact',
                        'title' => 'Get in Touch',
                        'subtitle' => 'Ready to start your e-commerce journey?',
                        'description' => 'Our team of e-commerce experts is here to help you succeed. Get in touch and let\'s build something amazing together.',
                        'background_color' => '#ffffff',
                        'show_form' => true,
                        'show_info' => true,
                        'contact_info_title' => 'Contact Information',
                        'contact_info_description' => 'Reach out to us through any of these channels. We\'re here to help you build your dream e-commerce business.',
                        'form_fields' => ['name', 'email', 'subject', 'message'],
                        'form_title' => 'Send us a message',
                        'form_subtitle' => 'We\'ll get back to you within 4 hours',
                        'contact_methods' => [
                            ['type' => 'email', 'value' => 'support@storego.com', 'label' => 'Email Support', 'description' => 'Get help via email'],
                            ['type' => 'phone', 'value' => '+1 (555) 123-4567', 'label' => 'Phone Support', 'description' => 'Speak with our team'],
                            ['type' => 'chat', 'value' => 'Live Chat', 'label' => 'Live Chat', 'description' => 'Chat with us instantly']
                        ],
                        'response_time' => '4 hours',
                        'support_hours' => '24/7',
                        'contact_faqs' => [
                            [
                                'question' => 'How quickly do you respond to inquiries?',
                                'answer' => 'We typically respond to all inquiries within 4 hours during business hours, often much sooner.'
                            ],
                            [
                                'question' => 'Do you offer phone support?',
                                'answer' => 'Yes! Phone support is available for all paid plan customers. Free trial users can access email and chat support.'
                            ],
                            [
                                'question' => 'Can you help with store setup and migration?',
                                'answer' => 'Absolutely! Our team offers free store setup assistance and migration services for all customers.'
                            ]
                        ]
                    ],
                    [
                        'key' => 'footer',
                        'background_color' => '#1f2937',
                        'text_color' => '#ffffff',
                        'show_social' => true,
                        'show_newsletter' => true,
                        'show_logo' => true,
                        'logo_position' => 'top',
                        'description' => 'StoreGo is the leading multi-store e-commerce SaaS platform that empowers entrepreneurs to create, manage, and scale unlimited online stores from a single dashboard. Join thousands of successful merchants worldwide.',
                        'newsletter_title' => 'Stay Connected with StoreGo',
                        'newsletter_subtitle' => 'Get exclusive e-commerce insights, platform updates, and growth strategies delivered to your inbox',
                        'links' => [
                            'product' => [
                                ['name' => 'Features', 'href' => '#'],
                                ['name' => 'Store Themes', 'href' => '#'],
                                ['name' => 'Pricing Plans', 'href' => '#'],
                                ['name' => 'Live Demo', 'href' => '#']
                            ],
                            'company' => [
                                ['name' => 'About Us', 'href' => '#'],
                                ['name' => 'Contact Us', 'href' => '#']
                            ],
                            'support' => [
                                ['name' => 'FAQ', 'href' => '#'],
                                ['name' => 'Dashboard', 'href' => '#']
                            ],
                            'legal' => [
                                ['name' => 'Privacy Policy', 'href' => '#'],
                                ['name' => 'Terms of Service', 'href' => '#'],
                                ['name' => 'Refund Policy', 'href' => '#']
                            ]
                        ],
                        'section_titles' => [
                            'product' => 'Platform',
                            'company' => 'Company',
                            'support' => 'Resources',
                            'legal' => 'Legal & Security'
                        ],
                        'social_links' => [
                            ['name' => 'Twitter', 'icon' => 'Twitter', 'href' => 'https://x.com/'],
                            ['name' => 'LinkedIn', 'icon' => 'Linkedin', 'href' => 'https://www.linkedin.com/'],
                            ['name' => 'Facebook', 'icon' => 'Facebook', 'href' => 'https://www.facebook.com/'],
                            ['name' => 'Instagram', 'icon' => 'Instagram', 'href' => 'https://www.instagram.com/']
                        ],
                        'copyright' => '© 2024 StoreGo. All rights reserved.',
                        'bottom_text' => 'Built for entrepreneurs, by entrepreneurs. Trusted by 25,000+ merchants across 120+ countries worldwide. SOC 2 Type II compliant with 99.9% uptime guarantee.'
                    ]
                ],
                'colors' => [
                    'primary' => '#10b981',
                    'secondary' => '#059669',
                    'accent' => '#065f46'
                ],
                'seo' => [
                    'meta_title' => 'StoreGo - Multi-Store E-commerce Platform | Launch Your Online Store',
                    'meta_description' => 'Create and manage multiple online stores with StoreGo. 30+ payment gateways, beautiful themes, inventory management, and more. Start your free trial today.',
                    'meta_keywords' => 'ecommerce platform, online store builder, multi-store management, sell online, ecommerce website, store builder'
                ],
                'section_order' => [
                    'header', 'hero', 'features', 'screenshots', 'why_choose_us', 'about', 'team', 'plans', 'testimonials', 'faq', 'newsletter', 'contact', 'footer'
                ],
                'section_visibility' => [
                    'header' => true,
                    'hero' => true,
                    'features' => true,
                    'screenshots' => true,
                    'why_choose_us' => true,
                    'about' => true,
                    'campaigns' => true,
                    'team' => true,
                    'plans' => true,
                    'testimonials' => true,
                    'faq' => true,
                    'newsletter' => true,
                    'contact' => true,
                    'footer' => true
                ]
            ]
        ]);

        // Create landing page custom pages
        $pages = [
            [
                'title' => 'About Us',
                'slug' => 'about-us',
                'content' => "About Our Multi-Store E-commerce Platform: Empowering entrepreneurs to <b>create, manage, and scale multiple online stores smarter</b>.<br>We are dedicated to helping businesses streamline e-commerce operations, optimize store management, and grow their revenue with ease.<br>Our platform centralizes store data, automates sales processes, and provides actionable insights to drive business growth.<br>Whether you're launching your first store or managing multiple brands, our platform adapts to your needs—from product management to customer analytics—ensuring efficiency, scalability, and measurable success.<br><b>Stats:</b> &bull; 4+ Years E-commerce Experience &bull; 25K+ Active Stores &bull; 120+ Countries Served<br><b>Our Mission:</b> Transform the way businesses operate online by providing scalable, intelligent, and user-friendly multi-store e-commerce solutions.<br><b>Our Values:</b> Innovation, reliability, and merchant success are at the heart of everything we build.<br><b>Our Commitment:</b> Deliver secure, scalable, and reliable e-commerce solutions with world-class support.<br><b>Our Vision:</b> A future where every entrepreneur maximizes their potential through automated store management, data-driven decisions, and seamless customer experiences.",
                'meta_title' => 'About Us - StoreGo Multi-Store E-commerce Platform',
                'meta_description' => 'Learn more about StoreGo – designed to simplify multi-store operations, optimize inventory management, and accelerate business growth for entrepreneurs worldwide.',
                'is_active' => true,
                'sort_order' => 1
            ],

            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'content' => "Your privacy is important to us. This Privacy Policy explains how our multi-store e-commerce platform collects, uses, and protects your information.<br><b>Information We Collect:</b> &bull; Business and store details such as name, address, phone, and company information &bull; Product inventory, pricing, and sales transaction data &bull; Customer information and purchase history for analytics &bull; Payment processing details and order management data &bull; System usage analytics to enhance platform performance<br><b>How We Use Your Information:</b> &bull; Provide, maintain, and improve e-commerce platform services &bull; Enable store management, product listings, and order processing &bull; Process payments, transactions, and generate invoices securely &bull; Send important updates, notifications, and feature announcements (with your consent) &bull; Monitor and enhance security, prevent fraud, and ensure compliance<br><b>Information Sharing:</b> We do not sell or trade business or customer data. Information may be shared with: &bull; Authorized store owners and administrators &bull; Trusted third-party service providers (e.g., payment gateways, shipping providers) &bull; Legal authorities when required by law<br><b>Data Security:</b> We use encryption, firewalls, access control, and regular audits to safeguard business and transaction data from unauthorized access or misuse.<br><b>Data Retention:</b> Data is stored as long as your account remains active or as legally required. Upon request, data can be deleted, anonymized, or exported as needed.<br><b>Your Rights:</b> You have the right to access, correct, or request deletion of your business data. You may also manage communication preferences or withdraw consent anytime by contacting our support team.",
                'meta_title' => 'Privacy Policy - StoreGo Multi-Store Platform',
                'meta_description' => 'Read the privacy policy of StoreGo to understand how business, store, and transaction data is collected, used, and protected.',
                'is_active' => true,
                'sort_order' => 2
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms-of-service',
                'content' => "Please read these terms carefully before using our multi-store e-commerce platform. By accessing or using our services, you agree to these terms.<br><br><b>Acceptance of Terms:</b> By creating an account or using our StoreGo platform, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.<br><br><b>Service Description:</b> Our platform provides businesses with multi-store e-commerce solutions, including but not limited to:<br>&bull; Store creation and management tools<br>&bull; Product catalog and inventory management<br>&bull; Order processing and customer management<br>&bull; Payment gateway integrations<br>&bull; Analytics and reporting features<br><br><b>User Responsibilities:</b> As a user of our e-commerce platform, you agree to:<br>&bull; Provide accurate and updated information when creating an account<br>&bull; Maintain confidentiality of your login credentials<br>&bull; Ensure that all uploaded content complies with applicable laws<br>&bull; Use the platform only for lawful e-commerce and business purposes<br><br><b>Subscription & Payments:</b> You agree to pay all fees associated with your chosen plan in accordance with the billing terms. Failure to pay may result in suspension or termination of your account.<br><br><b>Termination of Service:</b> We reserve the right to suspend or terminate your access if you violate these Terms or engage in harmful activities.<br><br><b>Data & Privacy:</b> Your data will be handled per our Privacy Policy. You are responsible for safeguarding your account access.<br><br><b>Limitation of Liability:</b> Our company shall not be held liable for any indirect, incidental, or consequential damages arising from your use of the StoreGo platform.",
                'meta_title' => 'Terms of Service - StoreGo Multi-Store Platform',
                'meta_description' => 'Read our terms of service to understand the rules and responsibilities for using our StoreGo e-commerce platform.',
                'is_active' => true,
                'sort_order' => 3
            ],
            [
                'title' => 'Contact Us',
                'slug' => 'contact-us',
                'content' => "Have questions about <b>StoreGo</b>? Our team is here to assist you with demos, pricing, integrations, and more.<br><br><b>Send us a Message:</b> Fill out the form with your Full Name, Email Address, Subject, and Message. Our dedicated support team will get back to you promptly.<br><br><b>Contact Information:</b><br>&bull; <b>Email Us:</b> support@storego.com (Average response time: within 24 hours)<br>&bull; <b>Call Us:</b> +1 (555) 123-4567 (Available Monday – Friday, 9am – 6pm EST)<br>&bull; <b>Visit Us:</b> 123 E-commerce Street, Suite 100, San Francisco, CA 94105<br><br><b>Business Hours:</b><br>&bull; Monday - Friday: 9:00 AM - 6:00 PM EST<br>&bull; Saturday: 10:00 AM - 2:00 PM EST<br>&bull; Sunday: Closed",
                'meta_title' => 'Contact Us - StoreGo Support',
                'meta_description' => 'Reach out to our StoreGo support team for inquiries, demos, pricing, or technical assistance. We\'re here to help you succeed.',
                'is_active' => true,
                'sort_order' => 4
            ],
            [
                'title' => 'FAQ',
                'slug' => 'faq',
                'content' => "Find quick answers to the most <b>common questions</b> about using our multi-store e-commerce platform.<br><br><b>Getting Started:</b><br><b>What is StoreGo?</b> StoreGo is a comprehensive multi-store e-commerce platform that helps businesses create unlimited online stores, manage products, process orders, handle customers, and generate detailed analytics.<br><b>How do I get started?</b> You can sign up for a free trial, set up your business profile, create your first store, configure products, and start selling right away.<br><br><b>Features & Operations:</b><br><b>Which subscription plans are available?</b> We offer Free, Starter, Professional, and Enterprise plans to fit businesses of all sizes, each with advanced features such as multi-store management, payment integrations, and analytics tools.<br><b>Can I integrate StoreGo with other tools?</b> Yes, StoreGo integrates with popular payment gateways, shipping providers, accounting software, and marketing tools.<br><br><b>Analytics & Support:</b><br><b>How does reporting work?</b> Our analytics dashboard provides real-time insights into sales performance, customer behavior, product analytics, and store performance across all your stores.<br><b>What support options are available?</b> We offer 24/7 email support, live chat, and phone assistance for premium users. You can also explore our Help Center for detailed guides and tutorials.",
                'meta_title' => 'FAQ - StoreGo Help Center',
                'meta_description' => 'Get answers to frequently asked questions about StoreGo, including features, pricing plans, integrations, and support options.',
                'is_active' => true,
                'sort_order' => 5
            ],
            [
                'title' => 'Refund Policy',
                'slug' => 'refund-policy',
                'content' => "We value your trust in <b>StoreGo</b> and are committed to delivering the best experience. Please review our refund policy below.<br><br><b>30-Day Money Back Guarantee:</b> We offer a 30-day money-back guarantee on all premium subscription plans. If StoreGo does not meet your expectations, you can request a full refund within 30 days of purchase.<br><br><b>Eligible Refunds:</b><br>&bull; Monthly and annual subscription plans<br>&bull; One-time premium features or add-ons<br>&bull; Unused portions of prepaid services<br><br><b>Refund Process:</b><br>1. Contact our support team within 30 days of purchase.<br>2. Provide your registered account details and reason for the refund.<br>3. Our team will review and process your request within 3–5 business days.<br>4. Refunds will be credited to your original payment method.<br><br><b>Non-Refundable Items:</b><br>&bull; Custom development, consulting, or integration services<br>&bull; Third-party services or marketplace add-ons<br>&bull; Domain registration or external licensing fees<br>&bull; Subscriptions after the 30-day guarantee period<br><br>If you have any questions about our refund policy, please reach out to <b>support@storego.com</b>. Our team is here to help.",
                'meta_title' => 'Refund Policy - StoreGo',
                'meta_description' => 'Read about the StoreGo refund policy, including our 30-day money-back guarantee and eligibility details.',
                'is_active' => true,
                'sort_order' => 6
            ]

        ];

        foreach ($pages as $index => $pageData) {
            // Create varied dates from current date back to 2 months (60 days)
            $daysAgo = rand(1, 60) + ($index * 5);
            $createdAt = \Carbon\Carbon::now()->subDays($daysAgo);
            
            $pageData['created_at'] = $createdAt;
            $pageData['updated_at'] = $createdAt;
            
            LandingPageCustomPage::updateOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );
        }

    }
}