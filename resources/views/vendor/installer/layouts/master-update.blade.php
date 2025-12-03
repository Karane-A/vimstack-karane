<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@if (trim($__env->yieldContent('template_title')))@yield('template_title') | @endif {{ trans('installer_messages.updater.title') }}</title>
    <link rel="icon" type="image/png" href="{{ asset('installer/img/favicon/favicon-16x16.png') }}" sizes="16x16"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    @yield('style')
    <script>
        window.Laravel = <?php echo json_encode(['csrfToken' => csrf_token()]); ?>
    </script>
</head>
<body class="bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl w-full">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">@yield('title')</h1>
                <p class="text-gray-600">{{ trans('installer_messages.updater.title') }}</p>
            </div>
            <div class="mb-8">
                <div class="flex items-center justify-center space-x-4">
                    <div class="flex items-center {{ isActive('LaravelUpdater::welcome') ? 'text-green-600' : (isActive('LaravelUpdater::overview') || isActive('LaravelUpdater::final') ? 'text-green-600' : 'text-gray-400') }}">
                        <div class="w-8 h-8 rounded-full border-2 {{ isActive('LaravelUpdater::welcome') ? 'border-green-600 bg-green-600 text-white' : (isActive('LaravelUpdater::overview') || isActive('LaravelUpdater::final') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300') }} flex items-center justify-center">
                            <i class="fas fa-sync text-sm"></i>
                        </div>
                        <span class="ml-2 text-sm font-medium hidden sm:block">Welcome</span>
                    </div>
                    <div class="w-8 h-0.5 {{ isActive('LaravelUpdater::overview') || isActive('LaravelUpdater::final') ? 'bg-green-600' : 'bg-gray-300' }}"></div>
                    <div class="flex items-center {{ isActive('LaravelUpdater::overview') ? 'text-green-600' : (isActive('LaravelUpdater::final') ? 'text-green-600' : 'text-gray-400') }}">
                        <div class="w-8 h-8 rounded-full border-2 {{ isActive('LaravelUpdater::overview') ? 'border-green-600 bg-green-600 text-white' : (isActive('LaravelUpdater::final') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300') }} flex items-center justify-center">
                            <i class="fas fa-list text-sm"></i>
                        </div>
                        <span class="ml-2 text-sm font-medium hidden sm:block">Overview</span>
                    </div>
                    <div class="w-8 h-0.5 {{ isActive('LaravelUpdater::final') ? 'bg-green-600' : 'bg-gray-300' }}"></div>
                    <div class="flex items-center {{ isActive('LaravelUpdater::final') ? 'text-green-600' : 'text-gray-400' }}">
                        <div class="w-8 h-8 rounded-full border-2 {{ isActive('LaravelUpdater::final') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300' }} flex items-center justify-center">
                            <i class="fas fa-database text-sm"></i>
                        </div>
                        <span class="ml-2 text-sm font-medium hidden sm:block">Update</span>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-lg p-8">
                @yield('container')
            </div>
        </div>
    </div>
    @yield('scripts')
</body>
</html>