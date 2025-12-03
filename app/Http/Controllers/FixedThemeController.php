<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FixedThemeController extends Controller
{
    /**
     * Display the checkout page with the specified theme.
     */
    public function checkout($theme = 'default')
    {
        // In a real app, we would get the store based on the domain or request
        // For demo purposes, we'll use a static store
        $store = [
            'id' => 1,
            'name' => 'Home Accessories',
            'logo' => '/storage/media/logo.png',
            'description' => 'Quality home decor and accessories for every room',
        ];
        
        // Customize store data based on theme
        if ($theme === 'furniture') {
            $store['name'] = 'Furniture Store';
        } elseif ($theme === 'watch') {
            $store['name'] = 'Watch Store';
        }
        
        // Demo cart items
        $cartItems = [
            [
                'id' => 1,
                'name' => 'Modern Wooden Coffee Table',
                'price' => 299.99,
                'sale_price' => 249.99,
                'cover_image' => 'https://placehold.co/600x600?text=Coffee+Table',
                'quantity' => 1,
                'stock' => 15,
                'is_active' => true,
                'category' => [
                    'id' => 1,
                    'name' => 'Living Room'
                ],
            ],
            [
                'id' => 3,
                'name' => 'Floor Lamp',
                'price' => 129.99,
                'sale_price' => 99.99,
                'cover_image' => 'https://placehold.co/600x600?text=Floor+Lamp',
                'quantity' => 2,
                'stock' => 3,
                'is_active' => true,
                'category' => [
                    'id' => 2,
                    'name' => 'Lighting'
                ],
            ],
            [
                'id' => 4,
                'name' => 'Decorative Vase',
                'price' => 79.99,
                'cover_image' => 'https://placehold.co/600x600?text=Decorative+Vase',
                'quantity' => 1,
                'stock' => 8,
                'is_active' => true,
                'category' => [
                    'id' => 3,
                    'name' => 'Decor'
                ],
            ],
        ];
        
        // Calculate cart totals
        $subtotal = 0;
        $discount = 0;
        $shipping = 10.00;
        $tax = 0;
        
        foreach ($cartItems as $item) {
            $itemPrice = isset($item['sale_price']) ? $item['sale_price'] : $item['price'];
            $subtotal += $itemPrice * $item['quantity'];
        }
        
        // Apply demo discount
        if ($subtotal > 300) {
            $discount = $subtotal * 0.1; // 10% discount for orders over $300
        }
        
        // Calculate tax (e.g., 8%)
        $tax = ($subtotal - $discount) * 0.08;
        
        // Calculate total
        $total = $subtotal - $discount + $shipping + $tax;
        
        // Demo user data for pre-filling checkout form
        $user = [
            'id' => 1,
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1 (555) 123-4567',
            'address' => [
                'street' => '123 Main St',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10001',
                'country' => 'United States',
            ],
        ];
        
        return Inertia::render('store/checkout', [
            'store' => $store,
            'theme' => $theme,
            'cartItems' => $cartItems,
            'cartSummary' => [
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
            ],
            'user' => $user,
            'cartCount' => array_sum(array_column($cartItems, 'quantity')),
            'wishlistCount' => 5, // Demo data
            'isLoggedIn' => true, // Assume logged in for checkout
            'userName' => $user['name'], // Demo user name
        ]);
    }
    
    /**
     * Display the order confirmation page with the specified theme.
     */
    public function orderConfirmation($theme = 'default')
    {
        // In a real app, we would get the store based on the domain or request
        // For demo purposes, we'll use a static store
        $store = [
            'id' => 1,
            'name' => 'Home Accessories',
            'logo' => '/storage/media/logo.png',
            'description' => 'Quality home decor and accessories for every room',
        ];
        
        // Customize store data based on theme
        if ($theme === 'furniture') {
            $store['name'] = 'Furniture Store';
        } elseif ($theme === 'watch') {
            $store['name'] = 'Watch Store';
        }
        
        // Demo order data
        $order = [
            'id' => 'ORD-12348',
            'date' => date('Y-m-d'),
            'status' => 'Processing',
            'total' => 529.96,
            'items' => [
                [
                    'id' => 1,
                    'name' => 'Modern Wooden Coffee Table',
                    'price' => 249.99,
                    'quantity' => 1,
                    'image' => 'https://placehold.co/600x600?text=Coffee+Table',
                ],
                [
                    'id' => 3,
                    'name' => 'Floor Lamp',
                    'price' => 99.99,
                    'quantity' => 2,
                    'image' => 'https://placehold.co/600x600?text=Floor+Lamp',
                ],
                [
                    'id' => 4,
                    'name' => 'Decorative Vase',
                    'price' => 79.99,
                    'quantity' => 1,
                    'image' => 'https://placehold.co/600x600?text=Decorative+Vase',
                ],
            ],
            'shipping_address' => [
                'name' => 'John Doe',
                'street' => '123 Main St',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10001',
                'country' => 'United States',
            ],
            'billing_address' => [
                'name' => 'John Doe',
                'street' => '123 Main St',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10001',
                'country' => 'United States',
            ],
            'payment_method' => 'Credit Card (ending in 4242)',
            'shipping_method' => 'Standard Shipping',
        ];
        
        return Inertia::render('store/order-confirmation', [
            'store' => $store,
            'theme' => $theme,
            'order' => $order,
            'cartCount' => 0, // Cart is empty after order
            'wishlistCount' => 5, // Demo data
            'isLoggedIn' => true, // Assume logged in for order confirmation
            'userName' => $order['shipping_address']['name'], // Demo user name
        ]);
    }
}