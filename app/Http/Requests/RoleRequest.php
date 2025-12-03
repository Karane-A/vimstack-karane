<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Permission;
use Illuminate\Support\Facades\Auth;

class RoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', function ($attribute, $value, $fail) {
                $this->validateSystemRole($value, $fail);
            }],
            'description' => 'nullable|string',
            'permissions' => 'required|array',
            'permissions.*' => ['string', 'exists:permissions,name', function ($attribute, $value, $fail) {
                $this->validatePermissionAccess($value, $fail);
            }]
        ];
    }

    /**
     * Validate that user can assign this permission
     */
    private function validatePermissionAccess($permissionName, $fail)
    {
        $user = Auth::user();
        $userType = $user->type ?? 'company';
        
        // Superadmin can assign any permission
        if ($userType === 'superadmin' || $userType === 'super admin') {
            return;
        }
        
        // Get allowed modules for current user role
        $allowedModules = config('role-permissions.' . $userType, config('role-permissions.company'));
        
        // Check if permission belongs to allowed module
        $permission = Permission::where('name', $permissionName)->first();
        
        if ($permission && !in_array($permission->module, $allowedModules)) {
            $fail('You are not authorized to assign this permission.');
        }
    }

    /**
     * Validate that system roles cannot be created/modified
     */
    private function validateSystemRole($label, $fail)
    {
        $user = Auth::user();
        $userType = $user->type ?? 'company';
        
        // Superadmin can create/edit any role
        if ($userType === 'superadmin' || $userType === 'super admin') {
            return;
        }
        
        $systemRoles = ['superadmin', 'super admin', 'company'];
        $slug = \Illuminate\Support\Str::slug($label);
        
        if (in_array(strtolower($label), array_map('strtolower', $systemRoles)) || 
            in_array($slug, $systemRoles)) {
            $fail('This role name is reserved for system use. Please choose a different name.');
        }
    }
}
