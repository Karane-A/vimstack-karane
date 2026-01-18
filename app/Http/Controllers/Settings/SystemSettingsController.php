<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\StorageConfigService;

class SystemSettingsController extends Controller
{
    /**
     * Update the system settings.
     *
     * Handles system-wide configuration including:
     * - Language and localization settings
     * - Date/time formats and timezone
     * - Email verification requirements
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'defaultLanguage' => 'required|string',
                'dateFormat' => 'required|string',
                'timeFormat' => 'required|string',
                'calendarStartDay' => 'required|string',
                'defaultTimezone' => 'required|string',
                'emailVerification' => 'boolean',
                'registrationEnabled' => 'boolean',
                'termsConditionsUrl' => 'nullable|url',
            ]);

            $user = auth()->user();
            $storeId = $user->type === 'company' ? getCurrentStoreId($user) : null;

            foreach ($validated as $key => $value) {
                updateSetting($key, $value, $user->id, $storeId);
            }

            return redirect()->back()->with('success', __('System settings updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update system settings: :error', ['error' => $e->getMessage()]));
        }
    }
    
    /**
     * Update the brand settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateBrand(Request $request)
    {
        try {
            $validated = $request->validate([
                'settings' => 'required|array',
                'settings.logoLight' => 'nullable|string',
                'settings.favicon' => 'nullable|string',
                'settings.titleText' => 'nullable|string|max:255',
                'settings.footerText' => 'nullable|string|max:500',
                'settings.themeColor' => 'nullable|string|in:blue,green,purple,orange,red,custom',
                'settings.customColor' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'settings.sidebarVariant' => 'nullable|string|in:inset,floating,minimal',
                'settings.sidebarStyle' => 'nullable|string|in:plain,colored,gradient',
                'settings.layoutDirection' => 'nullable|string|in:left,right',
            ]);

            // Force light mode
            $validated['settings']['themeMode'] = 'light';

            $user = auth()->user();
            $storeId = $user->type === 'company' ? getCurrentStoreId($user) : null;
            
            foreach ($validated['settings'] as $key => $value) {
                updateSetting($key, $value, $user->id, $storeId);
            }

            return redirect()->back()->with('success', __('Brand settings updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update brand settings: :error', ['error' => $e->getMessage()]));
        }
    }

    /**
     * Update the recaptcha settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateRecaptcha(Request $request)
    {
        try {
            $validated = $request->validate([
                'recaptchaEnabled' => 'boolean',
                'recaptchaVersion' => 'required|in:v2,v3',
                'recaptchaSiteKey' => 'required|string',
                'recaptchaSecretKey' => 'required|string',
            ]);
            
            foreach ($validated as $key => $value) {
                updateSetting($key, $value);
            }

            return redirect()->back()->with('success', __('ReCaptcha settings updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update ReCaptcha settings: :error', ['error' => $e->getMessage()]));
        }
    }

    /**
     * Update the storage settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStorage(Request $request)
    {
        try {
            $validated = $request->validate([
                'storage_type' => 'required|in:local,aws_s3,wasabi',
                'allowedFileTypes' => 'required|string',
                'maxUploadSize' => 'required|numeric|min:1',
                'awsAccessKeyId' => 'required_if:storage_type,aws_s3|string',
                'awsSecretAccessKey' => 'required_if:storage_type,aws_s3|string',
                'awsDefaultRegion' => 'required_if:storage_type,aws_s3|string',
                'awsBucket' => 'required_if:storage_type,aws_s3|string',
                'awsUrl' => 'required_if:storage_type,aws_s3|string',
                'awsEndpoint' => 'required_if:storage_type,aws_s3|string',
                'wasabiAccessKey' => 'required_if:storage_type,wasabi|string',
                'wasabiSecretKey' => 'required_if:storage_type,wasabi|string',
                'wasabiRegion' => 'required_if:storage_type,wasabi|string',
                'wasabiBucket' => 'required_if:storage_type,wasabi|string',
                'wasabiUrl' => 'required_if:storage_type,wasabi|string',
                'wasabiRoot' => 'required_if:storage_type,wasabi|string',
            ]);

            $userId = Auth::id();
            
            $settings = [
                'storage_type' => $validated['storage_type'],
                'storage_file_types' => $validated['allowedFileTypes'],
                'storage_max_upload_size' => $validated['maxUploadSize'],
            ];

            if ($validated['storage_type'] === 'aws_s3') {
                $settings['aws_access_key_id'] = $validated['awsAccessKeyId'];
                $settings['aws_secret_access_key'] = $validated['awsSecretAccessKey'];
                $settings['aws_default_region'] = $validated['awsDefaultRegion'];
                $settings['aws_bucket'] = $validated['awsBucket'];
                $settings['aws_url'] = $validated['awsUrl'];
                $settings['aws_endpoint'] = $validated['awsEndpoint'];
            }

            if ($validated['storage_type'] === 'wasabi') {
                $settings['wasabi_access_key'] = $validated['wasabiAccessKey'];
                $settings['wasabi_secret_key'] = $validated['wasabiSecretKey'];
                $settings['wasabi_region'] = $validated['wasabiRegion'];
                $settings['wasabi_bucket'] = $validated['wasabiBucket'];
                $settings['wasabi_url'] = $validated['wasabiUrl'];
                $settings['wasabi_root'] = $validated['wasabiRoot'];
            }
            
            foreach ($settings as $key => $value) {
                updateSetting($key, $value);
            }

            StorageConfigService::clearCache();

            return redirect()->back()->with('success', __('Storage settings updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update storage settings: :error', ['error' => $e->getMessage()]));
        }
    }

    /**
     * Update the cookie settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateCookie(Request $request)
    {
        try {
            $validated = $request->validate([
                'enableLogging' => 'required|boolean',
                'strictlyNecessaryCookies' => 'required|boolean',
                'cookieTitle' => 'required|string|max:255',
                'strictlyCookieTitle' => 'required|string|max:255',
                'cookieDescription' => 'required|string',
                'strictlyCookieDescription' => 'required|string',
                'contactUsDescription' => 'required|string',
                'contactUsUrl' => 'required|url',
            ]);
            
            $user = auth()->user();
            $storeId = $user->type === 'company' ? getCurrentStoreId($user) : null;
            
            foreach ($validated as $key => $value) {
                updateSetting($key, is_bool($value) ? ($value ? '1' : '0') : $value, $user->id, $storeId);
            }

            return redirect()->back()->with('success', __('Cookie settings updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update cookie settings: :error', ['error' => $e->getMessage()]));
        }
    }

    /**
     * Update the SEO settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateSeo(Request $request)
    {
        try {
            $validated = $request->validate([
                'metaKeywords' => 'required|string|max:255',
                'metaDescription' => 'required|string|max:160',
                'metaImage' => 'nullable|string',
                'metaImageFile' => 'nullable|image|max:5120', // 5MB max
            ]);
            
            $metaImage = $validated['metaImage'] ?? '';
            
            // Handle file upload if present
            if ($request->hasFile('metaImageFile')) {
                // Delete old image if exists
                $oldImage = getSetting('metaImage');
                if ($oldImage && str_contains($oldImage, 'seo-images/')) {
                    // Extract filename from URL
                    $filename = basename(parse_url($oldImage, PHP_URL_PATH));
                    \Storage::disk('public')->delete('seo-images/' . $filename);
                }
                
                $file = $request->file('metaImageFile');
                $path = $file->store('seo-images', 'public');
                $metaImage = config('app.url') . '/storage/' . $path;
            }
            
            // Require either existing image or new upload
            if (empty($metaImage)) {
                return redirect()->back()->with('error', __('Meta Image is required'));
            }
            
            // Update settings
            updateSetting('metaKeywords', $validated['metaKeywords']);
            updateSetting('metaDescription', $validated['metaDescription']);
            updateSetting('metaImage', $metaImage);

            return redirect()->back()->with('success', __('SEO settings updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update SEO settings: :error', ['error' => $e->getMessage()]));
        }
    }



    /**
     * Clear application cache.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clearCache()
    {
        try {
            \Artisan::call('cache:clear');
            \Artisan::call('route:clear');
            \Artisan::call('view:clear');
            \Artisan::call('optimize:clear');

            return redirect()->back()->with('success', __('Cache cleared successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to clear cache: :error', ['error' => $e->getMessage()]));
        }
    }
    
    /**
     * Store email notification settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function mailNotificationStore(Request $request)
    {
        try {
            $user = auth()->user();
            $storeId = $user->type === 'company' ? getCurrentStoreId($user) : null;
            
            if ($request->has('mail_noti')) {
                foreach ($request->mail_noti as $key => $notification) {
                    Setting::setSetting($key, $notification, $user->id, $storeId);
                }
            }
            
            return redirect()->back()->with('success', __('Mail Notification Setting save sucessfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update email notification settings: :error', ['error' => $e->getMessage()]));
        }
    }
}