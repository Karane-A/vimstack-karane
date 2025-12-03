<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request, $storeSlug)
    {
        $store = Store::where('slug', $storeSlug)->first();
        
        // If store not found, return 404
        if (!$store) {
            abort(404, 'Store not found');
        }
        
        if ($request->isMethod('post')) {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $customer = Customer::where('store_id', $store->id)
                ->where('email', $request->email)
                ->where('is_active', true)
                ->first();

            if ($customer && Hash::check($request->password, $customer->password)) {
                Auth::guard('customer')->login($customer, $request->boolean('remember'));
                
                return redirect()->intended(route('store.home', $storeSlug));
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Get dynamic content from database
        $storeContent = \App\Models\StoreSetting::getSettings($store->id, $store->theme ?? 'default');

        // Use theme-specific login page
        $loginPage = 'store/auth/login'; // default
        if ($store->theme === 'fashion') $loginPage = 'store/fashion/FashionLogin';
        if ($store->theme === 'electronics') $loginPage = 'store/electronics/ElectronicsLogin';
        if ($store->theme === 'beauty-cosmetics') $loginPage = 'store/beauty-cosmetics/BeautyLogin';
        if ($store->theme === 'jewelry') $loginPage = 'store/jewelry/JewelryLogin';
        if ($store->theme === 'watches') $loginPage = 'store/watches/WatchesLogin';
        if ($store->theme === 'cars-automotive') $loginPage = 'store/cars-automotive/CarsLogin';
        if ($store->theme === 'baby-kids') $loginPage = 'store/baby-kids/BabyKidsLogin';
        
        $configuration = \App\Models\StoreConfiguration::getConfiguration($store->id);
        
        return inertia($loginPage, [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'logo' => $configuration['logo'] ?: '/storage/media/logo.png',
                'theme' => $store->theme ?? 'default',
                'slug' => $store->slug
            ],
            'theme' => $store->theme ?? 'default',
            'storeContent' => $storeContent,
            'debug_theme' => $store->theme, // Add debug
            'customPages' => \App\Models\CustomPage::where('store_id', $store->id)
                ->where('status', 'published')
                ->where('show_in_navigation', true)
                ->orderBy('order')
                ->get()->map(function($page) use ($storeSlug) {
                    return [
                        'id' => $page->id,
                        'name' => $page->title,
                        'href' => route('store.page', ['storeSlug' => $storeSlug, 'slug' => $page->slug])
                    ];
                }),
        ]);
    }

    public function register(Request $request, $storeSlug)
    {
        $store = Store::where('slug', $storeSlug)->firstOrFail();
        
        if ($request->isMethod('post')) {
            // Handle both name formats (single name field or first_name/last_name)
            if ($request->has('name') && !$request->has('first_name')) {
                $nameParts = explode(' ', trim($request->name), 2);
                $request->merge([
                    'first_name' => $nameParts[0] ?? '',
                    'last_name' => $nameParts[1] ?? '',
                ]);
            }
            
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $existingCustomer = Customer::where('store_id', $store->id)
                ->where('email', $request->email)
                ->first();

            if ($existingCustomer) {
                throw ValidationException::withMessages([
                    'email' => ['A customer with this email already exists.'],
                ]);
            }

            $customer = Customer::create([
                'store_id' => $store->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name ?: '',
                'email' => $request->email,
                'password' => $request->password,
                'is_active' => true,
            ]);

            Auth::guard('customer')->login($customer);

            // Clear any validation errors and redirect
            session()->forget('errors');
            return redirect()->route('store.home', ['storeSlug' => $storeSlug])
                ->with('success', 'Account created successfully! Welcome to ' . $store->name);
        }

        // Get dynamic content from database
        $storeContent = \App\Models\StoreSetting::getSettings($store->id, $store->theme ?? 'default');
        
        // Use theme-specific register page
        $registerPage = 'store/auth/register'; // default
        if ($store->theme === 'fashion') $registerPage = 'store/fashion/FashionRegister';
        if ($store->theme === 'electronics') $registerPage = 'store/electronics/ElectronicsRegister';
        if ($store->theme === 'beauty-cosmetics') $registerPage = 'store/beauty-cosmetics/BeautyRegister';
        if ($store->theme === 'jewelry') $registerPage = 'store/jewelry/JewelryRegister';
        if ($store->theme === 'watches') $registerPage = 'store/watches/WatchesRegister';
        if ($store->theme === 'cars-automotive') $registerPage = 'store/cars-automotive/CarsRegister';
        if ($store->theme === 'baby-kids') $registerPage = 'store/baby-kids/BabyKidsRegister';
        
        $configuration = \App\Models\StoreConfiguration::getConfiguration($store->id);
        
        return inertia($registerPage, [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'logo' => $configuration['logo'] ?: '/storage/media/logo.png',
                'theme' => $store->theme ?? 'default',
                'slug' => $store->slug
            ],
            'theme' => $store->theme ?? 'default',
            'storeContent' => $storeContent,
            'customPages' => \App\Models\CustomPage::where('store_id', $store->id)
                ->where('status', 'published')
                ->where('show_in_navigation', true)
                ->orderBy('order')
                ->get()->map(function($page) use ($storeSlug) {
                    return [
                        'id' => $page->id,
                        'name' => $page->title,
                        'href' => route('store.page', ['storeSlug' => $storeSlug, 'slug' => $page->slug])
                    ];
                }),
        ]);
    }

    public function logout(Request $request, $storeSlug)
    {
        Auth::guard('customer')->logout();
        
        // Only regenerate token, don't invalidate entire session
        // This prevents affecting backend user authentication
        $request->session()->regenerateToken();

        return redirect()->route('store.home', $storeSlug);
    }


}