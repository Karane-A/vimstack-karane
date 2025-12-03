<?php

namespace App\Models;

use App\Traits\AutoApplyPermissionCheck;
use Spatie\Permission\Models\Permission as SpatiePermission;

class BaseSpatiePermission extends SpatiePermission
{
    use AutoApplyPermissionCheck;
    
    /**
     * Scope a query to apply permission-based filtering
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithPermissionCheck($query)
    {
        $tableName = $this->getTable();
        return $this->applyPermissionScope($query, $tableName);
    }
}