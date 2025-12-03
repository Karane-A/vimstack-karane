<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@if (trim($__env->yieldContent('template_title')))@yield('template_title') | @endif {{ trans('installer_messages.title') }}</title>
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
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">@yield('title')</h1>
                <p class="text-gray-600">{{ trans('installer_messages.title') }}</p>
            </div>

            <!-- Progress Steps -->
            <div class="mb-8">
                <div class="flex items-center justify-center space-x-4">
                    <div class="flex items-center {{ isActive('LaravelInstaller::welcome') ? 'text-green-600' : (isActive('LaravelInstaller::requirements') || isActive('LaravelInstaller::permissions') || isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'text-green-600' : 'text-gray-400') }}">
                        <div class="w-8 h-8 rounded-full border-2 {{ isActive('LaravelInstaller::welcome') ? 'border-green-600 bg-green-600 text-white' : (isActive('LaravelInstaller::requirements') || isActive('LaravelInstaller::permissions') || isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300') }} flex items-center justify-center">
                            <i class="fas fa-home text-sm"></i>
                        </div>
                        <span class="ml-2 text-sm font-medium hidden sm:block">Welcome</span>
                    </div>
                    <div class="w-8 h-0.5 {{ isActive('LaravelInstaller::requirements') || isActive('LaravelInstaller::permissions') || isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'bg-green-600' : 'bg-gray-300' }}"></div>
                    
                    <div class="flex items-center {{ isActive('LaravelInstaller::requirements') ? 'text-green-600' : (isActive('LaravelInstaller::permissions') || isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'text-green-600' : 'text-gray-400') }}">
                        <div class="w-8 h-8 rounded-full border-2 {{ isActive('LaravelInstaller::requirements') ? 'border-green-600 bg-green-600 text-white' : (isActive('LaravelInstaller::permissions') || isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300') }} flex items-center justify-center">
                            <i class="fas fa-list text-sm"></i>
                        </div>
                        <span class="ml-2 text-sm font-medium hidden sm:block">Requirements</span>
                    </div>
                    <div class="w-8 h-0.5 {{ isActive('LaravelInstaller::permissions') || isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'bg-green-600' : 'bg-gray-300' }}"></div>
                    
                    <div class="flex items-center {{ isActive('LaravelInstaller::permissions') ? 'text-green-600' : (isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'text-green-600' : 'text-gray-400') }}">
                        <div class="w-8 h-8 rounded-full border-2 {{ isActive('LaravelInstaller::permissions') ? 'border-green-600 bg-green-600 text-white' : (isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300') }} flex items-center justify-center">
                            <i class="fas fa-key text-sm"></i>
                        </div>
                        <span class="ml-2 text-sm font-medium hidden sm:block">Permissions</span>
                    </div>
                    <div class="w-8 h-0.5 {{ isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') || isActive('LaravelInstaller::final') ? 'bg-green-600' : 'bg-gray-300' }}"></div>
                    
                    <div class="flex items-center {{ isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') ? 'text-green-600' : (isActive('LaravelInstaller::final') ? 'text-green-600' : 'text-gray-400') }}">
                        <div class="w-8 h-8 rounded-full border-2 {{ isActive('LaravelInstaller::environment') || isActive('LaravelInstaller::environmentWizard') || isActive('LaravelInstaller::environmentClassic') ? 'border-green-600 bg-green-600 text-white' : (isActive('LaravelInstaller::final') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300') }} flex items-center justify-center">
                            <i class="fas fa-cog text-sm"></i>
                        </div>
                        <span class="ml-2 text-sm font-medium hidden sm:block">Configuration</span>
                    </div>
                    <div class="w-8 h-0.5 {{ isActive('LaravelInstaller::final') ? 'bg-green-600' : 'bg-gray-300' }}"></div>
                    
                    <div class="flex items-center {{ isActive('LaravelInstaller::final') ? 'text-green-600' : 'text-gray-400' }}">
                        <div class="w-8 h-8 rounded-full border-2 {{ isActive('LaravelInstaller::final') ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300' }} flex items-center justify-center">
                            <i class="fas fa-check text-sm"></i>
                        </div>
                        <span class="ml-2 text-sm font-medium hidden sm:block">Complete</span>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="bg-white rounded-lg shadow-lg p-8">
                @if (session('message'))
                    <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-info-circle text-green-600 mr-3"></i>
                            <p class="text-green-800 font-medium">
                                @if(is_array(session('message')))
                                    {{ session('message')['message'] }}
                                @else
                                    {{ session('message') }}
                                @endif
                            </p>
                        </div>
                    </div>
                @endif
                
                @if(session()->has('errors'))
                    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" id="error_alert">
                        <div class="flex items-start">
                            <i class="fas fa-exclamation-triangle text-red-600 mr-3 mt-0.5"></i>
                            <div class="flex-1">
                                <h4 class="text-red-800 font-medium mb-2">{{ trans('installer_messages.forms.errorTitle') }}</h4>
                                <ul class="text-red-700 space-y-1">
                                    @foreach($errors->all() as $error)
                                        <li>• {{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                            <button type="button" class="text-red-400 hover:text-red-600" id="close_alert">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                @endif
                
                @yield('container')
            </div>
        </div>
    </div>
    
    @yield('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const closeAlert = document.getElementById('close_alert');
            const errorAlert = document.getElementById('error_alert');
            if (closeAlert && errorAlert) {
                closeAlert.onclick = function() {
                    errorAlert.style.display = 'none';
                };
            }
        });
    </script>
</body>
</html>
