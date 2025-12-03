<?php

namespace App\Traits;

use Spatie\Permission\Exceptions\PermissionDoesNotExist;
use Illuminate\Support\Facades\Schema;

trait AutoApplyPermissionCheck
{
    /**
     * Apply permission check to a model query
     *
     * @param string $modelClass The fully qualified model class name
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function queryWithPermission($modelClass)
    {
        return $modelClass::withPermissionCheck();
    }

    /**
     * Apply permission scope to the query based on user's permissions
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $module The module name (e.g., 'roles', 'permissions')
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function applyPermissionScope($query, $module)
    {
        // Skip permission check if no authenticated user (e.g., in console commands)
        if (!auth()->check()) {
            return $query;
        }

        $user = auth()->user();
        
        // Check if user is superadmin - they can see everything
        if ($user->hasRole(['superadmin'])) {
            return $query;
        }
        
        // For company users, show only their created records
        if ($user->hasRole(['company'])) {
            if (Schema::hasColumn($query->getModel()->getTable(), 'created_by')) {
                return $query->where('created_by', $user->id);
            }
        }
        
        // For regular users created by company, show only records created by their company
        if ($user->created_by && Schema::hasColumn($query->getModel()->getTable(), 'created_by')) {
            return $query->where('created_by', $user->created_by);
        }
        
        try {
            // If user has permission to list all items, return the query without filtering
            if ($user->hasPermissionTo("manage-any-{$module}")) {
                return $query;
            }
        } catch (PermissionDoesNotExist $e) {
            // Permission doesn't exist, check for access to module instead
            if ($user->hasPermissionTo("access-{$module}-module")) {
                // Default to showing only own records if they have module access
                if (Schema::hasColumn($query->getModel()->getTable(), 'created_by')) {
                    return $query->where('created_by', $user->id);
                }
                return $query;
            }
        }
        
        try {
            // If user has permission to list only their own items, filter by created_by
            if ($user->hasPermissionTo("manage-own-{$module}")) {
                if (Schema::hasColumn($query->getModel()->getTable(), 'created_by')) {
                    return $query->where('created_by', $user->id);
                }
                return $query;
            }
        } catch (PermissionDoesNotExist $e) {
            // Permission doesn't exist, check for view permission instead
            if ($user->hasPermissionTo("view-{$module}")) {
                // Default to showing only own records if they have view permission
                if (Schema::hasColumn($query->getModel()->getTable(), 'created_by')) {
                    return $query->where('created_by', $user->id);
                }
                return $query;
            }
        }
        
        // If user doesn't have any relevant permissions, return no results
        return $query;
    }
}