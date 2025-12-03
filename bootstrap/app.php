<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ShareGlobalSettings;
use App\Http\Middleware\ShareStoresData;
use App\Http\Middleware\CheckInstallation;
use App\Http\Middleware\DemoModeMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance']);

        $middleware->web(append: [
            CheckInstallation::class,
            \App\Http\Middleware\DomainResolver::class,
            HandleAppearance::class,
            ShareGlobalSettings::class,
            ShareStoresData::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            DemoModeMiddleware::class,
        ]);
        
        $middleware->api(append: [
            \App\Http\Middleware\DomainResolver::class,
        ]);

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'landing.enabled' => \App\Http\Middleware\CheckLandingPageEnabled::class,
            'verified' => App\Http\Middleware\EnsureEmailIsVerified::class,
            'plan.access' => \App\Http\Middleware\CheckPlanAccess::class,
            'feature.access' => \App\Http\Middleware\CheckFeatureAccess::class,
            'permission.denied' => \App\Http\Middleware\PermissionDeniedHandler::class,
            'store.status' => \App\Http\Middleware\CheckStoreStatus::class,
            'domain.resolver' => \App\Http\Middleware\DomainResolver::class,
        ]);

        $middleware->validateCsrfTokens(
        except: [
            'install/*',
            'update/*',
            'cashfree/create-session', 
            'cashfree/webhook',
            'ozow/create-payment',
            'payments/easebuzz/success',
            'payments/aamarpay/success',
            'payments/aamarpay/callback',
            'payments/tap/success',
            'payments/tap/callback',
            'payments/benefit/success',
            'payments/benefit/callback',
            'payments/paytabs/callback'
            ],
        );

    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            // Check if this is a store route and the error message indicates store not found
            if ($request->is('store/*') && str_contains($e->getMessage(), 'Store not found')) {
                $storeSlug = $request->route('storeSlug');
                return \Inertia\Inertia::render('store/StoreNotFound', [
                    'requestedSlug' => $storeSlug
                ])->toResponse($request)->setStatusCode(404);
            }
        });
    })->create();
