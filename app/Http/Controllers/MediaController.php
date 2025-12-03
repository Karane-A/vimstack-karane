<?php

namespace App\Http\Controllers;

use App\Models\MediaItem;
use App\Models\User;
use App\Services\StorageConfigService;
use App\Services\DynamicStorageService;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
class MediaController extends Controller
{
    public function index()
    {
        try {
            $user = auth()->user();
            
            // Check if user has permission to view media
            if (!$user->hasPermissionTo('manage-media') && !$user->hasPermissionTo('view-media')) {
                return response()->json([
                    'message' => 'Access denied. You do not have permission to view media.',
                    'error' => 'insufficient_permissions'
                ], 403);
            }
            
            $mediaItems = MediaItem::with('media')->latest()->get();
            
            $media = $mediaItems->flatMap(function ($item) use ($user) {
                $mediaQuery = $item->getMedia('images');
                
                // SuperAdmin can see all media
                if ($user->type === 'superadmin') {
                    // No user_id filter for superadmin
                }
                // Users with manage-any-media can see all media
                elseif ($user->hasPermissionTo('manage-any-media')) {
                    // No user_id filter for manage-any-media
                }
                // Others can only see their own media or their company's media
                else {
                    if ($user->type === 'company') {
                        // Company users can see media from their users
                        $userIds = \App\Models\User::where('created_by', $user->id)
                            ->orWhere('id', $user->id)
                            ->pluck('id')
                            ->toArray();
                        $mediaQuery = $mediaQuery->whereIn('user_id', $userIds);
                    } else {
                        // Regular users can only see their own media
                        $mediaQuery = $mediaQuery->where('user_id', $user->id);
                    }
                }
                
                return $mediaQuery->map(function ($media) {
                    try {
                        $originalUrl = $this->getFullUrl($media->getUrl());
                        $thumbUrl = $originalUrl;
                        
                        try {
                            $thumbUrl = $this->getFullUrl($media->getUrl('thumb'));
                        } catch (\Exception $e) {
                            // If thumb conversion fails, use original
                        }
                        
                        return [
                            'id' => $media->id,
                            'name' => $media->name,
                            'file_name' => $media->file_name,
                            'url' => $originalUrl,
                            'thumb_url' => $thumbUrl,
                            'size' => $media->size,
                            'mime_type' => $media->mime_type,
                            'user_id' => $media->user_id,
                            'created_at' => $media->created_at,
                        ];
                    } catch (\Exception $e) {
                        // Skip media files with unavailable storage disks
                        return null;
                    }
                })->filter(); // Remove null entries
            });

            return response()->json($media);
        } catch (\Exception $e) {
            \Log::error('Media index error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load media library',
                'error' => 'server_error'
            ], 500);
        }
    }

    private function getFullUrl($url)
    {
        if (str_starts_with($url, 'http')) {
            return $url;
        }
        
        // Get the base URL from the APP_URL environment variable
        $baseUrl = rtrim(config('app.url'), '/');
        
        // Make sure the URL starts with a slash
        if (!str_starts_with($url, '/')) {
            $url = '/' . $url;
        }
        
        return $baseUrl . $url;
    }

    private function getUserFriendlyError(\Exception $e, $fileName): string
    {
        $message = $e->getMessage();
        $extension = strtoupper(pathinfo($fileName, PATHINFO_EXTENSION));
        
        // Handle media library collection errors
        if (str_contains($message, 'was not accepted into the collection')) {
            if (str_contains($message, 'mime:') || str_contains($message, 'extension')) {
                return "File type not allowed: {$extension}";
            }
            if (str_contains($message, 'size')) {
                return "File too large: {$extension}";
            }
            return "File format not supported: {$extension}";
        }
        
        // Handle validation errors
        if (str_contains($message, 'validation') || str_contains($message, 'mimes')) {
            return "Invalid file type: {$extension}";
        }
        
        // Handle storage errors
        if (str_contains($message, 'storage') || str_contains($message, 'disk') || str_contains($message, 'filesystem')) {
            return "Storage error: {$extension}";
        }
        
        // Handle file size errors
        if (str_contains($message, 'size') || str_contains($message, 'large') || str_contains($message, 'max')) {
            return "File too large: {$extension}";
        }
        
        // Handle permission errors
        if (str_contains($message, 'permission') || str_contains($message, 'denied') || str_contains($message, 'forbidden')) {
            return "Permission denied: {$extension}";
        }
        
        // Handle image processing errors
        if (str_contains($message, 'image') || str_contains($message, 'gd') || str_contains($message, 'imagick')) {
            return "Image processing failed: {$extension}";
        }
        
        // Handle conversion errors
        if (str_contains($message, 'conversion') || str_contains($message, 'thumb')) {
            return "Thumbnail generation failed: {$extension}";
        }
        
        // Generic fallback with more context
        return "Upload failed: {$extension}";
    }

    public function batchStore(Request $request)
    {
        $user = auth()->user();
        
        // Check if user has permission to create media
        if (!$user->hasPermissionTo('create-media') && !$user->hasPermissionTo('manage-media')) {
            return response()->json([
                'message' => 'Access denied. You do not have permission to upload media.',
                'errors' => ['insufficient_permissions']
            ], 403);
        }
        
        // Validate that files are present
        if (!$request->hasFile('files') || !is_array($request->file('files'))) {
            return response()->json([
                'message' => __('No files provided'),
                'errors' => [__('Please select files to upload')]
            ], 422);
        }
    
        // Check storage limits
        $storageCheck = $this->checkStorageLimit($request->file('files'));
        if ($storageCheck) {
            return $storageCheck;
        }
        
        // Get fresh configuration directly from database
        $userId = auth()->id();
        $settings = \DB::table('settings')
            ->where('user_id', $userId)
            ->whereIn('key', ['storage_file_types', 'storage_max_upload_size'])
            ->pluck('value', 'key')
            ->toArray();
        
        $config = [
            'allowed_file_types' => $settings['storage_file_types'] ?? 'jpg,png,webp,gif',
            'max_file_size_kb' => (int)($settings['storage_max_upload_size'] ?? 2048),
        ];
        
        // Get all allowed file types from config
        $allowedTypes = array_map('trim', explode(',', strtolower($config['allowed_file_types'])));
        
        // Custom validation with user-friendly messages
        $validator = \Validator::make($request->all(), [
            'files' => 'required|array|min:1',
            'files.*' => [
                'required',
                'file',
                'mimes:' . implode(',', $allowedTypes),
                'max:' . min($config['max_file_size_kb'], 10240) // Cap at 10MB for safety
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
        
        if ($validator->fails()) {
            return response()->json([
                'message' => __('File validation failed'),
                'errors' => $validator->errors()->all(),
                'allowed_types' => $config['allowed_file_types'],
                'max_size_kb' => $config['max_file_size_kb']
            ], 422);
        }
        
        try {

        $uploadedMedia = [];
        $errors = [];
        
        foreach ($request->file('files') as $file) {
            try {
                $mediaItem = MediaItem::create([
                    'name' => $file->getClientOriginalName(),
                ]);

                $media = $mediaItem->addMedia($file)
                    ->toMediaCollection('images');
                
                $media->user_id = auth()->id();
                $media->save();
                
                // Update user storage usage
                $this->updateStorageUsage(auth()->user(), $media->size);

                // Force thumbnail generationAdd commentMore actions
                try {
                    $media->getUrl('thumb');
                } catch (\Exception $e) {
                    // Thumbnail generation failed, but continue
                }

                $originalUrl = $this->getFullUrl($media->getUrl());
                $thumbUrl = $originalUrl; // Default to original
                
                try {
                    $thumbUrl = $this->getFullUrl($media->getUrl('thumb'));
                } catch (\Exception $e) {
                    // If thumb conversion fails, use original
                }
                
                $uploadedMedia[] = [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'url' => $originalUrl,
                    'thumb_url' => $thumbUrl,
                    'size' => $media->size,
                    'mime_type' => $media->mime_type,
                    'user_id' => $media->user_id,
                    'created_at' => $media->created_at,
                ];
            } catch (\Exception $e) {
                if (isset($mediaItem)) {
                    $mediaItem->delete();
                }
                $errors[] = [
                    'file' => $file->getClientOriginalName(),
                    'error' => $this->getUserFriendlyError($e, $file->getClientOriginalName())
                ];
            }
        }
        
        if (count($uploadedMedia) > 0 && empty($errors)) {
            return response()->json([
                'message' => count($uploadedMedia) . ' file(s) uploaded successfully',
                'data' => $uploadedMedia
            ]);
        } elseif (count($uploadedMedia) > 0 && !empty($errors)) {
            return response()->json([
                'message' => count($uploadedMedia) . ' uploaded, ' . count($errors) . ' failed',
                'data' => $uploadedMedia,
                'errors' => array_column($errors, 'error')
            ]);
        } else {
            return response()->json([
                'message' => 'Upload failed',
                'errors' => array_column($errors, 'error')
            ], 422);
        }
        } catch (\Exception $e) {
            \Log::error('Media batch upload error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Upload failed due to server error',
                'errors' => ['server_error']
            ], 500);
        }
    }

    public function download($id)
    {
        $user = auth()->user();
        
        // Check if user has permission to download media
        if (!$user->hasPermissionTo('download-media') && !$user->hasPermissionTo('manage-media') && !$user->hasPermissionTo('view-media')) {
            return response()->json([
                'message' => 'Access denied. You do not have permission to download media.',
                'error' => 'insufficient_permissions'
            ], 403);
        }
        
        $query = Media::where('id', $id);
        
        // SuperAdmin and users with manage-any-media can download any media
        if ($user->type !== 'superadmin' && !$user->hasPermissionTo('manage-any-media')) {
            if ($user->type === 'company') {
                // Company users can download media from their users
                $userIds = \App\Models\User::where('created_by', $user->id)
                    ->orWhere('id', $user->id)
                    ->pluck('id')
                    ->toArray();
                $query->whereIn('user_id', $userIds);
            } else {
                $query->where('user_id', $user->id);
            }
        }
        
        $media = $query->firstOrFail();
        
        try {
            $filePath = $media->getPath();
            
            if (!file_exists($filePath)) {
                abort(404, __('File not found'));
            }
            
            return response()->download($filePath, $media->file_name);
        } catch (\Exception $e) {
            abort(404, __('File storage unavailable'));
        }
    }

    public function destroy($id)
    {
        $user = auth()->user();
        
        // Check if user has permission to delete media
        if (!$user->hasPermissionTo('delete-media') && !$user->hasPermissionTo('manage-media')) {
            return response()->json([
                'message' => 'Access denied. You do not have permission to delete media.',
                'error' => 'insufficient_permissions'
            ], 403);
        }
        
        $query = Media::where('id', $id);
        
        // SuperAdmin and users with manage-any-media can delete any media
        if ($user->type !== 'superadmin' && !$user->hasPermissionTo('manage-any-media')) {
            if ($user->type === 'company') {
                // Company users can delete media from their users
                $userIds = \App\Models\User::where('created_by', $user->id)
                    ->orWhere('id', $user->id)
                    ->pluck('id')
                    ->toArray();
                $query->whereIn('user_id', $userIds);
            } else {
                $query->where('user_id', $user->id);
            }
        }
        
        $media = $query->firstOrFail();
        $mediaItem = $media->model;
        
        $fileSize = $media->size;
        
        try {
            $media->delete();
        } catch (\Exception $e) {
            // If storage disk is unavailable, force delete from database
            $media->forceDelete();
        }
        
        // Update user storage usage
        $this->updateStorageUsage(auth()->user(), -$fileSize);
        
        // Delete the MediaItem if it has no more media files
        if ($mediaItem && $mediaItem->getMedia()->count() === 0) {
            $mediaItem->delete();
        }

        return response()->json(['message' => __('Media deleted successfully')]);
    }
    
    private function checkStorageLimit($files)
    {
        $user = auth()->user();
        if ($user->type === 'superadmin') return null;
        
        $limit = $this->getUserStorageLimit($user);
        if (!$limit) return null;
        
        $uploadSize = collect($files)->sum('size');
        $currentUsage = $this->getUserStorageUsage($user);
        
        if (($currentUsage + $uploadSize) > $limit) {
            return response()->json([
                'message' => __('Storage limit exceeded'),
                'errors' => [__('Please delete files or upgrade plan')]
            ], 422);
        }
        
        return null;
    }
    
    private function getUserStorageLimit($user)
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
    
    private function getUserStorageUsage($user)
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
    
    private function updateStorageUsage($user, $size)
    {
        $user->increment('storage_limit', $size);
    }
}