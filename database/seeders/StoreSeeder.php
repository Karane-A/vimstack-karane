<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\StoreConfiguration;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        // Get all company users
        $companyUsers = User::where('type', 'company')->get();
        
        if ($companyUsers->isEmpty()) {
            $this->command->error('No company users found. Please run UserSeeder first.');
            return;
        }

        if (config('app.is_demo')) {
            $this->createDemoStores($companyUsers);
        } else {
            $this->createMainVersionStore($companyUsers);
        }
    }

    private function createDemoStores($companyUsers)
    {
        $storeTemplates = [
            [
                'name' => 'Home Decor Haven',
                'description' => 'Beautiful home decor items, furniture, and accessories to transform your living space.',
                'email_suffix' => 'homedecor.com',
                'theme' => 'home-accessories',
            ],
            [
                'name' => 'Fashion Forward Boutique',
                'description' => 'Trendy fashion and accessories for the modern lifestyle. Discover your unique style.',
                'email_suffix' => 'fashionforward.com',
                'theme' => 'fashion',
            ],
            [
                'name' => 'TechHub Electronics',
                'description' => 'Your one-stop destination for cutting-edge electronics, gadgets, and tech accessories.',
                'email_suffix' => 'techhub.com',
                'theme' => 'electronics',
            ],
            [
                'name' => 'Beauty Bliss Cosmetics',
                'description' => 'Premium beauty products and cosmetics for your daily skincare and makeup routine.',
                'email_suffix' => 'blisscosmetics.com',
                'theme' => 'beauty-cosmetics',
            ],
            [
                'name' => 'Elegant Jewelry Collection',
                'description' => 'Exquisite jewelry pieces and accessories for every special occasion.',
                'email_suffix' => 'elegantjewelry.com',
                'theme' => 'jewelry',
            ],
            [
                'name' => 'Luxury Timepieces',
                'description' => 'Premium watches and timepieces from renowned brands worldwide.',
                'email_suffix' => 'luxurytimepieces.com',
                'theme' => 'watches',
            ],
            [
                'name' => 'Modern Furniture Studio',
                'description' => 'Contemporary furniture and interior design solutions for modern living spaces.',
                'email_suffix' => 'modernfurniture.com',
                'theme' => 'furniture-interior',
            ],
            [
                'name' => 'AutoMax Car Dealership',
                'description' => 'Premium automotive sales and services for all your vehicle needs.',
                'email_suffix' => 'automax.com',
                'theme' => 'cars-automotive',
            ],
            [
                'name' => 'Kids Wonder Toys',
                'description' => 'Educational and fun toys that inspire creativity and learning for children of all ages.',
                'email_suffix' => 'kidswonder.com',
                'theme' => 'baby-kids',
            ],
            [
                'name' => 'Essence Perfume Gallery',
                'description' => 'Luxury fragrances and perfumes from top international brands.',
                'email_suffix' => 'essencegallery.com',
                'theme' => 'perfume-fragrances',
            ],
        ];

        foreach ($companyUsers as $companyIndex => $companyUser) {
            $firstStore = null;
            
            // Check if user already has stores (client has added their own data)
            $existingStores = Store::where('user_id', $companyUser->id)->count();
            
            if ($existingStores > 0) {
                $this->command->info('Stores already exist for user: ' . $companyUser->email . '. Skipping to preserve client data.');
                continue;
            }
            
            // For first company (company@example.com), create all stores
            if ($companyUser->email === 'company@example.com') {
                foreach ($storeTemplates as $index => $storeTemplate) {
                    $storeName = $storeTemplate['name'];
                    $slug = Store::generateUniqueSlug($storeName);
                    $emailPrefixes = ['design@', 'hello@', 'info@', 'beauty@', 'info@', 'orders@', 'studio@', 'sales@', 'play@', 'fragrance@'];
                    $emailPrefix = $emailPrefixes[$index] ?? 'store@';
                    $email = $emailPrefix . $storeTemplate['email_suffix'];
                    
                    $daysAgo = ($companyIndex * 10) + $index + rand(30, 120);
                    $createdAt = Carbon::now()->subDays($daysAgo);
                    
                    $store = Store::create([
                        'name' => $storeName,
                        'slug' => $slug,
                        'description' => $storeTemplate['description'],
                        'theme' => $storeTemplate['theme'],
                        'user_id' => $companyUser->id,
                        'email' => $email,
                        'is_active' => true,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);
                    
                    if (!$firstStore) {
                        $firstStore = $store;
                    }
                }
            } else {
                // For other companies, randomly assign a store template
                $randomIndex = array_rand($storeTemplates);
                $storeTemplate = $storeTemplates[$randomIndex];
                
                // Use same store name, but generate unique slug
                $storeName = $storeTemplate['name'];
                $slug = Store::generateUniqueSlug($storeName);
                
                $emailPrefixes = ['design', 'hello', 'info', 'beauty', 'orders', 'studio', 'sales', 'play', 'fragrance', 'shop'];
                $emailPrefix = $emailPrefixes[$randomIndex] ?? 'store';
                $email = $emailPrefix . $companyUser->id . '@' . $storeTemplate['email_suffix'];
                
                $daysAgo = ($companyIndex * 10) + rand(30, 120);
                $createdAt = Carbon::now()->subDays($daysAgo);
                
                $store = Store::create([
                    'name' => $storeName,
                    'slug' => $slug,
                    'description' => $storeTemplate['description'],
                    'theme' => $storeTemplate['theme'],
                    'user_id' => $companyUser->id,
                    'email' => $email,
                    'is_active' => true,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
                
                $firstStore = $store;
            }
            
            // Set current_store to first created store
            if ($firstStore) {
                $companyUser->update(['current_store' => $firstStore->id]);
            }
        }

        // Set up store configurations for all stores by theme
        $themeConfigurations = [
            'cars-automotive' => [
                'favicon' => '/storage/media/1/favicon-cars-automotive.png',
                'logo' => '/storage/media/2/header-logo-cars-automotive.png'
            ],
            'beauty-cosmetics' => [
                'favicon' => '/storage/media/10/favicon-beauty-cosmetics.png',
                'logo' => '/storage/media/11/header-logo-beauty-cosmetics.png'
            ],
            'jewelry' => [
                'favicon' => '/storage/media/19/favicon-jewelry.png',
                'logo' => '/storage/media/20/header-logo-jewelry.png'
            ],
            'perfume-fragrances' => [
                'favicon' => '/storage/media/26/favicon-perfume-fragrances.png',
                'logo' => '/storage/media/27/header-logo-perfume-fragrances.png'
            ],
            'fashion' => [
                'favicon' => '/storage/media/34/favicon-fashion.png',
                'logo' => '/storage/media/35/header-logo-fashion.png'
            ],
            'home-accessories' => [
                'favicon' => '/storage/media/41/favicon-home-accessories.png',
                'logo' => '/storage/media/42/header-logo-home-accessories.png'
            ],
            'baby-kids' => [
                'favicon' => '/storage/media/50/favicon-baby-kids.png',
                'logo' => '/storage/media/51/header-logo-baby-kids.png'
            ],
            'watches' => [
                'favicon' => '/storage/media/59/favicon-watches.png',
                'logo' => '/storage/media/60/header-logo-watches.png'
            ],
            'furniture-interior' => [
                'favicon' => '/storage/media/68/favicon-furniture-interior.png',
                'logo' => '/storage/media/69/header-logo-furniture-interior.png'
            ],
            'electronics' => [
                'favicon' => '/storage/media/77/favicon-electronics.png',
                'logo' => '/storage/media/78/header-logo-electronics.png'
            ],
        ];
        
        // Apply configurations to all stores of each theme
        foreach ($themeConfigurations as $theme => $config) {
            $stores = Store::where('theme', $theme)->get();
            foreach ($stores as $store) {
                StoreConfiguration::updateConfiguration($store->id, $config);
            }
        }

    }

    private function createMainVersionStore($companyUsers)
    {
        // Find company@example.com user
        $companyUser = $companyUsers->where('email', 'company@example.com')->first();
        
        if (!$companyUser) {
            $this->command->error('company@example.com user not found.');
            return;
        }

        // Check if user already has stores (client has added their own data)
        $existingStores = Store::where('user_id', $companyUser->id)->count();
        
        if ($existingStores > 0) {
            $this->command->info('Stores already exist for company@example.com. Skipping store creation to preserve client data.');
            return;
        }

        // Create only one store for main version
        $storeName = 'Home Decor Haven';
        $slug = Store::generateUniqueSlug($storeName);
        $email = 'design@homedecor.com';
        
        $store = Store::create([
            'name' => $storeName,
            'slug' => $slug,
            'description' => 'Beautiful home decor items, furniture, and accessories to transform your living space.',
            'theme' => 'home-accessories',
            'user_id' => $companyUser->id,
            'email' => $email,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Set current_store
        $companyUser->update(['current_store' => $store->id]);
        
        // Set up store configuration
        $config = [
            'favicon' => '/storage/media/41/favicon-home-accessories.png',
            'logo' => '/storage/media/42/header-logo-home-accessories.png'
        ];
        StoreConfiguration::updateConfiguration($store->id, $config);

        $this->command->info('Created 1 store for main version: ' . $storeName);
    }
}