@extends('vendor.installer.layouts.master-update')

@section('title', trans('installer_messages.updater.welcome.title'))
@section('container')
    <div class="text-center">
        <div class="mb-8">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-sync text-3xl text-green-600"></i>
            </div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Welcome to the Update Wizard</h2>
            <p class="text-gray-600 max-w-md mx-auto leading-relaxed">
                {{ trans('installer_messages.updater.welcome.message') }}
            </p>
        </div>
        
        <a href="{{ route('LaravelUpdater::overview') }}" class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
            {{ trans('installer_messages.next') }}
            <i class="fas fa-arrow-right ml-2"></i>
        </a>
    </div>
@stop