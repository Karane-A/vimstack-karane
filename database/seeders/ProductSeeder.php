<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Store;
use App\Models\Category;
use App\Models\Tax;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        if (config('app.is_demo')) {
            $this->createDemoProducts();
        } else {
            $this->createMainVersionProducts();
        }
    }

    private function createDemoProducts()
    {
        // Get all stores from all companies
        $stores = Store::all();

        foreach ($stores as $store) {
            // Check if products already exist for this store (client has added their own data)
            $existingProducts = Product::where('store_id', $store->id)->count();
            
            if ($existingProducts > 0) {
                $this->command->info('Products already exist for store: ' . $store->name . '. Skipping to preserve client data.');
                continue;
            }
            
            $categories = Category::where('store_id', $store->id)->get();
            $standardTax = Tax::where('store_id', $store->id)
                              ->where('name', 'Standard VAT')
                              ->first();

            foreach ($categories as $category) {
                // Create exactly 5 products for each category
                for ($i = 0; $i < 5; $i++) {
                    $images = $this->getProductImages($store->name, $category->name, $i);
                    $productName = $this->getProductName($store->name, $category->name, $i);
                    
                    $price = rand(20, 500) + 0.99;
                    $basePrice = (int)$price;
                    
                    $sale_price = null;
                    
                    if (rand(1, 2) == 1 && ($basePrice - 5) >= 15) {
                        $sale_price = rand(15, $basePrice - 5) + 0.99;
                    }
                    
                    Product::create([
                        'name' => $productName,
                        'sku' => $this->generateSKU($store->id, $category->id),
                        'description' => "High quality {$productName} for your needs",
                        'specifications' => $this->getProductSpecifications($store->name, $category->name, $productName),
                        'details' => $this->getProductDetails($store->name, $category->name, $productName),
                        'price' => $price,
                        'sale_price' => $sale_price,
                        'stock' => rand(1, 100),
                        'category_id' => $category->id,
                        'tax_id' => $standardTax?->id,
                        'store_id' => $store->id,
                        'cover_image' => $images['cover'] ?? null,
                        'images' => $images['gallery'] ?? null,
                        'variants' => $this->getProductVariants($productName),
                        'is_active' => true,
                    ]);
                }
            }
        }

    }

    private function createMainVersionProducts()
    {
        // Get only the single store for company@example.com
        $store = Store::whereHas('user', function($query) {
            $query->where('email', 'company@example.com');
        })->first();

        if (!$store) {
            $this->command->error('No store found for company@example.com');
            return;
        }

        // Check if products already exist for this store (client has added their own data)
        $existingProducts = Product::where('store_id', $store->id)->count();
        
        if ($existingProducts > 0) {
            $this->command->info('Products already exist for store: ' . $store->name . '. Skipping to preserve client data.');
            return;
        }

        $categories = Category::where('store_id', $store->id)->get();
        $standardTax = Tax::where('store_id', $store->id)
                          ->where('name', 'Standard VAT')
                          ->first();

        // Create only 4-5 products total (not per category)
        $productCount = 0;
        $maxProducts = 5;
        
        foreach ($categories as $category) {
            if ($productCount >= $maxProducts) break;
            
            // Create 1 product per category, max 5 total
            $images = $this->getProductImages($store->name, $category->name, 0);
            $productName = $this->getProductName($store->name, $category->name, 0);
            
            $price = rand(20, 500) + 0.99;
            $basePrice = (int)$price;
            
            $sale_price = null;
            if (rand(1, 2) == 1 && ($basePrice - 5) >= 15) {
                $sale_price = rand(15, $basePrice - 5) + 0.99;
            }
            
            Product::create([
                'name' => $productName,
                'sku' => $this->generateSKU($store->id, $category->id),
                'description' => "High quality {$productName} for your needs",
                'specifications' => $this->getProductSpecifications($store->name, $category->name, $productName),
                'details' => $this->getProductDetails($store->name, $category->name, $productName),
                'price' => $price,
                'sale_price' => $sale_price,
                'stock' => rand(1, 100),
                'category_id' => $category->id,
                'tax_id' => $standardTax?->id,
                'store_id' => $store->id,
                'cover_image' => $images['cover'] ?? null,
                'images' => $images['gallery'] ?? null,
                'variants' => $this->getProductVariants($productName),
                'is_active' => true,
            ]);
            
            $productCount++;
        }

        $this->command->info('Created ' . $productCount . ' products for main version.');
    }

    private function generateSKU($storeId, $categoryId): string
    {
        return 'S' . $storeId . 'C' . $categoryId . 'P' . rand(1000, 9999);
    }

    private function getProductImages($storeName, $categoryName, $productIndex): array
    {
        // Only handle known store types
        if (!in_array($storeName, ['Home Decor Haven', 'Fashion Forward Boutique', 'TechHub Electronics', 'Beauty Bliss Cosmetics', 'Elegant Jewelry Collection', 'Luxury Timepieces', 'Modern Furniture Studio', 'AutoMax Car Dealership', 'Kids Wonder Toys', 'Essence Perfume Gallery'])) {
            return ['cover' => null, 'gallery' => null];
        }

        if ($storeName === 'Home Decor Haven') {
            $productImageMap = [
                'Bathroom Decor' => [
                ['cover' => '/storage/media/70/bathroom-accessories1.png', 'gallery' => '/storage/media/69/bathroom-accessories2.png,/storage/media/68/bathroom-accessories3.png,/storage/media/67/bathroom-accessories4.png,/storage/media/66/bathroom-accessories5.png'],
                ['cover' => '/storage/media/121/mirrors1.png', 'gallery' => '/storage/media/122/mirrors2.png,/storage/media/123/mirrors3.png,/storage/media/124/mirrors4.png,/storage/media/125/mirrors5.png'],
                ['cover' => '/storage/media/116/shop-dispenser1.png', 'gallery' => '/storage/media/117/shop-dispenser2.png,/storage/media/118/shop-dispenser3.png,/storage/media/119/shop-dispenser4.png,/storage/media/120/shop-dispenser5.png'],
                ['cover' => '/storage/media/115/shower-curtains1.png', 'gallery' => '/storage/media/114/shower-curtains2.png,/storage/media/113/shower-curtains3.png,/storage/media/112/shower-curtains4.png,/storage/media/111/shower-curtains5.png'],
                ['cover' => '/storage/media/110/towels1.png', 'gallery' => '/storage/media/109/towels2.png,/storage/media/108/towels3.png,/storage/media/107/towels4.png,/storage/media/106/towels5.png'],
            ],
            'Furniture' => [
                ['cover' => '/storage/media/105/beds1.png', 'gallery' => '/storage/media/104/beds2.png,/storage/media/103/beds3.png,/storage/media/102/beds4.png,/storage/media/101/beds5.png'],
                ['cover' => '/storage/media/100/cabinets1.png', 'gallery' => '/storage/media/99/cabinets2.png,/storage/media/98/cabinets3.png,/storage/media/97/cabinets4.png,/storage/media/96/cabinets5.png'],
                ['cover' => '/storage/media/95/chairs1.png', 'gallery' => '/storage/media/94/chairs2.png,/storage/media/93/chairs3.png,/storage/media/92/chairs4.png,/storage/media/91/chairs5.png'],
                ['cover' => '/storage/media/90/sofas1.png', 'gallery' => '/storage/media/89/sofas2.png,/storage/media/88/sofas3.png,/storage/media/87/sofas4.png,/storage/media/86/sofas5.png'],
                ['cover' => '/storage/media/85/table1.png', 'gallery' => '/storage/media/84/table2.png,/storage/media/83/table3.png,/storage/media/82/table4.png,/storage/media/81/table5.png'],
            ],
            'Kitchen & Dining Decor' => [
                ['cover' => '/storage/media/80/cookware-bakeware1.png', 'gallery' => '/storage/media/79/cookware-bakeware2.png,/storage/media/78/cookware-bakeware3.png,/storage/media/77/cookware-bakeware4.png,/storage/media/76/cookware-bakeware5.png'],
                ['cover' => '/storage/media/75/dinner-sets1.png', 'gallery' => '/storage/media/74/dinner-sets2.png,/storage/media/73/dinner-sets3.png,/storage/media/72/dinner-sets4.png,/storage/media/71/dinner-sets5.png'],
                ['cover' => '/storage/media/1/placemats1.png', 'gallery' => '/storage/media/2/placemats2.png,/storage/media/3/placemats3.png,/storage/media/4/placemats4.png,/storage/media/5/placemats5.png'],
                ['cover' => '/storage/media/65/serveware1.png', 'gallery' => '/storage/media/64/serveware2.png,/storage/media/63/serveware3.png,/storage/media/62/serveware4.png,/storage/media/61/serveware5.png'],
                ['cover' => '/storage/media/60/table-runners1.png', 'gallery' => '/storage/media/59/table-runners2.png,/storage/media/58/table-runners3.png,/storage/media/56/table-runners5.png'],
            ],
            'Lighting' => [
                ['cover' => '/storage/media/55/ceiling-lights1.png', 'gallery' => '/storage/media/54/ceiling-lights2.png,/storage/media/53/ceiling-lights3.png,/storage/media/52/ceiling-lights4.png,/storage/media/51/ceiling-lights5.png'],
                ['cover' => '/storage/media/50/chandeliers1.png', 'gallery' => '/storage/media/49/chandeliers2.png,/storage/media/48/chandeliers3.png,/storage/media/47/chandeliers4.png,/storage/media/46/chandeliers5.png'],
                ['cover' => '/storage/media/45/fairy-lights1.png', 'gallery' => '/storage/media/44/fairy-lights2.png,/storage/media/43/fairy-lights3.png,/storage/media/42/fairy-lights4.png,/storage/media/41/fairy-lights5.png'],
                ['cover' => '/storage/media/40/lamps1.png', 'gallery' => '/storage/media/39/lamps2.png,/storage/media/38/lamps3.png,/storage/media/37/lamps4.png,/storage/media/36/lamps5.png'],
                ['cover' => '/storage/media/35/table-lamps1.png', 'gallery' => '/storage/media/34/table-lamps2.png,/storage/media/33/table-lamps3.png,/storage/media/32/table-lamps4.png,/storage/media/31/table-lamps5.png'],
            ],
            'Outdoor & Garden Decor' => [
                ['cover' => '/storage/media/30/birdhouse1.png', 'gallery' => '/storage/media/29/birdhouse2.png,/storage/media/28/birdhouse3.png,/storage/media/27/birdhouse4.png,/storage/media/26/birdhouse5.png'],
                ['cover' => '/storage/media/21/fountains1.png', 'gallery' => '/storage/media/22/fountains2.png,/storage/media/23/fountains3.png,/storage/media/24/fountains4.png,/storage/media/25/fountains5.png'],
                ['cover' => '/storage/media/16/lanterns1.png', 'gallery' => '/storage/media/17/lanterns2.png,/storage/media/18/lanterns3.png,/storage/media/19/lanterns4.png,/storage/media/20/lanterns5.png'],
                ['cover' => '/storage/media/11/patio-furniture1.png', 'gallery' => '/storage/media/12/patio-furniture2.png,/storage/media/13/patio-furniture3.png,/storage/media/14/patio-furniture4.png,/storage/media/15/patio-furniture5.png'],
                ['cover' => '/storage/media/6/planters1.png', 'gallery' => '/storage/media/7/planters2.png,/storage/media/8/planters3.png,/storage/media/9/planters4.png,/storage/media/10/planters5.png'],
            ],
            ];
        } elseif ($storeName === 'Fashion Forward Boutique') {
            $productImageMap = [
                'Women\'s Fashion' => [
                    ['cover' => '/storage/media/191/gown1.png', 'gallery' => '/storage/media/192/gown2.png,/storage/media/193/gown3.png,/storage/media/194/gown4.png,/storage/media/195/gown5.png'],
                    ['cover' => '/storage/media/246/footwear1.png', 'gallery' => '/storage/media/247/footwear2.png,/storage/media/248/footwear3.png,/storage/media/249/footwear4.png,/storage/media/250/footwear5.png'],
                    ['cover' => '/storage/media/241/coats1.png', 'gallery' => '/storage/media/242/coats2.png,/storage/media/243/coats3.png,/storage/media/244/coats4.png,/storage/media/245/coats5.png'],
                    ['cover' => '/storage/media/236/kurtis1.png', 'gallery' => '/storage/media/237/kurtis2.png,/storage/media/238/kurtis3.png,/storage/media/239/kurtis4.png,/storage/media/240/kurtis5.png'],
                    ['cover' => '/storage/media/231/tops1.png', 'gallery' => '/storage/media/232/tops2.png,/storage/media/233/tops3.png,/storage/media/234/tops4.png,/storage/media/235/tops5.png'],
                ],
                'Men\'s Fashion' => [
                    ['cover' => '/storage/media/226/footwear1.png', 'gallery' => '/storage/media/227/footwear2.png,/storage/media/228/footwear3.png,/storage/media/229/footwear4.png,/storage/media/230/footwear5.png'],
                    ['cover' => '/storage/media/221/hoodies1.png', 'gallery' => '/storage/media/222/hoodies2.png,/storage/media/223/hoodies3.png,/storage/media/224/hoodies4.png,/storage/media/225/hoodies5.png'],
                    ['cover' => '/storage/media/216/shirt1.png', 'gallery' => '/storage/media/217/shirt2.png,/storage/media/218/shirt3.png,/storage/media/219/shirt4.png,/storage/media/220/shirt5.png'],
                    ['cover' => '/storage/media/211/t-shirt1.png', 'gallery' => '/storage/media/212/t-shirt2.png,/storage/media/213/t-shirt3.png,/storage/media/214/t-shirt4.png,/storage/media/215/t-shirt5.png'],
                    ['cover' => '/storage/media/206/track-suit1.png', 'gallery' => '/storage/media/207/track-suit2.png,/storage/media/208/track-suit3.png,/storage/media/209/track-suit4.png,/storage/media/210/track-suit5.png'],
                ],
                'Kids Fashion' => [
                    ['cover' => '/storage/media/201/footwear1.png', 'gallery' => '/storage/media/202/footwear2.png,/storage/media/203/footwear3.png,/storage/media/204/footwear4.png,/storage/media/205/footwear5.png'],
                    ['cover' => '/storage/media/196/baby-wear1.png', 'gallery' => '/storage/media/197/baby-wear2.png,/storage/media/198/baby-wear3.png,/storage/media/199/baby-wear4.png,/storage/media/200/baby-wear5.png'],
                    ['cover' => '/storage/media/126/suit1.png', 'gallery' => '/storage/media/127/suit2.png,/storage/media/128/suit3.png,/storage/media/129/suit4.png,/storage/media/130/suit5.png'],
                    ['cover' => '/storage/media/186/socks1.png', 'gallery' => '/storage/media/187/socks2.png,/storage/media/188/socks3.png,/storage/media/189/socks4.png,/storage/media/190/socks5.png'],
                    ['cover' => '/storage/media/181/t-shirt1.png', 'gallery' => '/storage/media/182/t-shirt2.png,/storage/media/183/t-shirt3.png,/storage/media/184/t-shirt4.png,/storage/media/185/t-shirt5.png'],
                ],
                'Beauty' => [
                    ['cover' => '/storage/media/176/highlighter1.png', 'gallery' => '/storage/media/177/highlighter2.png,/storage/media/178/highlighter3.png,/storage/media/179/highlighter4.png,/storage/media/180/highlighter5.png'],
                    ['cover' => '/storage/media/171/foundation1.png', 'gallery' => '/storage/media/172/foundation2.png,/storage/media/173/foundation3.png,/storage/media/174/foundation4.png,/storage/media/175/foundation5.png'],
                    ['cover' => '/storage/media/166/blush1.png', 'gallery' => '/storage/media/167/blush2.png,/storage/media/168/blush3.png,/storage/media/169/blush4.png,/storage/media/170/blush5.png'],
                    ['cover' => '/storage/media/161/filler1.png', 'gallery' => '/storage/media/162/filler2.png,/storage/media/163/filler3.png,/storage/media/164/filler4.png,/storage/media/165/filler5.png'],
                    ['cover' => '/storage/media/156/lipstic1.png', 'gallery' => '/storage/media/157/lipstic2.png,/storage/media/158/lipstic3.png,/storage/media/159/lipstic4.png,/storage/media/160/lipstic5.png'],
                ],
                'Accessories' => [
                    ['cover' => '/storage/media/151/bag1.png', 'gallery' => '/storage/media/152/bag2.png,/storage/media/153/bag3.png,/storage/media/154/bag4.png,/storage/media/155/bag5.png'],
                    ['cover' => '/storage/media/146/jewellery1.png', 'gallery' => '/storage/media/147/jewellery2.png,/storage/media/148/jewellery3.png,/storage/media/149/jewellery4.png,/storage/media/150/jewellery5.png'],
                    ['cover' => '/storage/media/141/caps1.png', 'gallery' => '/storage/media/142/caps2.png,/storage/media/143/caps3.png,/storage/media/144/caps4.png,/storage/media/145/caps5.png'],
                    ['cover' => '/storage/media/136/perfume1.png', 'gallery' => '/storage/media/137/perfume2.png,/storage/media/138/perfume3.png,/storage/media/139/perfume4.png,/storage/media/140/perfume5.png'],
                    ['cover' => '/storage/media/131/sunglasses1.png', 'gallery' => '/storage/media/132/sunglasses2.png,/storage/media/133/sunglasses3.png,/storage/media/134/sunglasses4.png,/storage/media/135/sunglasses5.png'],
                ],
            ];
        } elseif ($storeName === 'TechHub Electronics') {
            $productImageMap = [
                'Smartphone' => [
                    ['cover' => '/storage/media/501/conversions/apple-iphone1-thumb.png', 'gallery' => '/storage/media/502/conversions/apple-iphone2-thumb.png,/storage/media/503/conversions/apple-iphone3-thumb.png,/storage/media/504/conversions/apple-iphone4-thumb.png,/storage/media/505/conversions/apple-iphone5-thumb.png'],
                    ['cover' => '/storage/media/496/conversions/oneplus-nord1-thumb.png', 'gallery' => '/storage/media/497/conversions/oneplus-nord2-thumb.png,/storage/media/498/conversions/oneplus-nord3-thumb.png,/storage/media/499/conversions/oneplus-nord4-thumb.png,/storage/media/500/conversions/oneplus-nord5-thumb.png'],
                    ['cover' => '/storage/media/491/conversions/redmi-note1-thumb.png', 'gallery' => '/storage/media/492/conversions/redmi-note2-thumb.png,/storage/media/493/conversions/redmi-note3-thumb.png,/storage/media/494/conversions/redmi-note4-thumb.png,/storage/media/495/conversions/redmi-note5-thumb.png'],
                    ['cover' => '/storage/media/356/conversions/vivo-y28-5g1-thumb.png', 'gallery' => '/storage/media/357/conversions/vivo-y28-5g2-thumb.png,/storage/media/358/conversions/vivo-y28-5g3-thumb.png,/storage/media/359/conversions/vivo-y28-5g4-thumb.png,/storage/media/360/conversions/vivo-y28-5g5-thumb.png'],
                    ['cover' => '/storage/media/351/conversions/vivo-y400-5g1-thumb.png', 'gallery' => '/storage/media/352/conversions/vivo-y400-5g2-thumb.png,/storage/media/353/conversions/vivo-y400-5g3-thumb.png,/storage/media/354/conversions/vivo-y400-5g4-thumb.png,/storage/media/355/conversions/vivo-y400-5g5-thumb.png'],
                ],
                'Laptop' => [
                    ['cover' => '/storage/media/346/conversions/apple-macbook-pro1-thumb.png', 'gallery' => '/storage/media/347/conversions/apple-macbook-pro2-thumb.png,/storage/media/348/conversions/apple-macbook-pro3-thumb.png,/storage/media/349/conversions/apple-macbook-pro4-thumb.png,/storage/media/350/conversions/apple-macbook-pro5-thumb.png'],
                    ['cover' => '/storage/media/341/conversions/dell-Inspiron1-thumb.png', 'gallery' => '/storage/media/342/conversions/dell-Inspiron2-thumb.png,/storage/media/343/conversions/dell-Inspiron3-thumb.png,/storage/media/344/conversions/dell-Inspiron4-thumb.png,/storage/media/345/conversions/dell-Inspiron5-thumb.png'],
                    ['cover' => '/storage/media/336/conversions/hp-15-intel-core1-thumb.png', 'gallery' => '/storage/media/337/conversions/hp-15-intel-core2-thumb.png,/storage/media/338/conversions/hp-15-intel-core3-thumb.png,/storage/media/339/conversions/hp-15-intel-core4-thumb.png,/storage/media/340/conversions/hp-15-intel-core5-thumb.png'],
                    ['cover' => '/storage/media/331/conversions/Ienovo1-thumb.png', 'gallery' => '/storage/media/332/conversions/Ienovo2-thumb.png,/storage/media/333/conversions/Ienovo3-thumb.png,/storage/media/334/conversions/Ienovo4-thumb.png,/storage/media/335/conversions/Ienovo5-thumb.png'],
                    ['cover' => '/storage/media/326/conversions/lenovo-Ideapad1-thumb.png', 'gallery' => '/storage/media/327/conversions/lenovo-Ideapad2-thumb.png,/storage/media/328/conversions/lenovo-Ideapad3-thumb.png,/storage/media/329/conversions/lenovo-Ideapad4-thumb.png,/storage/media/330/conversions/lenovo-Ideapad5-thumb.png'],
                ],
                'Headphone' => [
                    ['cover' => '/storage/media/321/conversions/boat-airdopes1-thumb.png', 'gallery' => '/storage/media/322/conversions/boat-airdopes2-thumb.png,/storage/media/323/conversions/boat-airdopes3-thumb.png,/storage/media/324/conversions/boat-airdopes4-thumb.png,/storage/media/325/conversions/boat-airdopes5-thumb.png'],
                    ['cover' => '/storage/media/316/conversions/croma-sliding1-thumb.png', 'gallery' => '/storage/media/317/conversions/croma-sliding2-thumb.png,/storage/media/318/conversions/croma-sliding3-thumb.png,/storage/media/319/conversions/croma-sliding4-thumb.png,/storage/media/320/conversions/croma-sliding5-thumb.png'],
                    ['cover' => '/storage/media/251/conversions/nothing-buds-pro1-thumb.png', 'gallery' => '/storage/media/252/conversions/nothing-buds-pro2-thumb.png,/storage/media/253/conversions/nothing-buds-pro3-thumb.png,/storage/media/254/conversions/nothing-buds-pro4-thumb.png,/storage/media/255/conversions/nothing-buds-pro5-thumb.png'],
                    ['cover' => '/storage/media/311/conversions/oneplus-bullets1-thumb.png', 'gallery' => '/storage/media/312/conversions/oneplus-bullets2-thumb.png,/storage/media/313/conversions/oneplus-bullets3-thumb.png,/storage/media/314/conversions/oneplus-bullets4-thumb.png,/storage/media/315/conversions/oneplus-bullets5-thumb.png'],
                    ['cover' => '/storage/media/306/conversions/realme-busds-t200-lite1-thumb.png', 'gallery' => '/storage/media/307/conversions/realme-busds-t200-lite2-thumb.png,/storage/media/308/conversions/realme-busds-t200-lite3-thumb.png,/storage/media/309/conversions/realme-busds-t200-lite4-thumb.png,/storage/media/310/conversions/realme-busds-t200-lite5-thumb.png'],
                ],
                'Watches' => [
                    ['cover' => '/storage/media/301/conversions/apple-watch1-thumb.png', 'gallery' => '/storage/media/302/conversions/apple-watch2-thumb.png,/storage/media/303/conversions/apple-watch3-thumb.png,/storage/media/304/conversions/apple-watch4-thumb.png,/storage/media/305/conversions/apple-watch5-thumb.png'],
                    ['cover' => '/storage/media/296/conversions/boat-strome-series1-thumb.png', 'gallery' => '/storage/media/297/conversions/boat-strome-series2-thumb.png,/storage/media/298/conversions/boat-strome-series3-thumb.png,/storage/media/299/conversions/boat-strome-series4-thumb.png,/storage/media/300/conversions/boat-strome-series5-thumb.png'],
                    ['cover' => '/storage/media/291/conversions/fitbit-versa-series1-thumb.png', 'gallery' => '/storage/media/292/conversions/fitbit-versa-series2-thumb.png,/storage/media/293/conversions/fitbit-versa-series3-thumb.png,/storage/media/294/conversions/fitbit-versa-series4-thumb.png,/storage/media/295/conversions/fitbit-versa-series5-thumb.png'],
                    ['cover' => '/storage/media/286/conversions/fossil-gen1-thumb.png', 'gallery' => '/storage/media/287/conversions/fossil-gen2-thumb.png,/storage/media/288/conversions/fossil-gen3-thumb.png,/storage/media/289/conversions/fossil-gen4-thumb.png,/storage/media/290/conversions/fossil-gen5-thumb.png'],
                    ['cover' => '/storage/media/281/conversions/garmin-forerunner1-thumb.png', 'gallery' => '/storage/media/282/conversions/garmin-forerunner2-thumb.png,/storage/media/283/conversions/garmin-forerunner3-thumb.png,/storage/media/284/conversions/garmin-forerunner4-thumb.png,/storage/media/285/conversions/garmin-forerunner5-thumb.png'],
                ],
                'Camera' => [
                    ['cover' => '/storage/media/276/conversions/canon-eos1-thumb.png', 'gallery' => '/storage/media/277/conversions/canon-eos2-thumb.png,/storage/media/278/conversions/canon-eos3-thumb.png,/storage/media/279/conversions/canon-eos4-thumb.png,/storage/media/280/conversions/canon-eos5-thumb.png'],
                    ['cover' => '/storage/media/271/conversions/dji-osmo-pocket1-thumb.png', 'gallery' => '/storage/media/272/conversions/dji-osmo-pocket2-thumb.png,/storage/media/273/conversions/dji-osmo-pocket3-thumb.png,/storage/media/274/conversions/dji-osmo-pocket4-thumb.png,/storage/media/275/conversions/dji-osmo-pocket5-thumb.png'],
                    ['cover' => '/storage/media/266/conversions/fujifilm-instax-mini1-thumb.png', 'gallery' => '/storage/media/267/conversions/fujifilm-instax-mini2-thumb.png,/storage/media/268/conversions/fujifilm-instax-mini3-thumb.png,/storage/media/269/conversions/fujifilm-instax-mini4-thumb.png,/storage/media/270/conversions/fujifilm-instax-mini5-thumb.png'],
                    ['cover' => '/storage/media/261/conversions/cannon1-thumb.png', 'gallery' => '/storage/media/262/conversions/cannon2-thumb.png,/storage/media/263/conversions/cannon3-thumb.png,/storage/media/264/conversions/cannon4-thumb.png,/storage/media/265/conversions/cannon5-thumb.png'],
                    ['cover' => '/storage/media/256/conversions/sony-alpha1-thumb.png', 'gallery' => '/storage/media/257/conversions/sony-alpha2-thumb.png,/storage/media/258/conversions/sony-alpha3-thumb.png,/storage/media/259/conversions/sony-alpha4-thumb.png,/storage/media/260/conversions/sony-alpha5-thumb.png'],
                ],
            ];
        } elseif ($storeName === 'Beauty Bliss Cosmetics') {
            $productImageMap = [
                'Skincare' => [
                    ['cover' => '/storage/media/581/cleanser1.png', 'gallery' => '/storage/media/582/cleanser2.png,/storage/media/583/cleanser3.png,/storage/media/584/cleanser4.png,/storage/media/585/cleanser5.png'],
                    ['cover' => '/storage/media/631/lip-balm1.png', 'gallery' => '/storage/media/632/lip-balm2.png,/storage/media/633/lip-balm3.png,/storage/media/634/lip-balm4.png,/storage/media/635/lip-balm5.png'],
                    ['cover' => '/storage/media/626/moisturizer-cream1.png', 'gallery' => '/storage/media/627/moisturizer-cream2.png,/storage/media/628/moisturizer-cream3.png,/storage/media/629/moisturizer-cream4.png,/storage/media/630/moisturizer-cream5.png'],
                    ['cover' => '/storage/media/621/serum1.png', 'gallery' => '/storage/media/622/serum2.png,/storage/media/623/serum3.png,/storage/media/624/serum4.png,/storage/media/625/serum5.png'],
                    ['cover' => '/storage/media/616/sun-screen1.png', 'gallery' => '/storage/media/617/sun-screen2.png,/storage/media/618/sun-screen3.png,/storage/media/619/sun-screen4.png,/storage/media/620/sun-screen5.png'],
                ],
                'Makeup' => [
                    ['cover' => '/storage/media/611/eyeliners1.png', 'gallery' => '/storage/media/612/eyeliners2.png,/storage/media/613/eyeliners3.png,/storage/media/614/eyeliners4.png,/storage/media/615/eyeliners5.png'],
                    ['cover' => '/storage/media/606/eyeshadow1.png', 'gallery' => '/storage/media/607/eyeshadow2.png,/storage/media/608/eyeshadow3.png,/storage/media/609/eyeshadow4.png,/storage/media/610/eyeshadow5.png'],
                    ['cover' => '/storage/media/601/foundation1.png', 'gallery' => '/storage/media/602/foundation2.png,/storage/media/603/foundation3.png,/storage/media/604/foundation4.png,/storage/media/605/foundation5.png'],
                    ['cover' => '/storage/media/596/lipstick1.png', 'gallery' => '/storage/media/597/lipstick2.png,/storage/media/598/lipstick3.png,/storage/media/599/lipstick4.png,/storage/media/600/lipstick5.png'],
                    ['cover' => '/storage/media/591/mascaras1.png', 'gallery' => '/storage/media/592/mascaras2.png,/storage/media/593/mascaras3.png,/storage/media/594/mascaras4.png,/storage/media/595/mascaras5.png'],
                ],
                'Hair Care' => [
                    ['cover' => '/storage/media/586/conditioner1.png', 'gallery' => '/storage/media/587/conditioner2.png,/storage/media/588/conditioner3.png,/storage/media/589/conditioner4.png,/storage/media/590/conditioner5.png'],
                    ['cover' => '/storage/media/576/hair-mask1.png', 'gallery' => '/storage/media/577/hair-mask2.png,/storage/media/578/hair-mask3.png,/storage/media/579/hair-mask4.png,/storage/media/580/hair-mask5.png'],
                    ['cover' => '/storage/media/506/hair-oil1.png', 'gallery' => '/storage/media/507/hair-oil2.png,/storage/media/508/hair-oil3.png,/storage/media/509/hair-oil4.png,/storage/media/510/hair-oil5.png'],
                    ['cover' => '/storage/media/571/hair-serums1.png', 'gallery' => '/storage/media/572/hair-serums2.png,/storage/media/573/hair-serums3.png,/storage/media/574/hair-serums4.png,/storage/media/575/hair-serums5.png'],
                    ['cover' => '/storage/media/566/shampoo1.png', 'gallery' => '/storage/media/567/shampoo2.png,/storage/media/568/shampoo3.png,/storage/media/569/shampoo4.png,/storage/media/570/shampoo5.png'],
                ],
                'Fragrances' => [
                    ['cover' => '/storage/media/561/body-mist1.png', 'gallery' => '/storage/media/562/body-mist2.png,/storage/media/563/body-mist3.png,/storage/media/564/body-mist4.png,/storage/media/565/body-mist5.png'],
                    ['cover' => '/storage/media/556/deodorants1.png', 'gallery' => '/storage/media/557/deodorants2.png,/storage/media/558/deodorants3.png,/storage/media/559/deodorants4.png,/storage/media/560/deodorants5.png'],
                    ['cover' => '/storage/media/551/essential-oils1.png', 'gallery' => '/storage/media/552/essential-oils2.png,/storage/media/553/essential-oils3.png,/storage/media/554/essential-oils4.png,/storage/media/555/essential-oils5.png'],
                    ['cover' => '/storage/media/546/eternal-blooms1.png', 'gallery' => '/storage/media/547/eternal-blooms2.png,/storage/media/548/eternal-blooms3.png,/storage/media/549/eternal-blooms4.png,/storage/media/550/eternal-blooms5.png'],
                    ['cover' => '/storage/media/541/perfumes1.png', 'gallery' => '/storage/media/542/perfumes2.png,/storage/media/543/perfumes3.png,/storage/media/544/perfumes4.png,/storage/media/545/perfumes5.png'],
                ],
                'Beauty Tools & Accessories' => [
                    ['cover' => '/storage/media/536/hair-dryers1.png', 'gallery' => '/storage/media/537/hair-dryers2.png,/storage/media/538/hair-dryers3.png,/storage/media/539/hair-dryers4.png,/storage/media/540/hair-dryers5.png'],
                    ['cover' => '/storage/media/526/makeup-brushes1.png', 'gallery' => '/storage/media/527/makeup-brushes2.png,/storage/media/528/makeup-brushes3.png,/storage/media/529/makeup-brushes4.png,/storage/media/530/makeup-brushes5.png'],
                    ['cover' => '/storage/media/521/nails1.png', 'gallery' => '/storage/media/522/nails2.png,/storage/media/523/nails3.png,/storage/media/524/nails4.png,/storage/media/525/nails5.png'],
                    ['cover' => '/storage/media/516/sponge1.png', 'gallery' => '/storage/media/517/sponge2.png,/storage/media/518/sponge3.png,/storage/media/519/sponge4.png,/storage/media/520/sponge5.png'],
                    ['cover' => '/storage/media/511/straighteners1.png', 'gallery' => '/storage/media/512/straighteners2.png,/storage/media/513/straighteners3.png,/storage/media/514/straighteners4.png,/storage/media/515/straighteners5.png'],
                ],
            ];
        } elseif ($storeName === 'Elegant Jewelry Collection') {
            $productImageMap = [
                'Necklace' => [
                    ['cover' => 'storage/media/461/conversions/pendant-necklace1-thumb.png', 'gallery' => 'storage/media/462/conversions/pendant-necklace2-thumb.png,storage/media/463/conversions/pendant-necklace3-thumb.png,storage/media/464/conversions/pendant-necklace4-thumb.png,storage/media/465/conversions/pendant-necklace5-thumb.png'],
                    ['cover' => 'storage/media/486/conversions/diamond-necklace1-thumb.png', 'gallery' => 'storage/media/487/conversions/diamond-necklace2-thumb.png,storage/media/488/conversions/diamond-necklace3-thumb.png,storage/media/489/conversions/diamond-necklace4-thumb.png,storage/media/490/conversions/diamond-necklace5-thumb.png'],
                    ['cover' => 'storage/media/481/conversions/solitaire-necklace1-thumb.png', 'gallery' => 'storage/media/482/conversions/solitaire-necklace2-thumb.png,storage/media/483/conversions/solitaire-necklace3-thumb.png,storage/media/484/conversions/solitaire-necklace4-thumb.png,storage/media/485/conversions/solitaire-necklace5-thumb.png'],
                    ['cover' => 'storage/media/476/conversions/rajrajeshwari-necklace1-thumb.png', 'gallery' => 'storage/media/477/conversions/rajrajeshwari-necklace2-thumb.png,storage/media/478/conversions/rajrajeshwari-necklace3-thumb.png,storage/media/479/conversions/rajrajeshwari-necklace4-thumb.png,storage/media/480/conversions/rajrajeshwari-necklace5-thumb.png'],
                    ['cover' => 'storage/media/471/conversions/gemstone-necklace1-thumb.png', 'gallery' => 'storage/media/472/conversions/gemstone-necklace2-thumb.png,storage/media/473/conversions/gemstone-necklace3-thumb.png,storage/media/474/conversions/gemstone-necklace4-thumb.png,storage/media/475/conversions/gemstone-necklace5-thumb.png'],
                ],
                'Earring' => [
                    ['cover' => 'storage/media/466/conversions/stud-earrings1-thumb.png', 'gallery' => 'storage/media/467/conversions/stud-earrings2-thumb.png,storage/media/468/conversions/stud-earrings3-thumb.png,storage/media/469/conversions/stud-earrings4-thumb.png,storage/media/470/conversions/stud-earrings5-thumb.png'],
                    ['cover' => 'storage/media/456/conversions/glimmer-earrings1-thumb.png', 'gallery' => 'storage/media/457/conversions/glimmer-earrings2-thumb.png,storage/media/458/conversions/glimmer-earrings3-thumb.png,storage/media/459/conversions/glimmer-earrings4-thumb.png,storage/media/460/conversions/glimmer-earrings5-thumb.png'],
                    ['cover' => 'storage/media/451/conversions/drop-earrings1-thumb.png', 'gallery' => 'storage/media/452/conversions/drop-earrings2-thumb.png,storage/media/453/conversions/drop-earrings3-thumb.png,storage/media/454/conversions/drop-earrings4-thumb.png,storage/media/455/conversions/drop-earrings5-thumb.png'],
                    ['cover' => 'storage/media/446/conversions/noor-earrings1-thumb.png', 'gallery' => 'storage/media/447/conversions/noor-earrings2-thumb.png,storage/media/448/conversions/noor-earrings3-thumb.png,storage/media/449/conversions/noor-earrings4-thumb.png,storage/media/450/conversions/noor-earrings5-thumb.png'],
                    ['cover' => 'storage/media/441/conversions/gold-earrings1-thumb.png', 'gallery' => 'storage/media/442/conversions/gold-earrings2-thumb.png,storage/media/443/conversions/gold-earrings3-thumb.png,storage/media/444/conversions/gold-earrings4-thumb.png,storage/media/445/conversions/gold-earrings5-thumb.png'],
                ],
                'Ring' => [
                    ['cover' => 'storage/media/436/conversions/vanki-ring1-thumb.png', 'gallery' => 'storage/media/437/conversions/vanki-ring2-thumb.png,storage/media/438/conversions/vanki-ring3-thumb.png,storage/media/439/conversions/vanki-ring4-thumb.png,storage/media/440/conversions/vanki-ring5-thumb.png'],
                    ['cover' => 'storage/media/431/conversions/diamond-band1-thumb.png', 'gallery' => 'storage/media/432/conversions/diamond-band2-thumb.png,storage/media/433/conversions/diamond-band3-thumb.png,storage/media/434/conversions/diamond-band4-thumb.png,storage/media/435/conversions/diamond-band5-thumb.png'],
                    ['cover' => 'storage/media/361/conversions/solitaire-ring1-thumb.png', 'gallery' => 'storage/media/362/conversions/solitaire-ring2-thumb.png,storage/media/363/conversions/solitaire-ring3-thumb.png,storage/media/364/conversions/solitaire-ring4-thumb.png,storage/media/365/conversions/solitaire-ring5-thumb.png'],
                    ['cover' => 'storage/media/426/conversions/diamond-ring1-thumb.png', 'gallery' => 'storage/media/427/conversions/diamond-ring2-thumb.png,storage/media/428/conversions/diamond-ring3-thumb.png,storage/media/429/conversions/diamond-ring4-thumb.png,storage/media/430/conversions/diamond-ring5-thumb.png'],
                    ['cover' => 'storage/media/421/conversions/wave-ring1-thumb.png', 'gallery' => 'storage/media/422/conversions/wave-ring2-thumb.png,storage/media/423/conversions/wave-ring3-thumb.png,storage/media/424/conversions/wave-ring4-thumb.png,storage/media/425/conversions/wave-ring5-thumb.png'],
                ],
                'Bracelet' => [
                    ['cover' => 'storage/media/416/conversions/diamond-bracelet1-thumb.png', 'gallery' => 'storage/media/417/conversions/diamond-bracelet2-thumb.png,storage/media/418/conversions/diamond-bracelet3-thumb.png,storage/media/419/conversions/diamond-bracelet4-thumb.png,storage/media/420/conversions/diamond-bracelet5-thumb.png'],
                    ['cover' => 'storage/media/411/conversions/dianella-bracelet1-thumb.png', 'gallery' => 'storage/media/412/conversions/dianella-bracelet2-thumb.png,storage/media/413/conversions/dianella-bracelet3-thumb.png,storage/media/414/conversions/dianella-bracelet4-thumb.png,storage/media/415/conversions/dianella-bracelet5-thumb.png'],
                    ['cover' => 'storage/media/406/conversions/loose-bracelet1-thumb.png', 'gallery' => 'storage/media/407/conversions/loose-bracelet2-thumb.png,storage/media/408/conversions/loose-bracelet3-thumb.png,storage/media/409/conversions/loose-bracelet4-thumb.png,storage/media/410/conversions/loose-bracelet5-thumb.png'],
                    ['cover' => 'storage/media/396/conversions/mangalsutra-bracelet1-thumb.png', 'gallery' => 'storage/media/397/conversions/mangalsutra-bracelet2-thumb.png,storage/media/398/conversions/mangalsutra-bracelet3-thumb.png,storage/media/399/conversions/mangalsutra-bracelet4-thumb.png,storage/media/400/conversions/mangalsutra-bracelet5-thumb.png'],
                    ['cover' => 'storage/media/391/conversions/oval-bracelet1-thumb.png', 'gallery' => 'storage/media/392/conversions/oval-bracelet2-thumb.png,storage/media/393/conversions/oval-bracelet3-thumb.png,storage/media/394/conversions/oval-bracelet4-thumb.png,storage/media/395/conversions/oval-bracelet5-thumb.png'],
                ],
                'Brooch' => [
                    ['cover' => 'storage/media/386/conversions/diamond-brooch1-thumb.png', 'gallery' => 'storage/media/387/conversions/diamond-brooch2-thumb.png,storage/media/388/conversions/diamond-brooch3-thumb.png,storage/media/389/conversions/diamond-brooch4-thumb.png,storage/media/390/conversions/diamond-brooch5-thumb.png'],
                    ['cover' => 'storage/media/381/conversions/gold-brooch1-thumb.png', 'gallery' => 'storage/media/382/conversions/gold-brooch2-thumb.png,storage/media/383/conversions/gold-brooch3-thumb.png,storage/media/384/conversions/gold-brooch4-thumb.png,storage/media/385/conversions/gold-brooch5-thumb.png'],
                    ['cover' => 'storage/media/376/conversions/love-birds-brooch1-thumb.png', 'gallery' => 'storage/media/377/conversions/love-birds-brooch2-thumb.png,storage/media/378/conversions/love-birds-brooch3-thumb.png,storage/media/379/conversions/love-birds-brooch4-thumb.png,storage/media/380/conversions/love-birds-brooch5-thumb.png'],
                    ['cover' => 'storage/media/371/conversions/morris-brooch1-thumb.png', 'gallery' => 'storage/media/372/conversions/morris-brooch2-thumb.png,storage/media/373/conversions/morris-brooch3-thumb.png,storage/media/374/conversions/morris-brooch4-thumb.png,storage/media/375/conversions/morris-brooch5-thumb.png'],
                    ['cover' => 'storage/media/366/conversions/rooster-brooch1-thumb.png', 'gallery' => 'storage/media/367/conversions/rooster-brooch2-thumb.png,storage/media/368/conversions/rooster-brooch3-thumb.png,storage/media/369/conversions/rooster-brooch4-thumb.png,storage/media/370/conversions/rooster-brooch5-thumb.png'],
                ],
            ];
        } elseif ($storeName === 'Luxury Timepieces') {
            $productImageMap = [
                'Mechanical Watch' => [
                    ['cover' => '/storage/media/706/boss1.png', 'gallery' => '/storage/media/707/boss2.png,/storage/media/708/boss3.png,/storage/media/709/boss4.png,/storage/media/710/boss5.png'],
                    ['cover' => '/storage/media/756/casio1.png', 'gallery' => '/storage/media/757/casio2.png,/storage/media/758/casio3.png,/storage/media/759/casio4.png,/storage/media/760/casio5.png'],
                    ['cover' => '/storage/media/751/louis-moinet1.png', 'gallery' => '/storage/media/752/louis-moinet2.png,/storage/media/753/louis-moinet3.png,/storage/media/754/louis-moinet4.png,/storage/media/755/louis-moinet5.png'],
                    ['cover' => '/storage/media/746/titan-edge1.png', 'gallery' => '/storage/media/747/titan-edge2.png,/storage/media/748/titan-edge3.png,/storage/media/749/titan-edge4.png,/storage/media/750/titan-edge5.png'],
                    ['cover' => '/storage/media/741/u-boat1.png', 'gallery' => '/storage/media/742/u-boat2.png,/storage/media/743/u-boat3.png,/storage/media/744/u-boat4.png,/storage/media/745/u-boat5.png'],
                ],
                'Men' => [
                    ['cover' => '/storage/media/736/guess1.png', 'gallery' => '/storage/media/737/guess2.png,/storage/media/738/guess3.png,/storage/media/739/guess4.png,/storage/media/740/guess5.png'],
                    ['cover' => '/storage/media/731/guess-emperor-grey1.png', 'gallery' => '/storage/media/732/guess-emperor-grey2.png,/storage/media/733/guess-emperor-grey3.png,/storage/media/734/guess-emperor-grey4.png,/storage/media/735/guess-emperor-grey5.png'],
                    ['cover' => '/storage/media/726/phoenix1.png', 'gallery' => '/storage/media/727/phoenix2.png,/storage/media/728/phoenix3.png,/storage/media/729/phoenix4.png,/storage/media/730/phoenix5.png'],
                    ['cover' => '/storage/media/721/timex1.png', 'gallery' => '/storage/media/722/timex2.png,/storage/media/723/timex3.png,/storage/media/724/timex4.png,/storage/media/725/timex5.png'],
                    ['cover' => '/storage/media/716/victorinox1.png', 'gallery' => '/storage/media/717/victorinox2.png,/storage/media/718/victorinox3.png,/storage/media/719/victorinox4.png,/storage/media/720/victorinox5.png'],
                ],
                'Smart Watch' => [
                    ['cover' => '/storage/media/711/boat1.png', 'gallery' => '/storage/media/712/boat2.png,/storage/media/713/boat3.png,/storage/media/714/boat4.png,/storage/media/715/boat5.png'],
                    ['cover' => '/storage/media/701/noise1.png', 'gallery' => '/storage/media/702/noise2.png,/storage/media/703/noise3.png,/storage/media/704/noise4.png,/storage/media/705/noise5.png'],
                    ['cover' => '/storage/media/636/phoenix1.png', 'gallery' => '/storage/media/637/phoenix2.png,/storage/media/638/phoenix3.png,/storage/media/639/phoenix4.png,/storage/media/640/phoenix5.png'],
                    ['cover' => '/storage/media/696/samsung-galaxy1.png', 'gallery' => '/storage/media/697/samsung-galaxy2.png,/storage/media/698/samsung-galaxy3.png,/storage/media/699/samsung-galaxy4.png,/storage/media/700/samsung-galaxy5.png'],
                    ['cover' => '/storage/media/691/titan1.png', 'gallery' => '/storage/media/692/titan2.png,/storage/media/693/titan3.png,/storage/media/694/titan4.png,/storage/media/695/titan5.png'],
                ],
                'Women' => [
                    ['cover' => '/storage/media/686/frederique1.png', 'gallery' => '/storage/media/687/frederique2.png,/storage/media/688/frederique3.png,/storage/media/689/frederique4.png,/storage/media/690/frederique5.png'],
                    ['cover' => '/storage/media/681/french-connection1.png', 'gallery' => '/storage/media/682/french-connection2.png,/storage/media/683/french-connection3.png,/storage/media/684/french-connection4.png,/storage/media/685/french-connection5.png'],
                    ['cover' => '/storage/media/676/guess1.png', 'gallery' => '/storage/media/677/guess2.png,/storage/media/678/guess3.png,/storage/media/679/guess4.png,/storage/media/680/guess5.png'],
                    ['cover' => '/storage/media/671/timex1.png', 'gallery' => '/storage/media/672/timex2.png,/storage/media/673/timex3.png,/storage/media/674/timex4.png,/storage/media/675/timex5.png'],
                    ['cover' => '/storage/media/666/titan1.png', 'gallery' => '/storage/media/667/titan2.png,/storage/media/668/titan3.png,/storage/media/669/titan4.png,/storage/media/670/titan5.png'],
                ],
                'Couple Watch' => [
                    ['cover' => '/storage/media/661/armani1.png', 'gallery' => '/storage/media/662/armani2.png,/storage/media/663/armani3.png,/storage/media/664/armani4.png,/storage/media/665/armani5.png'],
                    ['cover' => '/storage/media/651/fastrack1.png', 'gallery' => '/storage/media/652/fastrack2.png,/storage/media/653/fastrack3.png,/storage/media/654/fastrack4.png,/storage/media/655/fastrack5.png'],
                    ['cover' => '/storage/media/656/fastrack-mismatched1.png', 'gallery' => '/storage/media/657/fastrack-mismatched2.png,/storage/media/658/fastrack-mismatched3.png,/storage/media/659/fastrack-mismatched4.png,/storage/media/660/fastrack-mismatched5.png'],
                    ['cover' => '/storage/media/646/guess1.png', 'gallery' => '/storage/media/647/guess2.png,/storage/media/648/guess3.png,/storage/media/649/guess4.png,/storage/media/650/guess5.png'],
                    ['cover' => '/storage/media/641/joker-witch1.png', 'gallery' => '/storage/media/642/joker-witch2.png,/storage/media/643/joker-witch3.png,/storage/media/644/joker-witch4.png,/storage/media/645/joker-witch5.png'],
                ],
            ];
        } elseif ($storeName === 'Modern Furniture Studio') {
            $productImageMap = [
                'Living Room Furniture' => [
                    ['cover' => 'storage/media/976/conversions/adelaide-sofa1-thumb.png', 'gallery' => 'storage/media/977/conversions/adelaide-sofa2-thumb.png,storage/media/978/conversions/adelaide-sofa3-thumb.png,storage/media/979/conversions/adelaide-sofa4-thumb.png,storage/media/980/conversions/adelaide-sofa5-thumb.png'],
                    ['cover' => 'storage/media/1006/conversions/book-shelves1-thumb.png', 'gallery' => 'storage/media/1007/conversions/book-shelves2-thumb.png,storage/media/1008/conversions/book-shelves3-thumb.png,storage/media/1009/conversions/book-shelves4-thumb.png,storage/media/1010/conversions/book-shelves5-thumb.png'],
                    ['cover' => 'storage/media/1001/conversions/recliners1-thumb.png', 'gallery' => 'storage/media/1002/conversions/recliners2-thumb.png,storage/media/1003/conversions/recliners3-thumb.png,storage/media/1004/conversions/recliners4-thumb.png,storage/media/1005/conversions/recliners5-thumb.png'],
                    ['cover' => 'storage/media/1000/conversions/sofa-chairs1-thumb.png', 'gallery' => 'storage/media/999/conversions/sofa-chairs2-thumb.png,storage/media/998/conversions/sofa-chairs3-thumb.png,storage/media/997/conversions/sofa-chairs4-thumb.png,storage/media/996/conversions/sofa-chairs5-thumb.png'],
                    ['cover' => 'storage/media/991/conversions/tv-nits1-thumb.png', 'gallery' => 'storage/media/992/conversions/tv-nits2-thumb.png,storage/media/993/conversions/tv-nits3-thumb.png,storage/media/994/conversions/tv-nits4-thumb.png,storage/media/995/conversions/tv-nits5-thumb.png'],
                ],
                'Bedroom Furniture' => [
                    ['cover' => 'storage/media/986/conversions/beds1-thumb.png', 'gallery' => 'storage/media/987/conversions/beds2-thumb.png,storage/media/988/conversions/beds3-thumb.png,storage/media/989/conversions/beds4-thumb.png,storage/media/990/conversions/beds5-thumb.png'],
                    ['cover' => 'storage/media/981/conversions/bedside-table1-thumb.png', 'gallery' => 'storage/media/982/conversions/bedside-table2-thumb.png,storage/media/983/conversions/bedside-table3-thumb.png,storage/media/984/conversions/bedside-table4-thumb.png,storage/media/985/conversions/bedside-table5-thumb.png'],
                    ['cover' => 'storage/media/971/conversions/dressing-table1-thumb.png', 'gallery' => 'storage/media/972/conversions/dressing-table2-thumb.png,storage/media/973/conversions/dressing-table3-thumb.png,storage/media/974/conversions/dressing-table4-thumb.png,storage/media/975/conversions/dressing-table5-thumb.png'],
                    ['cover' => 'storage/media/966/conversions/mattresses-pillow1-thumb.png', 'gallery' => 'storage/media/967/conversions/mattresses-pillow2-thumb.png,storage/media/968/conversions/mattresses-pillow3-thumb.png,storage/media/969/conversions/mattresses-pillow4-thumb.png,storage/media/970/conversions/mattresses-pillow5-thumb.png'],
                    ['cover' => 'storage/media/961/conversions/wardrobe1-thumb.png', 'gallery' => 'storage/media/962/conversions/wardrobe2-thumb.png,storage/media/963/conversions/wardrobe3-thumb.png,storage/media/964/conversions/wardrobe4-thumb.png,storage/media/965/conversions/wardrobe5-thumb.png'],
                ],
                'Luxury' => [
                    ['cover' => 'storage/media/956/conversions/coffee-table1-thumb.png', 'gallery' => 'storage/media/957/conversions/coffee-table2-thumb.png,storage/media/958/conversions/coffee-table3-thumb.png,storage/media/959/conversions/coffee-table4-thumb.png,storage/media/960/conversions/coffee-table5-thumb.png'],
                    ['cover' => 'storage/media/951/conversions/console-table1-thumb.png', 'gallery' => 'storage/media/952/conversions/console-table2-thumb.png,storage/media/953/conversions/console-table3-thumb.png,storage/media/954/conversions/console-table4-thumb.png,storage/media/955/conversions/console-table5-thumb.png'],
                    ['cover' => 'storage/media/886/conversions/dining-tables1-thumb.png', 'gallery' => 'storage/media/887/conversions/dining-tables2-thumb.png,storage/media/888/conversions/dining-tables3-thumb.png,storage/media/889/conversions/dining-tables4-thumb.png,storage/media/890/conversions/dining-tables5-thumb.png'],
                    ['cover' => 'storage/media/946/conversions/side-tables1-thumb.png', 'gallery' => 'storage/media/947/conversions/side-tables2-thumb.png,storage/media/948/conversions/side-tables3-thumb.png,storage/media/949/conversions/side-tables4-thumb.png,storage/media/950/conversions/side-tables5-thumb.png'],
                    ['cover' => 'storage/media/941/conversions/sideboards1-thumb.png', 'gallery' => 'storage/media/942/conversions/sideboards2-thumb.png,storage/media/943/conversions/sideboards3-thumb.png,storage/media/944/conversions/sideboards4-thumb.png,storage/media/945/conversions/sideboards5-thumb.png'],
                ],
                'Home Decor' => [
                    ['cover' => 'storage/media/936/conversions/mirrors1-thumb.png', 'gallery' => 'storage/media/937/conversions/mirrors2-thumb.png,storage/media/938/conversions/mirrors3-thumb.png,storage/media/939/conversions/mirrors4-thumb.png,storage/media/940/conversions/mirrors5-thumb.png'],
                    ['cover' => 'storage/media/931/conversions/pots-planters1-thumb.png', 'gallery' => 'storage/media/932/conversions/pots-planters2-thumb.png,storage/media/933/conversions/pots-planters3-thumb.png,storage/media/934/conversions/pots-planters4-thumb.png,storage/media/935/conversions/pots-planters5-thumb.png'],
                    ['cover' => 'storage/media/926/conversions/wall-decor1-thumb.png', 'gallery' => 'storage/media/927/conversions/wall-decor2-thumb.png,storage/media/928/conversions/wall-decor3-thumb.png,storage/media/929/conversions/wall-decor4-thumb.png,storage/media/930/conversions/wall-decor5-thumb.png'],
                    ['cover' => 'storage/media/921/conversions/wall-watch1-thumb.png', 'gallery' => 'storage/media/922/conversions/wall-watch2-thumb.png,storage/media/923/conversions/wall-watch3-thumb.png,storage/media/924/conversions/wall-watch4-thumb.png,storage/media/925/conversions/wall-watch5-thumb.png'],
                    ['cover' => 'storage/media/916/conversions/wood-pen-stands1-thumb.png', 'gallery' => 'storage/media/917/conversions/wood-pen-stands2-thumb.png,storage/media/918/conversions/wood-pen-stands3-thumb.png,storage/media/919/conversions/wood-pen-stands4-thumb.png,storage/media/920/conversions/wood-pen-stands5-thumb.png'],
                ],
                'Lamps and Lighting' => [
                    ['cover' => 'storage/media/911/conversions/ceiling-lights1-thumb.png', 'gallery' => 'storage/media/912/conversions/ceiling-lights2-thumb.png,storage/media/913/conversions/ceiling-lights3-thumb.png,storage/media/914/conversions/ceiling-lights4-thumb.png,storage/media/915/conversions/ceiling-lights5-thumb.png'],
                    ['cover' => 'storage/media/906/conversions/floor-lamps1-thumb.png', 'gallery' => 'storage/media/907/conversions/floor-lamps2-thumb.png,storage/media/908/conversions/floor-lamps3-thumb.png,storage/media/909/conversions/floor-lamps4-thumb.png,storage/media/910/conversions/floor-lamps5-thumb.png'],
                    ['cover' => 'storage/media/901/conversions/night-lamps1-thumb.png', 'gallery' => 'storage/media/902/conversions/night-lamps2-thumb.png,storage/media/903/conversions/night-lamps3-thumb.png,storage/media/904/conversions/night-lamps4-thumb.png,storage/media/905/conversions/night-lamps5-thumb.png'],
                    ['cover' => 'storage/media/896/conversions/table-lamps1-thumb.png', 'gallery' => 'storage/media/897/conversions/table-lamps2-thumb.png,storage/media/898/conversions/table-lamps3-thumb.png,storage/media/899/conversions/table-lamps4-thumb.png,storage/media/900/conversions/table-lamps5-thumb.png'],
                    ['cover' => 'storage/media/891/conversions/wall-lights1-thumb.png', 'gallery' => 'storage/media/892/conversions/wall-lights2-thumb.png,storage/media/893/conversions/wall-lights3-thumb.png,storage/media/894/conversions/wall-lights4-thumb.png,storage/media/895/conversions/wall-lights5-thumb.png'],
                ],
            ];
        } elseif ($storeName === 'AutoMax Car Dealership') {
            $productImageMap = [
                'Seat Covers' => [
                    ['cover' => '/storage/media/831/conversions/faux-leather-cover1-thumb.png', 'gallery' => '/storage/media/832/conversions/faux-leather-cover2-thumb.png,/storage/media/833/conversions/faux-leather-cover3-thumb.png,/storage/media/834/conversions/faux-leather-cover4-thumb.png,/storage/media/835/conversions/faux-leather-cover5-thumb.png'],
                    ['cover' => '/storage/media/881/conversions/leather-cover1-thumb.png', 'gallery' => '/storage/media/882/conversions/leather-cover2-thumb.png,/storage/media/883/conversions/leather-cover3-thumb.png,/storage/media/884/conversions/leather-cover4-thumb.png,/storage/media/885/conversions/leather-cover5-thumb.png'],
                    ['cover' => '/storage/media/876/conversions/premium-cover1-thumb.png', 'gallery' => '/storage/media/877/conversions/premium-cover2-thumb.png,/storage/media/878/conversions/premium-cover3-thumb.png,/storage/media/879/conversions/premium-cover4-thumb.png,/storage/media/880/conversions/premium-cover5-thumb.png'],
                    ['cover' => '/storage/media/871/conversions/embossed-cover1-thumb.png', 'gallery' => '/storage/media/872/conversions/embossed-cover2-thumb.png,/storage/media/873/conversions/embossed-cover3-thumb.png,/storage/media/874/conversions/embossed-cover4-thumb.png,/storage/media/875/conversions/embossed-cover5-thumb.png'],
                    ['cover' => '/storage/media/866/conversions/velvet-cover1-thumb.png', 'gallery' => '/storage/media/867/conversions/velvet-cover2-thumb.png,/storage/media/868/conversions/velvet-cover3-thumb.png,/storage/media/869/conversions/velvet-cover4-thumb.png,/storage/media/870/conversions/velvet-cover5-thumb.png'],
                ],
                'Car Cover' => [
                    ['cover' => '/storage/media/861/conversions/resistant-car-cover1-thumb.png', 'gallery' => '/storage/media/862/conversions/resistant-car-cover2-thumb.png,/storage/media/863/conversions/resistant-car-cover3-thumb.png,/storage/media/864/conversions/resistant-car-cover4-thumb.png,/storage/media/865/conversions/resistant-car-cover5-thumb.png'],
                    ['cover' => '/storage/media/856/conversions/carbinic-car-cover1-thumb.png', 'gallery' => '/storage/media/857/conversions/carbinic-car-cover2-thumb.png,/storage/media/858/conversions/carbinic-car-cover3-thumb.png,/storage/media/859/conversions/carbinic-car-cover4-thumb.png,/storage/media/860/conversions/carbinic-car-cover5-thumb.png'],
                    ['cover' => '/storage/media/851/conversions/carnest-car-cover1-thumb.png', 'gallery' => '/storage/media/852/conversions/carnest-car-cover2-thumb.png,/storage/media/853/conversions/carnest-car-cover3-thumb.png,/storage/media/854/conversions/carnest-car-cover4-thumb.png,/storage/media/855/conversions/carnest-car-cover5-thumb.png'],
                    ['cover' => '/storage/media/846/conversions/drinay-car-cover1-thumb.png', 'gallery' => '/storage/media/847/conversions/drinay-car-cover2-thumb.png,/storage/media/848/conversions/drinay-car-cover3-thumb.png,/storage/media/849/conversions/drinay-car-cover4-thumb.png,/storage/media/850/conversions/drinay-car-cover5-thumb.png'],
                    ['cover' => '/storage/media/841/conversions/waterproof-car-cover1-thumb.png', 'gallery' => '/storage/media/842/conversions/waterproof-car-cover2-thumb.png,/storage/media/843/conversions/waterproof-car-cover3-thumb.png,/storage/media/844/conversions/waterproof-car-cover4-thumb.png,/storage/media/845/conversions/waterproof-car-cover5-thumb.png'],
                ],
                'Mag Wheel' => [
                    ['cover' => '/storage/media/836/conversions/sentinel-black-wheel1-thumb.png', 'gallery' => '/storage/media/837/conversions/sentinel-black-wheel2-thumb.png,/storage/media/838/conversions/sentinel-black-wheel3-thumb.png,/storage/media/839/conversions/sentinel-black-wheel4-thumb.png,/storage/media/840/conversions/sentinel-black-wheel5-thumb.png'],
                    ['cover' => '/storage/media/826/conversions/fuel-wheel1-thumb.png', 'gallery' => '/storage/media/827/conversions/fuel-wheel2-thumb.png,/storage/media/828/conversions/fuel-wheel3-thumb.png,/storage/media/829/conversions/fuel-wheel4-thumb.png,/storage/media/830/conversions/fuel-wheel5-thumb.png'],
                    ['cover' => '/storage/media/761/conversions/rebel-matte-wheel1-thumb.png', 'gallery' => '/storage/media/762/conversions/rebel-matte-wheel2-thumb.png,/storage/media/763/conversions/rebel-matte-wheel3-thumb.png,/storage/media/764/conversions/rebel-matte-wheel4-thumb.png,/storage/media/765/conversions/rebel-matte-wheel5-thumb.png'],
                    ['cover' => '/storage/media/821/conversions/uno-minda-wheel1-thumb.png', 'gallery' => '/storage/media/822/conversions/uno-minda-wheel2-thumb.png,/storage/media/823/conversions/uno-minda-wheel3-thumb.png,/storage/media/824/conversions/uno-minda-wheel4-thumb.png,/storage/media/825/conversions/uno-minda-wheel5-thumb.png'],
                    ['cover' => '/storage/media/816/conversions/vision-wheel1-thumb.png', 'gallery' => '/storage/media/817/conversions/vision-wheel2-thumb.png,/storage/media/818/conversions/vision-wheel3-thumb.png,/storage/media/819/conversions/vision-wheel4-thumb.png,/storage/media/820/conversions/vision-wheel5-thumb.png'],
                ],
                'Brake Light' => [
                    ['cover' => '/storage/media/811/conversions/reflector-brake-light1-thumb.png', 'gallery' => '/storage/media/812/conversions/reflector-brake-light2-thumb.png,/storage/media/813/conversions/reflector-brake-light3-thumb.png,/storage/media/814/conversions/reflector-brake-light4-thumb.png,/storage/media/815/conversions/reflector-brake-light5-thumb.png'],
                    ['cover' => '/storage/media/806/conversions/plate-brake-light1-thumb.png', 'gallery' => '/storage/media/807/conversions/plate-brake-light2-thumb.png,/storage/media/808/conversions/plate-brake-light3-thumb.png,/storage/media/809/conversions/plate-brake-light4-thumb.png,/storage/media/810/conversions/plate-brake-light5-thumb.png'],
                    ['cover' => '/storage/media/801/conversions/fancy-light1-thumb.png', 'gallery' => '/storage/media/802/conversions/fancy-light2-thumb.png,/storage/media/803/conversions/fancy-light3-thumb.png,/storage/media/804/conversions/fancy-light4-thumb.png,/storage/media/805/conversions/fancy-light5-thumb.png'],
                    ['cover' => '/storage/media/796/conversions/strobe-warning-tail-light1-thumb.png', 'gallery' => '/storage/media/797/conversions/strobe-warning-tail-light2-thumb.png,/storage/media/798/conversions/strobe-warning-tail-light3-thumb.png,/storage/media/799/conversions/strobe-warning-tail-light4-thumb.png,/storage/media/800/conversions/strobe-warning-tail-light5-thumb.png'],
                    ['cover' => '/storage/media/791/conversions/mounted-stop-lamp1-thumb.png', 'gallery' => '/storage/media/792/conversions/mounted-stop-lamp2-thumb.png,/storage/media/793/conversions/mounted-stop-lamp3-thumb.png,/storage/media/794/conversions/mounted-stop-lamp4-thumb.png,/storage/media/795/conversions/mounted-stop-lamp5-thumb.png'],
                ],
                'Tyre Inflator' => [
                    ['cover' => '/storage/media/786/conversions/bergmann-tyre-inflator1-thumb.png', 'gallery' => '/storage/media/787/conversions/bergmann-tyre-inflator2-thumb.png,/storage/media/788/conversions/bergmann-tyre-inflator3-thumb.png,/storage/media/789/conversions/bergmann-tyre-inflator4-thumb.png,/storage/media/790/conversions/bergmann-tyre-inflator5-thumb.png'],
                    ['cover' => '/storage/media/781/conversions/mini-portable-tyre-inflator1-thumb.png', 'gallery' => '/storage/media/782/conversions/mini-portable-tyre-inflator2-thumb.png,/storage/media/783/conversions/mini-portable-tyre-inflator3-thumb.png,/storage/media/784/conversions/mini-portable-tyre-inflator4-thumb.png,/storage/media/781/conversions/mini-portable-tyre-inflator1-thumb.png'],
                    ['cover' => '/storage/media/776/conversions/mini-tyre-inflator1-thumb.png', 'gallery' => '/storage/media/777/conversions/mini-tyre-inflator2-thumb.png,/storage/media/778/conversions/mini-tyre-inflator3-thumb.png,/storage/media/779/conversions/mini-tyre-inflator4-thumb.png,/storage/media/780/conversions/mini-tyre-inflator5-thumb.png'],
                    ['cover' => '/storage/media/771/conversions/solimo-portable-tyre-inflator1-thumb.png', 'gallery' => '/storage/media/772/conversions/solimo-portable-tyre-inflator2-thumb.png,/storage/media/773/conversions/solimo-portable-tyre-inflator3-thumb.png,/storage/media/774/conversions/solimo-portable-tyre-inflator4-thumb.png,/storage/media/775/conversions/solimo-portable-tyre-inflator5-thumb.png'],
                    ['cover' => '/storage/media/766/conversions/heavy-jet-tyre-inflator1-thumb.png', 'gallery' => '/storage/media/767/conversions/heavy-jet-tyre-inflator2-thumb.png,/storage/media/768/conversions/heavy-jet-tyre-inflator3-thumb.png,/storage/media/769/conversions/heavy-jet-tyre-inflator4-thumb.png,/storage/media/770/conversions/heavy-jet-tyre-inflator5-thumb.png'],
                ],
            ];
        } elseif ($storeName === 'Kids Wonder Toys') {
            $productImageMap = [
                'Kids Toy' => [
                    ['cover' => 'storage/media/1086/conversions/car1-thumb.png', 'gallery' => 'storage/media/1087/conversions/car2-thumb.png,storage/media/1088/conversions/car3-thumb.png,storage/media/1089/conversions/car4-thumb.png,storage/media/1090/conversions/car5-thumb.png'],
                    ['cover' => 'storage/media/1131/conversions/kids-toy1-thumb.png', 'gallery' => 'storage/media/1132/conversions/kids-toy2-thumb.png,storage/media/1133/conversions/kids-toy3-thumb.png,storage/media/1134/conversions/kids-toy4-thumb.png,storage/media/1135/conversions/kids-toy5-thumb.png'],
                    ['cover' => 'storage/media/1126/conversions/musical-toy1-thumb.png', 'gallery' => 'storage/media/1127/conversions/musical-toy2-thumb.png,storage/media/1128/conversions/musical-toy3-thumb.png,storage/media/1129/conversions/musical-toy4-thumb.png,storage/media/1130/conversions/musical-toy5-thumb.png'],
                    ['cover' => 'storage/media/1121/conversions/number-cubes1-thumb.png', 'gallery' => 'storage/media/1122/conversions/number-cubes2-thumb.png,storage/media/1123/conversions/number-cubes3-thumb.png,storage/media/1124/conversions/number-cubes4-thumb.png,storage/media/1125/conversions/number-cubes5-thumb.png'],
                    ['cover' => 'storage/media/1116/conversions/scooter1-thumb.png', 'gallery' => 'storage/media/1117/conversions/scooter2-thumb.png,storage/media/1118/conversions/scooter3-thumb.png,storage/media/1119/conversions/scooter4-thumb.png,storage/media/1120/conversions/scooter5-thumb.png'],
                ],
                'Kids Clothing' => [
                    ['cover' => 'storage/media/1111/conversions/cartoon-print1-thumb.png', 'gallery' => 'storage/media/1112/conversions/cartoon-print2-thumb.png,storage/media/1113/conversions/cartoon-print3-thumb.png,storage/media/1114/conversions/cartoon-print4-thumb.png,storage/media/1115/conversions/cartoon-print5-thumb.png'],
                    ['cover' => 'storage/media/1106/conversions/gap-tshirt1-thumb.png', 'gallery' => 'storage/media/1107/conversions/gap-tshirt2-thumb.png,storage/media/1108/conversions/gap-tshirt3-thumb.png,storage/media/1109/conversions/gap-tshirt4-thumb.png,storage/media/1110/conversions/gap-tshirt5-thumb.png'],
                    ['cover' => 'storage/media/1101/conversions/jackets1-thumb.png', 'gallery' => 'storage/media/1102/conversions/jackets2-thumb.png,storage/media/1103/conversions/jackets3-thumb.png,storage/media/1104/conversions/jackets4-thumb.png,storage/media/1105/conversions/jackets5-thumb.png'],
                    ['cover' => 'storage/media/1096/conversions/long-sleeve1-thumb.png', 'gallery' => 'storage/media/1097/conversions/long-sleeve2-thumb.png,storage/media/1098/conversions/long-sleeve3-thumb.png,storage/media/1099/conversions/long-sleeve4-thumb.png,storage/media/1100/conversions/long-sleeve5-thumb.png'],
                    ['cover' => 'storage/media/1091/conversions/polo-tshirt1-thumb.png', 'gallery' => 'storage/media/1092/conversions/polo-tshirt2-thumb.png,storage/media/1093/conversions/polo-tshirt3-thumb.png,storage/media/1094/conversions/polo-tshirt4-thumb.png,storage/media/1095/conversions/polo-tshirt5-thumb.png'],
                ],
                'Kids Footwear' => [
                    ['cover' => 'storage/media/1081/conversions/adidas-shoes1-thumb.png', 'gallery' => 'storage/media/1082/conversions/adidas-shoes2-thumb.png,storage/media/1083/conversions/adidas-shoes3-thumb.png,storage/media/1084/conversions/adidas-shoes4-thumb.png,storage/media/1085/conversions/adidas-shoes5-thumb.png'],
                    ['cover' => 'storage/media/1076/conversions/boots1-thumb.png', 'gallery' => 'storage/media/1077/conversions/boots2-thumb.png,storage/media/1078/conversions/boots3-thumb.png,storage/media/1079/conversions/boots4-thumb.png,storage/media/1080/conversions/boots5-thumb.png'],
                    ['cover' => 'storage/media/1011/conversions/jordan1-thumb.png', 'gallery' => 'storage/media/1012/conversions/jordan2-thumb.png,storage/media/1013/conversions/jordan3-thumb.png,storage/media/1014/conversions/jordan4-thumb.png,storage/media/1015/conversions/jordan5-thumb.png'],
                    ['cover' => 'storage/media/1071/conversions/sandal1-thumb.png', 'gallery' => 'storage/media/1072/conversions/sandal2-thumb.png,storage/media/1073/conversions/sandal3-thumb.png,storage/media/1074/conversions/sandal4-thumb.png,storage/media/1075/conversions/sandal5-thumb.png'],
                    ['cover' => 'storage/media/1066/conversions/shoes1-thumb.png', 'gallery' => 'storage/media/1067/conversions/shoes2-thumb.png,storage/media/1068/conversions/shoes3-thumb.png,storage/media/1069/conversions/shoes4-thumb.png,storage/media/1070/conversions/shoes5-thumb.png'],
                ],
                'Kids Accessories' => [
                    ['cover' => 'storage/media/1061/conversions/cap1-thumb.png', 'gallery' => 'storage/media/1062/conversions/cap2-thumb.png,storage/media/1063/conversions/cap3-thumb.png,storage/media/1064/conversions/cap4-thumb.png,storage/media/1065/conversions/cap5-thumb.png'],
                    ['cover' => 'storage/media/1051/conversions/hair-clip1-thumb.png', 'gallery' => 'storage/media/1052/conversions/hair-clip2-thumb.png,storage/media/1053/conversions/hair-clip3-thumb.png,storage/media/1054/conversions/hair-clip4-thumb.png,storage/media/1055/conversions/hair-clip5-thumb.png'],
                    ['cover' => 'storage/media/1056/conversions/headband1-thumb.png', 'gallery' => 'storage/media/1057/conversions/headband2-thumb.png,storage/media/1058/conversions/headband3-thumb.png,storage/media/1059/conversions/headband4-thumb.png,storage/media/1060/conversions/headband5-thumb.png'],
                    ['cover' => 'storage/media/1046/conversions/mini-hair-claw1-thumb.png', 'gallery' => 'storage/media/1047/conversions/mini-hair-claw2-thumb.png,storage/media/1048/conversions/mini-hair-claw3-thumb.png,storage/media/1049/conversions/mini-hair-claw4-thumb.png,storage/media/1050/conversions/mini-hair-claw5-thumb.png'],
                    ['cover' => 'storage/media/1041/conversions/socks1-thumb.png', 'gallery' => 'storage/media/1042/conversions/socks2-thumb.png,storage/media/1043/conversions/socks3-thumb.png,storage/media/1044/conversions/socks4-thumb.png,storage/media/1045/conversions/socks5-thumb.png'],
                ],
                'Kids Nursery' => [
                    ['cover' => 'storage/media/1036/conversions/bottles1-thumb.png', 'gallery' => 'storage/media/1037/conversions/bottles2-thumb.png,storage/media/1038/conversions/bottles3-thumb.png,storage/media/1039/conversions/bottles4-thumb.png,storage/media/1040/conversions/bottles5-thumb.png'],
                    ['cover' => 'storage/media/1031/conversions/cup1-thumb.png', 'gallery' => 'storage/media/1032/conversions/cup2-thumb.png,storage/media/1033/conversions/cup3-thumb.png,storage/media/1034/conversions/cup4-thumb.png,storage/media/1035/conversions/cup5-thumb.png'],
                    ['cover' => 'storage/media/1026/conversions/kids-utensils1-thumb.png', 'gallery' => 'storage/media/1027/conversions/kids-utensils2-thumb.png,storage/media/1028/conversions/kids-utensils3-thumb.png,storage/media/1029/conversions/kids-utensils4-thumb.png,storage/media/1030/conversions/kids-utensils5-thumb.png'],
                    ['cover' => 'storage/media/1022/conversions/organizer1-thumb.png', 'gallery' => 'storage/media/1023/conversions/organizer2-thumb.png,storage/media/1024/conversions/organizer3-thumb.png,storage/media/1025/conversions/organizer4-thumb.png,storage/media/1021/conversions/organize5-thumb.png'],
                    ['cover' => 'storage/media/1016/conversions/play-mats1-thumb.png', 'gallery' => 'storage/media/1017/conversions/play-mats2-thumb.png,storage/media/1018/conversions/play-mats3-thumb.png,storage/media/1019/conversions/play-mats4-thumb.png,storage/media/1020/conversions/play-mats5-thumb.png'],
                ],
            ];
        } elseif ($storeName === 'Essence Perfume Gallery') {
            $productImageMap = [
                'Women Perfume' => [
                    ['cover' => 'storage/media/1176/conversions/citrus-fresh1-thumb.png', 'gallery' => 'storage/media/1177/conversions/citrus-fresh2-thumb.png,storage/media/1178/conversions/citrus-fresh3-thumb.png,storage/media/1179/conversions/citrus-fresh4-thumb.png,storage/media/1180/conversions/citrus-fresh5-thumb.png'],
                    ['cover' => 'storage/media/1231/conversions/floral-elegance1-thumb.png', 'gallery' => 'storage/media/1232/conversions/floral-elegance2-thumb.png,storage/media/1233/conversions/floral-elegance3-thumb.png,storage/media/1234/conversions/floral-elegance4-thumb.png,storage/media/1235/conversions/floral-elegance5-thumb.png'],
                    ['cover' => 'storage/media/1226/conversions/jasmine-bloom1-thumb.png', 'gallery' => 'storage/media/1227/conversions/jasmine-bloom2-thumb.png,storage/media/1228/conversions/jasmine-bloom3-thumb.png,storage/media/1229/conversions/jasmine-bloom4-thumb.png,storage/media/1230/conversions/jasmine-bloom5-thumb.png'],
                    ['cover' => 'storage/media/1221/conversions/rose-essence1-thumb.png', 'gallery' => 'storage/media/1222/conversions/rose-essence2-thumb.png,storage/media/1223/conversions/rose-essence3-thumb.png,storage/media/1224/conversions/rose-essence4-thumb.png,storage/media/1225/conversions/rose-essence5-thumb.png'],
                    ['cover' => 'storage/media/1216/conversions/vanila-bliss1-thumb.png', 'gallery' => 'storage/media/1217/conversions/vanila-bliss2-thumb.png,storage/media/1218/conversions/vanila-bliss3-thumb.png,storage/media/1219/conversions/vanila-bliss4-thumb.png,storage/media/1220/conversions/vanila-bliss5-thumb.png'],
                ],
                'Mens Perfume' => [
                    ['cover' => 'storage/media/1211/conversions/bella-vita1-thumb.png', 'gallery' => 'storage/media/1212/conversions/bella-vita2-thumb.png,storage/media/1213/conversions/bella-vita3-thumb.png,storage/media/1214/conversions/bella-vita4-thumb.png,storage/media/1215/conversions/bella-vita5-thumb.png'],
                    ['cover' => 'storage/media/1206/conversions/midnight-valor1-thumb.png', 'gallery' => 'storage/media/1207/conversions/midnight-valor2-thumb.png,storage/media/1208/conversions/midnight-valor3-thumb.png,storage/media/1209/conversions/midnight-valor4-thumb.png,storage/media/1210/conversions/midnight-valor5-thumb.png'],
                    ['cover' => 'storage/media/1201/conversions/obsidian-noir1-thumb.png', 'gallery' => 'storage/media/1202/conversions/obsidian-noir2-thumb.png,storage/media/1203/conversions/obsidian-noir3-thumb.png,storage/media/1204/conversions/obsidian-noir4-thumb.png,storage/media/1205/conversions/obsidian-noir5-thumb.png'],
                    ['cover' => 'storage/media/1196/conversions/titan-elan1-thumb.png', 'gallery' => 'storage/media/1197/conversions/titan-elan2-thumb.png,storage/media/1198/conversions/titan-elan3-thumb.png,storage/media/1199/conversions/titan-elan4-thumb.png,storage/media/1200/conversions/titan-elan5-thumb.png'],
                    ['cover' => 'storage/media/1191/conversions/wild-stone1-thumb.png', 'gallery' => 'storage/media/1192/conversions/wild-stone2-thumb.png,storage/media/1193/conversions/wild-stone3-thumb.png,storage/media/1194/conversions/wild-stone4-thumb.png,storage/media/1195/conversions/wild-stone5-thumb.png'],
                ],
                'Solid Perfume' => [
                    ['cover' => 'storage/media/1186/conversions/air1-thumb.png', 'gallery' => 'storage/media/1187/conversions/air2-thumb.png,storage/media/1188/conversions/air3-thumb.png,storage/media/1189/conversions/air4-thumb.png,storage/media/1190/conversions/air5-thumb.png'],
                    ['cover' => 'storage/media/1181/conversions/beardo-whisky1-thumb.png', 'gallery' => 'storage/media/1182/conversions/beardo-whisky2-thumb.png,storage/media/1183/conversions/beardo-whisky3-thumb.png,storage/media/1184/conversions/beardo-whisky4-thumb.png,storage/media/1185/conversions/beardo-whisky5-thumb.png'],
                    ['cover' => 'storage/media/1136/conversions/ecocradle1-thumb.png', 'gallery' => 'storage/media/1137/conversions/ecocradle2-thumb.png,storage/media/1138/conversions/ecocradle3-thumb.png,storage/media/1139/conversions/ecocradle4-thumb.png,storage/media/1140/conversions/ecocradle5--thumb.png'],
                    ['cover' => 'storage/media/1171/conversions/japanese-cherry-blossom1-thumb.png', 'gallery' => 'storage/media/1172/conversions/japanese-cherry-blossom2-thumb.png,storage/media/1173/conversions/japanese-cherry-blossom3-thumb.png,storage/media/1174/conversions/japanese-cherry-blossom4-thumb.png,storage/media/1175/conversions/japanese-cherry-blossom5-thumb.png'],
                    ['cover' => 'storage/media/1166/conversions/raat-ki-rani1-thumb.png', 'gallery' => 'storage/media/1167/conversions/raat-ki-rani2-thumb.png,storage/media/1168/conversions/raat-ki-rani3-thumb.png,storage/media/1169/conversions/raat-ki-rani4-thumb.png,storage/media/1170/conversions/raat-ki-rani5-thumb.png'],
                ],
                'Body Mist Perfume' => [
                    ['cover' => 'storage/media/1161/conversions/and-dainty-glam1-thumb.png', 'gallery' => 'storage/media/1162/conversions/and-dainty-glam2-thumb.png,storage/media/1163/conversions/and-dainty-glam3-thumb.png,storage/media/1164/conversions/and-dainty-glam4-thumb.png,storage/media/1165/conversions/and-dainty-glam5-thumb.png'],
                    ['cover' => 'storage/media/1156/conversions/armaf-tag-him1-thumb.png', 'gallery' => 'storage/media/1157/conversions/armaf-tag-him2-thumb.png,storage/media/1158/conversions/armaf-tag-him3-thumb.png,storage/media/1159/conversions/armaf-tag-him4-thumb.png,storage/media/1160/conversions/armaf-tag-him5-thumb.png'],
                    ['cover' => 'storage/media/1151/conversions/cherry-blossom1-thumb.png', 'gallery' => 'storage/media/1152/conversions/cherry-blossom2-thumb.png,storage/media/1153/conversions/cherry-blossom3-thumb.png,storage/media/1154/conversions/cherry-blossom4-thumb.png,storage/media/1155/conversions/cherry-blossom5-thumb.png'],
                    ['cover' => 'storage/media/1146/conversions/honey-vanilla1-thumb.png', 'gallery' => 'storage/media/1147/conversions/honey-vanilla2-thumb.png,storage/media/1148/conversions/honey-vanilla3-thumb.png,storage/media/1149/conversions/honey-vanilla4-thumb.png,storage/media/1150/conversions/honey-vanilla5-thumb.png'],
                    ['cover' => 'storage/media/1141/conversions/plum-vibes1-thumb.png', 'gallery' => 'storage/media/1142/conversions/plum-vibes2-thumb.png,storage/media/1143/conversions/plum-vibes3-thumb.png,storage/media/1144/conversions/plum-vibes4-thumb.png,storage/media/1145/conversions/plum-vibes5-thumb.png'],
                ],
                'Pocket Perfume' => [
                    ['cover' => 'storage/media/1306/conversions/challenger1-thumb.png', 'gallery' => 'storage/media/1307/conversions/challenger2-thumb.png,storage/media/1308/conversions/challenger3-thumb.png,storage/media/1309/conversions/challenger4-thumb.png,storage/media/1310/conversions/challenger5-thumb.png'],
                    ['cover' => 'storage/media/1301/conversions/kamasutra-spark1-thumb.png', 'gallery' => 'storage/media/1302/conversions/kamasutra-spark2-thumb.png,storage/media/1303/conversions/kamasutra-spark3-thumb.png,storage/media/1304/conversions/kamasutra-spark4-thumb.png,storage/media/1305/conversions/kamasutra-spark5-thumb.png'],
                    ['cover' => 'storage/media/1296/conversions/nykaa1-thumb.png', 'gallery' => 'storage/media/1297/conversions/nykaa2-thumb.png,storage/media/1298/conversions/nykaa3-thumb.png,storage/media/1299/conversions/nykaa4-thumb.png,storage/media/1300/conversions/nykaa5-thumb.png'],
                    ['cover' => 'storage/media/1291/conversions/spykar1-thumb.png', 'gallery' => 'storage/media/1292/conversions/spykar2-thumb.png,storage/media/1293/conversions/spykar3-thumb.png,storage/media/1294/conversions/spykar4-thumb.png,storage/media/1295/conversions/spykar5-thumb.png'],
                    ['cover' => 'storage/media/1286/conversions/travel-friendly1-thumb.png', 'gallery' => 'storage/media/1287/conversions/travel-friendly2-thumb.png,storage/media/1288/conversions/travel-friendly3-thumb.png,storage/media/1289/conversions/travel-friendly4-thumb.png,storage/media/1290/conversions/travel-friendly5-thumb.png'],
                ],
            ];
        }

        $categoryProducts = $productImageMap[$categoryName] ?? [];
        if (empty($categoryProducts)) {
            return ['cover' => null, 'gallery' => null];
        }

        $productData = $categoryProducts[$productIndex % count($categoryProducts)];
        return [
            'cover' => $productData['cover'],
            'gallery' => $productData['gallery']
        ];
    }

    private function getProductName($storeName, $categoryName, $productIndex): string
    {
        $productNames = [
            'Home Decor Haven' => [
                'Bathroom Decor' => ['Bathroom Accessories', 'Mirrors', 'Shop Dispenser', 'Shower Curtains', 'Towels'],
                'Furniture' => ['Beds', 'Cabinets', 'Chairs', 'Sofas', 'Tables'],
                'Kitchen & Dining Decor' => ['Cookware Bakeware', 'Dinner Sets', 'Placemats', 'Serveware', 'Table Runners'],
                'Lighting' => ['Ceiling Lights', 'Chandeliers', 'Fairy Lights', 'Lamps', 'Table Lamps'],
                'Outdoor & Garden Decor' => ['Birdhouse', 'Fountains', 'Lanterns', 'Patio Furniture', 'Planters'],
            ],
            'Fashion Forward Boutique' => [
                'Women\'s Fashion' => ['Elegant Silk Evening Gown', 'Footwear', 'Jackets Coats', 'Kurtis Ethnic Wear', 'Western Tops'],
                'Men\'s Fashion' => ['Footwear', 'Jackets Hoodies', 'Shirts', 'T Shirt', 'Track Suit'],
                'Kids Fashion' => ['Footwear', 'Infant Baby Wear', 'Sets Suits', 'Socks Tights', 'T Shirts'],
                'Beauty' => ['Glow Filter Glam Highlighter', 'Matte Foundation', 'Pink Chiffon Creme Blush', 'Point Brow Filler', 'Velvet Slim Stick Lipstick'],
                'Accessories' => ['Bags Backpacks', 'Classic Jewelry', 'Hats Caps', 'Perfume', 'Sunglasses'],
            ],
            'TechHub Electronics' => [
                'Smartphone' => ['Apple Iphone 17', 'OnePlus Nord CE5 5G', 'Redmi Note 12 5G', 'Vivo Y28 5G', 'Vivo Y400 5G'],
                'Laptop' => ['Apple Macbook Pro', 'Dell Inspiron 15', 'HP 15 Intel Core I3', 'Lenovo', 'Lenovo IdeaPad 5'],
                'Headphone' => ['BoAt Airdopes 148', 'Croma Sliding', 'Nothing Buds Pro 2', 'OnePlus Bullets Z3 Neckband', 'Realme Buds T200 Lite'],
                'Watches' => ['Apple Watch Series 9', 'BoAt Storm Series', 'Fitbit Versa Series', 'Fossil Gen 6', 'Garmin Forerunner Series'],
                'Camera' => ['Canon EOS R50', 'DJI Osmo Pocket 3 4K', 'FUJIFILM Instax Mini 12', 'Canon', 'SONY Alpha 6100'],
            ],
            'Beauty Bliss Cosmetics' => [
                'Skincare' => ['Cleanser', 'Lip Balm', 'Moisturizer Cream', 'Serum', 'Sun Screen'],
                'Makeup' => ['Eyeliners', 'Eyeshadow', 'Foundation', 'Lipstick', 'Mascaras'],
                'Hair Care' => ['Conditioner', 'Hair Mask', 'Hair Oil', 'Hair Serums', 'Shampoo'],
                'Fragrances' => ['Body Mist', 'Deodorants', 'Essential Oils', 'Eternal Blooms', 'Perfumes'],
                'Beauty Tools & Accessories' => ['Hair Dryers', 'Makeup Brushes', 'Nails', 'Sponge', 'Straighteners'],
            ],
            'Elegant Jewelry Collection' => [
                'Necklace' => ['Curved Drop Gemstone Pendant Necklace', 'Glittering Veil Multi Layer Diamond Necklace', 'Radiant Halo Solitaire Necklace', 'Rajrajeshwari Diamond Necklace', 'Scattering Light Gemstone Necklace'],
                'Earring' => ['Bright Bloomy Diamond Stud Earrings', 'Glimmer Wings Diamond Stud Earrings', 'Meher Gold Drop Earrings', 'Noor Earrings', 'Womens Winding Gold Stud Earrings'],
                'Ring' => ['Chevron Diamond Vanki Ring', 'Glistening Classic Diamond Band', 'Hexella Solitaire Ring', 'Radiant Heart Diamond Ring', 'Teensy Wave Diamond Ring'],
                'Bracelet' => ['Dainty Fern Diamond Bracelet', 'Dianella Tulip Diamond Bracelet', 'Giel Diamond Loose Bracelet', 'Orion Solitaire Mangalsutra', 'Sparkling Evergreen Diamond Oval Bracelet'],
                'Brooch' => ['Flight Club Unisex Diamond Brooch', 'Hope Bird Brooch Gold Blue', 'Love Birds Diamond Convertible Brooch Pendant', 'Ora Brooch Morris', 'Rooster Brooch'],
            ],
            'Luxury Timepieces' => [
                'Mechanical Watch' => ['Boss', 'Casio', 'Louis Moinet', 'Titan Edge', 'U Boat'],
                'Men' => ['Guess', 'Guess Emperor Grey', 'Phoenix', 'Timex', 'Victorinox'],
                'Smart Watch' => ['BoAt', 'Noise', 'Phoenix', 'Samsung Galaxy', 'Titan'],
                'Women' => ['Frederique', 'French Connection', 'Guess', 'Timex', 'Titan'],
                'Couple Watch' => ['Armani', 'Fastrack', 'Fastrack Mismatched Quartz', 'Guess', 'Joker Witch Piper Alex'],
            ],
            'Modern Furniture Studio' => [
                'Living Room Furniture' => ['Adelaide Sofa', 'Book Shelves', 'Recliners', 'Sofa Chairs', 'TV Units'],
                'Bedroom Furniture' => ['Beds', 'Bedside Table', 'Dressing Table', 'Mattresses Pillow', 'Wardrobe'],
                'Luxury' => ['Coffee Table', 'Console Table', 'Dining Tables', 'Side Tables', 'Sideboards'],
                'Home Decor' => ['Mirrors', 'Pots And Planters', 'Wall Decor', 'Wall Watch', 'Wood Pen Stands'],
                'Lamps and Lighting' => ['Ceiling Lights', 'Floor Lamps', 'Night Lamps', 'Table Lamps', 'Wall Lights'],
            ],
            'AutoMax Car Dealership' => [
                'Seat Covers' => ['Faux Leather Seat Cover', 'Leather Car Seat Cover', 'Neodrift Premium Car Seat Covers', 'Seat Cover Set Embossed Design', 'Velvet Fabric Car Seat Cover'],
                'Car Cover' => ['Autofurnish Glaze Waterproof Heat Resistant Car Body Cover', 'Carbinic Car Body Cover', 'Carnest Car Cover', 'Drinay Waterproof Car Body Cover', 'Waterproof Car Cover'],
                'Mag Wheel' => ['Black Rhino Sentinel Black', 'Fuel Assault 1PC Wheel', 'Fuel D681 Rebel Matte', 'UNO MINDA 14 Inch PCD 100 Wheel', 'Vision Wheel 81 Series Wheel'],
                'Brake Light' => ['Carmart Car Reflector Led Brake Light', 'License Plate Brake Light', 'New Brake Light Car Fancy Lights', 'Strobe Warning Tail Light For Cars', 'UNO Minda High Mounted Stop Lamp'],
                'Tyre Inflator' => ['Bergmann Typhoon Heavy Duty Metal Car Tyre Inflator', 'Mini Portable Car Tyre Inflator', 'Mini Tyre Inflator', 'Solimo Portable Tyre Inflator', 'TI 7 Heavy Jet Car Tyre Inflator'],
            ],
            'Kids Wonder Toys' => [
                'Kids Toy' => ['Car', 'Kids Toy', 'Musical Toy', 'Number Cubes', 'Scooter'],
                'Kids Clothing' => ['Cartoon Print', 'Gap Tshirt', 'Jackets', 'Long Sleeve', 'Polo Tshirt'],
                'Kids Footwear' => ['Adidas Shoes', 'Boots', 'Jordan', 'Sandal', 'Shoes'],
                'Kids Accessories' => ['Cap', 'Hair Clip', 'Headband', 'Mini Hair Claw', 'Socks'],
                'Kids Nursery' => ['Bottles', 'Cup', 'Kids Utensils', 'Organizer', 'Play Mats'],
            ],
            'Essence Perfume Gallery' => [
                'Women Perfume' => ['Citrus Fresh', 'Floral Elegance', 'Jasmine Bloom', 'Rose Essence', 'Vanilla Bliss'],
                'Mens Perfume' => ['Bella Vita', 'Midnight Valor', 'Obsidian Noir', 'Titan Elan', 'Wild Stone'],
                'Solid Perfume' => ['Air', 'Beardo Whisky', 'Ecocradle', 'Japanese Cherry Blossom', 'Raat Ki Rani'],
                'Body Mist Perfume' => ['And Dainty Glam', 'Armaf Tag Him', 'Cherry Blossom', 'Honey Vanilla', 'Plum Vibes'],
                'Pocket Perfume' => ['Challenger', 'Kamasutra Spark', 'Nykaa', 'Spykar', 'Travel Friendly'],
            ],
        ];

        return $productNames[$storeName][$categoryName][$productIndex] ?? "Product {$productIndex}";
    }

    private function getProductSpecifications($storeName, $categoryName, $productName): string
    {
        $specifications = [
            'Material: Premium quality materials',
            'Dimensions: Standard size with optimal proportions',
            'Weight: Lightweight and portable design',
            'Color: Available in multiple attractive colors',
            'Brand: Trusted brand with quality assurance',
            'Warranty: 1 year manufacturer warranty included',
            'Care Instructions: Easy to maintain and clean',
            'Origin: Made with international quality standards'
        ];
        
        return implode("\n", array_slice($specifications, 0, rand(4, 6)));
    }

    private function getProductDetails($storeName, $categoryName, $productName): string
    {
        $details = [
            "This {$productName} is crafted with attention to detail and quality.",
            "Perfect for everyday use with durable construction.",
            "Features modern design that complements any style.",
            "Easy to use with user-friendly functionality.",
            "Suitable for all age groups and preferences.",
            "Comes with complete accessories and instructions.",
            "Tested for quality and performance standards.",
            "Eco-friendly materials used in manufacturing.",
            "Available for immediate shipping and delivery.",
            "Customer satisfaction guaranteed with return policy."
        ];
        
        return implode(" ", array_slice($details, 0, rand(3, 5)));
    }
    
    private function getProductVariants($productName): ?string
    {
        $variantsMap = [
            // Baby-Kids Theme
            'Car' => [['name' => 'Color', 'values' => ['Red', 'Green']]],
            'Organizer' => [['name' => 'Color', 'values' => ['Dusty Blue', 'Camel']]],
            'Kids Utensils' => [['name' => 'Color', 'values' => ['Rosewood', 'Olive Gray', 'Pastel Green', 'Slate Blue']]],
            'Jordan' => [['name' => 'Size', 'values' => ['7', '8', '9', '10']]],
            'Long Sleeve' => [['name' => 'Color', 'values' => ['Red', 'Yellow', 'Blue', 'Gray']]],
            'Jackets' => [['name' => 'Color', 'values' => ['Goldenrod', 'Charcoal Brown']]],
            'Cap' => [['name' => 'Color', 'values' => ['Peach', 'Periwinkle', 'Blush', 'Coral Red', 'Black']]],
            
            // Essence Perfume Gallery
            'Ecocradle' => [['name' => 'Volume', 'values' => ['50ml', '20ml']]],
            'Plum Vibes' => [['name' => 'Volume', 'values' => ['60ml', '30ml']]],
            'Honey Vanilla' => [['name' => 'Volume', 'values' => ['50ml', '15ml']]],
            'Cherry Blossom' => [['name' => 'Volume', 'values' => ['25ml', '50ml', '65ml']]],
            'Beardo Whisky' => [['name' => 'Volume', 'values' => ['40ml', '60ml']]],
            'Air' => [['name' => 'Volume', 'values' => ['20ml', '35ml']]],
            'Wild Stone' => [['name' => 'Volume', 'values' => ['10ml', '20ml']]],
            'Vanilla Bliss' => [['name' => 'Volume', 'values' => ['20ml', '30ml']]],
            
            // Home Decor Haven
            'Placemats' => [['name' => 'Pack Of Piece', 'values' => ['6', '4']]],
            'Shop Dispenser' => [['name' => 'Color', 'values' => ['Dusty Steel', 'White']]],
            
            // Fashion Forward Boutique
            'Socks Tights' => [['name' => 'Color', 'values' => ['White', 'Dusty Sky']]],
            'Elegant Silk Evening Gown' => [['name' => 'Size', 'values' => ['S', 'M', 'L', 'XL', 'XXL']]],
            'Footwear' => [['name' => 'Size', 'values' => ['6', '7', '8', '9']]],
            'Jackets Hoodies' => [['name' => 'Size', 'values' => ['S', 'M', 'L', 'XL', 'XXL']]],
            'Sets Suits' => [['name' => 'Size', 'values' => ['S', 'XS']]],
            
            // TechHub Electronics
            'Canon' => [['name' => 'Color', 'values' => ['White', 'Black']]],
            'FUJIFILM Instax Mini 12' => [['name' => 'Color', 'values' => ['White', 'Blue Porcelain']]],
            'Garmin Forerunner Series' => [['name' => 'Color', 'values' => ['Black', 'White']]],
            'Fossil Gen 6' => [['name' => 'Color', 'values' => ['Driftwood Gray', 'Burnt Sienna', 'Ocean Abyss', 'Charcoal']]],
            'Fitbit Versa Series' => [['name' => 'Color', 'values' => ['Slate Navy', 'Burnt Rose', 'Black']]],
            'BoAt Storm Series' => [['name' => 'Color', 'values' => ['Pale Clay', 'Steel Harbor', 'Deep Moss', 'Weathered Taupe']]],
            'Nothing Buds Pro 2' => [['name' => 'Color', 'values' => ['Deep Sapphire', 'Black']]],
            'Realme Buds T200 Lite' => [['name' => 'Color', 'values' => ['Soft Violet', 'White']]],
            
            // Beauty Bliss Cosmetics
            'Perfumes' => [['name' => 'Volume', 'values' => ['20ml', '50ml']]],
            
            // Elegant Jewelry Collection
            'Rooster Brooch' => [['name' => 'Color', 'values' => ['Gold', 'Silver']]],
            
            // Luxury Timepieces
            'Phoenix' => [['name' => 'Color', 'values' => ['Silver', 'Black']]],
            'Guess' => [['name' => 'Color', 'values' => ['Gold And Silver', 'Green Dial']]],
            'Fastrack' => [['name' => 'Dial Color', 'values' => ['Black', 'Sk Blue']]],
            
            // AutoMax Car Dealership
            'Vision Wheel 81 Series Wheel' => [['name' => 'Color', 'values' => ['Silver', 'Black']]],
            'UNO MINDA 14 Inch PCD 100 Wheel' => [['name' => 'Color', 'values' => ['Silver', 'Black']]],
            'Waterproof Car Cover' => [['name' => 'Color', 'values' => ['Grey', 'White']]],
            'Velvet Fabric Car Seat Cover' => [['name' => 'Color', 'values' => ['Graphite Shadow', 'Shadowed Sapphire', 'Deep Garnet']]],
        ];

        return isset($variantsMap[$productName]) ? json_encode($variantsMap[$productName]) : null;
    }

}