@extends('vendor.installer.layouts.master')

@section('template_title')
    {{ trans('installer_messages.welcome.templateTitle') }}
@endsection

@section('title')
    {{ trans('installer_messages.welcome.title') }}
@endsection

@section('container')
    <div class="text-center">
        <div class="mb-8">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-rocket text-3xl text-green-600"></i>
            </div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Welcome to the Installation Wizard</h2>
            <p class="text-gray-600 max-w-md mx-auto leading-relaxed">
                {{ trans('installer_messages.welcome.message') }}
            </p>
        </div>
        
        <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-medium text-gray-900 mb-2">What we'll set up:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        System Requirements
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        File Permissions
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        Database Configuration
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-2"></i>
                        Application Setup
                    </div>
                </div>
            </div>
            
            <a href="{{ route('LaravelInstaller::requirements') }}" class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
                {{ trans('installer_messages.welcome.next') }}
                <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
    </div>
@endsection
