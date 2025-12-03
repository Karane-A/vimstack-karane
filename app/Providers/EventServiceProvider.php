<?php

namespace App\Providers;

use App\Events\OrderCreated;
use App\Events\OrderStatusChanged;
use App\Events\StoreCreated;
use App\Events\UserCreated;
use App\Listeners\SendOrderCreatedEmail;
use App\Listeners\SendOrderCreatedWhatsApp;

use App\Listeners\SendOrderStatusChangedEmail;
use App\Listeners\SendStoreCreatedEmail;
use App\Listeners\SendUserCreatedEmail;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        UserCreated::class => [
            SendUserCreatedEmail::class,
        ],
        OrderCreated::class => [
            SendOrderCreatedEmail::class,
            SendOrderCreatedWhatsApp::class,
        ],
        OrderStatusChanged::class => [
            SendOrderStatusChangedEmail::class,
        ],
        StoreCreated::class => [
            SendStoreCreatedEmail::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}