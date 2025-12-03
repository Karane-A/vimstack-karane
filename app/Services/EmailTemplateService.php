<?php

namespace App\Services;

use App\Models\EmailTemplate;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cache;
use Exception;

class EmailTemplateService
{
    public function sendTemplateEmail(string $templateName, array $variables, string $toEmail, $business = null, string $toName = null)
    {
        return $this->sendTemplateEmailWithLanguage($templateName, $variables, $toEmail, $toName, 'en');
    }

    private function replaceVariables(string $content, array $variables): string
    {
        return str_replace(array_keys($variables), array_values($variables), $content);
    }

    public function sendTemplateEmailWithLanguage(string $templateName, array $variables, string $toEmail, string $toName = null, string $language = 'en')
    {
        // Prevent duplicate emails
        $emailKey = md5($templateName . $toEmail . serialize($variables));
        if (\Cache::has('email_sent_' . $emailKey)) {
            return false;
        }
        \Cache::put('email_sent_' . $emailKey, true, 60);
        
        try {
            \Log::info('=== EMAIL TEMPLATE SENDING ===', [
                'template_name' => $templateName,
                'requested_language' => $language,
                'to_email' => $toEmail
            ]);
            
            // Check if email notification is enabled for this template
            // First try to get store context from variables
            $storeId = null;
            $userId = null;
            
            // Try to extract store info from store_url variable
            if (isset($variables['{store_url}'])) {
                $storeUrl = $variables['{store_url}'];
                if (preg_match('/\/([^\/<>"]+)$/', $storeUrl, $matches)) {
                    $storeSlug = $matches[1];
                    $store = \App\Models\Store::where('slug', $storeSlug)->first();
                    if ($store) {
                        $storeId = $store->id;
                        $userId = $store->created_by;
                    }
                }
            }
            
            // Fallback to current user if available
            if (!$userId) {
                $user = auth()->user();
                if ($user && $user->type === 'company') {
                    $userId = $user->id;
                    $storeId = getCurrentStoreId($user);
                }
            }
            
            // Check notification setting if we have user context
            if ($userId && $storeId) {
                $notificationSetting = Setting::getSetting($templateName, $userId, $storeId, 'off');
                
                if ($notificationSetting !== 'on') {
                    \Log::info("Email notification disabled for template: {$templateName}", [
                        'user_id' => $userId,
                        'store_id' => $storeId,
                        'setting_value' => $notificationSetting
                    ]);
                    return false;
                }
            }
            
            // Get email template
            $template = EmailTemplate::where('name', $templateName)->first();
            
            if (!$template) {
                throw new Exception("Email template '{$templateName}' not found");
            }
            
            // Get template content for the specified language
            $templateLang = $template->emailTemplateLangs()
                ->where('lang', $language)
                ->first();
                
            \Log::info('Template language lookup', [
                'requested_lang' => $language,
                'found_template' => $templateLang ? true : false,
                'template_id' => $templateLang?->id ?? null
            ]);

            // Fallback to English if language not found
            if (!$templateLang) {
                $templateLang = $template->emailTemplateLangs()
                    ->where('lang', 'en')
                    ->first();
                    
                \Log::info('Fallback to English template', [
                    'found_english' => $templateLang ? true : false
                ]);
            }
            
            if (!$templateLang) {
                throw new Exception("No content found for template '{$templateName}'");
            }

            // Replace variables in subject and content
            $subject = $this->replaceVariables($templateLang->subject, $variables);
            $content = $this->replaceVariables($templateLang->content, $variables);
            $fromName = $this->replaceVariables($template->from, $variables);

            // Configure SMTP settings
            $this->configureBusinessSMTP();

            // Get final email settings
            $fromEmail = getSetting('email_from_address') ?: config('mail.from.address');
            $finalFromName = getSetting('email_from_name') ? $this->replaceVariables(getSetting('email_from_name'), $variables) : $fromName;

            \Log::info('Sending email', [
                'from_email' => $fromEmail,
                'from_name' => $finalFromName,
                'to_email' => $toEmail,
                'to_name' => $toName,
                'subject' => $subject
            ]);

            // Send email
            Mail::send([], [], function ($message) use ($subject, $content, $toEmail, $toName, $fromEmail, $finalFromName) {
                $message->to($toEmail, $toName)
                    ->subject($subject)
                    ->html($content)
                    ->from($fromEmail, $finalFromName);
            });
            
            \Log::info('Email sent successfully', [
                'template_name' => $templateName,
                'to_email' => $toEmail
            ]);
            
            return true;
        } catch (Exception $e) {
            \Log::error('Email sending failed: ' . $e->getMessage(), [
                'template_name' => $templateName,
                'to_email' => $toEmail,
                'language' => $language,
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    private function configureBusinessSMTP($business = null)
    {
        // Get email settings from settings table
        $emailDriver = getSetting('email_driver');
        $emailHost = getSetting('email_host');
        $emailUsername = getSetting('email_username');
        $emailPassword = getSetting('email_password');
        $emailPort = getSetting('email_port');
        $emailEncryption = getSetting('email_encryption');

        // If business email settings are configured, use them
        if ($emailHost && $emailUsername && $emailPassword) {
            \Log::info('Using business SMTP settings', [
                'driver' => $emailDriver ?: 'smtp',
                'host' => $emailHost,
                'port' => $emailPort ?: 587
            ]);
            
            Config::set([
                'mail.default' => $emailDriver ?: 'smtp',
                'mail.mailers.smtp.host' => $emailHost,
                'mail.mailers.smtp.port' => $emailPort ?: 587,
                'mail.mailers.smtp.username' => $emailUsername,
                'mail.mailers.smtp.password' => $emailPassword,
                'mail.mailers.smtp.encryption' => $emailEncryption ?: 'tls',
            ]);
        } else {
            // Fall back to default Laravel mail configuration
            \Log::info('Using default Laravel mail configuration', [
                'driver' => config('mail.default'),
                'host' => config('mail.mailers.smtp.host'),
                'from' => config('mail.from.address')
            ]);
            
            // No need to reconfigure if using defaults
        }
    }
}