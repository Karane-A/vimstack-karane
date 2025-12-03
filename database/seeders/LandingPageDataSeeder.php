<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;
use App\Models\Newsletter;
use Carbon\Carbon;

class LandingPageDataSeeder extends Seeder
{
    public function run()
    {
        if (!config('app.is_demo', false)) {
            return;
        }
        
        $this->seedContacts();
        $this->seedNewsletterSubscribers();
    }
    
    private function seedContacts()
    {
        $contacts = [
            ['name' => 'John Smith', 'email' => 'john.smith@example.com', 'subject' => 'Question about pricing plans', 'message' => 'Hi, I would like to know more about your premium pricing plans and what features are included.'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah.j@gmail.com', 'subject' => 'Technical support needed', 'message' => 'I am having trouble setting up my online store. Could you please help me with the initial configuration?'],
            ['name' => 'Mike Davis', 'email' => 'mike.davis@yahoo.com', 'subject' => 'Partnership inquiry', 'message' => 'We are interested in exploring partnership opportunities with your platform. Please contact us to discuss further.'],
            ['name' => 'Emily Wilson', 'email' => 'emily.wilson@hotmail.com', 'subject' => 'Feature request', 'message' => 'It would be great if you could add multi-language support for product descriptions. This would help us reach international customers.'],
            ['name' => 'David Brown', 'email' => 'david.brown@outlook.com', 'subject' => 'Payment gateway integration', 'message' => 'Can you help us integrate additional payment gateways for our store? We need support for local payment methods.'],
            ['name' => 'Lisa Garcia', 'email' => 'lisa.garcia@example.org', 'subject' => 'Migration assistance', 'message' => 'We want to migrate our existing e-commerce store to your platform. What is the process and timeline for migration?'],
            ['name' => 'Robert Miller', 'email' => 'robert.miller@gmail.com', 'subject' => 'Custom domain setup', 'message' => 'I need help setting up a custom domain for my store. The documentation is not clear about DNS configuration.'],
            ['name' => 'Jennifer Taylor', 'email' => 'jennifer.taylor@yahoo.com', 'subject' => 'Bulk product import', 'message' => 'How can I import a large number of products (500+) to my store? Is there a CSV import feature available?'],
            ['name' => 'Christopher Anderson', 'email' => 'chris.anderson@hotmail.com', 'subject' => 'API documentation', 'message' => 'Where can I find detailed API documentation? I want to integrate your platform with our existing inventory system.'],
            ['name' => 'Amanda Martinez', 'email' => 'amanda.martinez@example.com', 'subject' => 'Theme customization', 'message' => 'Is it possible to customize the existing themes or create a completely custom design for our brand?'],
            ['name' => 'Daniel Rodriguez', 'email' => 'daniel.rodriguez@gmail.com', 'subject' => 'SEO optimization', 'message' => 'What SEO features are available? Can we customize meta tags, URLs, and implement structured data?'],
            ['name' => 'Jessica Thompson', 'email' => 'jessica.thompson@outlook.com', 'subject' => 'Mobile app development', 'message' => 'Do you provide mobile app development services for stores created on your platform?'],
            ['name' => 'Matthew White', 'email' => 'matthew.white@yahoo.com', 'subject' => 'Analytics and reporting', 'message' => 'What kind of analytics and reporting features are available? Can we export sales data for external analysis?'],
            ['name' => 'Ashley Clark', 'email' => 'ashley.clark@example.org', 'subject' => 'Inventory management', 'message' => 'How does the inventory management system work? Can we set up automatic low stock alerts?'],
            ['name' => 'Joshua Lewis', 'email' => 'joshua.lewis@hotmail.com', 'subject' => 'Multi-store management', 'message' => 'Can we manage multiple stores from a single dashboard? What are the limitations for multi-store setup?'],
            ['name' => 'Michelle Harris', 'email' => 'michelle.harris@gmail.com', 'subject' => 'Customer support tools', 'message' => 'What customer support tools are integrated? Do you have live chat, helpdesk, or ticketing system features?'],
            ['name' => 'Andrew Walker', 'email' => 'andrew.walker@example.com', 'subject' => 'Shipping configuration', 'message' => 'How can we set up different shipping rates for different regions? Is there support for real-time shipping calculations?'],
            ['name' => 'Nicole Young', 'email' => 'nicole.young@yahoo.com', 'subject' => 'Tax calculation', 'message' => 'Does the platform handle automatic tax calculations based on customer location? We need compliance with various tax regulations.'],
            ['name' => 'Ryan King', 'email' => 'ryan.king@outlook.com', 'subject' => 'Backup and security', 'message' => 'What backup and security measures are in place? How often are backups created and where are they stored?'],
            ['name' => 'Stephanie Wright', 'email' => 'stephanie.wright@hotmail.com', 'subject' => 'Training and onboarding', 'message' => 'Do you provide training sessions for new users? We have a team that needs to learn how to use the platform effectively.'],
            ['name' => 'Kevin Lopez', 'email' => 'kevin.lopez@example.org', 'subject' => 'Performance optimization', 'message' => 'Our store is loading slowly. Can you help us optimize the performance and improve page load times?'],
            ['name' => 'Rachel Hill', 'email' => 'rachel.hill@gmail.com', 'subject' => 'Social media integration', 'message' => 'How can we integrate our store with social media platforms for better marketing and customer engagement?'],
            ['name' => 'Brandon Scott', 'email' => 'brandon.scott@yahoo.com', 'subject' => 'Discount and coupon system', 'message' => 'What options are available for creating discounts and coupons? Can we set up automatic promotional campaigns?'],
            ['name' => 'Samantha Green', 'email' => 'samantha.green@example.com', 'subject' => 'Email marketing integration', 'message' => 'Can we integrate with email marketing platforms like Mailchimp or Constant Contact for automated campaigns?'],
            ['name' => 'Tyler Adams', 'email' => 'tyler.adams@hotmail.com', 'subject' => 'Product review system', 'message' => 'Is there a built-in product review and rating system? How can customers leave feedback on purchased items?']
        ];

        foreach ($contacts as $contact) {
            $createdAt = Carbon::now()->subDays(rand(1, 60));
            
            Contact::create([
                'name' => $contact['name'],
                'email' => $contact['email'],
                'subject' => $contact['subject'],
                'message' => $contact['message'],
                'is_landing_page' => true,
                'created_at' => $createdAt,
                'updated_at' => $createdAt
            ]);
        }
    }
    
    private function seedNewsletterSubscribers()
    {
        $subscribers = [
            ['email' => 'john.doe@example.com', 'status' => 'active'],
            ['email' => 'jane.smith@gmail.com', 'status' => 'active'],
            ['email' => 'mike.johnson@yahoo.com', 'status' => 'unsubscribed'],
            ['email' => 'sarah.wilson@hotmail.com', 'status' => 'active'],
            ['email' => 'david.brown@outlook.com', 'status' => 'active'],
            ['email' => 'lisa.davis@example.org', 'status' => 'active'],
            ['email' => 'robert.miller@gmail.com', 'status' => 'unsubscribed'],
            ['email' => 'emily.garcia@yahoo.com', 'status' => 'active'],
            ['email' => 'james.martinez@hotmail.com', 'status' => 'active'],
            ['email' => 'maria.rodriguez@example.com', 'status' => 'active'],
            ['email' => 'william.lopez@gmail.com', 'status' => 'active'],
            ['email' => 'jennifer.gonzalez@outlook.com', 'status' => 'unsubscribed'],
            ['email' => 'michael.anderson@yahoo.com', 'status' => 'active'],
            ['email' => 'jessica.taylor@example.org', 'status' => 'active'],
            ['email' => 'christopher.thomas@gmail.com', 'status' => 'active'],
            ['email' => 'amanda.jackson@hotmail.com', 'status' => 'active'],
            ['email' => 'daniel.white@example.com', 'status' => 'unsubscribed'],
            ['email' => 'ashley.harris@yahoo.com', 'status' => 'active'],
            ['email' => 'matthew.martin@outlook.com', 'status' => 'active'],
            ['email' => 'stephanie.thompson@gmail.com', 'status' => 'active'],
            ['email' => 'joshua.garcia@example.org', 'status' => 'active'],
            ['email' => 'michelle.clark@hotmail.com', 'status' => 'active'],
            ['email' => 'andrew.rodriguez@yahoo.com', 'status' => 'unsubscribed'],
            ['email' => 'nicole.lewis@example.com', 'status' => 'active'],
            ['email' => 'ryan.lee@gmail.com', 'status' => 'active']
        ];

        foreach ($subscribers as $subscriber) {
            $createdAt = Carbon::now()->subDays(rand(1, 90));
            
            Newsletter::create([
                'email' => $subscriber['email'],
                'status' => $subscriber['status'],
                'subscribed_at' => $subscriber['status'] === 'active' ? $createdAt : $createdAt->subDays(rand(1, 30)),
                'unsubscribed_at' => $subscriber['status'] === 'unsubscribed' ? $createdAt->addDays(rand(1, 60)) : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt
            ]);
        }
    }
}