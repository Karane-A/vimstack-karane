<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingPageSetting extends Model
{
    protected $fillable = [
        'company_name', 'contact_email', 'contact_phone', 'contact_address', 'config_sections'
    ];
    
    protected $attributes = [
        'company_name' => '',
        'contact_email' => '',
        'contact_phone' => '',
        'contact_address' => ''
    ];

    protected $casts = [
        'config_sections' => 'array'
    ];

    public static function getSettings()
    {
        $settings = self::first();
        
        if (!$settings) {
            // Import default sections from the template file structure
            $defaultConfig = [
                'colors' => [
                    'primary' => '#10b981',
                    'secondary' => '#059669',
                    'accent' => '#065f46'
                ],
                'sections' => [
                    [
                        'key' => 'header',
                        'transparent' => false,
                        'background_color' => '#ffffff',
                        'text_color' => '#1f2937',
                        'button_style' => 'gradient'
                    ],
                    [
                        'key' => 'hero',
                        'title' => 'Launch Your Online Store in Minutes',
                        'subtitle' => 'Create and manage multiple online stores with our powerful e-commerce platform.',
                        'announcement_text' => '🚀 New: Advanced Analytics Dashboard',
                        'primary_button_text' => 'Start Free Trial',
                        'secondary_button_text' => 'Login',
                        'image' => '',
                        'background_color' => '#f8fafc',
                        'text_color' => '#1f2937',
                        'layout' => 'image-right',
                        'height' => 600,
                        'stats' => [
                            ['value' => '10K+', 'label' => 'Active Users'],
                            ['value' => '50+', 'label' => 'Countries'],
                            ['value' => '99%', 'label' => 'Satisfaction']
                        ],
                        'card' => [
                            'name' => 'John Doe',
                            'title' => 'Senior Developer',
                            'company' => 'Tech Solutions Inc.',
                            'initials' => 'JD'
                        ]
                    ],
                    [
                        'key' => 'features',
                        'title' => 'Everything You Need to Sell Online',
                        'description' => 'Powerful e-commerce features designed for modern businesses.',
                        'background_color' => '#ffffff',
                        'layout' => 'grid',
                        'columns' => 3,
                        'image' => '',
                        'show_icons' => true,
                        'features_list' => [
                            ['title' => 'Multi-Store Management', 'description' => 'Create and manage unlimited online stores from one dashboard.', 'icon' => 'store'],
                            ['title' => '30+ Payment Gateways', 'description' => 'Accept payments via Stripe, PayPal, Razorpay, and more.', 'icon' => 'credit-card'],
                            ['title' => 'Advanced Analytics', 'description' => 'Track sales, customers, and performance with detailed reports.', 'icon' => 'bar-chart']
                        ]
                    ],
                    [
                        'key' => 'screenshots',
                        'title' => 'See StoreGo in Action',
                        'subtitle' => 'Explore our intuitive dashboard and powerful store management features.',
                        'screenshots_list' => [
                            [
                                'src' => '/screenshots/hero.png',
                                'alt' => 'See Store SaaS Dashboard Overview',
                                'title' => 'Dashboard Overview',
                                'description' => 'Comprehensive dashboard with all your digital cards and analytics'
                            ],
                            [
                                'src' => '/screenshots/store-builder.png',
                                'alt' => 'Store Builder Interface',
                                'title' => 'Store Builder',
                                'description' => 'Intuitive interface for creating and managing online stores'
                            ]
                        ]
                    ],
                    [
                        'key' => 'why_choose_us',
                        'title' => 'Why Choose StoreGo?',
                        'subtitle' => 'The complete e-commerce solution for modern businesses.',
                        'reasons' => [
                            ['title' => 'Multi-Store Architecture', 'description' => 'Manage unlimited stores from one account with centralized dashboard.', 'icon' => 'stores'],
                            ['title' => 'No Transaction Fees', 'description' => 'Keep 100% of your profits with transparent pricing.', 'icon' => 'money']
                        ],
                        'stats' => [
                            ['value' => '10K+', 'label' => 'Active Users', 'color' => 'blue'],
                            ['value' => '99%', 'label' => 'Satisfaction', 'color' => 'green']
                        ]
                    ],
                    [
                        'key' => 'templates',
                        'title' => 'Explore Our Templates',
                        'subtitle' => 'Choose from our professionally designed templates to create your perfect digital business card.',
                        'background_color' => '#f8fafc',
                        'layout' => 'grid',
                        'columns' => 3,
                        'templates_list' => [
                            ['name' => 'freelancer', 'category' => 'professional'],
                            ['name' => 'doctor', 'category' => 'medical'],
                            ['name' => 'restaurant', 'category' => 'food'],
                            ['name' => 'realestate', 'category' => 'business'],
                            ['name' => 'fitness', 'category' => 'health'],
                            ['name' => 'photography', 'category' => 'creative'],
                            ['name' => 'lawfirm', 'category' => 'professional'],
                            ['name' => 'cafe', 'category' => 'food'],
                            ['name' => 'salon', 'category' => 'beauty'],
                            ['name' => 'construction', 'category' => 'business'],
                            ['name' => 'eventplanner', 'category' => 'services'],
                            ['name' => 'tech-startup', 'category' => 'technology']
                        ],
                        'cta_text' => 'View All Templates',
                        'cta_link' => '#'
                    ],
                    [
                        'key' => 'about',
                        'title' => 'About',
                        'description' => 'We are passionate about empowering entrepreneurs to build successful e-commerce businesses.',
                        'story_title' => 'Revolutionizing Multi-Store E-commerce Since 2019',
                        'story_content' => 'Founded by e-commerce experts and technology innovators, StoreGo was created to solve the challenges of managing multiple online stores.',
                        'image' => '',
                        'background_color' => '#f9fafb',
                        'layout' => 'image-right',
                        'stats' => [
                            ['value' => '4+ Years', 'label' => 'Experience', 'color' => 'blue'],
                            ['value' => '10K+', 'label' => 'Happy Users', 'color' => 'green'],
                            ['value' => '50+', 'label' => 'Countries', 'color' => 'purple']
                        ]
                    ],
                    [
                        'key' => 'team',
                        'title' => 'Meet Our Team',
                        'subtitle' => 'We\'re a diverse team of innovators and problem-solvers.',
                        'cta_title' => 'Want to Join Our Team?',
                        'cta_description' => 'We\'re always looking for talented individuals.',
                        'cta_button_text' => 'View Open Positions',
                        'members' => [
                            ['name' => 'Sarah Johnson', 'role' => 'CEO & Founder', 'bio' => 'Former tech executive with 15+ years experience.', 'image' => '', 'linkedin' => '#', 'email' => 'sarah@storego.com']
                        ]
                    ],
                    [
                        'key' => 'testimonials',
                        'title' => 'What Our Clients Say',
                        'subtitle' => 'Don\'t just take our word for it.',
                        'trust_title' => 'Trusted by Professionals Worldwide',
                        'trust_stats' => [
                            ['value' => '4.9/5', 'label' => 'Average Rating', 'color' => 'blue'],
                            ['value' => '10K+', 'label' => 'Happy Users', 'color' => 'green']
                        ],
                        'testimonials' => [
                            ['name' => 'Alex Thompson', 'role' => 'Sales Director', 'company' => 'TechCorp Inc.', 'content' => 'StoreGo has revolutionized how I manage my online stores.', 'rating' => 5]
                        ]
                    ],
                    [
                        'key' => 'active_campaigns',
                        'title' => 'Featured Business Promotions',
                        'subtitle' => 'Explore businesses we\'re currently promoting and discover amazing services',
                        'background_color' => '#f8fafc',
                        'show_view_all' => true,
                        'max_display' => 6
                    ],
                    [
                        'key' => 'plans',
                        'title' => 'Choose Your Plan',
                        'subtitle' => 'Start with our free plan and upgrade as you grow.',
                        'faq_text' => 'Have questions about our plans? Contact our sales team'
                    ],
                    [
                        'key' => 'faq',
                        'title' => 'Frequently Asked Questions',
                        'subtitle' => 'Got questions? We\'ve got answers.',
                        'cta_text' => 'Still have questions?',
                        'button_text' => 'Contact Support',
                        'faqs' => [
                            ['question' => 'How does StoreGo work?', 'answer' => 'StoreGo allows you to create and manage multiple online stores from a single dashboard with different themes and products.']
                        ]
                    ],
                    [
                        'key' => 'newsletter',
                        'title' => 'Stay Updated with StoreGo',
                        'subtitle' => 'Get the latest e-commerce tips and platform updates.',
                        'privacy_text' => 'No spam, unsubscribe at any time.',
                        'benefits' => [
                            ['icon' => '📧', 'title' => 'Weekly Updates', 'description' => 'Latest features and improvements']
                        ]
                    ],
                    [
                        'key' => 'contact',
                        'title' => 'Get in Touch',
                        'subtitle' => 'Have questions about StoreGo? We\'d love to hear from you.',
                        'form_title' => 'Send us a Message',
                        'info_title' => 'Contact Information',
                        'info_description' => 'We\'re here to help and answer any question you might have.',
                        'layout' => 'split',
                        'background_color' => '#f9fafb'
                    ],
                    [
                        'key' => 'footer',
                        'description' => 'Empowering entrepreneurs with powerful multi-store e-commerce solutions.',
                        'newsletter_title' => 'Stay Updated',
                        'newsletter_subtitle' => 'Join our newsletter for updates',
                        'links' => [
                            'product' => [['name' => 'Features', 'href' => '#features'], ['name' => 'Pricing', 'href' => '#pricing']],
                            'company' => [['name' => 'About Us', 'href' => '#about'], ['name' => 'Contact', 'href' => '#contact']]
                        ],
                        'social_links' => [
                            ['name' => 'Facebook', 'icon' => 'Facebook', 'href' => '#'],
                            ['name' => 'Twitter', 'icon' => 'Twitter', 'href' => '#']
                        ],
                        'section_titles' => [
                            'product' => 'Product',
                            'company' => 'Company'
                        ]
                    ]
                ],
                'theme' => [
                    'primary_color' => '#10b981',
                    'secondary_color' => '#ffffff',
                    'accent_color' => '#f7f7f7',
                    'logo_light' => '',
                    'logo_dark' => '',
                    'favicon' => ''
                ],
                'colors' => [
                    'primary' => '#10b981',
                    'secondary' => '#059669',
                    'accent' => '#065f46'
                ],
                'seo' => [
                    'meta_title' => 'StoreGo - Multi-Store E-commerce Platform',
                    'meta_description' => 'Create and manage multiple online stores with StoreGo. 30+ payment gateways, beautiful themes, and powerful features.',
                    'meta_keywords' => 'ecommerce platform, online store builder, multi-store management, sell online'
                ],
                'custom_css' => '',
                'custom_js' => '',
                'section_order' => ['header', 'hero', 'features', 'screenshots', 'why_choose_us', 'templates', 'about', 'team', 'testimonials', 'active_campaigns', 'plans', 'faq', 'newsletter', 'contact', 'footer'],
                'section_visibility' => [
                    'header' => true,
                    'hero' => true,
                    'features' => true,
                    'screenshots' => true,
                    'why_choose_us' => true,
                    'templates' => true,
                    'about' => true,
                    'team' => true,
                    'testimonials' => true,
                    'active_campaigns' => true,
                    'plans' => true,
                    'faq' => true,
                    'newsletter' => true,
                    'contact' => true,
                    'footer' => true
                ]
            ];
            
            $settings = self::create([
                'config_sections' => $defaultConfig
            ]);
        }
        
        return $settings;
    }
}