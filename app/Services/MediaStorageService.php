<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MediaStorageService
{
    public function validateFiles(array $data, $user)
    {
        $config = $this->getStorageConfig($user);
        $allowedTypes = array_map('trim', explode(',', strtolower($config['allowed_file_types'])));
        
        return Validator::make($data, [
            'files' => 'required|array|min:1',
            'files.*' => [
                'required',
                'file',
                'mimes:' . implode(',', $allowedTypes),
                'max:' . min($config['max_file_size_kb'], 10240)
            ],
        ], [
            'files.required' => __('Please select files to upload.'),
            'files.array' => __('Invalid file format.'),
            'files.min' => __('Please select at least one file.'),
            'files.*.required' => __('Please select a valid file.'),
            'files.*.file' => __('Please select a valid file.'),
            'files.*.mimes' => __('Only these file types are allowed: :types', [
                'types' => strtoupper(implode(', ', $allowedTypes))
            ]),
            'files.*.max' => __('File size cannot exceed :max KB.', ['max' => min($config['max_file_size_kb'], 10240)]),
        ]);
    }

    public function checkStorageLimit($files, $user)
    {
        if ($user->type === 'superadmin') {
            return null;
        }
        
        $limit = $this->getStorageLimit($user);
        if (!$limit) {
            return null;
        }
        
        $uploadSize = collect($files)->sum('size');
        $currentUsage = $this->getStorageUsage($user);
        
        if (($currentUsage + $uploadSize) > $limit) {
            return response()->json([
                'message' => __('Storage limit exceeded'),
                'errors' => [__('Please delete files or upgrade plan')]
            ], 422);
        }
        
        return null;
    }

    public function updateStorageUsage($user, $size)
    {
        $user->increment('storage_limit', $size);
    }

    public function getStorageConfig($user)
    {
        $settings = DB::table('settings')
            ->where('user_id', $user->id)
            ->whereIn('key', ['storage_file_types', 'storage_max_upload_size'])
            ->pluck('value', 'key')
            ->toArray();
        
        return [
            'allowed_file_types' => $settings['storage_file_types'] ?? 'jpg,png,webp,gif',
            'max_file_size_kb' => (int)($settings['storage_max_upload_size'] ?? 2048),
        ];
    }

    protected function getStorageLimit($user)
    {
        if ($user->type === 'company' && $user->plan) {
            return $user->plan->storage_limit * 1024 * 1024 * 1024;
        }
        
        if ($user->created_by) {
            $company = User::find($user->created_by);
            if ($company && $company->plan) {
                return $company->plan->storage_limit * 1024 * 1024 * 1024;
            }
        }
        
        return null;
    }

    protected function getStorageUsage($user)
    {
        if ($user->type === 'company') {
            return User::where('created_by', $user->id)
                ->orWhere('id', $user->id)
                ->sum('storage_limit');
        }
        
        if ($user->created_by) {
            $company = User::find($user->created_by);
            if ($company) {
                return User::where('created_by', $company->id)
                    ->orWhere('id', $company->id)
                    ->sum('storage_limit');
            }
        }
        
        return $user->storage_limit;
    }
}
