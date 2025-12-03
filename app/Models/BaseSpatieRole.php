<?php

namespace App\Models;

use App\Traits\AutoApplyPermissionCheck;
use Spatie\Permission\Models\Role as SpatieRole;

class BaseSpatieRole extends SpatieRole
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