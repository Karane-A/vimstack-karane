import { usePage } from '@inertiajs/react';

/**
 * Check if the current user has a specific permission
 */
export function hasPermission(permission: string): boolean {
  const { auth } = usePage().props as any;
  const permissions = auth?.permissions || [];
  
  // Super admin has all permissions
  if (auth?.user?.type === 'superadmin' || auth?.user?.type === 'super admin') {
    return true;
  }
  
  return permissions.includes(permission);
}

/**
 * Check if the current user has any of the specified permissions
 */
export function hasAnyPermission(permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(permission));
}

/**
 * Check if the current user has all of the specified permissions
 */
export function hasAllPermissions(permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(permission));
}

/**
 * Check if the current user has a specific role
 */
export function hasRole(role: string): boolean {
  const { auth } = usePage().props as any;
  const roles = auth?.roles || [];
  
  return roles.includes(role);
}

/**
 * Check if the current user has any of the specified roles
 */
export function hasAnyRole(roles: string[]): boolean {
  return roles.some(role => hasRole(role));
}

/**
 * Get all permissions for the current user
 */
export function getUserPermissions(): string[] {
  const { auth } = usePage().props as any;
  return auth?.permissions || [];
}

/**
 * Get all roles for the current user
 */
export function getUserRoles(): string[] {
  const { auth } = usePage().props as any;
  return auth?.roles || [];
}

/**
 * Check if user can perform CRUD operations on an entity
 */
export function canPerformCrudOperation(entity: string, operation: 'view' | 'create' | 'edit' | 'delete'): boolean {
  const permissionName = `${operation}-${entity}`;
  return hasPermission(permissionName);
}

/**
 * Filter actions based on user permissions
 */
export function filterActionsByPermissions(actions: any[]): any[] {
  return actions.filter(action => {
    if (!action.requiredPermission) {
      return true;
    }
    
    return hasPermission(action.requiredPermission);
  });
}

/**
 * Check if user can access a specific module
 */
export function canAccessModule(module: string): boolean {
  return hasPermission(`manage-${module}`) || hasPermission(`view-${module}`);
}