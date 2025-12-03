<?php

namespace App\Listeners;

use App\Events\StoreCreated;
use App\Services\EmailTemplateService;
use Illuminate\Support\Facades\Cache;

class SendStoreCreatedEmail
{
    protected $emailTemplateService;

    public function __construct(EmailTemplateService $emailTemplateService)
    {
        $this->emailTemplateService = $emailTemplateService;
    }

    public function handle(StoreCreated $event)
    {
        $store = $event->store;
        $owner = $store->user;

        // Prevent duplicate emails
        $emailKey = md5('store_created_' . $store->id . '_' . $owner->email);
        if (Cache::has('email_sent_' . $emailKey)) {
            return;
        }
        Cache::put('email_sent_' . $emailKey, true, 60);

        // Get password from event if available, otherwise use default message
        $password = $event->password ?? 'Please use your account password to login';

        // Prepare email variables
        $variables = [
            '{owner_name}' => $owner->name,
            '{owner_email}' => $owner->email,
            '{owner_password}' => $password,
            '{store_name}' => $store->name,
            '{store_url}' => route('store.home', ['storeSlug' => $store->slug]),
            '{app_name}' => config('app.name', 'StoreGo'),
            '{app_url}' => config('app.url')
        ];

        // Get owner's language preference
        $language = $owner->lang ?? 'en';

        // Send email to store owner
        $this->emailTemplateService->sendTemplateEmailWithLanguage(
            'Owner And Store Created',
            $variables,
            $owner->email,
            $owner->name,
            $language
        );
    }
}