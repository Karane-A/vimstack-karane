<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Plan;
use App\Models\Contact;
use App\Models\LandingPageSetting;
use App\Models\LandingPageCustomPage;
use App\Models\Store;

class LandingPageController extends Controller
{
    public function show(Request $request)
    {
        $host = $request->getHost();
        $store = null;
        
        // Check if it's a subdomain request for stores
        $hostParts = explode('.', $host);
        if (count($hostParts) > 2) {
            $subdomain = $hostParts[0];
            $store = Store::where('slug', $subdomain)
                ->where('is_active', true)
                ->first();
        }
        
        // Check for store custom domain
        if (!$store) {
            $store = Store::where('custom_domain', rtrim(preg_replace('/^https?:\/\//', '', $host), '/'))
                ->where('is_active', true)
                ->first();
        }

        if ($store) {
            // Redirect to store frontend
            return redirect()->route('store.home', ['storeSlug' => $store->slug]);
        }
        
        // Check if landing page is enabled in settings
        if (!isLandingPageEnabled()) {
            return redirect()->route('login');
        }
        
        $landingSettings = LandingPageSetting::getSettings();
        
        $plans = Plan::where('is_plan_enable', 'on')->get()->map(function ($plan) {
            $features = [];
            if ($plan->features) {
                $enabledFeatures = $plan->getEnabledFeatures();
                $featureLabels = [
                    'custom_domain' => __('Custom Domain'),
                    'custom_subdomain' => __('Subdomain'),
                    'pwa_support' => __('PWA'),
                    'ai_integration' => __('AI Integration'),
                    'password_protection' => __('Password Protection')
                ];
                foreach ($enabledFeatures as $feature) {
                    if (isset($featureLabels[$feature])) {
                        $features[] = $featureLabels[$feature];
                    }
                }
                
                // Add template sections with count
                $templateSections = $plan->getAllowedTemplateSections();
                if (!empty($templateSections)) {
                    $features[] = __('Template Sections ( :count )', ['count' => count($templateSections)]);
                } else {
                    $features[] = __('Template Sections ( :count )', ['count' => $templateSections ?? 0]);
                }
            } else {
                // Fallback to legacy columns
                if ($plan->enable_custdomain === 'on') $features[] = __('Custom Domain');
                if ($plan->enable_custsubdomain === 'on') $features[] = __('Subdomain');
                if ($plan->pwa_business === 'on') $features[] = __('PWA');
                if ($plan->enable_chatgpt === 'on') $features[] = __('AI Integration');
                if ($plan->enable_custom_pages === 'on') $features[] = __('Custom Pages');
                if ($plan->enable_blog === 'on') $features[] = __('Blog');
                if ($plan->enable_shipping_method === 'on') $features[] = __('Shipping Method');
            }
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $plan->price,
                'yearly_price' => $plan->yearly_price,
                'duration' => 'both', // Allow both monthly and yearly
                'description' => $plan->description,
                'features' => $features,
                'stats' => [
                    'stores' => $plan->max_stores ?? $plan->business ?? 'N/A',
                    'users_per_store' => $plan->max_users_per_store ?? $plan->max_users ?? 'N/A',
                    'products_per_store' => $plan->max_products_per_store ?? 0,
                    'storage' => $plan->storage_limit ? $plan->storage_limit . ' GB' : '5 GB',
                    'templates' => is_array($plan->themes) && count($plan->themes) > 0 ? count($plan->themes) : '10',
                    'bio_links' => 'N/A',
                    'bio_links_templates' => '14',
                ],
                'is_plan_enable' => $plan->is_plan_enable,
                'is_popular' => false // Will be set based on subscriber count
            ];
        });
        
        // Mark most subscribed plan as popular
        $planSubscriberCounts = Plan::withCount('users')->get()->pluck('users_count', 'id');
        if ($planSubscriberCounts->isNotEmpty()) {
            $mostSubscribedPlanId = $planSubscriberCounts->keys()->sortByDesc(function($planId) use ($planSubscriberCounts) {
                return $planSubscriberCounts[$planId];
            })->first();
            
            $plans = $plans->map(function($plan) use ($mostSubscribedPlanId) {
                if ($plan['id'] == $mostSubscribedPlanId && $plan['price'] != '0') {
                    $plan['is_popular'] = true;
                }
                return $plan;
            });
        }
        
        // Get featured stores instead of campaigns
        $featuredStores = Store::where('is_active', true)
            ->where('is_featured', true)
            ->limit(6)
            ->get()
            ->map(function ($store) {
                return [
                    'id' => $store->id,
                    'name' => $store->name,
                    'description' => $store->description,
                    'slug' => $store->slug,
                    'logo' => $store->logo,
                ];
            });
        
        return Inertia::render('landing-page/index', [
            'plans' => $plans,
            'testimonials' => [],
            'faqs' => [],
            'customPages' => LandingPageCustomPage::active()->ordered()->get() ?? [],
            'settings' => $landingSettings,
            'featuredStores' => $featuredStores
        ]);
    }

    public function submitContact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_landing_page' => true,
            'business_id' => null
        ]);

        return back()->with('success', __('Thank you for your message. We will get back to you soon!'));
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255|unique:newsletters,email'
        ]);

        \App\Models\Newsletter::create([
            'email' => $request->email,
            'status' => 'active',
            'subscribed_at' => now()
        ]);

        return back()->with('success', __('Thank you for subscribing to our newsletter!'));
    }

    public function settings()
    {
        $landingSettings = LandingPageSetting::getSettings();
        
        return Inertia::render('landing-page/settings', [
            'settings' => $landingSettings
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:255',
            'contact_address' => 'required|string|max:255',
            'config_sections' => 'required|array'
        ]);
        $landingSettings = LandingPageSetting::getSettings();
        $landingSettings->update($request->all());

        return back()->with('success', __('Landing page settings updated successfully!'));
    }
}