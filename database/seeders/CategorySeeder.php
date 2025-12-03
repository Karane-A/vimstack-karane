<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        if (config('app.is_demo')) {
            $this->createDemoCategories();
        } else {
            $this->createMainVersionCategories();
        }
    }

    private function createDemoCategories()
    {
        // Get all stores from all companies
        $stores = Store::all();
        
        if ($stores->isEmpty()) {
            $this->command->error('No stores found for first company.');
            return;
        }

        foreach ($stores as $store) {
            // Check if categories already exist for this store (client has added their own data)
            $existingCategories = Category::where('store_id', $store->id)->count();
            
            if ($existingCategories > 0) {
                $this->command->info('Categories already exist for store: ' . $store->name . '. Skipping to preserve client data.');
                continue;
            }
            
            $categories = $this->getCategoriesForStore($store->name);
            
            foreach ($categories as $categoryData) {
                $slug = \Illuminate\Support\Str::slug($categoryData['name']);
                $count = Category::where('slug', 'LIKE', $slug . '%')->count();
                $uniqueSlug = $count > 0 ? "{$slug}-{$count}" : $slug;
                
                $category = Category::create([
                    'name' => $categoryData['name'],
                    'slug' => $uniqueSlug,
                    'description' => $categoryData['description'],
                    'store_id' => $store->id,
                    'sort_order' => $categoryData['sort_order'],
                    'is_active' => true,
                    'image' => $this->getCategoryImage($store->name, $categoryData['name']),
                ]);
            }
        }

    }

    private function createMainVersionCategories()
    {
        // Get only the single store for company@example.com
        $store = Store::whereHas('user', function($query) {
            $query->where('email', 'company@example.com');
        })->first();

        if (!$store) {
            $this->command->error('No store found for company@example.com');
            return;
        }

        // Check if categories already exist for this store (client has added their own data)
        $existingCategories = Category::where('store_id', $store->id)->count();
        
        if ($existingCategories > 0) {
            $this->command->info('Categories already exist for store: ' . $store->name . '. Skipping to preserve client data.');
            return;
        }

        // Create only first 5 categories for main version
        $categories = array_slice($this->getCategoriesForStore($store->name), 0, 5);
        
        foreach ($categories as $categoryData) {
            $slug = \Illuminate\Support\Str::slug($categoryData['name']);
            $count = Category::where('slug', 'LIKE', $slug . '%')->count();
            $uniqueSlug = $count > 0 ? "{$slug}-{$count}" : $slug;
            
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => $uniqueSlug,
                'description' => $categoryData['description'],
                'store_id' => $store->id,
                'sort_order' => $categoryData['sort_order'],
                'is_active' => true,
                'image' => $this->getCategoryImage($store->name, $categoryData['name']),
            ]);
        }

        $this->command->info('Created ' . count($categories) . ' categories for main version.');
    }

    private function getCategoryImage($storeName, $categoryName): ?string
    {
        $categoryImageMap = [
            'Home Decor Haven' => [
                'Bathroom Decor' => 'storage/media/1236/conversions/bathroom-decor-thumb.png',
                'Furniture' => 'storage/media/1237/conversions/furniture-thumb.png',
                'Kitchen & Dining Decor' => 'storage/media/1238/conversions/kitchen-dining-decor-thumb.png',
                'Lighting' => 'storage/media/1239/conversions/lighting-thumb.png',
                'Outdoor & Garden Decor' => 'storage/media/1240/conversions/outdoor-garden-decor-thumb.png',
            ],
            'Fashion Forward Boutique' => [
                'Women\'s Fashion' => 'storage/media/1241/conversions/collection-thumb.png',
                'Men\'s Fashion' => 'storage/media/1242/conversions/collection-thumb.png',
                'Kids Fashion' => 'storage/media/1243/conversions/collection-thumb.png',
                'Beauty' => 'storage/media/1244/conversions/collection-thumb.png',
                'Accessories' => 'storage/media/1245/conversions/collection-thumb.png',
            ],
            'TechHub Electronics' => [
                'Smartphone' => 'storage/media/1249/conversions/smartphone-thumb.png',
                'Laptop' => 'storage/media/1248/conversions/laptop-thumb.png',
                'Headphone' => 'storage/media/1247/conversions/headphone-thumb.png',
                'Watches' => 'storage/media/1250/conversions/watches-thumb.png',
                'Camera' => 'storage/media/1246/conversions/camera-thumb.png',
            ],
            'Beauty Bliss Cosmetics' => [
                'Skincare' => 'storage/media/1251/conversions/collection-thumb.png',
                'Makeup' => 'storage/media/1252/conversions/collection-thumb.png',
                'Hair Care' => 'storage/media/1253/conversions/collection-thumb.png',
                'Fragrances' => 'storage/media/1254/conversions/collection-thumb.png',
                'Beauty Tools & Accessories' => 'storage/media/1255/conversions/collection-thumb.png',
            ],
            'Elegant Jewelry Collection' => [
                'Necklace' => 'storage/media/1259/conversions/necklace-thumb.png',
                'Earring' => 'storage/media/1258/conversions/earring-thumb.png',
                'Ring' => 'storage/media/1260/conversions/ring-thumb.png',
                'Bracelet' => 'storage/media/1256/conversions/bracelet-thumb.png',
                'Brooch' => 'storage/media/1257/conversions/brooch-thumb.png',
            ],
            'Luxury Timepieces' => [
                'Mechanical Watch' => 'storage/media/1261/conversions/collection-thumb.png',
                'Men' => 'storage/media/1262/conversions/collection-thumb.png',
                'Smart Watch' => 'storage/media/1263/conversions/collection-thumb.png',
                'Women' => 'storage/media/1264/conversions/collection-thumb.png',
                'Couple Watch' => 'storage/media/1265/conversions/collection-thumb.png',
            ],
            'Modern Furniture Studio' => [
                'Living Room Furniture' => 'storage/media/1269/conversions/living-room-furniture-thumb.png',
                'Bedroom Furniture' => 'storage/media/1266/conversions/bedroom-furniture-thumb.png',
                'Luxury' => 'storage/media/1270/conversions/luxury-thumb.png',
                'Home Decor' => 'storage/media/1267/conversions/home-decor-thumb.png',
                'Lamps and Lighting' => 'storage/media/1268/conversions/lamps-lighting-thumb.png',
            ],
            'AutoMax Car Dealership' => [
                'Seat Covers' => 'storage/media/1274/conversions/seat-covers-thumb.png',
                'Car Cover' => 'storage/media/1272/conversions/car-cover-thumb.png',
                'Mag Wheel' => 'storage/media/1273/conversions/mag-wheel-thumb.png',
                'Brake Light' => 'storage/media/1271/conversions/brake-light-thumb.png',
                'Tyre Inflator' => 'storage/media/1275/conversions/tyre-inflator-thumb.png',
            ],
            'Kids Wonder Toys' => [
                'Kids Toy' => 'storage/media/1280/conversions/kids-toy-thumb.png',
                'Kids Clothing' => 'storage/media/1277/conversions/kids-collection-thumb.png',
                'Kids Footwear' => 'storage/media/1278/conversions/kids-footwear-thumb.png',
                'Kids Accessories' => 'storage/media/1276/conversions/kids-accessories-thumb.png',
                'Kids Nursery' => 'storage/media/1279/conversions/kids-nursery-thumb.png',
            ],
            'Essence Perfume Gallery' => [
                'Women Perfume' => 'storage/media/1285/conversions/women-perfume-thumb.png',
                'Mens Perfume' => 'storage/media/1282/conversions/mens-perfume-thumb.png',
                'Solid Perfume' => 'storage/media/1284/conversions/solid-perfume-thumb.png',
                'Body Mist Perfume' => 'storage/media/1281/conversions/body-mist-perfume-thumb.png',
                'Pocket Perfume' => 'storage/media/1283/conversions/pocket-perfume-thumb.png',
            ],
        ];

        return $categoryImageMap[$storeName][$categoryName] ?? null;
    }

    private function getCategoriesForStore($storeName): array
    {
        $categoriesMap = [
            'Home Decor Haven' => [
                ['name' => 'Bathroom Decor', 'description' => 'Stylish bathroom accessories and decor items', 'sort_order' => 1],
                ['name' => 'Furniture', 'description' => 'Quality furniture for every room', 'sort_order' => 2],
                ['name' => 'Kitchen & Dining Decor', 'description' => 'Kitchen and dining room essentials', 'sort_order' => 3],
                ['name' => 'Lighting', 'description' => 'Beautiful lighting solutions for your home', 'sort_order' => 4],
                ['name' => 'Outdoor & Garden Decor', 'description' => 'Outdoor and garden decoration items', 'sort_order' => 5],
            ],
            'Fashion Forward Boutique' => [
                ['name' => 'Women\'s Fashion', 'description' => 'Women\'s clothing and fashion items', 'sort_order' => 1],
                ['name' => 'Men\'s Fashion', 'description' => 'Men\'s clothing and fashion items', 'sort_order' => 2],
                ['name' => 'Kids Fashion', 'description' => 'Kids clothing and fashion items', 'sort_order' => 3],
                ['name' => 'Beauty', 'description' => 'Beauty and cosmetic products', 'sort_order' => 4],
                ['name' => 'Accessories', 'description' => 'Fashion accessories and jewelry', 'sort_order' => 5],
            ],
            'TechHub Electronics' => [
                ['name' => 'Smartphone', 'description' => 'Latest smartphones and mobile devices', 'sort_order' => 1],
                ['name' => 'Laptop', 'description' => 'Gaming and business laptops', 'sort_order' => 2],
                ['name' => 'Headphone', 'description' => 'Headphones and audio equipment', 'sort_order' => 3],
                ['name' => 'Watches', 'description' => 'Smart watches and wearables', 'sort_order' => 4],
                ['name' => 'Camera', 'description' => 'Cameras and photography equipment', 'sort_order' => 5],
            ],
            'Beauty Bliss Cosmetics' => [
                ['name' => 'Skincare', 'description' => 'Face care and skincare products', 'sort_order' => 1],
                ['name' => 'Makeup', 'description' => 'Cosmetics and beauty products', 'sort_order' => 2],
                ['name' => 'Hair Care', 'description' => 'Shampoos, conditioners, and styling products', 'sort_order' => 3],
                ['name' => 'Fragrances', 'description' => 'Perfumes and body sprays', 'sort_order' => 4],
                ['name' => 'Beauty Tools & Accessories', 'description' => 'Beauty tools and makeup brushes', 'sort_order' => 5],
            ],
            'Elegant Jewelry Collection' => [
                ['name' => 'Necklace', 'description' => 'Elegant necklaces and pendants', 'sort_order' => 1],
                ['name' => 'Earring', 'description' => 'Beautiful earrings for every occasion', 'sort_order' => 2],
                ['name' => 'Ring', 'description' => 'Stunning rings and wedding bands', 'sort_order' => 3],
                ['name' => 'Bracelet', 'description' => 'Stylish bracelets and bangles', 'sort_order' => 4],
                ['name' => 'Brooch', 'description' => 'Luxury brooches and pins', 'sort_order' => 5],
            ],
            'Luxury Timepieces' => [
                ['name' => 'Mechanical Watch', 'description' => 'Premium mechanical watch brands', 'sort_order' => 1],
                ['name' => 'Men', 'description' => 'Men\'s luxury timepieces', 'sort_order' => 2],
                ['name' => 'Smart Watch', 'description' => 'Digital and smart watches', 'sort_order' => 3],
                ['name' => 'Women', 'description' => 'Women\'s luxury watches', 'sort_order' => 4],
                ['name' => 'Couple Watch', 'description' => 'Matching couple watch sets', 'sort_order' => 5],
            ],
            'Modern Furniture Studio' => [
                ['name' => 'Living Room Furniture', 'description' => 'Sofas, chairs, and living room furniture', 'sort_order' => 1],
                ['name' => 'Bedroom Furniture', 'description' => 'Beds, dressers, and bedroom sets', 'sort_order' => 2],
                ['name' => 'Luxury', 'description' => 'Luxury furniture and dining sets', 'sort_order' => 3],
                ['name' => 'Home Decor', 'description' => 'Home decor and accessories', 'sort_order' => 4],
                ['name' => 'Lamps and Lighting', 'description' => 'Lighting solutions and lamps', 'sort_order' => 5],
            ],
            'AutoMax Car Dealership' => [
                ['name' => 'Seat Covers', 'description' => 'Car seat covers and protection', 'sort_order' => 1],
                ['name' => 'Car Cover', 'description' => 'Car covers and protection', 'sort_order' => 2],
                ['name' => 'Mag Wheel', 'description' => 'Wheels and rims', 'sort_order' => 3],
                ['name' => 'Brake Light', 'description' => 'Brake lights and car lighting', 'sort_order' => 4],
                ['name' => 'Tyre Inflator', 'description' => 'Tire inflators and accessories', 'sort_order' => 5],
            ],
            'Kids Wonder Toys' => [
                ['name' => 'Kids Toy', 'description' => 'Educational and fun toys for kids', 'sort_order' => 1],
                ['name' => 'Kids Clothing', 'description' => 'Kids clothing and apparel', 'sort_order' => 2],
                ['name' => 'Kids Footwear', 'description' => 'Kids shoes and footwear', 'sort_order' => 3],
                ['name' => 'Kids Accessories', 'description' => 'Kids accessories and items', 'sort_order' => 4],
                ['name' => 'Kids Nursery', 'description' => 'Nursery and baby care items', 'sort_order' => 5],
            ],
            'Essence Perfume Gallery' => [
                ['name' => 'Women Perfume', 'description' => 'Perfumes and fragrances for women', 'sort_order' => 1],
                ['name' => 'Mens Perfume', 'description' => 'Colognes and fragrances for men', 'sort_order' => 2],
                ['name' => 'Solid Perfume', 'description' => 'Solid perfumes and balms', 'sort_order' => 3],
                ['name' => 'Body Mist Perfume', 'description' => 'Body mists and light fragrances', 'sort_order' => 4],
                ['name' => 'Pocket Perfume', 'description' => 'Travel size and pocket perfumes', 'sort_order' => 5],
            ],
        ];

        return $categoriesMap[$storeName] ?? $categoriesMap['Home Decor Haven'];
    }
}