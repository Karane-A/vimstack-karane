<?php

namespace App\Http\Controllers;

use App\Models\MediaItem;
use App\Models\User;
use App\Services\MediaStorageService;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    protected $storageService;

    public function __construct(MediaStorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    public function index()
    {
        try {
            $user = auth()->user();
            
            if (!$this->canViewMedia($user)) {
                return $this->permissionDenied('view media');
            }
            
            // Get media directly from Media model, not through MediaItem
            $media = $this->getUserMedia($user)
                ->latest()
                ->get()
                ->map(fn($media) => $this->formatMediaItem($media))
                ->filter() // Remove null entries
                ->values(); // Re-index array

            return response()->json($media)
                ->header('Cache-Control', 'private, max-age=300') // Cache for 5 minutes
                ->header('X-Content-Type-Options', 'nosniff');
        } catch (\Exception $e) {
            \Log::error('Media index error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load media library',
                'error' => 'server_error'
            ], 500);
        }
    }

    public function batchStore(Request $request)
    {
        $user = auth()->user();
        
        if (!$this->canCreateMedia($user)) {
            return $this->permissionDenied('upload media');
        }
        
        if (!$request->hasFile('files') || !is_array($request->file('files'))) {
            return response()->json([
                'message' => __('No files provided'),
                'errors' => [__('Please select files to upload')]
            ], 422);
        }
    
        // Check storage limits
        if ($error = $this->storageService->checkStorageLimit($request->file('files'), $user)) {
            return $error;
        }
        
        // Validate files
        $validator = $this->storageService->validateFiles($request->all(), $user);
        if ($validator->fails()) {
            return response()->json([
                'message' => __('File validation failed'),
                'errors' => $validator->errors()->all(),
                'allowed_types' => $this->storageService->getStorageConfig($user)['allowed_file_types'],
                'max_size_kb' => $this->storageService->getStorageConfig($user)['max_file_size_kb']
            ], 422);
        }

        $uploadedMedia = [];
        $errors = [];
        
        foreach ($request->file('files') as $file) {
            try {
                $media = $this->uploadFile($file, $user);
                $uploadedMedia[] = $this->formatMediaItem($media);
            } catch (\Exception $e) {
                if (isset($mediaItem)) {
                    $mediaItem->delete();
                }
                $errors[] = $this->getUserFriendlyError($e, $file->getClientOriginalName());
            }
        }
        
        return $this->buildUploadResponse($uploadedMedia, $errors);
    }

    public function download($id)
    {
        $user = auth()->user();
        
        if (!$this->canDownloadMedia($user)) {
            return $this->permissionDenied('download media');
        }
        
        $media = $this->getUserMedia($user)->where('id', $id)->firstOrFail();
        
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
        
        if (!$this->canDeleteMedia($user)) {
            return $this->permissionDenied('delete media');
        }
        
        $media = $this->getUserMedia($user)->where('id', $id)->firstOrFail();
        $fileSize = $media->size;
        $mediaItem = $media->model;
        
        try {
            $media->delete();
        } catch (\Exception $e) {
            $media->forceDelete();
        }
        
        $this->storageService->updateStorageUsage($user, -$fileSize);
        
        // Delete MediaItem if no more files
        if ($mediaItem && $mediaItem->getMedia()->count() === 0) {
            $mediaItem->delete();
        }

        return response()->json(['message' => __('Media deleted successfully')]);
    }
    
    // ========== Permission Helpers ==========

    protected function canViewMedia($user): bool
    {
        return $user->hasPermissionTo('manage-media') || $user->hasPermissionTo('view-media');
    }

    protected function canCreateMedia($user): bool
    {
        return $user->hasPermissionTo('create-media') || $user->hasPermissionTo('manage-media');
    }

    protected function canDownloadMedia($user): bool
    {
        return $user->hasPermissionTo('download-media') 
            || $user->hasPermissionTo('manage-media') 
            || $user->hasPermissionTo('view-media');
    }

    protected function canDeleteMedia($user): bool
    {
        return $user->hasPermissionTo('delete-media') || $user->hasPermissionTo('manage-media');
    }

    // ========== Query Helpers ==========

    protected function getUserMedia($user)
    {
        // Query media from the 'images' collection
        $query = Media::where('collection_name', 'images');
        
        // SuperAdmin and manage-any-media can see all
        if ($user->type === 'superadmin' || $user->hasPermissionTo('manage-any-media')) {
            return $query;
        }
        
        // Company users see their own + their users' media
        if ($user->type === 'company') {
            $userIds = User::where('created_by', $user->id)
                ->orWhere('id', $user->id)
                ->pluck('id');
            return $query->whereIn('user_id', $userIds);
        }
        
        // Regular users see only their own
        return $query->where('user_id', $user->id);
    }

    // ========== Upload Helpers ==========

    protected function uploadFile($file, $user)
    {
        $mediaItem = MediaItem::create([
            'name' => $file->getClientOriginalName(),
        ]);

        $media = $mediaItem->addMedia($file)
            ->toMediaCollection('images');
        
        $media->user_id = $user->id;
        $media->save();
        
        $this->storageService->updateStorageUsage($user, $media->size);
        
        // Generate thumbnail (non-blocking)
        try {
            $media->getUrl('thumb');
        } catch (\Exception $e) {
            // Thumbnail generation failed, continue anyway
        }
        
        return $media;
    }

    // ========== Formatting Helpers ==========

    protected function formatMediaItem($media)
    {
        try {
            // Get URLs from Spatie Media Library
            // These might be full URLs or relative paths depending on configuration
            $originalUrl = $media->getUrl();
            $thumbUrl = $this->getThumbnailUrl($media);
            
            // Normalize both URLs to relative paths starting with /storage/
            $url = $this->normalizePath($originalUrl);
            $thumbUrl = $this->normalizePath($thumbUrl);
            
            // Log for debugging (remove in production)
            \Log::debug('Media URL formatting', [
                'id' => $media->id,
                'original' => $originalUrl,
                'normalized' => $url,
                'thumb_original' => $thumbUrl !== $originalUrl ? $thumbUrl : 'same',
                'thumb_normalized' => $thumbUrl
            ]);
            
            return [
                'id' => $media->id,
                'name' => $media->name,
                'file_name' => $media->file_name,
                'url' => $url,
                'thumb_url' => $thumbUrl,
                'size' => $media->size,
                'mime_type' => $media->mime_type,
                'user_id' => $media->user_id,
                'created_at' => $media->created_at,
            ];
        } catch (\Exception $e) {
            \Log::error('Media URL error: ' . $e->getMessage(), [
                'media_id' => $media->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);
        return null;
        }
    }

    protected function getThumbnailUrl($media)
    {
        try {
            return $media->getUrl('thumb');
        } catch (\Exception $e) {
            return $media->getUrl(); // Fallback to original
        }
    }

    protected function normalizePath($url)
    {
        if (empty($url)) {
            return '';
        }
        
        // If already a relative path starting with /storage/, clean and return
        if (str_starts_with($url, '/storage/')) {
            // Remove any double slashes
            return preg_replace('#/+#', '/', $url);
        }
        
        // If it's a full URL, extract the path
        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            $parsed = parse_url($url);
            $path = $parsed['path'] ?? '';
            
            // Remove double slashes
            $path = preg_replace('#/+#', '/', $path);
            
            // If path already starts with /storage/, return it
            if (str_starts_with($path, '/storage/')) {
                return $path;
            }
            
            // Handle Spatie's /media/ paths - convert to /storage/media/
            if (str_starts_with($path, '/media/')) {
                return '/storage' . $path;
            }
            
            // Try to extract storage path from full URL
            // Spatie might return: http://localhost/storage/media/12/file.jpg
            if (str_contains($url, '/storage/')) {
                $pos = strpos($url, '/storage/');
                $path = substr($url, $pos);
                return preg_replace('#/+#', '/', $path);
            }
            
            // If path contains 'media' but not '/storage/', try to construct it
            if (str_contains($path, 'media') && !str_contains($path, '/storage/')) {
                // Find 'media' in path and prepend '/storage'
                $mediaPos = strpos($path, '/media/');
                if ($mediaPos !== false) {
                    return '/storage' . substr($path, $mediaPos);
                }
            }
            
            // Default: try to construct /storage path
            return $path ?: '/storage' . $path;
        }
        
        // Handle relative paths starting with /media/
        if (str_starts_with($url, '/media/')) {
            return '/storage' . preg_replace('#/+#', '/', $url);
        }
        
        // Remove any double slashes
        $url = preg_replace('#/+#', '/', $url);
        
        // Ensure it starts with / (but not //)
        if (!str_starts_with($url, '/')) {
            $url = '/' . $url;
        }
        
        // If it doesn't start with /storage/ but contains 'media', try to fix it
        if (!str_starts_with($url, '/storage/') && str_contains($url, 'media')) {
            $mediaPos = strpos($url, 'media');
            if ($mediaPos > 0) {
                // Extract everything from 'media' onwards
                $url = '/storage/' . substr($url, $mediaPos);
            } else {
                $url = '/storage' . $url;
            }
        }
        
        return $url;
    }

    // ========== Response Helpers ==========

    protected function buildUploadResponse($uploadedMedia, $errors)
    {
        if (count($uploadedMedia) > 0 && empty($errors)) {
            return response()->json([
                'message' => count($uploadedMedia) . ' file(s) uploaded successfully',
                'data' => $uploadedMedia
            ]);
        }
        
        if (count($uploadedMedia) > 0 && !empty($errors)) {
            return response()->json([
                'message' => count($uploadedMedia) . ' uploaded, ' . count($errors) . ' failed',
                'data' => $uploadedMedia,
                'errors' => $errors
            ]);
        }
        
        return response()->json([
            'message' => 'Upload failed',
            'errors' => $errors
        ], 422);
    }

    protected function permissionDenied($action)
    {
        return response()->json([
            'message' => "Access denied. You do not have permission to {$action}.",
            'error' => 'insufficient_permissions'
        ], 403);
    }

    protected function getUserFriendlyError(\Exception $e, $fileName): string
    {
        $extension = strtoupper(pathinfo($fileName, PATHINFO_EXTENSION));
        $message = $e->getMessage();
        
        $errorMap = [
            'mime' => "Invalid file type: {$extension}",
            'size' => "File too large: {$extension}",
            'storage' => "Storage error: {$extension}",
            'permission' => "Permission denied: {$extension}",
            'image' => "Image processing failed: {$extension}",
            'conversion' => "Thumbnail generation failed: {$extension}",
        ];
        
        foreach ($errorMap as $key => $error) {
            if (stripos($message, $key) !== false) {
                return $error;
            }
        }
        
        return "Upload failed: {$extension}";
    }
}
