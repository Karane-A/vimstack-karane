@extends('vendor.installer.layouts.master')

@section('template_title')
    {{ trans('installer_messages.permissions.templateTitle') }}
@endsection

@section('title')
    <i class="fas fa-shield-alt mr-2"></i>
    {{ trans('installer_messages.permissions.title') }}
@endsection

@section('container')
    <div class="mb-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center">
                <i class="fas fa-info-circle text-green-600 mr-3"></i>
                <p class="text-green-800">Checking folder permissions required for the application to function properly.</p>
            </div>
        </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-folder-open mr-2 text-green-600"></i>
            Directory Permissions
        </h3>
        
        <div class="space-y-3">
            @foreach($permissions['permissions'] as $permission)
                <div class="flex items-center justify-between p-4 bg-white rounded-lg border {{ $permission['isSet'] ? 'border-green-200' : 'border-red-200' }}">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full {{ $permission['isSet'] ? 'bg-green-100' : 'bg-red-100' }} flex items-center justify-center mr-3">
                            <i class="fas fa-{{ $permission['isSet'] ? 'check' : 'times' }} {{ $permission['isSet'] ? 'text-green-600' : 'text-red-600' }}"></i>
                        </div>
                        <div>
                            <span class="font-medium text-gray-900">{{ $permission['folder'] }}</span>
                            <div class="text-sm text-gray-500">Required for file operations</div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <span class="px-3 py-1 text-sm font-medium rounded-full {{ $permission['isSet'] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                            {{ $permission['permission'] }}
                        </span>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    @if ( ! isset($permissions['errors']))
        <div class="text-center mt-8">
            <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center justify-center">
                    <i class="fas fa-check-circle text-green-600 mr-2"></i>
                    <span class="text-green-800 font-medium">All permissions are correctly set!</span>
                </div>
            </div>
            <a href="{{ route('LaravelInstaller::environment') }}" class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
                {{ trans('installer_messages.permissions.next') }}
                <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
    @else
        <div class="text-center mt-8">
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center justify-center mb-2">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    <span class="text-red-800 font-medium">Permission issues detected</span>
                </div>
                <p class="text-red-700 text-sm">Please fix the folder permissions above before continuing.</p>
            </div>
        </div>
    @endif
@endsection
