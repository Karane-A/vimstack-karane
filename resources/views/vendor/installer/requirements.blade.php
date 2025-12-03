@extends('vendor.installer.layouts.master')

@section('template_title')
    {{ trans('installer_messages.requirements.templateTitle') }}
@endsection

@section('title')
    <i class="fas fa-list-check mr-2"></i>
    {{ trans('installer_messages.requirements.title') }}
@endsection

@section('container')
    <div class="space-y-6">
        @foreach($requirements['requirements'] as $type => $requirement)
            <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                        <i class="fas fa-{{ $type == 'php' ? 'code' : 'server' }} mr-2 text-green-600"></i>
                        {{ ucfirst($type) }} Requirements
                        @if($type == 'php')
                            <span class="ml-2 text-sm font-normal text-gray-600">
                                (version {{ $phpSupportInfo['minimum'] }} required)
                            </span>
                        @endif
                    </h3>
                    @if($type == 'php')
                        <div class="flex items-center">
                            <span class="text-lg font-semibold {{ $phpSupportInfo['supported'] ? 'text-green-600' : 'text-red-600' }} mr-2">
                                {{ $phpSupportInfo['current'] }}
                            </span>
                            <div class="w-8 h-8 rounded-full {{ $phpSupportInfo['supported'] ? 'bg-green-100' : 'bg-red-100' }} flex items-center justify-center">
                                <i class="fas fa-{{ $phpSupportInfo['supported'] ? 'check' : 'times' }} {{ $phpSupportInfo['supported'] ? 'text-green-600' : 'text-red-600' }}"></i>
                            </div>
                        </div>
                    @endif
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    @foreach($requirements['requirements'][$type] as $extension => $enabled)
                        <div class="flex items-center justify-between p-3 bg-white rounded border {{ $enabled ? 'border-green-200' : 'border-red-200' }}">
                            <span class="font-medium text-gray-700">{{ $extension }}</span>
                            <div class="w-6 h-6 rounded-full {{ $enabled ? 'bg-green-100' : 'bg-red-100' }} flex items-center justify-center">
                                <i class="fas fa-{{ $enabled ? 'check' : 'times' }} text-sm {{ $enabled ? 'text-green-600' : 'text-red-600' }}"></i>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach
    </div>

    @if ( ! isset($requirements['errors']) && $phpSupportInfo['supported'] )
        <div class="text-center mt-8">
            <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center justify-center">
                    <i class="fas fa-check-circle text-green-600 mr-2"></i>
                    <span class="text-green-800 font-medium">All requirements are satisfied!</span>
                </div>
            </div>
            <a href="{{ route('LaravelInstaller::permissions') }}" class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200">
                {{ trans('installer_messages.requirements.next') }}
                <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
    @else
        <div class="text-center mt-8">
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    <span class="text-red-800 font-medium">Please fix the requirements above before continuing.</span>
                </div>
            </div>
        </div>
    @endif
@endsection