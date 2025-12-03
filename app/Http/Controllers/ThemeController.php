<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Models\CustomPage;
use App\Models\Store;
use App\Models\User;
use App\Models\CartItem;
use App\Models\Shipping;
use App\Models\Order;
use App\Models\StoreSetting;
use App\Models\StoreConfiguration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\CartCalculationService;

class ThemeController extends Controller
{
    /**
     * Get the store based on slug or resolved from domain
     */
    protected function getStore($storeSlug, Request $request = null)
    {
        // Check if store was resolved by domain middleware
        if ($request && $request->attributes->has('resolved_store')) {
            $store = $request->attributes->get('resolved_store');
            $configuration = StoreConfiguration::getConfiguration($store->id);
            $logo = $configuration['logo'] ?: '/storage/media/logo.png';
            $favicon = $configuration['favicon'] ?: '';
            
            return [
                'id' => $store->id,
                'name' => $store->name,
                'logo' => $logo,
                'favicon' => $favicon,
                'description' => $store->description,
                'theme' => $store->theme,
                'slug' => $store->slug,
                'pwa' => [
                    'enabled' => $store->enable_pwa && ($store->user->plan && $store->user->plan->pwa_business === 'on'),
                    'name' => $store->pwa_name ?: $store->name,
                    'short_name' => $store->pwa_short_name ?: substr($store->name, 0, 12),
                    'description' => $store->pwa_description ?: $store->description,
                    'theme_color' => $store->pwa_theme_color ?: '#3B82F6',
                    'background_color' => $store->pwa_background_color ?: '#ffffff',
                    'icon' => $store->pwa_icon ?: $logo,
                    'display' => $store->pwa_display ?: 'standalone',
                    'orientation' => $store->pwa_orientation ?: 'portrait',
                    'manifest_url' => route('store.pwa.manifest', $store->slug),
                    'sw_url' => route('store.pwa.sw', $store->slug)
                ]
            ];
        }
        
        // Try to find the store in the database by slug
        $store = Store::where('slug', $storeSlug)->where('is_active', true)->first();
        
        if ($store) {
            $configuration = StoreConfiguration::getConfiguration($store->id);
            $logo = $configuration['logo'] ?: '/storage/media/logo.png';
            $favicon = $configuration['favicon'] ?: '';
            
            return [
                'id' => $store->id,
                'name' => $store->name,
                'logo' => $logo,
                'favicon' => $favicon,
                'description' => $store->description,
                'theme' => $store->theme,
                'slug' => $store->slug,
                'pwa' => [
                    'enabled' => $store->enable_pwa && ($store->user->plan && $store->user->plan->pwa_business === 'on'),
                    'name' => $store->pwa_name ?: $store->name,
                    'short_name' => $store->pwa_short_name ?: substr($store->name, 0, 12),
                    'description' => $store->pwa_description ?: $store->description,
                    'theme_color' => $store->pwa_theme_color ?: '#3B82F6',
                    'background_color' => $store->pwa_background_color ?: '#ffffff',
                    'icon' => $store->pwa_icon ?: $logo,
                    'display' => $store->pwa_display ?: 'standalone',
                    'orientation' => $store->pwa_orientation ?: 'portrait',
                    'manifest_url' => route('store.pwa.manifest', $store->slug),
                    'sw_url' => route('store.pwa.sw', $store->slug)
                ]
            ];
        }
        
        // Store not found - throw exception
        abort(404, 'Store not found');
    }

    /**
     * Get custom pages for navigation
     */
    protected function getCustomPages($storeId, $storeSlug)
    {
        return CustomPage::where('store_id', $storeId)
            ->where('status', 'published')
            ->where('show_in_navigation', true)
            ->orderBy('order')
            ->select('id', 'title', 'slug')
            ->get()
            ->map(function ($page) use ($storeSlug) {
                return [
                    'id' => $page->id,
                    'name' => $page->title,
                    'href' => route('store.page', ['storeSlug' => $storeSlug, 'slug' => $page->slug])
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get common data for all store pages
     */
    protected function getCommonData()
    {
        return [
            'isLoggedIn' => Auth::guard('customer')->check(),
            'customer' => Auth::guard('customer')->user(),
        ];
    }

    /**
     * Display the store homepage.
     */
    public function home($storeSlug, Request $request = null)
    {
        $store = $this->getStore($storeSlug, $request);
        
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get dynamic content from database or fallback to static
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        // Get categories for the store
        $categories = Category::where('store_id', $store['id'])
            ->where('is_active', true)
            ->whereNull('parent_id') // Only get parent categories
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($category) use ($storeSlug) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'image' => $category->image,
                    'products_count' => $category->products_count,
                    'href' => route('store.products', ['storeSlug' => $storeSlug]) . '?category=' . $category->id
                ];
            });
        
        // Get featured products for the store
        $featuredProducts = Product::where('store_id', $store['id'])
            ->where('is_active', true)
            ->with('category')
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'cover_image' => $product->cover_image,
                    'stock' => $product->stock,
                    'is_active' => $product->is_active,
                    'variants' => $product->variants,
                    'category' => [
                        'id' => $product->category->id ?? null,
                        'name' => $product->category->name ?? 'Uncategorized',
                    ],
                ];
            });
        
        // Get trending products for the store (different from featured)
        $trendingProducts = Product::where('store_id', $store['id'])
            ->where('is_active', true)
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->take(12)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'cover_image' => $product->cover_image,
                    'stock' => $product->stock,
                    'is_active' => $product->is_active,
                    'variants' => $product->variants,
                    'category' => [
                        'id' => $product->category->id ?? null,
                        'name' => $product->category->name ?? 'Uncategorized',
                    ],
                ];
            });
        
        // Get latest blog posts for the store
        $blogPosts = Blog::where('store_id', $store['id'])
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->with(['author', 'category'])
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'featured_image' => $post->featured_image,
                    'published_at' => $post->published_at,
                    'author' => [
                        'id' => $post->author->id ?? null,
                        'name' => $post->author->name ?? 'Unknown',
                    ],
                    'category' => [
                        'id' => $post->category->id ?? null,
                        'name' => $post->category->name ?? null,
                    ],
                ];
            });
        
        return Inertia::render('store/index', array_merge([
            'store' => $store,
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'themeConfig' => true,
            'theme' => $store['theme'],
            'featuredProducts' => $featuredProducts,
            'trendingProducts' => $trendingProducts,
            'categories' => $categories,
            'blogPosts' => $blogPosts,
            'customPages' => $customPages,
            'cartCount' => 3,
            'wishlistCount' => 5,
            'baseUrl' => config('app.url'),
        ], $this->getCommonData()));
    }

    /**
     * Display the cart page.
     */
    public function cart($storeSlug)
    {
        $store = $this->getStore($storeSlug);
        
        // Get actual cart items from database
        $cartItems = CartItem::where('store_id', $store['id'])
            ->where('session_id', session()->getId())
            ->with(['product', 'product.category'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'sale_price' => $item->product->sale_price,
                    'cover_image' => $item->product->cover_image,
                    'quantity' => $item->quantity,
                    'stock' => $item->product->stock,
                    'is_active' => $item->product->is_active,
                    'category' => [
                        'id' => $item->product->category_id,
                        'name' => $item->product->category->name ?? 'Uncategorized'
                    ]
                ];
            })
            ->toArray();
        
        // Get available shipping methods for the store
        $shippingMethods = Shipping::where('store_id', $store['id'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
        
        // Calculate cart totals using service (without shipping initially)
        $calculation = CartCalculationService::calculateCartTotals(
            $store['id'],
            session()->getId()
        );
        
        $subtotal = $calculation['subtotal'];
        $discount = $calculation['discount'];
        $shipping = $calculation['shipping'];
        $tax = $calculation['tax'];
        $total = $calculation['total'];
        
        // Get custom pages for navigation
        $customPages = CustomPage::where('store_id', $store['id'])
            ->where('status', 'published')
            ->where('show_in_navigation', true)
            ->orderBy('order')
            ->select('id', 'title', 'slug')
            ->get()
            ->map(function ($page) use ($storeSlug) {
                return [
                    'id' => $page->id,
                    'name' => $page->title,
                    'href' => route('store.page', ['storeSlug' => $storeSlug, 'slug' => $page->slug])
                ];
            })
            ->toArray();
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        // Use theme-specific cart page
        $cartPage = 'store/cart'; // default and home-accessories
        if ($store['theme'] === 'fashion') $cartPage = 'store/fashion/FashionCart';
        if ($store['theme'] === 'electronics') $cartPage = 'store/electronics/ElectronicsCart';
        if ($store['theme'] === 'beauty-cosmetics') $cartPage = 'store/beauty-cosmetics/BeautyCart';
        if ($store['theme'] === 'jewelry') $cartPage = 'store/jewelry/JewelryCart';
        if ($store['theme'] === 'cars-automotive') $cartPage = 'store/cars-automotive/CarsCart';
        if ($store['theme'] === 'baby-kids') $cartPage = 'store/baby-kids/BabyKidsCart';
        
        return Inertia::render($cartPage, array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'cartItems' => $cartItems,
            'cartSummary' => [
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
            ],
            'customPages' => $customPages,
            'cartCount' => 0,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the my profile page.
     */
    public function myProfile($storeSlug)
    {
        // Check if customer is authenticated, redirect to login if not
        if (!Auth::guard('customer')->check()) {
            return redirect()->route('store.login', ['storeSlug' => $storeSlug])
                ->with('message', 'Please log in to view your profile.');
        }
        
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        $customer = Auth::guard('customer')->user();
        $address = $customer->addresses()->where('type', 'billing')->where('is_default', true)->first();
        
        $user = [
            'id' => $customer->id,
            'first_name' => $customer->first_name,
            'last_name' => $customer->last_name,
            'email' => $customer->email,
            'phone' => $customer->phone ?? '',
            'date_of_birth' => $customer->date_of_birth?->format('Y-m-d') ?? '',
            'gender' => $customer->gender ?? '',
            'address' => $address ? [
                'address' => $address->address,
                'city' => $address->city,
                'state' => $address->state,
                'postal_code' => $address->postal_code,
                'country' => $address->country,
            ] : [
                'address' => '',
                'city' => '',
                'state' => '',
                'postal_code' => '',
                'country' => 'United States',
            ],
        ];
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Use theme-specific profile page
        $profilePage = 'store/account/profile'; // default and home-accessories
        if ($store['theme'] === 'fashion') $profilePage = 'store/fashion/FashionProfile';
        if ($store['theme'] === 'electronics') $profilePage = 'store/electronics/ElectronicsProfile';
        if ($store['theme'] === 'beauty-cosmetics') $profilePage = 'store/beauty-cosmetics/BeautyProfile';
        if ($store['theme'] === 'jewelry') $profilePage = 'store/jewelry/JewelryProfile';
        if ($store['theme'] === 'furniture-interior') $profilePage = 'store/furniture-interior/FurnitureProfile';
        if ($store['theme'] === 'cars-automotive') $profilePage = 'store/cars-automotive/CarsProfile';
        if ($store['theme'] === 'baby-kids') $profilePage = 'store/baby-kids/BabyKidsProfile';
        
        return Inertia::render($profilePage, array_merge([
            'user' => $user,
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'customPages' => $customPages,
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the my orders page.
     */
    public function myOrders($storeSlug)
    {
        // Check if customer is authenticated, redirect to login if not
        if (!Auth::guard('customer')->check()) {
            return redirect()->route('store.login', ['storeSlug' => $storeSlug])
                ->with('message', 'Please log in to view your orders.');
        }
        
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get orders for logged in customer
        $customerOrders = Order::where('store_id', $store['id'])
            ->where('customer_id', Auth::guard('customer')->id())
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        $orders = $customerOrders->map(function ($order) {
            return [
                'id' => $order->order_number,
                'date' => $order->created_at->toISOString(),
                'status' => ucfirst($order->status),
                'total' => (float) $order->total_amount,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->product_name,
                        'price' => (float) $item->unit_price,
                        'quantity' => $item->quantity,
                        'image' => $item->product->cover_image ?? '/placeholder.jpg',
                    ];
                })->toArray(),
            ];
        })->toArray();
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        // Use theme-specific orders page
        $ordersPage = 'store/account/orders'; // default and home-accessories
        if ($store['theme'] === 'fashion') $ordersPage = 'store/fashion/FashionOrders';
        if ($store['theme'] === 'electronics') $ordersPage = 'store/electronics/ElectronicsOrders';
        if ($store['theme'] === 'beauty-cosmetics') $ordersPage = 'store/beauty-cosmetics/BeautyOrders';
        if ($store['theme'] === 'jewelry') $ordersPage = 'store/jewelry/JewelryOrders';
        if ($store['theme'] === 'watches') $ordersPage = 'store/watches/WatchesOrders';
        if ($store['theme'] === 'furniture-interior') $ordersPage = 'store/furniture-interior/FurnitureOrders';
        if ($store['theme'] === 'cars-automotive') $ordersPage = 'store/cars-automotive/CarsOrders';
        if ($store['theme'] === 'baby-kids') $ordersPage = 'store/baby-kids/BabyKidsOrders';
        
        return Inertia::render($ordersPage, array_merge([
            'orders' => $orders,
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'customPages' => $customPages,
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the product detail page.
     */
    public function product($storeSlug, $id)
    {
        $store = $this->getStore($storeSlug);
        
        $product = Product::where('store_id', $store['id'])
            ->where('id', $id)
            ->where('is_active', true)
            ->with('category')
            ->firstOrFail();
            
        // Get product reviews
        $reviews = \App\Models\ProductReview::where('product_id', $id)
            ->where('is_approved', true)
            ->with('customer:id,first_name,last_name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'content' => $review->content,
                    'customer_name' => $review->customer->first_name . ' ' . substr($review->customer->last_name, 0, 1) . '.',
                    'created_at' => $review->created_at->diffForHumans(),
                    'store_response' => $review->store_response,
                ];
            });
            
        $averageRating = $reviews->avg('rating') ?: 0;
        $totalReviews = $reviews->count();
        
        $productData = [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'description' => $product->description,
            'specifications' => $product->specifications,
            'details' => $product->details,
            'price' => $product->price,
            'sale_price' => $product->sale_price,
            'stock' => $product->stock,
            'cover_image' => $product->cover_image,
            'images' => $product->images,
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name
            ] : null,
            'is_active' => $product->is_active,
            'variants' => $product->variants,
            'custom_fields' => $product->custom_fields,
            'reviews' => $reviews,
            'average_rating' => round($averageRating, 1),
            'total_reviews' => $totalReviews,
        ];
        
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }

         // Get related products from same category
        $relatedProducts = Product::where('store_id', $store['id'])
            ->where('is_active', true)
            ->where('id', '!=', $id)
            ->when($product->category_id, function ($query) use ($product) {
                return $query->where('category_id', $product->category_id);
            })
            ->with('category')
            ->take(8)
            ->get()
            ->map(function ($relatedProduct) {
                return [
                    'id' => $relatedProduct->id,
                    'name' => $relatedProduct->name,
                    'price' => $relatedProduct->price,
                    'sale_price' => $relatedProduct->sale_price,
                    'cover_image' => $relatedProduct->cover_image,
                    'stock' => $relatedProduct->stock,
                    'is_active' => $relatedProduct->is_active,
                    'variants' => $relatedProduct->variants,
                    'category' => [
                        'id' => $relatedProduct->category->id ?? null,
                        'name' => $relatedProduct->category->name ?? 'Uncategorized',
                    ],
                ];
            });

            // If no related products in same category, get random products from store
        if ($relatedProducts->isEmpty()) {
            $relatedProducts = Product::where('store_id', $store['id'])
                ->where('is_active', true)
                ->where('id', '!=', $id)
                ->with('category')
                ->inRandomOrder()
                ->take(8)
                ->get()
                ->map(function ($relatedProduct) {
                    return [
                        'id' => $relatedProduct->id,
                        'name' => $relatedProduct->name,
                        'price' => $relatedProduct->price,
                        'sale_price' => $relatedProduct->sale_price,
                        'cover_image' => $relatedProduct->cover_image,
                        'stock' => $relatedProduct->stock,
                        'is_active' => $relatedProduct->is_active,
                        'variants' => $relatedProduct->variants,
                        'category' => [
                            'id' => $relatedProduct->category->id ?? null,
                            'name' => $relatedProduct->category->name ?? 'Uncategorized',
                        ],
                    ];
                });
        }
        
        // Use theme-specific product page
        $productPage = 'store/product'; // default and home-accessories
        if ($store['theme'] === 'home-accessories') $productPage = 'store/product'; // Use default with custom fields support
        if ($store['theme'] === 'fashion') $productPage = 'store/fashion/FashionProductDetail';
        if ($store['theme'] === 'electronics') $productPage = 'store/electronics/ElectronicsProductDetail';
        if ($store['theme'] === 'beauty-cosmetics') $productPage = 'store/beauty-cosmetics/BeautyProduct';
        if ($store['theme'] === 'jewelry') $productPage = 'store/jewelry/JewelryProductDetail';
        if ($store['theme'] === 'watches') $productPage = 'store/watches/WatchesProductDetail';
        if ($store['theme'] === 'cars-automotive') $productPage = 'store/cars-automotive/CarsProductDetail';
        if ($store['theme'] === 'baby-kids') $productPage = 'store/baby-kids/BabyKidsProductDetail';
        
        return Inertia::render($productPage, array_merge([
            'product' => $productData,
            'relatedProducts' => $relatedProducts,
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'customPages' => $customPages,
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the wishlist page.
     */
    public function wishlist($storeSlug)
    {
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get wishlist items
        $query = \App\Models\WishlistItem::where('store_id', $store['id'])
            ->with(['product.category']);
            
        if (auth()->guard('customer')->check()) {
            $query->where('customer_id', auth()->guard('customer')->id());
        } else {
            $query->where('session_id', session()->getId())
                  ->whereNull('customer_id');
        }
        
        $wishlistItems = $query->get()->map(function ($item) {
            return [
                'id' => $item->product->id,
                'product_id' => $item->product->id,
                'name' => $item->product->name,
                'price' => $item->product->price,
                'sale_price' => $item->product->sale_price,
                'cover_image' => $item->product->cover_image,
                'stock' => $item->product->stock,
                'is_active' => $item->product->is_active,
                'variants' => is_string($item->product->variants) ? json_decode($item->product->variants, true) : ($item->product->variants ?? []),
                'category' => [
                    'id' => $item->product->category_id,
                    'name' => $item->product->category->name ?? 'Uncategorized'
                ]
            ];
        });
        
        // Get related products (random products from same categories or all products)
        $relatedProducts = \App\Models\Product::where('store_id', $store['id'])
            ->where('is_active', true)
            ->with('category')
            ->inRandomOrder()
            ->take(4)
            ->get();
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        // Use theme-specific wishlist page
        $wishlistPage = 'store/wishlist'; // default and home-accessories
        if ($store['theme'] === 'fashion') $wishlistPage = 'store/fashion/FashionWishlist';
        if ($store['theme'] === 'electronics') $wishlistPage = 'store/electronics/ElectronicsWishlist';
        if ($store['theme'] === 'beauty-cosmetics') $wishlistPage = 'store/beauty-cosmetics/BeautyWishlist';
        if ($store['theme'] === 'jewelry') $wishlistPage = 'store/jewelry/JewelryWishlist';
        if ($store['theme'] === 'cars-automotive') $wishlistPage = 'store/cars-automotive/CarsWishlist';
        if ($store['theme'] === 'baby-kids') $wishlistPage = 'store/baby-kids/BabyKidsWishlist';
        
        return Inertia::render($wishlistPage, array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'customPages' => $customPages,
            'wishlistItems' => $wishlistItems,
            'relatedProducts' => $relatedProducts,
            'cartCount' => 3,
            'wishlistCount' => $wishlistItems->count(),
        ], $this->getCommonData()));
    }

    /**
     * Display a listing of blog posts.
     */
    public function blog($storeSlug)
    {
        $store = $this->getStore($storeSlug);
        
        $posts = Blog::with(['category', 'author'])
            ->where('store_id', $store['id'])
            ->where('status', 'published')
            ->latest('published_at')
            ->take(6)
            ->get();
            
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Use theme-specific blog page
        $blogPage = 'store/blog/index'; // default and home-accessories
        if ($store['theme'] === 'fashion') $blogPage = 'store/fashion/FashionBlog';
        if ($store['theme'] === 'electronics') $blogPage = 'store/electronics/ElectronicsBlog';
        if ($store['theme'] === 'beauty-cosmetics') $blogPage = 'store/beauty-cosmetics/BeautyBlog';
        if ($store['theme'] === 'jewelry') $blogPage = 'store/jewelry/JewelryBlog';
        if ($store['theme'] === 'cars-automotive') $blogPage = 'store/cars-automotive/CarsBlog';
        if ($store['theme'] === 'baby-kids') $blogPage = 'store/baby-kids/BabyKidsBlog';
        
        return Inertia::render($blogPage, array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'posts' => $posts,
            'customPages' => $customPages,
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the specified blog post.
     */
    public function blogPost($storeSlug, $slug)
    {
        $store = $this->getStore($storeSlug);
        
        $post = Blog::with(['category', 'author'])
            ->where('store_id', $store['id'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();
            
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Use theme-specific blog post page
        $blogPostPage = 'store/blog/show'; // default and home-accessories
        if ($store['theme'] === 'fashion') $blogPostPage = 'store/fashion/FashionBlogPost';
        if ($store['theme'] === 'electronics') $blogPostPage = 'store/electronics/ElectronicsBlogPost';
        if ($store['theme'] === 'beauty-cosmetics') $blogPostPage = 'store/beauty-cosmetics/BeautyBlogPost';
        if ($store['theme'] === 'jewelry') $blogPostPage = 'store/jewelry/JewelryBlogPost';
        if ($store['theme'] === 'cars-automotive') $blogPostPage = 'store/cars-automotive/CarsBlogPost';
        if ($store['theme'] === 'baby-kids') $blogPostPage = 'store/baby-kids/BabyKidsBlogPost';
        
        return Inertia::render($blogPostPage, array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'post' => $post,
            'customPages' => $customPages,
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display all products with filtering, sorting, and pagination.
     */
    public function products($storeSlug, Request $request)
    {
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get all categories for filters
        $categories = Category::where('store_id', $store['id'])
            ->where('is_active', true)
            ->withCount('products')
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'products_count' => $category->products_count,
                ];
            });
        
        // Build query for products
        $query = Product::where('store_id', $store['id'])
            ->where('is_active', true)
            ->with(['category', 'reviews']);
        
        // Apply filters
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        if ($request->filled('availability')) {
            if ($request->availability === 'in_stock') {
                $query->where('stock', '>', 0);
            } elseif ($request->availability === 'out_of_stock') {
                $query->where('stock', '<=', 0);
            }
        }
        
        if ($request->filled('rating')) {
            $query->whereIn('id', function ($q) use ($request) {
                $q->select('product_id')
                  ->from('product_reviews')
                  ->where('is_approved', true)
                  ->groupBy('product_id')
                  ->havingRaw('AVG(rating) >= ?', [$request->rating]);
            });
        }
        
        // Apply sorting
        switch ($request->get('sort', 'popularity')) {
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'price_low_high':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high_low':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->withAvg('reviews', 'rating')->orderBy('reviews_avg_rating', 'desc');
                break;
            default: // popularity
                $query->orderBy('created_at', 'desc');
                break;
        }
        
        // Pagination
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);
        
        // Transform products data
        $productsData = $products->getCollection()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'sale_price' => $product->sale_price,
                'cover_image' => $product->cover_image,
                'stock' => $product->stock,
                'is_active' => $product->is_active,
                'variants' => $product->variants,
                'category' => [
                    'id' => $product->category->id ?? null,
                    'name' => $product->category->name ?? 'Uncategorized',
                ],
                'average_rating' => $product->reviews()->avg('rating') ?: 0,
                'total_reviews' => $product->reviews()->count()
            ];
        });
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        // Use theme-specific products page
        $productsPage = 'store/products'; // default and home-accessories
        if ($store['theme'] === 'fashion') $productsPage = 'store/fashion/FashionProducts';
        if ($store['theme'] === 'electronics') $productsPage = 'store/electronics/ElectronicsProducts';
        if ($store['theme'] === 'beauty-cosmetics') $productsPage = 'store/beauty-cosmetics/BeautyProducts';
        if ($store['theme'] === 'jewelry') $productsPage = 'store/jewelry/JewelryProducts';
        if ($store['theme'] === 'watches') $productsPage = 'store/watches/WatchesProducts';
        if ($store['theme'] === 'furniture-interior') $productsPage = 'store/furniture-interior/FurnitureProducts';
        if ($store['theme'] === 'cars-automotive') $productsPage = 'store/cars-automotive/CarsProducts';
        if ($store['theme'] === 'baby-kids') $productsPage = 'store/baby-kids/BabyKidsProducts';
        if ($store['theme'] === 'perfume-fragrances') $productsPage = 'store/perfume-fragrances/PerfumeProducts';
        
        return Inertia::render($productsPage, array_merge([
            'products' => $productsData,
            'categories' => $categories,
            'brands' => [], // Add brands if needed
            'store' => $store,
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'customPages' => $customPages,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'rating' => $request->rating,
                'availability' => $request->availability,
                'sort' => $request->sort,
                'per_page' => $perPage,
            ],
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem() ?: 0,
                'to' => $products->lastItem() ?: 0,
            ],
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display products for a specific category.
     */
    public function category($storeSlug, $slug)
    {
        $store = $this->getStore($storeSlug);
        
        $category = Category::where('store_id', $store['id'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
            
        $products = Product::where('store_id', $store['id'])
            ->where('category_id', $category->id)
            ->where('is_active', true)
            ->with('category')
            ->latest()
            ->take(12)
            ->get();
            
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        return Inertia::render('store/category', array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
            ],
            'products' => $products,
            'customPages' => $customPages,
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display a custom page.
     */
    public function customPage($storeSlug, $slug)
    {
        $store = $this->getStore($storeSlug);
        
        $page = CustomPage::where('store_id', $store['id'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();
            
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Use theme-specific custom page
        $customPageComponent = 'store/custom-page'; // default and home-accessories
        if ($store['theme'] === 'fashion') $customPageComponent = 'store/fashion/FashionCustomPage';
        if ($store['theme'] === 'electronics') $customPageComponent = 'store/electronics/ElectronicsCustomPage';
        if ($store['theme'] === 'beauty-cosmetics') $customPageComponent = 'store/beauty-cosmetics/BeautyCustomPage';
        if ($store['theme'] === 'jewelry') $customPageComponent = 'store/jewelry/JewelryCustomPage';
        if ($store['theme'] === 'cars-automotive') $customPageComponent = 'store/cars-automotive/CarsCustomPage';
        if ($store['theme'] === 'baby-kids') $customPageComponent = 'store/baby-kids/BabyKidsCustomPage';
        
        return Inertia::render($customPageComponent, array_merge([
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'content' => $page->content,
                'slug' => $page->slug,
            ],
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'customPages' => $customPages,
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the order detail page.
     */
    public function orderDetail($storeSlug, $orderNumber)
    {
        // Check if customer is authenticated, redirect to login if not
        if (!Auth::guard('customer')->check()) {
            return redirect()->route('store.login', ['storeSlug' => $storeSlug])
                ->with('message', 'Please log in to view your order details.');
        }
        
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get order for logged in customer
        $orderData = Order::where('order_number', $orderNumber)
            ->where('store_id', $store['id'])
            ->where('customer_id', Auth::guard('customer')->id())
            ->with(['items.product', 'shippingMethod'])
            ->first();
            
        if ($orderData) {
                $order = [
                    'id' => $orderData->order_number,
                    'date' => $orderData->created_at->toISOString(),
                    'status' => ucfirst($orderData->status),
                    'total' => (float) $orderData->total_amount,
                    'subtotal' => (float) $orderData->subtotal,
                    'discount' => (float) $orderData->discount_amount,
                    'shipping' => (float) $orderData->shipping_amount,
                    'tax' => (float) $orderData->tax_amount,
                    'items' => $orderData->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->product_name,
                            'price' => (float) $item->unit_price,
                            'quantity' => $item->quantity,
                            'image' => $item->product->cover_image ?? '/placeholder.jpg',
                        ];
                    })->toArray(),
                    'shipping_address' => [
                        'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                        'street' => $orderData->shipping_address,
                        'city' => \App\Models\City::find($orderData->shipping_city)->name ?? $orderData->shipping_city,
                        'state' => \App\Models\State::find($orderData->shipping_state)->name ?? $orderData->shipping_state,
                        'zip' => $orderData->shipping_postal_code,
                        'country' => \App\Models\Country::find($orderData->shipping_country)->name ?? $orderData->shipping_country,
                    ],
                    'payment_method' => $orderData->payment_method === 'cod' ? 'Cash on Delivery' : ($orderData->payment_method === 'whatsapp' ? 'WhatsApp' : ($orderData->payment_method === 'telegram' ? 'Telegram' : ucfirst(str_replace('_', ' ', $orderData->payment_method)))),
                    'shipping_method' => $orderData->shippingMethod->name ?? '',
                ];
        } else {
            abort(404, 'Order not found.');
        }
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        // Use theme-specific order detail page
        $orderDetailPage = 'store/order-detail'; // default and home-accessories
        if ($store['theme'] === 'fashion') $orderDetailPage = 'store/fashion/FashionOrderDetail';
        if ($store['theme'] === 'electronics') $orderDetailPage = 'store/electronics/ElectronicsOrderDetail';
        if ($store['theme'] === 'beauty-cosmetics') $orderDetailPage = 'store/beauty-cosmetics/BeautyOrderDetail';
        if ($store['theme'] === 'jewelry') $orderDetailPage = 'store/jewelry/JewelryOrderDetail';
        if ($store['theme'] === 'watches') $orderDetailPage = 'store/watches/WatchesOrderDetail';
        if ($store['theme'] === 'furniture-interior') $orderDetailPage = 'store/furniture-interior/FurnitureOrderDetail';
        if ($store['theme'] === 'cars-automotive') $orderDetailPage = 'store/cars-automotive/CarsOrderDetail';
        if ($store['theme'] === 'baby-kids') $orderDetailPage = 'store/baby-kids/BabyKidsOrderDetail';
        
        return Inertia::render($orderDetailPage, array_merge([
            'order' => $order,
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'customPages' => $customPages,
            'cartCount' => 0,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the order confirmation page.
     */
    public function orderConfirmation($storeSlug, $orderNumber = null)
    {
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        $order = null;
        if ($orderNumber) {
            $orderData = Order::where('order_number', $orderNumber)
                ->with(['items.product', 'shippingMethod'])
                ->first();
                
            if ($orderData) {
                $order = [
                    'id' => $orderData->order_number,
                    'date' => $orderData->created_at->toISOString(),
                    'status' => ucfirst($orderData->status),
                    'total' => $orderData->total_amount,
                    'subtotal' => $orderData->subtotal,
                    'discount' => $orderData->discount_amount,
                    'shipping' => $orderData->shipping_amount,
                    'tax' => $orderData->tax_amount,
                    'items' => $orderData->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->product_name,
                            'price' => $item->unit_price,
                            'quantity' => $item->quantity,
                            'image' => $item->product->cover_image ?? '/placeholder.jpg',
                        ];
                    })->toArray(),
                    'shipping_address' => [
                        'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                        'street' => $orderData->shipping_address,
                        'city' => \App\Models\City::find($orderData->shipping_city)->name ?? $orderData->shipping_city,
                        'state' => \App\Models\State::find($orderData->shipping_state)->name ?? $orderData->shipping_state,
                        'zip' => $orderData->shipping_postal_code,
                        'country' => \App\Models\Country::find($orderData->shipping_country)->name ?? $orderData->shipping_country,
                    ],
                    'billing_address' => [
                        'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                        'street' => $orderData->billing_address,
                        'city' => \App\Models\City::find($orderData->billing_city)->name ?? $orderData->billing_city,
                        'state' => \App\Models\State::find($orderData->billing_state)->name ?? $orderData->billing_state,
                        'zip' => $orderData->billing_postal_code,
                        'country' => \App\Models\Country::find($orderData->billing_country)->name ?? $orderData->billing_country,
                    ],
                    'payment_method' => $orderData->payment_method === 'cod' ? 'Cash on Delivery' : ($orderData->payment_method === 'whatsapp' ? 'WhatsApp' : ($orderData->payment_method === 'telegram' ? 'Telegram' : ucfirst(str_replace('_', ' ', $orderData->payment_method)))),
                    'shipping_method' => $orderData->shippingMethod->name ?? '',
                    'coupon_code' => $orderData->coupon_code,
                ];
            }
        }
        
        // Debug: Always show order data if available
        if (!$order && $orderNumber) {
            $orderData = Order::where('order_number', $orderNumber)->first();
            if ($orderData) {
                $order = [
                    'id' => $orderData->order_number,
                    'date' => $orderData->created_at->toISOString(),
                    'status' => ucfirst($orderData->status),
                    'total' => $orderData->total_amount,
                    'payment_method' => $orderData->payment_method === 'cod' ? 'Cash on Delivery' : ($orderData->payment_method === 'whatsapp' ? 'WhatsApp' : ($orderData->payment_method === 'telegram' ? 'Telegram' : ucfirst(str_replace('_', ' ', $orderData->payment_method)))),
                    'shipping_address' => [
                        'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                        'street' => $orderData->shipping_address,
                        'city' => \App\Models\City::find($orderData->shipping_city)->name ?? $orderData->shipping_city,
                        'state' => \App\Models\State::find($orderData->shipping_state)->name ?? $orderData->shipping_state,
                        'zip' => $orderData->shipping_postal_code,
                        'country' => \App\Models\Country::find($orderData->shipping_country)->name ?? $orderData->shipping_country,
                    ],
                ];
            }
        }
        
        // Get WhatsApp redirect URL from session if available
        $whatsappRedirectUrl = session('whatsapp_redirect_url');
        // Don't clear session here - let React handle it
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        // Use theme-specific order confirmation page
        $orderConfirmationPage = 'store/order-confirmation'; // default and home-accessories
        if ($store['theme'] === 'fashion') $orderConfirmationPage = 'store/fashion/FashionOrderConfirmation';
        if ($store['theme'] === 'electronics') $orderConfirmationPage = 'store/electronics/ElectronicsOrderConfirmation';
        if ($store['theme'] === 'beauty-cosmetics') $orderConfirmationPage = 'store/beauty-cosmetics/BeautyOrderConfirmation';
        if ($store['theme'] === 'jewelry') $orderConfirmationPage = 'store/jewelry/JewelryOrderConfirmation';
        if ($store['theme'] === 'watches') $orderConfirmationPage = 'store/watches/WatchesOrderConfirmation';
        if ($store['theme'] === 'furniture-interior') $orderConfirmationPage = 'store/furniture-interior/FurnitureOrderConfirmation';
        if ($store['theme'] === 'cars-automotive') $orderConfirmationPage = 'store/cars-automotive/CarsOrderConfirmation';
        if ($store['theme'] === 'baby-kids') $orderConfirmationPage = 'store/baby-kids/BabyKidsOrderConfirmation';
        if ($store['theme'] === 'perfume-fragrances') $orderConfirmationPage = 'store/perfume-fragrances/PerfumeOrderConfirmation';
        
        return Inertia::render($orderConfirmationPage, array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'order' => $order,
            'whatsappRedirectUrl' => $whatsappRedirectUrl,
            'customPages' => $customPages,
            'cartCount' => 0,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the checkout page.
     */
    public function checkout($storeSlug)
    {
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get cart items and calculate totals
        $calculation = CartCalculationService::calculateCartTotals(
            $store['id'],
            session()->getId()
        );
        
        $cartItems = $calculation['items']->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'price' => $item->product->price,
                'sale_price' => $item->product->sale_price,
                'cover_image' => $item->product->cover_image,
                'quantity' => $item->quantity,
                'stock' => $item->product->stock,
                'is_active' => $item->product->is_active,
                'category' => [
                    'id' => $item->product->category_id,
                    'name' => $item->product->category->name ?? 'Uncategorized'
                ]
            ];
        })->toArray();
        
        // Get available shipping methods for the store
        $shippingMethods = Shipping::where('store_id', $store['id'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
        
        // Get enabled payment methods for the store
        $storeModel = \App\Models\Store::find($store['id']);
        $enabledPaymentMethods = [];
        if ($storeModel && $storeModel->user) {
            $enabledPaymentMethods = getEnabledPaymentMethods($storeModel->user->id, $store['id']);
        }
        
        // Get countries for dynamic location dropdowns
        $countries = \App\Models\Country::active()->orderBy('name')->get();
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        // Use theme-specific checkout page
        $checkoutPage = 'store/checkout'; // default and home-accessories
        if ($store['theme'] === 'fashion') $checkoutPage = 'store/fashion/FashionCheckout';
        if ($store['theme'] === 'electronics') $checkoutPage = 'store/electronics/ElectronicsCheckout';
        if ($store['theme'] === 'beauty-cosmetics') $checkoutPage = 'store/beauty-cosmetics/BeautyCheckout';
        if ($store['theme'] === 'jewelry') $checkoutPage = 'store/jewelry/JewelryCheckout';
        if ($store['theme'] === 'watches') $checkoutPage = 'store/watches/WatchesCheckout';
        if ($store['theme'] === 'furniture-interior') $checkoutPage = 'store/furniture-interior/FurnitureCheckout';
        if ($store['theme'] === 'cars-automotive') $checkoutPage = 'store/cars-automotive/CarsCheckout';
        if ($store['theme'] === 'baby-kids') $checkoutPage = 'store/baby-kids/BabyKidsCheckout';
        if ($store['theme'] === 'perfume-fragrances') $checkoutPage = 'store/perfume-fragrances/PerfumeCheckout';
        
        return Inertia::render($checkoutPage, array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'cartItems' => $cartItems,
            'cartSummary' => [
                'subtotal' => $calculation['subtotal'],
                'discount' => $calculation['discount'],
                'shipping' => 0, // No shipping selected initially
                'tax' => $calculation['tax'],
                'total' => $calculation['subtotal'] - $calculation['discount'] + $calculation['tax'], // Without shipping
            ],
            'shippingMethods' => $shippingMethods->map(function ($method) {
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'description' => $method->description,
                    'cost' => $method->cost,
                    'delivery_time' => $method->delivery_time,
                    'type' => $method->type,
                    'zone_type' => $method->zone_type,
                    'countries' => $method->countries,
                    'min_order_amount' => $method->min_order_amount,
                    'handling_fee' => $method->handling_fee,
                ];
            }),
            'enabledPaymentMethods' => $enabledPaymentMethods,
            'countries' => $countries,
            'customPages' => $customPages,
            'cartCount' => $calculation['items']->sum('quantity'),
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display the forgot password page.
     */
    public function forgotPassword($storeSlug)
    {
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Use theme-specific forgot password page
        $forgotPasswordPage = 'store/auth/forgot-password'; // default and home-accessories
        if ($store['theme'] === 'fashion') $forgotPasswordPage = 'store/fashion/FashionForgotPassword';
        if ($store['theme'] === 'electronics') $forgotPasswordPage = 'store/electronics/ElectronicsForgotPassword';
        if ($store['theme'] === 'beauty-cosmetics') $forgotPasswordPage = 'store/beauty-cosmetics/BeautyForgotPassword';
        if ($store['theme'] === 'jewelry') $forgotPasswordPage = 'store/jewelry/JewelryForgotPassword';
        if ($store['theme'] === 'watches') $forgotPasswordPage = 'store/watches/WatchesForgotPassword';
        if ($store['theme'] === 'cars-automotive') $forgotPasswordPage = 'store/cars-automotive/CarsForgotPassword';
        if ($store['theme'] === 'baby-kids') $forgotPasswordPage = 'store/baby-kids/BabyKidsForgotPassword';
        
        return Inertia::render($forgotPasswordPage, array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'customPages' => $customPages,
            'cartCount' => 0,
            'wishlistCount' => 0,
        ], $this->getCommonData()));
    }

    /**
     * Display the reset password page.
     */
    public function resetPassword($storeSlug, $token)
    {
        $store = $this->getStore($storeSlug);
        $customPages = $this->getCustomPages($store['id'], $storeSlug);
        
        return Inertia::render('store/auth/reset-password', array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'token' => $token,
            'customPages' => $customPages,
            'cartCount' => 0,
            'wishlistCount' => 0,
        ], $this->getCommonData()));
    }
}