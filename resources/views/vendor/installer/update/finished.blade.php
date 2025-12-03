@extends('vendor.installer.layouts.master-update')

@section('title', trans('installer_messages.updater.final.title'))
@section('container')
    <div class="text-center">
        <div class="mb-8">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-check text-3xl text-green-600"></i>
            </div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">Update Completed Successfully!</h2>
            <p class="text-gray-600">{{ session('message')['message'] }}</p>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div class="flex items-center justify-center">
                <i class="fas fa-check-circle text-green-600 mr-2"></i>
                <span class="text-green-800 font-medium">Your application has been updated successfully!</span>
            </div>
        </div>
        
        <a href="{{ url('/') }}" class="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
            <i class="fas fa-home mr-2"></i>
            {{ trans('installer_messages.updater.final.exit') }}
        </a>
    </div>
@stop