<?php
namespace App\Http\Controllers;

use App\Models\Role;
use Inertia\Inertia;
use App\Models\Permission;
use Illuminate\Support\Str;
use App\Http\Requests\RoleRequest;
use Illuminate\Support\Facades\Auth;

class RoleController extends BaseController
{


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::withPermissionCheck()->with(['permissions', 'creator'])->latest()->paginate(10);

        $permissions = $this->getFilteredPermissions();

        return Inertia::render('roles/index', [
            'roles'       => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Get permissions filtered by user role
     */
    private function getFilteredPermissions()
    {
        $user = Auth::user();
        $userType = $user->type ?? 'company';
        
        // Superadmin can see all permissions
        if ($userType === 'superadmin' || $userType === 'super admin') {
            return Permission::all()->groupBy('module');
        }
        
        // For regular users (created by company), get company's plan and allowed modules
        if ($userType === 'user') {
            $company = $user->creator;
            if (!$company) {
                return collect();
            }
            
            // Use company's plan for filtering
            $allowedModules = config('role-permissions.company', []);
            $query = Permission::whereIn('module', $allowedModules);
            
            // Apply same filtering as company but more restrictive
            $excludedPermissions = [
                // Admin-only permissions
                'reset-password-users',
                'toggle-status-users',
                'manage-any-users',
                'manage-any-roles',
                'manage-plans',
                'manage-any-plans',
                'create-plans',
                'edit-plans',
                'delete-plans',
                'approve-plan-requests',
                'reject-plan-requests',
                'edit-plan-requests',
                'delete-plan-requests',
                'approve-plan-orders',
                'reject-plan-orders',
                'edit-plan-orders',
                'delete-plan-orders',
                'create-plan-orders',
                'manage-any-media',
                'manage-language',
                'edit-language',
                'view-language',
                // Additional restrictions for regular users
                'create-roles',
                'edit-roles',
                'delete-roles',
                'create-users',
                'edit-users',
                'delete-users',
            ];
            
            // Exclude modules based on company's plan
            $excludedModules = [];
            if ($company->plan) {
                if (($company->plan->enable_blog ?? 'off') === 'off') {
                    $excludedModules[] = 'blog';
                }
                if (($company->plan->enable_custom_pages ?? 'off') === 'off') {
                    $excludedModules[] = 'custom_pages';
                }
                if (($company->plan->enable_shipping_method ?? 'off') === 'off') {
                    $excludedModules[] = 'shipping';
                }
            }
            
            $query->whereNotIn('name', $excludedPermissions)
                  ->whereNotIn('module', $excludedModules);
            
            // Only basic settings for regular users
            $query->where(function($q) {
                $q->where('module', '!=', 'settings')
                  ->orWhereIn('name', [
                      'manage-brand-settings'
                  ]);
            });
            
            return $query->get()->groupBy('module');
        }
        
        // Get allowed modules for company users
        $allowedModules = config('role-permissions.company', []);
        
        // Filter permissions by allowed modules
        $query = Permission::whereIn('module', $allowedModules);
        
        // For company users, filter out admin-only permissions and disabled plan features
        if ($userType === 'company') {
            // Exclude admin-only permissions that regular users shouldn't have
            $excludedPermissions = [
                // User management admin permissions
                'reset-password-users',
                'toggle-status-users',
                'manage-any-users',
                
                // Role management admin permissions
                'manage-any-roles',
                
                // Plan management admin permissions (only for superadmin)
                'manage-plans',
                'manage-any-plans',
                'create-plans',
                'edit-plans',
                'delete-plans',
                
                // Plan request admin permissions (only for superadmin/company)
                'approve-plan-requests',
                'reject-plan-requests',
                'edit-plan-requests',
                'delete-plan-requests',
                
                // Plan order admin permissions (only for superadmin/company)
                'approve-plan-orders',
                'reject-plan-orders',
                'edit-plan-orders',
                'delete-plan-orders',
                'create-plan-orders',
                
                // Media admin permissions
                'manage-any-media',
                
                // Language management (company-level only)
                'manage-language',
                'edit-language',
                'view-language',
            ];
            
            // Exclude modules based on plan features
            $excludedModules = [];
            if ($user->plan) {
                if (($user->plan->enable_blog ?? 'off') === 'off') {
                    $excludedModules[] = 'blog';
                }
                if (($user->plan->enable_custom_pages ?? 'off') === 'off') {
                    $excludedModules[] = 'custom_pages';
                }
                if (($user->plan->enable_shipping_method ?? 'off') === 'off') {
                    $excludedModules[] = 'shipping';
                }
            }
            
            $query->whereNotIn('name', $excludedPermissions)
                  ->whereNotIn('module', $excludedModules);
            
            // Filter settings permissions
            $query->where(function($q) {
                $q->where('module', '!=', 'settings')
                  ->orWhereIn('name', [
                      'manage-email-settings',
                      'manage-system-settings',
                      'manage-brand-settings'
                  ]);
            });
        }
        
        $permissions = $query->get()->groupBy('module');
        
        return $permissions;
    }

    /**
     * Validate permissions against user's allowed modules
     */
    private function validatePermissions(array $permissionNames)
    {
        $user = Auth::user();
        $userType = $user->type ?? 'company';
        
        // Superadmin can assign any permission
        if ($userType === 'superadmin' || $userType === 'super admin') {
            return $permissionNames;
        }
        
        // For regular users (created by company), use more restrictive validation
        if ($userType === 'user') {
            $company = $user->creator;
            if (!$company) {
                return [];
            }
            
            $allowedModules = config('role-permissions.company', []);
            $query = Permission::whereIn('module', $allowedModules)
                ->whereIn('name', $permissionNames);
            
            // More restrictive permissions for regular users
            $excludedPermissions = [
                'reset-password-users',
                'toggle-status-users',
                'manage-any-users',
                'manage-any-roles',
                'manage-plans',
                'manage-any-plans',
                'create-plans',
                'edit-plans',
                'delete-plans',
                'approve-plan-requests',
                'reject-plan-requests',
                'edit-plan-requests',
                'delete-plan-requests',
                'approve-plan-orders',
                'reject-plan-orders',
                'edit-plan-orders',
                'delete-plan-orders',
                'create-plan-orders',
                'manage-any-media',
                'manage-language',
                'edit-language',
                'view-language',
                'create-roles',
                'edit-roles',
                'delete-roles',
                'create-users',
                'edit-users',
                'delete-users',
            ];
            
            $excludedModules = [];
            if ($company->plan) {
                if (($company->plan->enable_blog ?? 'off') === 'off') {
                    $excludedModules[] = 'blog';
                }
                if (($company->plan->enable_custom_pages ?? 'off') === 'off') {
                    $excludedModules[] = 'custom_pages';
                }
                if (($company->plan->enable_shipping_method ?? 'off') === 'off') {
                    $excludedModules[] = 'shipping';
                }
            }
            
            $query->whereNotIn('name', $excludedPermissions)
                  ->whereNotIn('module', $excludedModules);
            
            $query->where(function($q) {
                $q->where('module', '!=', 'settings')
                  ->orWhereIn('name', [
                      'manage-brand-settings'
                  ]);
            });
            
            return $query->pluck('name')->toArray();
        }
        
        // Get allowed modules for company users
        $allowedModules = config('role-permissions.company', []);
        
        // Build query to get valid permissions
        $query = Permission::whereIn('module', $allowedModules)
            ->whereIn('name', $permissionNames);
        
        // For company users, exclude admin-only permissions and disabled plan features
        if ($userType === 'company') {
            // Exclude admin-only permissions that regular users shouldn't have
            $excludedPermissions = [
                // User management admin permissions
                'reset-password-users',
                'toggle-status-users',
                'manage-any-users',
                
                // Role management admin permissions
                'manage-any-roles',
                
                // Plan management admin permissions (only for superadmin)
                'manage-plans',
                'manage-any-plans',
                'create-plans',
                'edit-plans',
                'delete-plans',
                
                // Plan request admin permissions (only for superadmin/company)
                'approve-plan-requests',
                'reject-plan-requests',
                'edit-plan-requests',
                'delete-plan-requests',
                
                // Plan order admin permissions (only for superadmin/company)
                'approve-plan-orders',
                'reject-plan-orders',
                'edit-plan-orders',
                'delete-plan-orders',
                'create-plan-orders',
                
                // Media admin permissions
                'manage-any-media',
                
                // Language management (company-level only)
                'manage-language',
                'edit-language',
                'view-language',
            ];
            
            // Exclude modules based on plan features
            $excludedModules = [];
            if ($user->plan) {
                if (($user->plan->enable_blog ?? 'off') === 'off') {
                    $excludedModules[] = 'blog';
                }
                if (($user->plan->enable_custom_pages ?? 'off') === 'off') {
                    $excludedModules[] = 'custom_pages';
                }
                if (($user->plan->enable_shipping_method ?? 'off') === 'off') {
                    $excludedModules[] = 'shipping';
                }
            }
            
            $query->whereNotIn('name', $excludedPermissions)
                  ->whereNotIn('module', $excludedModules);
            
            // Filter settings permissions
            $query->where(function($q) {
                $q->where('module', '!=', 'settings')
                  ->orWhereIn('name', [
                      'manage-email-settings',
                      'manage-system-settings',
                      'manage-brand-settings'
                  ]);
            });
        }
        
        $validPermissions = $query->pluck('name')->toArray();
        
        return $validPermissions;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        // Validate permissions against user's allowed modules
        $validatedPermissions = $this->validatePermissions($request->permissions ?? []);
        
        $user = Auth::user();
        
        // For regular users, use their company creator's ID
        $createdBy = ($user->type === 'user' && $user->created_by) ? $user->created_by : $user->id;
        
        // Generate unique role name
        $baseName = Str::slug($request->label);
        $roleName = $baseName;
        $counter = 1;
        
        // Check for duplicates and generate unique name
        while (Role::where('name', $roleName)->where('guard_name', 'web')->exists()) {
            $roleName = $baseName . '-' . $counter;
            $counter++;
        }
        
        // Use direct model creation to bypass Spatie's duplicate check
        $role = new Role();
        $role->label = $request->label;
        $role->name = $roleName;
        $role->description = $request->description;
        $role->created_by = $createdBy;
        $role->guard_name = 'web';
        $role->save();

        if ($role) {
            $role->syncPermissions($validatedPermissions);

            return redirect()->route('roles.index')->with('success', __('Role created successfully with Permissions!'));
        }
        return redirect()->back()->with('error', __('Unable to create Role with permissions. Please try again!'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        if ($role) {
            // Validate permissions against user's allowed modules
            $validatedPermissions = $this->validatePermissions($request->permissions ?? []);
            
            $newSlug = Str::slug($request->label);
            
            // Only update name if it's different to avoid duplicate key error
            if ($role->name !== $newSlug) {
                $role->name = $newSlug;
            }
            
            $role->label       = $request->label;
            $role->description = $request->description;

            $role->save();

            # Update the permissions
            $role->syncPermissions($validatedPermissions);

            return redirect()->route('roles.index')->with('success', __('Role updated successfully with Permissions!'));
        }
        return redirect()->back()->with('error', __('Unable to update Role with permissions. Please try again!'));

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        if ($role) {
            // Prevent deletion of system roles
            if ($role->is_system_role) {
                return redirect()->back()->with('error', __('System roles cannot be deleted!'));
            }
            
            $role->delete();

            return redirect()->route('roles.index')->with('success', __('Role deleted successfully!'));
        }
        return redirect()->back()->with('error', __('Unable to delete Role. Please try again!'));
    }
}