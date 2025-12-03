<?php

namespace App\Services;

use App\Models\User;
use Spatie\Permission\Models\Role;

class UserService
{
    /**
     * Assign default role to a user
     *
     * @param User $user
     * @return bool
     */
    public static function assignDefaultRole(User $user): bool
    {
        try {
            if (empty($user->type)) {
                $user->type = 'company';
                $user->save();
                return true;
            }
            
            return false;
        } catch (\Exception $e) {
            \Log::error('Failed to assign default role: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Assign company role and permissions to user
     *
     * @param User $user
     * @return bool
     */
    public static function assignCompanyPermissions(User $user): bool
    {
        try {
            // Get company role
            $companyRole = Role::where('name', 'company')->first();
            
            if ($companyRole) {
                $user->assignRole($companyRole);
                $user->type = 'company';
                $user->save();
                return true;
            }
            
            return false;
        } catch (\Exception $e) {
            \Log::error('Failed to assign company role: ' . $e->getMessage());
            return false;
        }
    }
}