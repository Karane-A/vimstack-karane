// Legacy functions for backward compatibility
export const hasRole = (role: string, userRoles: string[] = []) =>
    userRoles.includes(role);

export const hasPermission = (userPermissions: string[], permission: string) =>
    userPermissions.includes(permission);

// Re-export new permission utilities for consistency
export { 
    hasPermission as checkPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole as checkRole,
    hasAnyRole,
    getUserPermissions,
    getUserRoles,
    canPerformCrudOperation,
    filterActionsByPermissions,
    canAccessModule
} from './permissions';