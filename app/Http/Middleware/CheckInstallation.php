<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class CheckInstallation
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Check and create storage symlink for install page
        if ($request->is('install/*')) {
            $this->ensureStorageLink();
            // return $next($request);
        }

        // Skip check for installer routes, API routes, and static assets
        if ($request->is('install/*') ||
            $request->is('update/*') ||
            $request->is('css/*') ||
            $request->is('js/*') ||
            $request->is('images/*') ||
            $request->is('installer/*')) {
                return $next($request);
        }
        
        // Check only on dashboard, login, register routes
        if (!$request->is('/*') && !$request->is('dashboard*') && !$request->is('login') && !$request->is('register')) {
            return $next($request);
        }

        // If not installed, redirect to /install
        if (!$this->isInstalled()) {
            return redirect('/install');
        }

        // If logged in as superadmin and migrations needed, redirect to /update
        if (auth()->check() && auth()->user()->hasRole('superadmin') && $this->needsMigration()) {
            return redirect('/update');
        }

        return $next($request);
    }

    /**
     * Check if application is installed
     */
    private function isInstalled(): bool
    {
        return file_exists(storage_path('installed'));
    }

    /**
     * Check if migrations are needed
     */
    private function needsMigration(): bool
    {
        try {
            Artisan::call('migrate:status');
            $output = Artisan::output();
            return strpos($output, 'Pending') !== false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Ensure storage symlink exists, if not then create it
     */
    private function ensureStorageLink(): void
    {
        $publicStorage = public_path('storage');

        if (!File::exists($publicStorage)) {
            try {
                Artisan::call('storage:link');
            } catch (\Exception $e) {
                // \Log::error('Failed to create storage link: ' . $e->getMessage());
            }
        }
    }
}